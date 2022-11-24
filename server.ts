import express from "express";
import axios from "axios";
import { createClient } from "redis";

const app = express();
const PORT = process.env.PORT || 3000;
const redis = createClient();

app.get("/", (_, res) => {
  res.status(200).send("Hello");
});

app.get("/posts", async (req, res) => {
  try {
    if (req.body == undefined) throw Error("DEU RUIM");

    const productsCached = await redis.get("products");
    if (productsCached) return res.json(JSON.parse(productsCached));

    const { data } = await axios.get("https://dummyjson.com/products/1");

    await redis.setEx("products", 60, JSON.stringify(data));

    res.json(data);
  } catch (error: any) {
    console.error({
      error: {
        error_message: error.message,
        error_stack: error.stack.split("\n"),
        error_name: error.name,
      },
      request: { request_ip: req.ip, request_url: req.url, request_body: req.body, req },
    });
  }
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
});
