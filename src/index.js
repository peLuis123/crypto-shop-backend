import app from "./api/index.js";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
