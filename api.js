try {
const { getTable, saveTable } = window.ASPMS_DB;

// Helper to simulate API delay
const delay = (ms = 100) => new Promise(resolve => setTimeout(resolve, ms));

// Session handling
let currentSession = null;
const SESSION_KEY = 'ASPMS_SESSION';

// Safe sessionStorage wrapper for file:// restrictions
let sessionFallback = {};
const safeSessionStorage = {
  getItem(key) {
    try {
      return sessionStorage.getItem(key);
    } catch (err) {
      return sessionFallback[key] || null;
    }
  },
  setItem(key, value) {
    try {
      sessionStorage.setItem(key, value);
    } catch (err) {
      sessionFallback[key] = value;
    }
  },
  removeItem(key) {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {
      delete sessionFallback[key];
    }
  },
  clear() {
    try {
      sessionStorage.clear();
    } catch (err) {
      sessionFallback = {};
    }
  }
};

function getCurrentUser() {
  if (!currentSession) {
    const cached = safeSessionStorage.getItem(SESSION_KEY);
    if (cached) currentSession = JSON.parse(cached);
  }
  if (currentSession) {
    try {
      const users = getTable('Users');
      if (users && Array.isArray(users)) {
        const dbUser = users.find(u => u.UserID === currentSession.UserID || u.Username === currentSession.Username);
        if (dbUser) {
          currentSession = { ...currentSession, ...dbUser };
          safeSessionStorage.setItem(SESSION_KEY, JSON.stringify(currentSession));
        }
      }
    } catch (e) {
      console.error("Failed to dynamically sync currentSession with DB", e);
    }
  }
  return currentSession;
}

function setCurrentUser(user) {
  currentSession = user;
  if (user) {
    safeSessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    safeSessionStorage.removeItem(SESSION_KEY);
  }
}

// Audit Log Helper
function logAction(userId, module, action, recordId, oldValue = '', newValue = '') {
  const logs = getTable('AuditLogs');
  const newLog = {
    LogID: logs.length > 0 ? Math.max(...logs.map(l => l.LogID)) + 1 : 1,
    UserID: userId,
    Module: module,
    Action: action,
    RecordID: recordId,
    OldValue: typeof oldValue === 'object' ? JSON.stringify(oldValue) : String(oldValue),
    NewValue: typeof newValue === 'object' ? JSON.stringify(newValue) : String(newValue),
    IPAddress: '127.0.0.1',
    CreatedAt: new Date().toISOString()
  };
  logs.push(newLog);
  saveTable('AuditLogs', logs);
}

// Notifications Helper
function createNotification(userId, title, message, type) {
  const list = getTable('Notifications');
  const newNotif = {
    NotificationID: list.length > 0 ? Math.max(...list.map(n => n.NotificationID)) + 1 : 1,
    UserID: userId,
    Title: title,
    Message: message,
    NotificationType: type,
    Status: 'Unread',
    CreatedAt: new Date().toISOString(),
    ReadAt: null
  };
  list.push(newNotif);
  saveTable('Notifications', list);
}

// Business Calculations for a Project
function calculateProjectFinance(projectId) {
  const revenues = getTable('RevenueTransactions').filter(r => r.ProjectID === projectId);
  const expenses = getTable('ExpenseTransactions').filter(e => e.ProjectID === projectId);

  const totalRevenue = revenues.reduce((sum, r) => sum + r.Amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.Amount, 0);
  const profit = totalRevenue - totalExpense;
  const gpPercent = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return {
    Revenue: totalRevenue,
    Expense: totalExpense,
    Profit: profit,
    GPPercent: gpPercent
  };
}

// Authentication API
async function login(username, password) {
  await delay(150);
  const users = getTable('Users');
  const user = users.find(u => 
    u.Username.toLowerCase() === username.toLowerCase().trim() && 
    u.Password === password.trim()
  );
  if (!user) throw new Error('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
  if (user.Status !== 'Active') throw new Error('บัญชีผู้ใช้นี้ถูกระงับการใช้งาน');
  
  setCurrentUser(user);
  logAction(user.UserID, 'Authentication', 'Login', user.UserID, '', 'เข้าสู่ระบบสำเร็จ');
  return user;
}

async function logout() {
  const user = getCurrentUser();
  if (user) {
    logAction(user.UserID, 'Authentication', 'Logout', user.UserID, '', 'ออกจากระบบ');
  }
  setCurrentUser(null);
  await delay(50);
  return true;
}

// Departments API
async function getDepartments() {
  await delay(50);
  return getTable('Departments');
}

// Projects API
async function getProjects(filters = {}) {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');

  let list = getTable('Projects');
  const depts = getTable('Departments');

  // RBAC Constraint: Department Admin can access only own department data
  if (user.Role === 'Department Admin') {
    list = list.filter(p => p.DepartmentID === user.DepartmentID);
  }

  // Calculate finance details dynamically
  list = list.map(p => {
    const fin = calculateProjectFinance(p.ProjectID);
    const dept = depts.find(d => d.DepartmentID === p.DepartmentID);
    return {
      ...p,
      DepartmentCode: dept ? dept.DepartmentCode : '',
      DepartmentName: dept ? dept.DepartmentName : '',
      Revenue: fin.Revenue,
      Expense: fin.Expense,
      Profit: fin.Profit,
      GPPercent: fin.GPPercent
    };
  });

  // Apply filters
  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(p => 
      p.ProjectCode.toLowerCase().includes(q) || 
      p.ProjectName.toLowerCase().includes(q) || 
      p.ResponsiblePerson.toLowerCase().includes(q) ||
      (p.Customer && p.Customer.toLowerCase().includes(q))
    );
  }
  if (filters.fiscalYear) {
    list = list.filter(p => p.FiscalYear === filters.fiscalYear);
  }
  if (filters.planType) {
    list = list.filter(p => p.PlanType === filters.planType);
  }
  if (filters.departmentId) {
    list = list.filter(p => p.DepartmentID === parseInt(filters.departmentId));
  }
  if (filters.status) {
    list = list.filter(p => p.ProjectStatus === filters.status);
  }
  if (filters.projectType) {
    list = list.filter(p => p.ProjectType === filters.projectType);
  }

  return list;
}

async function getProjectDetails(id) {
  await delay(80);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');

  const projects = getTable('Projects');
  const project = projects.find(p => p.ProjectID === parseInt(id));
  if (!project) throw new Error('ไม่พบข้อมูลโครงการ');

  // RBAC Constraint
  if (user.Role === 'Department Admin' && project.DepartmentID !== user.DepartmentID) {
    throw new Error('คุณไม่มีสิทธิ์เข้าถึงข้อมูลโครงการของสาขาอื่น');
  }

  const fin = calculateProjectFinance(project.ProjectID);
  const dept = getTable('Departments').find(d => d.DepartmentID === project.DepartmentID);
  const progressList = getTable('ProjectProgress').filter(pr => pr.ProjectID === project.ProjectID);
  const documents = getTable('ProjectDocuments').filter(doc => doc.ProjectID === project.ProjectID);

  // Get current progress percentage (latest record)
  const latestProgress = progressList.length > 0 
    ? progressList.sort((a, b) => new Date(b.ProgressDate) - new Date(a.ProgressDate))[0]
    : null;

  return {
    ...project,
    DepartmentCode: dept ? dept.DepartmentCode : '',
    DepartmentName: dept ? dept.DepartmentName : '',
    Revenue: fin.Revenue,
    Expense: fin.Expense,
    Profit: fin.Profit,
    GPPercent: fin.GPPercent,
    Progress: latestProgress ? latestProgress.ProgressPercentage : 0,
    ProgressList: progressList,
    Documents: documents
  };
}

async function createProject(projectData) {
  await delay(120);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('สิทธิ์สำหรับดูข้อมูลเท่านั้น ไม่สามารถเพิ่มโครงการได้');
  
  const projects = getTable('Projects');
  const depts = getTable('Departments');
  
  const deptId = parseInt(projectData.DepartmentID);
  if (user.Role === 'Department Admin' && deptId !== user.DepartmentID) {
    throw new Error('ไม่สามารถสร้างโครงการนอกเหนือสาขาวิชาของคุณได้');
  }

  const dept = depts.find(d => d.DepartmentID === deptId);
  if (!dept) throw new Error('สาขาวิชาไม่ถูกต้อง');

  // Auto Generate Project Code: ASP-YYYY-DEPT-001
  let code = projectData.ProjectCode ? projectData.ProjectCode.trim() : '';
  if (!code) {
    const year = projectData.FiscalYear;
    const deptCode = dept.DepartmentCode;
    const yearProjects = projects.filter(p => p.FiscalYear === year && p.DepartmentID === deptId);
    const runningNumber = String(yearProjects.length + 1).padStart(3, '0');
    code = `ASP-${year}-${deptCode}-${runningNumber}`;
  }

  // Check unique code
  if (projects.some(p => p.ProjectCode === code)) {
    throw new Error(`รหัสโครงการ "${code}" ซ้ำซ้อนในระบบ กรุณาใช้รหัสอื่น`);
  }

  const newId = projects.length > 0 ? Math.max(...projects.map(p => p.ProjectID)) + 1 : 1;
  const newProject = {
    ProjectID: newId,
    DepartmentID: deptId,
    ProjectCode: code,
    ProjectName: projectData.ProjectName,
    FiscalYear: projectData.FiscalYear,
    ProjectType: projectData.ProjectType,
    Customer: projectData.Customer,
    ResponsiblePerson: projectData.ResponsiblePerson,
    Objective: projectData.Objective || '',
    Description: projectData.Description || '',
    StartDate: projectData.StartDate,
    EndDate: projectData.EndDate,
    ProjectStatus: 'Draft', // Default Status
    PlannedBudget: parseFloat(projectData.PlannedBudget) || 0,
    PlanType: projectData.PlanType || 'ตามแผน',
    IsFreeService: projectData.IsFreeService === true || projectData.IsFreeService === 'true',
    CreatedBy: user.UserID,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  projects.push(newProject);
  saveTable('Projects', projects);

  logAction(user.UserID, 'Projects', 'Create', newId, '', newProject);

  // Notify assistant deans
  const admins = getTable('Users').filter(u => u.Role === 'Assistant Dean' || u.Role === 'Dean');
  admins.forEach(adm => {
    createNotification(adm.UserID, 'โครงการใหม่ถูกสร้างขึ้น', `มีโครงการใหม่ "${newProject.ProjectName}" สร้างโดยสาขา ${dept.DepartmentCode}`, 'New Project');
  });

  return newProject;
}

async function updateProject(id, projectData) {
  await delay(120);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('สิทธิ์สำหรับดูข้อมูลเท่านั้น ไม่สามารถแก้ไขโครงการได้');

  const projects = getTable('Projects');
  const index = projects.findIndex(p => p.ProjectID === parseInt(id));
  if (index === -1) throw new Error('ไม่พบข้อมูลโครงการ');
  
  const oldProject = projects[index];
  if (user.Role === 'Department Admin' && oldProject.DepartmentID !== user.DepartmentID) {
    throw new Error('คุณไม่มีสิทธิ์แก้ไขโครงการของสาขาอื่น');
  }

  const newCode = projectData.ProjectCode ? projectData.ProjectCode.trim() : '';
  if (!newCode) throw new Error('รหัสโครงการห้ามปล่อยว่าง');
  
  // Verify code uniqueness if it changed
  if (newCode !== oldProject.ProjectCode && projects.some(p => p.ProjectCode === newCode)) {
    throw new Error(`รหัสโครงการ "${newCode}" ซ้ำซ้อนในระบบ กรุณาใช้รหัสอื่น`);
  }

  // Update allowed fields (Department cannot be changed, but Code can be changed now)
  const updatedProject = {
    ...oldProject,
    ProjectCode: newCode,
    ProjectName: projectData.ProjectName,
    ProjectType: projectData.ProjectType,
    Customer: projectData.Customer,
    ResponsiblePerson: projectData.ResponsiblePerson,
    Objective: projectData.Objective || '',
    Description: projectData.Description || '',
    StartDate: projectData.StartDate,
    EndDate: projectData.EndDate,
    ProjectStatus: projectData.ProjectStatus,
    PlannedBudget: parseFloat(projectData.PlannedBudget) || 0,
    PlanType: projectData.PlanType || 'ตามแผน',
    IsFreeService: projectData.IsFreeService === true || projectData.IsFreeService === 'true',
    UpdatedAt: new Date().toISOString()
  };

  projects[index] = updatedProject;
  saveTable('Projects', projects);

  logAction(user.UserID, 'Projects', 'Update', oldProject.ProjectID, oldProject, updatedProject);
  
  // Notify users
  createNotification(oldProject.CreatedBy, 'โครงการได้รับการอัปเดต', `โครงการ "${updatedProject.ProjectName}" ถูกอัปเดตข้อมูล`, 'Project Updated');

  return updatedProject;
}

// Project Progress API
async function addProjectProgress(progressData) {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('สิทธิ์สำหรับดูข้อมูลเท่านั้น ไม่สามารถบันทึกความก้าวหน้าได้');

  const projectId = parseInt(progressData.ProjectID);
  const projects = getTable('Projects');
  const projectIndex = projects.findIndex(p => p.ProjectID === projectId);
  if (projectIndex === -1) throw new Error('ไม่พบโครงการ');

  const project = projects[projectIndex];
  if (user.Role === 'Department Admin' && project.DepartmentID !== user.DepartmentID) {
    throw new Error('ไม่มีสิทธิ์เพิ่มความก้าวหน้าโครงการของสาขาวิชาอื่น');
  }

  const pct = parseInt(progressData.ProgressPercentage);
  if (isNaN(pct) || pct < 0 || pct > 100) {
    throw new Error('เปอร์เซ็นต์ความก้าวหน้าต้องอยู่ระหว่าง 0 ถึง 100');
  }

  const progressList = getTable('ProjectProgress');
  const newId = progressList.length > 0 ? Math.max(...progressList.map(p => p.ProgressID)) + 1 : 1;
  const newProgress = {
    ProgressID: newId,
    ProjectID: projectId,
    ProgressDate: progressData.ProgressDate || new Date().toISOString().split('T')[0],
    ProgressPercentage: pct,
    CurrentStatus: progressData.CurrentStatus || project.ProjectStatus,
    CurrentActivity: progressData.CurrentActivity || '',
    Problems: progressData.Problems || '',
    Solutions: progressData.Solutions || '',
    NextAction: progressData.NextAction || '',
    Remark: progressData.Remark || '',
    UpdatedBy: user.UserID,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  progressList.push(newProgress);
  saveTable('ProjectProgress', progressList);

  // Auto Update project status and timeline status
  const originalStatus = project.ProjectStatus;
  project.ProjectStatus = newProgress.CurrentStatus;
  
  // If progress is 100%, status automatically completed
  if (pct === 100) {
    project.ProjectStatus = 'Completed';
  }
  
  project.UpdatedAt = new Date().toISOString();
  projects[projectIndex] = project;
  saveTable('Projects', projects);

  logAction(user.UserID, 'ProjectProgress', 'Create', newId, '', newProgress);

  if (originalStatus !== project.ProjectStatus) {
    logAction(user.UserID, 'Projects', 'StatusUpdate', project.ProjectID, originalStatus, project.ProjectStatus);
    // Notify
    const admins = getTable('Users').filter(u => u.Role === 'Assistant Dean');
    admins.forEach(adm => {
      createNotification(adm.UserID, 'สถานะโครงการเปลี่ยนไป', `โครงการ "${project.ProjectName}" เปลี่ยนสถานะเป็น ${project.ProjectStatus}`, 'Project Updated');
    });
  }

  return newProgress;
}

// Finance Transactions API (Revenue & Expense)
async function getRevenueTransactions(filters = {}) {
  await delay(80);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');

  let list = getTable('RevenueTransactions');
  const projects = getTable('Projects');

  list = list.map(r => {
    const proj = projects.find(p => p.ProjectID === r.ProjectID);
    return {
      ...r,
      ProjectCode: proj ? proj.ProjectCode : '',
      ProjectName: proj ? proj.ProjectName : '',
      DepartmentID: proj ? proj.DepartmentID : null,
      FiscalYear: proj ? proj.FiscalYear : ''
    };
  });

  // Role Constraint
  if (user.Role === 'Department Admin') {
    list = list.filter(r => r.DepartmentID === user.DepartmentID);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(r => 
      r.ReceiptNumber.toLowerCase().includes(q) || 
      r.Description.toLowerCase().includes(q) || 
      r.ProjectCode.toLowerCase().includes(q) || 
      r.ProjectName.toLowerCase().includes(q)
    );
  }
  if (filters.projectId) {
    list = list.filter(r => r.ProjectID === parseInt(filters.projectId));
  }
  if (filters.departmentId) {
    list = list.filter(r => r.DepartmentID === parseInt(filters.departmentId));
  }
  if (filters.fiscalYear) {
    list = list.filter(r => r.FiscalYear === filters.fiscalYear);
  }
  if (filters.revenueType) {
    list = list.filter(r => r.RevenueType === filters.revenueType);
  }

  return list;
}

async function addRevenueTransaction(txData) {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('ไม่มีสิทธิ์เพิ่มรายการรายรับ');

  const projectId = parseInt(txData.ProjectID);
  const projects = getTable('Projects');
  const project = projects.find(p => p.ProjectID === projectId);
  if (!project) throw new Error('ไม่พบข้อมูลโครงการ');

  if (user.Role === 'Department Admin' && project.DepartmentID !== user.DepartmentID) {
    throw new Error('คุณไม่มีสิทธิ์บันทึกรายรับของโครงการนอกสาขาวิชาของคุณ');
  }

  const amt = parseFloat(txData.Amount);
  if (isNaN(amt) || amt < 0) {
    throw new Error('ยอดเงินรายรับต้องไม่ต่ำกว่าศูนย์');
  }

  const list = getTable('RevenueTransactions');
  const newId = list.length > 0 ? Math.max(...list.map(r => r.RevenueID)) + 1 : 1;
  const newTx = {
    RevenueID: newId,
    ProjectID: projectId,
    TransactionDate: txData.TransactionDate,
    ReceiptNumber: txData.ReceiptNumber,
    RevenueType: txData.RevenueType,
    Description: txData.Description || '',
    Amount: amt,
    Remark: txData.Remark || '',
    CreatedBy: user.UserID,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  list.push(newTx);
  saveTable('RevenueTransactions', list);

  logAction(user.UserID, 'RevenueTransactions', 'Create', newId, '', newTx);

  // Notify assistant deans
  const adeans = getTable('Users').filter(u => u.Role === 'Assistant Dean');
  adeans.forEach(ad => {
    createNotification(ad.UserID, 'บันทึกรายรับโครงการใหม่', `มีการเพิ่มรายรับ ${amt.toLocaleString()} บาท ในโครงการ "${project.ProjectName}"`, 'Revenue Updated');
  });

  return newTx;
}

async function editRevenueTransaction(id, txData) {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('ไม่มีสิทธิ์แก้ไขรายการรายรับ');

  const list = getTable('RevenueTransactions');
  const index = list.findIndex(r => r.RevenueID === parseInt(id));
  if (index === -1) throw new Error('ไม่พบรายการ');

  const oldTx = list[index];
  const project = getTable('Projects').find(p => p.ProjectID === oldTx.ProjectID);
  
  if (user.Role === 'Department Admin' && project.DepartmentID !== user.DepartmentID) {
    throw new Error('ไม่มีสิทธิ์แก้ไขรายการการเงินนอกสาขาวิชา');
  }

  const amt = parseFloat(txData.Amount);
  if (isNaN(amt) || amt < 0) {
    throw new Error('ยอดเงินรายรับต้องไม่ต่ำกว่าศูนย์');
  }

  const updatedTx = {
    ...oldTx,
    TransactionDate: txData.TransactionDate,
    ReceiptNumber: txData.ReceiptNumber,
    RevenueType: txData.RevenueType,
    Description: txData.Description || '',
    Amount: amt,
    Remark: txData.Remark || '',
    UpdatedAt: new Date().toISOString()
  };

  list[index] = updatedTx;
  saveTable('RevenueTransactions', list);

  logAction(user.UserID, 'RevenueTransactions', 'Update', oldTx.RevenueID, oldTx, updatedTx);
  return updatedTx;
}

async function deleteRevenueTransaction(id) {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('ไม่มีสิทธิ์ลบรายการรายรับ');

  const list = getTable('RevenueTransactions');
  const index = list.findIndex(r => r.RevenueID === parseInt(id));
  if (index === -1) throw new Error('ไม่พบรายการ');

  const oldTx = list[index];
  const project = getTable('Projects').find(p => p.ProjectID === oldTx.ProjectID);
  
  if (user.Role === 'Department Admin' && project.DepartmentID !== user.DepartmentID) {
    throw new Error('ไม่มีสิทธิ์ลบรายการการเงินนอกสาขาวิชา');
  }

  list.splice(index, 1);
  saveTable('RevenueTransactions', list);

  logAction(user.UserID, 'RevenueTransactions', 'Delete', oldTx.RevenueID, oldTx, 'Deleted');
  return true;
}

// Expense Transactions
async function getExpenseTransactions(filters = {}) {
  await delay(80);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');

  let list = getTable('ExpenseTransactions');
  const projects = getTable('Projects');

  list = list.map(e => {
    const proj = projects.find(p => p.ProjectID === e.ProjectID);
    return {
      ...e,
      ProjectCode: proj ? proj.ProjectCode : '',
      ProjectName: proj ? proj.ProjectName : '',
      DepartmentID: proj ? proj.DepartmentID : null,
      FiscalYear: proj ? proj.FiscalYear : ''
    };
  });

  // Role Constraint
  if (user.Role === 'Department Admin') {
    list = list.filter(e => e.DepartmentID === user.DepartmentID);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(e => 
      e.ExpenseNumber.toLowerCase().includes(q) || 
      e.Description.toLowerCase().includes(q) || 
      e.ProjectCode.toLowerCase().includes(q) || 
      e.ProjectName.toLowerCase().includes(q)
    );
  }
  if (filters.projectId) {
    list = list.filter(e => e.ProjectID === parseInt(filters.projectId));
  }
  if (filters.departmentId) {
    list = list.filter(e => e.DepartmentID === parseInt(filters.departmentId));
  }
  if (filters.fiscalYear) {
    list = list.filter(e => e.FiscalYear === filters.fiscalYear);
  }
  if (filters.expenseType) {
    list = list.filter(e => e.ExpenseType === filters.expenseType);
  }

  return list;
}

async function addExpenseTransaction(txData) {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('ไม่มีสิทธิ์เพิ่มรายการรายจ่าย');

  const projectId = parseInt(txData.ProjectID);
  const projects = getTable('Projects');
  const project = projects.find(p => p.ProjectID === projectId);
  if (!project) throw new Error('ไม่พบข้อมูลโครงการ');

  if (user.Role === 'Department Admin' && project.DepartmentID !== user.DepartmentID) {
    throw new Error('คุณไม่มีสิทธิ์บันทึกรายจ่ายของโครงการนอกสาขาวิชาของคุณ');
  }

  const amt = parseFloat(txData.Amount);
  if (isNaN(amt) || amt < 0) {
    throw new Error('ยอดเงินรายจ่ายต้องไม่ต่ำกว่าศูนย์');
  }

  const list = getTable('ExpenseTransactions');
  const newId = list.length > 0 ? Math.max(...list.map(e => e.ExpenseID)) + 1 : 1;
  const newTx = {
    ExpenseID: newId,
    ProjectID: projectId,
    TransactionDate: txData.TransactionDate,
    ExpenseNumber: txData.ExpenseNumber,
    ExpenseType: txData.ExpenseType,
    Description: txData.Description || '',
    Amount: amt,
    Remark: txData.Remark || '',
    CreatedBy: user.UserID,
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  list.push(newTx);
  saveTable('ExpenseTransactions', list);

  logAction(user.UserID, 'ExpenseTransactions', 'Create', newId, '', newTx);

  const adeans = getTable('Users').filter(u => u.Role === 'Assistant Dean');
  adeans.forEach(ad => {
    createNotification(ad.UserID, 'บันทึกรายจ่ายโครงการใหม่', `มีการเพิ่มรายจ่าย ${amt.toLocaleString()} บาท ในโครงการ "${project.ProjectName}"`, 'Expense Updated');
  });

  return newTx;
}

async function editExpenseTransaction(id, txData) {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('ไม่มีสิทธิ์แก้ไขรายการรายจ่าย');

  const list = getTable('ExpenseTransactions');
  const index = list.findIndex(e => e.ExpenseID === parseInt(id));
  if (index === -1) throw new Error('ไม่พบรายการ');

  const oldTx = list[index];
  const project = getTable('Projects').find(p => p.ProjectID === oldTx.ProjectID);
  
  if (user.Role === 'Department Admin' && project.DepartmentID !== user.DepartmentID) {
    throw new Error('ไม่มีสิทธิ์แก้ไขรายการการเงินนอกสาขาวิชา');
  }

  const amt = parseFloat(txData.Amount);
  if (isNaN(amt) || amt < 0) {
    throw new Error('ยอดเงินรายจ่ายต้องไม่ต่ำกว่าศูนย์');
  }

  const updatedTx = {
    ...oldTx,
    TransactionDate: txData.TransactionDate,
    ExpenseNumber: txData.ExpenseNumber,
    ExpenseType: txData.ExpenseType,
    Description: txData.Description || '',
    Amount: amt,
    Remark: txData.Remark || '',
    UpdatedAt: new Date().toISOString()
  };

  list[index] = updatedTx;
  saveTable('ExpenseTransactions', list);

  logAction(user.UserID, 'ExpenseTransactions', 'Update', oldTx.ExpenseID, oldTx, updatedTx);
  return updatedTx;
}

async function deleteExpenseTransaction(id) {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('ไม่มีสิทธิ์ลบรายการรายจ่าย');

  const list = getTable('ExpenseTransactions');
  const index = list.findIndex(e => e.ExpenseID === parseInt(id));
  if (index === -1) throw new Error('ไม่พบรายการ');

  const oldTx = list[index];
  const project = getTable('Projects').find(p => p.ProjectID === oldTx.ProjectID);
  
  if (user.Role === 'Department Admin' && project.DepartmentID !== user.DepartmentID) {
    throw new Error('ไม่มีสิทธิ์ลบรายการการเงินนอกสาขาวิชา');
  }

  list.splice(index, 1);
  saveTable('ExpenseTransactions', list);

  logAction(user.UserID, 'ExpenseTransactions', 'Delete', oldTx.ExpenseID, oldTx, 'Deleted');
  return true;
}

// Dashboards API
async function getFacultyDashboard(filters = {}) {
  await delay(150);
  const projects = getTable('Projects');
  const departments = getTable('Departments');
  
  let targetYear = filters.fiscalYear || '2569';
  let activeProjects = projects.filter(p => p.FiscalYear === targetYear);

  if (filters.departmentId) {
    activeProjects = activeProjects.filter(p => p.DepartmentID === parseInt(filters.departmentId));
  }

  let totalProjects = activeProjects.length;
  let plannedBudget = activeProjects.reduce((sum, p) => sum + p.PlannedBudget, 0);

  // Compute financials dynamically
  let totalRevenue = 0;
  let totalExpense = 0;
  let commercialRevenue = 0;
  let commercialExpense = 0;
  let csrExpense = 0;

  activeProjects.forEach(p => {
    const fin = calculateProjectFinance(p.ProjectID);
    totalRevenue += fin.Revenue;
    totalExpense += fin.Expense;

    if (p.IsFreeService === true || p.IsFreeService === 'true') {
      csrExpense += fin.Expense;
    } else {
      commercialRevenue += fin.Revenue;
      commercialExpense += fin.Expense;
    }
  });

  const profit = totalRevenue - totalExpense;
  const commercialProfit = commercialRevenue - commercialExpense;
  const gpPercent = commercialRevenue > 0 ? (commercialProfit / commercialRevenue) * 100 : 0;

  // Status counters
  const statusCounts = {
    Draft: activeProjects.filter(p => p.ProjectStatus === 'Draft').length,
    Planned: activeProjects.filter(p => p.ProjectStatus === 'Planned').length,
    'In Progress': activeProjects.filter(p => p.ProjectStatus === 'In Progress').length,
    Completed: activeProjects.filter(p => p.ProjectStatus === 'Completed').length,
    Delayed: activeProjects.filter(p => p.ProjectStatus === 'Delayed').length,
    Cancelled: activeProjects.filter(p => p.ProjectStatus === 'Cancelled').length
  };

  // Department-wise summary
  const departmentSummaries = departments.map(d => {
    const deptProjects = projects.filter(p => p.DepartmentID === d.DepartmentID && p.FiscalYear === targetYear);
    let deptRev = 0;
    let deptExp = 0;
    let deptCommRev = 0;
    let deptCommExp = 0;
    let deptCsrExp = 0;

    deptProjects.forEach(p => {
      const fin = calculateProjectFinance(p.ProjectID);
      deptRev += fin.Revenue;
      deptExp += fin.Expense;

      if (p.IsFreeService === true || p.IsFreeService === 'true') {
        deptCsrExp += fin.Expense;
      } else {
        deptCommRev += fin.Revenue;
        deptCommExp += fin.Expense;
      }
    });
    const deptProf = deptRev - deptExp;
    const deptCommProf = deptCommRev - deptCommExp;
    return {
      DepartmentID: d.DepartmentID,
      DepartmentCode: d.DepartmentCode,
      DepartmentName: d.DepartmentName,
      ProjectCount: deptProjects.length,
      Revenue: deptRev,
      Expense: deptExp,
      Profit: deptProf,
      CSRExpense: deptCsrExp,
      GPPercent: deptCommRev > 0 ? (deptCommProf / deptCommRev) * 100 : 0
    };
  });

  // Calculate actual achievements compared to targets
  const targets = getTable('KPIPlan').filter(t => t.FiscalYear === targetYear);
  const targetBudget = targets.reduce((sum, t) => sum + t.TargetBudget, 0);
  const targetRevenue = targets.reduce((sum, t) => sum + t.TargetRevenue, 0);
  const targetExpense = targets.reduce((sum, t) => sum + t.TargetExpense, 0);
  const targetProfit = targets.reduce((sum, t) => sum + t.TargetProfit, 0);

  return {
    TotalProjects: totalProjects,
    PlannedBudget: plannedBudget,
    Revenue: totalRevenue,
    Expense: totalExpense,
    Profit: profit,
    GPPercent: gpPercent,
    CSRExpense: csrExpense,
    CompletedProjects: statusCounts.Completed,
    RunningProjects: statusCounts['In Progress'],
    DelayedProjects: statusCounts.Delayed,
    CancelledProjects: statusCounts.Cancelled,
    StatusCounts: statusCounts,
    DepartmentSummaries: departmentSummaries,
    TargetBudget: targetBudget,
    TargetRevenue: targetRevenue,
    TargetExpense: targetExpense,
    TargetProfit: targetProfit,
    BudgetAchievement: targetBudget > 0 ? (plannedBudget / targetBudget) * 100 : 0,
    RevenueAchievement: targetRevenue > 0 ? (totalRevenue / targetRevenue) * 100 : 0,
    ProfitAchievement: targetProfit > 0 ? (profit / targetProfit) * 100 : 0
  };
}

async function getDepartmentDashboard(deptId, filters = {}) {
  await delay(120);
  const projects = getTable('Projects').filter(p => p.DepartmentID === deptId);
  const depts = getTable('Departments');
  const dept = depts.find(d => d.DepartmentID === deptId);

  let targetYear = filters.fiscalYear || '2569';
  let activeProjects = projects.filter(p => p.FiscalYear === targetYear);

  let totalProjects = activeProjects.length;
  let plannedBudget = activeProjects.reduce((sum, p) => sum + p.PlannedBudget, 0);

  let totalRevenue = 0;
  let totalExpense = 0;
  let commercialRevenue = 0;
  let commercialExpense = 0;
  let csrExpense = 0;

  const projectSummaries = activeProjects.map(p => {
    const fin = calculateProjectFinance(p.ProjectID);
    totalRevenue += fin.Revenue;
    totalExpense += fin.Expense;

    if (p.IsFreeService === true || p.IsFreeService === 'true') {
      csrExpense += fin.Expense;
    } else {
      commercialRevenue += fin.Revenue;
      commercialExpense += fin.Expense;
    }

    return {
      ProjectID: p.ProjectID,
      ProjectCode: p.ProjectCode,
      ProjectName: p.ProjectName,
      ResponsiblePerson: p.ResponsiblePerson,
      Status: p.ProjectStatus,
      PlannedBudget: p.PlannedBudget,
      Revenue: fin.Revenue,
      Expense: fin.Expense,
      Profit: fin.Profit,
      GPPercent: fin.GPPercent,
      PlanType: p.PlanType || 'ตามแผน',
      IsFreeService: !!p.IsFreeService
    };
  });

  const profit = totalRevenue - totalExpense;
  const commercialProfit = commercialRevenue - commercialExpense;
  const gpPercent = commercialRevenue > 0 ? (commercialProfit / commercialRevenue) * 100 : 0;

  const statusCounts = {
    Completed: activeProjects.filter(p => p.ProjectStatus === 'Completed').length,
    'In Progress': activeProjects.filter(p => p.ProjectStatus === 'In Progress').length,
    Delayed: activeProjects.filter(p => p.ProjectStatus === 'Delayed').length,
    Cancelled: activeProjects.filter(p => p.ProjectStatus === 'Cancelled').length
  };

  // Department KPI Targets
  const target = getTable('KPIPlan').find(t => t.DepartmentID === deptId && t.FiscalYear === targetYear);

  return {
    DepartmentName: dept ? dept.DepartmentName : '',
    DepartmentCode: dept ? dept.DepartmentCode : '',
    TotalProjects: totalProjects,
    PlannedBudget: plannedBudget,
    Revenue: totalRevenue,
    Expense: totalExpense,
    Profit: profit,
    GPPercent: gpPercent,
    CSRExpense: csrExpense,
    CompletedProjects: statusCounts.Completed,
    RunningProjects: statusCounts['In Progress'],
    DelayedProjects: statusCounts.Delayed,
    StatusCounts: statusCounts,
    ProjectSummaries: projectSummaries,
    Target: target || null,
    BudgetAchievement: target && target.TargetBudget > 0 ? (plannedBudget / target.TargetBudget) * 100 : 0,
    RevenueAchievement: target && target.TargetRevenue > 0 ? (totalRevenue / target.TargetRevenue) * 100 : 0,
    ProfitAchievement: target && target.TargetProfit > 0 ? (profit / target.TargetProfit) * 100 : 0
  };
}

// Reports API
async function getReportData(filters = {}) {
  await delay(100);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');

  let list = getTable('Projects');
  const depts = getTable('Departments');

  // Role Constraint
  if (user.Role === 'Department Admin') {
    list = list.filter(p => p.DepartmentID === user.DepartmentID);
  }

  if (filters.departmentId) {
    list = list.filter(p => p.DepartmentID === parseInt(filters.departmentId));
  }
  if (filters.fiscalYear) {
    list = list.filter(p => p.FiscalYear === filters.fiscalYear);
  }
  if (filters.status) {
    list = list.filter(p => p.ProjectStatus === filters.status);
  }
  if (filters.responsiblePerson) {
    list = list.filter(p => p.ResponsiblePerson.includes(filters.responsiblePerson));
  }

  // Map financial calculations
  return list.map(p => {
    const fin = calculateProjectFinance(p.ProjectID);
    const d = depts.find(dept => dept.DepartmentID === p.DepartmentID);
    return {
      ProjectCode: p.ProjectCode,
      ProjectName: p.ProjectName,
      DepartmentCode: d ? d.DepartmentCode : '',
      FiscalYear: p.FiscalYear,
      ResponsiblePerson: p.ResponsiblePerson,
      Status: p.ProjectStatus,
      PlannedBudget: p.PlannedBudget,
      Revenue: fin.Revenue,
      Expense: fin.Expense,
      Profit: fin.Profit,
      GPPercent: fin.GPPercent,
      IsFreeService: !!p.IsFreeService
    };
  });
}

async function getMonthlyPerformance(filters = {}) {
  await delay(120);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');

  const projects = getTable('Projects');
  const revenueTrans = getTable('RevenueTransactions');
  const expenseTrans = getTable('ExpenseTransactions');
  const depts = getTable('Departments');

  const targetYear = filters.fiscalYear || '2569';
  const startYearGregorian = parseInt(targetYear) - 543;

  // Thai Month names index starting from 0 to 11
  const TH_MONTH_NAMES = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  // 12 Months of the Fiscal Year: June (startYearGregorian) to May (startYearGregorian + 1)
  const monthlyList = [];
  for (let i = 0; i < 12; i++) {
    // Month sequence: June (5), July (6), ..., Dec (11), Jan (0), ..., May (4)
    const monthIdx = (i + 5) % 12;
    const year = monthIdx >= 5 ? startYearGregorian : startYearGregorian + 1;
    const thaiYear = year + 543;
    const monthNum = monthIdx + 1;

    // Get last day of the month
    const lastDay = new Date(year, monthNum, 0).getDate();
    const startDateStr = `${year}-${String(monthNum).padStart(2, '0')}-01`;
    const endDateStr = `${year}-${String(monthNum).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

    monthlyList.push({
      monthIndex: i,
      monthName: `${TH_MONTH_NAMES[monthIdx]} ${thaiYear}`,
      startDateStr,
      endDateStr
    });
  }

  // Filter projects by user role (RBAC) and selected department / planType
  let filteredProjects = projects.filter(p => p.FiscalYear === targetYear);

  if (user.Role === 'Department Admin') {
    filteredProjects = filteredProjects.filter(p => p.DepartmentID === user.DepartmentID);
  }
  if (filters.departmentId) {
    filteredProjects = filteredProjects.filter(p => p.DepartmentID === parseInt(filters.departmentId));
  }
  if (filters.planType) {
    filteredProjects = filteredProjects.filter(p => p.PlanType === filters.planType);
  }

  const projectIds = filteredProjects.map(p => p.ProjectID);

  // Compute stats for each of the 12 months
  const monthlyPerformance = monthlyList.map(month => {
    // 1. Count active projects in this month:
    const activeProjectsInMonth = filteredProjects.filter(p => {
      return p.StartDate <= month.endDateStr && p.EndDate >= month.startDateStr;
    });

    // 2. Sum Revenue transactions in this month
    const revs = revenueTrans.filter(r => {
      return projectIds.includes(r.ProjectID) && 
             r.TransactionDate >= month.startDateStr && 
             r.TransactionDate <= month.endDateStr;
    });
    const monthlyRev = revs.reduce((sum, r) => sum + r.Amount, 0);

    // 3. Sum Expense transactions in this month
    const exps = expenseTrans.filter(e => {
      return projectIds.includes(e.ProjectID) && 
             e.TransactionDate >= month.startDateStr && 
             e.TransactionDate <= month.endDateStr;
    });
    const monthlyExp = exps.reduce((sum, e) => sum + e.Amount, 0);

    // 4. Sum Commercial vs CSR financials for GP% and CSR calculations
    let commercialRev = 0;
    let commercialExp = 0;
    let csrExp = 0;

    revs.forEach(r => {
      const proj = filteredProjects.find(p => p.ProjectID === r.ProjectID);
      if (proj && !proj.IsFreeService) {
        commercialRev += r.Amount;
      }
    });

    exps.forEach(e => {
      const proj = filteredProjects.find(p => p.ProjectID === e.ProjectID);
      if (proj) {
        if (proj.IsFreeService) {
          csrExp += e.Amount;
        } else {
          commercialExp += e.Amount;
        }
      }
    });

    const commercialProfit = commercialRev - commercialExp;
    const monthlyProfit = monthlyRev - monthlyExp;
    const gpPercent = commercialRev > 0 ? (commercialProfit / commercialRev) * 100 : 0;

    return {
      MonthName: month.MonthName || month.monthName,
      ActiveProjectsCount: activeProjectsInMonth.length,
      Revenue: monthlyRev,
      Expense: monthlyExp,
      Profit: monthlyProfit,
      GPPercent: gpPercent,
      CSRExpense: csrExp
    };
  });

  return monthlyPerformance;
}

// User Management API
async function getUsers() {
  await delay(50);
  const depts = getTable('Departments');
  return getTable('Users').map(u => {
    const d = depts.find(dept => dept.DepartmentID === u.DepartmentID);
    return {
      ...u,
      DepartmentCode: d ? d.DepartmentCode : 'ส่วนกลาง'
    };
  });
}

async function createUser(userData) {
  await delay(100);
  const user = getCurrentUser();
  if (!user || user.Role !== 'Assistant Dean') throw new Error('ไม่มีสิทธิ์จัดการข้อมูลผู้ใช้งาน');

  const users = getTable('Users');
  if (users.some(u => u.Username === userData.Username)) {
    throw new Error('ชื่อผู้ใช้งานซ้ำในระบบ');
  }
  if (users.some(u => u.EmployeeID === userData.EmployeeID)) {
    throw new Error('รหัสพนักงานซ้ำในระบบ');
  }

  const newId = users.length > 0 ? Math.max(...users.map(u => u.UserID)) + 1 : 1;
  const newUser = {
    UserID: newId,
    DepartmentID: userData.DepartmentID ? parseInt(userData.DepartmentID) : null,
    EmployeeID: userData.EmployeeID,
    Username: userData.Username,
    Password: userData.Password || 'password123',
    FullName: userData.FullName,
    Email: userData.Email,
    Phone: userData.Phone,
    Role: userData.Role,
    Status: 'Active',
    CreatedAt: new Date().toISOString(),
    UpdatedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveTable('Users', users);

  logAction(user.UserID, 'Users', 'Create', newId, '', newUser);
  return newUser;
}

async function updateUser(id, userData) {
  await delay(100);
  const user = getCurrentUser();
  if (!user || user.Role !== 'Assistant Dean') throw new Error('ไม่มีสิทธิ์จัดการข้อมูลผู้ใช้งาน');

  const users = getTable('Users');
  const index = users.findIndex(u => u.UserID === parseInt(id));
  if (index === -1) throw new Error('ไม่พบข้อมูลผู้ใช้');

  const oldUser = users[index];

  const updatedUser = {
    ...oldUser,
    DepartmentID: userData.DepartmentID ? parseInt(userData.DepartmentID) : null,
    FullName: userData.FullName,
    Email: userData.Email,
    Phone: userData.Phone,
    Role: userData.Role,
    Status: userData.Status,
    UpdatedAt: new Date().toISOString()
  };

  if (userData.Password) {
    updatedUser.Password = userData.Password;
  }

  users[index] = updatedUser;
  saveTable('Users', users);

  // If the updated user is the current logged-in user, update the active session
  if (user && user.UserID === updatedUser.UserID) {
    setCurrentUser(updatedUser);
  }

  logAction(user.UserID, 'Users', 'Update', oldUser.UserID, oldUser, updatedUser);
  return updatedUser;
}

// Master Settings API
async function getKPITargets(year) {
  await delay(50);
  const list = getTable('KPIPlan').filter(t => t.FiscalYear === year);
  const depts = getTable('Departments');

  return depts.map(d => {
    const t = list.find(item => item.DepartmentID === d.DepartmentID);
    return {
      DepartmentID: d.DepartmentID,
      DepartmentCode: d.DepartmentCode,
      DepartmentName: d.DepartmentName,
      KPIID: t ? t.KPIID : null,
      TargetProjects: t ? t.TargetProjects : 0,
      TargetBudget: t ? t.TargetBudget : 0,
      TargetRevenue: t ? t.TargetRevenue : 0,
      TargetExpense: t ? t.TargetExpense : 0,
      TargetProfit: t ? t.TargetProfit : 0,
      TargetGPPercent: t ? t.TargetGPPercent : 0
    };
  });
}

async function saveKPITargets(year, targetsList) {
  await delay(100);
  const user = getCurrentUser();
  if (!user || user.Role !== 'Assistant Dean') throw new Error('ไม่มีสิทธิ์แก้ไขแผน KPI ของคณะ');

  const fullList = getTable('KPIPlan');

  targetsList.forEach(t => {
    const existingIndex = fullList.findIndex(item => item.FiscalYear === year && item.DepartmentID === parseInt(t.DepartmentID));
    
    if (existingIndex > -1) {
      const oldVal = fullList[existingIndex];
      fullList[existingIndex] = {
        ...oldVal,
        TargetProjects: parseInt(t.TargetProjects) || 0,
        TargetBudget: parseFloat(t.TargetBudget) || 0,
        TargetRevenue: parseFloat(t.TargetRevenue) || 0,
        TargetExpense: parseFloat(t.TargetExpense) || 0,
        TargetProfit: parseFloat(t.TargetProfit) || 0,
        TargetGPPercent: parseFloat(t.TargetGPPercent) || 0,
        UpdatedAt: new Date().toISOString()
      };
      logAction(user.UserID, 'KPIPlan', 'Update', oldVal.KPIID, oldVal, fullList[existingIndex]);
    } else {
      const newId = fullList.length > 0 ? Math.max(...fullList.map(item => item.KPIID)) + 1 : 1;
      const newItem = {
        KPIID: newId,
        FiscalYear: year,
        DepartmentID: parseInt(t.DepartmentID),
        TargetProjects: parseInt(t.TargetProjects) || 0,
        TargetBudget: parseFloat(t.TargetBudget) || 0,
        TargetRevenue: parseFloat(t.TargetRevenue) || 0,
        TargetExpense: parseFloat(t.TargetExpense) || 0,
        TargetProfit: parseFloat(t.TargetProfit) || 0,
        TargetGPPercent: parseFloat(t.TargetGPPercent) || 0,
        CreatedBy: user.UserID,
        CreatedAt: new Date().toISOString(),
        UpdatedAt: new Date().toISOString()
      };
      fullList.push(newItem);
      logAction(user.UserID, 'KPIPlan', 'Create', newId, '', newItem);
    }
  });

  saveTable('KPIPlan', fullList);
  return true;
}

// Notifications API
async function getNotifications() {
  const user = getCurrentUser();
  if (!user) return [];
  const list = getTable('Notifications').filter(n => n.UserID === user.UserID);
  return list.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
}

async function markNotificationRead(id) {
  const list = getTable('Notifications');
  const index = list.findIndex(n => n.NotificationID === parseInt(id));
  if (index > -1) {
    list[index].Status = 'Read';
    list[index].ReadAt = new Date().toISOString();
    saveTable('Notifications', list);
    return true;
  }
  return false;
}

// Audit Logs API
async function getAuditLogs() {
  await delay(80);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  let logs = getTable('AuditLogs');
  const users = getTable('Users');
  
  return logs.map(l => {
    const u = users.find(usr => usr.UserID === l.UserID);
    return {
      ...l,
      UserFullName: u ? u.FullName : 'ไม่ระบุผู้ใช้',
      UserRole: u ? u.Role : ''
    };
  }).sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
}

// Upload Documents Mock API
async function uploadDocument(projectId, docName, fileType, fileName, fileSize) {
  await delay(120);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('ไม่มีสิทธิ์อัปโหลดเอกสาร');

  const list = getTable('ProjectDocuments');
  const newId = list.length > 0 ? Math.max(...list.map(d => d.DocumentID)) + 1 : 1;
  const newDoc = {
    DocumentID: newId,
    ProjectID: parseInt(projectId),
    DocumentName: docName,
    DocumentType: fileType,
    FileName: fileName,
    FilePath: `/uploads/${fileName}`,
    FileSize: fileSize || 1024 * 100,
    UploadedBy: user.FullName,
    UploadDate: new Date().toISOString().split('T')[0]
  };

  list.push(newDoc);
  saveTable('ProjectDocuments', list);

  logAction(user.UserID, 'ProjectDocuments', 'Upload', newId, '', newDoc);
  return newDoc;
}

async function deleteDocument(id) {
  await delay(80);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role === 'Dean') throw new Error('ไม่มีสิทธิ์ลบเอกสาร');

  const list = getTable('ProjectDocuments');
  const index = list.findIndex(d => d.DocumentID === parseInt(id));
  if (index === -1) throw new Error('ไม่พบเอกสาร');

  const oldDoc = list[index];
  list.splice(index, 1);
  saveTable('ProjectDocuments', list);

  logAction(user.UserID, 'ProjectDocuments', 'Delete', oldDoc.DocumentID, oldDoc, 'Deleted');
  return true;
}

async function deleteProject(id) {
  await delay(120);
  const user = getCurrentUser();
  if (!user) throw new Error('กรุณาเข้าสู่ระบบ');
  if (user.Role !== 'Assistant Dean') throw new Error('ไม่มีสิทธิ์ลบโครงการ (สิทธิ์นี้เฉพาะผู้ช่วยคณบดีเท่านั้น)');

  const projectId = parseInt(id);

  // 1. Delete from Projects table
  const projects = getTable('Projects');
  const index = projects.findIndex(p => p.ProjectID === projectId);
  if (index === -1) throw new Error('ไม่พบโครงการที่ต้องการลบ');

  const oldProject = projects[index];
  projects.splice(index, 1);
  saveTable('Projects', projects);

  // 2. Cascade delete from RevenueTransactions
  const revenueTrans = getTable('RevenueTransactions');
  const filteredRevs = revenueTrans.filter(r => r.ProjectID !== projectId);
  saveTable('RevenueTransactions', filteredRevs);

  // 3. Cascade delete from ExpenseTransactions
  const expenseTrans = getTable('ExpenseTransactions');
  const filteredExps = expenseTrans.filter(e => e.ProjectID !== projectId);
  saveTable('ExpenseTransactions', filteredExps);

  // 4. Cascade delete from ProjectProgress
  const progresses = getTable('ProjectProgress');
  const filteredProgs = progresses.filter(p => p.ProjectID !== projectId);
  saveTable('ProjectProgress', filteredProgs);

  // 5. Cascade delete from ProjectDocuments
  const docs = getTable('ProjectDocuments');
  const filteredDocs = docs.filter(d => d.ProjectID !== projectId);
  saveTable('ProjectDocuments', filteredDocs);

  // 6. Log Audit Log Action
  logAction(user.UserID, 'Projects', 'Delete', projectId, oldProject, 'Deleted Project along with all transactions and documents');

  return true;
}

async function clearAuditLogs() {
  await delay(100);
  const user = getCurrentUser();
  if (!user || user.Role !== 'Assistant Dean') throw new Error('ไม่มีสิทธิ์ล้างประวัติการทำงาน');

  saveTable('AuditLogs', []);
  return true;
}

window.ASPMS_API = {
  deleteProject,
  clearAuditLogs,
  getCurrentUser,
  setCurrentUser,
  calculateProjectFinance,
  login,
  logout,
  getDepartments,
  getProjects,
  getProjectDetails,
  createProject,
  updateProject,
  addProjectProgress,
  getRevenueTransactions,
  addRevenueTransaction,
  editRevenueTransaction,
  deleteRevenueTransaction,
  getExpenseTransactions,
  addExpenseTransaction,
  editExpenseTransaction,
  deleteExpenseTransaction,
  getFacultyDashboard,
  getDepartmentDashboard,
  getReportData,
  getMonthlyPerformance,
  getUsers,
  createUser,
  updateUser,
  getKPITargets,
  saveKPITargets,
  getNotifications,
  markNotificationRead,
  getAuditLogs,
  uploadDocument,
  deleteDocument
};

window.API_LOADED = true;
} catch (err) {
  console.error("api.js execution crashed:", err);
  window.API_ERROR = err.message + (err.stack ? ' - ' + err.stack : '');
}
