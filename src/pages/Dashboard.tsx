import { useState, useEffect } from "react";
import { Users, Shield, Lock, Activity } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import heroNetwork from "@/assets/hero-network.jpg";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRoles: 0,
    totalPermissions: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [
      { count: usersCount },
      { data: rolesData },
      { count: permsCount },
    ] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("user_roles").select("role"),
      supabase.from("permissions").select("*", { count: "exact", head: true }),
    ]);

    const uniqueRoles = new Set((rolesData || []).map((r) => r.role)).size;

    setStats({
      totalUsers: usersCount || 0,
      totalRoles: uniqueRoles,
      totalPermissions: permsCount || 0,
    });
  };

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    const { data } = await supabase
      .from("audit_logs")
      .select("*, profiles(email)")
      .order("created_at", { ascending: false })
      .limit(4);

    setRecentActivity(data || []);
  };

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
            value={stats.totalUsers}
            icon={Users}
            trend={`${stats.totalUsers} registered`}
            trendUp
          />
          <StatCard
            title="Active Roles"
            value={stats.totalRoles}
            icon={Shield}
            trend="5 role types"
          />
          <StatCard
            title="Permissions"
            value={stats.totalPermissions}
            icon={Lock}
            trend="Granular control"
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
                  <p className="font-medium text-sm">{activity.action.replace(/_/g, " ")}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    by {activity.profiles?.email || "System"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(activity.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-center text-muted-foreground py-8">No recent activity</div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
