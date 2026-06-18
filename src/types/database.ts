export type UserRole = "Super_Admin" | "Admin" | "Editor";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  invited_by: string;
  token: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

export interface PageContent {
  id: string;
  section: string;
  locale: string;
  content: Record<string, unknown>;
  is_visible: boolean;
  updated_at: string;
  updated_by: string | null;
}

export interface ContentTranslation {
  id: string;
  section: string;
  key: string;
  locale: string;
  value: string;
  updated_at: string;
  updated_by: string | null;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  updated_at: string;
  updated_by: string | null;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  budget: string | null;
  brief: string | null;
  locale: string;
  status: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
}

export interface ApiCredential {
  id: string;
  name: string;
  encrypted_value: string;
  provider: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  content: string;
  embedding: number[] | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  table_name: string;
  operation: string;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  changed_by: string;
  timestamp: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discount_percent: number;
  description: string;
  max_uses: number;
  used_count: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
  created_by: string | null;
}

export interface ClientProject {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string | null;
  project_name: string;
  project_type: string;
  status: string;
  notes: string | null;
  files_url: string[];
  budget: string | null;
  discount_code_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Profile>;
      };
      invitations: {
        Row: Invitation;
        Insert: Omit<Invitation, "id" | "created_at">;
        Update: Partial<Invitation>;
      };
      page_content: {
        Row: PageContent;
        Insert: Omit<PageContent, "id" | "updated_at">;
        Update: Partial<PageContent>;
      };
      content_translations: {
        Row: ContentTranslation;
        Insert: Omit<ContentTranslation, "id" | "updated_at">;
        Update: Partial<ContentTranslation>;
      };
      site_settings: {
        Row: SiteSetting;
        Insert: Omit<SiteSetting, "id" | "updated_at">;
        Update: Partial<SiteSetting>;
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, "id" | "created_at">;
        Update: Partial<Lead>;
      };
      api_credentials: {
        Row: ApiCredential;
        Insert: Omit<ApiCredential, "id" | "created_at" | "updated_at">;
        Update: Partial<ApiCredential>;
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, "id" | "created_at">;
        Update: Partial<Document>;
      };
      audit_log: {
        Row: AuditLog;
        Insert: Omit<AuditLog, "id" | "timestamp">;
      };
      discount_codes: {
        Row: DiscountCode;
        Insert: Omit<DiscountCode, "id" | "created_at" | "used_count">;
        Update: Partial<DiscountCode>;
      };
      client_projects: {
        Row: ClientProject;
        Insert: Omit<ClientProject, "id" | "created_at" | "updated_at">;
        Update: Partial<ClientProject>;
      };
    };
  };
}
