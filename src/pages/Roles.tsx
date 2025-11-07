import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface Permission {
  id: string;
  name: string;
  description: string | null;
  resource: string;
  action: string;
}

interface RolePermission {
  id: string;
  role: string;
  permission_id: string;
}

const Roles = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [userRolesCounts, setUserRolesCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [selectedPermission, setSelectedPermission] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();

  const roles = [
    { name: "admin", label: "Administrator", color: "bg-primary" },
    { name: "network_admin", label: "Network Admin", color: "bg-secondary" },
    { name: "security_admin", label: "Security Admin", color: "bg-accent" },
    { name: "operator", label: "Operator", color: "bg-muted" },
    { name: "viewer", label: "Viewer", color: "bg-muted-foreground" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: permsData }, { data: rolePermsData }, { data: userRolesData }] = await Promise.all([
        supabase.from("permissions").select("*").order("resource", { ascending: true }),
        supabase.from("role_permissions").select("*"),
        supabase.from("user_roles").select("role"),
      ]);

      setPermissions(permsData || []);
      setRolePermissions(rolePermsData || []);

      const counts: Record<string, number> = {};
      (userRolesData || []).forEach((ur) => {
        counts[ur.role] = (counts[ur.role] || 0) + 1;
      });
      setUserRolesCounts(counts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (role: string, permissionId: string) => {
    return rolePermissions.some((rp) => rp.role === role && rp.permission_id === permissionId);
  };

  const togglePermission = async (role: string, permissionId: string) => {
    const existing = rolePermissions.find((rp) => rp.role === role && rp.permission_id === permissionId);

    try {
      if (existing) {
        const { error } = await supabase.from("role_permissions").delete().eq("id", existing.id);
        if (error) throw error;

        await supabase.from("audit_logs").insert({
          user_id: user?.id,
          action: "remove_permission",
          resource_type: "role_permissions",
          resource_id: existing.id,
          details: { role, permission_id: permissionId },
        });

        toast({ title: "Success", description: "Permission removed" });
      } else {
        const { error } = await supabase.from("role_permissions").insert({
          role,
          permission_id: permissionId,
        });
        if (error) throw error;

        await supabase.from("audit_logs").insert({
          user_id: user?.id,
          action: "add_permission",
          resource_type: "role_permissions",
          details: { role, permission_id: permissionId },
        });

        toast({ title: "Success", description: "Permission added" });
      }

      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const assignPermission = async () => {
    if (!selectedPermission) return;

    try {
      const { error } = await supabase.from("role_permissions").insert({
        role: selectedRole,
        permission_id: selectedPermission,
      });

      if (error) throw error;

      await supabase.from("audit_logs").insert({
        user_id: user?.id,
        action: "add_permission",
        resource_type: "role_permissions",
        details: { role: selectedRole, permission_id: selectedPermission },
      });

      toast({ title: "Success", description: "Permission assigned successfully" });
      setIsDialogOpen(false);
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-secondary to-accent py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-2">Role Management</h1>
          <p className="text-white/90">Define roles and manage permissions</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Active Roles</h2>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Assign Permission
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {roles.map((role) => (
              <Card key={role.name} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg ${role.color} bg-opacity-10 flex items-center justify-center`}>
                    <Shield className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{role.label}</h3>
                    <p className="text-sm text-muted-foreground">{userRolesCounts[role.name] || 0} users</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Permissions Matrix</h2>

          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-1/4">Permission</TableHead>
                  <TableHead className="w-1/6">Resource</TableHead>
                  {roles.map((role) => (
                    <TableHead key={role.name} className="text-center">
                      <Badge variant="outline">{role.label}</Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission) => (
                  <TableRow key={permission.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-medium">{permission.name}</div>
                        {permission.description && (
                          <div className="text-xs text-muted-foreground mt-1">{permission.description}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{permission.resource}</Badge>
                    </TableCell>
                    {roles.map((role) => (
                      <TableCell key={role.name} className="text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={hasPermission(role.name, permission.id)}
                            onCheckedChange={() => togglePermission(role.name, permission.id)}
                            className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Permission to Role</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.name} value={role.name}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Permission</Label>
              <Select value={selectedPermission} onValueChange={setSelectedPermission}>
                <SelectTrigger>
                  <SelectValue placeholder="Select permission" />
                </SelectTrigger>
                <SelectContent>
                  {permissions.map((perm) => (
                    <SelectItem key={perm.id} value={perm.id}>
                      {perm.name} ({perm.resource})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={assignPermission} className="w-full" disabled={!selectedPermission}>
              Assign Permission
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Roles;
