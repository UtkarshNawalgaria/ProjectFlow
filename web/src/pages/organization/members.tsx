import { Popover, Transition } from "@headlessui/react";
import { Fragment, MutableRefObject, useEffect, useRef, useState } from "react";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../components/button";
import PageHeader from "../../components/page-header";
import useUser, { TUserContext } from "../../context/UserProvider";
import useClient from "../../services/client";

import UserService from "../../services/users";

type TMember = {
  name: string;
  email: string;
  role: "admin" | "member";
  invitation_status: "ACCEPTED" | "PENDING";
};

const OrganizationMembers = () => {
  const { orgId } = useParams();
  const { user } = useUser() as TUserContext;
  const inviteEmailRef = useRef<HTMLInputElement>(null);
  const [members, setMembers] = useState<TMember[]>([]);

  const sendUserInvite = (close: {
    (
      focusableElement?:
        | HTMLElement
        | MutableRefObject<HTMLElement | null>
        | undefined
    ): void;
    (): void;
  }) => {
    if (inviteEmailRef.current !== null && orgId) {
      const email = inviteEmailRef.current?.value;
      UserService.invite(email, parseInt(orgId) as number)
        .then((res) => {
          close();
          toast.success(res.message);
        })
        .catch((error) => toast.error(error.message));
    }
  };

  useEffect(() => {
    useClient<TMember[]>(`organization/${orgId}/members`).then((members) =>
      setMembers([
        {
          email: user?.email as string,
          invitation_status: "ACCEPTED",
          role: "admin",
          name: "",
        },
        ...members,
      ])
    );
  }, []);

  return (
    <div>
      <PageHeader>
        <div>
          <h2 className="text-2xl font-bold text-grey-dark">Members</h2>
        </div>
        <div>
          <Popover className="relative">
            <Popover.Button className="flex gap-2 items-center bg-primary text-white hover:bg-indigo-600 rounded-md font-semibold cursor-pointer py-2 px-6 outline outline-1 transition">
              <span>
                <MdOutlinePersonAddAlt className="h-5 w-5" />
              </span>
              <span>Invite</span>
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1">
              <Popover.Panel className="absolute right-0 mt-2 p-4 rounded-md bg-white shadow-2xl w-[300px]">
                {({ close }) => (
                  <div>
                    <p className="text-center mb-4 font-bold text-lg text-grey-dark">
                      Invite People
                    </p>
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        sendUserInvite(close);
                      }}>
                      <input
                        type="email"
                        required
                        ref={inviteEmailRef}
                        className="rounded-md border border-grey-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary w-full mb-4"
                        placeholder="User email"
                      />
                      <Button
                        as="button"
                        text="Send Invite"
                        type="CONFIRM"
                        extraStyles="w-full"
                      />
                    </form>
                  </div>
                )}
              </Popover.Panel>
            </Transition>
          </Popover>
        </div>
      </PageHeader>
      <section className="mx-4">
        {members.map((member) => (
          <div
            key={member.email}
            className="flex justify-between mb-4 bg-gray-50 p-4 rounded-md cursor-pointer hover:bg-gray-100">
            <div className="w-3/4">{member.email}</div>
            <div className="flex gap-4 w-1/4 justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={
                    "w-2 h-2 rounded-lg" +
                    `${
                      member.invitation_status === "PENDING"
                        ? " bg-red-500"
                        : " bg-green-600"
                    }`
                  }></span>
                <span>{member.invitation_status}</span>
              </div>
              <div>{member.role}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default OrganizationMembers;
