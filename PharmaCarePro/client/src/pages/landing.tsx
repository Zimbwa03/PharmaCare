// Referenced from javascript_log_in_with_replit blueprint - Landing page for logged out users
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill, Shield, TrendingUp, Users, Package, FileText } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary">
              <Pill className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Pharma Care</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Pharmacy Management</p>
            </div>
          </div>
          <Button asChild data-testid="button-login">
            <a href="/login">Log In</a>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Modern Pharmacy Management for Zimbabwe
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Comprehensive, AI-powered system designed for pharmacies in Zimbabwe with MCAZ compliance,
            intelligent inventory management, and real-time drug interaction checking.
          </p>
          <Button size="lg" asChild data-testid="button-get-started">
            <a href="/login">Get Started</a>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>
                Comprehensive patient profiles with medical history, allergies, and chronic conditions tracking
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Pill className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>AI-Powered Prescriptions</CardTitle>
              <CardDescription>
                Real-time drug interaction checking and allergy alerts powered by advanced AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Smart Inventory</CardTitle>
              <CardDescription>
                Automated stock tracking with demand forecasting and expiry date management
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>MCAZ Compliance</CardTitle>
              <CardDescription>
                Built-in Zimbabwe regulatory compliance with automated MCAZ reporting
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Analytics & Insights</CardTitle>
              <CardDescription>
                Real-time dashboards with sales trends, inventory turnover, and predictive analytics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Comprehensive logging of all system activities for accountability and regulatory audits
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl mb-4">Ready to Transform Your Pharmacy?</CardTitle>
            <CardDescription className="text-primary-foreground/80 text-lg mb-6">
              Join pharmacies across Zimbabwe using Pharma Care for efficient, compliant operations
            </CardDescription>
            <Button size="lg" variant="secondary" asChild data-testid="button-start-now">
              <a href="/login">Start Now</a>
            </Button>
          </CardHeader>
        </Card>
      </main>

      <footer className="border-t border-border py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 Pharma Care. Compliant with Medicines and Allied Substances Control Act [Chapter 15:03]</p>
        </div>
      </footer>
    </div>
  );
}
