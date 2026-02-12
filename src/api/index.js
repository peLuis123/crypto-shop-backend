import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import walletRoutes from "./wallets/index.js";
import authRoutes from "./auth/index.js";
import productRoutes from "./products/index.js";

const app = express();

// Seguridad - Middlewares
app.use(helmet()); // Establece headers de seguridad
app.use(hpp()); // Protege contra HTTP Parameter Pollution

// Rate limiting general
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana
  message: "Too many requests, please try again later"
});
app.use(limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/products", productRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});
export default app;