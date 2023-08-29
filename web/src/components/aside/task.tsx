import { Fragment } from "react";
import Aside, { AsideProps } from ".";
import useTasks, { TasksProviderType } from "../../context/TasksProvider";
import useUser, { TUserContext } from "../../context/UserProvider";
import { PriorityOptions, Task } from "../../services/tasks";
import Editable from "../editable";
import { Listbox, Transition } from "@headlessui/react";

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
    property: "due_date",
    name: "Due Date",
    type: "date",
  },
  {
    property: "owner",
    name: "Assigned",
    type: "text",
  },
];

function Dropdown<Type extends string | number>({
  initialValue,
  valuesList,
  onOptionSelect,
  fullWidth = false,
}: {
  initialValue: Type;
  valuesList: Type[];
  onOptionSelect: (value: Type) => void;
  fullWidth: boolean;
}) {
  return (
    <Listbox value={initialValue} onChange={onOptionSelect}>
      {() => (
        <>
          <Listbox.Button className={`h-full w-full text-left`}>
            {initialValue}
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <Listbox.Options
              className={`absolute left-0 top-[34px] z-20 dark:bg-slate-800 flex flex-col shadow-xl rounded-b-sm${
                fullWidth ? " r-0 w-full" : " w-[200px]"
              }`}>
              {valuesList.map((value, index) => (
                <Listbox.Option
                  key={index}
                  value={value}
                  className="hover:bg-slate-700 px-2 py-1 rounded-sm ">
                  {value}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
}

const TaskAside = ({ task, ...asideProps }: TaskAsideProps) => {
  const { updateTask, project } = useTasks() as TasksProviderType;
  const { user } = useUser() as TUserContext;

  if (!task) return null;

  const taskOwner = project?.assigned_users.find((user) => {
    return user.user.id === task.owner;
  });

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
      <div className="flex flex-col gap-3">
        {tableFields.map((field) => (
          <div
            key={field.property}
            className="flex items-center dark:text-grey-lightest">
            <div className="w-[160px] text-sm py-1 min-h-[34px]">
              {field.name}
            </div>
            <div className="grow relative cursor-pointer dark:hover:bg-slate-700 rounded-sm py-1 px-2 min-h-[34px]">
              {field.type === "dropdown" ? (
                <Dropdown
                  initialValue={task[field.property] as string}
                  valuesList={Object.keys(PriorityOptions)}
                  onOptionSelect={(value) => {
                    updateTask(task.id, { [field.property]: value });
                  }}
                  fullWidth={true}
                />
              ) : field.property === "owner" ? (
                <div>{taskOwner?.user?.name}</div>
              ) : (
                task[field.property]
              )}
            </div>
          </div>
        ))}
      </div>
    </Aside>
  );
};

export default TaskAside;
