import express from "express";
import cors from "cors";
import priceRoutes from "./routes/priceRoutes.ts";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/price", priceRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
