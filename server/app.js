const express = require('express')
const api = require('./api')

const app = express()
const PORT = 3000

// ===== CORS（必须）=====
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// ===== API =====
app.get('/api/content/week', api.getWeekContent)

// ===== 健康检查 =====
app.get('/api/ping', (req, res) => {
  res.json({ ok: true })
})

app.listen(PORT, () => {
  console.log(`✅ NFC backend running at http://localhost:${PORT}`)
})
