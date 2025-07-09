import express from "express";
import cors from "cors";
import dogsRouter from "./routes/dogs_routes";

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

app.use("/api/dogs", dogsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
