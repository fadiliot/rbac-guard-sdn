import { Users, Shield, Lock, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import heroNetwork from "@/assets/hero-network.jpg";

const Dashboard = () => {
  const recentActivity = [
    { id: 1, user: "admin@sdn.local", action: "Updated role permissions", time: "2 minutes ago" },
    { id: 2, user: "john.doe@sdn.local", action: "Created new user account", time: "15 minutes ago" },
    { id: 3, user: "jane.smith@sdn.local", action: "Modified network policy", time: "1 hour ago" },
    { id: 4, user: "admin@sdn.local", action: "Assigned operator role", time: "2 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative h-64 bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(200 90% 45% / 0.95), hsl(190 80% 50% / 0.95), hsl(180 75% 55% / 0.95)), url(${heroNetwork})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="relative container mx-auto px-6 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">RBAC Dashboard</h1>
          <p className="text-xl text-white/90">Software-Defined Network Access Control</p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={124}
            icon={Users}
            trend="+12% from last month"
            trendUp
          />
          <StatCard
            title="Active Roles"
            value={8}
            icon={Shield}
            trend="2 pending approval"
          />
          <StatCard
            title="Permissions"
            value={32}
            icon={Lock}
            trend="4 recently updated"
          />
          <StatCard
            title="Network Status"
            value="Online"
            icon={Activity}
            trend="99.9% uptime"
            trendUp
          />
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Activity</h2>
            <Activity className="w-5 h-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.action}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {activity.user}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
