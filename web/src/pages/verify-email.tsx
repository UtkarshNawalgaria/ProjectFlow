import { FormEvent, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/button";
import AnonymousLayout from "../components/layouts/anonymous";
import client from "../services/client";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [isVerified, setIsVerified] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const code = searchParams.get("code");

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (emailRef.current !== null) {
      client<{ message: string }>("auth/verify_email/", {
        method: "POST",
        body: JSON.stringify({ email: emailRef?.current.value, code: code }),
      })
        .then((data) => {
          toast.success(data.message);
          setIsVerified(true);
        })
        .catch((error) => {
          toast.error(error.message, {
            autoClose: 5000,
          });
        });
    }
  };

  return (
    <AnonymousLayout>
      <div className="h-full w-full flex items-center justify-center">
        {isVerified ? (
          <div className="relative">
            <img src="./images/email-verified.png" alt="Email Verified" />
            <p className="absolute text-4xl font-semibold text-[#413f56] top-[60px] left-1/2 -translate-x-1/2 ">
              You email has been verified
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <input
                ref={emailRef}
                type="email"
                required
                className="rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full"
                placeholder="Email"
              />
            </div>
            <Button
              as="button"
              text="Verify Email"
              type="CONFIRM"
              extraStyles={"w-full"}
            />
          </form>
        )}
      </div>
    </AnonymousLayout>
  );
};

export default VerifyEmail;
