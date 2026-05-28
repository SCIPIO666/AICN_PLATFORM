enum Role {
  LEARNER
  TRAINER
  ADMIN
}


enum EnrolmentStatus {
  ENROLLED
  ATTENDED
  ABSENT
  CANCELLED
}

enum TrainerStatus {
  PENDING
  APPROVED
  REJECTED
}

// ─── MODELS ──────────────────────────────────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  phone     String?
  county    String?
  role      Role     @default(LEARNER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  enrolments      Enrolment[]
  certificates    Certificate[]
  trainerProfile  TrainerProfile?
  trainedSessions Session[]       @relation("TrainerSessions")
}



model Enrolment {
  id        String          @id @default(cuid())
  userId    String
  sessionId String
  status    EnrolmentStatus @default(ENROLLED)
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  user    User    @relation(fields: [userId], references: [id])
  session Session @relation(fields: [sessionId], references: [id])

  @@unique([userId, sessionId]) // one enrolment per user per session
}

model Certificate {
  id        String   @id @default(cuid())
  userId    String
  sessionId String
  certCode  String   @unique @default(cuid())
  issuedAt  DateTime @default(now())

  user    User    @relation(fields: [userId], references: [id])
  session Session @relation(fields: [sessionId], references: [id])

  @@unique([userId, sessionId]) // one cert per user per session
}

model TrainerProfile {
  id           String        @id @default(cuid())
  userId       String        @unique
  bio          String?
  skills       String[] // array of skill area strings
  availability String? // "weekends" | "weekdays" | "online-only"
  motivation   String?
  status       TrainerStatus @default(PENDING)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  user User @relation(fields: [userId], references: [id])
}

model Announcement {
  id        String   @id @default(cuid())
  title     String
  body      String
  audience  String   @default("all") // "all" | "learners" | "trainers"
  createdAt DateTime @default(now())
}
