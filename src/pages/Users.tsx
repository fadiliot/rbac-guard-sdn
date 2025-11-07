import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, UserPlus, MoreVertical } from "lucide-react";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = [
    { id: 1, name: "Admin User", email: "admin@sdn.local", role: "Administrator", status: "active" },
    { id: 2, name: "John Doe", email: "john.doe@sdn.local", role: "Operator", status: "active" },
    { id: 3, name: "Jane Smith", email: "jane.smith@sdn.local", role: "Viewer", status: "active" },
    { id: 4, name: "Bob Wilson", email: "bob.wilson@sdn.local", role: "Network Admin", status: "inactive" },
    { id: 5, name: "Alice Johnson", email: "alice.j@sdn.local", role: "Operator", status: "active" },
  ];

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Administrator":
        return "default";
      case "Network Admin":
        return "secondary";
      case "Operator":
        return "outline";
      default:
        return "outline";
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-primary via-secondary to-accent py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
          <p className="text-white/90">Manage user accounts and role assignments</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-6">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button className="w-full md:w-auto bg-gradient-to-r from-primary to-secondary hover:opacity-90">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          user.status === "active" ? "text-accent" : "text-muted-foreground"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${user.status === "active" ? "bg-accent" : "bg-muted-foreground"}`} />
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </TableCell>
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

export default Users;
