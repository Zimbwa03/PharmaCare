import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Reports() {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground" data-testid="heading-reports">Reports</h2>
          <p className="text-muted-foreground">Generate MCAZ compliance and business reports</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-auto"
            data-testid="input-date-start"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-auto"
            data-testid="input-date-end"
          />
        </div>
      </div>

      <Tabs defaultValue="mcaz" className="space-y-4">
        <TabsList>
          <TabsTrigger value="mcaz" data-testid="tab-mcaz">MCAZ Compliance</TabsTrigger>
          <TabsTrigger value="sales" data-testid="tab-sales">Sales Reports</TabsTrigger>
          <TabsTrigger value="inventory" data-testid="tab-inventory-report">Inventory Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="mcaz" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover-elevate cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Dispensing Records</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        All prescriptions dispensed during period
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" data-testid="button-download-dispensing">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover-elevate cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                      <FileText className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Controlled Substances</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Controlled drug dispensing log
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" data-testid="button-download-controlled">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover-elevate cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                      <FileText className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Stock Audit</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Inventory levels and movements
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" data-testid="button-download-stock-audit">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover-elevate cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                      <FileText className="h-5 w-5 text-chart-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Expiry Report</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Expired and soon-to-expire medications
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" data-testid="button-download-expiry">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover-elevate cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                      <FileText className="h-5 w-5 text-chart-1" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Daily Sales Summary</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Sales breakdown by day
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" data-testid="button-download-daily-sales">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover-elevate cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                      <FileText className="h-5 w-5 text-chart-2" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Product Performance</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Top selling products
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" data-testid="button-download-product-performance">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover-elevate cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Stock Valuation</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Current inventory value
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" data-testid="button-download-stock-valuation">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="hover-elevate cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10">
                      <FileText className="h-5 w-5 text-chart-3" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Stock Movement History</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        All GRN, GRV, IBT transactions
                      </p>
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" data-testid="button-download-movement-history">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
