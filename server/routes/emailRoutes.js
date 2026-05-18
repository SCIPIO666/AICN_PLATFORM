const {Router}=express
const emailRouter=Router()
const {verifyToken, requireRole }=require('../middleware/authMiddleware')










module.exports=emailRouter