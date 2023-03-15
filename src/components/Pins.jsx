import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { NavBar, Feed, PinDetails, CreatePin, Search } from "./";

const Pins = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState(null);

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <NavBar {...{ searchTerm, setSearchTerm, user }} />
      </div>

      <div className="h-full">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/category/:categoryId" element={<Feed />} />
          <Route
            path="/pin-details/:pinId"
            element={<PinDetails user={user} />}
          />
          <Route path="/create-pin" element={<CreatePin user={user} />} />
          <Route
            path="/search"
            element={<Search {...{ searchTerm, setSearchTerm }} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
