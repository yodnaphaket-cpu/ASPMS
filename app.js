try {
const api = window.ASPMS_API;

// Global state variables
let activeFilters = {
  fiscalYear: '2569',
  departmentId: '',
  planType: ''
};
let charts = {};
let activeView = 'view-dashboard';

// ==================== ROUTING SYSTEM ====================
function initRouter() {
  const menuLinks = document.querySelectorAll('.menu-link');
  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = link.getAttribute('data-target');
      
      // Update sidebar active state
      menuLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      
      switchView(targetView);
    });
  });

  // Mobile sidebar toggler
  const sidebar = document.getElementById('app-sidebar');
  const toggleBtn = document.getElementById('btn-toggle-sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
    });
  }

  // Close sidebar on click on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('show');
      }
    }
  });
}

function switchView(viewId) {
  activeView = viewId;
  const views = document.querySelectorAll('.module-view');
  views.forEach(v => v.classList.remove('active'));
  
  const targetEl = document.getElementById(viewId);
  if (targetEl) {
    targetEl.classList.add('active');
  }

  // Update page header title
  const titles = {
    'view-dashboard': 'ระบบบริหารโครงการบริการวิชาการ',
    'view-projects': 'ระบบจัดการโครงการบริการวิชาการ',
    'view-planning': 'การวางแผนและกำหนดการดำเนินโครงการ',
    'view-finance': 'การเงินโครงการ (รายรับ - รายจ่าย)',
    'view-kpi': 'เป้าหมายเปรียบเทียบ KPI',
    'view-reports': 'รายงานผลดำเนินงาน',
    'view-users': 'จัดการผู้ใช้งานระบบ',
    'view-settings': 'ตั้งค่าระบบระเบียนข้อมูล',
    'view-auditlogs': 'ประวัติการเข้าใช้งานและแก้ไขข้อมูล (Audit Log)'
  };
  document.getElementById('header-page-title').innerText = titles[viewId] || 'ASPMS';

  // Load view data
  loadViewData(viewId);
}

// Load data specifically for the active view
function loadViewData(viewId) {
  switch (viewId) {
    case 'view-dashboard':
      loadDashboardView();
      break;
    case 'view-projects':
      loadProjectsView();
      break;
    case 'view-planning':
      loadPlanningView();
      break;
    case 'view-finance':
      loadFinanceView();
      break;
    case 'view-kpi':
      loadKPIView();
      break;
    case 'view-reports':
      loadReportsView();
      break;
    case 'view-users':
      loadUsersView();
      break;
    case 'view-settings':
      loadSettingsView();
      break;
    case 'view-auditlogs':
      loadAuditLogsView();
      break;
  }
}

// ==================== AUTHENTICATION ACTIONS ====================
function initAuth() {
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error-msg');
  
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userVal = document.getElementById('login-username').value.trim();
    const passVal = document.getElementById('login-password').value.trim();
    
    try {
      loginError.style.display = 'none';
      const user = await api.login(userVal, passVal);
      setupAppShell(user);
    } catch (err) {
      loginError.innerText = err.message;
      loginError.style.display = 'block';
    }
  });

  const logoutBtn = document.getElementById('btn-logout');
  logoutBtn.addEventListener('click', async () => {
    await api.logout();
    try {
      sessionStorage.clear();
    } catch (e) {}
    location.reload();
  });
}

function setupAppShell(user) {
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('app-container').style.display = 'flex';
  
  document.getElementById('user-display-name').innerText = user.FullName;
  document.getElementById('user-display-role').innerText = user.Role === 'Assistant Dean' ? 'ผู้ช่วยคณบดี' : (user.Role === 'Dean' ? 'คณบดี' : 'แอดมินสาขาวิชา');
  
  // RBAC Menu visibility
  const adminOnlyElements = document.querySelectorAll('.admin-only');
  if (user.Role === 'Assistant Dean') {
    adminOnlyElements.forEach(el => el.style.display = 'block');
  } else {
    adminOnlyElements.forEach(el => el.style.display = 'none');
  }

  const adminOrDeanOnlyElements = document.querySelectorAll('.admin-or-dean-only');
  if (user.Role === 'Assistant Dean' || user.Role === 'Dean') {
    adminOrDeanOnlyElements.forEach(el => el.style.display = 'block');
  } else {
    adminOrDeanOnlyElements.forEach(el => el.style.display = 'none');
  }

  // Hide/Show Department filter depending on admin department constraints
  const deptFilterContainer = document.querySelector('.dept-filter-container');
  if (user.Role === 'Department Admin') {
    deptFilterContainer.style.display = 'none';
    activeFilters.departmentId = user.DepartmentID;
  } else {
    deptFilterContainer.style.display = 'flex';
    activeFilters.departmentId = '';
  }

  // Load notifications
  loadNotifications();
  setInterval(loadNotifications, 30000); // refresh notifications every 30s

  // Populate filter selectors
  populateFilters();
  
  // Set default view
  switchView('view-dashboard');
}

async function populateFilters() {
  const depts = await api.getDepartments();
  const filterDeptSelect = document.getElementById('filter-department');
  
  // Clear other than first option
  filterDeptSelect.innerHTML = '<option value="">ทั้งหมดทุกสาขา</option>';
  depts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.DepartmentID;
    opt.innerText = d.DepartmentCode + ' - ' + d.DepartmentName;
    filterDeptSelect.appendChild(opt);
  });

  // Populate Add/Edit Project Department list
  const projectDeptSelect = document.getElementById('project-form-dept');
  projectDeptSelect.innerHTML = '<option value="">-- เลือกสาขาวิชา --</option>';
  depts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.DepartmentID;
    opt.innerText = d.DepartmentCode;
    projectDeptSelect.appendChild(opt);
  });

  // Populate Add User Department list
  const userDeptSelect = document.getElementById('user-form-dept');
  userDeptSelect.innerHTML = '<option value="">ส่วนกลาง / ไม่สังกัดสาขา</option>';
  depts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.DepartmentID;
    opt.innerText = d.DepartmentCode;
    userDeptSelect.appendChild(opt);
  });
}

function initFilters() {
  const btnApply = document.getElementById('btn-apply-filters');
  const btnReset = document.getElementById('btn-reset-filters');
  const filterYear = document.getElementById('filter-fiscal-year');
  const filterDept = document.getElementById('filter-department');
  const filterPlanType = document.getElementById('filter-plan-type');
  
  const applyFilter = () => {
    const user = api.getCurrentUser();
    activeFilters.fiscalYear = filterYear.value;
    activeFilters.planType = filterPlanType ? filterPlanType.value : '';
    
    if (user && user.Role !== 'Department Admin') {
      activeFilters.departmentId = filterDept.value;
    }
    
    loadViewData(activeView);
  };

  btnApply.addEventListener('click', applyFilter);
  if (filterYear) filterYear.addEventListener('change', applyFilter);
  if (filterDept) filterDept.addEventListener('change', applyFilter);
  if (filterPlanType) filterPlanType.addEventListener('change', applyFilter);

  btnReset.addEventListener('click', () => {
    const user = api.getCurrentUser();
    if (filterYear) filterYear.value = '2569';
    activeFilters.fiscalYear = '2569';
    if (filterPlanType) filterPlanType.value = '';
    activeFilters.planType = '';
    
    if (user && user.Role !== 'Department Admin') {
      if (filterDept) filterDept.value = '';
      activeFilters.departmentId = '';
    }
    
    loadViewData(activeView);
  });
}

// ==================== DASHBOARD MODULE ====================
async function loadDashboardView() {
  const user = api.getCurrentUser();
  const summary = await api.getFacultyDashboard(activeFilters);

  // Update card counts
  document.getElementById('kpi-total-projects').innerText = summary.TotalProjects;
  document.getElementById('kpi-planned-budget').innerText = '฿' + summary.PlannedBudget.toLocaleString();
  document.getElementById('kpi-total-revenue').innerText = '฿' + summary.Revenue.toLocaleString();
  document.getElementById('kpi-total-expense').innerText = '฿' + summary.Expense.toLocaleString();
  document.getElementById('kpi-total-profit').innerText = '฿' + summary.Profit.toLocaleString();
  document.getElementById('kpi-total-gp').innerText = summary.GPPercent.toFixed(1) + '%';
  if (document.getElementById('kpi-total-csr')) {
    document.getElementById('kpi-total-csr').innerText = '฿' + (summary.CSRExpense || 0).toLocaleString();
  }

  // Sub texts depending on targets
  document.getElementById('kpi-sub-projects').innerText = `เป้าหมาย: ${summary.TargetProjects || 0} โครงการ`;
  document.getElementById('kpi-sub-budget').innerText = `บรรลุเป้าหมาย: ${summary.BudgetAchievement.toFixed(1)}%`;
  document.getElementById('kpi-sub-revenue').innerText = `บรรลุเป้าหมาย: ${summary.RevenueAchievement.toFixed(1)}%`;
  document.getElementById('kpi-sub-profit').innerText = `บรรลุเป้าหมาย: ${summary.ProfitAchievement.toFixed(1)}%`;

  // Status badges
  document.getElementById('status-completed-count').innerText = summary.CompletedProjects;
  document.getElementById('status-running-count').innerText = summary.RunningProjects;
  document.getElementById('status-delayed-count').innerText = summary.DelayedProjects;
  document.getElementById('status-cancelled-count').innerText = summary.CancelledProjects;

  // Render Chart.js
  renderCharts(summary);

  // Load summary table (Faculty level shows departments comparison, Department level shows project details)
  const tblHead = document.querySelector('#dashboard-details-table thead');
  const tblBody = document.querySelector('#dashboard-details-table tbody');

  if (activeFilters.departmentId) {
    // Render Department dashboard specific project details
    document.getElementById('dashboard-table-title').innerText = `ตารางความก้าวหน้าโครงการ สาขาวิชา ${summary.DepartmentSummaries.find(d=>d.DepartmentID===parseInt(activeFilters.departmentId))?.DepartmentCode || ''}`;
    
    // Clear shortcut actions container
    const actContainer = document.getElementById('dashboard-table-actions');
    actContainer.innerHTML = '';

    tblHead.innerHTML = `
      <tr>
        <th>รหัสโครงการ</th>
        <th>ชื่อโครงการ</th>
        <th>ผู้รับผิดชอบ</th>
        <th>งบประมาณแผน</th>
        <th>รายรับสะสม</th>
        <th>รายจ่ายสะสม</th>
        <th>กำไร</th>
        <th>%GP</th>
        <th>สถานะ</th>
      </tr>
    `;

    const deptDash = await api.getDepartmentDashboard(parseInt(activeFilters.departmentId), activeFilters);
    tblBody.innerHTML = '';
    
    if (deptDash.ProjectSummaries.length === 0) {
      tblBody.innerHTML = '<tr><td colspan="9" class="text-center">ไม่พบโครงการของสาขาวิชานี้ในปีงบประมาณนี้</td></tr>';
    } else {
      deptDash.ProjectSummaries.forEach(p => {
        const tr = document.createElement('tr');
        tr.style.cursor = 'pointer';
        tr.onclick = () => showProjectDetails(p.ProjectID);
        tr.innerHTML = `
          <td><strong>${p.ProjectCode}</strong>${p.PlanType === 'นอกแผน' ? ' <span class="badge badge-delayed" style="font-size: 0.65rem; padding: 2px 4px; vertical-align: middle;">นอกแผน</span>' : ''}</td>
          <td>${p.ProjectName}</td>
          <td>${p.ResponsiblePerson}</td>
          <td>฿${p.PlannedBudget.toLocaleString()}</td>
          <td class="text-success">฿${p.Revenue.toLocaleString()}</td>
          <td class="text-danger">฿${p.Expense.toLocaleString()}</td>
          <td class="text-primary">฿${p.Profit.toLocaleString()}</td>
          <td>${p.IsFreeService ? '<span class="badge badge-draft">ให้เปล่า</span>' : p.GPPercent.toFixed(1) + '%'}</td>
          <td><span class="badge badge-${p.Status.toLowerCase().replace(' ', '-')}">${p.Status}</span></td>
        `;
        tblBody.appendChild(tr);
      });
    }
  } else {
    // Render Faculty wide department aggregates
    document.getElementById('dashboard-table-title').innerText = 'ตารางสรุปผลงานวิชาการและการเงินรายสาขาวิชา';
    document.getElementById('dashboard-table-actions').innerHTML = '';

    tblHead.innerHTML = `
      <tr>
        <th>สาขาวิชา</th>
        <th>ชื่อสาขาวิชา</th>
        <th>จำนวนโครงการ</th>
        <th>รายรับรวม (Revenue)</th>
        <th>รายจ่ายรวม (Expense)</th>
        <th>กำไรสะสม (Profit)</th>
        <th>เฉลี่ย %GP</th>
        <th>การจัดการ</th>
      </tr>
    `;

    tblBody.innerHTML = '';
    summary.DepartmentSummaries.forEach(d => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${d.DepartmentCode}</strong></td>
        <td>${d.DepartmentName}</td>
        <td>${d.ProjectCount} โครงการ</td>
        <td class="text-success">฿${d.Revenue.toLocaleString()}</td>
        <td class="text-danger">฿${d.Expense.toLocaleString()}</td>
        <td class="text-primary">฿${d.Profit.toLocaleString()}</td>
        <td>${d.GPPercent.toFixed(1)}%</td>
        <td><button class="btn btn-outline btn-sm" id="btn-drill-${d.DepartmentID}">ดูเจาะลึก</button></td>
      `;
      tblBody.appendChild(tr);

      // Drill down event listener
      document.getElementById(`btn-drill-${d.DepartmentID}`).addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('filter-department').value = d.DepartmentID;
        activeFilters.departmentId = d.DepartmentID;
        loadDashboardView();
      });
    });
  }

  // --- Dashboard Schedule Alerts Calculations ---
  const allProjects = await api.getProjects(activeFilters);
  const now = new Date();
  
  // Strip time for dates comparison
  const todayStr = now.toISOString().split('T')[0];
  const today = new Date(todayStr);

  // Helper: check if date is in current week (Monday to Sunday)
  const currentDay = now.getDay(); // 0: Sunday, 1: Mon, ..., 6: Sat
  // Monday of this week
  const monday = new Date(today);
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
  // Sunday of this week
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  
  const mondayTime = monday.getTime();
  const sundayTime = sunday.getTime();

  // Define groups
  const todayProjects = [];
  const upcomingProjects = [];
  const startWeekProjects = [];
  const endWeekProjects = [];
  const overdueProjects = [];

  allProjects.forEach(p => {
    const start = new Date(p.StartDate);
    const end = new Date(p.EndDate);
    const startTime = start.getTime();
    const endTime = end.getTime();
    const todayTime = today.getTime();

    // 1. Today's Projects: Cover today & status not Cancelled
    if (startTime <= todayTime && endTime >= todayTime && p.ProjectStatus !== 'Cancelled') {
      todayProjects.push(p);
    }
    
    // 2. Upcoming Projects: Start > today & not Cancelled
    if (startTime > todayTime && p.ProjectStatus !== 'Cancelled') {
      upcomingProjects.push(p);
    }

    // 3. Start This Week: Start date falls within current week
    if (startTime >= mondayTime && startTime <= sundayTime && p.ProjectStatus !== 'Cancelled') {
      startWeekProjects.push(p);
    }

    // 4. End This Week: End date falls within current week
    if (endTime >= mondayTime && endTime <= sundayTime && p.ProjectStatus !== 'Cancelled') {
      endWeekProjects.push(p);
    }

    // 5. Overdue Projects: End date < today and status is NOT Completed/Cancelled
    if (endTime < todayTime && p.ProjectStatus !== 'Completed' && p.ProjectStatus !== 'Cancelled') {
      overdueProjects.push(p);
    }
  });

  // Populate Counts
  document.getElementById('alert-val-today').innerText = todayProjects.length;
  document.getElementById('alert-val-upcoming').innerText = upcomingProjects.length;
  document.getElementById('alert-val-startweek').innerText = startWeekProjects.length;
  document.getElementById('alert-val-endweek').innerText = endWeekProjects.length;
  document.getElementById('alert-val-overdue').innerText = overdueProjects.length;

  // Active Type Selection
  let activeAlertTab = 'today';
  const alertCards = document.querySelectorAll('.schedule-alert-card');
  const alertListTitle = document.getElementById('schedule-list-title');
  const alertListBody = document.getElementById('schedule-list-body');

  const renderAlertList = (type) => {
    alertCards.forEach(c => c.classList.remove('active'));
    let selectedProjects = [];
    let titleText = '';

    switch (type) {
      case 'today':
        selectedProjects = todayProjects;
        titleText = 'รายชื่อโครงการ: ดำเนินการวันนี้';
        document.getElementById('alert-card-today').classList.add('active');
        break;
      case 'upcoming':
        selectedProjects = upcomingProjects;
        titleText = 'รายชื่อโครงการ: ใกล้จะเริ่ม (เร็วๆ นี้)';
        document.getElementById('alert-card-upcoming').classList.add('active');
        break;
      case 'start-week':
        selectedProjects = startWeekProjects;
        titleText = 'รายชื่อโครงการ: เริ่มสัปดาห์นี้';
        document.getElementById('alert-card-startweek').classList.add('active');
        break;
      case 'end-week':
        selectedProjects = endWeekProjects;
        titleText = 'รายชื่อโครงการ: สิ้นสุดสัปดาห์นี้';
        document.getElementById('alert-card-endweek').classList.add('active');
        break;
      case 'overdue':
        selectedProjects = overdueProjects;
        titleText = 'รายชื่อโครงการ: ล่าช้า/เกินกำหนดส่ง';
        document.getElementById('alert-card-overdue').classList.add('active');
        break;
    }

    alertListTitle.innerText = titleText;
    alertListBody.innerHTML = '';

    if (selectedProjects.length === 0) {
      alertListBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:15px;">ไม่มีโครงการอยู่ในกลุ่มเวลานี้</td></tr>`;
      return;
    }

    selectedProjects.forEach(p => {
      const tr = document.createElement('tr');
      
      let badgeClass = 'status-draft';
      if (p.ProjectStatus === 'Completed') badgeClass = 'status-completed';
      else if (p.ProjectStatus === 'In Progress') badgeClass = 'status-running';
      else if (p.ProjectStatus === 'Delayed') badgeClass = 'status-delayed';
      else if (p.ProjectStatus === 'Cancelled') badgeClass = 'status-cancelled';
      else if (p.ProjectStatus === 'Planned') badgeClass = 'status-planned';

      tr.innerHTML = `
        <td><strong>${p.ProjectCode}</strong></td>
        <td>${p.ProjectName}</td>
        <td><span class="badge badge-crimson">${p.DepartmentCode}</span></td>
        <td>${p.ResponsiblePerson}</td>
        <td>${p.StartDate} ถึง ${p.EndDate}</td>
        <td><span class="badge ${badgeClass}">${p.ProjectStatus}</span></td>
        <td class="no-print">
          <button class="action-icon-btn btn-view-alert-p" title="ดูรายละเอียดโครงการ">
            <span class="material-icons-round">visibility</span>
          </button>
        </td>
      `;
      tr.querySelector('.btn-view-alert-p').onclick = () => showProjectDetails(p.ProjectID);
      alertListBody.appendChild(tr);
    });
  };

  // Bind clicks to alert cards
  alertCards.forEach(card => {
    card.onclick = () => {
      const type = card.getAttribute('data-type');
      activeAlertTab = type;
      renderAlertList(type);
    };
  });

  // Render initial list (today)
  renderAlertList(activeAlertTab);
}

