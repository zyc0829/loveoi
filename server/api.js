const fs = require('fs')
const path = require('path')

// ⚠️ data 在 server 里面
const dataFile = path.join(__dirname, './data/content.json')

function getWeekContent(req, res) {
  try {
    const raw = fs.readFileSync(dataFile, 'utf-8')
    const json = JSON.parse(raw)
    res.json(json)
  } catch (err) {
    console.error('❌ content.json 读取失败：', err)
    res.status(500).json({
      error: 'content.json 读取失败'
    })
  }
}

module.exports = {
  getWeekContent
}
