const {Router}=express
const authRouter=Router()
const {verifyToken, requireRole }=require('../middleware/authMiddleware')










module.exports=authRouter