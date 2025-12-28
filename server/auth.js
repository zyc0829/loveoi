const ADMIN_TOKEN = 'loveoi-admin' // ⚠️ 自己改一个复杂点的

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token']

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: '未授权' })
  }

  next()
}

module.exports = adminAuth
