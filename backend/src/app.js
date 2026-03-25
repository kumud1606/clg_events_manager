import cors from "cors";
import express from "express";
import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "college-clubs-backend" });
});

app.use("/api", routes);

app.use((error, _request, response, _next) => {
  const status = error.status || 500;
  response.status(status).json({
    message: error.message || "Something went wrong."
  });
});

export default app;
