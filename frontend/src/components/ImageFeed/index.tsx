import React, { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { getDogs, likeDog, unlikeDog } from "../../api/api";
import { Dog } from "../../types/dog";
import "./styles.css";

const ImageFeed: React.FC = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem("userLikes");
    return saved ? JSON.parse(saved) : {};
  });

  const loadMoreDogs = async () => {
    try {
      const newDogs = await getDogs(page, 20);
      if (newDogs.length === 0) {
        setHasMore(false);
        return;
      }
      setDogs((prev) => [...prev, ...newDogs]);
      setPage((prev) => prev + 1);
    } catch (err) {
      setError("Не удалось загрузить данные");
    }
  };

  useEffect(() => {
    loadMoreDogs().then(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem("userLikes", JSON.stringify(userLikes));
  }, [userLikes]);

  const handleLike = async (id: string) => {
    try {
      const newLikes = userLikes[id] ? await unlikeDog(id) : await likeDog(id);
      setDogs((prev) =>
        prev.map((dog) => (dog.id === id ? { ...dog, likes: newLikes } : dog))
      );
      setUserLikes((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (err) {
      console.error("Не удалось обновить лайк");
    }
  };

  const breakpointColumnsObj = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1,
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="image-feed">
      <InfiniteScroll
        dataLength={dogs.length}
        next={loadMoreDogs}
        hasMore={hasMore}
        loader={<h4>Загрузка...</h4>}
        endMessage={<p>Все медиа загружены</p>}
      >
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {dogs.map((dog) => (
            <div className="media-item">
              {dog.fileType === "image" ? (
                <img
                  src={dog.url}
                  alt={`Dog ${dog.id}`}
                  loading="lazy"
                  className="media"
                />
              ) : (
                <video src={dog.url} controls className="media" />
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
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
};

export default ImageFeed;
