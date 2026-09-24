import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/pulsepoll";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — PulsePoll" }, { name: "description", content: "Sign in to your PulsePoll live polling console." }, { property: "og:title", content: "Sign in — PulsePoll" }, { property: "og:description", content: "Sign in to your PulsePoll live polling console." }] }),
  component: () => <AuthPage mode="login" />,
});