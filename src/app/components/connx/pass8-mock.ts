// ─── Integration catalog ──────────────────────────────────────────
export type IntegrationCategory = "ats" | "telephony" | "email" | "sms" | "calendar" | "hrms" | "messaging";
export type IntegrationStatus = "connected" | "action-needed" | "available" | "coming-soon";

export interface Integration {
  id: string;
  name: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  description: string;
  website: string;
  lastSyncedAt?: string;
  syncCadence?: string;
  recordsSynced?: number;
  authMethod?: "OAuth" | "API key" | "Webhook";
  region?: string;
  issue?: string;
  iconLetter: string;
  iconColor: string;
}

export const INTEGRATIONS: Integration[] = [
  { id: "int-workday", name: "Workday", category: "ats", status: "connected", description: "Sync shortlisted candidates and write back dispositions to Workday.", website: "workday.com", lastSyncedAt: "2 minutes ago", syncCadence: "Real-time webhook + 15-min poll", recordsSynced: 142, authMethod: "OAuth", iconLetter: "W", iconColor: "#0875E1" },
  { id: "int-greenhouse", name: "Greenhouse", category: "ats", status: "connected", description: "Pull candidates from Greenhouse and push back screening outcomes.", website: "greenhouse.io", lastSyncedAt: "8 minutes ago", syncCadence: "Webhook on shortlist event", recordsSynced: 87, authMethod: "OAuth", iconLetter: "G", iconColor: "#24A47F" },
  { id: "int-lever", name: "Lever", category: "ats", status: "available", description: "Sync candidate pipelines from Lever to CONNX.", website: "lever.co", iconLetter: "L", iconColor: "#5C2BE2" },
  { id: "int-icims", name: "iCIMS", category: "ats", status: "available", description: "Connect iCIMS to bring candidates into your CONNX workflow.", website: "icims.com", iconLetter: "iC", iconColor: "#1E5BB8" },
  { id: "int-smartrecruiters", name: "SmartRecruiters", category: "ats", status: "available", description: "Pull from SmartRecruiters into CONNX outreach queues.", website: "smartrecruiters.com", iconLetter: "SR", iconColor: "#0FB1B1" },
  { id: "int-twilio", name: "Twilio", category: "telephony", status: "connected", description: "Outbound voice and SMS for North America and global English markets.", website: "twilio.com", lastSyncedAt: "Live", syncCadence: "Real-time", region: "US · Canada · UK", authMethod: "API key", iconLetter: "T", iconColor: "#F22F46" },
  { id: "int-exotel", name: "Exotel", category: "telephony", status: "action-needed", description: "DLT-compliant voice and SMS for India.", website: "exotel.com", region: "India", authMethod: "API key", issue: "DLT template for \"48h consent reminder · SBE\" needs re-approval", iconLetter: "E", iconColor: "#7B61FF" },
  { id: "int-knowlarity", name: "Knowlarity", category: "telephony", status: "available", description: "APAC telephony partner — voice and SMS across India, SEA.", website: "knowlarity.com", iconLetter: "K", iconColor: "#FF5A1F" },
  { id: "int-plivo", name: "Plivo", category: "telephony", status: "available", description: "Global voice and SMS infrastructure as alternative to Twilio.", website: "plivo.com", iconLetter: "P", iconColor: "#0E7C66" },
  { id: "int-sendgrid", name: "SendGrid", category: "email", status: "connected", description: "Bulk email delivery, branded templates, deliverability analytics.", website: "sendgrid.com", lastSyncedAt: "Live", recordsSynced: 1289, authMethod: "API key", iconLetter: "SG", iconColor: "#1A82E2" },
  { id: "int-aws-ses", name: "AWS SES", category: "email", status: "available", description: "Cost-effective transactional email at scale.", website: "aws.amazon.com/ses", iconLetter: "SE", iconColor: "#FF9900" },
  { id: "int-mailgun", name: "Mailgun", category: "email", status: "available", description: "Developer-first email API with detailed analytics.", website: "mailgun.com", iconLetter: "M", iconColor: "#C02427" },
  { id: "int-msg91", name: "MSG91", category: "sms", status: "connected", description: "DLT-compliant SMS for Indian carriers with template approval workflow.", website: "msg91.com", lastSyncedAt: "Live", recordsSynced: 312, region: "India", authMethod: "API key", iconLetter: "M9", iconColor: "#0066CC" },
  { id: "int-kaleyra", name: "Kaleyra", category: "sms", status: "available", description: "Global SMS coverage with strong APAC presence.", website: "kaleyra.com", iconLetter: "K", iconColor: "#FF6B35" },
  { id: "int-textlocal", name: "Textlocal", category: "sms", status: "available", description: "UK and APAC SMS with bulk-friendly pricing.", website: "textlocal.com", iconLetter: "TL", iconColor: "#4A90E2" },
  { id: "int-gcal", name: "Google Calendar", category: "calendar", status: "connected", description: "Schedule callbacks against your real calendar availability.", website: "calendar.google.com", lastSyncedAt: "Live", authMethod: "OAuth", iconLetter: "G", iconColor: "#4285F4" },
  { id: "int-outlook", name: "Microsoft Outlook", category: "calendar", status: "available", description: "Use Outlook for callback scheduling and availability lookup.", website: "outlook.com", iconLetter: "O", iconColor: "#0078D4" },
  { id: "int-whatsapp", name: "WhatsApp Business", category: "messaging", status: "action-needed", description: "Conversational outreach via WhatsApp Business API.", website: "business.whatsapp.com", region: "Where permitted", issue: "Business profile verification expires in 7 days", iconLetter: "W", iconColor: "#25D366" },
  { id: "int-successfactors", name: "SAP SuccessFactors", category: "hrms", status: "available", description: "Read-only candidate data sync from SAP SuccessFactors.", website: "sap.com", iconLetter: "SF", iconColor: "#0FAAFF" },
  { id: "int-oracle-hcm", name: "Oracle HCM", category: "hrms", status: "available", description: "Read-only sync from Oracle HCM Cloud.", website: "oracle.com", iconLetter: "O", iconColor: "#C74634" },
  { id: "int-zoho", name: "Zoho Recruit", category: "ats", status: "coming-soon", description: "Zoho Recruit support is in private beta — request access.", website: "zoho.com/recruit", iconLetter: "Z", iconColor: "#F0463A" },
];

