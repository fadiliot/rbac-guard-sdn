import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, Plus } from "lucide-react";

const Roles = () => {
  const roles = [
    { id: 1, name: "Administrator", users: 2, color: "bg-primary" },
    { id: 2, name: "Network Admin", users: 4, color: "bg-secondary" },
    { id: 3, name: "Operator", users: 8, color: "bg-accent" },
    { id: 4, name: "Viewer", users: 110, color: "bg-muted-foreground" },
  ];

  const permissions = [
    "View Network Topology",
    "Modify Network Policies",
    "Manage Users",
    "Assign Roles",
    "View Logs",
    "Export Data",
    "Configure Devices",
    "Delete Resources",
  ];

  const permissionMatrix = {
    Administrator: [true, true, true, true, true, true, true, true],
    "Network Admin": [true, true, false, false, true, true, true, false],
    Operator: [true, true, false, false, true, false, false, false],
    Viewer: [true, false, false, false, true, false, false, false],
  };

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
            <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg ${role.color} bg-opacity-10 flex items-center justify-center`}>
                    <Shield className={`w-6 h-6 text-${role.color.replace('bg-', '')}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{role.name}</h3>
                    <p className="text-sm text-muted-foreground">{role.users} users</p>
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
                  <TableHead className="w-1/3">Permission</TableHead>
                  {Object.keys(permissionMatrix).map((role) => (
                    <TableHead key={role} className="text-center">
                      <Badge variant="outline">{role}</Badge>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((permission, idx) => (
                  <TableRow key={permission} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{permission}</TableCell>
                    {Object.keys(permissionMatrix).map((role) => (
                      <TableCell key={role} className="text-center">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={permissionMatrix[role as keyof typeof permissionMatrix][idx]}
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
    </div>
  );
};

export default Roles;
