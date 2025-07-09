import MediaFeed from "../MediaFeed";
import { getLikedDogs } from "../../api/api";
const LikedPage = () => (
  <div>
    <h4>Вам понравилось</h4>
    <MediaFeed fetchDogs={getLikedDogs} />
  </div>
);

export default LikedPage;
