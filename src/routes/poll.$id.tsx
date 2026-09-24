import { createFileRoute } from "@tanstack/react-router";
import { PublicPollPage } from "@/components/pulsepoll";

export const Route = createFileRoute("/poll/$id")({
  head: () => ({ meta: [{ title: "Live poll — PulsePoll" }, { name: "description", content: "Vote in a live PulsePoll and watch the result update in real time." }, { property: "og:title", content: "Live poll — PulsePoll" }, { property: "og:description", content: "Vote in a live PulsePoll and watch the result update in real time." }] }),
  component: PollRoute,
});

function PollRoute() {
  const { id } = Route.useParams();
  return <PublicPollPage pollId={id} />;
}