export const CATEGORY_META: Record<IntegrationCategory, { label: string; description: string }> = {
  ats: { label: "ATS", description: "Source candidates from your applicant tracking system" },
  telephony: { label: "Telephony", description: "Voice and SMS infrastructure for outbound dialing" },
  email: { label: "Email", description: "Bulk and transactional email delivery" },
  sms: { label: "SMS", description: "Standalone SMS providers (separate from telephony)" },
  calendar: { label: "Calendar", description: "Schedule callbacks against your real availability" },
  messaging: { label: "Messaging", description: "Conversational platforms like WhatsApp" },
  hrms: { label: "HRMS", description: "Read-only people data from your HR system" },
};

// ─── DNC list ─────────────────────────────────────────────────────
export interface DncEntry {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  reason: string;
  source: "candidate-opt-out" | "manual" | "regulatory" | "imported";
  addedAt: string;
  addedBy?: string;
}

export const DNC_ENTRIES: DncEntry[] = [
  { id: "dnc-1", phone: "+1 415 555 0188", email: "mira.solberg@hey.com", name: "Mira Solberg", reason: "Replied STOP to consent SMS · Senior Backend Engineer", source: "candidate-opt-out", addedAt: "Mon, 3:21 PM", addedBy: "System" },
  { id: "dnc-2", phone: "+1 628 555 0107", name: "Felix Lindqvist", reason: "Permanent opt-out — all roles", source: "candidate-opt-out", addedAt: "Today, 8:01 AM", addedBy: "System" },
  { id: "dnc-3", phone: "+44 20 7946 0142", reason: "Wrong number — verified by recruiter", source: "manual", addedAt: "3 days ago", addedBy: "Jordan Chen" },
  { id: "dnc-4", phone: "+1 212 555 0123", email: "noreply@gov.us", reason: "Regulatory blocklist · TCPA registered number", source: "regulatory", addedAt: "Migrated · 2024-09-14", addedBy: "System" },
  { id: "dnc-5", phone: "+1 312 555 0186", reason: "Imported from internal company DNC list", source: "imported", addedAt: "Migrated · 2024-09-14", addedBy: "Compliance team" },
];

