import Aside, { AsideProps } from ".";
import useTasks, { TasksProviderType } from "../../context/TasksProvider";
import useUser, { TUserContext } from "../../context/UserProvider";
import { Task } from "../../services/tasks";
import Editable from "../editable";

type TaskAsideProps = Omit<AsideProps, "title"> & {
  task: Task;
};

const TaskAside = ({ task, ...asideProps }: TaskAsideProps) => {
  const { updateTask } = useTasks() as TasksProviderType;
  const { user } = useUser() as TUserContext;

  return (
    <Aside
      {...asideProps}
      title={
        <Editable
          text={task.title}
          onConfirm={(value) => {
            updateTask(task?.id, {
              title: value,
            });
          }}
          allowEditing={user?.id === task.owner}
          Element={<span>{task.title}</span>}
        />
      }>
      <div>{JSON.stringify(task)}</div>
    </Aside>
  );
};

export default TaskAside;
