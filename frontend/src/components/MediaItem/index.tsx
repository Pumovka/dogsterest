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
    const isLiked = userLikes[dog.id];
    try {
      const newLikes = await toggleLike(dog.id, isLiked);
      setUserLikes({ ...userLikes, [dog.id]: !isLiked });
      updateLikes(dog.id, newLikes);
    } catch (error) {
      console.error("Ошибка при обработке лайка:", error);
    }
  };

  const displayLikes = userLikes[dog.id] ? dog.likes + 1 : dog.likes;

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
        {displayLikes > 0 && (
          <span className="likes-count">{displayLikes}</span>
        )}
      </div>
    </div>
  );
};

export default MediaItem;
