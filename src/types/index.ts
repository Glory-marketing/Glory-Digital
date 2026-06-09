export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  budget?: string;
  brief?: string;
}

export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AnalyticsData {
  totalLeads: number;
  conversionRate: number;
  chatbotConversations: number;
  analyzerScans: number;
  leadsByDay: { date: string; count: number }[];
  leadsByService: { service: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
}
