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
import reportRoutes from "./src/routes/reports.routes.js"

const PORT = ENV.PORT;
const app = express();

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

app.use((err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