function renderCharts(summary) {
  // Chart 1: Plan vs Actual
  const pvaCtx = document.getElementById('chart-plan-vs-actual').getContext('2d');
  if (charts.planVsActual) charts.planVsActual.destroy();
  charts.planVsActual = new Chart(pvaCtx, {
    type: 'bar',
    data: {
      labels: ['งบประมาณตามแผน', 'รายรับจริงสะสม (Revenue)', 'กำไรสะสม (Profit)'],
      datasets: [{
        label: 'จำนวนเงิน (บาท)',
        data: [summary.PlannedBudget, summary.Revenue, summary.Profit],
        backgroundColor: ['#8b5cf6', '#10b981', '#047857'], // Purple (งบแผน), Green (รายรับ), Deep Green (กำไร)
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } }
    }
  });

  // Chart 2: Status Doughnut
  const statCtx = document.getElementById('chart-project-status').getContext('2d');
  if (charts.status) charts.status.destroy();
  charts.status = new Chart(statCtx, {
    type: 'doughnut',
    data: {
      labels: ['เสร็จสิ้น', 'กำลังดำเนินการ', 'ล่าช้า', 'ยกเลิก', 'แบบร่าง', 'วางแผน'],
      datasets: [{
        data: [
          summary.StatusCounts.Completed || 0,
          summary.StatusCounts['In Progress'] || 0,
          summary.StatusCounts.Delayed || 0,
          summary.StatusCounts.Cancelled || 0,
          summary.StatusCounts.Draft || 0,
          summary.StatusCounts.Planned || 0
        ],
        backgroundColor: ['#2f855a', '#3182ce', '#dd6b20', '#c53030', '#a0aec0', '#cbd5e1'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { boxWidth: 10, font: { family: 'Sarabun', size: 10 } } }
      }
    }
  });

  // Chart 3: Department Comparison
  const deptCtx = document.getElementById('chart-department-comparison').getContext('2d');
  if (charts.dept) charts.dept.destroy();
  
  const labels = summary.DepartmentSummaries.map(d => d.DepartmentCode);
  const revenues = summary.DepartmentSummaries.map(d => d.Revenue);
  const profits = summary.DepartmentSummaries.map(d => d.Profit);

  charts.dept = new Chart(deptCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'รายรับ (Revenue)',
          data: revenues,
          backgroundColor: '#10b981', // Emerald Green (รายรับ)
          borderRadius: 4
        },
        {
          label: 'กำไร (Profit)',
          data: profits,
          backgroundColor: '#047857', // Deep Emerald Green (กำไร)
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { font: { family: 'Sarabun', size: 11 } } }
      }
    }
  });
}

// ==================== PROJECTS MODULE ====================
async function loadProjectsView() {
  const user = api.getCurrentUser();
  const searchFilter = {
    search: document.getElementById('project-search-query').value,
    status: document.getElementById('project-filter-status').value,
    projectType: document.getElementById('project-filter-type').value,
    fiscalYear: activeFilters.fiscalYear,
    departmentId: activeFilters.departmentId,
    planType: activeFilters.planType
  };

  const list = await api.getProjects(searchFilter);
  const tbody = document.getElementById('projects-table-body');
  tbody.innerHTML = '';

  if (list.length === 0) {
    tbody.innerHTML = '<tr><td colspan="13" class="text-center">ไม่พบโครงการที่ค้นหาในเงื่อนไขดังกล่าว</td></tr>';
    return;
  }

  list.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${p.ProjectCode}</strong>${p.PlanType === 'นอกแผน' ? ' <span class="badge badge-delayed" style="font-size: 0.65rem; padding: 2px 4px; vertical-align: middle;">นอกแผน</span>' : ''}</td>
      <td style="max-width: 250px; font-weight: 500;">${p.ProjectName}</td>
      <td><span class="badge badge-crimson">${p.DepartmentCode}</span></td>
      <td>${p.FiscalYear}</td>
      <td>${p.ResponsiblePerson}</td>
      <td style="font-size: 0.8rem;">
        ${p.StartDate}<br>${p.EndDate}
        ${p.Batches && p.Batches.length > 0 ? `<br><span style="color:var(--primary); font-weight:600;">(${p.Batches.length} รุ่น)</span>` : ''}
      </td>
      <td>฿${p.PlannedBudget.toLocaleString()}</td>
      <td class="text-success">฿${p.Revenue.toLocaleString()}</td>
      <td class="text-danger">฿${p.Expense.toLocaleString()}</td>
      <td class="text-primary">฿${p.Profit.toLocaleString()}</td>
      <td>${p.IsFreeService ? '<span class="badge badge-draft">ให้เปล่า</span>' : p.GPPercent.toFixed(1) + '%'}</td>
      <td><span class="badge badge-${p.ProjectStatus.toLowerCase().replace(' ', '-')}">${p.ProjectStatus}</span></td>
      <td class="no-print">
        <div style="display:flex; gap: 4px;">
          <button class="action-icon-btn" title="ดูรายละเอียดโครงการ" id="btn-view-p-${p.ProjectID}"><span class="material-icons-round">visibility</span></button>
          ${user.Role !== 'Dean' ? `<button class="action-icon-btn" title="แก้ไขโครงการ" id="btn-edit-p-${p.ProjectID}"><span class="material-icons-round">edit</span></button>` : ''}
          ${user.Role === 'Assistant Dean' ? `<button class="action-icon-btn" title="ลบโครงการ" id="btn-delete-p-${p.ProjectID}" style="color:var(--danger); border-color:rgba(239,68,68,0.2); background:rgba(239,68,68,0.05);"><span class="material-icons-round">delete</span></button>` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);

    // Event hooks
    document.getElementById(`btn-view-p-${p.ProjectID}`).addEventListener('click', () => showProjectDetails(p.ProjectID));
    if (user.Role !== 'Dean') {
      document.getElementById(`btn-edit-p-${p.ProjectID}`).addEventListener('click', () => openProjectModal(p));
    }
    if (user.Role === 'Assistant Dean') {
      document.getElementById(`btn-delete-p-${p.ProjectID}`).addEventListener('click', async () => {
        if (confirm(`คุณแน่ใจหรือไม่ที่จะลบโครงการ "${p.ProjectName}" ? \n\nการดำเนินการนี้จะลบธุรกรรมการเงิน (รายรับ/รายจ่าย) เอกสารแนบ และประวัติการดำเนินงานทั้งหมดที่เกี่ยวข้องกับโครงการนี้ออกจากระบบอย่างถาวร!`)) {
          try {
            await api.deleteProject(p.ProjectID);
            showNotification('ลบโครงการและธุรกรรมที่เกี่ยวข้องเรียบร้อยแล้ว', 'success');
            loadProjectsView();
          } catch (err) {
            showNotification(err.message, 'danger');
          }
        }
      });
    }
  });
}

function addBatchRow(name = '', start = '', end = '') {
  const container = document.getElementById('batches-list');
  const div = document.createElement('div');
  div.className = 'batch-row';
  div.style.cssText = 'display: flex; gap: 10px; align-items: center; margin-bottom: 10px;';
  div.innerHTML = `
    <input type="text" class="form-control form-control-sm" name="batch-name" placeholder="เช่น รุ่นที่ 1" value="${name}" style="flex: 1;" required>
    <span style="font-size:0.85rem; color:var(--text-muted); flex-shrink:0;">เริ่ม:</span>
    <input type="date" class="form-control form-control-sm" name="batch-start" value="${start}" required style="width: 135px; flex-shrink:0;">
    <span style="font-size:0.85rem; color:var(--text-muted); flex-shrink:0;">ถึง:</span>
    <input type="date" class="form-control form-control-sm" name="batch-end" value="${end}" required style="width: 135px; flex-shrink:0;">
    <button type="button" class="btn-delete-batch" style="border:none; background:none; color:var(--danger); cursor:pointer; padding: 4px; display: flex; align-items: center; justify-content: center; flex-shrink:0;">
      <span class="material-icons-round" style="font-size: 1.3rem;">delete</span>
    </button>
  `;
  
  div.querySelector('.btn-delete-batch').onclick = () => {
    div.remove();
  };
  
  container.appendChild(div);
}

function openProjectModal(project = null) {
  const user = api.getCurrentUser();
  const form = document.getElementById('project-form');
  form.reset();

  const titleEl = document.getElementById('modal-project-title');
  const statusGroup = document.getElementById('project-form-status-group');
  const deptSelect = document.getElementById('project-form-dept');
  
  // Set department default based on admin role
  if (user.Role === 'Department Admin') {
    deptSelect.value = user.DepartmentID;
    deptSelect.setAttribute('disabled', 'true');
  } else {
    deptSelect.removeAttribute('disabled');
  }

  // Clear and setup batches list
  document.getElementById('batches-list').innerHTML = '';
  document.getElementById('btn-add-batch').onclick = () => addBatchRow();

  // Set radio buttons
  const planType = project ? (project.PlanType || 'ตามแผน') : 'ตามแผน';
  const planTypeRadios = document.getElementsByName('project-form-plan-type');
  planTypeRadios.forEach(radio => {
    if (radio.value === planType) {
      radio.checked = true;
    }
  });

  // Set free service checkbox
  const isFree = project ? !!project.IsFreeService : false;
  document.getElementById('project-form-free-service').checked = isFree;

  if (project) {
    titleEl.innerText = `แก้ไขโครงการ - ${project.ProjectCode}`;
    document.getElementById('project-form-id').value = project.ProjectID;
    document.getElementById('project-form-code').value = project.ProjectCode;
    document.getElementById('project-form-name').value = project.ProjectName;
    document.getElementById('project-form-fy').value = project.FiscalYear;
    deptSelect.value = project.DepartmentID;
    deptSelect.setAttribute('disabled', 'true'); // Department cannot be changed after creation
    document.getElementById('project-form-type').value = project.ProjectType;
    document.getElementById('project-form-customer').value = project.Customer || '';
    document.getElementById('project-form-responsible').value = project.ResponsiblePerson;
    document.getElementById('project-form-start').value = project.StartDate;
    document.getElementById('project-form-end').value = project.EndDate;
    document.getElementById('project-form-budget').value = project.PlannedBudget;
    
    // Status select
    statusGroup.style.display = 'block';
    document.getElementById('project-form-status').value = project.ProjectStatus;

    // Load batches
    if (project.Batches && project.Batches.length > 0) {
      project.Batches.forEach(b => {
        addBatchRow(b.Name, b.StartDate, b.EndDate);
      });
    }
  } else {
    titleEl.innerText = 'เพิ่มโครงการบริการวิชาการใหม่';
    document.getElementById('project-form-id').value = '';
    document.getElementById('project-form-code').value = '';
    statusGroup.style.display = 'none';
  }

  document.getElementById('modal-project').classList.add('show');
}

