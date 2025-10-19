import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Search,
  Barcode,
  Receipt,
  CreditCard,
  Smartphone,
  DollarSign,
  Plus,
  Minus,
  Trash2,
  Calculator,
  FileText,
  RotateCcw,
  Printer,
  User,
  Package,
  TrendingUp,
  X,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  genericName?: string;
  barcode?: string;
  sellingPrice: string;
  unitPrice: string;
  vatPercentage: string;
  requiresPrescription: boolean;
  category?: string;
  strength?: string;
  packSize?: number;
}

interface CartItem extends Product {
  quantity: number;
  discount: number;
  subtotal: number;
  vatAmount: number;
  total: number;
  instructions?: string;
}

interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  status: string;
  totalAmount: string;
  dispensedAt: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: string;
    instructions: string;
  }>;
}

interface Patient {
  id: string;
  nationalId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  allergies?: string[];
  chronicConditions?: string[];
  insuranceProvider?: string;
  insuranceNumber?: string;
}

export default function ReceptionistPOS() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("prescription");
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [amountReceived, setAmountReceived] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientDialog, setShowPatientDialog] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");

  // Fetch pending prescriptions
  const { data: prescriptions = [] } = useQuery<Prescription[]>({
    queryKey: ["/api/receptionist/prescriptions/pending"],
    queryFn: async () => {
      const response = await fetch("/api/receptionist/prescriptions/pending");
      if (!response.ok) throw new Error("Failed to fetch prescriptions");
      return response.json();
    },
  });

  // Search patients
  const { data: patients = [] } = useQuery<Patient[]>({
    queryKey: ["/api/patients/search", patientSearchQuery],
    queryFn: async () => {
      if (!patientSearchQuery || patientSearchQuery.length < 2) return [];
      const response = await fetch(`/api/patients/search?q=${encodeURIComponent(patientSearchQuery)}`);
      if (!response.ok) throw new Error("Failed to search patients");
      return response.json();
    },
    enabled: patientSearchQuery.length >= 2,
  });

  // Search products for OTC sales (STRICT: receptionist-only endpoint)
  const { data: products = [], isLoading: isSearching } = useQuery<Product[]>({
    queryKey: ["/api/receptionist/products/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery || searchQuery.length < 2) return [];
      const response = await fetch(`/api/receptionist/products/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) throw new Error("Failed to search products");
      return response.json();
    },
    enabled: searchQuery.length >= 2,
  });

  // Process sale mutation
  const processSaleMutation = useMutation({
    mutationFn: async (saleData: any) => {
      const response = await fetch("/api/receptionist/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });
      if (!response.ok) throw new Error("Failed to process sale");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sale Completed",
        description: "Transaction processed successfully!",
      });
      setCart([]);
      setShowPayment(false);
      setAmountReceived("");
      setCustomerName("");
      setCustomerPhone("");
      queryClient.invalidateQueries({ queryKey: ["/api/receptionist/prescriptions/pending"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cart.find((item) => item.id === product.id);
    
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + quantity);
    } else {
      const sellingPrice = parseFloat(product.sellingPrice);
      const vatRate = parseFloat(product.vatPercentage || "15") / 100;
      const subtotal = sellingPrice * quantity;
      const vatAmount = subtotal * vatRate;
      const total = subtotal + vatAmount;

      const newItem: CartItem = {
        ...product,
        quantity,
        discount: 0,
        subtotal,
        vatAmount,
        total,
      };
      
      setCart([...cart, newItem]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${product.name} x${quantity}`,
    });
  };

  const loadPrescription = (prescription: Prescription) => {
    const cartItems: CartItem[] = prescription.items.map((item) => {
      const sellingPrice = parseFloat(item.unitPrice);
      const vatRate = 0.15;
      const subtotal = sellingPrice * item.quantity;
      const vatAmount = subtotal * vatRate;
      const total = subtotal + vatAmount;

      return {
        id: item.productId,
        name: item.productName,
        barcode: "",
        sellingPrice: item.unitPrice,
        unitPrice: item.unitPrice,
        vatPercentage: "15",
        requiresPrescription: true,
        quantity: item.quantity,
        discount: 0,
        subtotal,
        vatAmount,
        total,
        instructions: item.instructions,
      };
    });

    setCart(cartItems);
    // Set patient from prescription
    setSelectedPatient({
      id: prescription.patientId,
      firstName: prescription.patientName.split(' ')[0] || '',
      lastName: prescription.patientName.split(' ')[1] || '',
    });
    setSelectedTab("cart");
    
    toast({
      title: "Prescription Loaded",
      description: `${prescription.prescriptionNumber} added to cart`,
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          const sellingPrice = parseFloat(item.sellingPrice);
          const vatRate = parseFloat(item.vatPercentage || "15") / 100;
          const subtotal = sellingPrice * newQuantity;
          const vatAmount = subtotal * vatRate;
          const total = subtotal + vatAmount - item.discount;

          return {
            ...item,
            quantity: newQuantity,
            subtotal,
            vatAmount,
            total,
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const totalDiscount = cart.reduce((sum, item) => sum + item.discount, 0);
    const totalVAT = cart.reduce((sum, item) => sum + item.vatAmount, 0);
    const total = cart.reduce((sum, item) => sum + item.total, 0);

    return { subtotal, totalDiscount, totalVAT, total };
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedPatient) {
      toast({
        title: "Patient Required",
        description: "Please select a patient before checkout",
        variant: "destructive",
      });
      setShowPatientDialog(true);
      return;
    }
    
    setShowPayment(true);
  };

  const completeSale = () => {
    const { total } = calculateTotals();
    const received = parseFloat(amountReceived || "0");
    
    if (paymentMethod === "cash" && received < total) {
      toast({
        title: "Insufficient Amount",
        description: "Amount received is less than total",
        variant: "destructive",
      });
      return;
    }

    const saleData = {
      saleType: selectedTab === "prescription" ? "prescription" : "otc",
      patientId: selectedPatient?.id,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.sellingPrice,
        discount: item.discount,
        instructions: item.instructions,
      })),
      paymentMethod,
      amountPaid: received,
      change: paymentMethod === "cash" ? received - total : 0,
    };

    processSaleMutation.mutate(saleData);
  };

  const { subtotal, totalDiscount, totalVAT, total } = calculateTotals();
  const change = paymentMethod === "cash" ? parseFloat(amountReceived || "0") - total : 0;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Left Section - Product Selection */}
      <div className="flex-1 flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Point of Sale
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowCalculator(true)}>
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculator (F11)
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Quotation (F9)
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="prescription" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Prescriptions (F1)
                </TabsTrigger>
                <TabsTrigger value="otc" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  OTC Search (F2)
                </TabsTrigger>
                <TabsTrigger value="shortcode" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Quick Keys (F12)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="prescription" className="mt-0 h-[calc(100vh-20rem)] overflow-auto">
                <div className="space-y-2">
                  {prescriptions.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No pending prescriptions</p>
                    </div>
                  ) : (
                    prescriptions.map((prescription) => (
                      <Card key={prescription.id} className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => loadPrescription(prescription)}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold">{prescription.prescriptionNumber}</p>
                              <p className="text-sm text-muted-foreground">
                                Patient: {prescription.patientName}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              ${parseFloat(prescription.totalAmount).toFixed(2)}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {prescription.items.length} item(s) • {new Date(prescription.dispensedAt).toLocaleDateString()}
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="otc" className="mt-0 h-[calc(100vh-20rem)]">
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search drugs by name, barcode, or generic name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline">
                      <Barcode className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="h-[calc(100vh-24rem)] overflow-auto space-y-2">
                    {isSearching && <p className="text-center text-muted-foreground">Searching...</p>}
                    {!isSearching && searchQuery.length >= 2 && products.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">No products found</p>
                    )}
                    {products.map((product) => (
                      <Card key={product.id} className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => addToCart(product)}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold">{product.name}</p>
                              {product.genericName && (
                                <p className="text-sm text-muted-foreground">{product.genericName}</p>
                              )}
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {product.strength}
                                </Badge>
                                {product.requiresPrescription && (
                                  <Badge variant="destructive" className="text-xs">Rx</Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">${parseFloat(product.sellingPrice).toFixed(2)}</p>
                              {product.packSize && (
                                <p className="text-xs text-muted-foreground">Pack: {product.packSize}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shortcode" className="mt-0 h-[calc(100vh-20rem)]">
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((key) => (
                    <Card key={key} className="cursor-pointer hover:bg-accent transition-colors">
                      <CardContent className="p-4 text-center">
                        <Badge className="mb-2">F{key}</Badge>
                        <p className="text-sm font-medium">Not Configured</p>
                        <p className="text-xs text-muted-foreground">Click to set</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Section - Shopping Cart */}
      <div className="w-[450px] flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Shopping Cart ({cart.length})
              </span>
              <Button variant="ghost" size="sm" onClick={() => {setCart([]); setSelectedPatient(null);}}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              {/* Patient Selection */}
              <div className="mt-2 space-y-2">
                {selectedPatient ? (
                  <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">
                            {selectedPatient.firstName} {selectedPatient.lastName}
                          </p>
                          {selectedPatient.phone && (
                            <p className="text-xs text-muted-foreground">📞 {selectedPatient.phone}</p>
                          )}
                          {selectedPatient.nationalId && (
                            <p className="text-xs text-muted-foreground">ID: {selectedPatient.nationalId}</p>
                          )}
                          {selectedPatient.allergies && selectedPatient.allergies.length > 0 && (
                            <div className="mt-1">
                              <Badge variant="destructive" className="text-xs">
                                ⚠️ Allergies: {selectedPatient.allergies.join(', ')}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPatient(null)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowPatientDialog(true)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Select Patient (Required)
                  </Button>
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-4 space-y-2">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Cart is empty</p>
                <p className="text-sm">Add items from prescriptions or OTC</p>
              </div>
            ) : (
              cart.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm leading-tight">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ${parseFloat(item.sellingPrice).toFixed(2)} each
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-7 w-7 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-7 w-7 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-bold">${item.total.toFixed(2)}</p>
                    </div>
                    {item.instructions && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        {item.instructions}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
          
          {/* Totals Section */}
          <div className="border-t p-4 bg-muted/20">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>VAT (15%):</span>
                <span>${totalVAT.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                disabled={cart.length === 0}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Return (F3)
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Checkout
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
            <DialogDescription>
              Total Amount: <span className="font-bold text-lg">${total.toFixed(2)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Payment Method</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Cash
                    </div>
                  </SelectItem>
                  <SelectItem value="card">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Card
                    </div>
                  </SelectItem>
                  <SelectItem value="ecocash">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      EcoCash
                    </div>
                  </SelectItem>
                  <SelectItem value="onemoney">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      OneMoney
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentMethod === "cash" && (
              <>
                <div>
                  <Label>Amount Received</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder="0.00"
                    autoFocus
                  />
                </div>
                {amountReceived && parseFloat(amountReceived) >= total && (
                  <div className="bg-green-50 dark:bg-green-950 p-3 rounded-md">
                    <p className="text-sm text-muted-foreground">Change:</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${change.toFixed(2)}
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowPayment(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={completeSale}
                className="flex-1 bg-green-600 hover:bg-green-700"
                disabled={processSaleMutation.isPending}
              >
                <Printer className="h-4 w-4 mr-2" />
                {processSaleMutation.isPending ? "Processing..." : "Complete & Print"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Calculator</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-muted-foreground text-center">Calculator feature coming soon...</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient Search/Registration Dialog */}
      <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select or Register Patient</DialogTitle>
            <DialogDescription>
              Search for an existing patient or register a new one
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search Patient</TabsTrigger>
              <TabsTrigger value="register">Register New</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4">
              <div>
                <Label>Search by Name, Phone, or National ID</Label>
                <Input
                  placeholder="Type to search..."
                  value={patientSearchQuery}
                  onChange={(e) => setPatientSearchQuery(e.target.value)}
                  className="mt-2"
                  autoFocus
                />
              </div>
              
              {patientSearchQuery.length >= 2 && (
                <div className="space-y-2 max-h-96 overflow-auto">
                  {patients.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No patients found</p>
                  ) : (
                    patients.map((patient) => (
                      <Card 
                        key={patient.id} 
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => {
                          setSelectedPatient(patient);
                          setShowPatientDialog(false);
                          setPatientSearchQuery("");
                          toast({
                            title: "Patient Selected",
                            description: `${patient.firstName} ${patient.lastName}`,
                          });
                        }}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-semibold">
                                {patient.firstName} {patient.lastName}
                              </p>
                              {patient.phone && (
                                <p className="text-sm text-muted-foreground">📞 {patient.phone}</p>
                              )}
                              {patient.nationalId && (
                                <p className="text-sm text-muted-foreground">ID: {patient.nationalId}</p>
                              )}
                              {patient.allergies && patient.allergies.length > 0 && (
                                <div className="mt-1">
                                  <Badge variant="destructive" className="text-xs">
                                    ⚠️ Allergies: {patient.allergies.join(', ')}
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <Badge variant="outline">Select</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Quick registration for walk-in customers
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name *</Label>
                  <Input placeholder="John" required />
                </div>
                <div>
                  <Label>Last Name *</Label>
                  <Input placeholder="Doe" required />
                </div>
                <div>
                  <Label>National ID</Label>
                  <Input placeholder="63-1234567X89" />
                </div>
                <div>
                  <Label>Phone Number *</Label>
                  <Input placeholder="+263 77 123 4567" required />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <Input type="date" />
                </div>
                <div className="col-span-2">
                  <Label>Email (Optional)</Label>
                  <Input type="email" placeholder="john.doe@email.com" />
                </div>
                <div className="col-span-2">
                  <Label>Address (Optional)</Label>
                  <Textarea placeholder="Street address, city" rows={2} />
                </div>
                <div className="col-span-2">
                  <Label>Known Allergies (Optional)</Label>
                  <Input placeholder="e.g., Penicillin, Sulfa drugs" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowPatientDialog(false)} className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1">
                  Register & Select
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
