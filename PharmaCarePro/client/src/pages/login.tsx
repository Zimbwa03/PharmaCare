import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Pill, Mail, Lock, AlertCircle, Loader2, Shield, Briefcase, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQueryClient } from "@tanstack/react-query";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.requiresVerification) {
          setError("Please verify your email before logging in. Check your inbox for the verification link.");
        } else {
          setError(result.message || "Login failed");
        }
        return;
      }

      // Login successful - redirect based on user role
      // Give browser time to set cookie, then do full reload
      setTimeout(() => {
        if (result.user?.role === 'receptionist') {
          window.location.href = "/receptionist-pos";
        } else if (result.user?.role === 'administrator') {
          window.location.href = "/admin-dashboard";
        } else {
          window.location.href = "/";
        }
      }, 100);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      role: "administrator",
      label: "Administrator",
      icon: Shield,
      description: "Full system access & management",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      borderColor: "border-purple-500",
    },
    {
      role: "pharmacist",
      label: "Pharmacist",
      icon: Briefcase,
      description: "Clinical operations & prescriptions",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      borderColor: "border-blue-500",
    },
    {
      role: "receptionist",
      label: "Receptionist",
      icon: User,
      description: "Patient registration & basic ops",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      borderColor: "border-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-2xl">
              <Pill className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Pharma Care Pro</h1>
          <p className="text-gray-600 text-lg">AI-Powered Pharmacy Management System</p>
          <p className="text-gray-500 text-sm">Zimbabwe</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {roleOptions.map((option) => (
            <div
              key={option.role}
              onClick={() => setSelectedRole(option.role)}
              className={`
                cursor-pointer transition-all duration-300 transform
                ${selectedRole === option.role 
                  ? `ring-4 ring-offset-2 ${option.borderColor} scale-105` 
                  : 'hover:scale-102'
                }
              `}
            >
              <Card className={`
                border-2 
                ${selectedRole === option.role ? option.borderColor : 'border-gray-200'}
                hover:shadow-xl transition-all
              `}>
                <CardContent className="p-6 text-center">
                  <div className={`
                    flex h-16 w-16 items-center justify-center rounded-xl mx-auto mb-4
                    ${option.color} shadow-lg
                  `}>
                    <option.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{option.label}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                  {selectedRole === option.role && (
                    <Badge className="mt-3" variant="default">Selected</Badge>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Login Card */}
        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@pharmacy.com"
                    className="pl-10"
                    {...register("email")}
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    {...register("password")}
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password.message}</p>
                )}
              </div>

              {/* Login Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-4 text-gray-500">First time here?</span>
                </div>
              </div>

              {/* Create Admin Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Need to create an admin account?{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/create-admin")}
                    className="text-primary hover:underline font-medium"
                    disabled={isLoading}
                  >
                    Create Admin Account
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            © 2025 Pharma Care Zimbabwe
            <br />
            AI-Powered Pharmacy Management System
          </p>
        </div>
      </div>
    </div>
  );
}
