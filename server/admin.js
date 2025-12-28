const fs = require('fs')
const path = require('path')

const dataFile = path.join(__dirname, './data/content.json')

function updateContent(req, res) {
  try {
    const newContent = req.body

    fs.writeFileSync(
      dataFile,
      JSON.stringify(newContent, null, 2),
      'utf-8'
    )

    res.json({ success: true })
  } catch (err) {
    console.error('❌ 更新 content.json 失败', err)
    res.status(500).json({ error: '写入失败' })
  }
}

module.exports = { updateContent }
