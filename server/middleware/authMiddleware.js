const verifyToken = async (req, res, next) => {
    const token = req.cookies?.auth_token || req.headers.authorization?.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'No token provided' })
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)

        const isBlacklisted = await prisma.blacklistedToken.findUnique({
            where: { token }
        })

        if (isBlacklisted) {
            return res.status(401).json({ error: 'Token has been revoked. Please login again.' })
        }

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