function initProjectForms() {
  const btnClose = document.getElementById('btn-close-project-modal');
  const btnCancel = document.getElementById('btn-cancel-project-modal');
  const modal = document.getElementById('modal-project');
  const form = document.getElementById('project-form');

  const hideModal = () => {
    modal.classList.remove('show');
    form.reset();
  };

  btnClose.addEventListener('click', hideModal);
  btnCancel.addEventListener('click', hideModal);
  
  // Trigger open project modal
  document.getElementById('btn-add-project-modal').addEventListener('click', () => openProjectModal());

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('project-form-id').value;
    
    // Extract batches
    const batchRows = document.querySelectorAll('#batches-list .batch-row');
    const batches = [];
    batchRows.forEach(row => {
      batches.push({
        Name: row.querySelector('[name="batch-name"]').value,
        StartDate: row.querySelector('[name="batch-start"]').value,
        EndDate: row.querySelector('[name="batch-end"]').value
      });
    });

    // Extract plan type radio value
    let planTypeVal = 'ตามแผน';
    const planTypeRadios = document.getElementsByName('project-form-plan-type');
    planTypeRadios.forEach(radio => {
      if (radio.checked) planTypeVal = radio.value;
    });

    const isFreeVal = document.getElementById('project-form-free-service').checked;

    // Extract form values
    const data = {
      ProjectCode: document.getElementById('project-form-code').value,
      ProjectName: document.getElementById('project-form-name').value,
      FiscalYear: document.getElementById('project-form-fy').value,
      DepartmentID: document.getElementById('project-form-dept').value,
      ProjectType: document.getElementById('project-form-type').value,
      Customer: document.getElementById('project-form-customer').value,
      ResponsiblePerson: document.getElementById('project-form-responsible').value,
      StartDate: document.getElementById('project-form-start').value,
      EndDate: document.getElementById('project-form-end').value,
      PlannedBudget: parseFloat(document.getElementById('project-form-budget').value) || 0,
      PlanType: planTypeVal,
      IsFreeService: isFreeVal,
      Objective: document.getElementById('project-form-objective').value,
      Description: document.getElementById('project-form-desc').value,
      Batches: batches
    };

    try {
      if (id) {
        data.ProjectStatus = document.getElementById('project-form-status').value;
        await api.updateProject(id, data);
      } else {
        await api.createProject(data);
      }
      hideModal();
      loadProjectsView();
    } catch (err) {
      alert(err.message);
    }
  });

  // Export Projects CSV
  document.getElementById('btn-export-projects-csv').addEventListener('click', async () => {
    const list = await api.getProjects({ fiscalYear: activeFilters.fiscalYear, departmentId: activeFilters.departmentId });
    let csv = '\ufeffรหัสโครงการ,ชื่อโครงการ,สาขาวิชา,ปีงบประมาณ,ผู้รับผิดชอบ,วันที่เริ่ม,วันที่สิ้นสุด,งบประมาณตามแผน,รายรับจริง,รายจ่ายจริง,กำไรสะสม,GP%,สถานะ\n';
    
    list.forEach(p => {
      csv += `"${p.ProjectCode}","${p.ProjectName.replace(/"/g, '""')}","${p.DepartmentCode}","${p.FiscalYear}","${p.ResponsiblePerson}","${p.StartDate}","${p.EndDate}",${p.PlannedBudget},${p.Revenue},${p.Expense},${p.Profit},${p.GPPercent.toFixed(1)},"${p.ProjectStatus}"\n`;
    });
    
    triggerCsvDownload(csv, `ASPMS_Projects_${activeFilters.fiscalYear}.csv`);
  });
}

// ==================== PROJECT DETAILS & TAB DRILL DOWNS ====================
async function showProjectDetails(projectId) {
  const user = api.getCurrentUser();
  const detail = await api.getProjectDetails(projectId);
  
  // Set titles
  document.getElementById('detail-project-code').innerText = detail.ProjectCode;
  document.getElementById('detail-project-name').innerText = detail.ProjectName;

  // General tab details
  document.getElementById('det-general-dept').innerText = `${detail.DepartmentCode} - ${detail.DepartmentName}`;
  document.getElementById('det-general-type').innerText = detail.ProjectType;
  document.getElementById('det-general-fy').innerText = detail.FiscalYear;
  document.getElementById('det-general-responsible').innerText = detail.ResponsiblePerson;
  document.getElementById('det-general-dates').innerText = `${detail.StartDate} ถึง ${detail.EndDate}`;
  document.getElementById('det-general-objective').innerText = detail.Objective || 'ไม่ระบุ';
  document.getElementById('det-general-desc').innerText = detail.Description || 'ไม่ระบุ';
  
  const statusBadge = document.getElementById('det-general-status');
  statusBadge.innerText = detail.ProjectStatus;
  statusBadge.className = `badge badge-${detail.ProjectStatus.toLowerCase().replace(' ', '-')}`;

  // Finance summaries
  document.getElementById('det-finance-planned').innerText = '฿' + detail.PlannedBudget.toLocaleString();
  document.getElementById('det-finance-revenue').innerText = '฿' + detail.Revenue.toLocaleString();
  document.getElementById('det-finance-expense').innerText = '฿' + detail.Expense.toLocaleString();
  document.getElementById('det-finance-profit').innerText = '฿' + detail.Profit.toLocaleString();
  document.getElementById('det-finance-gp').innerText = detail.GPPercent.toFixed(1) + '%';

  // Populate batches in detail view
  const batchSection = document.getElementById('detail-general-batches-section');
  const batchBody = document.getElementById('detail-general-batches-body');
  batchBody.innerHTML = '';
  
  if (detail.Batches && detail.Batches.length > 0) {
    detail.Batches.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${b.Name}</strong></td>
        <td>${b.StartDate} ถึง ${b.EndDate}</td>
      `;
      batchBody.appendChild(tr);
    });
    batchSection.style.display = 'block';
  } else {
    batchSection.style.display = 'none';
  }

  // Hide/Show modification forms based on permission
  const managerOnlyElements = document.querySelectorAll('.manager-only');
  if (user.Role === 'Dean') {
    managerOnlyElements.forEach(el => el.style.display = 'none');
  } else {
    managerOnlyElements.forEach(el => el.style.display = 'block');
  }

  // Populate progress history logs
  populateProgressHistory(detail.ProgressList);

  // Set default values for progress form
  document.getElementById('prog-form-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('prog-form-pct').value = detail.Progress;
  document.getElementById('prog-form-status').value = detail.ProjectStatus;
  document.getElementById('progress-log-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
      await api.addProjectProgress({
        ProjectID: projectId,
        ProgressPercentage: document.getElementById('prog-form-pct').value,
        CurrentStatus: document.getElementById('prog-form-status').value,
        CurrentActivity: document.getElementById('prog-form-activity').value,
        Problems: document.getElementById('prog-form-problem').value,
        Solutions: document.getElementById('prog-form-solution').value,
        NextAction: document.getElementById('prog-form-next').value,
        ProgressDate: document.getElementById('prog-form-date').value
      });
      // Refresh modal
      showProjectDetails(projectId);
      loadProjectsView();
    } catch (err) {
      alert(err.message);
    }
  };

  // Populate Finance log tab
  const finTbody = document.getElementById('detail-finance-table-body');
  finTbody.innerHTML = '';
  const revenues = await api.getRevenueTransactions({ projectId: projectId });
  const expenses = await api.getExpenseTransactions({ projectId: projectId });
  
  const allTxs = [
    ...revenues.map(r => ({ ...r, txType: 'Revenue', txTypeThai: 'รายรับ', styleClass: 'text-success' })),
    ...expenses.map(e => ({ ...e, txType: 'Expense', txTypeThai: 'รายจ่าย', styleClass: 'text-danger' }))
  ].sort((a,b) => new Date(b.TransactionDate) - new Date(a.TransactionDate));

  if (allTxs.length === 0) {
    finTbody.innerHTML = '<tr><td colspan="6" class="text-center">ยังไม่มีประวัติการทำธุรกรรมการเงินสำหรับโครงการนี้</td></tr>';
  } else {
    allTxs.forEach(tx => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge ${tx.txType === 'Revenue' ? 'status-completed' : 'status-cancelled'}">${tx.txTypeThai}</span></td>
        <td>${tx.TransactionDate}</td>
        <td>${tx.txType === 'Revenue' ? tx.ReceiptNumber : tx.ExpenseNumber}</td>
        <td>${tx.txType === 'Revenue' ? tx.RevenueType : tx.ExpenseType}</td>
        <td>${tx.Description}</td>
        <td class="${tx.styleClass}"><strong>฿${tx.Amount.toLocaleString()}</strong></td>
      `;
      finTbody.appendChild(tr);
    });
  }

  // Populate Documents list
  populateDocumentsTab(detail.Documents, projectId);

  // Set default tabs activation
  const tabBtns = document.querySelectorAll('.detail-tab-btn');
  const tabContents = document.querySelectorAll('.detail-tab-content');
  tabBtns.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(c => c.classList.remove('active'));
  
  tabBtns[0].classList.add('active');
  document.getElementById('detail-tab-general').classList.add('active');

  // Trigger Open Modal
  document.getElementById('modal-project-detail').classList.add('show');
}

function populateProgressHistory(progressList) {
  const container = document.getElementById('progress-timeline-container');
  container.innerHTML = '';
  
  if (progressList.length === 0) {
    container.innerHTML = '<p style="color:var(--text-muted);">ยังไม่มีประวัติบันทึกความก้าวหน้าโครงการ</p>';
    return;
  }

  const sorted = progressList.sort((a,b) => new Date(b.ProgressDate) - new Date(a.ProgressDate));
  sorted.forEach(p => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-header">
          <h5>ความก้าวหน้า ${p.ProgressPercentage}% (${p.CurrentStatus})</h5>
          <span>บันทึกวันที่: ${p.ProgressDate}</span>
        </div>
        <div class="timeline-body">
          ${p.CurrentActivity ? `<p><strong>กิจกรรม:</strong> ${p.CurrentActivity}</p>` : ''}
          ${p.Problems ? `<p><strong>ปัญหา:</strong> ${p.Problems}</p>` : ''}
          ${p.Solutions ? `<p><strong>แนวทางแก้ไข:</strong> ${p.Solutions}</p>` : ''}
          ${p.NextAction ? `<p><strong>งานขั้นถัดไป:</strong> ${p.NextAction}</p>` : ''}
          ${p.Remark ? `<div class="field-row"><strong>หมายเหตุ:</strong> ${p.Remark}</div>` : ''}
        </div>
      </div>
    `;
    container.appendChild(item);
  });
}

function populateDocumentsTab(docs, projectId) {
  const container = document.getElementById('detail-doc-list-container');
  container.innerHTML = '';

  if (docs.length === 0) {
    container.innerHTML = '<li style="background:transparent; border:none; color:var(--text-muted);">ไม่มีเอกสารแนบในระบบ</li>';
  } else {
    docs.forEach(doc => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="doc-info">
          <span class="material-icons-round">insert_drive_file</span>
          <div class="doc-details">
            <h5>${doc.DocumentName}</h5>
            <span>${doc.FileName} (${(doc.FileSize/1024/1024).toFixed(2)} MB) | โดย: ${doc.UploadedBy}</span>
          </div>
        </div>
        <div style="display:flex; gap: 4px;">
          <a href="#" class="btn btn-outline btn-sm" onclick="alert('ดาวน์โหลดไฟล์จำลอง: ${doc.FileName}')">ดาวน์โหลด</a>
          ${api.getCurrentUser().Role !== 'Dean' ? `<button class="action-icon-btn text-danger" id="btn-del-doc-${doc.DocumentID}"><span class="material-icons-round">delete</span></button>` : ''}
        </div>
      `;
      container.appendChild(li);

      if (api.getCurrentUser().Role !== 'Dean') {
        document.getElementById(`btn-del-doc-${doc.DocumentID}`).onclick = async (e) => {
          e.preventDefault();
          if (confirm('คุณต้องการลบเอกสารประกอบนี้ใช่หรือไม่?')) {
            await api.deleteDocument(doc.DocumentID);
            const freshDetail = await api.getProjectDetails(projectId);
            populateDocumentsTab(freshDetail.Documents, projectId);
          }
        };
      }
    });
  }

  // Bind upload form submit
  const uploadForm = document.getElementById('doc-upload-form');
  uploadForm.onsubmit = async (e) => {
    e.preventDefault();
    const docName = document.getElementById('doc-form-name').value;
    const fileType = document.getElementById('doc-form-type').value;
    const fileName = document.getElementById('doc-form-file').value;
    
    try {
      await api.uploadDocument(projectId, docName, fileType, fileName, 1024 * 1024 * 1.5);
      uploadForm.reset();
      const freshDetail = await api.getProjectDetails(projectId);
      populateDocumentsTab(freshDetail.Documents, projectId);
    } catch (err) {
      alert(err.message);
    }
  };
}

function initDetailModal() {
  const detailModal = document.getElementById('modal-project-detail');
  
  const hideDetailModal = () => {
    detailModal.classList.remove('show');
  };

  document.getElementById('btn-close-detail-modal').addEventListener('click', hideDetailModal);
  document.getElementById('btn-close-detail-modal-footer').addEventListener('click', hideDetailModal);

  // Bind inside tab routing for detail modal
  const tabBtns = document.querySelectorAll('.detail-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const targetTab = btn.getAttribute('data-detail-tab');
      const contents = document.querySelectorAll('.detail-tab-content');
      contents.forEach(c => c.classList.remove('active'));
      document.getElementById(targetTab).classList.add('active');
    });
  });
}

