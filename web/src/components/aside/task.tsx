import Aside, { AsideProps } from ".";
import useTasks, { TasksProviderType } from "../../context/TasksProvider";
import useUser, { TUserContext } from "../../context/UserProvider";
import { priorityOptions, Task } from "../../services/tasks";
import Editable from "../editable";
import UserAvatar from "../user-avatar";
import Button from "../button";
import Dropdown from "../dropdown";
import { useState } from "react";

type TaskAsideProps = Omit<AsideProps, "title"> & {
  task?: Task;
};

type TTableFields = {
  property: keyof Task;
  name: string;
  type: "text" | "dropdown" | "date";
  Component?: JSX.Element;
};

const tableFields: TTableFields[] = [
  {
    property: "priority",
    name: "Priority",
    type: "dropdown",
  },
  {
    property: "start_date",
    name: "Start Date",
    type: "date",
  },
  {
    property: "end_date",
    name: "Due Date",
    type: "date",
  },
  {
    property: "owner",
    name: "Assigned",
    type: "text",
  },
];

const generateTaskMetaComponents = ({ task }: { task: Task }) => {
  type TaskMetaField = { label: string; Element: JSX.Element };

  const { updateTask, project } = useTasks() as TasksProviderType;

  const fieldComponents: TaskMetaField[] = [];
  const taskOwner = project?.assigned_users.find((user) => {
    return user.user.id === task.owner;
  });

  function updateDate(key: "start_end" | "end_date", value: string) {
    if (!task) return;
    updateTask(task.id, { [key]: value });
  }

  tableFields.forEach((field) => {
    const component: TaskMetaField = {
      label: field.name,
      Element: <></>,
    };

    switch (field.property) {
      case "priority":
        {
          const options = Object.keys(priorityOptions).map((key) => {
            return {
              label: priorityOptions[key],
              value: key,
            };
          });

          component["label"] = priorityOptions[task.priority];
          component["Element"] = (
            <Dropdown
              initialValue={priorityOptions[task[field.property]] as string}
              options={options}
              onOptionSelect={(value) => {
                updateTask(task.id, { [field.property]: value });
              }}
              fullWidth={true}
            />
          );
        }
        break;
      case "end_date":
        {
          const date = task[field.property]
            ? new Date(task[field.property] as string)
                .toISOString()
                .split("T")[0]
            : "";
          component["Element"] = (
            <input
              type="date"
              name={field.property}
              id={field.property}
              value={date}
              onChange={(e) => {
                updateDate("end_date", e.target.value);
              }}
              className="w-full h-[34px] dark:text-grey-lightest dark:bg-transparent dark:hover:bg-slate-700 cursor-pointer border-none p-0 shadow-none foucs:shadow-none"
            />
          );
        }
        break;
      case "start_date":
        {
          const date = task[field.property]
            ? new Date(task[field.property] as string)
                .toISOString()
                .split("T")[0]
            : "";
          component["Element"] = (
            <input
              type="date"
              name={field.property}
              id={field.property}
              value={date}
              onChange={(e) => {
                updateDate("end_date", e.target.value);
              }}
              className="w-full h-[34px] dark:text-grey-lightest dark:bg-transparent dark:hover:bg-slate-700 cursor-pointer border-none p-0 shadow-none foucs:shadow-none"
            />
          );
        }
        break;
      case "owner": {
        component["Element"] = (
          <div className="flex gap-2 items-center">
            <UserAvatar
              profilePicUrl={taskOwner?.user.profile_pic}
              width="20px"
            />
            <div>{taskOwner?.user?.name}</div>
          </div>
        );
      }
    }

    fieldComponents.push(component);
  });

  return fieldComponents;
};

const TaskAside = ({ task, ...asideProps }: TaskAsideProps) => {
  const { updateTask } = useTasks() as TasksProviderType;
  const { user } = useUser() as TUserContext;
  const [description, setDescription] = useState(task?.description || "");

  if (!task) return null;

  function updateDescription() {
    if (!task || task.description === description) return;
    updateTask(task.id, { description: description });
  }

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
      <div className="flex border-t h-full dark:text-grey-lightest">
        <div className="w-[60%] border-r pt-4 px-4">
          <div className="mb-4">Description</div>
          <textarea
            name="description"
            id="description"
            cols={30}
            rows={10}
            value={description || ""}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className="w-full rounded-md dark:bg-slate-800 outline-none focus:outline-none"
          />
          <div className="text-right mt-2">
            <Button
              text="Save"
              type="CONFIRM"
              as="button"
              onClick={updateDescription}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-[40%] px-4 pt-4">
          {generateTaskMetaComponents({ task }).map((component) => (
            <div
              key={component.label}
              className="flex items-center dark:text-grey-lightest">
              <div className="w-[160px] text-sm py-1 min-h-[34px]">
                {component.label}
              </div>
              <div className="grow relative cursor-pointer dark:hover:bg-slate-700 rounded-sm py-1 px-2 min-h-[34px]">
                {component.Element}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Aside>
  );
};

export default TaskAside;
