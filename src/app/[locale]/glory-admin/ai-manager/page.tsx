import { AIManagerForm } from "@/components/admin/ai-manager-form";

export default function AIManagerPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Manager</h1>
        <p className="text-sm text-gray-500">
          Configure chatbot, knowledge base, and AI tools
        </p>
      </div>

      <AIManagerForm />
    </div>
  );
}
