const {Router}=express
const userRouter=Router()
const {verifyToken, requireRole }=require('../middleware/authMiddleware')










module.exports=userRouter
