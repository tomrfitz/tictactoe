import express from "express";

const router = express.Router();

interface MessageResponse {
  message: string;
}

router.get<{}, MessageResponse>("/", (_req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

export default router;
