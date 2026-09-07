import { createBrowserRouter, RouterProvider, Navigate } from "react-router";
import { TooltipProvider } from "./components/ui/tooltip";
import { PersonaProvider } from "./components/connx/persona-context";
import { AppShell } from "./components/connx/app-shell";
import { PagePlaceholder } from "./components/connx/page-placeholder";
import DashboardPage from "./components/connx/dashboard";
import RolesPage from "./components/connx/pages/roles";
import RoleDetailPage from "./components/connx/pages/role-detail";
import ConsentCenterPage from "./components/connx/pages/consent-center";
import TemplatesPage from "./components/connx/pages/templates";
import DialerQueuePage from "./components/connx/pages/dialer-queue";
import DialerCustomisePage from "./components/connx/pages/dialer-customise";
import DialerSessionPage from "./components/connx/pages/dialer-session";
import DialerSummaryPage from "./components/connx/pages/dialer-summary";
import BulkPage from "./components/connx/pages/bulk";
import TimelinePage from "./components/connx/pages/timeline";
import CandidateProfilePage from "./components/connx/pages/candidate-profile";
import SettingsPage from "./components/connx/pages/settings";
import IntegrationsPage from "./components/connx/pages/integrations";
import { Toaster } from "./components/ui/sonner";

const router = createBrowserRouter([
  { path: "/dialer/session", element: <DialerSessionPage /> },
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "roles", element: <RolesPage /> },
      { path: "roles/:roleId", element: <RoleDetailPage /> },
      { path: "consent", element: <ConsentCenterPage /> },
      { path: "dialer", element: <DialerQueuePage /> },
      { path: "dialer/customise", element: <DialerCustomisePage /> },
      { path: "dialer/summary", element: <DialerSummaryPage /> },
      { path: "bulk", element: <BulkPage /> },
      { path: "timeline", element: <TimelinePage /> },
      { path: "candidates/:id", element: <CandidateProfilePage /> },
      { path: "templates", element: <TemplatesPage /> },

      { path: "hm", element: <PagePlaceholder title="Pipeline" description="Read-only view of all your open roles" /> },
      { path: "hm/candidates/:id", element: <PagePlaceholder title="Candidate review" /> },
      { path: "hm/approvals", element: <PagePlaceholder title="Approvals queue" /> },
      { path: "hm/digest", element: <PagePlaceholder title="Daily digest" /> },

      { path: "lead", element: <PagePlaceholder title="Team analytics" /> },
      { path: "lead/leaderboard", element: <PagePlaceholder title="Leaderboard" /> },
      { path: "lead/goals", element: <PagePlaceholder title="Goals & SLAs" /> },
      { path: "lead/team", element: <PagePlaceholder title="Team members" /> },

      { path: "settings", element: <SettingsPage /> },
      { path: "integrations", element: <IntegrationsPage /> },

      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

export default function App() {
  return (
    <PersonaProvider>
      <TooltipProvider delayDuration={200}>
        <RouterProvider router={router} />
        <Toaster />
      </TooltipProvider>
    </PersonaProvider>
  );
}
