const fs = require('fs')
const path = require('path')

const dataDir = path.join(__dirname, './data')
const historyDir = path.join(dataDir, 'history')
const contentFile = path.join(dataDir, 'content.json')

if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir)

function saveContent(req, res) {
  const data = req.body

  try {
    const now = new Date().toISOString().replace(/[:.]/g, '-')
    fs.copyFileSync(
      contentFile,
      path.join(historyDir, `content-${now}.json`)
    )

    fs.writeFileSync(contentFile, JSON.stringify(data, null, 2))
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'save failed' })
  }
}

function getAdminContent(req, res) {
  try {
    const stat = fs.statSync(contentFile)
    const updatedAt = stat.mtime.toISOString().replace('T', ' ').slice(0, 16)
    const content = JSON.parse(fs.readFileSync(contentFile, 'utf-8'))

    res.json({ content, updatedAt })
  } catch (e) {
    res.status(500).json({ error: 'read failed' })
  }
}

module.exports = { saveContent }
