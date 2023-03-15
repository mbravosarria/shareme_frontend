import React from "react";
import { Circles } from "react-loader-spinner";

const Spinner = ({ message }) => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Circles color="#00BFFF" wrapperClass="m-5" />
      <p className="px-2 text-center text-lg">{message}</p>
    </div>
  );
};

export default Spinner;
