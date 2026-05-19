const sessionModel=require('./sessionsModel')

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

        const newSession=await sessionModel.createSession(data)
        return newSession
   
}

async function getSession(id){

    const session = await sessionModel.getSession(id) 
    return session
}


async function getAllSessions(filters={}){
    
        
        const sessionsData = await sessionModel.getAllSessions(filters)
           
        return sessionsData
}

async function updateSession(id, data){
   const updatedSession=await sessionModel.updateSession(id,data)
  
    return updateSession
 
}


async function deleteSession(id){
   
        const deletedSession = await sessionModel.deleteSession(id)
     
        return deletedSession   
   
}


module.exports = {
    createSession,
    getSession,
    getAllSessions,
    updateSession,
    deleteSession

 }