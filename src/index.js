import app from "./api/index.js";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import { startTransactionListener } from "./services/transactionListener.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

startTransactionListener();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
