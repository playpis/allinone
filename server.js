import express from "express";

const app = express();

// 把当前目录当静态目录
app.use(express.static("./"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});