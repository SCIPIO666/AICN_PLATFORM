const sessionsService=require('./sessionsService')

 const getAllSessions   = async (req, res, next) => {
   try {
     const filters = { ...req.query }
     const sessions = await sessionsService.getAllSessions(filters)
     res.status(200).json({
        success: true,
        data:sessions})
   } catch (err) { next(err) }
 }
 
 const getSession   = async (req, res, next) => {
   try {
    const id=req.params.id
    const session=await sessionsService.getSession(id)
     res.status(200).json({
        success: true,
        data: session
     })}
   catch (err) { 
    logger.error(`failed to fetch session ${error.message}`)
    next(err)
     }
 }
 
 const createSession  = async (req, res, next) => {
   try { res.status(201).json(await service.create(req.body)) }
   catch (err) { next(err) }
 }
 
 const updateSession  = async (req, res, next) => {
   try { res.json(await service.update(req.params.id, req.body)) }
   catch (err) { next(err) }
 }
 
 const deleteSession   = async (req, res, next) => {
   try { res.json(await service.remove(req.params.id)) }
   catch (err) { next(err) }
 }
 
 module.exports = { getAll, getOne, create, update, remove }
 