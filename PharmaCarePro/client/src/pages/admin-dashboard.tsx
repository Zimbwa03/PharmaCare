import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  DollarSign, TrendingUp, TrendingDown, Users, Package, AlertTriangle, 
  Building2, ArrowLeftRight, FileText, ShieldCheck, Calendar, Bot, Clock
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AdminDashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  grossProfit: number;
  grossProfitMargin: number;
  netProfit: number;
  operatingExpenses: number;
  totalPrescriptions: number;
  prescriptionGrowth: number;
  inventoryValue: number;
  inventoryTurnover: number;
  totalBranches: number;
  activeBranches: number;
  totalStaff: number;
  expiredDrugsValue: number;
  monthlyRevenue: { month: string; revenue: number; target: number }[];
  branchPerformance: { branch: string; revenue: number; profit: number; prescriptions: number }[];
  expenseBreakdown: { category: string; amount: number; percentage: number }[];
  fastMovingDrugs: { name: string; sold: number; revenue: number }[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery<AdminDashboardStats>({
    queryKey: ["/api/admin/dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch admin dashboard data");
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const mockStats: AdminDashboardStats = {
    totalRevenue: 1245890,
    revenueGrowth: 12.5,
    grossProfit: 498356,
    grossProfitMargin: 40.0,
    netProfit: 186883,
    operatingExpenses: 311473,
    totalPrescriptions: 3456,
    prescriptionGrowth: 8.3,
    inventoryValue: 425000,
    inventoryTurnover: 24.5,
    totalBranches: 5,
    activeBranches: 5,
    totalStaff: 42,
    expiredDrugsValue: 12450,
    monthlyRevenue: [
      { month: 'Jan', revenue: 95000, target: 90000 },
      { month: 'Feb', revenue: 102000, target: 95000 },
      { month: 'Mar', revenue: 98000, target: 100000 },
      { month: 'Apr', revenue: 115000, target: 105000 },
      { month: 'May', revenue: 125000, target: 110000 },
      { month: 'Jun', revenue: 132000, target: 115000 },
      { month: 'Jul', revenue: 128000, target: 120000 },
      { month: 'Aug', revenue: 145000, target: 125000 },
      { month: 'Sep', revenue: 138000, target: 130000 },
      { month: 'Oct', revenue: 152000, target: 135000 },
      { month: 'Nov', revenue: 165000, target: 140000 },
      { month: 'Dec', revenue: 175000, target: 150000 },
    ],
    branchPerformance: [
      { branch: 'Harare Central', revenue: 425000, profit: 170000, prescriptions: 1245 },
      { branch: 'Bulawayo', revenue: 325000, profit: 130000, prescriptions: 956 },
      { branch: 'Mutare', revenue: 245000, profit: 98000, prescriptions: 678 },
      { branch: 'Gweru', revenue: 185000, profit: 74000, prescriptions: 432 },
      { branch: 'Masvingo', revenue: 65890, profit: 26356, prescriptions: 145 },
    ],
    expenseBreakdown: [
      { category: 'Salaries', amount: 145000, percentage: 46.6 },
      { category: 'Rent & Utilities', amount: 62000, percentage: 19.9 },
      { category: 'Supplies', amount: 45000, percentage: 14.4 },
      { category: 'Marketing', amount: 28000, percentage: 9.0 },
      { category: 'Insurance', amount: 18000, percentage: 5.8 },
      { category: 'Other', amount: 13473, percentage: 4.3 },
    ],
    fastMovingDrugs: [
      { name: 'Paracetamol 500mg', sold: 2340, revenue: 23400 },
      { name: 'Amoxicillin 250mg', sold: 1876, revenue: 37520 },
      { name: 'Ibuprofen 400mg', sold: 1654, revenue: 28318 },
      { name: 'Metformin 500mg', sold: 1432, revenue: 35800 },
      { name: 'Atorvastatin 20mg', sold: 1287, revenue: 45045 },
    ],
  };

  const currentStats = stats || mockStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive financial analytics and system overview</p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Last Updated: {new Date().toLocaleDateString()}
        </Button>
      </div>

      {/* Financial KPIs - Top Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentStats.totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{currentStats.revenueGrowth}%</span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gross Profit</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentStats.grossProfit.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-muted-foreground">Margin: </span>
              <span className="text-green-600 font-medium ml-1">{currentStats.grossProfitMargin}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentStats.netProfit.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-muted-foreground">After all expenses</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operating Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentStats.operatingExpenses.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-muted-foreground">Monthly operational cost</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational KPIs - Second Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.totalPrescriptions.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">+{currentStats.prescriptionGrowth}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentStats.inventoryValue.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-muted-foreground">Turnover: {currentStats.inventoryTurnover}x/year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStats.activeBranches}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-muted-foreground">Total: {currentStats.totalBranches} branches</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired Drugs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${currentStats.expiredDrugsValue.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-muted-foreground">Requires disposal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500 mx-auto mb-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">Branch Pharmacist</h3>
            <p className="text-xs text-muted-foreground mb-3">Add & manage staff</p>
            <Badge variant="outline">Admin Only</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 mx-auto mb-3">
              <ArrowLeftRight className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">Interbranch Transfers</h3>
            <p className="text-xs text-muted-foreground mb-3">Manage stock movement</p>
            <Badge variant="outline">View All</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500 mx-auto mb-3">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">Order Forms</h3>
            <p className="text-xs text-muted-foreground mb-3">Auto-generated orders</p>
            <Badge variant="outline">Generate</Badge>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 mx-auto mb-3">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-semibold mb-1">Daily Reports Bot</h3>
            <p className="text-xs text-muted-foreground mb-3">Automated reports</p>
            <Badge variant="outline">Configure</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 - Revenue Trends and Branch Performance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
            <CardDescription>Actual vs Target Performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={currentStats.monthlyRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} name="Revenue ($)" />
                <Line type="monotone" dataKey="target" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Target ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Branch Performance</CardTitle>
            <CardDescription>Revenue by Branch Location</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={currentStats.branchPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="branch" stroke="#6B7280" angle={-45} textAnchor="end" height={100} />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} 
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3B82F6" name="Revenue ($)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" fill="#10B981" name="Profit ($)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 - Expense Breakdown and Fast Moving Drugs */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Operating Cost Distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={currentStats.expenseBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, percentage }) => `${category} (${percentage}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {currentStats.expenseBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fast-Moving Drugs</CardTitle>
            <CardDescription>Top Selling Products This Month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentStats.fastMovingDrugs.map((drug, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">{drug.name}</p>
                    <p className="text-sm text-muted-foreground">{drug.sold.toLocaleString()} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${drug.revenue.toLocaleString()}</p>
                    <Badge variant="secondary" className="mt-1">Rank #{index + 1}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance & Reporting Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
              </div>
              <CardTitle className="text-lg">TAX Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">ZIMRA compliance reports for VAT, Income Tax, and Withholding Tax</p>
            <Button className="w-full" variant="outline">Generate Report</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              <CardTitle className="text-lg">NSSA Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">National Social Security Authority compliance and contributions</p>
            <Button className="w-full" variant="outline">Generate Report</Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Clock className="h-5 w-5 text-purple-500" />
              </div>
              <CardTitle className="text-lg">Shift Supervisors</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Assign branch and shift supervisors for all locations</p>
            <Button className="w-full" variant="outline">Manage Staff</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
