import express, { application } from "express";
import axios from "axios";
import { createClient } from "redis";

const app = express();
const PORT = process.env.PORT || 3000;
const client = createClient();

client.connect();

app.get("/", (_, res) => {
  res.status(200).send("Hello");
});

app.get("/posts", async (_, res) => {
  try {
    const productsCached = await client.get("products");
    if (!productsCached) {
      const { data } = await axios.get("https://dummyjson.com/products/1");
      client.setEx("products", 60, JSON.stringify(data));
      return res.json(data);
    }
    res.json(JSON.parse(productsCached));
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
