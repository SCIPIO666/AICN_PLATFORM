const prisma= require('../../../config/db')

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




async function getSession(){

}

async function getManySessions(){
    
}
async function getAll(){
    
}

async function updateSession(){

}
async function deleteSession(){

}


module.exports = { getAll, getOne, create, update, remove }