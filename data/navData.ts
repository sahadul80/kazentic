import { NavItem } from "@/components/dashboard/navigation-provider";
import { AccessControlIcon, ActivityLogsIcon, CalendarIcon, ChatIcon, ConfugurationIcon, CRMIcon, DashboardIcon, DealsCRMIcon, EmailIcon, EmployeesIcon, FindJobsHRMIcon, FormsIcon, GeneralReportsIcon, GuestsIcon, HiringHRMIcon, HRMIcon, LeadsCRMIcon, LeavesHRMIcon, ManageIcon, NotesIcon, NoticesHRMIcon, PayrollHRMIcon, PerformanceHRMIcon, ProjectReportsIcon, ProjectsIcon, ReportsIcon, SettingsIcon, SprintIcon, StatisticsIcon, StorageDriveIcon, StorageIcon, StorageSend2Icon, StorageStatusIcon, StorageTrashIcon, TasksIcon, TeamsIcon, TimeTrackerIcon, UserReportsIcon, WeeklyReportsIcon } from "@/components/dashboard/SVGs";

 export const NavigationData: { 
    user: { name: string; email: string; avatar: string }; 
    navMain: NavItem[] 
  } = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: DashboardIcon,
        isActive: false,
      },
      {
        title: "Manage",
        url: "/manage",
        icon: ManageIcon,
        isActive: false,
        items: [
          {
            title: "Settings",
            url: "/manage/settings",
            Icon: SettingsIcon
          },
          {
            title: "Emplyees",
            url: "/storage/employees",
            Icon: EmployeesIcon
          },
          {
            title: "Guests",
            url: "/manage/guests",
            Icon: GuestsIcon
          },
          {
            title: "Teams",
            url: "/manage/teams",
            Icon: TeamsIcon
          },
          {
            title: "Access Control",
            url: "/manage/access-control",
            Icon: AccessControlIcon
          },
          {
            title: "Statistics",
            url: "/storage/statistics",
            Icon: StatisticsIcon
          },
          {
            title: "Confuguration",
            url: "/manage/configuration",
            Icon: ConfugurationIcon
          }
        ]
      },
      {
        title: "Time Tracker",
        url: "/time-tracker",
        icon: TimeTrackerIcon,
        isActive: false,
      },
      {
        title: "Tasks",
        url: "/tasks",
        icon: TasksIcon,
        isActive: false,
        items: [
          {
            title: "Projects",
            url: "/tasks/projects",
            Icon: ProjectsIcon
          },
          {
            title: "Sprint",
            url: "/tasks/Sprint",
            Icon: SprintIcon
          }
        ]
      },
      {
        title: "Reports",
        url: "/reports",
        icon: ReportsIcon,
        isActive: false,
        items: [
          {
            title: "General Reports",
            url: "/reports/general",
            Icon: GeneralReportsIcon
          },
          {
            title: "User Reports",
            url: "/reports/user",
            Icon: UserReportsIcon
          },
          {
            title: "Weekly Reports",
            url: "/reports/weekly",
            Icon: WeeklyReportsIcon
          },
          {
            title: "Project Reports",
            url: "/reports/project",
            Icon: ProjectReportsIcon
          },
          {
            title: "Activity Logs",
            url: "/reports/activity-logs",
            Icon: ActivityLogsIcon
          }
        ]
      },
      {
        title: "Email",
        url: "/email",
        icon: EmailIcon,
        isActive: false,
      },
      {
        title: "Storage",
        url: "/storage/my",
        icon: StorageIcon,
        isActive: true,
        items: [
          {
            title: "My Storage",
            url: "/storage/my",
            Icon: StorageDriveIcon
          },
          {
            title: "Shared",
            url: "/storage/shared",
            Icon: StorageSend2Icon
          },
          {
            title: "Trash",
            url: "/storage/trash",
            Icon: StorageTrashIcon
          },
          {
            title: "Storage Status",
            url: "/storage/status",
            Icon: StorageStatusIcon
          }
        ]
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: CalendarIcon,
        isActive: false,
      },
      {
        title: "Notes",
        url: "/notes",
        icon: NotesIcon,
        isActive: false,
      },
      {
        title: "HRM",
        url: "/hrm",
        icon: HRMIcon,
        isActive: false,
        items: [
          {
            title: "Hiring",
            url: "/hrm/hiring",
            Icon: HiringHRMIcon
          },
          {
            title: "Payroll",
            url: "/hrm/payroll",
            Icon: PayrollHRMIcon
          },
          {
            title: "Performance",
            url: "/hrm/performance",
            Icon: PerformanceHRMIcon
          },
          {
            title: "Leaves",
            url: "/hrm/leaves",
            Icon: LeavesHRMIcon
          },
          {
            title: "Notices",
            url: "/hrm/notices",
            Icon: NoticesHRMIcon
          },
          {
            title: "Find Jobs",
            url: "/hrm/find-jobs",
            Icon: FindJobsHRMIcon
          }
        ]
      },
      {
        title: "CRM",
        url: "/crm",
        icon: CRMIcon,
        isActive: false,
        items: [
          {
            title: "Leads",
            url: "/crm/leads",
            Icon: LeadsCRMIcon
          },
          {
            title: "Deals",
            url: "/crm/deals",
            Icon: DealsCRMIcon
          }
        ]
      },
      {
        title: "Chat",
        url: "/chat",
        icon: ChatIcon,
        isActive: false,
      },
      {
        title: "Forms",
        url: "/forms",
        icon: FormsIcon,
        isActive: false,
      }
    ]
  }