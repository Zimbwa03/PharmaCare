import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Pill, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Prescription } from "@shared/schema";
import { PrescriptionForm } from "@/components/prescription-form";

export default function Prescriptions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: prescriptions, isLoading } = useQuery<Prescription[]>({
    queryKey: ["/api/prescriptions"],
  });

  const filteredPrescriptions = prescriptions?.filter(
    (rx) =>
      rx.prescriptionNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.prescriberName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "dispensed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "verified":
        return <Pill className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "dispensed":
        return "default";
      case "verified":
        return "secondary";
      case "pending":
        return "outline";
      default:
        return "destructive";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-foreground" data-testid="heading-prescriptions">Prescriptions</h2>
          <p className="text-muted-foreground">Manage prescriptions with AI-powered validation</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-prescription">
              <Plus className="h-4 w-4 mr-2" />
              New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Prescription</DialogTitle>
            </DialogHeader>
            <PrescriptionForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prescriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-prescriptions"
          />
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-16 bg-muted animate-pulse rounded" />
              </CardHeader>
            </Card>
          ))
        ) : filteredPrescriptions && filteredPrescriptions.length > 0 ? (
          filteredPrescriptions.map((prescription) => (
            <Card key={prescription.id} className="hover-elevate" data-testid={`card-prescription-${prescription.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Pill className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-lg font-mono">
                          {prescription.prescriptionNumber}
                        </CardTitle>
                        <Badge variant={getStatusVariant(prescription.status)} className="gap-1">
                          {getStatusIcon(prescription.status)}
                          {prescription.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {prescription.prescriberName && (
                          <p>Prescribed by: {prescription.prescriberName}</p>
                        )}
                        {prescription.createdAt && (
                          <p>Date: {new Date(prescription.createdAt).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {prescription.totalAmount && (
                      <p className="text-xl font-semibold">
                        ${parseFloat(prescription.totalAmount).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                {prescription.aiWarnings && prescription.aiWarnings.length > 0 && (
                  <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-destructive">AI Warnings:</p>
                        <ul className="text-sm text-destructive/90 mt-1 space-y-1">
                          {prescription.aiWarnings.map((warning, idx) => (
                            <li key={idx}>• {warning}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No prescriptions found</p>
          </div>
        )}
      </div>
    </div>
  );
}
