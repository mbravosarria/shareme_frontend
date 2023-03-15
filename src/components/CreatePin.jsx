import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { client } from "../client";
import Spinner from "./Spinner";
import { categories } from "../utils/data";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff"
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((error) => {
          console.log("Image upload error", error);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if (title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      client.create(doc).then(() => navigate("/"));
    } else {
      setFields(true);

      setTimeout(() => setFields(false), 2000);
    }
  };

  return (
    <div className="mt-5 flex flex-col items-center justify-center lg:h-4/5">
      {fields && (
        <p className="mb-5 text-xl text-red-500 transition-all duration-150 ease-in">
          Please fill in all the fields.
        </p>
      )}
      <div className="flex w-full flex-col items-center justify-center bg-white p-3 lg:w-4/5 lg:flex-row lg:p-5">
        <div className="flex w-full flex-0.7 bg-secondaryColor p-3">
          <div className="flex h-420 w-full flex-col items-center justify-center border-2 border-dotted border-gray-300 p-3">
            {loading && <Spinner />}
            {wrongImageType && <p>Wrong image type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>
                  <p className="mt-32 text-gray-400">
                    Recommendation: use high-quality JPG, SVG, PNG, GIF or TIFF
                    less than 20 MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="h-0 w-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 cursor-pointer rounded-full bg-white p-3 text-xl outline-none transition-all duration-500 ease-in-out hover:shadow-md"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex w-full flex-1 flex-col gap-6 lg:pl-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title here"
            className="border-b-2 border-gray-200 p-2 text-2xl font-bold outline-none sm:text-3xl"
          />
          {user && (
            <div className="my-2 flex items-center gap-2 rounded-lg bg-white">
              <img
                src={user.picture}
                alt="user-profile"
                className="h-10 w-10 rounded-full"
              />
              <p className="font-bold">{user.name}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="What is your pin about?"
            className="border-b-2 border-gray-200 p-2 text-base outline-none sm:text-lg"
          />
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="border-b-2 border-gray-200 p-2 text-base outline-none sm:text-lg"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 text-lg font-semibold sm:text-xl">
                Choose pin category
              </p>
              <select
                className="w-4/5 cursor-pointer rounded-md border-b-2 border-gray-200 p-2 text-base outline-none"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="other" className="bg-white">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.name}
                    value={category.name}
                    className="border-0 bg-white text-base capitalize text-black outline-none"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 flex items-end justify-end">
              <button
                type="button"
                onClick={savePin}
                className="w-28 rounded-full bg-red-500 p-2 font-bold text-white outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
