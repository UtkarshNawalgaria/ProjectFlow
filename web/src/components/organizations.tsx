import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import useUser, { TUserContext } from "../context/UserProvider";

const Organizations = () => {
  const { user, currentOrganization, changeOrganization } =
    useUser() as TUserContext;
  const [selected, setSelected] = useState(() => currentOrganization);

  return (
    <div className="mx-2">
      {user?.organizations ? (
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative">
            <Listbox.Button className="w-full text-grey-dark dark:text-grey-lightest py-2 px-2 border border-[#e7e7e7] text-sm font-medium bg-white dark:bg-slate-900 shadow-sm rounded-md flex items-center justify-between">
              {selected ? (
                <span>{selected?.title}</span>
              ) : (
                <span>{currentOrganization?.title}</span>
              )}
              <span>
                <HiChevronDown
                  className="text-grey-dark dark:text-grey-lightest"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Listbox.Options className="absolute bg-white dark:bg-slate-900 border border-[#e7e7e7] w-full mt-2 py-2 shadow-lg rounded-md">
                {user?.organizations.map((org) => (
                  <Listbox.Option
                    key={org.id}
                    value={org}
                    className={`px-2 mx-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer py-2 text-sm font-medium ${
                      org.id === currentOrganization?.id
                        ? "bg-gray-100 dark:bg-slate-900 dark:text-grey-lightest rounded-md"
                        : ""
                    }`}
                    onClick={() => changeOrganization(org?.id as number)}>
                    {org.title}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      ) : null}
    </div>
  );
};

export default Organizations;
