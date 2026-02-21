import app from "./api/index.js";
import dotenv from "dotenv";
import { createServer } from "http";
import { connectDB } from "./config/database.js";
import { startTransactionListener } from "./services/transactionListener.js";
import { initializeSocket } from "./config/socket.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB();

const server = createServer(app);
initializeSocket(server);

startTransactionListener();

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
