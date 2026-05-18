const verifyToken = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  const token = header.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    req.userId   = payload.userId
    req.userRole = payload.role
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.userRole)) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}

module.exports = { verifyToken, requireRole }