import express from "express";
import helmet from "helmet";
import api from "./api";

export interface MessageResponse {
  message: string;
}

const app = express();

app.use(helmet());
app.use(express.json());

app.get<{}, MessageResponse>("/", (req, res) => {
  const { nums } = req.body;

  if (!Array.isArray(nums)) {
    console.log("Not an array");
    res.status(400).json({
      message: "Not an array",
    });
  }
  if (nums.length === 9) {
    res.status(400).json({
      message: "Game Over",
    });
  }

  let n;
  do {
    n = Math.floor(Math.random() * 9);
  } while (nums.includes(n));
  return res.status(200).json({
    message: n.toString(),
  });
});

app.use("/api", api);

export default app;
