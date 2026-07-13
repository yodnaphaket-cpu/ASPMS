// ASPMS Relational Database Layer using localStorage
const DB_KEY = 'ASPMS_DATABASE';

// Safe localStorage wrapper for environments that block localStorage (e.g. some file:// executions)
let storageFallback = {};
const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return storageFallback[key] || null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      storageFallback[key] = value;
    }
  },
  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (err) {
      delete storageFallback[key];
    }
  }
};

const DEPARTMENTS_SEED = [
    {
        "DepartmentID":  1,
        "DepartmentCode":  "AME",
        "DepartmentName":  "Automotive Manufacturing Engineering",
        "Status":  "Active"
    },
    {
        "DepartmentID":  2,
        "DepartmentCode":  "CAI",
        "DepartmentName":  "Computer Artificial Intelligence",
        "Status":  "Active"
    },
    {
        "DepartmentID":  3,
        "DepartmentCode":  "IEM",
        "DepartmentName":  "Industrial Engineering and Management",
        "Status":  "Active"
    },
    {
        "DepartmentID":  4,
        "DepartmentCode":  "DIT",
        "DepartmentName":  "Digital Information Technology",
        "Status":  "Active"
    },
    {
        "DepartmentID":  5,
        "DepartmentCode":  "RAE",
        "DepartmentName":  "Robotics and Automation Engineering",
        "Status":  "Active"
    },
    {
        "DepartmentID":  6,
        "DepartmentCode":  "CYB",
        "DepartmentName":  "Cyber Security Engineering",
        "Status":  "Active"
    },
    {
        "DepartmentID":  7,
        "DepartmentCode":  "MAI",
        "DepartmentName":  "Master of Artificial Intelligence",
        "Status":  "Active"
    },
    {
        "DepartmentID":  8,
        "DepartmentCode":  "ET",
        "DepartmentName":  "Engineering Technology",
        "Status":  "Active"
    },
    {
        "DepartmentID":  9,
        "DepartmentCode":  "AiBA",
        "DepartmentName":  "Artificial Intelligence Beyond Academy (\\u0e28\\u0e39\\u0e19\\u0e22\\u0e4c\\u0e43\\u0e2b\\u0e49\\u0e04\\u0e33\\u0e1b\\u0e23\\u0e36\\u0e01\\u0e29\\u0e32\\u0e14\\u0e49\\u0e32\\u0e19 AI)",
        "Status":  "Active"
    }
];

const USERS_SEED = [
    {
        "UserID":  1,
        "DepartmentID":  null,
        "EmployeeID":  "EMP-001",
        "Username":  "dean",
        "Password":  "password123",
        "FullName":  "ผศ.ดร.พรรณเชษฐ ณ ลำพูน",
        "Email":  "dean@pim.ac.th",
        "Phone":  "0812345678",
        "Role":  "Dean",
        "Status":  "Active",
        "UpdatedAt":  "2026-07-03T13:12:45.073Z"
    },
    {
        "UserID":  2,
        "DepartmentID":  null,
        "EmployeeID":  "EMP-002",
        "Username":  "adean",
        "Password":  "password123",
        "FullName":  "ผศ.ยอดนภา เกษเมือง",
        "Email":  "adean@pim.ac.th",
        "Phone":  "0898765432",
        "Role":  "Assistant Dean",
        "Status":  "Active",
        "UpdatedAt":  "2026-07-03T13:13:08.415Z"
    },
    {
        "UserID":  3,
        "DepartmentID":  5,
        "EmployeeID":  "EMP-003",
        "Username":  "admin_rae",
        "Password":  "password123",
        "FullName":  "ดร.ภาคภูมิ ปฐมภาค",
        "Email":  "pakpoom@pim.ac.th",
        "Phone":  "0867778899",
        "Role":  "Department Admin",
        "Status":  "Active",
        "UpdatedAt":  "2026-07-03T15:13:17.955Z"
    },
    {
        "UserID":  4,
        "DepartmentID":  3,
        "EmployeeID":  "EMP-004",
        "Username":  "admin_iem",
        "Password":  "password123",
        "FullName":  "ผศ.สุคนธ์ทิพย์ เพิ่มศิลป์",
        "Email":  "sukontip@pim.ac.th",
        "Phone":  "0821112233",
        "Role":  "Department Admin",
        "Status":  "Active",
        "UpdatedAt":  "2026-07-03T13:13:28.561Z"
    },
    {
        "UserID":  5,
        "DepartmentID":  7,
        "EmployeeID":  "EMP-005",
        "Username":  "admin_mai",
        "Password":  "password123",
        "FullName":  "ผศ.ดร.นิเวศ จิระวิชิตชัย",
        "Email":  "niwet@pim.ac.th",
        "Phone":  "0834445566",
        "Role":  "Department Admin",
        "Status":  "Active"
    },
    {
        "UserID":  6,
        "DepartmentID":  1,
        "EmployeeID":  "EMP-006",
        "Username":  "admin_ame",
        "Password":  "password123",
        "FullName":  "ผศ.ดร.ภูมิ จาตุนิตานนท์",
        "Email":  "poom@pim.ac.th",
        "Phone":  "0010000000",
        "Role":  "Department Admin",
        "Status":  "Active",
        "CreatedAt":  "2026-07-03T15:11:18.839Z",
        "UpdatedAt":  "2026-07-03T15:11:54.702Z"
    },
    {
        "UserID":  6,
        "DepartmentID":  6,
        "EmployeeID":  "EMP-006",
        "Username":  "admin_cyb",
        "Password":  "password123",
        "FullName":  "รศ.ดร.อรรณพ หมั่นสกุล",
        "Email":  "annop@pim.ac.th",
        "Phone":  "0855556677",
        "Role":  "Department Admin",
        "Status":  "Active"
    },
    {
        "UserID":  7,
        "DepartmentID":  2,
        "EmployeeID":  "EMP-007",
        "Username":  "admin_cai",
        "Password":  "password123",
        "FullName":  "รศ.ดร.ปริญญา สงวนสัตย์",
        "Email":  "",
        "Phone":  "",
        "Role":  "Department Admin",
        "Status":  "Active",
        "CreatedAt":  "2026-07-05T02:43:49.017Z",
        "UpdatedAt":  "2026-07-05T02:43:49.017Z"
    },
    {
        "UserID":  8,
        "DepartmentID":  4,
        "EmployeeID":  "EMP-008",
        "Username":  "admin_dit",
        "Password":  "password123",
        "FullName":  "ดร.ชนกานต์ กิ่งแก้ว",
        "Email":  "",
        "Phone":  "",
        "Role":  "Department Admin",
        "Status":  "Active",
        "CreatedAt":  "2026-07-05T02:45:17.667Z",
        "UpdatedAt":  "2026-07-05T02:45:17.667Z"
    },
    {
        "UserID":  10,
        "DepartmentID":  9,
        "EmployeeID":  "EMP-010",
        "Username":  "admin_aiba",
        "Password":  "password123",
        "FullName":  "\\u0e2d\\u0e32\\u0e08\\u0e32\\u0e23\\u0e22\\u0e4c\\u0e27\\u0e38\\u0e12\\u0e34\\u0e01\\u0e32\\u0e19\\u0e15\\u0e4c \\u0e2b\\u0e07\\u0e29\\u0e4c\\u0e40\\u0e27\\u0e35\\u0e22\\u0e07\\u0e08\\u0e31\\u0e19\\u0e17\\u0e23\\u0e4c",
        "Email":  "woottikarn@pim.ac.th",
        "Phone":  "0891114455",
        "Role":  "Department Admin",
        "Status":  "Active",
        "CreatedAt":  "2026-07-08T12:51:00.000Z"
    }
];

const PROJECTS_SEED = [
    {
        "ProjectID":  1,
        "DepartmentID":  5,
        "ProjectCode":  "ASP-2569-RAE-001",
        "ProjectName":  "โครงการบำรุงรักษาหุ่นยนต์ร้าน 7-11 สาขาธาราพัทยา",
        "FiscalYear":  "2569",
        "ProjectType":  "บริการวิชาการ",
        "Customer":  "CP ALL",
        "ResponsiblePerson":  "ดร.ภาคภูมิ ปฐมภาค",
        "StartDate":  "2026-06-01",
        "EndDate":  "2027-05-31",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  130000,
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-05T11:51:26.150Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  2,
        "DepartmentID":  5,
        "ProjectCode":  "ASP-2569-RAE-002",
        "ProjectName":  "โครงการพัฒนานวัตกรรมร้าน 7-11",
        "FiscalYear":  "2569",
        "ProjectType":  "บริการวิชาการ",
        "Customer":  "CP ALL",
        "ResponsiblePerson":  "ดร.ภาคภูมิ",
        "StartDate":  "2026-06-01",
        "EndDate":  "2027-05-31",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  50000,
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-03T14:59:31.853Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  3,
        "DepartmentID":  5,
        "ProjectCode":  "ASP-2569-RAE-003",
        "ProjectName":  "อบรมพื้นฐาน CNC",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป / ภาคเอกชน",
        "ResponsiblePerson":  "ดร.อภิชาติ ชัยชวลิต",
        "StartDate":  "2026-06-10",
        "EndDate":  "2026-06-15",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  45000,
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-03T14:59:51.818Z",
        "Objective":  "",
        "Description":  "",
        "Batches":  [
                        {
                            "Name":  "รุ่นที่ 1",
                            "StartDate":  "2026-06-10",
                            "EndDate":  "2026-06-12"
                        },
                        {
                            "Name":  "รุ่นที่ 2",
                            "StartDate":  "2026-06-13",
                            "EndDate":  "2026-06-15"
                        }
                    ]
    },
    {
        "ProjectID":  4,
        "DepartmentID":  5,
        "ProjectCode":  "ASP-2569-RAE-004",
        "ProjectName":  "อบรม Physical AI",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "สมาคมอุตสาหกรรมหุ่นยนต์",
        "ResponsiblePerson":  "ดร.โพธิวัฒน์ และ อ.ศิลา",
        "StartDate":  "2026-06-15",
        "EndDate":  "2026-06-20",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  40000,
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-03T15:00:17.617Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  5,
        "DepartmentID":  5,
        "ProjectCode":  "ASP-2569-RAE-005",
        "ProjectName":  "โครงการค่ายวิชาการสำหรับพัฒนานักเรียนโรงเรียน",
        "FiscalYear":  "2569",
        "ProjectType":  "บริการวิชาการ",
        "Customer":  "โรงเรียนในเครือข่าย",
        "ResponsiblePerson":  "ดร.ภาคภูมิ และ ดร.ธันยวัต",
        "StartDate":  "2026-06-20",
        "EndDate":  "2026-06-25",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  175000,
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-03T15:00:42.747Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  6,
        "DepartmentID":  5,
        "ProjectCode":  "ASP-2569-RAE-006",
        "ProjectName":  "อบรมพื้นฐานการพัฒนาหุ่นยนต์ด้วย Robot Operating System (ROS2)",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "นักวิจัยและวิศวกร",
        "ResponsiblePerson":  "ดร.ภาคภูมิ",
        "StartDate":  "2026-06-25",
        "EndDate":  "2026-06-30",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  60000,
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-03T15:01:18.742Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  7,
        "DepartmentID":  5,
        "ProjectCode":  "ASP-2569-RAE-007",
        "ProjectName":  "โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "โรงเรียนมัธยมเครือข่าย",
        "ResponsiblePerson":  "ดร.ภาคภูมิ",
        "StartDate":  "2026-07-01",
        "EndDate":  "2026-12-31",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  500000,
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-03T14:56:13.244Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  8,
        "DepartmentID":  3,
        "ProjectCode":  "ASP-2569-IEM-001",
        "ProjectName":  "โครงการจัดอบรม AI for Industrial management",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บริษัท อุตสาหกรรมจำกัด",
        "ResponsiblePerson":  "ผศ.สุคนธ์ทิพย์ เพิ่มศิลป์",
        "StartDate":  "2026-06-01",
        "EndDate":  "2026-07-31",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-05T04:03:37.903Z",
        "Objective":  "",
        "Description":  "",
        "Batches":  [
                        {
                            "Name":  "รุ่นที่ 1",
                            "StartDate":  "2026-06-01",
                            "EndDate":  "2026-06-30"
                        },
                        {
                            "Name":  "รุ่นที่ 2",
                            "StartDate":  "2026-07-01",
                            "EndDate":  "2026-07-31"
                        }
                    ]
    },
    {
        "ProjectID":  9,
        "DepartmentID":  3,
        "ProjectCode":  "ASP-2569-IEM-002",
        "ProjectName":  "โครงการจัดอบรม การบริหารจัดการก๊าซเรือนกระจกระดับองค์กรและห่วงโซ่อุปทาน",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "หน่วยงานลดการปล่อยคาร์บอน",
        "ResponsiblePerson":  "อ.สุคนธ์ทิพย์ เพิ่มศิลป์",
        "StartDate":  "2026-06-05",
        "EndDate":  "2026-08-05",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-05T04:03:44.003Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  10,
        "DepartmentID":  3,
        "ProjectCode":  "ASP-2569-IEM-003",
        "ProjectName":  "โครงการจัดอบรม Advance AI for Industrial management",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บริษัท เทคโนโลยีอุตสาหกรรม",
        "ResponsiblePerson":  "อ.สุคนธ์ทิพย์ เพิ่มศิลป์",
        "StartDate":  "2026-06-10",
        "EndDate":  "2026-08-10",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-05T04:03:50.630Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  11,
        "DepartmentID":  3,
        "ProjectCode":  "ASP-2569-IEM-004",
        "ProjectName":  "โครงการจัดอบรม Industrial Cost Management",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "ผู้ประกอบการ SME",
        "ResponsiblePerson":  "อ.สุคนธ์ทิพย์ เพิ่มศิลป์",
        "StartDate":  "2026-06-15",
        "EndDate":  "2026-08-15",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-05T04:03:56.819Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  12,
        "DepartmentID":  3,
        "ProjectCode":  "ASP-2569-IEM-005",
        "ProjectName":  "โครงการจัดอบรมการบริหารจัดการอุตสาหกรรม",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "สมาคมบริหารจัดการอุตสาหกรรม",
        "ResponsiblePerson":  "อ.สุคนธ์ทิพย์ เพิ่มศิลป์",
        "StartDate":  "2026-06-20",
        "EndDate":  "2026-08-20",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-05T04:05:10.326Z",
        "Objective":  "",
        "Description":  ""
    },
    {
        "ProjectID":  13,
        "DepartmentID":  7,
        "ProjectCode":  "ASP-2569-MAI-001",
        "ProjectName":  "หลักสูตรวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจสำหรับภาคอุตสาหกรรม",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บริษัท ยานยนต์แห่งอนาคต",
        "ResponsiblePerson":  "ผศ.ดร.นิเวศ จิระวิชิตชัย",
        "StartDate":  "2026-06-01",
        "EndDate":  "2026-11-30",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  1200000,
        "CreatedBy":  5,
        "CreatedAt":  "2026-06-01T08:00:00Z",
        "UpdatedAt":  "2026-07-05T04:05:16.062Z",
        "Objective":  "",
        "Description":  "",
        "Batches":  [
                        {
                            "Name":  "รุ่นที่ 1 (วิทยาการข้อมูล)",
                            "StartDate":  "2026-06-01",
                            "EndDate":  "2026-07-31"
                        },
                        {
                            "Name":  "รุ่นที่ 2 (การวิเคราะห์เชิงธุรกิจ)",
                            "StartDate":  "2026-08-01",
                            "EndDate":  "2026-09-30"
                        },
                        {
                            "Name":  "รุ่นที่ 3 (โครงงานภาคอุตสาหกรรม)",
                            "StartDate":  "2026-10-01",
                            "EndDate":  "2026-11-30"
                        }
                    ]
    },
    {
        "ProjectID":  14,
        "DepartmentID":  1,
        "ProjectCode":  "ASP-2569-AME-001",
        "ProjectName":  "เทคโนโลยียานยนต์สมัยใหม่ ",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "ผศ.ดร.ภูมิ ",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-07-23",
        "EndDate":  "2026-07-25",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  200000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-03T13:46:11.790Z",
        "UpdatedAt":  "2026-07-05T12:04:32.863Z"
    },
    {
        "ProjectID":  15,
        "DepartmentID":  1,
        "ProjectCode":  "ASP-2569-AME-002",
        "ProjectName":  "Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "ผศ.ยอดนภา",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-08-02",
        "EndDate":  "2026-08-04",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-03T13:54:35.352Z",
        "UpdatedAt":  "2026-07-05T04:05:28.169Z"
    },
    {
        "ProjectID":  16,
        "DepartmentID":  1,
        "ProjectCode":  "ASP-2569-AME-003",
        "ProjectName":  "กาบำรุงรักษาทวีผลแบบทุกคนมีส่วนร่วม Total Productive Maintenance ",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "ผศ.ดร.กรีฑา",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-08-27",
        "EndDate":  "2026-08-25",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-03T14:04:40.896Z",
        "UpdatedAt":  "2026-07-05T04:05:32.606Z"
    },
    {
        "ProjectID":  17,
        "DepartmentID":  1,
        "ProjectCode":  "ASP-2569-AME-004",
        "ProjectName":  "เทคนิคงานเขียนแบบวิศวกรรมด้วยโปรแกรม SOLIDWORKS",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "ผศ.ดร.บัณฑิต ",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-09-07",
        "EndDate":  "2026-09-11",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-03T14:28:53.181Z",
        "UpdatedAt":  "2026-07-05T04:05:39.532Z"
    },
    {
        "ProjectID":  18,
        "DepartmentID":  2,
        "ProjectCode":  "ASP-2569-CAI-001",
        "ProjectName":  "อบรมการสร้างระบบปัญญาประดิษฐ์ด้วยแบบจำลองภาษาขนาดใหญ่",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "รศ.ดร.ปริญญา สงวนสัตย์",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2027-05-03",
        "EndDate":  "2027-05-04",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  82000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:25:20.289Z",
        "UpdatedAt":  "2026-07-05T04:05:47.273Z"
    },
    {
        "ProjectID":  19,
        "DepartmentID":  2,
        "ProjectCode":  "ASP-2569-CAI-002",
        "ProjectName":  "ถอดรหัสความคิด สร้างนวัตกรรมดิจิทัลด้วยการเรียนรู้แบบ STEM",
        "FiscalYear":  "2569",
        "ProjectType":  "บริการวิชาการ",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "ผศ.ดร. ติณณภพ ดินดำ",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2570-06-09",
        "EndDate":  "2570-09-05",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  54000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:27:40.462Z",
        "UpdatedAt":  "2026-07-05T04:05:53.250Z"
    },
    {
        "ProjectID":  20,
        "DepartmentID":  2,
        "ProjectCode":  "ASP-2569-CAI-003",
        "ProjectName":  "นวัตกรรมเครื่องมือวัดไฟฟ้า ",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "ผศ.ดร. ติณณภพ ดินดำ",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2569-09-01",
        "EndDate":  "2570-05-02",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  54000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:29:41.804Z",
        "UpdatedAt":  "2026-07-05T04:06:04.282Z"
    },
    {
        "ProjectID":  21,
        "DepartmentID":  2,
        "ProjectCode":  "ASP-2569-CAI-004",
        "ProjectName":  "Data visualization using AI (no-code)",
        "FiscalYear":  "2569",
        "ProjectType":  "บริการวิชาการ",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "อ. สาธิดา สุขพงษ์",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-09-01",
        "EndDate":  "2027-01-01",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  120000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:31:35.803Z",
        "UpdatedAt":  "2026-07-05T04:06:10.605Z"
    },
    {
        "ProjectID":  22,
        "DepartmentID":  2,
        "ProjectCode":  "ASP-2569-CAI-005",
        "ProjectName":  "โครงการอบรม \"อัปพอร์ต ปูพื้นฐาน IoT เพื่อวิศวะคอมฯ\"",
        "FiscalYear":  "2569",
        "ProjectType":  "บริการวิชาการ",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "อ.จักรพันธ์ จิตรพงษ์",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2027-01-01",
        "EndDate":  "2027-05-03",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:32:45.868Z",
        "UpdatedAt":  "2026-07-05T04:06:17.884Z"
    },
    {
        "ProjectID":  23,
        "DepartmentID":  2,
        "ProjectCode":  "ASP-2569-CAI-006",
        "ProjectName":  "โครงการอบรม \"อัปพอร์ตวิศวะคอมฯ-AI ให้เหนือกว่าใคร\"",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "อ อดิศร , อ สาธิดา",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-09-01",
        "EndDate":  "2027-01-04",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  60000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:34:37.071Z",
        "UpdatedAt":  "2026-07-05T04:06:23.401Z"
    },
    {
        "ProjectID":  24,
        "DepartmentID":  2,
        "ProjectCode":  "ASP-2569-CAI-007",
        "ProjectName":  "โครงการอบรม \"Upskill สาย DevOps เพิ่มโอกาสอัปเงินเดือน\"  ",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "อ อดิศร , อ สาธิดา",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2027-01-04",
        "EndDate":  "2027-05-04",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  30000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:35:51.862Z",
        "UpdatedAt":  "2026-07-05T04:06:28.448Z"
    },
    {
        "ProjectID":  25,
        "DepartmentID":  6,
        "ProjectCode":  "ASP-2569-CYB-001",
        "ProjectName":  "\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\"",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "รศ.ดร.อรรณพ หมั่นสกุล",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-08-04",
        "EndDate":  "2026-08-11",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  0,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:38:55.924Z",
        "UpdatedAt":  "2026-07-05T04:06:36.290Z"
    },
    {
        "ProjectID":  26,
        "DepartmentID":  6,
        "ProjectCode":  "ASP-2569-CYB-002",
        "ProjectName":  "โครงการ เรียนรู้ตลอดชีวิตและพัฒนาทักษะเพื่ออนาคต (Upskill/Reskill) หลักสูตร (AI for Cybersecurity)",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "รศ.ดร.อรรณพ หมั่นสกุล",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-06-04",
        "EndDate":  "2026-12-04",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  250000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:40:08.115Z",
        "UpdatedAt":  "2026-07-05T04:06:45.866Z"
    },
    {
        "ProjectID":  27,
        "DepartmentID":  6,
        "ProjectCode":  "ASP-2569-CYB-003",
        "ProjectName":  "หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 1/2569",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "รศ.ดร.อรรณพ หมั่นสกุล",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-07-20",
        "EndDate":  "2026-07-21",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:41:39.093Z",
        "UpdatedAt":  "2026-07-05T04:06:52.623Z"
    },
    {
        "ProjectID":  28,
        "DepartmentID":  6,
        "ProjectCode":  "ASP-2569-CYB-004",
        "ProjectName":  "หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 2/2569",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "รศ.ดร.อรรณพ หมั่นสกุล",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2027-03-04",
        "EndDate":  "2027-03-04",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  100000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:42:48.644Z",
        "UpdatedAt":  "2026-07-05T04:06:58.204Z"
    },
    {
        "ProjectID":  29,
        "DepartmentID":  6,
        "ProjectCode":  "ASP-2569-CYB-005",
        "ProjectName":  "หลักสูตรอบรม Cybersecurity Forensics (DFIR) Bootcamp: Digital Evidence \u0026 Incident Response",
        "FiscalYear":  "2569",
        "ProjectType":  "บริการวิชาการ",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "รศ.ดร.อรรณพ หมั่นสกุล",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-11-04",
        "EndDate":  "2026-11-04",
        "ProjectStatus":  "Planned",
        "PlannedBudget":  150000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-04T13:43:48.390Z",
        "UpdatedAt":  "2026-07-05T04:07:04.671Z"
    },
    {
        "ProjectID":  30,
        "DepartmentID":  4,
        "ProjectCode":  "ASP-2569-DIT-001",
        "ProjectName":  "โครงการบริการวิชาการร่วมกับ GoSoft",
        "FiscalYear":  "2569",
        "ProjectType":  "บริการวิชาการ",
        "Customer":  "GoSoft",
        "ResponsiblePerson":  "อ.ดร.ชนกานต์ กิ่งแก้ว",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-12-01",
        "EndDate":  "2026-12-05",
        "ProjectStatus":  "Draft",
        "PlannedBudget":  400000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:38:52.507Z",
        "UpdatedAt":  "2026-07-05T11:38:52.508Z"
    },
    {
        "ProjectID":  31,
        "DepartmentID":  4,
        "ProjectCode":  "ASP-2569-DIT-002",
        "ProjectName":  "โครงการบริการวิชาการอบรมปั้นโมเดล 3D ด้วยโปรแกรม blender ในยุค AI สำหรับอนิเมชั่นและเกม",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "อ.ดนัยเลิศ",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2027-03-01",
        "EndDate":  "2027-03-05",
        "ProjectStatus":  "Draft",
        "PlannedBudget":  70093,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:40:51.869Z",
        "UpdatedAt":  "2026-07-05T11:40:51.869Z"
    },
    {
        "ProjectID":  32,
        "DepartmentID":  4,
        "ProjectCode":  "ASP-2569-DIT-003",
        "ProjectName":  "โครงการบริการวิชาการอบรสร้างระบบช่วยงานครูอัตโนมัติด้วย AI",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "อ. วุฒิกานต์",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-09-01",
        "EndDate":  "2026-09-05",
        "ProjectStatus":  "Draft",
        "PlannedBudget":  10000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:42:58.516Z",
        "UpdatedAt":  "2026-07-05T11:42:58.516Z"
    },
    {
        "ProjectID":  33,
        "DepartmentID":  4,
        "ProjectCode":  "ASP-2569-DIT-004",
        "ProjectName":  "โครงการบริการวิชาการอบรมสร้าง AI Chatbot สำหรับใช้งานในองค์กร",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุุคคลทั่วไป",
        "ResponsiblePerson":  "อ. วุฒิกานต์",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-08-17",
        "EndDate":  "2026-08-20",
        "ProjectStatus":  "Draft",
        "PlannedBudget":  10000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:44:31.995Z",
        "UpdatedAt":  "2026-07-05T11:44:31.995Z"
    },
    {
        "ProjectID":  34,
        "DepartmentID":  4,
        "ProjectCode":  "ASP-2569-DIT-005",
        "ProjectName":  "โครงการบริการวิชาการอบรมนักพัฒนา AI ยุคใหม่ (Next-Gen AI Developer)",
        "FiscalYear":  "2569",
        "ProjectType":  "อบรม",
        "Customer":  "บุคคลทั่วไป",
        "ResponsiblePerson":  "อ. วุฒิกานต์",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-09-14",
        "EndDate":  "2026-09-15",
        "ProjectStatus":  "Draft",
        "PlannedBudget":  10000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:46:26.289Z",
        "UpdatedAt":  "2026-07-05T11:46:26.289Z"
    },
    {
        "ProjectID":  35,
        "DepartmentID":  8,
        "ProjectCode":  "ASP-2569-ET-001",
        "ProjectName":  "โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics",
        "FiscalYear":  "2569",
        "ProjectType":  "บริการวิชาการ",
        "Customer":  "CP All",
        "ResponsiblePerson":  "ทีมคณะวิศวฯ ",
        "Objective":  "",
        "Description":  "",
        "StartDate":  "2026-10-26",
        "EndDate":  "2026-10-27",
        "ProjectStatus":  "Draft",
        "PlannedBudget":  500000,
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-07T08:17:08.776Z",
        "UpdatedAt":  "2026-07-07T08:23:10.017Z"
    }
];

