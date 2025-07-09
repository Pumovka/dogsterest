import MediaFeed from "../MediaFeed";
import { getLikedDogs } from "../../api/api";
const LikedPage = () => (
  <div>
    <h1>Избранное</h1>
    <MediaFeed fetchDogs={getLikedDogs} />
  </div>
);

export default LikedPage;
