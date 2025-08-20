import express from 'express'; 
import cors from 'cors';
import { ENV } from "./src/config/env.js";
import authRoutes from "./src/routes/auth.routes.js";
import catalogRoutes from "./src/routes/catalog.routes.js";
import studentsRoutes from "./src/routes/students.routes.js";
import tutorRoutes from "./src/routes/tutors.routes.js";
import paymentsRoutes from "./src/routes/payments.routes.js"; 
import tutorshipRoutes from "./src/routes/tutorships.routes.js";
import chatRoutes from "./src/routes/chats.routes.js";
import reportRoutes from "./src/routes/reports.routes.js";
import systemRoutes from "./src/routes/system.routes.js";

const PORT = Number(process.env.PORT) || 8080; 
const app = express();

app.get("/", (_req, res) => res.status(200).send("OK")); 
app.get("/api/health", (_req, res) =>
  res.status(200).json({ ok: true, uptime: process.uptime() })
);

app.use(cors());
app.use(express.json());


app.use("/api", authRoutes);
app.use("/api", catalogRoutes);
app.use("/api", studentsRoutes);
app.use("/api", tutorRoutes);
app.use("/api", paymentsRoutes);
app.use("/api", tutorshipRoutes);
app.use("/api", chatRoutes);
app.use("/api", reportRoutes);
app.use("/api", systemRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on :${PORT}`);
});

process.on("SIGTERM", () => {
  console.log("[SIGTERM] Shutting down gracefully");
  server?.close(() => process.exit(0));
});
process.on("SIGINT", () => {
  console.log("[SIGINT] Shutting down");
  server?.close(() => process.exit(0));
});