// ==================== FINANCE MODULE ====================
async function loadFinanceView() {
  const user = api.getCurrentUser();
  const filters = {
    fiscalYear: activeFilters.fiscalYear,
    departmentId: activeFilters.departmentId
  };

  const revenues = await api.getRevenueTransactions(filters);
  const expenses = await api.getExpenseTransactions(filters);

  // Populate Revenue Tbody
  const revBody = document.getElementById('table-revenue-body');
  revBody.innerHTML = '';
  if (revenues.length === 0) {
    revBody.innerHTML = '<tr><td colspan="8" class="text-center">ไม่พบข้อมูลรายรับในปีงบประมาณนี้</td></tr>';
  } else {
    revenues.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${r.TransactionDate}</td>
        <td><strong>${r.ReceiptNumber}</strong></td>
        <td><a href="#" style="text-decoration:underline; font-weight:600;" id="lnk-fin-p-${r.ProjectID}">${r.ProjectCode}</a></td>
        <td>${r.RevenueType}</td>
        <td>${r.Description}</td>
        <td class="text-success"><strong>฿${r.Amount.toLocaleString()}</strong></td>
        <td>${r.CreatedBy === 3 ? 'ดร.ภาคภูมิ' : 'แอดมินระบบ'}</td>
        <td class="no-print">
          <div style="display:flex; gap: 4px;">
            ${user.Role !== 'Dean' ? `
              <button class="action-icon-btn" title="แก้ไขรายรับ" id="btn-edit-rev-${r.RevenueID}"><span class="material-icons-round">edit</span></button>
              <button class="action-icon-btn text-danger" title="ลบรายรับ" id="btn-del-rev-${r.RevenueID}"><span class="material-icons-round">delete</span></button>
            ` : ''}
          </div>
        </td>
      `;
      revBody.appendChild(tr);

      document.getElementById(`lnk-fin-p-${r.ProjectID}`).onclick = (e) => {
        e.preventDefault();
        showProjectDetails(r.ProjectID);
      };

      if (user.Role !== 'Dean') {
        document.getElementById(`btn-edit-rev-${r.RevenueID}`).onclick = () => {
          window.openRevenueModal(r);
        };
        document.getElementById(`btn-del-rev-${r.RevenueID}`).onclick = async () => {
          if (confirm('คุณแน่ใจว่าต้องการลบรายการรายรับนี้?')) {
            await api.deleteRevenueTransaction(r.RevenueID);
            loadFinanceView();
          }
        };
      }
    });
  }

  // Populate Expense Tbody
  const expBody = document.getElementById('table-expense-body');
  expBody.innerHTML = '';
  if (expenses.length === 0) {
    expBody.innerHTML = '<tr><td colspan="8" class="text-center">ไม่พบข้อมูลรายจ่ายในปีงบประมาณนี้</td></tr>';
  } else {
    expenses.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${e.TransactionDate}</td>
        <td><strong>${e.ExpenseNumber}</strong></td>
        <td><a href="#" style="text-decoration:underline; font-weight:600;" id="lnk-exp-p-${e.ProjectID}">${e.ProjectCode}</a></td>
        <td>${e.ExpenseType}</td>
        <td>${e.Description}</td>
        <td class="text-danger"><strong>฿${e.Amount.toLocaleString()}</strong></td>
        <td>${e.CreatedBy === 3 ? 'ดร.ภาคภูมิ' : 'แอดมินระบบ'}</td>
        <td class="no-print">
          <div style="display:flex; gap: 4px;">
            ${user.Role !== 'Dean' ? `
              <button class="action-icon-btn" title="แก้ไขรายจ่าย" id="btn-edit-exp-${e.ExpenseID}"><span class="material-icons-round">edit</span></button>
              <button class="action-icon-btn text-danger" title="ลบรายจ่าย" id="btn-del-exp-${e.ExpenseID}"><span class="material-icons-round">delete</span></button>
            ` : ''}
          </div>
        </td>
      `;
      expBody.appendChild(tr);

      document.getElementById(`lnk-exp-p-${e.ProjectID}`).onclick = (evt) => {
        evt.preventDefault();
        showProjectDetails(e.ProjectID);
      };

      if (user.Role !== 'Dean') {
        document.getElementById(`btn-edit-exp-${e.ExpenseID}`).onclick = () => {
          window.openExpenseModal(e);
        };
        document.getElementById(`btn-del-exp-${e.ExpenseID}`).onclick = async () => {
          if (confirm('คุณต้องการลบรายการรายจ่ายนี้ใช่หรือไม่?')) {
            await api.deleteExpenseTransaction(e.ExpenseID);
            loadFinanceView();
          }
        };
      }
    });
  }

  // Populate transaction select option lists
  const activeProjects = await api.getProjects({ fiscalYear: activeFilters.fiscalYear, departmentId: activeFilters.departmentId });
  
  const revProjSelect = document.getElementById('revenue-form-project');
  const expProjSelect = document.getElementById('expense-form-project');
  
  revProjSelect.innerHTML = '<option value="">-- เลือกโครงการเป้าหมาย --</option>';
  expProjSelect.innerHTML = '<option value="">-- เลือกโครงการเป้าหมาย --</option>';
  
  activeProjects.forEach(p => {
    if (!p.IsFreeService) {
      const opt1 = document.createElement('option');
      opt1.value = p.ProjectID;
      opt1.innerText = `${p.ProjectCode} - ${p.ProjectName}`;
      revProjSelect.appendChild(opt1);
    }

    const opt2 = document.createElement('option');
    opt2.value = p.ProjectID;
    opt2.innerText = `${p.ProjectCode} - ${p.ProjectName}`;
    expProjSelect.appendChild(opt2);
  });
}

function initFinanceModals() {
  const revModal = document.getElementById('modal-revenue');
  const expModal = document.getElementById('modal-expense');
  
  const closeRev = () => {
    revModal.classList.remove('show');
    document.getElementById('revenue-form').reset();
  };
  const closeExp = () => {
    expModal.classList.remove('show');
    document.getElementById('expense-form').reset();
  };

  // Open buttons for ADD
  document.getElementById('btn-add-revenue-modal').onclick = () => {
    document.getElementById('revenue-form-id').value = '';
    document.getElementById('revenue-form-project').removeAttribute('disabled');
    document.getElementById('revenue-form-project').value = '';
    document.getElementById('revenue-form-date').value = new Date().toISOString().split('T')[0];
    revModal.querySelector('h3').innerText = 'บันทึกรายการรายรับโครงการ (Revenue)';
    revModal.classList.add('show');
  };
  document.getElementById('btn-add-expense-modal').onclick = () => {
    document.getElementById('expense-form-id').value = '';
    document.getElementById('expense-form-project').removeAttribute('disabled');
    document.getElementById('expense-form-project').value = '';
    document.getElementById('expense-form-date').value = new Date().toISOString().split('T')[0];
    expModal.querySelector('h3').innerText = 'บันทึกรายการรายจ่ายโครงการ (Expense)';
    expModal.classList.add('show');
  };

  // Global hooks for EDIT
  window.openRevenueModal = (rev) => {
    document.getElementById('revenue-form-id').value = rev.RevenueID;
    document.getElementById('revenue-form-project').value = rev.ProjectID;
    document.getElementById('revenue-form-project').setAttribute('disabled', 'true');
    document.getElementById('revenue-form-date').value = rev.TransactionDate;
    document.getElementById('revenue-form-receipt').value = rev.ReceiptNumber;
    document.getElementById('revenue-form-type').value = rev.RevenueType;
    document.getElementById('revenue-form-amount').value = rev.Amount;
    document.getElementById('revenue-form-desc').value = rev.Description || '';
    document.getElementById('revenue-form-remark').value = rev.Remark || '';
    revModal.querySelector('h3').innerText = 'แก้ไขรายการรายรับโครงการ (Revenue)';
    revModal.classList.add('show');
  };

  window.openExpenseModal = (exp) => {
    document.getElementById('expense-form-id').value = exp.ExpenseID;
    document.getElementById('expense-form-project').value = exp.ProjectID;
    document.getElementById('expense-form-project').setAttribute('disabled', 'true');
    document.getElementById('expense-form-date').value = exp.TransactionDate;
    document.getElementById('expense-form-number').value = exp.ExpenseNumber;
    document.getElementById('expense-form-type').value = exp.ExpenseType;
    document.getElementById('expense-form-amount').value = exp.Amount;
    document.getElementById('expense-form-desc').value = exp.Description || '';
    document.getElementById('expense-form-remark').value = exp.Remark || '';
    expModal.querySelector('h3').innerText = 'แก้ไขรายการรายจ่ายโครงการ (Expense)';
    expModal.classList.add('show');
  };

  // Close buttons
  document.getElementById('btn-close-revenue-modal').onclick = closeRev;
  document.getElementById('btn-cancel-revenue-modal').onclick = closeRev;
  document.getElementById('btn-close-expense-modal').onclick = closeExp;
  document.getElementById('btn-cancel-expense-modal').onclick = closeExp;

  // Form submits
  document.getElementById('revenue-form').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('revenue-form-id').value;
    const data = {
      ProjectID: document.getElementById('revenue-form-project').value,
      TransactionDate: document.getElementById('revenue-form-date').value,
      ReceiptNumber: document.getElementById('revenue-form-receipt').value,
      RevenueType: document.getElementById('revenue-form-type').value,
      Amount: document.getElementById('revenue-form-amount').value,
      Description: document.getElementById('revenue-form-desc').value,
      Remark: document.getElementById('revenue-form-remark').value
    };
    try {
      if (id) {
        await api.editRevenueTransaction(id, data);
      } else {
        await api.addRevenueTransaction(data);
      }
      closeRev();
      loadFinanceView();
    } catch (err) {
      alert(err.message);
    }
  };

  document.getElementById('expense-form').onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('expense-form-id').value;
    const data = {
      ProjectID: document.getElementById('expense-form-project').value,
      TransactionDate: document.getElementById('expense-form-date').value,
      ExpenseNumber: document.getElementById('expense-form-number').value,
      ExpenseType: document.getElementById('expense-form-type').value,
      Amount: document.getElementById('expense-form-amount').value,
      Description: document.getElementById('expense-form-desc').value,
      Remark: document.getElementById('expense-form-remark').value
    };
    try {
      if (id) {
        await api.editExpenseTransaction(id, data);
      } else {
        await api.addExpenseTransaction(data);
      }
      closeExp();
      loadFinanceView();
    } catch (err) {
      alert(err.message);
    }
  };

  // Tab switcher for ledger list
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const tabId = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Export CSV triggers
  document.getElementById('btn-export-revenue-csv').onclick = async () => {
    const list = await api.getRevenueTransactions({ fiscalYear: activeFilters.fiscalYear, departmentId: activeFilters.departmentId });
    let csv = '\ufeffวันที่,เลขที่ใบเสร็จ,รหัสโครงการ,ชื่อโครงการ,ประเภทรายรับ,คำอธิบาย,จำนวนเงิน\n';
    list.forEach(r => {
      csv += `${r.TransactionDate},"${r.ReceiptNumber}","${r.ProjectCode}","${r.ProjectName.replace(/"/g, '""')}","${r.RevenueType}","${r.Description.replace(/"/g, '""')}",${r.Amount}\n`;
    });
    triggerCsvDownload(csv, `Revenue_Transactions_${activeFilters.fiscalYear}.csv`);
  };

  document.getElementById('btn-export-expense-csv').onclick = async () => {
    const list = await api.getExpenseTransactions({ fiscalYear: activeFilters.fiscalYear, departmentId: activeFilters.departmentId });
    let csv = '\ufeffวันที่,เลขที่ใบอนุมัติจ่าย,รหัสโครงการ,ชื่อโครงการ,หมวดหมู่รายจ่าย,คำอธิบาย,จำนวนเงิน\n';
    list.forEach(e => {
      csv += `${e.TransactionDate},"${e.ExpenseNumber}","${e.ProjectCode}","${e.ProjectName.replace(/"/g, '""')}","${e.ExpenseType}","${e.Description.replace(/"/g, '""')}",${e.Amount}\n`;
    });
    triggerCsvDownload(csv, `Expense_Transactions_${activeFilters.fiscalYear}.csv`);
  };
}

