import { createFileRoute } from "@tanstack/react-router";
import { DashboardPage } from "@/components/pulsepoll";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — PulsePoll" }, { name: "description", content: "Monitor live PulsePoll signals and recent audience responses." }, { property: "og:title", content: "Dashboard — PulsePoll" }, { property: "og:description", content: "Monitor live PulsePoll signals and recent audience responses." }] }),
  component: DashboardPage,
});