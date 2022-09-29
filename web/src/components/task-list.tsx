import { Task } from "../services/tasks";

const TaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  if (tasks === null) {
    return <div>No tasks</div>;
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>{task.title}</div>
      ))}
    </div>
  );
};

export default TaskList;
