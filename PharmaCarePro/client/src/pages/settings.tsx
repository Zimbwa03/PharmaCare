import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users as UsersIcon } from "lucide-react";
import type { User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Settings() {
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case "administrator":
        return "destructive";
      case "pharmacist":
        return "default";
      case "store_manager":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleLabel = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-foreground" data-testid="heading-settings">Settings</h2>
        <p className="text-muted-foreground">Manage system settings and user roles</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <UsersIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage staff accounts and role permissions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-md">
                  <div className="h-16 bg-muted animate-pulse rounded" />
                </div>
              ))
            ) : users && users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-md hover-elevate" data-testid={`user-${user.id}`}>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback>
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {getRoleLabel(user.role)}
                    </Badge>
                    {user.isActive ? (
                      <Badge variant="secondary" className="gap-1">
                        <span className="h-2 w-2 rounded-full bg-chart-4"></span>
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No users found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
              <Shield className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>View role-based access control settings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Administrator</h4>
                <Badge variant="destructive">Full Access</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Complete system access including user management, settings, and all operational functions.
              </p>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Pharmacist</h4>
                <Badge variant="default">Clinical Access</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Patient management, prescription processing, drug dispensing, and clinical decision support.
              </p>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Technician</h4>
                <Badge variant="outline">Limited Access</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Stock management, inventory operations, and prescription preparation support.
              </p>
            </div>

            <div className="p-4 border rounded-md">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Store Manager</h4>
                <Badge variant="secondary">Business Access</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Inventory management, reporting, analytics, and supplier relations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
