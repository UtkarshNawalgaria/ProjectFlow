import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserService from "../services/users";

const VerifyEmail = () => {
  const { code } = useParams();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    UserService.verifyAccount(code as string).then(() => setIsVerified(true));
  }, []);

  return (
    <div className="h-full w-full flex items-center justify-center">
      {isVerified ? (
        <div className="relative">
          <img src="/images/email-verified.png" alt="Email Verified" />
          <p className="absolute text-4xl font-semibold text-[#413f56] top-[60px] left-1/2 -translate-x-1/2 ">
            Congratulations!! You account has been verified. <br />
            <span className="block mt-2 text-center">Enjoy Working.</span>
          </p>
        </div>
      ) : (
        <div>
          Either your verifiation code is Invalid or you have already verified
          your email
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
