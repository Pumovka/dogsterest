import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";
import InfiniteScroll from "react-infinite-scroll-component";
import { Dog, DogsResponse } from "../../types/dog";
import "./styles.css";
import MediaItem from "../MediaItem";

interface MediaFeedProps {
  fetchDogs: (page: number, perPage: number) => Promise<DogsResponse>;
}

const MediaFeed = ({ fetchDogs }: MediaFeedProps) => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [userLikes, setUserLikes] = useState(() =>
    JSON.parse(localStorage.getItem("userLikes") || "{}")
  );

  const loadMore = async () => {
    if (!hasMore) return;
    const newDogs = await fetchDogs(page, 20);
    if (newDogs.length > 0) {
      setDogs((prev) => {
        const existingIds = new Set(prev.map((dog) => dog.id));
        const uniqueNewDogs = newDogs.filter((dog) => !existingIds.has(dog.id));
        return [...prev, ...uniqueNewDogs];
      });
      setPage(page + 1);
      setHasMore(newDogs.length === 20);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    if (dogs.length === 0) loadMore();
  }, []);

  useEffect(() => {
    localStorage.setItem("userLikes", JSON.stringify(userLikes));
  }, [userLikes]);

  const updateLikes = (id: string, newLikes: number) => {
    setDogs((prev) =>
      prev.map((dog) => (dog.id === id ? { ...dog, likes: newLikes } : dog))
    );
  };

  if (!dogs.length && !hasMore) return <div>Нет медиа</div>;

  return (
    <InfiniteScroll
      dataLength={dogs.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<h4>Загрузка...</h4>}
    >
      <Masonry
        breakpointCols={{ default: 4, 1100: 3, 700: 2, 500: 1 }}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
      >
        {dogs.map((dog) => (
          <MediaItem
            key={dog.id}
            dog={dog}
            userLikes={userLikes}
            setUserLikes={setUserLikes}
            updateLikes={updateLikes}
          />
        ))}
      </Masonry>
    </InfiniteScroll>
  );
};

export default MediaFeed;