const REVENUE_SEED = [
    {
        "RevenueID":  1,
        "ProjectID":  1,
        "TransactionDate":  "2026-06-02",
        "ReceiptNumber":  "REC-RAE-001",
        "RevenueType":  "Contract Payment",
        "Description":  "เงินกวดงวดที่ 1 บำรุงรักษาหุ่นยนต์ 7-11",
        "Amount":  0,
        "Remark":  "เรียบร้อย",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-02T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:56:37.409Z"
    },
    {
        "RevenueID":  2,
        "ProjectID":  2,
        "TransactionDate":  "2026-06-03",
        "ReceiptNumber":  "REC-RAE-002",
        "RevenueType":  "Contract Payment",
        "Description":  "เงินมัดจำโครงการพัฒนานวัตกรรมร้าน 7-11",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-03T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:56:42.619Z"
    },
    {
        "RevenueID":  3,
        "ProjectID":  3,
        "TransactionDate":  "2026-06-12",
        "ReceiptNumber":  "REC-RAE-003",
        "RevenueType":  "Registration Fee",
        "Description":  "ค่าลงทะเบียนผู้เข้าอบรม CNC",
        "Amount":  0,
        "Remark":  "ชำระครบ",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-12T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:56:49.054Z"
    },
    {
        "RevenueID":  4,
        "ProjectID":  4,
        "TransactionDate":  "2026-06-16",
        "ReceiptNumber":  "REC-RAE-004",
        "RevenueType":  "Registration Fee",
        "Description":  "ค่าสนับสนุนการจัดอบรม Physical AI",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-16T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:56:54.088Z"
    },
    {
        "RevenueID":  5,
        "ProjectID":  5,
        "TransactionDate":  "2026-06-22",
        "ReceiptNumber":  "REC-RAE-005",
        "RevenueType":  "Contract Payment",
        "Description":  "ค่าจ้างเหมาจัดโครงการค่ายวิชาการ",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-22T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:57:04.082Z"
    },
    {
        "RevenueID":  6,
        "ProjectID":  6,
        "TransactionDate":  "2026-06-27",
        "ReceiptNumber":  "REC-RAE-006",
        "RevenueType":  "Registration Fee",
        "Description":  "ค่าสมัครอบรมหลักสูตร ROS2",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-27T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:57:08.978Z"
    },
    {
        "RevenueID":  8,
        "ProjectID":  8,
        "TransactionDate":  "2026-06-03",
        "ReceiptNumber":  "REC-IEM-001",
        "RevenueType":  "Registration Fee",
        "Description":  "ค่าลงทะเบียน AI for Industrial",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-03T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:43:42.879Z"
    },
    {
        "RevenueID":  9,
        "ProjectID":  9,
        "TransactionDate":  "2026-06-08",
        "ReceiptNumber":  "REC-IEM-002",
        "RevenueType":  "Contract Payment",
        "Description":  "เงินสนับสนุนการอบรมก๊าซเรือนกระจก",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-08T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:43:46.745Z"
    },
    {
        "RevenueID":  10,
        "ProjectID":  10,
        "TransactionDate":  "2026-06-12",
        "ReceiptNumber":  "REC-IEM-003",
        "RevenueType":  "Registration Fee",
        "Description":  "ค่าลงทะเบียนอบรม Advance AI",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-12T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:43:50.846Z"
    },
    {
        "RevenueID":  11,
        "ProjectID":  11,
        "TransactionDate":  "2026-06-16",
        "ReceiptNumber":  "REC-IEM-004",
        "RevenueType":  "Registration Fee",
        "Description":  "ค่าลงทะเบียน Industrial Cost Management",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-16T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:43:57.843Z"
    },
    {
        "RevenueID":  12,
        "ProjectID":  12,
        "TransactionDate":  "2026-06-22",
        "ReceiptNumber":  "REC-IEM-005",
        "RevenueType":  "Registration Fee",
        "Description":  "ค่าลงทะเบียน อบรมการบริหารจัดการอุตสาหกรรม",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-22T10:00:00Z",
        "UpdatedAt":  "2026-07-03T14:44:02.760Z"
    },
    {
        "RevenueID":  13,
        "ProjectID":  13,
        "TransactionDate":  "2026-06-04",
        "ReceiptNumber":  "REC-MAI-001",
        "RevenueType":  "Contract Payment",
        "Description":  "ค่าจ้างพัฒนาหลักสูตรวิทยาการข้อมูล งวดที่ 1",
        "Amount":  1200000,
        "Remark":  "เรียบร้อย",
        "CreatedBy":  5,
        "CreatedAt":  "2026-06-04T10:00:00Z",
        "UpdatedAt":  "2026-06-04T10:00:00Z"
    },
    {
        "RevenueID":  14,
        "ProjectID":  30,
        "TransactionDate":  "2026-07-05",
        "ReceiptNumber":  "001",
        "RevenueType":  "Registration Fee",
        "Description":  "",
        "Amount":  400000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:56:56.839Z",
        "UpdatedAt":  "2026-07-05T11:56:56.839Z"
    },
    {
        "RevenueID":  15,
        "ProjectID":  31,
        "TransactionDate":  "2026-07-05",
        "ReceiptNumber":  "001",
        "RevenueType":  "Registration Fee",
        "Description":  "",
        "Amount":  70093,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:57:57.151Z",
        "UpdatedAt":  "2026-07-05T11:57:57.151Z"
    },
    {
        "RevenueID":  16,
        "ProjectID":  32,
        "TransactionDate":  "2026-07-05",
        "ReceiptNumber":  "001",
        "RevenueType":  "Registration Fee",
        "Description":  "",
        "Amount":  10000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:59:51.447Z",
        "UpdatedAt":  "2026-07-05T11:59:51.447Z"
    },
    {
        "RevenueID":  17,
        "ProjectID":  33,
        "TransactionDate":  "2026-07-05",
        "ReceiptNumber":  "001",
        "RevenueType":  "Registration Fee",
        "Description":  "",
        "Amount":  10000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T12:01:00.502Z",
        "UpdatedAt":  "2026-07-05T12:01:00.502Z"
    },
    {
        "RevenueID":  18,
        "ProjectID":  34,
        "TransactionDate":  "2026-07-05",
        "ReceiptNumber":  "001",
        "RevenueType":  "Registration Fee",
        "Description":  "",
        "Amount":  10000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T12:01:49.007Z",
        "UpdatedAt":  "2026-07-05T12:01:49.007Z"
    },
    {
        "RevenueID":  19,
        "ProjectID":  14,
        "TransactionDate":  "2026-07-05",
        "ReceiptNumber":  "001",
        "RevenueType":  "Registration Fee",
        "Description":  "",
        "Amount":  200000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T13:02:04.846Z",
        "UpdatedAt":  "2026-07-05T13:02:04.846Z"
    },
    {
        "RevenueID":  20,
        "ProjectID":  15,
        "TransactionDate":  "2026-07-05",
        "ReceiptNumber":  "001",
        "RevenueType":  "Registration Fee",
        "Description":  "",
        "Amount":  100000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T13:03:22.282Z",
        "UpdatedAt":  "2026-07-05T13:03:22.282Z"
    },
    {
        "RevenueID":  21,
        "ProjectID":  16,
        "TransactionDate":  "2026-07-05",
        "ReceiptNumber":  "001",
        "RevenueType":  "Registration Fee",
        "Description":  "",
        "Amount":  100000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T13:04:44.924Z",
        "UpdatedAt":  "2026-07-05T13:04:44.924Z"
    },
    {
        "RevenueID":  22,
        "ProjectID":  17,
        "TransactionDate":  "2026-07-05",
        "ReceiptNumber":  "001",
        "RevenueType":  "Registration Fee",
        "Description":  "",
        "Amount":  100000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T13:05:44.245Z",
        "UpdatedAt":  "2026-07-05T13:05:44.245Z"
    },
    {
        "RevenueID":  23,
        "ProjectID":  35,
        "TransactionDate":  "2026-09-07",
        "ReceiptNumber":  "001",
        "RevenueType":  "Government Support",
        "Description":  "",
        "Amount":  500000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-07T08:18:58.296Z",
        "UpdatedAt":  "2026-07-07T08:18:58.296Z"
    }
];

