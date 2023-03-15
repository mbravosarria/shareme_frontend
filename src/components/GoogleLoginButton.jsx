import React from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import { client } from "../client";

const GoogleLoginButton = () => {
  const navigate = useNavigate();
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const profileObj = jwt_decode(credentialResponse.credential);
          localStorage.setItem("user", credentialResponse.credential);

          const { sub, name, email, picture } = profileObj;

          const doc = {
            _id: sub,
            _type: "user",
            name,
            email,
            picture,
          };

          client.createIfNotExists(doc).then(() => {
            navigate("/", { replace: true });
          });
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButton;
