const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();

// ====== 配置 ======
const ADMIN_PATH = "/oi-admin-8f3c2a";
const CONFIG_PATH = path.join(__dirname, "../web/config.js");

// ====== 中间件 ======
app.use(bodyParser.urlencoded({ extended: false }));

// ====== 后台页面 ======
app.get(ADMIN_PATH, (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>NFC 后台</title>
<style>
body { font-family: sans-serif; padding: 16px; }
label { display:block; margin-top:12px; }
input, select, button {
  width:100%; padding:10px; margin-top:6px;
}
button { margin-top:20px; }
</style>
</head>
<body>

<h2>NFC 本周内容配置</h2>

<form method="POST" action="${ADMIN_PATH}/save">
  <label>
    类型
    <select name="type" id="type" onchange="toggle()">
      <option value="netease">歌曲（网易云）</option>
      <option value="audio">音频</option>
      <option value="broadcast">广播剧</option>
    </select>
  </label>

  <div id="netease">
    <label>歌曲 ID <input name="songId"></label>
    <label>标题 <input name="title"></label>
  </div>

  <div id="audio" style="display:none">
    <label>音频地址 <input name="src"></label>
    <label>标题 <input name="title_audio"></label>
  </div>

  <div id="broadcast" style="display:none">
    <label>广播剧链接 <input name="src_broadcast"></label>
    <label>标题 <input name="title_broadcast"></label>
  </div>

  <button type="submit">保存</button>
</form>

<script>
function toggle() {
  const t = document.getElementById("type").value;
  document.getElementById("netease").style.display = t==="netease"?"block":"none";
  document.getElementById("audio").style.display = t==="audio"?"block":"none";
  document.getElementById("broadcast").style.display = t==="broadcast"?"block":"none";
}
</script>

</body>
</html>
`);
});

// ====== 保存逻辑 ======
app.post(ADMIN_PATH + "/save", (req, res) => {
  let config = "";

  if (req.body.type === "netease") {
    config = `window.NFC_CONFIG = {
  type: "netease",
  songId: "${req.body.songId || ""}",
  title: "${req.body.title || ""}"
};`;
  }

  if (req.body.type === "audio") {
    config = `window.NFC_CONFIG = {
  type: "audio",
  src: "${req.body.src || ""}",
  title: "${req.body.title_audio || ""}"
};`;
  }

  if (req.body.type === "broadcast") {
    config = `window.NFC_CONFIG = {
  type: "broadcast",
  src: "${req.body.src_broadcast || ""}",
  title: "${req.body.title_broadcast || ""}"
};`;
  }

  fs.writeFileSync(CONFIG_PATH, config, "utf8");

  res.send("保存成功，可以关闭页面");
});

// ====== 启动 ======
app.listen(3000, () => {
  console.log("Admin running on http://localhost:3000" + ADMIN_PATH);
});
