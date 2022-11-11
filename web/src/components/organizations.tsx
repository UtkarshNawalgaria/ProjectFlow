import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { HiChevronDown } from "react-icons/hi";
import useUser, { TUserContext } from "../context/UserProvider";

const Organizations = () => {
  const { user, currentOrganization, changeOrganization } =
    useUser() as TUserContext;
  const [selected, setSelected] = useState(() => currentOrganization);

  return (
    <div className="mt-4 mx-2">
      {user?.organizations ? (
        <Listbox value={selected} onChange={setSelected}>
          <div className="relative">
            <Listbox.Button className="w-full text-grey-dark py-2 px-2 border border-[#e7e7e7] bg-white shadow-sm rounded-md flex items-center justify-between">
              {selected ? (
                <span>{selected?.title}</span>
              ) : (
                <span>{currentOrganization?.title}</span>
              )}
              <span>
                <HiChevronDown className="text-grey-dark" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <Listbox.Options className="absolute bg-white border border-[#e7e7e7] w-full mt-2 py-2 shadow-lg rounded-md">
                {user?.organizations.map((org) => (
                  <Listbox.Option
                    key={org.id}
                    value={org}
                    className={`px-2 m-2 rounded-sm hover:bg-gray-100 cursor-pointer py-2 ${
                      org.id === currentOrganization?.id
                        ? "bg-gray-100 rounded-md"
                        : ""
                    }`}
                    onClick={() => changeOrganization(org.id)}>
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
