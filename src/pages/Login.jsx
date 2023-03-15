import React from "react";

import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";

import GoogleLoginButton from "../components/GoogleLoginButton";

const Login = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-start">
      <div className="relative h-full w-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="h-full w-full object-cover"
        />
      </div>

      <div className="absolute top-0 bottom-0 right-0 left-0 flex flex-col items-center justify-center bg-blackOverlay">
        <div className="p-5">
          <img src={logo} width="130px" alt="logo" />
        </div>

        <div className="shadow-2xl">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
};

export default Login;
