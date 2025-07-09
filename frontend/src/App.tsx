import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ImageFeed from "./components/ImageFeed";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Dogsterest</h1>
        </header>
        <Routes>
          <Route path="/" element={<ImageFeed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
