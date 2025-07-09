import React from "react";
import { Link } from "react-router-dom";
import { Dog } from "../../types/dog";
import { toggleLike } from "../../api/api";
import "./styles.css";

interface MediaItemProps {
  dog: Dog;
  userLikes: Record<string, boolean>;
  setUserLikes: (likes: Record<string, boolean>) => void;
  updateLikes: (id: string, likes: number) => void;
}

const MediaItem = ({
  dog,
  userLikes,
  setUserLikes,
  updateLikes,
}: MediaItemProps) => {
  const onLikeClick = async () => {
    const isLiked = userLikes[dog.id] || false;
    try {
      const newLikes = await toggleLike(dog.id, isLiked);
      setUserLikes({ ...userLikes, [dog.id]: !isLiked });
      updateLikes(dog.id, newLikes);
    } catch (error) {
      console.error("Ошибка с лайком:", error);
    }
  };

  return (
    <div className="media-item">
      <Link to={`/dog/${dog.filename}`}>
        {dog.fileType === "image" ? (
          <img src={dog.url} alt={dog.filename} className="media" />
        ) : (
          <video src={dog.url} controls className="media" />
        )}
      </Link>

      <div className="likes-overlay">
        <button onClick={onLikeClick} className={"like-button"}>
          {userLikes[dog.id] ? "❤️" : "🤍"}
        </button>
        {dog.likes > 0 && <span className="likes-count">{dog.likes}</span>}
      </div>
    </div>
  );
};

export default MediaItem;
