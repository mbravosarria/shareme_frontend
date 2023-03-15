import jwt_decode from "jwt-decode";

export const fetchUser = () => {
  return localStorage.getItem("user")
    ? jwt_decode(localStorage.getItem("user"))
    : localStorage.clear();
};
