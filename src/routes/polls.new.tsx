import { createFileRoute } from "@tanstack/react-router";
import { CreatePollPage } from "@/components/pulsepoll";

export const Route = createFileRoute("/polls/new")({
  head: () => ({ meta: [{ title: "Create a poll — PulsePoll" }, { name: "description", content: "Create and publish a live PulsePoll question." }, { property: "og:title", content: "Create a poll — PulsePoll" }, { property: "og:description", content: "Create and publish a live PulsePoll question." }] }),
  component: CreatePollPage,
});