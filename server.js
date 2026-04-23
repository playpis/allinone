import express from "express";

const app = express();
app.use(express.static("./"));

let cache = {
  btc: "--",
  btc_24h: 0,
  gold: "--",
  gold_24h: 0,
  time: 0
};

const CACHE_TTL = 60 * 1000;

app.get("/api/price", async (req, res) => {
  const now = Date.now();

  if (now - cache.time < CACHE_TTL) {
    return res.json(cache);
  }

  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,tether-gold&vs_currencies=usd&include_24hr_change=true"
    );

    const data = await r.json();

    cache = {
      btc: data.bitcoin.usd,
      btc_24h: data.bitcoin.usd_24h_change?.toFixed(2) ?? 0,

      gold: data["tether-gold"].usd,
      gold_24h: data["tether-gold"].usd_24h_change?.toFixed(2) ?? 0,

      time: now
    };

    res.json(cache);

  } catch (e) {
    res.json(cache);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("running on " + PORT);
});