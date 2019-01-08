import React from "react";
const SignupWarning = () => {
  return (
    <div>
      <p>
        CMS will send you a link to verify your email address.
        <span style={{ fontWeight: "bold" }}>
          {" "}
          You must open this link in the same browser.
        </span>{" "}
        After verifying your email, CMS will create your CMS “identity”, which
        consists of a public/private cryptographic key pair and browser cookie.
        This is necessary to verify your identity and allow submission of
        proposals, commenting, voting, and other CMS functions. After completing
        the signup process, you can export your identity (public/private keys)
        to another browser at any time.
      </p>
    </div>
  );
};

export default SignupWarning;
