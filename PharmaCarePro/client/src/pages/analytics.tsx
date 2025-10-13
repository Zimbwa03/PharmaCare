import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Brain, Package } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-foreground" data-testid="heading-analytics">Analytics</h2>
        <p className="text-muted-foreground">AI-powered insights and predictions</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>AI Demand Forecasting</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Predictive analytics for stock optimization based on historical sales, seasonal trends, and local disease patterns.
              </p>
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">Next 30 Days Predictions:</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Paracetamol 500mg</span>
                    <span className="font-mono text-chart-4">+45% demand</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Amoxicillin 250mg</span>
                    <span className="font-mono text-chart-4">+30% demand</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Ibuprofen 400mg</span>
                    <span className="font-mono text-chart-1">+15% demand</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10">
                <Package className="h-5 w-5 text-chart-2" />
              </div>
              <CardTitle>Stock Optimization</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                AI-driven reorder suggestions to minimize stockouts and reduce carrying costs.
              </p>
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive"></span>
                    <span>Reorder Aspirin 75mg (3 days until stockout)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-chart-3"></span>
                    <span>Reorder Metformin 500mg (7 days until stockout)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-chart-4"></span>
                    <span>Reduce order quantity for Cetirizine 10mg (low demand)</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10">
                <TrendingUp className="h-5 w-5 text-chart-1" />
              </div>
              <CardTitle>Revenue Forecasting</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Predictive revenue analysis based on sales trends and market patterns.
              </p>
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">Next Quarter Projections:</p>
                <div className="space-y-3 mt-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Expected Revenue</span>
                      <span className="font-mono font-semibold">$45,000</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-chart-4" style={{ width: "75%" }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Confidence Level</span>
                      <span className="font-mono font-semibold">85%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Brain className="h-5 w-5 text-destructive" />
              </div>
              <CardTitle>Patient Adherence Risk</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                AI identification of patients at risk of medication non-adherence.
              </p>
              <div className="p-4 bg-muted rounded-md">
                <p className="text-sm font-medium mb-2">High-Risk Patients:</p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center justify-between">
                    <span>Chronic condition patients</span>
                    <span className="font-mono text-destructive">12 identified</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Missed refills (30+ days)</span>
                    <span className="font-mono text-destructive">8 patients</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>Complex medication regimens</span>
                    <span className="font-mono text-chart-3">5 patients</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
