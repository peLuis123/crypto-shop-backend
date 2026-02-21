import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../config/swagger.js";
import walletRoutes from "./wallets/index.js";
import authRoutes from "./auth/index.js";
import userRoutes from "./users/index.js";
import productRoutes from "./products/index.js";
import orderRoutes from "./orders/index.js";
import transactionRoutes from "./transactions/index.js";
import sessionRoutes from "./sessions/index.js";
import securityRoutes from "./security/index.js";

const app = express();

app.use(helmet());
app.use(hpp());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later"
});
if (process.env.NODE_ENV !== "development") {
  app.use(limiter);
}

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/security", securityRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    persistAuthorization: true,
    url: "/api/docs/swagger.json"
  }
}));

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});
export default app;