// ==================== KPI & ACHIEVEMENT SUMMARY ====================
async function loadKPIView() {
  const list = await api.getKPITargets(activeFilters.fiscalYear);
  const projects = await api.getProjects({ fiscalYear: activeFilters.fiscalYear });
  
  const tbody = document.getElementById('kpi-targets-body');
  tbody.innerHTML = '';

  document.getElementById('kpi-table-title').innerText = `ตารางวิเคราะห์เป้าหมายเทียบแผนงานจริง ประจำปีงบประมาณ ${activeFilters.fiscalYear}`;

  // Filter KPI targets by selected department if any
  let filteredList = list;
  if (activeFilters.departmentId) {
    filteredList = list.filter(t => t.DepartmentID === parseInt(activeFilters.departmentId));
  }

  filteredList.forEach(t => {
    // Calculate actual details from database
    const deptProjects = projects.filter(p => p.DepartmentID === t.DepartmentID);
    const actualProjectsCount = deptProjects.length;
    const actualBudget = deptProjects.reduce((sum, p) => sum + p.PlannedBudget, 0);
    const actualRevenue = deptProjects.reduce((sum, p) => sum + p.Revenue, 0);
    const actualProfit = deptProjects.reduce((sum, p) => sum + p.Profit, 0);

    // Compute achievements percentage
    const countPct = t.TargetProjects > 0 ? (actualProjectsCount / t.TargetProjects) * 100 : 0;
    const revPct = t.TargetRevenue > 0 ? (actualRevenue / t.TargetRevenue) * 100 : 0;
    const avgPct = (countPct + revPct) / 2;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${t.DepartmentCode}</strong> - ${t.DepartmentName}</td>
      <td>${t.TargetProjects} โครงการ</td>
      <td><strong>${actualProjectsCount}</strong> โครงการ</td>
      <td>฿${t.TargetBudget.toLocaleString()}</td>
      <td>฿${actualBudget.toLocaleString()}</td>
      <td>฿${t.TargetRevenue.toLocaleString()}</td>
      <td><strong>฿${actualRevenue.toLocaleString()}</strong></td>
      <td>฿${t.TargetProfit.toLocaleString()}</td>
      <td class="text-primary"><strong>฿${actualProfit.toLocaleString()}</strong></td>
      <td>
        <span class="badge ${avgPct >= 100 ? 'status-completed' : (avgPct >= 50 ? 'status-running' : 'status-delayed')}">
          ${avgPct.toFixed(1)}%
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Handle department-specific projects list
  const kpiProjectsCard = document.getElementById('kpi-projects-card');
  const kpiProjectsBody = document.getElementById('kpi-projects-body');
  const kpiProjectsTitle = document.getElementById('kpi-projects-title');

  if (activeFilters.departmentId) {
    const deptId = parseInt(activeFilters.departmentId);
    const dept = list.find(d => d.DepartmentID === deptId);
    const deptCode = dept ? dept.DepartmentCode : '';
    
    kpiProjectsTitle.innerText = `รายชื่อโครงการบริการวิชาการของสาขาวิชา ${deptCode}`;
    kpiProjectsBody.innerHTML = '';
    
    const deptProjects = projects.filter(p => p.DepartmentID === deptId);
    
    if (deptProjects.length === 0) {
      kpiProjectsBody.innerHTML = `<tr><td colspan="10" class="text-center text-muted" style="padding: 20px;">ไม่พบข้อมูลโครงการสำหรับสาขาวิชานี้</td></tr>`;
    } else {
      deptProjects.forEach(p => {
        const gpRate = p.Revenue > 0 ? (p.Profit / p.Revenue) * 100 : 0;
        const tr = document.createElement('tr');
        
        let statusBadge = 'status-draft';
        if (p.ProjectStatus === 'Completed') statusBadge = 'status-completed';
        else if (p.ProjectStatus === 'In Progress') statusBadge = 'status-running';
        else if (p.ProjectStatus === 'Delayed') statusBadge = 'status-delayed';
        else if (p.ProjectStatus === 'Cancelled') statusBadge = 'status-cancelled';
        else if (p.ProjectStatus === 'Planned') statusBadge = 'status-planned';

        tr.innerHTML = `
          <td><strong>${p.ProjectCode || '-'}</strong></td>
          <td>${p.ProjectName}</td>
          <td>${p.ResponsiblePerson || '-'}</td>
          <td>฿${p.PlannedBudget.toLocaleString()}</td>
          <td>฿${p.Revenue.toLocaleString()}</td>
          <td>฿${p.Expense.toLocaleString()}</td>
          <td class="text-primary"><strong>฿${p.Profit.toLocaleString()}</strong></td>
          <td>${gpRate.toFixed(1)}%</td>
          <td><span class="badge ${statusBadge}">${p.ProjectStatus}</span></td>
          <td class="no-print">
            <button class="action-icon-btn btn-view-kpi-p" title="ดูรายละเอียดโครงการ">
              <span class="material-icons-round">visibility</span>
            </button>
          </td>
        `;
        tr.querySelector('.btn-view-kpi-p').onclick = () => showProjectDetails(p.ProjectID);
        kpiProjectsBody.appendChild(tr);
      });
    }
    kpiProjectsCard.style.display = 'block';
  } else {
    kpiProjectsCard.style.display = 'none';
  }
}

function initKPIModal() {
  const modal = document.getElementById('modal-kpi-targets');
  const tbody = document.getElementById('kpi-edit-form-body');

  document.getElementById('btn-edit-kpi-targets').onclick = async () => {
    const list = await api.getKPITargets(activeFilters.fiscalYear);
    tbody.innerHTML = '';
    
    let filteredList = list;
    if (activeFilters.departmentId) {
      filteredList = list.filter(t => t.DepartmentID === parseInt(activeFilters.departmentId));
    }

    filteredList.forEach(t => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${t.DepartmentCode}</strong><input type="hidden" name="dept-id" value="${t.DepartmentID}"></td>
        <td><input type="number" class="form-control form-control-sm" name="target-projects" value="${t.TargetProjects}" style="width: 80px;" required min="0"></td>
        <td><input type="number" class="form-control form-control-sm" name="target-budget" value="${t.TargetBudget}" style="width: 140px;" required min="0"></td>
        <td><input type="number" class="form-control form-control-sm" name="target-revenue" value="${t.TargetRevenue}" style="width: 140px;" required min="0"></td>
        <td><input type="number" class="form-control form-control-sm" name="target-expense" value="${t.TargetExpense}" style="width: 140px;" required min="0"></td>
        <td><input type="number" class="form-control form-control-sm" name="target-profit" value="${t.TargetProfit}" style="width: 140px;" required min="0"></td>
      `;
      tbody.appendChild(tr);

      // Auto-calculate profit: Revenue - Expense
      const revInput = tr.querySelector('[name="target-revenue"]');
      const expInput = tr.querySelector('[name="target-expense"]');
      const profitInput = tr.querySelector('[name="target-profit"]');

      const updateProfit = () => {
        const rev = parseFloat(revInput.value) || 0;
        const exp = parseFloat(expInput.value) || 0;
        profitInput.value = rev - exp;
      };

      revInput.addEventListener('input', updateProfit);
      expInput.addEventListener('input', updateProfit);
    });

    modal.classList.add('show');
  };

  const closeKPI = () => modal.classList.remove('show');
  document.getElementById('btn-close-kpi-modal').onclick = closeKPI;
  document.getElementById('btn-cancel-kpi-modal').onclick = closeKPI;

  document.getElementById('kpi-targets-form').onsubmit = async (e) => {
    e.preventDefault();
    const rows = tbody.querySelectorAll('tr');
    const updatePayload = [];

    rows.forEach(row => {
      updatePayload.push({
        DepartmentID: row.querySelector('[name="dept-id"]').value,
        TargetProjects: row.querySelector('[name="target-projects"]').value,
        TargetBudget: row.querySelector('[name="target-budget"]').value,
        TargetRevenue: row.querySelector('[name="target-revenue"]').value,
        TargetExpense: row.querySelector('[name="target-expense"]').value,
        TargetProfit: row.querySelector('[name="target-profit"]').value,
      });
    });

    try {
      await api.saveKPITargets(activeFilters.fiscalYear, updatePayload);
      closeKPI();
      loadKPIView();
    } catch (err) {
      alert(err.message);
    }
  };
}

// ==================== PLANNING & SCHEDULE MODULE ====================
let planningActiveTab = 'gantt';
let planningGanttScale = 'monthly';
let planningZoomLevel = 1.0;
let planningCalendarMode = 'month';
let planningCalendarDate = new Date();
let singleProjectGantt = null;
let planningInitialized = false;

async function updatePlanningResponsibleDropdown() {
  const user = api.getCurrentUser();
  const deptSelect = document.getElementById('planning-filter-dept');
  const respSelect = document.getElementById('planning-filter-responsible');
  if (!deptSelect || !respSelect) return;

  const activeDeptVal = deptSelect.value;
  const filterParams = { fiscalYear: activeFilters.fiscalYear };
  if (user.Role === 'Department Admin') {
    filterParams.departmentId = user.DepartmentID;
  } else if (activeDeptVal) {
    filterParams.departmentId = parseInt(activeDeptVal);
  }
  
  const projectsList = await api.getProjects(filterParams);
  let filteredProjs = projectsList;
  if (filterParams.departmentId) {
    filteredProjs = projectsList.filter(p => p.DepartmentID === filterParams.departmentId);
  }

  const uniqueResps = [...new Set(filteredProjs.map(p => p.ResponsiblePerson).filter(Boolean))];
  const prevVal = respSelect.value;
  respSelect.innerHTML = '<option value="">-- ทั้งหมด --</option>';
  uniqueResps.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r;
    opt.innerText = r;
    respSelect.appendChild(opt);
  });
  if (uniqueResps.includes(prevVal)) {
    respSelect.value = prevVal;
  }
}

async function loadPlanningView() {
  const user = api.getCurrentUser();
  
  // Set default calendar date to June of the active fiscal year if not initialized
  const startYear = parseInt(activeFilters.fiscalYear) - 543;
  if (!planningInitialized) {
    planningCalendarDate = new Date(startYear, 5, 1); // 1st June
    planningInitialized = true;
    initPlanningControls();
  }

  // Populate planning filters
  const deptSelect = document.getElementById('planning-filter-dept');
  const respSelect = document.getElementById('planning-filter-responsible');
  
  // Populating departments select
  const depts = await api.getDepartments();
  deptSelect.innerHTML = '<option value="">-- ทั้งหมดทุกสาขา --</option>';
  depts.forEach(d => {
    const opt = document.createElement('option');
    opt.value = d.DepartmentID;
    opt.innerText = `${d.DepartmentCode} - ${d.DepartmentName}`;
    deptSelect.appendChild(opt);
  });
  
  // Handle role restrictions on filters
  if (user.Role === 'Department Admin') {
    deptSelect.value = user.DepartmentID;
    deptSelect.setAttribute('disabled', 'true');
  } else {
    deptSelect.removeAttribute('disabled');
    // If global filter has department, sync it
    if (activeFilters.departmentId) {
      deptSelect.value = activeFilters.departmentId;
    }
  }

  // Populate responsible persons
  await updatePlanningResponsibleDropdown();

  // Render active view tab
  if (planningActiveTab === 'gantt') {
    document.getElementById('planning-gantt-panel').style.display = 'block';
    document.getElementById('planning-calendar-panel').style.display = 'none';
    document.getElementById('gantt-scale-controls').style.display = 'flex';
    document.getElementById('calendar-mode-controls').style.display = 'none';
    renderGanttChart();
  } else {
    document.getElementById('planning-gantt-panel').style.display = 'none';
    document.getElementById('planning-calendar-panel').style.display = 'block';
    document.getElementById('gantt-scale-controls').style.display = 'none';
    document.getElementById('calendar-mode-controls').style.display = 'flex';
    renderCalendar();
  }
}

function initPlanningControls() {
  // Tabs
  document.getElementById('btn-tab-gantt').onclick = (e) => {
    document.getElementById('btn-tab-gantt').classList.add('active');
    document.getElementById('btn-tab-calendar').classList.remove('active');
    planningActiveTab = 'gantt';
    loadPlanningView();
  };
  document.getElementById('btn-tab-calendar').onclick = (e) => {
    document.getElementById('btn-tab-gantt').classList.remove('active');
    document.getElementById('btn-tab-calendar').classList.add('active');
    planningActiveTab = 'calendar';
    loadPlanningView();
  };

  // Scale dropdown
  document.getElementById('planning-gantt-scale').onchange = (e) => {
    planningGanttScale = e.target.value;
    renderGanttChart();
  };

  // Zoom
  document.getElementById('btn-gantt-zoom-in').onclick = () => {
    planningZoomLevel = Math.min(2.5, planningZoomLevel + 0.2);
    renderGanttChart();
  };
  document.getElementById('btn-gantt-zoom-out').onclick = () => {
    planningZoomLevel = Math.max(0.5, planningZoomLevel - 0.2);
    renderGanttChart();
  };

  // Calendar Mode Buttons
  const modeBtns = document.querySelectorAll('.calendar-mode-btn');
  modeBtns.forEach(btn => {
    btn.onclick = () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      planningCalendarMode = btn.getAttribute('data-mode');
      renderCalendar();
    };
  });

  // Calendar Navigation
  document.getElementById('btn-calendar-prev').onclick = () => {
    adjustCalendarDate(-1);
  };
  document.getElementById('btn-calendar-next').onclick = () => {
    adjustCalendarDate(1);
  };

  // Back button for Gantt Single Project
  document.getElementById('btn-gantt-back-all').onclick = () => {
    singleProjectGantt = null;
    document.getElementById('gantt-single-project-back').style.display = 'none';
    renderGanttChart();
  };

  // Dynamic Filters
  document.getElementById('planning-filter-dept').onchange = async () => {
    await updatePlanningResponsibleDropdown();
    renderActivePlanningView();
  };
  document.getElementById('planning-filter-status').onchange = () => renderActivePlanningView();
  document.getElementById('planning-filter-responsible').onchange = () => renderActivePlanningView();
  document.getElementById('planning-search').oninput = () => renderActivePlanningView();

  // Print & Export
  document.getElementById('btn-print-planning').onclick = () => window.print();
  
  document.getElementById('btn-export-planning-pdf').onclick = () => {
    window.print();
  };

  document.getElementById('btn-export-planning-excel').onclick = async () => {
    // Generate CSV export for schedules
    const filter = getPlanningFilters();
    let projects = await api.getProjects(filter);
    
    // Apply client filters same as Gantt rendering
    if (filter.departmentId) {
      projects = projects.filter(p => p.DepartmentID === filter.departmentId);
    }
    if (filter.status) {
      projects = projects.filter(p => p.ProjectStatus === filter.status);
    }
    if (filter.responsible) {
      projects = projects.filter(p => p.ResponsiblePerson === filter.responsible);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      projects = projects.filter(p => p.ProjectCode.toLowerCase().includes(q) || p.ProjectName.toLowerCase().includes(q));
    }
    
    let csv = '\ufeffรหัสโครงการ,ชื่อโครงการ,สาขาวิชา,ผู้รับผิดชอบ,วันที่เริ่มต้น,วันที่สิ้นสุด,ความก้าวหน้า,สถานะ\n';
    projects.forEach(p => {
      csv += `"${p.ProjectCode}","${p.ProjectName}","${p.DepartmentCode}","${p.ResponsiblePerson}","${p.StartDate}","${p.EndDate}",${p.Progress}%,"${p.ProjectStatus}"\n`;
      if (p.Batches && p.Batches.length > 0) {
        p.Batches.forEach(b => {
          csv += `,"-- [รุ่นย่อย] ${b.Name}",,,${b.StartDate},${b.EndDate},,\n`;
        });
      }
    });
    
    triggerCsvDownload(csv, `Planning_Schedule_${activeFilters.fiscalYear}.csv`);
  };
}

function getPlanningFilters() {
  const deptVal = document.getElementById('planning-filter-dept').value;
  return {
    fiscalYear: activeFilters.fiscalYear,
    planType: activeFilters.planType,
    departmentId: deptVal ? parseInt(deptVal) : '',
    status: document.getElementById('planning-filter-status').value,
    responsible: document.getElementById('planning-filter-responsible').value,
    search: document.getElementById('planning-search').value
  };
}

function renderActivePlanningView() {
  if (planningActiveTab === 'gantt') {
    renderGanttChart();
  } else {
    renderCalendar();
  }
}

function adjustCalendarDate(direction) {
  if (planningCalendarMode === 'year') {
    const fy = parseInt(activeFilters.fiscalYear) + direction;
    if (fy >= 2569 && fy <= 2570) {
      activeFilters.fiscalYear = fy.toString();
      document.getElementById('filter-fiscalyear').value = activeFilters.fiscalYear;
      loadPlanningView();
    }
  } else if (planningCalendarMode === 'month') {
    planningCalendarDate.setMonth(planningCalendarDate.getMonth() + direction);
    renderCalendar();
  } else if (planningCalendarMode === 'week') {
    planningCalendarDate.setDate(planningCalendarDate.getDate() + (direction * 7));
    renderCalendar();
  } else if (planningCalendarMode === 'day') {
    planningCalendarDate.setDate(planningCalendarDate.getDate() + direction);
    renderCalendar();
  }
}

async function renderGanttChart() {
  const filter = getPlanningFilters();
  let projects = await api.getProjects(filter);

  // Apply filters
  if (filter.departmentId) {
    projects = projects.filter(p => p.DepartmentID === filter.departmentId);
  }
  if (filter.status) {
    projects = projects.filter(p => p.ProjectStatus === filter.status);
  }
  if (filter.responsible) {
    projects = projects.filter(p => p.ResponsiblePerson === filter.responsible);
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    projects = projects.filter(p => p.ProjectCode.toLowerCase().includes(q) || p.ProjectName.toLowerCase().includes(q));
  }

  const startYear = parseInt(activeFilters.fiscalYear) - 543;
  const startDate = new Date(startYear, 5, 1); // June 1st
  const endDate = new Date(startYear + 1, 5, 31); // May 31st + Buffer
  endDate.setHours(23, 59, 59, 999);
  
  const totalMs = endDate.getTime() - startDate.getTime();

  // If single project view is active
  let rowsToRender = [];
  if (singleProjectGantt) {
    const mainProj = projects.find(p => p.ProjectID === singleProjectGantt);
    if (mainProj) {
      document.getElementById('gantt-single-project-back').style.display = 'block';
      rowsToRender.push({
        Type: 'project-summary',
        ID: mainProj.ProjectID,
        Code: mainProj.ProjectCode,
        Name: mainProj.ProjectName,
        Responsible: mainProj.ResponsiblePerson,
        StartDate: mainProj.StartDate,
        EndDate: mainProj.EndDate,
        Progress: mainProj.Progress,
        Status: mainProj.ProjectStatus
      });
      
      if (mainProj.Batches && mainProj.Batches.length > 0) {
        mainProj.Batches.forEach((b, idx) => {
          rowsToRender.push({
            Type: 'batch',
            Name: b.Name || `รุ่นที่ ${idx + 1}`,
            StartDate: b.StartDate,
            EndDate: b.EndDate,
            Status: mainProj.ProjectStatus
          });
        });
      } else {
        rowsToRender.push({
          Type: 'empty-batch',
          Name: 'ยังไม่มีการแบ่งรุ่นการอบรมย่อย'
        });
      }
    } else {
      singleProjectGantt = null;
      document.getElementById('gantt-single-project-back').style.display = 'none';
      rowsToRender = projects.map(p => ({ ...p, Type: 'project-row' }));
    }
  } else {
    document.getElementById('gantt-single-project-back').style.display = 'none';
    rowsToRender = projects.map(p => ({ ...p, Type: 'project-row' }));
  }

  // Set timeline column specs
  let columns = [];
  let baseColWidth = 100;
  
  const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const fiscalThaiMonths = ["มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค."];
  
  if (planningGanttScale === 'daily') {
    baseColWidth = 35;
    let temp = new Date(startDate);
    while (temp <= endDate) {
      columns.push({
        Label: `${temp.getDate()} ${thaiMonths[temp.getMonth()]}`,
        Date: new Date(temp)
      });
      temp.setDate(temp.getDate() + 1);
    }
  } else if (planningGanttScale === 'weekly') {
    baseColWidth = 75;
    let temp = new Date(startDate);
    let weekCount = 1;
    while (temp <= endDate) {
      columns.push({
        Label: `W${weekCount} (${temp.getDate()}/${temp.getMonth() + 1})`,
        Date: new Date(temp)
      });
      temp.setDate(temp.getDate() + 7);
      weekCount++;
    }
  } else if (planningGanttScale === 'monthly') {
    baseColWidth = 120;
    for (let m = 0; m < 12; m++) {
      const mIdx = (5 + m) % 12; // June is index 5
      const yr = startYear + (mIdx < 5 ? 1 : 0);
      columns.push({
        Label: `${thaiMonths[mIdx]} ${yr + 543}`,
        MonthIndex: mIdx,
        Year: yr
      });
    }
  } else if (planningGanttScale === 'quarterly') {
    baseColWidth = 250;
    columns = [
      { Label: `Q1 (มิ.ย. - ส.ค.)`, Months: [5, 6, 7] },
      { Label: `Q2 (ก.ย. - พ.ย.)`, Months: [8, 9, 10] },
      { Label: `Q3 (ธ.ค. - ก.พ.)`, Months: [11, 0, 1] },
      { Label: `Q4 (มี.ค. - พ.ค.)`, Months: [2, 3, 4] }
    ];
  } else if (planningGanttScale === 'yearly') {
    baseColWidth = 900;
    columns = [
      { Label: `ปีงบประมาณ ${activeFilters.fiscalYear} (มิ.ย. ${activeFilters.fiscalYear} - พ.ค. ${parseInt(activeFilters.fiscalYear) + 1})` }
    ];
  }

  const colWidth = baseColWidth * planningZoomLevel;
  const ganttContainer = document.getElementById('gantt-container');
  ganttContainer.innerHTML = '';

  // Setup Gantt Grid structure
  const ganttGrid = document.createElement('div');
  ganttGrid.className = 'gantt-grid';
  ganttGrid.style.width = 'max-content';
  ganttGrid.style.minWidth = '100%';
  
  // 1. Header row
  const headerRow = document.createElement('div');
  headerRow.className = 'gantt-header-row';
  
  const labelColHeader = document.createElement('div');
  labelColHeader.className = 'gantt-label-col header';
  labelColHeader.innerText = singleProjectGantt ? 'รายละเอียด/รุ่นย่อย' : 'โครงการบริการวิชาการ';
  headerRow.appendChild(labelColHeader);
  
  const timelineColHeader = document.createElement('div');
  timelineColHeader.className = 'gantt-timeline-col';
  timelineColHeader.style.width = `${columns.length * colWidth}px`;
  
  columns.forEach(col => {
    const cell = document.createElement('div');
    cell.className = 'gantt-header-cell';
    cell.style.width = `${colWidth}px`;
    cell.innerText = col.Label;
    timelineColHeader.appendChild(cell);
  });
  headerRow.appendChild(timelineColHeader);
  ganttGrid.appendChild(headerRow);

  // 2. Data rows
  if (rowsToRender.length === 0) {
    const emptyRow = document.createElement('div');
    emptyRow.style.padding = '25px';
    emptyRow.className = 'text-center text-muted';
    emptyRow.innerText = 'ไม่พบข้อมูลโครงการตามเงื่อนไขตัวกรอง';
    ganttContainer.appendChild(emptyRow);
    return;
  }

  rowsToRender.forEach(row => {
    const tr = document.createElement('div');
    tr.className = 'gantt-row';
    
    // Left Label cell
    const labelCell = document.createElement('div');
    labelCell.className = 'gantt-label-col';
    
    if (row.Type === 'project-row' || row.Type === 'project-summary') {
      labelCell.innerHTML = `
        <div style="font-weight:700; color:var(--primary); font-size:0.8rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${row.ProjectCode}">${row.ProjectCode}</div>
        <div style="font-weight:600; text-overflow:ellipsis; overflow:hidden; white-space:nowrap; font-size:0.82rem;" title="${row.ProjectName}">${row.ProjectName}</div>
        <div style="font-size:0.72rem; color:var(--text-muted);">${row.ResponsiblePerson || '-'} (${row.Progress}%)</div>
      `;
    } else if (row.Type === 'batch') {
      labelCell.innerHTML = `
        <div style="padding-left:10px; font-weight:600; font-size:0.8rem; color:#475569; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${row.Name}">
          <span class="material-icons-round" style="font-size:0.95rem; vertical-align:middle; margin-right:4px;">subdirectory_arrow_right</span>${row.Name}
        </div>
        <div style="padding-left:26px; font-size:0.7rem; color:var(--text-muted);">${row.StartDate} ถึง ${row.EndDate}</div>
      `;
    } else if (row.Type === 'empty-batch') {
      labelCell.innerHTML = `
        <div style="padding-left:15px; font-size:0.75rem; color:var(--text-muted); font-style:italic;">
          ${row.Name}
        </div>
      `;
    }

    tr.appendChild(labelCell);

    // Right Timeline cells
    const timelineRow = document.createElement('div');
    timelineRow.className = 'gantt-timeline-row';
    timelineRow.style.width = `${columns.length * colWidth}px`;
    
    // Draw background cells
    columns.forEach(() => {
      const cell = document.createElement('div');
      cell.className = 'gantt-row-cell';
      cell.style.width = `${colWidth}px`;
      timelineRow.appendChild(cell);
    });

    // Draw Bar if dates exist
    if (row.StartDate && row.EndDate) {
      const pStart = new Date(row.StartDate).getTime();
      const pEnd = new Date(row.EndDate).getTime() + (24 * 60 * 60 * 1000 - 1);
      
      const barStart = Math.max(startDate.getTime(), pStart);
      const barEnd = Math.min(endDate.getTime(), pEnd);

      if (barEnd > barStart) {
        const leftPct = ((barStart - startDate.getTime()) / totalMs) * 100;
        const widthPct = ((barEnd - barStart) / totalMs) * 100;

        const bar = document.createElement('div');
        let statusClass = 'planned';
        if (row.Status === 'Completed') statusClass = 'completed';
        else if (row.Status === 'In Progress') statusClass = 'in-progress';
        else if (row.Status === 'Delayed') statusClass = 'delayed';
        else if (row.Status === 'Cancelled') statusClass = 'cancelled';

        bar.className = `gantt-bar-container gantt-bar ${statusClass}`;
        bar.style.left = `${leftPct}%`;
        bar.style.width = `${widthPct}%`;

        // Tooltip description
        const datesLabel = `${row.StartDate} ถึง ${row.EndDate}`;
        bar.title = `${row.Name || row.ProjectName}\nช่วงเวลา: ${datesLabel}\nสถานะ: ${row.Status || ''}`;

        // Action handles
        if (row.Type === 'project-row') {
          bar.onclick = () => {
            singleProjectGantt = row.ProjectID;
            renderGanttChart();
          };
        } else if (row.Type === 'project-summary') {
          bar.onclick = () => showProjectDetails(row.ID);
        }

        // Add inner progress bar
        if (row.Progress !== undefined) {
          const prog = document.createElement('div');
          prog.className = 'gantt-bar-progress';
          prog.style.width = `${row.Progress}%`;
          bar.appendChild(prog);
        }

        const barText = document.createElement('span');
        barText.className = 'gantt-bar-text';
        barText.innerText = row.Name || row.ProjectName;
        bar.appendChild(barText);

        timelineRow.appendChild(bar);
      }
    }

    tr.appendChild(timelineRow);
    ganttGrid.appendChild(tr);
  });

  // 3. Today Line Indicator
  const now = new Date();
  const todayTime = now.getTime();
  if (todayTime >= startDate.getTime() && todayTime <= endDate.getTime()) {
    const leftPct = ((todayTime - startDate.getTime()) / totalMs) * 100;
    
    const todayLine = document.createElement('div');
    todayLine.className = 'gantt-today-line';
    todayLine.style.left = `calc(${leftPct}% + 260px)`;
    
    const todayBadge = document.createElement('div');
    todayBadge.className = 'gantt-today-badge';
    todayBadge.style.left = `calc(${leftPct}% + 260px)`;
    todayBadge.innerText = 'วันนี้';
    
    ganttGrid.appendChild(todayLine);
    ganttGrid.appendChild(todayBadge);
  }

  ganttContainer.appendChild(ganttGrid);
}

async function renderCalendar() {
  const filter = getPlanningFilters();
  let projects = await api.getProjects(filter);

  // Apply filters
  if (filter.departmentId) {
    projects = projects.filter(p => p.DepartmentID === filter.departmentId);
  }
  if (filter.status) {
    projects = projects.filter(p => p.ProjectStatus === filter.status);
  }
  if (filter.responsible) {
    projects = projects.filter(p => p.ResponsiblePerson === filter.responsible);
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    projects = projects.filter(p => p.ProjectCode.toLowerCase().includes(q) || p.ProjectName.toLowerCase().includes(q));
  }

  const wrapper = document.getElementById('calendar-grid-wrapper');
  wrapper.innerHTML = '';

  const thaiMonthsFull = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const thaiMonthsShort = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  const startYear = parseInt(activeFilters.fiscalYear) - 543;

  // Render YEAR MODE
  if (planningCalendarMode === 'year') {
    document.getElementById('calendar-navigation-header').style.display = 'none';
    
    const yearGrid = document.createElement('div');
    yearGrid.className = 'calendar-year-grid';

    for (let m = 0; m < 12; m++) {
      const monthIdx = (5 + m) % 12; // Start in June (index 5)
      const yr = startYear + (monthIdx < 5 ? 1 : 0);
      
      const mStart = new Date(yr, monthIdx, 1);
      const mEnd = new Date(yr, monthIdx + 1, 0, 23, 59, 59, 999);

      // Find projects running during this month
      const activeInMonth = projects.filter(p => {
        const pStart = new Date(p.StartDate);
        const pEnd = new Date(p.EndDate);
        return pStart <= mEnd && pEnd >= mStart;
      });

      const mCard = document.createElement('div');
      mCard.className = 'calendar-year-month-card';
      
      const mHeader = document.createElement('div');
      mHeader.className = 'calendar-year-month-header';
      mHeader.innerHTML = `
        <span>${thaiMonthsFull[monthIdx]} ${yr + 543}</span>
        <span class="calendar-year-month-badge">${activeInMonth.length} โครงการ</span>
      `;
      mCard.appendChild(mHeader);

      const mList = document.createElement('div');
      mList.className = 'calendar-year-month-list';

      if (activeInMonth.length === 0) {
        mList.innerHTML = `<div style="font-size:0.72rem; color:var(--text-muted); font-style:italic; text-align:center; padding: 10px 0;">ไม่มีกำหนดการดำเนินงาน</div>`;
      } else {
        activeInMonth.forEach(p => {
          const item = document.createElement('div');
          
          let statusClass = 'planned';
          if (p.ProjectStatus === 'Completed') statusClass = 'completed';
          else if (p.ProjectStatus === 'In Progress') statusClass = 'in-progress';
          else if (p.ProjectStatus === 'Delayed') statusClass = 'delayed';
          else if (p.ProjectStatus === 'Cancelled') statusClass = 'cancelled';

          item.className = `calendar-year-item ${statusClass}`;
          item.innerHTML = `<strong>${p.ProjectCode}</strong> - ${p.ProjectName}`;
          item.title = `${p.ProjectName}\n${p.StartDate} ถึง ${p.EndDate}\nผู้รับผิดชอบ: ${p.ResponsiblePerson}`;
          item.onclick = () => showProjectDetails(p.ProjectID);
          
          mList.appendChild(item);
        });
      }
      
      mCard.appendChild(mList);
      yearGrid.appendChild(mCard);
    }
    
    wrapper.appendChild(yearGrid);
    return;
  }

  // Restore navigation header display
  document.getElementById('calendar-navigation-header').style.display = 'flex';

  // Render MONTH MODE
  if (planningCalendarMode === 'month') {
    const month = planningCalendarDate.getMonth();
    const year = planningCalendarDate.getFullYear();
    
    document.getElementById('planning-calendar-title').innerText = `${thaiMonthsFull[month]} ${year + 543}`;

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const grid = document.createElement('div');
    grid.className = 'calendar-grid';

    // Header cells (days of week)
    const daysOfWeek = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    daysOfWeek.forEach(day => {
      const hCell = document.createElement('div');
      hCell.className = 'calendar-header-cell';
      hCell.innerText = day;
      grid.appendChild(hCell);
    });

    const cells = [];
    // Previous month padding days
    for (let d = firstDay - 1; d >= 0; d--) {
      cells.push({
        DayNum: prevMonthDays - d,
        IsOtherMonth: true,
        Date: new Date(year, month - 1, prevMonthDays - d)
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      cells.push({
        DayNum: d,
        IsOtherMonth: false,
        Date: new Date(year, month, d)
      });
    }

    // Next month padding days
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({
        DayNum: d,
        IsOtherMonth: true,
        Date: new Date(year, month + 1, d)
      });
    }

    const todayStr = new Date().toISOString().split('T')[0];

    cells.forEach(cell => {
      const cDiv = document.createElement('div');
      cDiv.className = 'calendar-cell';
      if (cell.IsOtherMonth) cDiv.classList.add('other-month');
      
      const cellDateStr = cell.Date.toISOString().split('T')[0];
      if (cellDateStr === todayStr) {
        cDiv.classList.add('today');
      }

      cDiv.innerHTML = `<span class="calendar-cell-num">${cell.DayNum}</span>`;

      // Find active projects on this day
      const activeOnDay = projects.filter(p => {
        const pStart = new Date(p.StartDate);
        const pEnd = new Date(p.EndDate);
        pStart.setHours(0,0,0,0);
        pEnd.setHours(23,59,59,999);
        return pStart <= cell.Date && pEnd >= cell.Date;
      });

      // Show first 3 events
      const limit = 3;
      activeOnDay.slice(0, limit).forEach(p => {
        const ev = document.createElement('div');
        
        let statusClass = 'planned';
        if (p.ProjectStatus === 'Completed') statusClass = 'completed';
        else if (p.ProjectStatus === 'In Progress') statusClass = 'in-progress';
        else if (p.ProjectStatus === 'Delayed') statusClass = 'delayed';
        else if (p.ProjectStatus === 'Cancelled') statusClass = 'cancelled';

        ev.className = `calendar-event-bar ${statusClass}`;
        ev.innerText = p.ProjectName;
        ev.title = `${p.ProjectCode}: ${p.ProjectName}\nผู้รับผิดชอบ: ${p.ResponsiblePerson}`;
        ev.onclick = (e) => {
          e.stopPropagation();
          showProjectDetails(p.ProjectID);
        };
        cDiv.appendChild(ev);
      });

      if (activeOnDay.length > limit) {
        const more = document.createElement('div');
        more.style.fontSize = '0.65rem';
        more.style.color = 'var(--primary)';
        more.style.fontWeight = 'bold';
        more.style.paddingLeft = '5px';
        more.innerText = `+ อีก ${activeOnDay.length - limit} โครงการ`;
        cDiv.appendChild(more);
      }

      grid.appendChild(cDiv);
    });

    wrapper.appendChild(grid);
  }

  // Render WEEK MODE
  if (planningCalendarMode === 'week') {
    const currentDay = planningCalendarDate.getDay();
    const monday = new Date(planningCalendarDate);
    monday.setDate(planningCalendarDate.getDate() - (currentDay === 0 ? 6 : currentDay - 1));
    
    const endOfWeek = new Date(monday);
    endOfWeek.setDate(monday.getDate() + 6);
    
    document.getElementById('planning-calendar-title').innerText = `สัปดาห์ที่ ${monday.getDate()} ${thaiMonthsShort[monday.getMonth()]} - ${endOfWeek.getDate()} ${thaiMonthsShort[endOfWeek.getMonth()]} ${endOfWeek.getFullYear() + 543}`;

    const weekList = document.createElement('div');
    weekList.style.display = 'flex';
    weekList.style.flexDirection = 'column';
    weekList.style.gap = '12px';

    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const dayStr = dayDate.toISOString().split('T')[0];
      const isToday = dayStr === new Date().toISOString().split('T')[0];

      const days = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];
      
      const dayCard = document.createElement('div');
      dayCard.className = 'card';
      dayCard.style.padding = '10px 15px';
      if (isToday) {
        dayCard.style.borderColor = 'var(--primary)';
        dayCard.style.background = '#fffafb';
      }

      const activeOnDay = projects.filter(p => {
        const pStart = new Date(p.StartDate);
        const pEnd = new Date(p.EndDate);
        pStart.setHours(0,0,0,0);
        pEnd.setHours(23,59,59,999);
        return pStart <= dayDate && pEnd >= dayDate;
      });

      let innerEventsHtml = '';
      if (activeOnDay.length === 0) {
        innerEventsHtml = `<div style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">ไม่มีกิจกรรมหรือโครงการในวันนี้</div>`;
      } else {
        activeOnDay.forEach(p => {
          let badgeClass = 'status-draft';
          if (p.ProjectStatus === 'Completed') badgeClass = 'status-completed';
          else if (p.ProjectStatus === 'In Progress') badgeClass = 'status-running';
          else if (p.ProjectStatus === 'Delayed') badgeClass = 'status-delayed';
          else if (p.ProjectStatus === 'Cancelled') badgeClass = 'status-cancelled';
          else if (p.ProjectStatus === 'Planned') badgeClass = 'status-planned';

          innerEventsHtml += `
            <div style="padding:8px; border:1px solid var(--border-color); border-radius:4px; margin-bottom:6px; background:#fff; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="showProjectDetails(${p.ProjectID})">
              <div>
                <strong>${p.ProjectCode}</strong> - ${p.ProjectName}
                <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">ผู้รับผิดชอบ: ${p.ResponsiblePerson || '-'} | สาขาวิชา: ${p.DepartmentCode}</div>
              </div>
              <span class="badge ${badgeClass}">${p.ProjectStatus}</span>
            </div>
          `;
        });
      }

      dayCard.innerHTML = `
        <h4 style="font-size:0.85rem; font-weight:700; color:${isToday ? 'var(--primary)' : 'var(--text-dark)'}; border-bottom:1px solid var(--border-color); padding-bottom:4px; margin-bottom:10px;">
          วัน${days[i]}ที่ ${dayDate.getDate()} ${thaiMonthsFull[dayDate.getMonth()]} ${dayDate.getFullYear() + 543} ${isToday ? '(วันนี้)' : ''}
        </h4>
        <div>${innerEventsHtml}</div>
      `;
      weekList.appendChild(dayCard);
    }
    
    wrapper.appendChild(weekList);
  }

  // Render DAY MODE
  if (planningCalendarMode === 'day') {
    const dayStr = planningCalendarDate.toISOString().split('T')[0];
    const isToday = dayStr === new Date().toISOString().split('T')[0];
    
    const daysOfWeekFull = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const dayName = daysOfWeekFull[planningCalendarDate.getDay()];
    document.getElementById('planning-calendar-title').innerText = `วัน${dayName}ที่ ${planningCalendarDate.getDate()} ${thaiMonthsFull[planningCalendarDate.getMonth()]} ${planningCalendarDate.getFullYear() + 543}`;

    const activeOnDay = projects.filter(p => {
      const pStart = new Date(p.StartDate);
      const pEnd = new Date(p.EndDate);
      pStart.setHours(0,0,0,0);
      pEnd.setHours(23,59,59,999);
      return pStart <= planningCalendarDate && pEnd >= planningCalendarDate;
    });

    const dayCard = document.createElement('div');
    dayCard.className = 'card';
    dayCard.style.padding = '20px';
    if (isToday) dayCard.style.borderColor = 'var(--primary)';

    let listHtml = '';
    if (activeOnDay.length === 0) {
      listHtml = `<div style="text-align:center; padding:40px 0; color:var(--text-muted); font-style:italic;">ไม่มีกิจกรรมหรือการดำเนินโครงการในวันนี้</div>`;
    } else {
      activeOnDay.forEach(p => {
        let badgeClass = 'status-draft';
        if (p.ProjectStatus === 'Completed') badgeClass = 'status-completed';
        else if (p.ProjectStatus === 'In Progress') badgeClass = 'status-running';
        else if (p.ProjectStatus === 'Delayed') badgeClass = 'status-delayed';
        else if (p.ProjectStatus === 'Cancelled') badgeClass = 'status-cancelled';
        else if (p.ProjectStatus === 'Planned') badgeClass = 'status-planned';

        listHtml += `
          <div style="padding:15px; border:1px solid var(--border-color); border-radius:6px; margin-bottom:10px; background:var(--bg-light); display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="showProjectDetails(${p.ProjectID})">
            <div>
              <h4 style="font-weight:700; color:var(--primary); font-size:0.95rem;">${p.ProjectCode} - ${p.ProjectName}</h4>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
                <strong>อาจารย์ผู้รับผิดชอบ:</strong> ${p.ResponsiblePerson || '-'} <br>
                <strong>สาขาวิชา:</strong> ${p.DepartmentCode} - ${p.DepartmentName} <br>
                <strong>ระยะเวลาดำเนินงาน:</strong> ${p.StartDate} ถึง ${p.EndDate}
              </p>
            </div>
            <div>
              <span class="badge ${badgeClass}" style="font-size:0.8rem; padding: 6px 12px;">${p.ProjectStatus}</span>
            </div>
          </div>
        `;
      });
    }

    dayCard.innerHTML = `
      <h3 style="font-size:1.1rem; color:var(--primary); margin-bottom:15px; border-bottom:2px solid var(--bg-light); padding-bottom:8px;">
        รายการโครงการที่ดำเนินงานประจำวันที่ ${planningCalendarDate.getDate()} ${thaiMonthsFull[planningCalendarDate.getMonth()]} ${planningCalendarDate.getFullYear() + 543}
      </h3>
      <div>${listHtml}</div>
    `;
    
    wrapper.appendChild(dayCard);
  }
}

// ==================== REPORTS SYSTEM ====================
async function loadReportsView() {
  const summary = await api.getFacultyDashboard(activeFilters);
  const detailedProjects = await api.getReportData(activeFilters);
  
  // Set report header subtitle based on active department filter
  const reportSubtitleDeptEl = document.getElementById('report-subtitle-dept-text');
  if (activeFilters.departmentId) {
    const depts = await api.getDepartments();
    const dept = depts.find(d => d.DepartmentID === parseInt(activeFilters.departmentId));
    const deptCode = dept ? dept.DepartmentCode : '';
    reportSubtitleDeptEl.innerText = `(สาขาวิชา ${deptCode})`;
    reportSubtitleDeptEl.style.display = 'block';
  } else {
    reportSubtitleDeptEl.innerText = '';
    reportSubtitleDeptEl.style.display = 'none';
  }

  // Set meta description info
  document.getElementById('report-meta-text').innerText = `ประจำปีงบประมาณ ${activeFilters.fiscalYear} | คณะวิศวกรรมศาสตร์ คัดกรอง: ${activeFilters.departmentId ? 'เฉพาะสาขาวิชา' : 'รวมทั้งหมดทุกสาขา'}`;
  
  // Populate Signatures Dynamically from database
  try {
    const users = await api.getUsers();
    
    // 1. Assistant Dean (adean)
    const adeanUser = users.find(u => u.Role === 'Assistant Dean') || users.find(u => u.Username === 'adean');
    const adeanName = adeanUser ? adeanUser.FullName : 'ผศ.ยอดนภา เกษเมือง';
    document.getElementById('sig-adean-name').innerText = `(${adeanName})`;

    // 2. Dean (dean)
    const deanUser = users.find(u => u.Role === 'Dean') || users.find(u => u.Username === 'dean');
    const deanName = deanUser ? deanUser.FullName : 'ผศ.ดร.พรรณเชษฐ ณ ลำพูน';
    document.getElementById('sig-dean-name').innerText = `(${deanName})`;

    // 3. Department Admin (admin สาขา) in the middle
    if (activeFilters.departmentId) {
      const depts = await api.getDepartments();
      const dept = depts.find(d => d.DepartmentID === parseInt(activeFilters.departmentId));
      const deptAdminUser = users.find(u => u.Role === 'Department Admin' && u.DepartmentID == activeFilters.departmentId);
      const adminName = deptAdminUser ? deptAdminUser.FullName : 'แอดมินสาขาวิชา';
      const deptName = dept ? dept.DepartmentName : '';
      document.getElementById('sig-admin-name').innerText = `(${adminName})`;
      document.getElementById('sig-admin-role').innerText = `หัวหน้าสาขาวิชา${deptName}`;
    } else {
      document.getElementById('sig-admin-name').innerText = '(....................................................)';
      document.getElementById('sig-admin-role').innerText = 'หัวหน้าสาขาวิชา';
    }
  } catch (err) {
    console.error("Error populating report signatures: ", err);
  }
  
  // Fill summaries
  document.getElementById('rep-stat-projects').innerText = summary.TotalProjects;
  document.getElementById('rep-stat-budget').innerText = '฿' + summary.PlannedBudget.toLocaleString();
  document.getElementById('rep-stat-revenue').innerText = '฿' + summary.Revenue.toLocaleString();
  document.getElementById('rep-stat-expense').innerText = '฿' + summary.Expense.toLocaleString();
  document.getElementById('rep-stat-profit').innerText = '฿' + summary.Profit.toLocaleString();
  document.getElementById('rep-stat-gp').innerText = summary.GPPercent.toFixed(1) + '%';

  // Fill monthly performance table
  const monthlyData = await api.getMonthlyPerformance(activeFilters);
  const monthlyTbody = document.getElementById('report-monthly-body');
  monthlyTbody.innerHTML = '';

  let totalActive = 0;
  let totalRev = 0;
  let totalExp = 0;
  let totalCSR = 0;

  monthlyData.forEach(m => {
    totalRev += m.Revenue;
    totalExp += m.Expense;
    totalCSR += m.CSRExpense;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${m.MonthName}</strong></td>
      <td class="text-center">${m.ActiveProjectsCount} โครงการ</td>
      <td class="text-success">฿${m.Revenue.toLocaleString()}</td>
      <td class="text-danger">฿${m.Expense.toLocaleString()}</td>
      <td class="text-primary">฿${m.Profit.toLocaleString()}</td>
      <td>${m.Revenue > 0 ? m.GPPercent.toFixed(1) + '%' : '<span style="color:var(--text-muted);">ให้เปล่า/ไม่มีรายรับ</span>'}</td>
      <td style="color: #ea580c;">฿${m.CSRExpense.toLocaleString()}</td>
    `;
    monthlyTbody.appendChild(tr);
  });

  // Add monthly totals row
  const monthlyTotalRow = document.createElement('tr');
  monthlyTotalRow.style.backgroundColor = '#f8fafc';
  monthlyTotalRow.style.fontWeight = 'bold';
  const totalProfit = totalRev - totalExp;
  
  monthlyTotalRow.innerHTML = `
    <td class="text-center">รวมสะสมรายปีงบประมาณ</td>
    <td class="text-center">-</td>
    <td class="text-success">฿${totalRev.toLocaleString()}</td>
    <td class="text-danger">฿${totalExp.toLocaleString()}</td>
    <td class="text-primary">฿${totalProfit.toLocaleString()}</td>
    <td>${summary.GPPercent.toFixed(1)}%</td>
    <td style="color: #ea580c;">฿${totalCSR.toLocaleString()}</td>
  `;
  monthlyTbody.appendChild(monthlyTotalRow);

  // Render Monthly Report Chart
  const rmtCtx = document.getElementById('chart-report-monthly-trend').getContext('2d');
  if (charts.reportMonthlyTrend) charts.reportMonthlyTrend.destroy();

  const labels = monthlyData.map(m => m.MonthName.split(' ')[0]);
  const revenueDataset = monthlyData.map(m => m.Revenue);
  const expenseDataset = monthlyData.map(m => m.Expense);
  const profitDataset = monthlyData.map(m => m.Profit);
  const csrDataset = monthlyData.map(m => m.CSRExpense);

  charts.reportMonthlyTrend = new Chart(rmtCtx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'รายรับ (Revenue)',
          data: revenueDataset,
          backgroundColor: 'rgba(16, 185, 129, 0.7)',
          borderColor: '#10b981',
          borderWidth: 1.5,
          borderRadius: 4
        },
        {
          label: 'รายจ่าย (Expense)',
          data: expenseDataset,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: '#ef4444',
          borderWidth: 1.5,
          borderRadius: 4
        },
        {
          label: 'รายจ่ายเพื่อสังคม (CSR)',
          data: csrDataset,
          backgroundColor: 'rgba(249, 115, 22, 0.65)',
          borderColor: '#f97316',
          borderWidth: 1.5,
          borderRadius: 4
        },
        {
          label: 'กำไรสุทธิ (Profit)',
          type: 'line',
          data: profitDataset,
          borderColor: '#7c3aed',
          backgroundColor: 'rgba(124, 58, 237, 0.1)',
          borderWidth: 3,
          tension: 0.3,
          fill: false,
          pointBackgroundColor: '#7c3aed',
          pointRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: { family: 'Outfit, Inter, sans-serif', size: 11 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.raw !== null) {
                label += '฿' + context.raw.toLocaleString();
              }
              return label;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '฿' + value.toLocaleString();
            }
          }
        }
      }
    }
  });

  // Fill project details table
  const tbody = document.getElementById('report-details-body');
  tbody.innerHTML = '';

  if (detailedProjects.length === 0) {
    tbody.innerHTML = '<tr><td colspan="10" class="text-center">ไม่พบโครงการในระบบข้อมูล</td></tr>';
  } else {
    detailedProjects.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${p.ProjectCode}</strong></td>
        <td style="max-width: 250px;">${p.ProjectName}</td>
        <td>${p.DepartmentCode}</td>
        <td>${p.ResponsiblePerson}</td>
        <td><span class="badge badge-${p.Status.toLowerCase().replace(' ', '-')}">${p.Status}</span></td>
        <td>฿${p.PlannedBudget.toLocaleString()}</td>
        <td class="text-success">฿${p.Revenue.toLocaleString()}</td>
        <td class="text-danger">฿${p.Expense.toLocaleString()}</td>
        <td class="text-primary">฿${p.Profit.toLocaleString()}</td>
        <td>${p.IsFreeService ? '<span class="badge badge-draft">ให้เปล่า</span>' : p.GPPercent.toFixed(1) + '%'}</td>
      `;
      tbody.appendChild(tr);
    });

    // Add aggregate totals row
    const totalRow = document.createElement('tr');
    totalRow.style.backgroundColor = '#f8fafc';
    totalRow.style.fontWeight = 'bold';
    totalRow.innerHTML = `
      <td colspan="5" class="text-center">รวมสะสมยอดการเงินโครงการทั้งหมด</td>
      <td>฿${summary.PlannedBudget.toLocaleString()}</td>
      <td class="text-success">฿${summary.Revenue.toLocaleString()}</td>
      <td class="text-danger">฿${summary.Expense.toLocaleString()}</td>
      <td class="text-primary">฿${summary.Profit.toLocaleString()}</td>
      <td>${summary.GPPercent.toFixed(1)}%</td>
    `;
    tbody.appendChild(totalRow);
  }
}

