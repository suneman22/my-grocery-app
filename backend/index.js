import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/", (req, res) => {
  res.send("Grocery API running!");
});

app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