// ─── Notification preferences ─────────────────────────────────────
export interface NotificationPref {
  id: string;
  category: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  inApp: boolean;
}

export const NOTIFICATION_PREFS: NotificationPref[] = [
  { id: "n-1",  category: "Consent",   label: "Candidate accepts consent",          description: "When a candidate replies YES or schedules a callback time", email: false, push: true,  inApp: true },
  { id: "n-2",  category: "Consent",   label: "Candidate declines consent",         description: "When a candidate replies STOP", email: false, push: false, inApp: true },
  { id: "n-3",  category: "Consent",   label: "Consent expires without response",   description: "Reminder when 72-hour window closes", email: true,  push: false, inApp: true },
  { id: "n-4",  category: "Calls",     label: "SMS reply during a dialer session",  description: "Surface reply mid-session so you can pivot", email: false, push: true,  inApp: true },
  { id: "n-5",  category: "Calls",     label: "Callback due in 15 minutes",         description: "Heads-up before scheduled callbacks", email: false, push: true,  inApp: true },
  { id: "n-6",  category: "Pipeline",  label: "Daily digest from CONNX",            description: "End-of-day summary of activity and tomorrow's plan", email: true,  push: false, inApp: false },
  { id: "n-7",  category: "Pipeline",  label: "Hiring manager comments on a candidate", description: "When an HM leaves a note in your pipeline", email: false, push: false, inApp: true },
  { id: "n-8",  category: "Insights",  label: "LEO suggestions",                    description: "Smart nudges from CONNX intelligence", email: false, push: false, inApp: true },
  { id: "n-9",  category: "Insights",  label: "Performance milestones",             description: "Celebrate when you hit a daily or weekly goal", email: false, push: false, inApp: true },
  { id: "n-10", category: "System",    label: "Integration sync errors",            description: "When Workday, Twilio, or another integration fails", email: true,  push: false, inApp: true },
];

// ─── Language options ─────────────────────────────────────────────
export const LANGUAGES = [
  { code: "en", label: "English", consent: true, ui: true, region: "Global" },
  { code: "es", label: "Español", consent: true, ui: false, region: "Spain · LATAM" },
  { code: "hi", label: "हिन्दी (Hindi)", consent: true, ui: false, region: "India" },
  { code: "fr", label: "Français", consent: true, ui: false, region: "France · Canada" },
  { code: "de", label: "Deutsch", consent: false, ui: false, region: "DACH" },
  { code: "ja", label: "日本語", consent: false, ui: false, region: "Japan" },
  { code: "pt", label: "Português", consent: false, ui: false, region: "Brazil · Portugal" },
];

// ─── Data residency regions ───────────────────────────────────────
export const DATA_REGIONS = [
  { code: "us-east-1", label: "United States — East (Virginia)", active: true, compliance: "SOC 2 · HIPAA-eligible" },
  { code: "eu-west-1", label: "European Union — Ireland",         active: false, compliance: "GDPR · ISO 27001" },
  { code: "ap-south-1", label: "India — Mumbai",                  active: false, compliance: "DPDP Act 2023" },
  { code: "ap-se-1",    label: "Singapore",                        active: false, compliance: "PDPA" },
];
