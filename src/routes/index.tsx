import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/pulsepoll";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "PulsePoll — Live signals, made visible" }, { name: "description", content: "Launch live polls, watch audience signals move, and share results in real time." }, { property: "og:title", content: "PulsePoll — Live signals, made visible" }, { property: "og:description", content: "Launch live polls, watch audience signals move, and share results in real time." }] }),
  component: LandingPage,
});
