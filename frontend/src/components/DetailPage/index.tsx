import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getDogByFilename } from "../../api/api";
import { Dog } from "../../types/dog";
import "./styles.css";

const DetailPage = () => {
  const { filename } = useParams<{ filename: string }>();
  const [dog, setDog] = useState<Dog | null>(null);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>(() =>
    JSON.parse(localStorage.getItem("userLikes") || "{}")
  );

  useEffect(() => {
    if (filename) getDogByFilename(filename).then(setDog);
  }, [filename]);

  useEffect(() => {
    localStorage.setItem("userLikes", JSON.stringify(userLikes));
  }, [userLikes]);

  const handleLike = async (id: string) => {
    const isLiked = userLikes[id];
    const { data } = await axios[isLiked ? "delete" : "post"](
      `http://localhost:3005/api/dogs/${id}/like`
    );
    setDog((prev) => (prev ? { ...prev, likes: data.likes } : prev));
    setUserLikes((prev) => ({ ...prev, [id]: !isLiked }));
  };

  if (!dog) return <div>Медиа не найдено</div>;

  return (
    <div className="detail-page">
      {dog.fileType === "image" ? (
        <img src={dog.url} alt={dog.filename} className="media" />
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
          <span className="likes-count">{dog.likes}</span>
        )}
      </div>
    </div>
  );
};

export default DetailPage;
