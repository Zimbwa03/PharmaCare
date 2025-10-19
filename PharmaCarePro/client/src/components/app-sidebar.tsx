// Referenced from javascript_log_in_with_replit blueprint - Sidebar navigation
import {
  LayoutDashboard,
  Users,
  Pill,
  Package,
  FileText,
  Settings,
  TrendingUp,
  Activity,
  ClipboardList,
  Shield,
  Building2,
  ArrowLeftRight,
  AlertCircle,
  Zap,
  FileBarChart,
  UserCog,
  Bot,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

type MenuItem = {
  title: string;
  url: string;
  icon: any;
  roles?: string[];
};

const mainMenuItems: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["administrator", "pharmacist", "technician", "store_manager"],
  },
  {
    title: "Point of Sale (POS)",
    url: "/receptionist-pos",
    icon: Activity,
    roles: ["receptionist"],
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Users,
    roles: ["administrator", "pharmacist"],
  },
  {
    title: "Prescriptions",
    url: "/prescriptions",
    icon: Pill,
    roles: ["administrator", "pharmacist"],
  },
  {
    title: "Inventory",
    url: "/inventory",
    icon: Package,
    roles: ["administrator", "pharmacist", "technician", "store_manager"],
  },
  {
    title: "Products",
    url: "/products",
    icon: ClipboardList,
    roles: ["administrator", "store_manager", "technician"],
  },
];

const adminItems: MenuItem[] = [
  {
    title: "Admin Dashboard",
    url: "/admin-dashboard",
    icon: Shield,
    roles: ["administrator"],
  },
  {
    title: "Branch Management",
    url: "/branch-management",
    icon: Building2,
    roles: ["administrator"],
  },
  {
    title: "Interbranch Transfers",
    url: "/interbranch-transfers",
    icon: ArrowLeftRight,
    roles: ["administrator"],
  },
  {
    title: "Expired Drugs",
    url: "/expired-drugs",
    icon: AlertCircle,
    roles: ["administrator"],
  },
  {
    title: "Fast-Moving Drugs",
    url: "/fast-moving-drugs",
    icon: Zap,
    roles: ["administrator"],
  },
  {
    title: "Tax Reports",
    url: "/tax-reports",
    icon: FileBarChart,
    roles: ["administrator"],
  },
  {
    title: "Staff Management",
    url: "/staff-management",
    icon: UserCog,
    roles: ["administrator"],
  },
  {
    title: "Daily Reports Bot",
    url: "/daily-reports-bot",
    icon: Bot,
    roles: ["administrator"],
  },
];

const operationsItems: MenuItem[] = [
  {
    title: "Stock Operations",
    url: "/stock-operations",
    icon: Activity,
    roles: ["administrator", "pharmacist", "technician", "store_manager"],
  },
  {
    title: "Reports",
    url: "/reports",
    icon: FileText,
    roles: ["administrator", "store_manager"],
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: TrendingUp,
    roles: ["administrator", "store_manager"],
  },
];

const systemItems: MenuItem[] = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    roles: ["administrator"],
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();

  const filterMenuByRole = (items: MenuItem[]) => {
    // Don't show any menu items if user role is not yet known (security)
    if (!user?.role) return [];
    return items.filter(item => !item.roles || item.roles.includes(user.role));
  };

  const filteredMainMenu = filterMenuByRole(mainMenuItems);
  const filteredAdmin = filterMenuByRole(adminItems);
  const filteredOperations = filterMenuByRole(operationsItems);
  const filteredSystem = filterMenuByRole(systemItems);

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
            <Pill className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Pharma Care</h1>
            <p className="text-xs text-muted-foreground">Zimbabwe</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {filteredMainMenu.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredMainMenu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase()}`}>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredAdmin.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Controls</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredAdmin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredOperations.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Operations</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredOperations.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {filteredSystem.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredSystem.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location === item.url} data-testid={`nav-${item.title.toLowerCase()}`}>
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
