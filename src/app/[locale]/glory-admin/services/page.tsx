import { getServices } from "@/server-actions/services-actions";
import { ServicesManager } from "@/components/admin/services-manager/services-manager";

export default async function ServicesAdminPage() {
  const services = await getServices();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Services</h1>
        <p className="text-sm text-gray-500">Manage your services</p>
      </div>
      <ServicesManager services={services} />
    </div>
  );
}
