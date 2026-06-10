import { getPortfolioProjects } from "@/server-actions/portfolio";
import { PortfolioManager } from "@/components/admin/portfolio-manager/portfolio-manager";

export default async function PortfolioAdminPage() {
  const projects = await getPortfolioProjects();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Portfolio Projects</h1>
        <p className="text-sm text-gray-500">Manage your portfolio projects</p>
      </div>
      <PortfolioManager projects={projects} />
    </div>
  );
}