function initReportsActions() {
  // Bind standard browser printing layout
  document.getElementById('btn-print-report').onclick = () => {
    window.print();
  };

  // Export report excel CSV
  document.getElementById('btn-export-report-excel').onclick = async () => {
    const detailedProjects = await api.getReportData(activeFilters);
    let csv = '\ufeffรหัสโครงการ,ชื่อโครงการ,สาขาวิชา,ผู้รับผิดชอบ,สถานะ,งบวางแผน,รายรับจริง,รายจ่ายจริง,กำไร,GP%\n';
    
    detailedProjects.forEach(p => {
      csv += `"${p.ProjectCode}","${p.ProjectName.replace(/"/g, '""')}","${p.DepartmentCode}","${p.ResponsiblePerson}","${p.Status}",${p.PlannedBudget},${p.Revenue},${p.Expense},${p.Profit},${p.GPPercent.toFixed(1)}\n`;
    });
    
    triggerCsvDownload(csv, `ASPMS_Academic_Report_${activeFilters.fiscalYear}.csv`);
  };
}

// ==================== USER MANAGEMENT ====================
async function loadUsersView() {
  const users = await api.getUsers();
  const tbody = document.getElementById('users-table-body');
  tbody.innerHTML = '';

  users.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.EmployeeID}</td>
      <td style="font-weight:600;">${u.FullName}</td>
      <td><code>${u.Username}</code></td>
      <td><span class="badge badge-crimson">${u.DepartmentCode}</span></td>
      <td>${u.Email || '-'}</td>
      <td>${u.Phone || '-'}</td>
      <td>${u.Role}</td>
      <td><span class="badge ${u.Status === 'Active' ? 'status-completed' : 'status-cancelled'}">${u.Status}</span></td>
      <td>
        <button class="action-icon-btn" title="แก้ไขสิทธิ์/ผู้ใช้" id="btn-edit-user-${u.UserID}"><span class="material-icons-round">edit</span></button>
      </td>
    `;
    tbody.appendChild(tr);

    document.getElementById(`btn-edit-user-${u.UserID}`).onclick = () => openUserModal(u);
  });
}

function openUserModal(user = null) {
  const form = document.getElementById('user-form');
  form.reset();

  const titleEl = document.getElementById('modal-user-title');
  const statusGroup = document.getElementById('user-form-status-group');
  const passInput = document.getElementById('user-form-password');

  if (user) {
    titleEl.innerText = `แก้ไขข้อมูลผู้ใช้ - ${user.Username}`;
    document.getElementById('user-form-id').value = user.UserID;
    document.getElementById('user-form-empid').value = user.EmployeeID;
    document.getElementById('user-form-empid').setAttribute('disabled', 'true');
    document.getElementById('user-form-name').value = user.FullName;
    document.getElementById('user-form-username').value = user.Username;
    document.getElementById('user-form-username').setAttribute('disabled', 'true');
    document.getElementById('user-form-role').value = user.Role;
    document.getElementById('user-form-dept').value = user.DepartmentID || '';
    document.getElementById('user-form-email').value = user.Email || '';
    document.getElementById('user-form-phone').value = user.Phone || '';
    
    passInput.placeholder = 'ระบุรหัสผ่านใหม่ (ทิ้งว่างเพื่อใช้รหัสเดิม)';
    statusGroup.style.display = 'block';
    document.getElementById('user-form-status').value = user.Status;
  } else {
    titleEl.innerText = 'เพิ่มผู้ใช้งานระบบใหม่';
    document.getElementById('user-form-id').value = '';
    document.getElementById('user-form-empid').removeAttribute('disabled');
    document.getElementById('user-form-username').removeAttribute('disabled');
    passInput.placeholder = 'ระบุรหัสผ่านเริ่มต้น (เริ่มต้น: password123)';
    statusGroup.style.display = 'none';
  }

  document.getElementById('modal-user').classList.add('show');
}

function initUsersModal() {
  const modal = document.getElementById('modal-user');
  const form = document.getElementById('user-form');

  const closeUser = () => {
    modal.classList.remove('show');
    form.reset();
  };

  document.getElementById('btn-add-user-modal').onclick = () => openUserModal();
  document.getElementById('btn-close-user-modal').onclick = closeUser;
  document.getElementById('btn-cancel-user-modal').onclick = closeUser;

  form.onsubmit = async (e) => {
    e.preventDefault();
    const id = document.getElementById('user-form-id').value;
    const payload = {
      EmployeeID: document.getElementById('user-form-empid').value,
      FullName: document.getElementById('user-form-name').value,
      Username: document.getElementById('user-form-username').value,
      Password: document.getElementById('user-form-password').value,
      Role: document.getElementById('user-form-role').value,
      DepartmentID: document.getElementById('user-form-dept').value,
      Email: document.getElementById('user-form-email').value,
      Phone: document.getElementById('user-form-phone').value,
    };

    try {
      if (id) {
        payload.Status = document.getElementById('user-form-status').value;
        const updated = await api.updateUser(id, payload);
        
        // If updating self, refresh the header displays instantly
        const curUser = api.getCurrentUser();
        if (curUser && curUser.UserID === updated.UserID) {
          document.getElementById('user-display-name').innerText = updated.FullName;
          document.getElementById('user-display-role').innerText = updated.Role === 'Assistant Dean' ? 'ผู้ช่วยคณบดี' : (updated.Role === 'Dean' ? 'คณบดี' : 'แอดมินสาขาวิชา');
        }
      } else {
        await api.createUser(payload);
      }
      closeUser();
      loadUsersView();
    } catch (err) {
      alert(err.message);
    }
  };
}

// ==================== SYSTEM SETTINGS MODULE ====================
async function loadSettingsView() {
  const currentMinGP = localStorage.getItem('ASPMS_MIN_GP') || '20';
  document.getElementById('settings-min-gp').value = currentMinGP;
}

function initSettingsActions() {
  document.getElementById('btn-save-settings').onclick = () => {
    const val = document.getElementById('settings-min-gp').value;
    localStorage.setItem('ASPMS_MIN_GP', val);
    alert('บันทึกการตั้งค่าระบบเรียบร้อยแล้ว');
    loadSettingsView();
  };

  // Export DB Backup JSON
  document.getElementById('btn-settings-export-db').onclick = () => {
    const keys = ['ASPMS_DATABASE', 'ASPMS_MIN_GP', 'ASPMS_DEPARTMENTS', 'ASPMS_PROJECTS', 'ASPMS_REVENUE', 'ASPMS_EXPENSES', 'ASPMS_AUDIT_LOGS', 'ASPMS_KPI_TARGETS', 'ASPMS_KPI_ITEMS'];
    const backup = {};
    keys.forEach(k => {
      backup[k] = localStorage.getItem(k);
    });
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", `ASPMS_Database_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    dlAnchorElem.click();
  };

  // Trigger file input click
  document.getElementById('btn-settings-import-trigger').onclick = () => {
    document.getElementById('settings-import-db-file').click();
  };

  // Import DB Backup JSON
  document.getElementById('settings-import-db-file').onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const backup = JSON.parse(evt.target.result);
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการกู้คืนข้อมูลระบบจากไฟล์สำรองข้อมูลนี้? ข้อมูลที่มีอยู่ทั้งหมดในปัจจุบันจะถูกเขียนทับ!')) {
          Object.keys(backup).forEach(k => {
            if (backup[k] !== null && backup[k] !== undefined) {
              localStorage.setItem(k, backup[k]);
            }
          });
          alert('กู้คืนฐานข้อมูลจำลองเรียบร้อยแล้ว! ระบบจะทำการโหลดหน้าใหม่');
          location.reload();
        }
      } catch (err) {
        alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล: ไฟล์อาจจะเสียหายหรือไม่ตรงรูปแบบ');
      }
    };
    reader.readAsText(file);
  };
}

