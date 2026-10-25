import { createFileRoute } from "@tanstack/react-router";
import { TaskTracker } from "@/components/tracker/task-tracker";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <TaskTracker />;
}
