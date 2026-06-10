"use client";

import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  type PieLabelRenderProps,
} from "recharts";

const COLORS = ["#BF953F", "#FCF6BA", "#B38728", "#AA771C"];

interface AnalyticsData {
  totalLeads: number;
  conversionRate: number;
  chatbotConversations: number;
  analyzerScans: number;
  leadsByDay: { date: string; count: number }[];
  leadsByService: { service: string; count: number }[];
  leadsBySource: { source: string; count: number }[];
}

export function AnalyticsCharts({ data }: { data: AnalyticsData }) {
  const t = useTranslations("admin");
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-gray-400">{t("total_leads")}</p>
          <p className="mt-1 text-2xl font-bold text-white">{data.totalLeads}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">{t("conversion_rate")}</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {data.conversionRate}%
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">{t("chatbot_conversations")}</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {data.chatbotConversations}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-gray-400">{t("analyzer_scans")}</p>
          <p className="mt-1 text-2xl font-bold text-white">
            {data.analyzerScans}
          </p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">{t("leads_over_time")}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.leadsByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="date" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#121212",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#BF953F"
                  strokeWidth={2}
                  dot={{ fill: "#FCF6BA", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="mb-4 text-lg font-semibold text-white">{t("leads_by_service")}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.leadsByService}
                  dataKey="count"
                  nameKey="service"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props: PieLabelRenderProps) => `${props.name ?? ""}: ${props.value ?? 0}`}
                >
                  {data.leadsByService.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h3 className="mb-4 text-lg font-semibold text-white">{t("leads_by_source")}</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.leadsBySource}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="source" stroke="#666" fontSize={12} />
                <YAxis stroke="#666" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#121212",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" fill="#BF953F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
