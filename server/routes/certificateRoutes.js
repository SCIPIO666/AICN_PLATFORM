const {Router}=express
const certificateRouter=Router()
const {verifyToken, requireRole }=require('../middleware/authMiddleware')










module.exports=certificateRouter