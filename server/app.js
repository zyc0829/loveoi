const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const app = express()
const PORT = 3000
const ADMIN_TOKEN = 'lovoi-admin'

/* =========================
   路径定义
========================= */
const ROOT = path.join(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'data')
const HISTORY_DIR = path.join(DATA_DIR, 'history')
const CONTENT_FILE = path.join(DATA_DIR, 'content.json')
const AUDIO_DIR = path.join(ROOT, 'audio')
const IMG_DIR = path.join(ROOT, 'img/broadcast')

/* =========================
   初始化目录
========================= */
if (!fs.existsSync(HISTORY_DIR)) fs.mkdirSync(HISTORY_DIR, { recursive: true })
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true })
if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true })

/* =========================
   CORS（一次性解决）
========================= */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS'
  )
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})

/* =========================
   基础中间件
========================= */
app.use(express.json())

/* =========================
   管理员认证
========================= */
function adminAuth(req, res, next) {
  const auth = req.headers.authorization
  if (auth !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

/* =========================
   Multer 上传配置
========================= */
const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.mimetype.startsWith('audio')) {
      cb(null, AUDIO_DIR)
    } else {
      cb(null, IMG_DIR)
    }
  },
  filename(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

/* =========================
   前台接口
========================= */
app.get('/api/content/week', (req, res) => {
  try {
    const raw = fs.readFileSync(CONTENT_FILE, 'utf-8')
    res.json(JSON.parse(raw))
  } catch (e) {
    res.status(500).json({ error: 'content read failed' })
  }
})

/* =========================
   管理员接口
========================= */

// 读取当前内容（管理页默认加载）
app.get('/api/admin/content', adminAuth, (req, res) => {
  try {
    const raw = fs.readFileSync(CONTENT_FILE, 'utf-8')
    const stat = fs.statSync(CONTENT_FILE)
    res.json({
      updatedAt: stat.mtime,
      content: JSON.parse(raw)
    })
  } catch (e) {
    res.status(500).json({ error: 'admin read failed' })
  }
})

// 保存内容（自动备份历史）
app.post('/api/admin/content', adminAuth, (req, res) => {
  try {
    const data = req.body
    const time = new Date().toISOString().replace(/[:.]/g, '-')
    fs.writeFileSync(
      path.join(HISTORY_DIR, `content-${time}.json`),
      JSON.stringify(data, null, 2)
    )
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2))
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'save failed' })
  }
})

// 上传音频 / 海报
app.post(
  '/api/admin/upload',
  adminAuth,
  upload.single('file'),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'no file' })
    }

    if (req.file.mimetype.startsWith('audio')) {
      res.json({ src: `/audio/${req.file.originalname}` })
    } else {
      res.json({ src: `/img/broadcast/${req.file.originalname}` })
    }
  }
)

/* =========================
   启动
========================= */
app.listen(PORT, () => {
  console.log(`✅ NFC server running at http://localhost:${PORT}`)
})
