const prisma= require('../../../config/db')
const logger=require('../../../utils/logger')
// enum SessionStatus {
//   SCHEDULED
//   IN_PROGRESS
//   COMPLETED
//   CANCELLED
// }
// model Session {
//   id           String        @id @default(cuid())
//   title        String
//   skillArea    String
//   description  String?
//   date         DateTime
//   durationMins Int           @default(120)
//   locationType LocationType  @default(PHYSICAL)
//   venue        String? // physical address or online  links
//   county       String?
//   capacity     Int           @default(30)
//   status       SessionStatus @default(SCHEDULED)
//   trainerId    String?
//   trainer      User?         @relation("TrainerSessions", fields: [trainerId], references: [id])
//   createdAt    DateTime      @default(now())
//   updatedAt    DateTime      @updatedAt

//   // Relations
//   enrolments   Enrolment[]
//   certificates Certificate[]
// }
// enum LocationType {
//   PHYSICAL
//   ONLINE
// }


async function createSession(data){
    try {
        const newSession=await prisma.session.create({data})
        return newSession
    } catch (error) {
        logger.error(`failed to create session: ${error.message}`)
        throw error
    }
}

async function getSession(id){
try {
    const session = await prisma.session.findUnique({
    where: { id },
    include: {
      trainer:    { select: { name: true, email: true } },
      enrolments: { include: { user: { select: { id: true, name: true, email: true } } } },
      _count:     { select: { enrolments: true } }
    }
  })
  if (!session) throw new Error('Session not found')
  return session
} catch (error) {
    logger.error(`failed to get a session : ${error.message}`)
    throw error
}
}


async function getAllSessions(filters={}){
     try {
        const { title,skillArea, page = 1, limit = 10 } = filters
        const skip = (page - 1) * limit
        
        const where = {}//filters,adding only selected search criteria
        if (title) where.title = title
        if (skillArea) where.skillArea = skillArea
        
        const sessions = await prisma.session.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        })
        
        const total = await prisma.session.count({ where })
        
        return {
            sessions,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    } catch (error) {
        logger.error(`failed finding all sessions: ${error.message}`)
        throw error
    }
}

async function updateSession(id, data){
    try {
    return await prisma.session.update({ where: { id }, data })
    } catch (error) {
        logger.error(`failed to update session: ${error.message}`)
        throw error
    }
 
}


async function deleteSession(id){
    try {
        const existingSession = await prisma.session.findUnique({
            where: {id},
        })
        
        if (!existingSession) {
            throw new Error(`session with id ${id} not found`)
        }
        
        const deletedSession = await prisma.session.delete({
            where: { id },
        })     
        return deletedSession   
    } catch (error) {
        logger.error(error.message)
        throw error
    }
      
}


module.exports = {
    createSession,
    getSession,
    getAllSessions,
    updateSession,
    deleteSession

 }