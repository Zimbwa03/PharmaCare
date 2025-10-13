import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Patient, Product } from "@shared/schema";
import { z } from "zod";

const prescriptionFormSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  prescriberName: z.string().min(1, "Prescriber name is required"),
  prescriberId: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
    instructions: z.string().optional(),
  })).min(1, "Add at least one item"),
});

type PrescriptionFormData = z.infer<typeof prescriptionFormSchema>;

interface PrescriptionFormProps {
  onClose: () => void;
}

export function PrescriptionForm({ onClose }: PrescriptionFormProps) {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [aiWarnings, setAiWarnings] = useState<string[]>([]);
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);

  const { data: patients } = useQuery<Patient[]>({
    queryKey: ["/api/patients"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const form = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      patientId: "",
      prescriberName: "",
      prescriberId: "",
      notes: "",
      items: [],
    },
  });

  const checkInteractionsMutation = useMutation({
    mutationFn: async (data: { patientId: string; productIds: string[] }) => {
      return await apiRequest("POST", "/api/prescriptions/check-interactions", data);
    },
    onSuccess: (data: { warnings: string[] }) => {
      setAiWarnings(data.warnings || []);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: PrescriptionFormData) => {
      return await apiRequest("POST", "/api/prescriptions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/prescriptions"] });
      toast({
        title: "Success",
        description: "Prescription created successfully",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const items = form.watch("items");

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    form.setValue("patientId", patient.id);
    setPatientSearchOpen(false);

    // Check interactions when patient is selected and items exist
    if (items.length > 0) {
      checkInteractionsMutation.mutate({
        patientId: patient.id,
        productIds: items.map(item => item.productId),
      });
    }
  };

  const addItem = () => {
    form.setValue("items", [
      ...items,
      {
        productId: "",
        quantity: 1,
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    form.setValue("items", newItems);

    // Re-check interactions
    if (selectedPatient && newItems.length > 0) {
      checkInteractionsMutation.mutate({
        patientId: selectedPatient.id,
        productIds: newItems.map(item => item.productId),
      });
    }
  };

  const handleProductSelect = (index: number, productId: string) => {
    const newItems = [...items];
    newItems[index].productId = productId;
    form.setValue("items", newItems);

    // Re-check interactions
    if (selectedPatient) {
      checkInteractionsMutation.mutate({
        patientId: selectedPatient.id,
        productIds: newItems.map(item => item.productId).filter(Boolean),
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-6">
        {/* Patient Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="patientId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Patient *</FormLabel>
                  <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="justify-between"
                          data-testid="button-select-patient"
                        >
                          {selectedPatient
                            ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                            : "Search patient..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search patient..." />
                        <CommandList>
                          <CommandEmpty>No patient found.</CommandEmpty>
                          <CommandGroup>
                            {patients?.map((patient) => (
                              <CommandItem
                                key={patient.id}
                                value={`${patient.firstName} ${patient.lastName} ${patient.nationalId || ""}`}
                                onSelect={() => handlePatientSelect(patient)}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    field.value === patient.id ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                                <div>
                                  <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                                  {patient.nationalId && (
                                    <p className="text-xs text-muted-foreground">{patient.nationalId}</p>
                                  )}
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedPatient && (
              <div className="p-4 bg-muted rounded-md space-y-2">
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-destructive mb-1">Allergies:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.allergies.map((allergy, idx) => (
                        <Badge key={idx} variant="destructive">{allergy}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedPatient.chronicConditions && selectedPatient.chronicConditions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-1">Chronic Conditions:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.chronicConditions.map((condition, idx) => (
                        <Badge key={idx} variant="secondary">{condition}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prescriber Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="prescriberName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prescriber Name *</FormLabel>
                <FormControl>
                  <Input {...field} data-testid="input-prescriber-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prescriberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prescriber ID</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} data-testid="input-prescriber-id" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* AI Warnings */}
        {aiWarnings.length > 0 && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                AI Drug Interaction Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {aiWarnings.map((warning, idx) => (
                  <li key={idx} className="text-sm text-destructive">• {warning}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Prescription Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Prescription Items</CardTitle>
            <Button type="button" onClick={addItem} size="sm" data-testid="button-add-item">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="p-4 border rounded-md space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Product *</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                            data-testid={`button-select-product-${index}`}
                          >
                            {item.productId
                              ? products?.find((p) => p.id === item.productId)?.name
                              : "Select product..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                          <Command>
                            <CommandInput placeholder="Search product..." />
                            <CommandList>
                              <CommandEmpty>No product found.</CommandEmpty>
                              <CommandGroup>
                                {products?.map((product) => (
                                  <CommandItem
                                    key={product.id}
                                    value={product.name}
                                    onSelect={() => handleProductSelect(index, product.id)}
                                  >
                                    <Check
                                      className={`mr-2 h-4 w-4 ${
                                        item.productId === product.id ? "opacity-100" : "opacity-0"
                                      }`}
                                    />
                                    {product.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Quantity *</label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].quantity = parseInt(e.target.value) || 1;
                          form.setValue("items", newItems);
                        }}
                        data-testid={`input-quantity-${index}`}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Dosage *</label>
                      <Input
                        value={item.dosage}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].dosage = e.target.value;
                          form.setValue("items", newItems);
                        }}
                        placeholder="e.g., 1 tablet"
                        data-testid={`input-dosage-${index}`}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Frequency *</label>
                      <Input
                        value={item.frequency}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].frequency = e.target.value;
                          form.setValue("items", newItems);
                        }}
                        placeholder="e.g., twice daily"
                        data-testid={`input-frequency-${index}`}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Duration *</label>
                      <Input
                        value={item.duration}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].duration = e.target.value;
                          form.setValue("items", newItems);
                        }}
                        placeholder="e.g., 7 days"
                        data-testid={`input-duration-${index}`}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Instructions</label>
                      <Input
                        value={item.instructions || ""}
                        onChange={(e) => {
                          const newItems = [...items];
                          newItems[index].instructions = e.target.value;
                          form.setValue("items", newItems);
                        }}
                        placeholder="e.g., Take with food"
                        data-testid={`input-instructions-${index}`}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    className="text-destructive"
                    data-testid={`button-remove-item-${index}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ""} rows={3} data-testid="textarea-notes" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-prescription">
            {createMutation.isPending ? "Creating..." : "Create Prescription"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
