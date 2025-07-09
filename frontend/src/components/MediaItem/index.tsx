import React from "react";
import { Link } from "react-router-dom";
import { Dog } from "../../types/dog";
import { toggleLike } from "../../api/api";

interface MediaItemProps {
  dog: Dog;
  userLikes: Record<string, boolean>;
  setUserLikes: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  updateLikes: (id: string, newLikes: number) => void;
  isDetailPage?: boolean;
}

const MediaItem = ({
  dog,
  userLikes,
  setUserLikes,
  updateLikes,
  isDetailPage = false,
}: MediaItemProps) => {
  const handleLike = async (id: string) => {
    const isLiked = userLikes[id];
    const newLikes = await toggleLike(id, isLiked);
    updateLikes(id, isLiked ? newLikes : Math.max(newLikes, 1));
    setUserLikes((prev) => ({ ...prev, [id]: !isLiked }));
  };

  return (
    <div className={isDetailPage ? "detail-page" : "media-item"}>
      {isDetailPage ? (
        dog.fileType === "image" ? (
          <img src={dog.url} alt={dog.filename} className="media" />
        ) : (
          <video src={dog.url} controls className="media" />
        )
      ) : (
        <Link to={`/dog/${dog.filename}`}>
          {dog.fileType === "image" ? (
            <img src={dog.url} alt={dog.filename} className="media" />
          ) : (
            <video src={dog.url} controls className="media" />
          )}
        </Link>
      )}
      <div className="likes-overlay">
        <button
          onClick={() => handleLike(dog.id)}
          className={`like-button ${userLikes[dog.id] ? "liked" : ""}`}
        >
          {userLikes[dog.id] ? "❤️" : "🤍"}
        </button>
        {(dog.likes > 0 || userLikes[dog.id]) && (
          <span className="likes-count">
            {userLikes[dog.id] ? Math.max(dog.likes, 1) : dog.likes}
          </span>
        )}
      </div>
    </div>
  );
};

export default MediaItem;
