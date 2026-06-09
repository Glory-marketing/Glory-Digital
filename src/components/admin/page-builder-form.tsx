"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { updateContentTranslation, toggleSectionVisibility, revalidateAll } from "@/server-actions/content";
import { useToast } from "@/components/ui/toast";

interface Section {
  section: string;
  key: string;
  value: string;
  locale: string;
}

interface Visibility {
  section: string;
  locale: string;
  is_visible: boolean;
}

export function PageBuilderForm({
  sections,
  visibilities,
  locale,
}: {
  sections: Section[];
  visibilities: Visibility[];
  locale: string;
}) {
  const { toast } = useToast();
  const [activeLocale, setActiveLocale] = useState(locale);

  const filteredSections = sections.filter((s) => s.locale === activeLocale);

  const groupedSections = filteredSections.reduce(
    (acc, s) => {
      if (!acc[s.section]) acc[s.section] = [];
      acc[s.section].push(s);
      return acc;
    },
    {} as Record<string, Section[]>
  );

  const handleSave = async (section: string, key: string, value: string) => {
    try {
      await updateContentTranslation(section, key, activeLocale, value);
      toast("Content updated!", "success");
    } catch {
      toast("Failed to update", "error");
    }
  };

  const handleToggle = async (section: string, current: boolean) => {
    try {
      await toggleSectionVisibility(section, activeLocale, !current);
      toast("Visibility updated!", "success");
    } catch {
      toast("Failed to update", "error");
    }
  };

  const handleRevalidate = async () => {
    await revalidateAll();
    toast("Site cache cleared!", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {["en", "ar"].map((l) => (
            <Button
              key={l}
              variant={activeLocale === l ? "primary" : "secondary"}
              size="sm"
              onClick={() => setActiveLocale(l)}
            >
              {l === "en" ? "English" : "العربية"}
            </Button>
          ))}
        </div>
        <Button variant="secondary" size="sm" onClick={handleRevalidate}>
          Publish Changes
        </Button>
      </div>

      {Object.entries(groupedSections).map(([section, fields]) => {
        const visible = visibilities.find(
          (v) => v.section === section && v.locale === activeLocale
        );

        return (
          <Card key={section}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white capitalize">
                {section} Section
              </h3>
              <label className="flex items-center gap-2 text-sm text-gray-400">
                <input
                  type="checkbox"
                  checked={visible?.is_visible ?? true}
                  onChange={() => handleToggle(section, visible?.is_visible ?? true)}
                  className="accent-[#BF953F]"
                />
                Visible
              </label>
            </div>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.key} className="flex items-start gap-3">
                  <div className="flex-1">
                    <label className="mb-1 block text-xs text-gray-500 capitalize">
                      {field.key.replace(/_/g, " ")}
                    </label>
                    <Input
                      defaultValue={field.value}
                      onBlur={(e) =>
                        handleSave(field.section, field.key, e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
