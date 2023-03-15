import jwt_decode from "jwt-decode";

export const fetchUser = () => {
  return localStorage.getItem("user") !== undefined
    ? jwt_decode(localStorage.getItem("user"))
    : localStorage.clear();
};