// ==================== AUDIT LOG MODULE ====================
async function loadAuditLogsView() {
  const logs = await api.getAuditLogs();
  const tbody = document.getElementById('audit-table-body');
  tbody.innerHTML = '';

  if (logs.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center">ไม่มีรายการบันทึกประวัติการกระทำ</td></tr>';
  } else {
    logs.forEach(l => {
      const tr = document.createElement('tr');
      // Format Timestamp nicely
      const timeStr = new Date(l.CreatedAt).toLocaleString('th-TH');
      
      tr.innerHTML = `
        <td style="font-size:0.8rem; white-space:nowrap;">${timeStr}</td>
        <td><strong>${l.UserFullName}</strong></td>
        <td><span class="badge badge-crimson">${l.UserRole}</span></td>
        <td>${l.Module}</td>
        <td><span class="badge ${l.Action === 'Create' ? 'status-completed' : (l.Action === 'Update' ? 'status-running' : 'status-cancelled')}">${l.Action}</span></td>
        <td><code>${l.RecordID}</code></td>
        <td style="font-size: 0.78rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title='${l.OldValue}'>${l.OldValue || '-'}</td>
        <td style="font-size: 0.78rem; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title='${l.NewValue}'>${l.NewValue || '-'}</td>
      `;
      tbody.appendChild(tr);
    });
  }
}

