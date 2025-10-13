import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PackagePlus, PackageMinus, ArrowRightLeft } from "lucide-react";
import { StockOperationForm } from "@/components/stock-operation-form";

export default function StockOperations() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-foreground" data-testid="heading-stock-operations">Stock Operations</h2>
        <p className="text-muted-foreground">Manage stock movements and adjustments</p>
      </div>

      <Tabs defaultValue="grn" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="grn" data-testid="tab-grn">GRN</TabsTrigger>
          <TabsTrigger value="grv" data-testid="tab-grv">GRV</TabsTrigger>
          <TabsTrigger value="ibt" data-testid="tab-ibt">IBT</TabsTrigger>
        </TabsList>

        <TabsContent value="grn">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                  <PackagePlus className="h-5 w-5 text-chart-4" />
                </div>
                <div>
                  <CardTitle>Goods Received Note (GRN)</CardTitle>
                  <CardDescription>Record incoming stock from suppliers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StockOperationForm type="grn" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grv">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <PackageMinus className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle>Goods Return Voucher (GRV)</CardTitle>
                  <CardDescription>Process returns to suppliers</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StockOperationForm type="grv" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ibt">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Inter-Branch Transfer (IBT)</CardTitle>
                  <CardDescription>Transfer stock between pharmacy branches</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <StockOperationForm type="ibt" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
