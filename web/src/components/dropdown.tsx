import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";

type DropdownProps<Type> = {
  initialValue: Type;
  options: {
    label: string;
    value: Type;
  }[];
  onOptionSelect: (value: Type) => void;
  fullWidth: boolean;
};

function Dropdown<Type extends string | number>({
  initialValue,
  options,
  onOptionSelect,
  fullWidth = false,
}: DropdownProps<Type>) {
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
              {options.map((obj, index) => (
                <Listbox.Option
                  key={index}
                  value={obj.value}
                  className="hover:bg-slate-700 px-2 py-1 rounded-sm ">
                  {obj.label}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </>
      )}
    </Listbox>
  );
}

export default Dropdown;

// {
//   field.type === "dropdown" ? (
//     <Dropdown
//       initialValue={task[field.property] as string}
//       options={Object.keys(priorityOptions).map((key) => {
//         return {
//           label: priorityOptions[key],
//           value: key,
//         };
//       })}
//       onOptionSelect={(value) => {
//         updateTask(task.id, { [field.property]: value });
//       }}
//       fullWidth={true}
//     />
//   ) : field.property === "owner" ? (
//     <div className="flex gap-2 items-center">
//       <UserAvatar profilePicUrl={taskOwner?.user.profile_pic} width="20px" />
//       <div>{taskOwner?.user?.name}</div>
//     </div>
//   ) : field.property === "end_date" || field.property === "start_date" ? (
//     <input
//       type="datetime"
//       name={field.property}
//       id={field.property}
//       value={new Date(task[field.property])
//         .toLocaleDateString()
//         .replaceAll("/", "-")}
//       onChange={(e) => console.log(e.target.valueAsDate)}
//       className="w-full h-[34px] dark:text-grey-lightest dark:bg-slate-800 dark:hover:bg-slate-700 cursor-pointer border-none p-0 outline-none focus:outline-none"
//     />
//   ) : (
//     task[field.property]
//   );
// }
