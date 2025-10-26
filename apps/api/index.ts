import "dotenv/config";
import express from "express";
import v1Router from "./routes/v1";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API is running",
  });
});

app.use("/api/v1", v1Router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