const EXPENSE_SEED = [
    {
        "ExpenseID":  1,
        "ProjectID":  1,
        "TransactionDate":  "2026-06-10",
        "ExpenseNumber":  "EXP-RAE-001",
        "ExpenseType":  "Materials",
        "Description":  "ซื้ออะไหล่หุ่นยนต์และจาระบีหล่อลื่น",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-10T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:57:34.677Z"
    },
    {
        "ExpenseID":  2,
        "ProjectID":  2,
        "TransactionDate":  "2026-06-15",
        "ExpenseNumber":  "EXP-RAE-002",
        "ExpenseType":  "Equipment",
        "Description":  "ชุดเซนเซอร์ประมวลผลกล้องนวัตกรรม",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-15T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:57:39.259Z"
    },
    {
        "ExpenseID":  3,
        "ProjectID":  3,
        "TransactionDate":  "2026-06-13",
        "ExpenseNumber":  "EXP-RAE-003",
        "ExpenseType":  "Speaker Fee",
        "Description":  "ค่าสมนาคุณวิทยากรอบรม CNC",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-13T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:57:43.110Z"
    },
    {
        "ExpenseID":  4,
        "ProjectID":  4,
        "TransactionDate":  "2026-06-18",
        "ExpenseNumber":  "EXP-RAE-004",
        "ExpenseType":  "Food \u0026 Beverage",
        "Description":  "ค่าอาหารและเครื่องดื่มอบรม Physical AI",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-18T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:57:53.066Z"
    },
    {
        "ExpenseID":  5,
        "ProjectID":  5,
        "TransactionDate":  "2026-06-23",
        "ExpenseNumber":  "EXP-RAE-005",
        "ExpenseType":  "Travel",
        "Description":  "ค่ายานพาหนะจัดส่งค่ายวิชาการ",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-23T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:57:56.831Z"
    },
    {
        "ExpenseID":  6,
        "ProjectID":  6,
        "TransactionDate":  "2026-06-28",
        "ExpenseNumber":  "EXP-RAE-006",
        "ExpenseType":  "Speaker Fee",
        "Description":  "ค่าตอบแทนวิทยากรอบรม ROS2",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-06-28T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:58:01.264Z"
    },
    {
        "ExpenseID":  7,
        "ProjectID":  7,
        "TransactionDate":  "2026-07-03",
        "ExpenseNumber":  "EXP-RAE-007",
        "ExpenseType":  "Equipment",
        "Description":  "สั่งซื้อชุดหุ่นยนต์ VEX Robotics",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  3,
        "CreatedAt":  "2026-07-03T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:58:05.793Z"
    },
    {
        "ExpenseID":  8,
        "ProjectID":  8,
        "TransactionDate":  "2026-06-15",
        "ExpenseNumber":  "EXP-IEM-001",
        "ExpenseType":  "Speaker Fee",
        "Description":  "ค่าวิทยากรอบรม AI for Industrial",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-15T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:43:04.382Z"
    },
    {
        "ExpenseID":  9,
        "ProjectID":  9,
        "TransactionDate":  "2026-06-20",
        "ExpenseNumber":  "EXP-IEM-002",
        "ExpenseType":  "Materials",
        "Description":  "เอกสารและคู่มือการปล่อยคาร์บอน",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-20T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:43:09.999Z"
    },
    {
        "ExpenseID":  10,
        "ProjectID":  10,
        "TransactionDate":  "2026-06-25",
        "ExpenseNumber":  "EXP-IEM-003",
        "ExpenseType":  "Speaker Fee",
        "Description":  "ค่าวิทยากรอบรม Advance AI",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-25T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:43:14.797Z"
    },
    {
        "ExpenseID":  11,
        "ProjectID":  11,
        "TransactionDate":  "2026-06-28",
        "ExpenseNumber":  "EXP-IEM-004",
        "ExpenseType":  "Food \u0026 Beverage",
        "Description":  "จัดเลี้ยงอาหารว่างหลักสูตร Cost Management",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-06-28T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:43:21.265Z"
    },
    {
        "ExpenseID":  12,
        "ProjectID":  12,
        "TransactionDate":  "2026-07-02",
        "ExpenseNumber":  "EXP-IEM-005",
        "ExpenseType":  "Speaker Fee",
        "Description":  "ค่าตอบแทนวิทยากรอบรมการจัดการอุตสาหกรรม",
        "Amount":  0,
        "Remark":  "",
        "CreatedBy":  4,
        "CreatedAt":  "2026-07-02T11:00:00Z",
        "UpdatedAt":  "2026-07-03T14:43:25.931Z"
    },
    {
        "ExpenseID":  13,
        "ProjectID":  13,
        "TransactionDate":  "2026-06-18",
        "ExpenseNumber":  "EXP-MAI-001",
        "ExpenseType":  "Equipment",
        "Description":  "เช่าเซิร์ฟเวอร์ประมวลผลการวิเคราะห์ข้อมูลอุตสาหกรรม",
        "Amount":  900000,
        "Remark":  "",
        "CreatedBy":  5,
        "CreatedAt":  "2026-06-18T11:00:00Z",
        "UpdatedAt":  "2026-06-18T11:00:00Z"
    },
    {
        "ExpenseID":  14,
        "ProjectID":  30,
        "TransactionDate":  "2026-07-05",
        "ExpenseNumber":  "001",
        "ExpenseType":  "Materials",
        "Description":  "",
        "Amount":  120000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:54:52.181Z",
        "UpdatedAt":  "2026-07-05T11:56:00.448Z"
    },
    {
        "ExpenseID":  15,
        "ProjectID":  31,
        "TransactionDate":  "2026-07-05",
        "ExpenseNumber":  "001",
        "ExpenseType":  "Materials",
        "Description":  "",
        "Amount":  31790,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T11:58:43.421Z",
        "UpdatedAt":  "2026-07-05T11:58:43.421Z"
    },
    {
        "ExpenseID":  16,
        "ProjectID":  32,
        "TransactionDate":  "2026-07-05",
        "ExpenseNumber":  "001",
        "ExpenseType":  "Materials",
        "Description":  "",
        "Amount":  3000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T12:00:07.801Z",
        "UpdatedAt":  "2026-07-05T12:00:07.801Z"
    },
    {
        "ExpenseID":  17,
        "ProjectID":  33,
        "TransactionDate":  "2026-07-05",
        "ExpenseNumber":  "001",
        "ExpenseType":  "Materials",
        "Description":  "",
        "Amount":  3000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T12:01:22.748Z",
        "UpdatedAt":  "2026-07-05T12:01:22.748Z"
    },
    {
        "ExpenseID":  18,
        "ProjectID":  34,
        "TransactionDate":  "2026-07-05",
        "ExpenseNumber":  "001",
        "ExpenseType":  "Materials",
        "Description":  "",
        "Amount":  3000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T12:02:13.751Z",
        "UpdatedAt":  "2026-07-05T12:02:13.751Z"
    },
    {
        "ExpenseID":  19,
        "ProjectID":  14,
        "TransactionDate":  "2026-07-05",
        "ExpenseNumber":  "001",
        "ExpenseType":  "Materials",
        "Description":  "",
        "Amount":  160000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T13:02:32.300Z",
        "UpdatedAt":  "2026-07-05T13:02:32.300Z"
    },
    {
        "ExpenseID":  20,
        "ProjectID":  15,
        "TransactionDate":  "2026-07-05",
        "ExpenseNumber":  "001",
        "ExpenseType":  "Materials",
        "Description":  "",
        "Amount":  80000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T13:04:09.249Z",
        "UpdatedAt":  "2026-07-05T13:04:09.249Z"
    },
    {
        "ExpenseID":  21,
        "ProjectID":  16,
        "TransactionDate":  "2026-07-05",
        "ExpenseNumber":  "001",
        "ExpenseType":  "Materials",
        "Description":  "",
        "Amount":  80000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T13:05:10.188Z",
        "UpdatedAt":  "2026-07-05T13:05:10.188Z"
    },
    {
        "ExpenseID":  22,
        "ProjectID":  17,
        "TransactionDate":  "2026-07-05",
        "ExpenseNumber":  "001",
        "ExpenseType":  "Materials",
        "Description":  "",
        "Amount":  80000,
        "Remark":  "",
        "CreatedBy":  2,
        "CreatedAt":  "2026-07-05T13:06:02.618Z",
        "UpdatedAt":  "2026-07-05T13:06:02.618Z"
    }
];

const KPI_PLAN_SEED = [
    {
        "KPIID":  1,
        "FiscalYear":  "2569",
        "DepartmentID":  1,
        "TargetProjects":  4,
        "TargetBudget":  500000,
        "TargetRevenue":  500000,
        "TargetExpense":  400000,
        "TargetProfit":  100000,
        "TargetGPPercent":  0,
        "UpdatedAt":  "2026-07-04T14:01:59.160Z"
    },
    {
        "KPIID":  2,
        "FiscalYear":  "2569",
        "DepartmentID":  2,
        "TargetProjects":  6,
        "TargetBudget":  800000,
        "TargetRevenue":  700000,
        "TargetExpense":  500000,
        "TargetProfit":  200000,
        "TargetGPPercent":  0,
        "UpdatedAt":  "2026-07-04T13:58:19.469Z"
    },
    {
        "KPIID":  3,
        "FiscalYear":  "2569",
        "DepartmentID":  3,
        "TargetProjects":  10,
        "TargetBudget":  1000000,
        "TargetRevenue":  800000,
        "TargetExpense":  650000,
        "TargetProfit":  150000,
        "TargetGPPercent":  0,
        "UpdatedAt":  "2026-07-04T13:58:19.471Z"
    },
    {
        "KPIID":  4,
        "FiscalYear":  "2569",
        "DepartmentID":  4,
        "TargetProjects":  4,
        "TargetBudget":  600000,
        "TargetRevenue":  500000,
        "TargetExpense":  400000,
        "TargetProfit":  100000,
        "TargetGPPercent":  0,
        "UpdatedAt":  "2026-07-04T13:58:19.474Z"
    },
    {
        "KPIID":  5,
        "FiscalYear":  "2569",
        "DepartmentID":  5,
        "TargetProjects":  8,
        "TargetBudget":  1500000,
        "TargetRevenue":  1200000,
        "TargetExpense":  900000,
        "TargetProfit":  300000,
        "TargetGPPercent":  0,
        "UpdatedAt":  "2026-07-04T13:58:19.475Z"
    },
    {
        "KPIID":  6,
        "FiscalYear":  "2569",
        "DepartmentID":  6,
        "TargetProjects":  3,
        "TargetBudget":  500000,
        "TargetRevenue":  400000,
        "TargetExpense":  300000,
        "TargetProfit":  100000,
        "TargetGPPercent":  0,
        "UpdatedAt":  "2026-07-04T13:58:19.477Z"
    },
    {
        "KPIID":  7,
        "FiscalYear":  "2569",
        "DepartmentID":  7,
        "TargetProjects":  5,
        "TargetBudget":  1500000,
        "TargetRevenue":  1300000,
        "TargetExpense":  1000000,
        "TargetProfit":  300000,
        "TargetGPPercent":  0,
        "UpdatedAt":  "2026-07-04T13:58:19.478Z"
    },
    {
        "KPIID":  8,
        "FiscalYear":  "2569",
        "DepartmentID":  8,
        "TargetProjects":  4,
        "TargetBudget":  400000,
        "TargetRevenue":  300000,
        "TargetExpense":  240000,
        "TargetProfit":  60000,
        "TargetGPPercent":  0,
        "UpdatedAt":  "2026-07-04T13:58:19.479Z"
    }
];

