import express from "express";

const app = express();

app.use(express.static("./"));

let cache = {
  btc: "--",
  gold: "--",
  time: 0
};

// 缓存 60 秒
const CACHE_TTL = 60 * 1000;

app.get("/api/price", async (req, res) => {
  const now = Date.now();

  if (now - cache.time < CACHE_TTL) {
    return res.json(cache);
  }

  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd"
    );

    const data = await r.json();

    cache = {
      btc: data.bitcoin.usd,
      gold: data["tether-gold"].usd,
      time: now
    };

    res.json(cache);

  } catch (e) {
    res.json(cache); // 出错返回旧数据
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("running on " + PORT);
});