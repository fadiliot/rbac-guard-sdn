import { Shield, Users, Lock, Activity, LogOut, FileText } from "lucide-react";
import { NavLink } from "./NavLink";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { signOut } = useAuth();

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">SDN Controller</h1>
              <p className="text-xs text-muted-foreground">Access Control System</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              activeClassName="!text-primary bg-primary/10"
            >
              <Activity className="w-4 h-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/users"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              activeClassName="!text-primary bg-primary/10"
            >
              <Users className="w-4 h-4" />
              Users
            </NavLink>
            <NavLink
              to="/roles"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              activeClassName="!text-primary bg-primary/10"
            >
              <Lock className="w-4 h-4" />
              Roles
            </NavLink>
            <NavLink
              to="/audit-logs"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              activeClassName="!text-primary bg-primary/10"
            >
              <FileText className="w-4 h-4" />
              Audit Logs
            </NavLink>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-muted-foreground hover:text-destructive ml-4"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
