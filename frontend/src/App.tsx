import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImageFeed from "./components/MediaFeed";
import "./App.css";
import { Link } from "react-router-dom";
import LikedPage from "./components/LikedPage";
import { DogsResponse } from "./types/dog";
import { ROUTES } from "./api/routes";
import MediaFeed from "./components/MediaFeed";
import { getDogs } from "./api/api";
import DetailPage from "./components/DetailPage";

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <Link className="logo" to={ROUTES["/"].route}>
            Dogsterest
          </Link>
          <Link className="liked" to={ROUTES.liked.route}>
            Избранное
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<MediaFeed fetchDogs={getDogs} />} />
          <Route path="/liked" element={<LikedPage />} />
          <Route path="/dog/:filename" element={<DetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
