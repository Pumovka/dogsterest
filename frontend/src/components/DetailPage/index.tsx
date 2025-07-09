import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDogByFilename, toggleLike } from "../../api/api";
import { Dog } from "../../types/dog";
import MediaItem from "../MediaItem";
import "./styles.css";

const DetailPage = () => {
  const { filename } = useParams<{ filename: string }>();
  const [dog, setDog] = useState<Dog | null>(null);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() =>
    JSON.parse(localStorage.getItem("userLikes") || "{}")
  );

  useEffect(() => {
    if (filename) {
      getDogByFilename(filename).then(setDog);
    }
  }, [filename]);

  useEffect(() => {
    localStorage.setItem("userLikes", JSON.stringify(userLikes));
  }, [userLikes]);

  const updateLikes = (id: string, newLikes: number) => {
    setDog((prev) => (prev ? { ...prev, likes: newLikes } : prev));
  };

  if (!dog) return <div>Медиа не найдено</div>;

  return (
    <div className="detail-page">
      <MediaItem
        dog={dog}
        userLikes={userLikes}
        setUserLikes={setUserLikes}
        updateLikes={updateLikes}
      />
    </div>
  );
};

export default DetailPage;
