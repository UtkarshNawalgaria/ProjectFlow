import { FormEvent, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../components/button";
import client from "../services/client";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
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
          window.location.assign("/");
        })
        .catch((error) => {
          toast.error(error.message, {
            autoClose: 5000,
          });
        });
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form onSubmit={handleFormSubmit}>
        <div className="mb-4">
          <input
            ref={emailRef}
            type="email"
            required
            className="rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full"
            placeholder="Enter email.."
          />
        </div>
        <Button text="Verify Email" type="CONFIRM" extraStyles={"w-full"} />
      </form>
    </div>
  );
};

export default VerifyEmail;