const AUDIT_LOG_SEED = [
    {
        "LogID":  1,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  1,
        "OldValue":  "{\"KPIID\":1,\"FiscalYear\":\"2569\",\"DepartmentID\":1,\"TargetProjects\":5,\"TargetBudget\":500000,\"TargetRevenue\":400000,\"TargetExpense\":320000,\"TargetProfit\":80000,\"TargetGPPercent\":20}",
        "NewValue":  "{\"KPIID\":1,\"FiscalYear\":\"2569\",\"DepartmentID\":1,\"TargetProjects\":5,\"TargetBudget\":500000,\"TargetRevenue\":400000,\"TargetExpense\":320000,\"TargetProfit\":80000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.425Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-03T15:56:43.425Z"
    },
    {
        "LogID":  2,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  2,
        "OldValue":  "{\"KPIID\":2,\"FiscalYear\":\"2569\",\"DepartmentID\":2,\"TargetProjects\":6,\"TargetBudget\":800000,\"TargetRevenue\":700000,\"TargetExpense\":500000,\"TargetProfit\":200000,\"TargetGPPercent\":28.5}",
        "NewValue":  "{\"KPIID\":2,\"FiscalYear\":\"2569\",\"DepartmentID\":2,\"TargetProjects\":6,\"TargetBudget\":800000,\"TargetRevenue\":700000,\"TargetExpense\":500000,\"TargetProfit\":200000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.426Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-03T15:56:43.426Z"
    },
    {
        "LogID":  3,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  3,
        "OldValue":  "{\"KPIID\":3,\"FiscalYear\":\"2569\",\"DepartmentID\":3,\"TargetProjects\":10,\"TargetBudget\":1000000,\"TargetRevenue\":800000,\"TargetExpense\":650000,\"TargetProfit\":150000,\"TargetGPPercent\":18.75}",
        "NewValue":  "{\"KPIID\":3,\"FiscalYear\":\"2569\",\"DepartmentID\":3,\"TargetProjects\":10,\"TargetBudget\":1000000,\"TargetRevenue\":800000,\"TargetExpense\":650000,\"TargetProfit\":150000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.427Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-03T15:56:43.427Z"
    },
    {
        "LogID":  4,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  4,
        "OldValue":  "{\"KPIID\":4,\"FiscalYear\":\"2569\",\"DepartmentID\":4,\"TargetProjects\":4,\"TargetBudget\":600000,\"TargetRevenue\":500000,\"TargetExpense\":400000,\"TargetProfit\":100000,\"TargetGPPercent\":20}",
        "NewValue":  "{\"KPIID\":4,\"FiscalYear\":\"2569\",\"DepartmentID\":4,\"TargetProjects\":4,\"TargetBudget\":600000,\"TargetRevenue\":500000,\"TargetExpense\":400000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.428Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-03T15:56:43.428Z"
    },
    {
        "LogID":  5,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  5,
        "OldValue":  "{\"KPIID\":5,\"FiscalYear\":\"2569\",\"DepartmentID\":5,\"TargetProjects\":8,\"TargetBudget\":1500000,\"TargetRevenue\":1200000,\"TargetExpense\":900000,\"TargetProfit\":300000,\"TargetGPPercent\":25}",
        "NewValue":  "{\"KPIID\":5,\"FiscalYear\":\"2569\",\"DepartmentID\":5,\"TargetProjects\":8,\"TargetBudget\":1500000,\"TargetRevenue\":1200000,\"TargetExpense\":900000,\"TargetProfit\":300000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.429Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-03T15:56:43.429Z"
    },
    {
        "LogID":  6,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  6,
        "OldValue":  "{\"KPIID\":6,\"FiscalYear\":\"2569\",\"DepartmentID\":6,\"TargetProjects\":3,\"TargetBudget\":500000,\"TargetRevenue\":400000,\"TargetExpense\":300000,\"TargetProfit\":100000,\"TargetGPPercent\":25}",
        "NewValue":  "{\"KPIID\":6,\"FiscalYear\":\"2569\",\"DepartmentID\":6,\"TargetProjects\":3,\"TargetBudget\":500000,\"TargetRevenue\":400000,\"TargetExpense\":300000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.429Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-03T15:56:43.430Z"
    },
    {
        "LogID":  7,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  7,
        "OldValue":  "{\"KPIID\":7,\"FiscalYear\":\"2569\",\"DepartmentID\":7,\"TargetProjects\":5,\"TargetBudget\":1500000,\"TargetRevenue\":1300000,\"TargetExpense\":1000000,\"TargetProfit\":300000,\"TargetGPPercent\":23}",
        "NewValue":  "{\"KPIID\":7,\"FiscalYear\":\"2569\",\"DepartmentID\":7,\"TargetProjects\":5,\"TargetBudget\":1500000,\"TargetRevenue\":1300000,\"TargetExpense\":1000000,\"TargetProfit\":300000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.431Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-03T15:56:43.431Z"
    },
    {
        "LogID":  8,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  8,
        "OldValue":  "{\"KPIID\":8,\"FiscalYear\":\"2569\",\"DepartmentID\":8,\"TargetProjects\":4,\"TargetBudget\":400000,\"TargetRevenue\":300000,\"TargetExpense\":240000,\"TargetProfit\":60000,\"TargetGPPercent\":20}",
        "NewValue":  "{\"KPIID\":8,\"FiscalYear\":\"2569\",\"DepartmentID\":8,\"TargetProjects\":4,\"TargetBudget\":400000,\"TargetRevenue\":300000,\"TargetExpense\":240000,\"TargetProfit\":60000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.431Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-03T15:56:43.431Z"
    },
    {
        "LogID":  9,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  13,
        "OldValue":  "{\"ProjectID\":13,\"DepartmentID\":7,\"ProjectCode\":\"ASP-2569-MAI-001\",\"ProjectName\":\"หลักสูตรวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจสำหรับภาคอุตสาหกรรม\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บริษัท ยานยนต์แห่งอนาคต\",\"ResponsiblePerson\":\"ผศ.ดร.นิเวศ จิระวิชิตชัย\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-11-30\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":1000000,\"CreatedBy\":5,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-03T10:00:00Z\"}",
        "NewValue":  "{\"ProjectID\":13,\"DepartmentID\":7,\"ProjectCode\":\"ASP-2569-MAI-001\",\"ProjectName\":\"หลักสูตรวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจสำหรับภาคอุตสาหกรรม\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บริษัท ยานยนต์แห่งอนาคต\",\"ResponsiblePerson\":\"ผศ.ดร.นิเวศ จิระวิชิตชัย\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-11-30\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":1200000,\"CreatedBy\":5,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-04T13:21:13.294Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:21:13.296Z"
    },
    {
        "LogID":  10,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  18,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":18,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-001\",\"ProjectName\":\"อบรมการสร้างระบบปัญญาประดิษฐ์ด้วยแบบจำลองภาษาขนาดใหญ่\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.ปริญญา สงวนสัตย์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-05-03\",\"EndDate\":\"2027-05-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":82000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:25:20.289Z\",\"UpdatedAt\":\"2026-07-04T13:25:20.289Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:25:20.291Z"
    },
    {
        "LogID":  11,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  19,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":19,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-002\",\"ProjectName\":\"ถอดรหัสความคิด สร้างนวัตกรรมดิจิทัลด้วยการเรียนรู้แบบ STEM\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร. ติณณภพ ดินดำ\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2570-06-09\",\"EndDate\":\"2570-09-05\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":54000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:27:40.462Z\",\"UpdatedAt\":\"2026-07-04T13:27:40.462Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:27:40.462Z"
    },
    {
        "LogID":  12,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  20,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":20,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-003\",\"ProjectName\":\"นวัตกรรมเครื่องมือวัดไฟฟ้า \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร. ติณณภพ ดินดำ\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2569-09-01\",\"EndDate\":\"2570-05-02\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":54000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:29:41.804Z\",\"UpdatedAt\":\"2026-07-04T13:29:41.804Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:29:41.805Z"
    },
    {
        "LogID":  13,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  21,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":21,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-004\",\"ProjectName\":\"Data visualization using AI (no-code)\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ. สาธิดา สุขพงษ์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-01\",\"EndDate\":\"2027-01-01\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":120000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:31:35.803Z\",\"UpdatedAt\":\"2026-07-04T13:31:35.803Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:31:35.804Z"
    },
    {
        "LogID":  14,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  22,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":22,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-005\",\"ProjectName\":\"โครงการอบรม \\\"อัปพอร์ต ปูพื้นฐาน IoT เพื่อวิศวะคอมฯ\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ.จักรพันธ์ จิตรพงษ์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-01-01\",\"EndDate\":\"2027-05-03\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:32:45.868Z\",\"UpdatedAt\":\"2026-07-04T13:32:45.868Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:32:45.871Z"
    },
    {
        "LogID":  15,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  23,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":23,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-006\",\"ProjectName\":\"โครงการอบรม \\\"อัปพอร์ตวิศวะคอมฯ-AI ให้เหนือกว่าใคร\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ อดิศร , อ สาธิดา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-01\",\"EndDate\":\"2027-01-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":60000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:34:37.071Z\",\"UpdatedAt\":\"2026-07-04T13:34:37.071Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:34:37.072Z"
    },
    {
        "LogID":  16,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  24,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":24,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-007\",\"ProjectName\":\"โครงการอบรม \\\"Upskill สาย DevOps เพิ่มโอกาสอัปเงินเดือน\\\"  \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ อดิศร , อ สาธิดา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-01-04\",\"EndDate\":\"2027-05-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":30000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:35:51.862Z\",\"UpdatedAt\":\"2026-07-04T13:35:51.862Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:35:51.864Z"
    },
    {
        "LogID":  17,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  25,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":25,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-001\",\"ProjectName\":\"\\\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-04\",\"EndDate\":\"2026-08-11\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":0,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:38:55.924Z\",\"UpdatedAt\":\"2026-07-04T13:38:55.924Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:38:55.925Z"
    },
    {
        "LogID":  18,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  26,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":26,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-002\",\"ProjectName\":\"โครงการ เรียนรู้ตลอดชีวิตและพัฒนาทักษะเพื่ออนาคต (Upskill/Reskill) หลักสูตร (AI for Cybersecurity)\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-06-04\",\"EndDate\":\"2026-12-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":250000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:40:08.115Z\",\"UpdatedAt\":\"2026-07-04T13:40:08.115Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:40:08.118Z"
    },
    {
        "LogID":  19,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  27,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":27,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-003\",\"ProjectName\":\"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 1/2569\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-07-20\",\"EndDate\":\"2026-07-21\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:41:39.093Z\",\"UpdatedAt\":\"2026-07-04T13:41:39.093Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:41:39.096Z"
    },
    {
        "LogID":  20,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  28,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":28,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-004\",\"ProjectName\":\"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 2/2569\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-03-04\",\"EndDate\":\"2027-03-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:42:48.644Z\",\"UpdatedAt\":\"2026-07-04T13:42:48.644Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:42:48.645Z"
    },
    {
        "LogID":  21,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  29,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":29,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-005\",\"ProjectName\":\"หลักสูตรอบรม Cybersecurity Forensics (DFIR) Bootcamp: Digital Evidence \u0026 Incident Response\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-11-04\",\"EndDate\":\"2026-11-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":150000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:43:48.390Z\",\"UpdatedAt\":\"2026-07-04T13:43:48.390Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:43:48.393Z"
    },
    {
        "LogID":  22,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  25,
        "OldValue":  "{\"ProjectID\":25,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-001\",\"ProjectName\":\"\\\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-04\",\"EndDate\":\"2026-08-11\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":0,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:38:55.924Z\",\"UpdatedAt\":\"2026-07-04T13:38:55.924Z\"}",
        "NewValue":  "{\"ProjectID\":25,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-001\",\"ProjectName\":\"\\\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-04\",\"EndDate\":\"2026-08-11\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":0,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:38:55.924Z\",\"UpdatedAt\":\"2026-07-04T13:45:41.249Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:45:41.251Z"
    },
    {
        "LogID":  23,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  1,
        "OldValue":  "{\"KPIID\":1,\"FiscalYear\":\"2569\",\"DepartmentID\":1,\"TargetProjects\":5,\"TargetBudget\":500000,\"TargetRevenue\":400000,\"TargetExpense\":320000,\"TargetProfit\":80000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.425Z\"}",
        "NewValue":  "{\"KPIID\":1,\"FiscalYear\":\"2569\",\"DepartmentID\":1,\"TargetProjects\":5,\"TargetBudget\":500000,\"TargetRevenue\":500000,\"TargetExpense\":400000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T13:58:19.467Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:58:19.468Z"
    },
    {
        "LogID":  24,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  2,
        "OldValue":  "{\"KPIID\":2,\"FiscalYear\":\"2569\",\"DepartmentID\":2,\"TargetProjects\":6,\"TargetBudget\":800000,\"TargetRevenue\":700000,\"TargetExpense\":500000,\"TargetProfit\":200000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.426Z\"}",
        "NewValue":  "{\"KPIID\":2,\"FiscalYear\":\"2569\",\"DepartmentID\":2,\"TargetProjects\":6,\"TargetBudget\":800000,\"TargetRevenue\":700000,\"TargetExpense\":500000,\"TargetProfit\":200000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T13:58:19.469Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:58:19.470Z"
    },
    {
        "LogID":  25,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  3,
        "OldValue":  "{\"KPIID\":3,\"FiscalYear\":\"2569\",\"DepartmentID\":3,\"TargetProjects\":10,\"TargetBudget\":1000000,\"TargetRevenue\":800000,\"TargetExpense\":650000,\"TargetProfit\":150000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.427Z\"}",
        "NewValue":  "{\"KPIID\":3,\"FiscalYear\":\"2569\",\"DepartmentID\":3,\"TargetProjects\":10,\"TargetBudget\":1000000,\"TargetRevenue\":800000,\"TargetExpense\":650000,\"TargetProfit\":150000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T13:58:19.471Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:58:19.472Z"
    },
    {
        "LogID":  26,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  4,
        "OldValue":  "{\"KPIID\":4,\"FiscalYear\":\"2569\",\"DepartmentID\":4,\"TargetProjects\":4,\"TargetBudget\":600000,\"TargetRevenue\":500000,\"TargetExpense\":400000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.428Z\"}",
        "NewValue":  "{\"KPIID\":4,\"FiscalYear\":\"2569\",\"DepartmentID\":4,\"TargetProjects\":4,\"TargetBudget\":600000,\"TargetRevenue\":500000,\"TargetExpense\":400000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T13:58:19.474Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:58:19.474Z"
    },
    {
        "LogID":  27,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  5,
        "OldValue":  "{\"KPIID\":5,\"FiscalYear\":\"2569\",\"DepartmentID\":5,\"TargetProjects\":8,\"TargetBudget\":1500000,\"TargetRevenue\":1200000,\"TargetExpense\":900000,\"TargetProfit\":300000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.429Z\"}",
        "NewValue":  "{\"KPIID\":5,\"FiscalYear\":\"2569\",\"DepartmentID\":5,\"TargetProjects\":8,\"TargetBudget\":1500000,\"TargetRevenue\":1200000,\"TargetExpense\":900000,\"TargetProfit\":300000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T13:58:19.475Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:58:19.475Z"
    },
    {
        "LogID":  28,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  6,
        "OldValue":  "{\"KPIID\":6,\"FiscalYear\":\"2569\",\"DepartmentID\":6,\"TargetProjects\":3,\"TargetBudget\":500000,\"TargetRevenue\":400000,\"TargetExpense\":300000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.429Z\"}",
        "NewValue":  "{\"KPIID\":6,\"FiscalYear\":\"2569\",\"DepartmentID\":6,\"TargetProjects\":3,\"TargetBudget\":500000,\"TargetRevenue\":400000,\"TargetExpense\":300000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T13:58:19.477Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:58:19.477Z"
    },
    {
        "LogID":  29,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  7,
        "OldValue":  "{\"KPIID\":7,\"FiscalYear\":\"2569\",\"DepartmentID\":7,\"TargetProjects\":5,\"TargetBudget\":1500000,\"TargetRevenue\":1300000,\"TargetExpense\":1000000,\"TargetProfit\":300000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.431Z\"}",
        "NewValue":  "{\"KPIID\":7,\"FiscalYear\":\"2569\",\"DepartmentID\":7,\"TargetProjects\":5,\"TargetBudget\":1500000,\"TargetRevenue\":1300000,\"TargetExpense\":1000000,\"TargetProfit\":300000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T13:58:19.478Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:58:19.478Z"
    },
    {
        "LogID":  30,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  8,
        "OldValue":  "{\"KPIID\":8,\"FiscalYear\":\"2569\",\"DepartmentID\":8,\"TargetProjects\":4,\"TargetBudget\":400000,\"TargetRevenue\":300000,\"TargetExpense\":240000,\"TargetProfit\":60000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-03T15:56:43.431Z\"}",
        "NewValue":  "{\"KPIID\":8,\"FiscalYear\":\"2569\",\"DepartmentID\":8,\"TargetProjects\":4,\"TargetBudget\":400000,\"TargetRevenue\":300000,\"TargetExpense\":240000,\"TargetProfit\":60000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T13:58:19.479Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T13:58:19.479Z"
    },
    {
        "LogID":  31,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  1,
        "OldValue":  "{\"KPIID\":1,\"FiscalYear\":\"2569\",\"DepartmentID\":1,\"TargetProjects\":5,\"TargetBudget\":500000,\"TargetRevenue\":500000,\"TargetExpense\":400000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T13:58:19.467Z\"}",
        "NewValue":  "{\"KPIID\":1,\"FiscalYear\":\"2569\",\"DepartmentID\":1,\"TargetProjects\":4,\"TargetBudget\":500000,\"TargetRevenue\":500000,\"TargetExpense\":400000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T14:01:18.608Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T14:01:18.608Z"
    },
    {
        "LogID":  32,
        "UserID":  2,
        "Module":  "KPIPlan",
        "Action":  "Update",
        "RecordID":  1,
        "OldValue":  "{\"KPIID\":1,\"FiscalYear\":\"2569\",\"DepartmentID\":1,\"TargetProjects\":4,\"TargetBudget\":500000,\"TargetRevenue\":500000,\"TargetExpense\":400000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T14:01:18.608Z\"}",
        "NewValue":  "{\"KPIID\":1,\"FiscalYear\":\"2569\",\"DepartmentID\":1,\"TargetProjects\":4,\"TargetBudget\":500000,\"TargetRevenue\":500000,\"TargetExpense\":400000,\"TargetProfit\":100000,\"TargetGPPercent\":0,\"UpdatedAt\":\"2026-07-04T14:01:59.160Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T14:01:59.161Z"
    },
    {
        "LogID":  33,
        "UserID":  2,
        "Module":  "Authentication",
        "Action":  "Logout",
        "RecordID":  2,
        "OldValue":  "",
        "NewValue":  "ออกจากระบบ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T14:53:20.452Z"
    },
    {
        "LogID":  34,
        "UserID":  1,
        "Module":  "Authentication",
        "Action":  "Login",
        "RecordID":  1,
        "OldValue":  "",
        "NewValue":  "เข้าสู่ระบบสำเร็จ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T14:53:40.491Z"
    },
    {
        "LogID":  35,
        "UserID":  1,
        "Module":  "Authentication",
        "Action":  "Logout",
        "RecordID":  1,
        "OldValue":  "",
        "NewValue":  "ออกจากระบบ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T15:05:58.476Z"
    },
    {
        "LogID":  36,
        "UserID":  2,
        "Module":  "Authentication",
        "Action":  "Login",
        "RecordID":  2,
        "OldValue":  "",
        "NewValue":  "เข้าสู่ระบบสำเร็จ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-04T15:06:15.546Z"
    },
    {
        "LogID":  37,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  1,
        "OldValue":  "{\"ProjectID\":1,\"DepartmentID\":5,\"ProjectCode\":\"ASP-2569-RAE-001\",\"ProjectName\":\"โครงการบำรุงรักษาหุ่นยนต์ร้าน 7-11 สาขาธาราพัทยา\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"CP ALL\",\"ResponsiblePerson\":\"ดร.ภาคภูมิ\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2027-05-31\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":130000,\"CreatedBy\":3,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-03T14:59:16.822Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "NewValue":  "{\"ProjectID\":1,\"DepartmentID\":5,\"ProjectCode\":\"ASP-2569-RAE-001\",\"ProjectName\":\"โครงการบำรุงรักษาหุ่นยนต์ร้าน 7-11 สาขาธาราพัทยา\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"CP ALL\",\"ResponsiblePerson\":\"ดร.ภาคภูมิ ปฐมภาค\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2027-05-31\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":130000,\"CreatedBy\":3,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-05T01:50:38.457Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T01:50:38.459Z"
    },
    {
        "LogID":  38,
        "UserID":  2,
        "Module":  "Authentication",
        "Action":  "Logout",
        "RecordID":  2,
        "OldValue":  "",
        "NewValue":  "ออกจากระบบ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T01:53:32.459Z"
    },
    {
        "LogID":  39,
        "UserID":  6,
        "Module":  "Authentication",
        "Action":  "Login",
        "RecordID":  6,
        "OldValue":  "",
        "NewValue":  "เข้าสู่ระบบสำเร็จ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T01:53:57.578Z"
    },
    {
        "LogID":  40,
        "UserID":  6,
        "Module":  "Authentication",
        "Action":  "Logout",
        "RecordID":  6,
        "OldValue":  "",
        "NewValue":  "ออกจากระบบ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T02:18:45.468Z"
    },
    {
        "LogID":  41,
        "UserID":  1,
        "Module":  "Authentication",
        "Action":  "Login",
        "RecordID":  1,
        "OldValue":  "",
        "NewValue":  "เข้าสู่ระบบสำเร็จ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T02:19:36.485Z"
    },
    {
        "LogID":  42,
        "UserID":  1,
        "Module":  "Authentication",
        "Action":  "Logout",
        "RecordID":  1,
        "OldValue":  "",
        "NewValue":  "ออกจากระบบ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T02:40:46.434Z"
    },
    {
        "LogID":  43,
        "UserID":  2,
        "Module":  "Authentication",
        "Action":  "Login",
        "RecordID":  2,
        "OldValue":  "",
        "NewValue":  "เข้าสู่ระบบสำเร็จ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T02:41:00.493Z"
    },
    {
        "LogID":  44,
        "UserID":  2,
        "Module":  "Users",
        "Action":  "Create",
        "RecordID":  7,
        "OldValue":  "",
        "NewValue":  "{\"UserID\":7,\"DepartmentID\":2,\"EmployeeID\":\"EMP-007\",\"Username\":\"admin_cai\",\"Password\":\"password123\",\"FullName\":\"รศ.ดร.ปริญญา สงวนสัตย์\",\"Email\":\"\",\"Phone\":\"\",\"Role\":\"Department Admin\",\"Status\":\"Active\",\"CreatedAt\":\"2026-07-05T02:43:49.017Z\",\"UpdatedAt\":\"2026-07-05T02:43:49.017Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T02:43:49.023Z"
    },
    {
        "LogID":  45,
        "UserID":  2,
        "Module":  "Users",
        "Action":  "Create",
        "RecordID":  8,
        "OldValue":  "",
        "NewValue":  "{\"UserID\":8,\"DepartmentID\":4,\"EmployeeID\":\"EMP-008\",\"Username\":\"admin_dit\",\"Password\":\"password123\",\"FullName\":\"ดร.ชนกานต์ กิ่งแก้ว\",\"Email\":\"\",\"Phone\":\"\",\"Role\":\"Department Admin\",\"Status\":\"Active\",\"CreatedAt\":\"2026-07-05T02:45:17.667Z\",\"UpdatedAt\":\"2026-07-05T02:45:17.667Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T02:45:17.669Z"
    },
    {
        "LogID":  46,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  8,
        "OldValue":  "{\"ProjectID\":8,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-001\",\"ProjectName\":\"โครงการจัดอบรม AI for Industrial management\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บริษัท อุตสาหกรรมจำกัด\",\"ResponsiblePerson\":\"ผศ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-07-31\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-03T14:35:02.270Z\",\"Objective\":\"\",\"Description\":\"\",\"Batches\":[{\"Name\":\"รุ่นที่ 1\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-06-30\"},{\"Name\":\"รุ่นที่ 2\",\"StartDate\":\"2026-07-01\",\"EndDate\":\"2026-07-31\"}]}",
        "NewValue":  "{\"ProjectID\":8,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-001\",\"ProjectName\":\"โครงการจัดอบรม AI for Industrial management\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บริษัท อุตสาหกรรมจำกัด\",\"ResponsiblePerson\":\"ผศ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-07-31\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-05T04:03:37.903Z\",\"Objective\":\"\",\"Description\":\"\",\"Batches\":[{\"Name\":\"รุ่นที่ 1\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-06-30\"},{\"Name\":\"รุ่นที่ 2\",\"StartDate\":\"2026-07-01\",\"EndDate\":\"2026-07-31\"}]}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:03:37.905Z"
    },
    {
        "LogID":  47,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  9,
        "OldValue":  "{\"ProjectID\":9,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-002\",\"ProjectName\":\"โครงการจัดอบรม การบริหารจัดการก๊าซเรือนกระจกระดับองค์กรและห่วงโซ่อุปทาน\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"หน่วยงานลดการปล่อยคาร์บอน\",\"ResponsiblePerson\":\"อ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-05\",\"EndDate\":\"2026-08-05\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-03T14:32:14.475Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "NewValue":  "{\"ProjectID\":9,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-002\",\"ProjectName\":\"โครงการจัดอบรม การบริหารจัดการก๊าซเรือนกระจกระดับองค์กรและห่วงโซ่อุปทาน\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"หน่วยงานลดการปล่อยคาร์บอน\",\"ResponsiblePerson\":\"อ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-05\",\"EndDate\":\"2026-08-05\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-05T04:03:44.003Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:03:44.005Z"
    },
    {
        "LogID":  48,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  10,
        "OldValue":  "{\"ProjectID\":10,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-003\",\"ProjectName\":\"โครงการจัดอบรม Advance AI for Industrial management\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บริษัท เทคโนโลยีอุตสาหกรรม\",\"ResponsiblePerson\":\"อ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-10\",\"EndDate\":\"2026-08-10\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-03T14:32:37.322Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "NewValue":  "{\"ProjectID\":10,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-003\",\"ProjectName\":\"โครงการจัดอบรม Advance AI for Industrial management\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บริษัท เทคโนโลยีอุตสาหกรรม\",\"ResponsiblePerson\":\"อ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-10\",\"EndDate\":\"2026-08-10\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-05T04:03:50.630Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:03:50.633Z"
    },
    {
        "LogID":  49,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  11,
        "OldValue":  "{\"ProjectID\":11,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-004\",\"ProjectName\":\"โครงการจัดอบรม Industrial Cost Management\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"ผู้ประกอบการ SME\",\"ResponsiblePerson\":\"อ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-15\",\"EndDate\":\"2026-08-15\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-03T14:32:43.304Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "NewValue":  "{\"ProjectID\":11,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-004\",\"ProjectName\":\"โครงการจัดอบรม Industrial Cost Management\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"ผู้ประกอบการ SME\",\"ResponsiblePerson\":\"อ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-15\",\"EndDate\":\"2026-08-15\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-05T04:03:56.819Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:03:56.822Z"
    },
    {
        "LogID":  50,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  12,
        "OldValue":  "{\"ProjectID\":12,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-005\",\"ProjectName\":\"โครงการจัดอบรมการบริหารจัดการอุตสาหกรรม\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"สมาคมบริหารจัดการอุตสาหกรรม\",\"ResponsiblePerson\":\"อ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-20\",\"EndDate\":\"2026-08-20\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-03T14:32:54.919Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "NewValue":  "{\"ProjectID\":12,\"DepartmentID\":3,\"ProjectCode\":\"ASP-2569-IEM-005\",\"ProjectName\":\"โครงการจัดอบรมการบริหารจัดการอุตสาหกรรม\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"สมาคมบริหารจัดการอุตสาหกรรม\",\"ResponsiblePerson\":\"อ.สุคนธ์ทิพย์ เพิ่มศิลป์\",\"StartDate\":\"2026-06-20\",\"EndDate\":\"2026-08-20\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":4,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-05T04:05:10.326Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:05:10.329Z"
    },
    {
        "LogID":  51,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  13,
        "OldValue":  "{\"ProjectID\":13,\"DepartmentID\":7,\"ProjectCode\":\"ASP-2569-MAI-001\",\"ProjectName\":\"หลักสูตรวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจสำหรับภาคอุตสาหกรรม\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บริษัท ยานยนต์แห่งอนาคต\",\"ResponsiblePerson\":\"ผศ.ดร.นิเวศ จิระวิชิตชัย\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-11-30\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":1200000,\"CreatedBy\":5,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-04T13:21:13.294Z\",\"Objective\":\"\",\"Description\":\"\",\"Batches\":[{\"Name\":\"รุ่นที่ 1 (วิทยาการข้อมูล)\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-07-31\"},{\"Name\":\"รุ่นที่ 2 (การวิเคราะห์เชิงธุรกิจ)\",\"StartDate\":\"2026-08-01\",\"EndDate\":\"2026-09-30\"},{\"Name\":\"รุ่นที่ 3 (โครงงานภาคอุตสาหกรรม)\",\"StartDate\":\"2026-10-01\",\"EndDate\":\"2026-11-30\"}]}",
        "NewValue":  "{\"ProjectID\":13,\"DepartmentID\":7,\"ProjectCode\":\"ASP-2569-MAI-001\",\"ProjectName\":\"หลักสูตรวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจสำหรับภาคอุตสาหกรรม\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บริษัท ยานยนต์แห่งอนาคต\",\"ResponsiblePerson\":\"ผศ.ดร.นิเวศ จิระวิชิตชัย\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-11-30\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":1200000,\"CreatedBy\":5,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-05T04:05:16.062Z\",\"Objective\":\"\",\"Description\":\"\",\"Batches\":[{\"Name\":\"รุ่นที่ 1 (วิทยาการข้อมูล)\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2026-07-31\"},{\"Name\":\"รุ่นที่ 2 (การวิเคราะห์เชิงธุรกิจ)\",\"StartDate\":\"2026-08-01\",\"EndDate\":\"2026-09-30\"},{\"Name\":\"รุ่นที่ 3 (โครงงานภาคอุตสาหกรรม)\",\"StartDate\":\"2026-10-01\",\"EndDate\":\"2026-11-30\"}]}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:05:16.063Z"
    },
    {
        "LogID":  52,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  14,
        "OldValue":  "{\"ProjectID\":14,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-001\",\"ProjectName\":\"เทคโนโลยียานยนต์สมัยใหม่ \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร.ภูมิ \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-07-23\",\"EndDate\":\"2026-07-25\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":200000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T13:46:11.790Z\",\"UpdatedAt\":\"2026-07-03T14:00:26.682Z\"}",
        "NewValue":  "{\"ProjectID\":14,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-001\",\"ProjectName\":\"เทคโนโลยียานยนต์สมัยใหม่ \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร.ภูมิ \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-07-23\",\"EndDate\":\"2026-07-25\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":200000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T13:46:11.790Z\",\"UpdatedAt\":\"2026-07-05T04:05:22.427Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:05:22.428Z"
    },
    {
        "LogID":  53,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  15,
        "OldValue":  "{\"ProjectID\":15,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-002\",\"ProjectName\":\"Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ยอดนภา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-02\",\"EndDate\":\"2026-08-04\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T13:54:35.352Z\",\"UpdatedAt\":\"2026-07-03T14:08:14.130Z\"}",
        "NewValue":  "{\"ProjectID\":15,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-002\",\"ProjectName\":\"Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ยอดนภา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-02\",\"EndDate\":\"2026-08-04\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T13:54:35.352Z\",\"UpdatedAt\":\"2026-07-05T04:05:28.169Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:05:28.173Z"
    },
    {
        "LogID":  54,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  16,
        "OldValue":  "{\"ProjectID\":16,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-003\",\"ProjectName\":\"กาบำรุงรักษาทวีผลแบบทุกคนมีส่วนร่วม Total Productive Maintenance \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร.กรีฑา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-27\",\"EndDate\":\"2026-08-25\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T14:04:40.896Z\",\"UpdatedAt\":\"2026-07-03T14:08:55.368Z\"}",
        "NewValue":  "{\"ProjectID\":16,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-003\",\"ProjectName\":\"กาบำรุงรักษาทวีผลแบบทุกคนมีส่วนร่วม Total Productive Maintenance \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร.กรีฑา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-27\",\"EndDate\":\"2026-08-25\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T14:04:40.896Z\",\"UpdatedAt\":\"2026-07-05T04:05:32.606Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:05:32.609Z"
    },
    {
        "LogID":  55,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  17,
        "OldValue":  "{\"ProjectID\":17,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-004\",\"ProjectName\":\"เทคนิคงานเขียนแบบวิศวกรรมด้วยโปรแกรม SOLIDWORKS\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร.บัณฑิต \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-07\",\"EndDate\":\"2026-09-11\",\"ProjectStatus\":\"In Progress\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T14:28:53.181Z\",\"UpdatedAt\":\"2026-07-03T14:29:36.587Z\"}",
        "NewValue":  "{\"ProjectID\":17,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-004\",\"ProjectName\":\"เทคนิคงานเขียนแบบวิศวกรรมด้วยโปรแกรม SOLIDWORKS\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร.บัณฑิต \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-07\",\"EndDate\":\"2026-09-11\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T14:28:53.181Z\",\"UpdatedAt\":\"2026-07-05T04:05:39.532Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:05:39.535Z"
    },
    {
        "LogID":  56,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  18,
        "OldValue":  "{\"ProjectID\":18,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-001\",\"ProjectName\":\"อบรมการสร้างระบบปัญญาประดิษฐ์ด้วยแบบจำลองภาษาขนาดใหญ่\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.ปริญญา สงวนสัตย์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-05-03\",\"EndDate\":\"2027-05-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":82000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:25:20.289Z\",\"UpdatedAt\":\"2026-07-04T13:25:20.289Z\"}",
        "NewValue":  "{\"ProjectID\":18,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-001\",\"ProjectName\":\"อบรมการสร้างระบบปัญญาประดิษฐ์ด้วยแบบจำลองภาษาขนาดใหญ่\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.ปริญญา สงวนสัตย์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-05-03\",\"EndDate\":\"2027-05-04\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":82000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:25:20.289Z\",\"UpdatedAt\":\"2026-07-05T04:05:47.273Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:05:47.275Z"
    },
    {
        "LogID":  57,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  19,
        "OldValue":  "{\"ProjectID\":19,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-002\",\"ProjectName\":\"ถอดรหัสความคิด สร้างนวัตกรรมดิจิทัลด้วยการเรียนรู้แบบ STEM\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร. ติณณภพ ดินดำ\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2570-06-09\",\"EndDate\":\"2570-09-05\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":54000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:27:40.462Z\",\"UpdatedAt\":\"2026-07-04T13:27:40.462Z\"}",
        "NewValue":  "{\"ProjectID\":19,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-002\",\"ProjectName\":\"ถอดรหัสความคิด สร้างนวัตกรรมดิจิทัลด้วยการเรียนรู้แบบ STEM\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร. ติณณภพ ดินดำ\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2570-06-09\",\"EndDate\":\"2570-09-05\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":54000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:27:40.462Z\",\"UpdatedAt\":\"2026-07-05T04:05:53.250Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:05:53.255Z"
    },
    {
        "LogID":  58,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  20,
        "OldValue":  "{\"ProjectID\":20,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-003\",\"ProjectName\":\"นวัตกรรมเครื่องมือวัดไฟฟ้า \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร. ติณณภพ ดินดำ\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2569-09-01\",\"EndDate\":\"2570-05-02\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":54000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:29:41.804Z\",\"UpdatedAt\":\"2026-07-04T13:29:41.804Z\"}",
        "NewValue":  "{\"ProjectID\":20,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-003\",\"ProjectName\":\"นวัตกรรมเครื่องมือวัดไฟฟ้า \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร. ติณณภพ ดินดำ\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2569-09-01\",\"EndDate\":\"2570-05-02\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":54000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:29:41.804Z\",\"UpdatedAt\":\"2026-07-05T04:06:04.282Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:06:04.286Z"
    },
    {
        "LogID":  59,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  21,
        "OldValue":  "{\"ProjectID\":21,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-004\",\"ProjectName\":\"Data visualization using AI (no-code)\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ. สาธิดา สุขพงษ์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-01\",\"EndDate\":\"2027-01-01\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":120000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:31:35.803Z\",\"UpdatedAt\":\"2026-07-04T13:31:35.803Z\"}",
        "NewValue":  "{\"ProjectID\":21,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-004\",\"ProjectName\":\"Data visualization using AI (no-code)\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ. สาธิดา สุขพงษ์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-01\",\"EndDate\":\"2027-01-01\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":120000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:31:35.803Z\",\"UpdatedAt\":\"2026-07-05T04:06:10.605Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:06:10.607Z"
    },
    {
        "LogID":  60,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  22,
        "OldValue":  "{\"ProjectID\":22,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-005\",\"ProjectName\":\"โครงการอบรม \\\"อัปพอร์ต ปูพื้นฐาน IoT เพื่อวิศวะคอมฯ\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ.จักรพันธ์ จิตรพงษ์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-01-01\",\"EndDate\":\"2027-05-03\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:32:45.868Z\",\"UpdatedAt\":\"2026-07-04T13:32:45.868Z\"}",
        "NewValue":  "{\"ProjectID\":22,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-005\",\"ProjectName\":\"โครงการอบรม \\\"อัปพอร์ต ปูพื้นฐาน IoT เพื่อวิศวะคอมฯ\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ.จักรพันธ์ จิตรพงษ์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-01-01\",\"EndDate\":\"2027-05-03\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:32:45.868Z\",\"UpdatedAt\":\"2026-07-05T04:06:17.884Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:06:17.887Z"
    },
    {
        "LogID":  61,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  23,
        "OldValue":  "{\"ProjectID\":23,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-006\",\"ProjectName\":\"โครงการอบรม \\\"อัปพอร์ตวิศวะคอมฯ-AI ให้เหนือกว่าใคร\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ อดิศร , อ สาธิดา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-01\",\"EndDate\":\"2027-01-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":60000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:34:37.071Z\",\"UpdatedAt\":\"2026-07-04T13:34:37.071Z\"}",
        "NewValue":  "{\"ProjectID\":23,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-006\",\"ProjectName\":\"โครงการอบรม \\\"อัปพอร์ตวิศวะคอมฯ-AI ให้เหนือกว่าใคร\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ อดิศร , อ สาธิดา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-01\",\"EndDate\":\"2027-01-04\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":60000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:34:37.071Z\",\"UpdatedAt\":\"2026-07-05T04:06:23.401Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:06:23.403Z"
    },
    {
        "LogID":  62,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  24,
        "OldValue":  "{\"ProjectID\":24,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-007\",\"ProjectName\":\"โครงการอบรม \\\"Upskill สาย DevOps เพิ่มโอกาสอัปเงินเดือน\\\"  \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ อดิศร , อ สาธิดา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-01-04\",\"EndDate\":\"2027-05-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":30000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:35:51.862Z\",\"UpdatedAt\":\"2026-07-04T13:35:51.862Z\"}",
        "NewValue":  "{\"ProjectID\":24,\"DepartmentID\":2,\"ProjectCode\":\"ASP-2569-CAI-007\",\"ProjectName\":\"โครงการอบรม \\\"Upskill สาย DevOps เพิ่มโอกาสอัปเงินเดือน\\\"  \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ อดิศร , อ สาธิดา\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-01-04\",\"EndDate\":\"2027-05-04\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":30000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:35:51.862Z\",\"UpdatedAt\":\"2026-07-05T04:06:28.448Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:06:28.452Z"
    },
    {
        "LogID":  63,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  25,
        "OldValue":  "{\"ProjectID\":25,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-001\",\"ProjectName\":\"\\\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-04\",\"EndDate\":\"2026-08-11\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":0,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:38:55.924Z\",\"UpdatedAt\":\"2026-07-04T13:45:41.249Z\"}",
        "NewValue":  "{\"ProjectID\":25,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-001\",\"ProjectName\":\"\\\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\\\"\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-04\",\"EndDate\":\"2026-08-11\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":0,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:38:55.924Z\",\"UpdatedAt\":\"2026-07-05T04:06:36.290Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:06:36.292Z"
    },
    {
        "LogID":  64,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  26,
        "OldValue":  "{\"ProjectID\":26,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-002\",\"ProjectName\":\"โครงการ เรียนรู้ตลอดชีวิตและพัฒนาทักษะเพื่ออนาคต (Upskill/Reskill) หลักสูตร (AI for Cybersecurity)\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-06-04\",\"EndDate\":\"2026-12-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":250000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:40:08.115Z\",\"UpdatedAt\":\"2026-07-04T13:40:08.115Z\"}",
        "NewValue":  "{\"ProjectID\":26,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-002\",\"ProjectName\":\"โครงการ เรียนรู้ตลอดชีวิตและพัฒนาทักษะเพื่ออนาคต (Upskill/Reskill) หลักสูตร (AI for Cybersecurity)\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-06-04\",\"EndDate\":\"2026-12-04\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":250000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:40:08.115Z\",\"UpdatedAt\":\"2026-07-05T04:06:45.866Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:06:45.870Z"
    },
    {
        "LogID":  65,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  27,
        "OldValue":  "{\"ProjectID\":27,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-003\",\"ProjectName\":\"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 1/2569\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-07-20\",\"EndDate\":\"2026-07-21\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:41:39.093Z\",\"UpdatedAt\":\"2026-07-04T13:41:39.093Z\"}",
        "NewValue":  "{\"ProjectID\":27,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-003\",\"ProjectName\":\"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 1/2569\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-07-20\",\"EndDate\":\"2026-07-21\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:41:39.093Z\",\"UpdatedAt\":\"2026-07-05T04:06:52.623Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:06:52.624Z"
    },
    {
        "LogID":  66,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  28,
        "OldValue":  "{\"ProjectID\":28,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-004\",\"ProjectName\":\"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 2/2569\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-03-04\",\"EndDate\":\"2027-03-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:42:48.644Z\",\"UpdatedAt\":\"2026-07-04T13:42:48.644Z\"}",
        "NewValue":  "{\"ProjectID\":28,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-004\",\"ProjectName\":\"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 2/2569\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-03-04\",\"EndDate\":\"2027-03-04\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":100000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:42:48.644Z\",\"UpdatedAt\":\"2026-07-05T04:06:58.204Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:06:58.206Z"
    },
    {
        "LogID":  67,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  29,
        "OldValue":  "{\"ProjectID\":29,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-005\",\"ProjectName\":\"หลักสูตรอบรม Cybersecurity Forensics (DFIR) Bootcamp: Digital Evidence \u0026 Incident Response\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-11-04\",\"EndDate\":\"2026-11-04\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":150000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:43:48.390Z\",\"UpdatedAt\":\"2026-07-04T13:43:48.390Z\"}",
        "NewValue":  "{\"ProjectID\":29,\"DepartmentID\":6,\"ProjectCode\":\"ASP-2569-CYB-005\",\"ProjectName\":\"หลักสูตรอบรม Cybersecurity Forensics (DFIR) Bootcamp: Digital Evidence \u0026 Incident Response\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"รศ.ดร.อรรณพ หมั่นสกุล\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-11-04\",\"EndDate\":\"2026-11-04\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":150000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-04T13:43:48.390Z\",\"UpdatedAt\":\"2026-07-05T04:07:04.671Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T04:07:04.675Z"
    },
    {
        "LogID":  68,
        "UserID":  2,
        "Module":  "Authentication",
        "Action":  "Logout",
        "RecordID":  2,
        "OldValue":  "",
        "NewValue":  "ออกจากระบบ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T08:23:46.080Z"
    },
    {
        "LogID":  69,
        "UserID":  2,
        "Module":  "Authentication",
        "Action":  "Login",
        "RecordID":  2,
        "OldValue":  "",
        "NewValue":  "เข้าสู่ระบบสำเร็จ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T08:24:03.479Z"
    },
    {
        "LogID":  70,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  30,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":30,\"DepartmentID\":4,\"ProjectCode\":\"ASP-2569-DIT-001\",\"ProjectName\":\"โครงการบริการวิชาการร่วมกับ GoSoft\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"GoSoft\",\"ResponsiblePerson\":\"อ.ดร.ชนกานต์ กิ่งแก้ว\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-12-01\",\"EndDate\":\"2026-12-05\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":400000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:38:52.507Z\",\"UpdatedAt\":\"2026-07-05T11:38:52.508Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:38:52.514Z"
    },
    {
        "LogID":  71,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  31,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":31,\"DepartmentID\":4,\"ProjectCode\":\"ASP-2569-DIT-002\",\"ProjectName\":\"โครงการบริการวิชาการอบรมปั้นโมเดล 3D ด้วยโปรแกรม blender ในยุค AI สำหรับอนิเมชั่นและเกม\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ.ดนัยเลิศ\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2027-03-01\",\"EndDate\":\"2027-03-05\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":70093,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:40:51.869Z\",\"UpdatedAt\":\"2026-07-05T11:40:51.869Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:40:51.873Z"
    },
    {
        "LogID":  72,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  32,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":32,\"DepartmentID\":4,\"ProjectCode\":\"ASP-2569-DIT-003\",\"ProjectName\":\"โครงการบริการวิชาการอบรสร้างระบบช่วยงานครูอัตโนมัติด้วย AI\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ. วุฒิกานต์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-01\",\"EndDate\":\"2026-09-05\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":10000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:42:58.516Z\",\"UpdatedAt\":\"2026-07-05T11:42:58.516Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:42:58.519Z"
    },
    {
        "LogID":  73,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  33,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":33,\"DepartmentID\":4,\"ProjectCode\":\"ASP-2569-DIT-004\",\"ProjectName\":\"โครงการบริการวิชาการอบรมสร้าง AI Chatbot สำหรับใช้งานในองค์กร\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุุคคลทั่วไป\",\"ResponsiblePerson\":\"อ. วุฒิกานต์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-08-17\",\"EndDate\":\"2026-08-20\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":10000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:44:31.995Z\",\"UpdatedAt\":\"2026-07-05T11:44:31.995Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:44:31.998Z"
    },
    {
        "LogID":  74,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  34,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":34,\"DepartmentID\":4,\"ProjectCode\":\"ASP-2569-DIT-005\",\"ProjectName\":\"โครงการบริการวิชาการอบรมนักพัฒนา AI ยุคใหม่ (Next-Gen AI Developer)\",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"อ. วุฒิกานต์\",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-09-14\",\"EndDate\":\"2026-09-15\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":10000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:46:26.289Z\",\"UpdatedAt\":\"2026-07-05T11:46:26.289Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:46:26.294Z"
    },
    {
        "LogID":  75,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  1,
        "OldValue":  "{\"ProjectID\":1,\"DepartmentID\":5,\"ProjectCode\":\"ASP-2569-RAE-001\",\"ProjectName\":\"โครงการบำรุงรักษาหุ่นยนต์ร้าน 7-11 สาขาธาราพัทยา\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"CP ALL\",\"ResponsiblePerson\":\"ดร.ภาคภูมิ ปฐมภาค\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2027-05-31\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":130000,\"CreatedBy\":3,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-05T01:50:38.457Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "NewValue":  "{\"ProjectID\":1,\"DepartmentID\":5,\"ProjectCode\":\"ASP-2569-RAE-001\",\"ProjectName\":\"โครงการบำรุงรักษาหุ่นยนต์ร้าน 7-11 สาขาธาราพัทยา\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"CP ALL\",\"ResponsiblePerson\":\"ดร.ภาคภูมิ ปฐมภาค\",\"StartDate\":\"2026-06-01\",\"EndDate\":\"2027-05-31\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":130000,\"CreatedBy\":3,\"CreatedAt\":\"2026-06-01T08:00:00Z\",\"UpdatedAt\":\"2026-07-05T11:51:26.150Z\",\"Objective\":\"\",\"Description\":\"\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:51:26.154Z"
    },
    {
        "LogID":  76,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Create",
        "RecordID":  14,
        "OldValue":  "",
        "NewValue":  "{\"ExpenseID\":14,\"ProjectID\":30,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":120000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:54:52.181Z\",\"UpdatedAt\":\"2026-07-05T11:54:52.181Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:54:52.186Z"
    },
    {
        "LogID":  77,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Update",
        "RecordID":  14,
        "OldValue":  "{\"ExpenseID\":14,\"ProjectID\":30,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":120000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:54:52.181Z\",\"UpdatedAt\":\"2026-07-05T11:54:52.181Z\"}",
        "NewValue":  "{\"ExpenseID\":14,\"ProjectID\":30,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":120000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:54:52.181Z\",\"UpdatedAt\":\"2026-07-05T11:56:00.448Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:56:00.450Z"
    },
    {
        "LogID":  78,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  14,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":14,\"ProjectID\":30,\"TransactionDate\":\"2026-07-05\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Registration Fee\",\"Description\":\"\",\"Amount\":400000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:56:56.839Z\",\"UpdatedAt\":\"2026-07-05T11:56:56.839Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:56:56.844Z"
    },
    {
        "LogID":  79,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  15,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":15,\"ProjectID\":31,\"TransactionDate\":\"2026-07-05\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Registration Fee\",\"Description\":\"\",\"Amount\":70093,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:57:57.151Z\",\"UpdatedAt\":\"2026-07-05T11:57:57.151Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:57:57.154Z"
    },
    {
        "LogID":  80,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Create",
        "RecordID":  15,
        "OldValue":  "",
        "NewValue":  "{\"ExpenseID\":15,\"ProjectID\":31,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":31790,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:58:43.421Z\",\"UpdatedAt\":\"2026-07-05T11:58:43.421Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:58:43.422Z"
    },
    {
        "LogID":  81,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  16,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":16,\"ProjectID\":32,\"TransactionDate\":\"2026-07-05\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Registration Fee\",\"Description\":\"\",\"Amount\":10000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T11:59:51.447Z\",\"UpdatedAt\":\"2026-07-05T11:59:51.447Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T11:59:51.448Z"
    },
    {
        "LogID":  82,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Create",
        "RecordID":  16,
        "OldValue":  "",
        "NewValue":  "{\"ExpenseID\":16,\"ProjectID\":32,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":3000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T12:00:07.801Z\",\"UpdatedAt\":\"2026-07-05T12:00:07.801Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T12:00:07.806Z"
    },
    {
        "LogID":  83,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  17,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":17,\"ProjectID\":33,\"TransactionDate\":\"2026-07-05\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Registration Fee\",\"Description\":\"\",\"Amount\":10000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T12:01:00.502Z\",\"UpdatedAt\":\"2026-07-05T12:01:00.502Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T12:01:00.504Z"
    },
    {
        "LogID":  84,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Create",
        "RecordID":  17,
        "OldValue":  "",
        "NewValue":  "{\"ExpenseID\":17,\"ProjectID\":33,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":3000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T12:01:22.748Z\",\"UpdatedAt\":\"2026-07-05T12:01:22.748Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T12:01:22.751Z"
    },
    {
        "LogID":  85,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  18,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":18,\"ProjectID\":34,\"TransactionDate\":\"2026-07-05\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Registration Fee\",\"Description\":\"\",\"Amount\":10000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T12:01:49.007Z\",\"UpdatedAt\":\"2026-07-05T12:01:49.007Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T12:01:49.010Z"
    },
    {
        "LogID":  86,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Create",
        "RecordID":  18,
        "OldValue":  "",
        "NewValue":  "{\"ExpenseID\":18,\"ProjectID\":34,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":3000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T12:02:13.751Z\",\"UpdatedAt\":\"2026-07-05T12:02:13.751Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T12:02:13.753Z"
    },
    {
        "LogID":  87,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  14,
        "OldValue":  "{\"ProjectID\":14,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-001\",\"ProjectName\":\"เทคโนโลยียานยนต์สมัยใหม่ \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร.ภูมิ \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-07-23\",\"EndDate\":\"2026-07-25\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":200000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T13:46:11.790Z\",\"UpdatedAt\":\"2026-07-05T04:05:22.427Z\"}",
        "NewValue":  "{\"ProjectID\":14,\"DepartmentID\":1,\"ProjectCode\":\"ASP-2569-AME-001\",\"ProjectName\":\"เทคโนโลยียานยนต์สมัยใหม่ \",\"FiscalYear\":\"2569\",\"ProjectType\":\"อบรม\",\"Customer\":\"บุคคลทั่วไป\",\"ResponsiblePerson\":\"ผศ.ดร.ภูมิ \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-07-23\",\"EndDate\":\"2026-07-25\",\"ProjectStatus\":\"Planned\",\"PlannedBudget\":200000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-03T13:46:11.790Z\",\"UpdatedAt\":\"2026-07-05T12:04:32.863Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T12:04:32.868Z"
    },
    {
        "LogID":  88,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  19,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":19,\"ProjectID\":14,\"TransactionDate\":\"2026-07-05\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Registration Fee\",\"Description\":\"\",\"Amount\":200000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T13:02:04.846Z\",\"UpdatedAt\":\"2026-07-05T13:02:04.846Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T13:02:04.849Z"
    },
    {
        "LogID":  89,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Create",
        "RecordID":  19,
        "OldValue":  "",
        "NewValue":  "{\"ExpenseID\":19,\"ProjectID\":14,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":160000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T13:02:32.300Z\",\"UpdatedAt\":\"2026-07-05T13:02:32.300Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T13:02:32.305Z"
    },
    {
        "LogID":  90,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  20,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":20,\"ProjectID\":15,\"TransactionDate\":\"2026-07-05\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Registration Fee\",\"Description\":\"\",\"Amount\":100000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T13:03:22.282Z\",\"UpdatedAt\":\"2026-07-05T13:03:22.282Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T13:03:22.284Z"
    },
    {
        "LogID":  91,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Create",
        "RecordID":  20,
        "OldValue":  "",
        "NewValue":  "{\"ExpenseID\":20,\"ProjectID\":15,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":80000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T13:04:09.249Z\",\"UpdatedAt\":\"2026-07-05T13:04:09.249Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T13:04:09.252Z"
    },
    {
        "LogID":  92,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  21,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":21,\"ProjectID\":16,\"TransactionDate\":\"2026-07-05\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Registration Fee\",\"Description\":\"\",\"Amount\":100000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T13:04:44.924Z\",\"UpdatedAt\":\"2026-07-05T13:04:44.924Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T13:04:44.927Z"
    },
    {
        "LogID":  93,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Create",
        "RecordID":  21,
        "OldValue":  "",
        "NewValue":  "{\"ExpenseID\":21,\"ProjectID\":16,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":80000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T13:05:10.188Z\",\"UpdatedAt\":\"2026-07-05T13:05:10.188Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T13:05:10.192Z"
    },
    {
        "LogID":  94,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  22,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":22,\"ProjectID\":17,\"TransactionDate\":\"2026-07-05\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Registration Fee\",\"Description\":\"\",\"Amount\":100000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T13:05:44.245Z\",\"UpdatedAt\":\"2026-07-05T13:05:44.245Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T13:05:44.250Z"
    },
    {
        "LogID":  95,
        "UserID":  2,
        "Module":  "ExpenseTransactions",
        "Action":  "Create",
        "RecordID":  22,
        "OldValue":  "",
        "NewValue":  "{\"ExpenseID\":22,\"ProjectID\":17,\"TransactionDate\":\"2026-07-05\",\"ExpenseNumber\":\"001\",\"ExpenseType\":\"Materials\",\"Description\":\"\",\"Amount\":80000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-05T13:06:02.618Z\",\"UpdatedAt\":\"2026-07-05T13:06:02.618Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-05T13:06:02.622Z"
    },
    {
        "LogID":  96,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Create",
        "RecordID":  35,
        "OldValue":  "",
        "NewValue":  "{\"ProjectID\":35,\"DepartmentID\":8,\"ProjectCode\":\"ASP-2569-ET-001\",\"ProjectName\":\"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"CP All\",\"ResponsiblePerson\":\"ทีมคณะวิศวฯ \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-10-26\",\"EndDate\":\"2026-10-27\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":500000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-07T08:17:08.776Z\",\"UpdatedAt\":\"2026-07-07T08:17:08.776Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-07T08:17:08.780Z"
    },
    {
        "LogID":  97,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Delete",
        "RecordID":  7,
        "OldValue":  "{\"RevenueID\":7,\"ProjectID\":7,\"TransactionDate\":\"2026-07-02\",\"ReceiptNumber\":\"REC-RAE-007\",\"RevenueType\":\"Contract Payment\",\"Description\":\"เบิกจ่ายงวดที่ 1 โครงการ VEX Robotics\",\"Amount\":0,\"Remark\":\"ผ่านระบบมหาลัย\",\"CreatedBy\":3,\"CreatedAt\":\"2026-07-02T10:00:00Z\",\"UpdatedAt\":\"2026-07-03T14:57:12.420Z\"}",
        "NewValue":  "Deleted",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-07T08:17:56.441Z"
    },
    {
        "LogID":  98,
        "UserID":  2,
        "Module":  "RevenueTransactions",
        "Action":  "Create",
        "RecordID":  23,
        "OldValue":  "",
        "NewValue":  "{\"RevenueID\":23,\"ProjectID\":35,\"TransactionDate\":\"2026-09-07\",\"ReceiptNumber\":\"001\",\"RevenueType\":\"Government Support\",\"Description\":\"\",\"Amount\":500000,\"Remark\":\"\",\"CreatedBy\":2,\"CreatedAt\":\"2026-07-07T08:18:58.296Z\",\"UpdatedAt\":\"2026-07-07T08:18:58.296Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-07T08:18:58.302Z"
    },
    {
        "LogID":  99,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  35,
        "OldValue":  "{\"ProjectID\":35,\"DepartmentID\":8,\"ProjectCode\":\"ASP-2569-ET-001\",\"ProjectName\":\"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"CP All\",\"ResponsiblePerson\":\"ทีมคณะวิศวฯ \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-10-26\",\"EndDate\":\"2026-10-27\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":500000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-07T08:17:08.776Z\",\"UpdatedAt\":\"2026-07-07T08:17:08.776Z\"}",
        "NewValue":  "{\"ProjectID\":35,\"DepartmentID\":8,\"ProjectCode\":\"ASP-2569-ET-001\",\"ProjectName\":\"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"CP All\",\"ResponsiblePerson\":\"ทีมคณะวิศวฯ \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-10-26\",\"EndDate\":\"2026-10-27\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":0,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-07T08:17:08.776Z\",\"UpdatedAt\":\"2026-07-07T08:22:40.021Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-07T08:22:40.024Z"
    },
    {
        "LogID":  100,
        "UserID":  2,
        "Module":  "Projects",
        "Action":  "Update",
        "RecordID":  35,
        "OldValue":  "{\"ProjectID\":35,\"DepartmentID\":8,\"ProjectCode\":\"ASP-2569-ET-001\",\"ProjectName\":\"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"CP All\",\"ResponsiblePerson\":\"ทีมคณะวิศวฯ \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-10-26\",\"EndDate\":\"2026-10-27\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":0,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-07T08:17:08.776Z\",\"UpdatedAt\":\"2026-07-07T08:22:40.021Z\"}",
        "NewValue":  "{\"ProjectID\":35,\"DepartmentID\":8,\"ProjectCode\":\"ASP-2569-ET-001\",\"ProjectName\":\"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\",\"FiscalYear\":\"2569\",\"ProjectType\":\"บริการวิชาการ\",\"Customer\":\"CP All\",\"ResponsiblePerson\":\"ทีมคณะวิศวฯ \",\"Objective\":\"\",\"Description\":\"\",\"StartDate\":\"2026-10-26\",\"EndDate\":\"2026-10-27\",\"ProjectStatus\":\"Draft\",\"PlannedBudget\":500000,\"CreatedBy\":2,\"CreatedAt\":\"2026-07-07T08:17:08.776Z\",\"UpdatedAt\":\"2026-07-07T08:23:10.017Z\"}",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-07T08:23:10.023Z"
    },
    {
        "LogID":  101,
        "UserID":  2,
        "Module":  "Authentication",
        "Action":  "Logout",
        "RecordID":  2,
        "OldValue":  "",
        "NewValue":  "ออกจากระบบ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-08T05:50:42.615Z"
    },
    {
        "LogID":  102,
        "UserID":  2,
        "Module":  "Authentication",
        "Action":  "Login",
        "RecordID":  2,
        "OldValue":  "",
        "NewValue":  "เข้าสู่ระบบสำเร็จ",
        "IPAddress":  "127.0.0.1",
        "CreatedAt":  "2026-07-08T05:52:50.741Z"
    }
];

const NOTIFICATIONS_SEED = [
    {
        "NotificationID":  1,
        "UserID":  2,
        "Title":  "โครงการใหม่ในระบบ",
        "Message":  "ดร.ภาคภูมิ เพิ่มโครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์ VEX Robotics",
        "NotificationType":  "New Project",
        "Status":  "Read",
        "CreatedAt":  "2026-07-01T10:00:00Z",
        "ReadAt":  "2026-07-03T12:08:39.470Z"
    },
    {
        "NotificationID":  2,
        "UserID":  3,
        "Title":  "ธุรกรรมการเงินได้รับการบันทึก",
        "Message":  "ยอดการเงินโครงการบำรุงรักษาหุ่นยนต์สาขาธาราพัทยา ได้รับการยืนยัน",
        "NotificationType":  "Revenue Updated",
        "Status":  "Read",
        "CreatedAt":  "2026-06-10T12:00:00Z",
        "ReadAt":  "2026-06-10T13:00:00Z"
    },
    {
        "NotificationID":  3,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"เทคโนโลยียานยนต์สมัยใหม่ \" สร้างโดยสาขา AME",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:46:11.791Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  4,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"เทคโนโลยียานยนต์สมัยใหม่ \" สร้างโดยสาขา AME",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:46:11.791Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  5,
        "UserID":  2,
        "Title":  "สถานะโครงการเปลี่ยนไป",
        "Message":  "โครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \" เปลี่ยนสถานะเป็น In Progress",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:49:34.522Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  6,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:52:01.301Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  7,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)\" สร้างโดยสาขา AME",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:54:35.357Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  8,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)\" สร้างโดยสาขา AME",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:54:35.358Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  9,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:55:36.285Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  10,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 160,000 บาท ในโครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:56:50.701Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  11,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 80,000 บาท ในโครงการ \"Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)\"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:57:12.991Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  12,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:58:30.986Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  13,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:59:21.076Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  14,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 200,000 บาท ในโครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T13:59:55.816Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  15,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:00:26.685Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  16,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"กาบำรุงรักษาทวีผลแบบทุกคนมีส่วนร่วม Total Productive Maintenance \" สร้างโดยสาขา AME",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:04:40.899Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  17,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"กาบำรุงรักษาทวีผลแบบทุกคนมีส่วนร่วม Total Productive Maintenance \" สร้างโดยสาขา AME",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:04:40.900Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  18,
        "UserID":  2,
        "Title":  "สถานะโครงการเปลี่ยนไป",
        "Message":  "โครงการ \"Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)\" เปลี่ยนสถานะเป็น In Progress",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:08:14.133Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  19,
        "UserID":  2,
        "Title":  "สถานะโครงการเปลี่ยนไป",
        "Message":  "โครงการ \"กาบำรุงรักษาทวีผลแบบทุกคนมีส่วนร่วม Total Productive Maintenance \" เปลี่ยนสถานะเป็น In Progress",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:08:55.372Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  20,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"เทคนิคงานเขียนแบบวิศวกรรมด้วยโปรแกรม SOLIDWORKS\" สร้างโดยสาขา AME",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:28:53.184Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  21,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"เทคนิคงานเขียนแบบวิศวกรรมด้วยโปรแกรม SOLIDWORKS\" สร้างโดยสาขา AME",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:28:53.185Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  22,
        "UserID":  2,
        "Title":  "สถานะโครงการเปลี่ยนไป",
        "Message":  "โครงการ \"เทคนิคงานเขียนแบบวิศวกรรมด้วยโปรแกรม SOLIDWORKS\" เปลี่ยนสถานะเป็น In Progress",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:29:36.590Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  23,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม AI for Industrial management\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:31:51.812Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  24,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม การบริหารจัดการก๊าซเรือนกระจกระดับองค์กรและห่วงโซ่อุปทาน\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:32:14.476Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  25,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม Advance AI for Industrial management\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:32:37.324Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  26,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม Industrial Cost Management\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:32:43.306Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  27,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรมการบริหารจัดการอุตสาหกรรม\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:32:54.922Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  28,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม AI for Industrial management\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:33:42.631Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  29,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม AI for Industrial management\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:35:02.273Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  30,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการบำรุงรักษาหุ่นยนต์ร้าน 7-11 สาขาธาราพัทยา\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:54:48.404Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  31,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการพัฒนานวัตกรรมร้าน 7-11\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:54:55.505Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  32,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"อบรมพื้นฐาน CNC\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:55:01.631Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  33,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"อบรม Physical AI\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:55:07.598Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  34,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"อบรม Physical AI\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:55:15.294Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  35,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการค่ายวิชาการสำหรับพัฒนานักเรียนโรงเรียน\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:55:20.658Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  36,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"อบรมพื้นฐานการพัฒนาหุ่นยนต์ด้วย Robot Operating System (ROS2)\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:55:28.037Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  37,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:56:13.247Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  38,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการบำรุงรักษาหุ่นยนต์ร้าน 7-11 สาขาธาราพัทยา\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:59:16.826Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  39,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการพัฒนานวัตกรรมร้าน 7-11\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:59:31.856Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  40,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"อบรมพื้นฐาน CNC\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T14:59:51.822Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  41,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"อบรม Physical AI\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T15:00:17.623Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  42,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการค่ายวิชาการสำหรับพัฒนานักเรียนโรงเรียน\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T15:00:42.751Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  43,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"อบรมพื้นฐานการพัฒนาหุ่นยนต์ด้วย Robot Operating System (ROS2)\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-03T15:01:18.746Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  44,
        "UserID":  5,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"หลักสูตรวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจสำหรับภาคอุตสาหกรรม\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:21:13.296Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  45,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"อบรมการสร้างระบบปัญญาประดิษฐ์ด้วยแบบจำลองภาษาขนาดใหญ่\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:25:20.294Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  46,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"อบรมการสร้างระบบปัญญาประดิษฐ์ด้วยแบบจำลองภาษาขนาดใหญ่\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:25:20.296Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  47,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"ถอดรหัสความคิด สร้างนวัตกรรมดิจิทัลด้วยการเรียนรู้แบบ STEM\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:27:40.463Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  48,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"ถอดรหัสความคิด สร้างนวัตกรรมดิจิทัลด้วยการเรียนรู้แบบ STEM\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:27:40.463Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  49,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"นวัตกรรมเครื่องมือวัดไฟฟ้า \" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:29:41.805Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  50,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"นวัตกรรมเครื่องมือวัดไฟฟ้า \" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:29:41.806Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  51,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"Data visualization using AI (no-code)\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:31:35.805Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  52,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"Data visualization using AI (no-code)\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:31:35.806Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  53,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการอบรม \"อัปพอร์ต ปูพื้นฐาน IoT เพื่อวิศวะคอมฯ\"\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:32:45.874Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  54,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการอบรม \"อัปพอร์ต ปูพื้นฐาน IoT เพื่อวิศวะคอมฯ\"\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:32:45.875Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  55,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการอบรม \"อัปพอร์ตวิศวะคอมฯ-AI ให้เหนือกว่าใคร\"\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:34:37.074Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  56,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการอบรม \"อัปพอร์ตวิศวะคอมฯ-AI ให้เหนือกว่าใคร\"\" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:34:37.077Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  57,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการอบรม \"Upskill สาย DevOps เพิ่มโอกาสอัปเงินเดือน\"  \" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:35:51.864Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  58,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการอบรม \"Upskill สาย DevOps เพิ่มโอกาสอัปเงินเดือน\"  \" สร้างโดยสาขา CAI",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:35:51.865Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  59,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\"\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:38:55.926Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  60,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\"\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:38:55.927Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  61,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการ เรียนรู้ตลอดชีวิตและพัฒนาทักษะเพื่ออนาคต (Upskill/Reskill) หลักสูตร (AI for Cybersecurity)\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:40:08.120Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  62,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการ เรียนรู้ตลอดชีวิตและพัฒนาทักษะเพื่ออนาคต (Upskill/Reskill) หลักสูตร (AI for Cybersecurity)\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:40:08.123Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  63,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 1/2569\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:41:39.098Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  64,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 1/2569\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:41:39.101Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  65,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 2/2569\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:42:48.648Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  66,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 2/2569\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:42:48.649Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  67,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"หลักสูตรอบรม Cybersecurity Forensics (DFIR) Bootcamp: Digital Evidence \u0026 Incident Response\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:43:48.398Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  68,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"หลักสูตรอบรม Cybersecurity Forensics (DFIR) Bootcamp: Digital Evidence \u0026 Incident Response\" สร้างโดยสาขา CYB",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:43:48.400Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  69,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\"\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-04T13:45:41.251Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  70,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการบำรุงรักษาหุ่นยนต์ร้าน 7-11 สาขาธาราพัทยา\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T01:50:38.460Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  71,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม AI for Industrial management\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:03:37.907Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  72,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม การบริหารจัดการก๊าซเรือนกระจกระดับองค์กรและห่วงโซ่อุปทาน\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:03:44.007Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  73,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม Advance AI for Industrial management\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:03:50.639Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  74,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรม Industrial Cost Management\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:03:56.824Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  75,
        "UserID":  4,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการจัดอบรมการบริหารจัดการอุตสาหกรรม\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:05:10.332Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  76,
        "UserID":  5,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"หลักสูตรวิทยาการข้อมูลและการวิเคราะห์เชิงธุรกิจสำหรับภาคอุตสาหกรรม\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:05:16.064Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  77,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:05:22.429Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  78,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:05:28.177Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  79,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"กาบำรุงรักษาทวีผลแบบทุกคนมีส่วนร่วม Total Productive Maintenance \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:05:32.611Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  80,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"เทคนิคงานเขียนแบบวิศวกรรมด้วยโปรแกรม SOLIDWORKS\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:05:39.538Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  81,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"อบรมการสร้างระบบปัญญาประดิษฐ์ด้วยแบบจำลองภาษาขนาดใหญ่\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:05:47.277Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  82,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"ถอดรหัสความคิด สร้างนวัตกรรมดิจิทัลด้วยการเรียนรู้แบบ STEM\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:05:53.256Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  83,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"นวัตกรรมเครื่องมือวัดไฟฟ้า \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:06:04.288Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  84,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"Data visualization using AI (no-code)\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:06:10.609Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  85,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการอบรม \"อัปพอร์ต ปูพื้นฐาน IoT เพื่อวิศวะคอมฯ\"\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:06:17.888Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  86,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการอบรม \"อัปพอร์ตวิศวะคอมฯ-AI ให้เหนือกว่าใคร\"\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:06:23.407Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  87,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการอบรม \"Upskill สาย DevOps เพิ่มโอกาสอัปเงินเดือน\"  \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:06:28.452Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  88,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"\"โครงการ “Think Like a Hacker. Defend Like a Professional” เพื่อ Open House Cybersecurity Experience\"\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:06:36.293Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  89,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการ เรียนรู้ตลอดชีวิตและพัฒนาทักษะเพื่ออนาคต (Upskill/Reskill) หลักสูตร (AI for Cybersecurity)\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:06:45.873Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  90,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 1/2569\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:06:52.625Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  91,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"หลักสูตรอบรม Cybersecurity  Jumpstart ก้าวแรกสู่มือโปรความปลอดภัยไซเบอร์ ครั้งที่ 2/2569\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:06:58.207Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  92,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"หลักสูตรอบรม Cybersecurity Forensics (DFIR) Bootcamp: Digital Evidence \u0026 Incident Response\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T04:07:04.677Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  93,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการร่วมกับ GoSoft\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:38:52.521Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  94,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการร่วมกับ GoSoft\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:38:52.523Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  95,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการอบรมปั้นโมเดล 3D ด้วยโปรแกรม blender ในยุค AI สำหรับอนิเมชั่นและเกม\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:40:51.877Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  96,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการอบรมปั้นโมเดล 3D ด้วยโปรแกรม blender ในยุค AI สำหรับอนิเมชั่นและเกม\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:40:51.880Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  97,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการอบรสร้างระบบช่วยงานครูอัตโนมัติด้วย AI\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:42:58.521Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  98,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการอบรสร้างระบบช่วยงานครูอัตโนมัติด้วย AI\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:42:58.523Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  99,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการอบรมสร้าง AI Chatbot สำหรับใช้งานในองค์กร\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:44:32.000Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  100,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการอบรมสร้าง AI Chatbot สำหรับใช้งานในองค์กร\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:44:32.003Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  101,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการอบรมนักพัฒนา AI ยุคใหม่ (Next-Gen AI Developer)\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:46:26.299Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  102,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการบริการวิชาการอบรมนักพัฒนา AI ยุคใหม่ (Next-Gen AI Developer)\" สร้างโดยสาขา DIT",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:46:26.305Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  103,
        "UserID":  3,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการบำรุงรักษาหุ่นยนต์ร้าน 7-11 สาขาธาราพัทยา\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:51:26.156Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  104,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 120,000 บาท ในโครงการ \"โครงการบริการวิชาการร่วมกับ GoSoft\"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:54:52.192Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  105,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 400,000 บาท ในโครงการ \"โครงการบริการวิชาการร่วมกับ GoSoft\"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:56:56.847Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  106,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 70,093 บาท ในโครงการ \"โครงการบริการวิชาการอบรมปั้นโมเดล 3D ด้วยโปรแกรม blender ในยุค AI สำหรับอนิเมชั่นและเกม\"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:57:57.156Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  107,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 31,790 บาท ในโครงการ \"โครงการบริการวิชาการอบรมปั้นโมเดล 3D ด้วยโปรแกรม blender ในยุค AI สำหรับอนิเมชั่นและเกม\"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:58:43.424Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  108,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 10,000 บาท ในโครงการ \"โครงการบริการวิชาการอบรสร้างระบบช่วยงานครูอัตโนมัติด้วย AI\"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T11:59:51.453Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  109,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 3,000 บาท ในโครงการ \"โครงการบริการวิชาการอบรสร้างระบบช่วยงานครูอัตโนมัติด้วย AI\"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T12:00:07.809Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  110,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 10,000 บาท ในโครงการ \"โครงการบริการวิชาการอบรมสร้าง AI Chatbot สำหรับใช้งานในองค์กร\"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T12:01:00.507Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  111,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 3,000 บาท ในโครงการ \"โครงการบริการวิชาการอบรมสร้าง AI Chatbot สำหรับใช้งานในองค์กร\"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T12:01:22.755Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  112,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 10,000 บาท ในโครงการ \"โครงการบริการวิชาการอบรมนักพัฒนา AI ยุคใหม่ (Next-Gen AI Developer)\"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T12:01:49.018Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  113,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 3,000 บาท ในโครงการ \"โครงการบริการวิชาการอบรมนักพัฒนา AI ยุคใหม่ (Next-Gen AI Developer)\"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T12:02:13.755Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  114,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T12:04:32.871Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  115,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 200,000 บาท ในโครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T13:02:04.851Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  116,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 160,000 บาท ในโครงการ \"เทคโนโลยียานยนต์สมัยใหม่ \"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T13:02:32.312Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  117,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 100,000 บาท ในโครงการ \"Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)\"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T13:03:22.287Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  118,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 80,000 บาท ในโครงการ \"Digital Manufacturing \u0026 Smart Factory (IoT, AI, Automation)\"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T13:04:09.253Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  119,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 100,000 บาท ในโครงการ \"กาบำรุงรักษาทวีผลแบบทุกคนมีส่วนร่วม Total Productive Maintenance \"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T13:04:44.930Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  120,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 80,000 บาท ในโครงการ \"กาบำรุงรักษาทวีผลแบบทุกคนมีส่วนร่วม Total Productive Maintenance \"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T13:05:10.195Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  121,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 100,000 บาท ในโครงการ \"เทคนิคงานเขียนแบบวิศวกรรมด้วยโปรแกรม SOLIDWORKS\"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T13:05:44.254Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  122,
        "UserID":  2,
        "Title":  "บันทึกรายจ่ายโครงการใหม่",
        "Message":  "มีการเพิ่มรายจ่าย 80,000 บาท ในโครงการ \"เทคนิคงานเขียนแบบวิศวกรรมด้วยโปรแกรม SOLIDWORKS\"",
        "NotificationType":  "Expense Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-05T13:06:02.623Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  123,
        "UserID":  1,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\" สร้างโดยสาขา ET",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-07T08:17:08.782Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  124,
        "UserID":  2,
        "Title":  "โครงการใหม่ถูกสร้างขึ้น",
        "Message":  "มีโครงการใหม่ \"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\" สร้างโดยสาขา ET",
        "NotificationType":  "New Project",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-07T08:17:08.784Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  125,
        "UserID":  2,
        "Title":  "บันทึกรายรับโครงการใหม่",
        "Message":  "มีการเพิ่มรายรับ 500,000 บาท ในโครงการ \"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\"",
        "NotificationType":  "Revenue Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-07T08:18:58.308Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  126,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-07T08:22:40.028Z",
        "ReadAt":  null
    },
    {
        "NotificationID":  127,
        "UserID":  2,
        "Title":  "โครงการได้รับการอัปเดต",
        "Message":  "โครงการ \"โครงการพัฒนาทักษะวิศวกรรมหุ่นยนต์และระบบอัตโนมัติด้วยชุดหุ่นยนต์ VEX Robotics\" ถูกอัปเดตข้อมูล",
        "NotificationType":  "Project Updated",
        "Status":  "Unread",
        "CreatedAt":  "2026-07-07T08:23:10.029Z",
        "ReadAt":  null
    }
];

const PROGRESS_SEED = [
    {
        "ProgressID":  1,
        "ProjectID":  1,
        "ProgressDate":  "2026-06-15",
        "ProgressPercentage":  20,
        "CurrentStatus":  "In Progress",
        "CurrentActivity":  "เตรียมเครื่องมือและทีมวิศวกร",
        "Problems":  "ยังไม่พบปัญหาร้ายแรง",
        "Solutions":  "ดำเนินการทดสอบ",
        "NextAction":  "เริ่มบำรุงรักษาครั้งแรก",
        "Remark":  "ไม่มีข้อสังเกต",
        "UpdatedBy":  3,
        "CreatedAt":  "2026-06-15T08:00:00Z",
        "UpdatedAt":  "2026-06-15T08:00:00Z"
    },
    {
        "ProgressID":  2,
        "ProjectID":  1,
        "ProgressDate":  "2026-07-01",
        "ProgressPercentage":  45,
        "CurrentStatus":  "In Progress",
        "CurrentActivity":  "เข้าตรวจสอบหุ่นยนต์ 7-11 รอบที่ 1",
        "Problems":  "สภาพแวดล้อมแคบในการปฏิบัติงาน",
        "Solutions":  "ปรับกระบวนการทำงาน",
        "NextAction":  "ตรวจสอบระบบไฟฟ้าของหุ่นยนต์",
        "Remark":  "",
        "UpdatedBy":  3,
        "CreatedAt":  "2026-07-01T08:00:00Z",
        "UpdatedAt":  "2026-07-01T08:00:00Z"
    },
    {
        "ProgressID":  3,
        "ProjectID":  14,
        "ProgressDate":  "2026-07-03",
        "ProgressPercentage":  0,
        "CurrentStatus":  "In Progress",
        "CurrentActivity":  "กำลังประชาสัมพันธ์หลักสูตร",
        "Problems":  "ไม่มี",
        "Solutions":  "",
        "NextAction":  "",
        "Remark":  "",
        "UpdatedBy":  2,
        "CreatedAt":  "2026-07-03T13:49:34.519Z",
        "UpdatedAt":  "2026-07-03T13:49:34.519Z"
    },
    {
        "ProgressID":  4,
        "ProjectID":  15,
        "ProgressDate":  "2026-07-03",
        "ProgressPercentage":  0,
        "CurrentStatus":  "In Progress",
        "CurrentActivity":  "",
        "Problems":  "",
        "Solutions":  "",
        "NextAction":  "",
        "Remark":  "",
        "UpdatedBy":  2,
        "CreatedAt":  "2026-07-03T14:08:14.129Z",
        "UpdatedAt":  "2026-07-03T14:08:14.129Z"
    },
    {
        "ProgressID":  5,
        "ProjectID":  16,
        "ProgressDate":  "2026-07-03",
        "ProgressPercentage":  15,
        "CurrentStatus":  "In Progress",
        "CurrentActivity":  "",
        "Problems":  "",
        "Solutions":  "",
        "NextAction":  "",
        "Remark":  "",
        "UpdatedBy":  2,
        "CreatedAt":  "2026-07-03T14:08:55.367Z",
        "UpdatedAt":  "2026-07-03T14:08:55.367Z"
    },
    {
        "ProgressID":  6,
        "ProjectID":  17,
        "ProgressDate":  "2026-07-03",
        "ProgressPercentage":  0,
        "CurrentStatus":  "In Progress",
        "CurrentActivity":  "",
        "Problems":  "",
        "Solutions":  "",
        "NextAction":  "",
        "Remark":  "",
        "UpdatedBy":  2,
        "CreatedAt":  "2026-07-03T14:29:36.586Z",
        "UpdatedAt":  "2026-07-03T14:29:36.586Z"
    }
];

const DOCUMENTS_SEED = [
    {
        "DocumentID":  1,
        "ProjectID":  1,
        "DocumentName":  "หนังสือเสนอโครงการ",
        "DocumentType":  "pdf",
        "FileName":  "project_proposal.pdf",
        "FilePath":  "/uploads/project_proposal.pdf",
        "FileSize":  1542000,
        "UploadedBy":  "ดร.ภาคภูมิ",
        "UploadDate":  "2026-06-01"
    },
    {
        "DocumentID":  2,
        "ProjectID":  1,
        "DocumentName":  "ภาพการบำรุงรักษา",
        "DocumentType":  "image",
        "FileName":  "maintenance_check.png",
        "FilePath":  "/uploads/maintenance_check.png",
        "FileSize":  2541000,
        "UploadedBy":  "ดร.ภาคภูมิ",
        "UploadDate":  "2026-07-01"
    }
];

function initializeDB() {
  let db = safeStorage.getItem(DB_KEY);
  if (!db) {
    const defaultDB = {
      Departments: DEPARTMENTS_SEED,
      Users: USERS_SEED,
      Projects: PROJECTS_SEED,
      ProjectProgress: PROGRESS_SEED,
      RevenueTransactions: REVENUE_SEED,
      ExpenseTransactions: EXPENSE_SEED,
      ProjectDocuments: DOCUMENTS_SEED,
      KPIPlan: KPI_PLAN_SEED,
      Notifications: NOTIFICATIONS_SEED,
      AuditLogs: AUDIT_LOG_SEED
    };
    safeStorage.setItem(DB_KEY, JSON.stringify(defaultDB));
    return defaultDB;
  }
  try {
    const parsed = JSON.parse(db);
    let updated = false;

    // 1. Migration for AiBA Department
    if (parsed.Departments) {
      const aibaDept = parsed.Departments.find(d => d.DepartmentCode === 'AiBA');
      if (!aibaDept) {
        parsed.Departments.push({
          DepartmentID: 9,
          DepartmentCode: 'AiBA',
          DepartmentName: 'Artificial Intelligence Beyond Academy (\u0e28\u0e39\u0e19\u0e22\u0e4c\u0e43\u0e2b\u0e49\u0e04\u0e33\u0e1b\u0e23\u0e36\u0e01\u0e29\u0e32\u0e14\u0e49\u0e32\u0e19 AI)',
          Status: 'Active'
        });
        updated = true;
      }
      
      const dept7 = parsed.Departments.find(d => d.DepartmentID === 7);
      if (dept7 && dept7.DepartmentName === 'Mechanical and Artificial Intelligence') {
        dept7.DepartmentName = 'Master of Artificial Intelligence';
        updated = true;
      }
    }

    // 2. Migration for admin_aiba User
    if (parsed.Users) {
      const aibaAdmin = parsed.Users.find(u => u.Username === 'admin_aiba');
      if (!aibaAdmin) {
        parsed.Users.push({
          UserID: 10,
          DepartmentID: 9,
          EmployeeID: 'EMP-010',
          Username: 'admin_aiba',
          Password: 'password123',
          FullName: '\u0e2d\u0e32\u0e08\u0e32\u0e23\u0e22\u0e4c\u0e27\u0e38\u0e12\u0e34\u0e01\u0e32\u0e19\u0e15\u0e4c \u0e2b\u0e07\u0e29\u0e4c\u0e40\u0e27\u0e35\u0e22\u0e07\u0e08\u0e31\u0e19\u0e17\u0e23\u0e4c',
          Email: 'woottikarn@pim.ac.th',
          Phone: '0891114455',
          Role: 'Department Admin',
          Status: 'Active',
          CreatedAt: '2026-07-08T12:51:00.000Z'
        });
        updated = true;
      }

      const cybAdmin = parsed.Users.find(u => u.Username === 'admin_cyb');
      if (!cybAdmin) {
        parsed.Users.push({
          UserID: 6,
          DepartmentID: 6,
          EmployeeID: 'EMP-006',
          Username: 'admin_cyb',
          Password: 'password123',
          FullName: '\u0e23\u0e28.\u0e14\u0e23.\u0e2d\u0e23\u0e23\u0e13\u0e1e \u0e2b\u0e21\u0e31\u0e48\u0e19\u0e2a\u0e01\u0e38\u0e25',
          Email: 'annop@pim.ac.th',
          Phone: '0855556677',
          Role: 'Department Admin',
          Status: 'Active'
        });
        updated = true;
      } else if (cybAdmin.FullName === '\u0e23\u0e28.\u0e14\u0e23.\u0e1b\u0e23\u0e34\u0e0d\u0e0d\u0e32 \u0e2a\u0e07\u0e27\u0e19\u0e2a\u0e31\u0e15\u0e22\u0e4c' || cybAdmin.FullName.includes('Ã Â¸')) {
        cybAdmin.FullName = '\u0e23\u0e28.\u0e14\u0e23.\u0e2d\u0e23\u0e23\u0e13\u0e1e \u0e2b\u0e21\u0e31\u0e48\u0e19\u0e2a\u0e01\u0e38\u0e25';
        cybAdmin.Email = 'annop@pim.ac.th';
        updated = true;
      }
      
      const deanUser = parsed.Users.find(u => u.Username === 'dean');
      if (deanUser && (deanUser.FullName === '\u0e28.\u0e14\u0e23.\u0e2a\u0e21\u0e0a\u0e32\u0e22 \u0e17\u0e23\u0e0d\u0e27\u0e39\u0e12\u0e34' || !deanUser.FullName || deanUser.FullName.includes('Ã Â¸'))) {
        deanUser.FullName = '\u0e2c\u0e28.\u0e14\u0e23.\u0e1e\u0e23\u0e23\u0e13\u0e40\u0e0a\u0e29\u0e10\u0e4c \u0e13 \u0e25\u0e33\u0e1e\u0e39\u0e19';
        deanUser.Email = 'dean@pim.ac.th';
        updated = true;
      }
      
      const adeanUser = parsed.Users.find(u => u.Username === 'adean');
      if (adeanUser && (adeanUser.FullName === '\u0e23\u0e28.\u0e14\u0e23.\u0e27\u0e34\u0e42\u0e23\u0e08\u0e19\u0e4c \u0e40\u0e08\u0e25\u0e34\u0e09\u0e2a\u0e35\u0e02' || !adeanUser.FullName || adeanUser.FullName.includes('Ã Â¸'))) {
        adeanUser.FullName = '\u0e2c\u0e28.\u0e22\u0e2d\u0e14\u0e19\u0e20\u0e32 \u0e40\u0e01\u0e29\u0e40\u0e21\u0e37\u0e2d\u0e07';
        adeanUser.Email = 'adean@pim.ac.th';
        updated = true;
      }

      const raeAdmin = parsed.Users.find(u => u.Username === 'admin_rae');
      if (raeAdmin && (raeAdmin.FullName === '\u0e14\u0e23.\u0e27\u0e34\u0e42\u0e23\u0e08\u0e19\u0e4c \u0e40\u0e08\u0e25\u0e34\u0e09\u0e2a\u0e35\u0e02' || raeAdmin.FullName === '\u0e14\u0e23.\u0e2b\u0e21\u0e31\u0e48\u0e19\u0e2a\u0e01\u0e38\u0e25' || raeAdmin.FullName === '\u0e14\u0e23.\u0e2b\u0e21\u0e31\u0e48\u0e19\u0e2a\u0e01\u0e38\u0e25\u0e4c' || raeAdmin.FullName === '\u0e14\u0e23.\u0e2f\u0e32\u0e04\u0e20\u0e39\u0e21\u0e34 \u0e1b\u0e23\u0e35\u0e0a\u0e32\u0e08\u0e34\u0e15\u0e15\u0e4c' || !raeAdmin.FullName || raeAdmin.FullName.includes('Ã Â¸'))) {
        raeAdmin.FullName = '\u0e14\u0e23.\u0e2f\u0e32\u0e04\u0e20\u0e39\u0e21\u0e34 \u0e1b\u0e10\u0e21\u0e20\u0e32\u0e04';
        raeAdmin.Email = 'pakpoom@pim.ac.th';
        updated = true;
      }

      const caiAdmin = parsed.Users.find(u => u.Username === 'admin_cai');
      if (!caiAdmin) {
        parsed.Users.push({
          UserID: 7,
          DepartmentID: 2,
          EmployeeID: 'EMP-007',
          Username: 'admin_cai',
          Password: 'password123',
          FullName: '\u0e23\u0e28.\u0e14\u0e23.\u0e1b\u0e23\u0e34\u0e0d\u0e0d\u0e32 \u0e2a\u0e07\u0e27\u0e19\u0e2a\u0e31\u0e15\u0e22\u0e4c',
          Email: 'parinyasan@pim.ac.th',
          Phone: '0891112233',
          Role: 'Department Admin',
          Status: 'Active'
        });
        updated = true;
      } else if (caiAdmin.FullName.includes('Ã Â¸')) {
        caiAdmin.FullName = '\u0e23\u0e28.\u0e14\u0e23.\u0e1b\u0e23\u0e34\u0e0d\u0e0d\u0e32 \u0e2a\u0e07\u0e27\u0e19\u0e2a\u0e31\u0e15\u0e22\u0e4c';
        updated = true;
      }

      const ditAdmin = parsed.Users.find(u => u.Username === 'admin_dit' || u.Username === 'chanokan_cai');
      if (!ditAdmin) {
        parsed.Users.push({
          UserID: 8,
          DepartmentID: 4,
          EmployeeID: 'EMP-008',
          Username: 'admin_dit',
          Password: 'password123',
          FullName: '\u0e14\u0e23.\u0e0a\u0e19\u0e01\u0e32\u0e19\u0e15\u0e4c \u0e01\u0e34\u0e48\u0e0d\u0e41\u0e01\u0e49\u0e27',
          Email: 'chanokan@pim.ac.th',
          Phone: '0894445566',
          Role: 'Department Admin',
          Status: 'Active'
        });
        updated = true;
      } else {
        if (ditAdmin.Username === 'chanokan_cai') {
          ditAdmin.Username = 'admin_dit';
          updated = true;
        }
        if (ditAdmin.DepartmentID !== 4) {
          ditAdmin.DepartmentID = 4;
          updated = true;
        }
        if (ditAdmin.FullName.includes('Ã Â¸') || !ditAdmin.FullName) {
          ditAdmin.FullName = '\u0e14\u0e23.\u0e0a\u0e19\u0e01\u0e32\u0e19\u0e15\u0e4c \u0e01\u0e34\u0e48\u0e0d\u0e41\u0e01\u0e49\u0e27';
          updated = true;
        }
      }
      
      const ameAdmin = parsed.Users.find(u => u.Username === 'admin_ame');
      if (!ameAdmin) {
        parsed.Users.push({
          UserID: 9,
          DepartmentID: 1,
          EmployeeID: 'EMP-009',
          Username: 'admin_ame',
          Password: 'password123',
          FullName: '\u0e14\u0e23.\u0e2b\u0e2b\u0e39\u0e21\u0e34 \u0e0a\u0e32\u0e15\u0e38\u0e19\u0e34\u0e15\u0e32\u0e19\u0e19\u0e17\u0e4c',
          Email: 'poom@pim.ac.th',
          Phone: '0895556677',
          Role: 'Department Admin',
          Status: 'Active'
        });
        updated = true;
      } else if (ameAdmin.FullName.includes('Ã Â¸')) {
        ameAdmin.FullName = '\u0e14\u0e23.\u0e2b\u0e2b\u0e39\u0e21\u0e34 \u0e0a\u0e32\u0e15\u0e38\u0e19\u0e34\u0e15\u0e32\u0e19\u0e19\u0e17\u0e4c';
        updated = true;
      }

      parsed.Users.forEach(u => {
        if (u.Email && u.Email.includes('@eng.tu.ac.th')) {
          u.Email = u.Email.replace('@eng.tu.ac.th', '@pim.ac.th');
          updated = true;
        }
      });
    }

    // 3. Migration for Project PlanType and IsFreeService
    if (parsed.Projects) {
      parsed.Projects.forEach(p => {
        // Set defaults for existing projects
        if (!p.PlanType) {
          p.PlanType = '\u0e15\u0e32\u0e21\u0e41\u0e1c\u0e19';
          updated = true;
        }
        if (p.IsFreeService === undefined || p.IsFreeService === null) {
          p.IsFreeService = false;
          updated = true;
        }
        // Migrate "บริการวิชาการ" to "อบรม"
        if (p.ProjectType === 'บริการวิชาการ' || p.ProjectType === '\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e27\u0e34\u0e0a\u0e32\u0e01\u0e32\u0e23') {
          p.ProjectType = 'อบรม';
          updated = true;
        }
      });

      const p3 = parsed.Projects.find(p => p.ProjectID === 3);
      if (p3 && (!p3.Batches || JSON.stringify(p3.Batches).includes('\u0e23\u0e38\u0e48\u0e19') || JSON.stringify(p3.Batches).includes('Ãƒ'))) {
        p3.Batches = [
          { Name: '\u0e23\u0e38\u0e48\u0e19\u0e17\u0e35\u0e48 1', StartDate: '2026-06-10', EndDate: '2026-06-12' },
          { Name: '\u0e23\u0e38\u0e48\u0e19\u0e17\u0e35\u0e48 2', StartDate: '2026-06-13', EndDate: '2026-06-15' }
        ];
        updated = true;
      }
      const p8 = parsed.Projects.find(p => p.ProjectID === 8);
      if (p8 && (!p8.Batches || JSON.stringify(p8.Batches).includes('\u0e23\u0e38\u0e48\u0e19') || JSON.stringify(p8.Batches).includes('Ãƒ'))) {
        p8.Batches = [
          { Name: '\u0e23\u0e38\u0e48\u0e19\u0e17\u0e35\u0e48 1', StartDate: '2026-06-01', EndDate: '2026-06-30' },
          { Name: '\u0e23\u0e38\u0e48\u0e19\u0e17\u0e35\u0e48 2', StartDate: '2026-07-01', EndDate: '2026-07-31' }
        ];
        updated = true;
      }
      const p13 = parsed.Projects.find(p => p.ProjectID === 13);
      if (p13 && (!p13.Batches || JSON.stringify(p13.Batches).includes('\u0e23\u0e38\u0e48\u0e19') || JSON.stringify(p13.Batches).includes('Ãƒ'))) {
        p13.Batches = [
          { Name: '\u0e23\u0e38\u0e48\u0e19\u0e17\u0e35\u0e48 1 (\u0e27\u0e34\u0e17\u0e22\u0e32\u0e01\u0e32\u0e23\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25)', StartDate: '2026-06-01', EndDate: '2026-07-31' },
          { Name: '\u0e23\u0e38\u0e48\u0e19\u0e17\u0e35\u0e48 2 (\u0e05\u0e32\u0e23\u0e27\u0e34\u0e40\u0e05\u0e23\u0e32\u0e30\u0e2b\u0e4c\u0e40\u0e0a\u0e34\u0e05\u0e18\u0e38\u0e23\u0e01\u0e34\u0e08)', StartDate: '2026-08-01', EndDate: '2026-09-30' },
          { Name: '\u0e23\u0e38\u0e48\u0e19\u0e17\u0e35\u0e48 3 (\u0e42\u0e05\u0e23\u0e05\u0e05\u0e32\u0e19\u0e20\u0e32\u0e05\u0e2d\u0e38\u0e15\u0e05\u0e32\u0e2b\u0e01\u0e23\u0e23\u0e21)', StartDate: '2026-10-01', EndDate: '2026-11-30' }
        ];
        updated = true;
      }
    }

    if (updated) {
      safeStorage.setItem(DB_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (err) {
    console.error("Database parsing failed. Re-initializing default database...", err);
    const defaultDB = {
      Departments: DEPARTMENTS_SEED,
      Users: USERS_SEED,
      Projects: PROJECTS_SEED,
      ProjectProgress: PROGRESS_SEED,
      RevenueTransactions: REVENUE_SEED,
      ExpenseTransactions: EXPENSE_SEED,
      ProjectDocuments: DOCUMENTS_SEED,
      KPIPlan: KPI_PLAN_SEED,
      Notifications: NOTIFICATIONS_SEED,
      AuditLogs: AUDIT_LOG_SEED
    };
    safeStorage.setItem(DB_KEY, JSON.stringify(defaultDB));
    return defaultDB;
  }
}

function getTable(tableName) {
  const db = initializeDB();
  return db[tableName] || [];
}

function saveTable(tableName, data) {
  const db = initializeDB();
  db[tableName] = data;
  safeStorage.setItem(DB_KEY, JSON.stringify(db));
  return data;
}

function clearDB() {
  safeStorage.removeItem(DB_KEY);
  initializeDB();
}

window.ASPMS_DB = {
  initializeDB,
  getTable,
  saveTable,
  clearDB
};

window.DB_LOADED = true;