// ==================== NOTIFICATIONS DRAWER ====================
async function loadNotifications() {
  const list = await api.getNotifications();
  const countBadge = document.getElementById('notifications-count');
  const container = document.getElementById('notifications-list-container');
  
  const unreadCount = list.filter(n => n.Status === 'Unread').length;
  if (unreadCount > 0) {
    countBadge.innerText = unreadCount;
    countBadge.style.display = 'flex';
  } else {
    countBadge.style.display = 'none';
  }

  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = '<li style="text-align:center; color:var(--text-muted); font-size:0.85rem;">ไม่มีการแจ้งเตือน</li>';
    return;
  }

  list.forEach(n => {
    const li = document.createElement('li');
    li.className = n.Status === 'Unread' ? 'unread' : '';
    
    // Formatting date
    const dateStr = new Date(n.CreatedAt).toLocaleString('th-TH');

    li.innerHTML = `
      <h5>${n.Title}</h5>
      <p>${n.Message}</p>
      <span class="notif-time">${dateStr}</span>
    `;

    li.onclick = async () => {
      if (n.Status === 'Unread') {
        await api.markNotificationRead(n.NotificationID);
        loadNotifications();
      }
    };

    container.appendChild(li);
  });
}

function initNotificationsDropdown() {
  const toggleBtn = document.getElementById('btn-notifications-toggle');
  const menu = document.getElementById('notifications-dropdown-menu');
  const markReadBtn = document.getElementById('btn-mark-all-read');

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== toggleBtn && !toggleBtn.contains(e.target)) {
      menu.classList.remove('show');
    }
  });

  markReadBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const list = await api.getNotifications();
    const unread = list.filter(n => n.Status === 'Unread');
    for (let notif of unread) {
      await api.markNotificationRead(notif.NotificationID);
    }
    loadNotifications();
    menu.classList.remove('show');
  });
}

// ==================== CSV UTILS ====================
function triggerCsvDownload(csvContent, fileName) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ==================== INITIALIZE BOOTSTRAP ====================
document.addEventListener('DOMContentLoaded', () => {
  // Check if session exists
  const cachedUser = api.getCurrentUser();
  
  initAuth();
  initRouter();
  initFilters();
  initProjectForms();
  initDetailModal();
  initFinanceModals();
  initKPIModal();
  initReportsActions();
  initUsersModal();
  initSettingsActions();
  initNotificationsDropdown();

  // Audit list refresh button
  document.getElementById('btn-refresh-auditlogs').onclick = () => {
    loadAuditLogsView();
  };

  document.getElementById('btn-clear-auditlogs').onclick = async () => {
    if (confirm('คุณแน่ใจหรือไม่ว่าต้องการล้างประวัติการเข้าใช้งานและแก้ไขข้อมูลทั้งหมดในระบบ? (การดำเนินการนี้จะไม่สามารถกู้คืนกลับมาได้)')) {
      try {
        await api.clearAuditLogs();
        alert('ล้างประวัติการทำงานในระบบทั้งหมดเรียบร้อยแล้ว');
        loadAuditLogsView();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Reset database button on login page
  const resetDbBtn = document.getElementById('btn-reset-db-login');
  if (resetDbBtn) {
    resetDbBtn.onclick = () => {
      if (confirm('คุณต้องการรีเซ็ตฐานข้อมูลจำลองทั้งหมดกลับไปเป็นค่าเริ่มต้นใช่หรือไม่?')) {
        window.ASPMS_DB.clearDB();
        alert('รีเซ็ตฐานข้อมูลเรียบร้อยแล้ว บัญชีและข้อมูลจำลองทั้งหมดถูกตั้งค่าใหม่');
        location.reload();
      }
    };
  }

  if (cachedUser) {
    setupAppShell(cachedUser);
  } else {
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('app-container').style.display = 'none';
  }

  window.APP_LOADED = true;
});
} catch (err) {
  console.error("app.js execution crashed:", err);
  window.APP_ERROR = err.message + (err.stack ? ' - ' + err.stack : '');
}
