import { DashboardStats } from "@/components/admin/dashboard-stats";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500">Welcome to Glory Admin</p>
      </div>

      <DashboardStats />
    </div>
  );
}
