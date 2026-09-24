import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/pulsepoll";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create workspace — PulsePoll" }, { name: "description", content: "Create a PulsePoll workspace for live audience polling." }, { property: "og:title", content: "Create workspace — PulsePoll" }, { property: "og:description", content: "Create a PulsePoll workspace for live audience polling." }] }),
  component: () => <AuthPage mode="signup" />,
});