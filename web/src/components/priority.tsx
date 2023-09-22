import { Task } from "../services/tasks";
import { capitalize } from "../utils";

export default function Priority({ value }: { value: Task["priority"] }) {
  if (!value) return null;

  let bgColor, iconColor;

  switch (value) {
    case "low":
      bgColor = "bg-yellow-100/40";
      iconColor = "bg-yellow-500";
      break;
    case "medium":
      bgColor = "bg-green-100/40";
      iconColor = "bg-green-500";
      break;
    case "high":
      bgColor = "bg-red-100/40";
      iconColor = "bg-red-500";
      break;
  }

  return (
    <div
      className={`mt-1 rounded-md px-2 text-sm py-1 flex items-center gap-2 w-min ${bgColor}`}>
      <span
        className={`w-[10px] h-[10px] inline-block bg-white rounded-full ${iconColor}`}></span>
      <span>{capitalize(value)}</span>
    </div>
  );
}
