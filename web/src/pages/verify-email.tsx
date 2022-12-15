import { useEffect } from "react";
import { useParams } from "react-router-dom";
import UserService from "../services/users";

const VerifyEmail = () => {
  const { code } = useParams();

  useEffect(() => {
    UserService.verifyAccount(code as string);
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="relative">
        <img src="/images/email-verified.png" alt="Email Verified" />
        <p className="absolute text-4xl font-semibold text-[#413f56] top-[60px] left-1/2 -translate-x-1/2 ">
          Congratulations!! You account has been verified. <br />
          <span className="block mt-2 text-center">Enjoy Working.</span>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
