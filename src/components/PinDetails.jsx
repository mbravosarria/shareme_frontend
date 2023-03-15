import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import Spinner from "./Spinner";

const PinDetails = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const { pinId } = useParams();

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
          window.location.reload();
        });
    }
  };

  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(query).then((data) => {
        setPinDetails(data[0]);

        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);

          client.fetch(query).then((res) => setPins(res));
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails(pinId);
  }, [pinId]);

  if (!pinDetails) return <Spinner message={"Loading Pin..."} />;

  return (
    <>
      <div
        className="m-auto flex flex-col bg-white xl:flex-row"
        style={{ maxWith: "1500px", borderRadius: "32px" }}
      >
        <div className="mt-2 flex flex-initial items-center justify-center md:items-start xl:w-1/4">
          <img
            src={pinDetails?.image && urlFor(pinDetails.image).url()}
            alt="user-post"
            className="mx-4 w-full rounded-t-3xl rounded-b-lg"
          />
        </div>
        <div className="w-full flex-1 p-5 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <a
                href={`${pinDetails.image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl text-black opacity-75 outline-none hover:opacity-100 hover:shadow-md"
              >
                <MdDownloadForOffline />
              </a>
            </div>
            <a href={pinDetails.destination} target="_blank" rel="noreferrer">
              {pinDetails.destination}
            </a>
          </div>
          <div>
            <h1 className="mt-3 break-words text-4xl font-bold">
              {pinDetails.title}
            </h1>
            <p className="mt-3">{pinDetails.about}</p>
            <Link
              to={`user-profile/${pinDetails.postedBy?._id}`}
              className="mt-5 flex items-center gap-2 rounded-lg bg-white"
            >
              <img
                src={pinDetails.postedBy?.picture}
                alt="user-profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <p className="font-semibold capitalize">
                {pinDetails.postedBy?.name}
              </p>
            </Link>
            <h2 className="mt-5 text-2xl">Comments</h2>
            <div className="max-h-370 overflow-y-auto">
              {pinDetails?.comments?.map((comment, i) => (
                <div
                  key={i}
                  className="mt-5 flex items-center gap-2 rounded-lg bg-white"
                >
                  <img
                    src={comment.postedBy?.picture}
                    alt="user-profile"
                    className="h-10 w-10 cursor-pointer rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{comment.postedBy.name}</p>
                    <p>{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-row gap-3">
              <Link to={`user-profile/${pinDetails.postedBy?._id}`}>
                <img
                  src={pinDetails.postedBy?.picture}
                  alt="user-profile"
                  className="h-10 w-10 cursor-pointer rounded-full"
                />
              </Link>
              <input
                type="text"
                className="flex-1 rounded-2xl border-2 border-gray-100 p-2 outline-none focus:border-gray-300"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                className="rounded-full bg-red-500 py-2 px-6 text-base font-semibold text-white outline-none"
                onClick={addComment}
              >
                {addingComment ? "Posting the comment..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {pins?.length > 0 ? (
        <>
          <h2 className="mt-8 mb-4 text-center text-2xl font-bold">
            More like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message={"Loading more pins..."} />
      )}
    </>
  );
};

export default PinDetails;
