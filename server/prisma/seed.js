// Run: node prisma/seed.js

const bcrypt = require('bcryptjs')
const { prisma } = require('../config/db')
const logger = require('../utils/logger')

// ========== Helpers ==================
const hash = (pw) => bcrypt.hash(pw, 12)

const future = (daysFromNow, hour = 9) => {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  d.setHours(hour, 0, 0, 0)
  return d
}

const past = (daysAgo, hour = 9) => {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  d.setHours(hour, 0, 0, 0)
  return d
}

// Generate unique certificate code
const generateCertCode = (userId, sessionId) => {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `CERT-${userId.substring(0, 4)}-${sessionId.substring(0, 4)}-${random}`
}

// ========== Main seeder function ===================

async function main() {
  logger.info('🌱 Seeding AICN database...\n')

  // Clear existing data
  await prisma.announcement.deleteMany()
  await prisma.certificate.deleteMany()
  await prisma.enrolment.deleteMany()
  await prisma.trainerProfile.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  logger.info('🗑  Cleared existing data')

  // ============ Password hashes ===================================

  const [
    adminPw,
    trainerPw,
    learnerPw,
    pendingPw,
    superLearnerPw,
    superTrainerPw,
  ] = await Promise.all([
    hash('admin123'),
    hash('trainer123'),
    hash('learner123'),
    hash('pending123'),
    hash('Test123!@#'),   // super dev learner
    hash('Test123!@#'),   // super dev trainer
  ])

  // ============ Users ===================================

  // --- Admin ---
  const admin = await prisma.user.create({
    data: {
      name:     'Calvince Wise',
      email:    'calvince@africaictcsnetwork.org',
      password: adminPw,
      phone:    '+254799112919',
      county:   'Nairobi',
      role:     'ADMIN',
    }
  })

  // --- Super Dev Trainer (full-featured, use this to test trainer UI) ---
  const superTrainer = await prisma.user.create({
    data: {
      name:     'Trainer User',
      email:    'trainer@aicn.africa',
      password: superTrainerPw,
      phone:    '+254722222222',
      county:   'Mombasa',
      role:     'TRAINER',
    }
  })

  // --- Regular mock trainers ---
  const trainer1 = await prisma.user.create({
    data: {
      name:     'Amara Osei',
      email:    'amara.osei@aicn.org',
      password: trainerPw,
      phone:    '+254712345678',
      county:   'Nairobi',
      role:     'TRAINER',
    }
  })

  const trainer2 = await prisma.user.create({
    data: {
      name:     'Fatuma Njeri',
      email:    'fatuma.njeri@aicn.org',
      password: trainerPw,
      phone:    '+254723456789',
      county:   'Kisumu',
      role:     'TRAINER',
    }
  })

  const trainer3 = await prisma.user.create({
    data: {
      name:     'Brian Otieno',
      email:    'brian.otieno@aicn.org',
      password: trainerPw,
      phone:    '+254734567890',
      county:   'Nakuru',
      role:     'TRAINER',
    }
  })

  // --- Super Dev Learner (full-featured, use this to test learner UI) ---
  const superLearner = await prisma.user.create({
    data: {
      name:     'Learner User',
      email:    'learner@aicn.africa',
      password: superLearnerPw,
      phone:    '+254733333333',
      county:   'Nairobi',
      role:     'LEARNER',
    }
  })

  // --- Regular mock learners ---
  const learner1 = await prisma.user.create({
    data: {
      name:     'Dev Scipio',
      email:    'dev@example.com',
      password: learnerPw,
      phone:    '+254700000001',
      county:   'Nairobi',
      role:     'LEARNER',
    }
  })

  const learner2 = await prisma.user.create({
    data: {
      name:     'Akinyi Moraa',
      email:    'akinyi@example.com',
      password: learnerPw,
      phone:    '+254700000002',
      county:   'Kisumu',
      role:     'LEARNER',
    }
  })

  const learner3 = await prisma.user.create({
    data: {
      name:     'Juma Baraka',
      email:    'juma@example.com',
      password: learnerPw,
      phone:    '+254700000003',
      county:   'Mombasa',
      role:     'LEARNER',
    }
  })

  const learner4 = await prisma.user.create({
    data: {
      name:     'Wanjiku Mwangi',
      email:    'wanjiku@example.com',
      password: learnerPw,
      phone:    '+254700000004',
      county:   'Nakuru',
      role:     'LEARNER',
    }
  })

  const learner5 = await prisma.user.create({
    data: {
      name:     'Emmanuel Kipchoge',
      email:    'emmanuel@example.com',
      password: learnerPw,
      phone:    '+254700000005',
      county:   'Narok',
      role:     'LEARNER',
    }
  })

  const learner6 = await prisma.user.create({
    data: {
      name:     'Zawadi Adhiambo',
      email:    'zawadi@example.com',
      password: learnerPw,
      phone:    '+254700000006',
      county:   'Kisii',
      role:     'LEARNER',
    }
  })

  // Pending applicant (stays LEARNER until approved)
  const pendingTrainer = await prisma.user.create({
    data: {
      name:     'Moses Kamau',
      email:    'moses.kamau@example.com',
      password: pendingPw,
      phone:    '+254711111111',
      county:   'Nairobi',
      role:     'LEARNER',
    }
  })

  logger.info('✅ Created 13 users (1 admin, 2 dev super users, 3 mock trainers, 6 mock learners, 1 pending applicant)')

  // ============ Trainer Profiles =======================

  // Super dev trainer — approved, rich profile
  await prisma.trainerProfile.create({
    data: {
      userId:       superTrainer.id,
      bio:          'All-rounder trainer used for development and QA. Covers multiple skill areas and has both online and physical sessions.',
      skills:       ['Digital Marketing', 'Data Analysis', 'Soft Skills', 'Cyber Hygiene'],
      availability: 'weekdays',
      motivation:   'Dev account — testing all trainer flows end-to-end.',
      status:       'APPROVED',
    }
  })

  await prisma.trainerProfile.create({
    data: {
      userId:       trainer1.id,
      bio:          'Data analyst with 4 years experience in fintech and NGO reporting. Passionate about making data accessible to young people.',
      skills:       ['Data Analysis', 'Soft Skills'],
      availability: 'weekends',
      motivation:   'I want to give back to my community by sharing practical skills that actually get people jobs.',
      status:       'APPROVED',
    }
  })

  await prisma.trainerProfile.create({
    data: {
      userId:       trainer2.id,
      bio:          'Digital marketer and content creator. Runs a successful YouTube channel on East African tech trends.',
      skills:       ['Digital Marketing', 'Content Creation & Monetization', 'Video Editing'],
      availability: 'weekends',
      motivation:   'Content creation changed my life financially. I want to show others the same path.',
      status:       'APPROVED',
    }
  })

  await prisma.trainerProfile.create({
    data: {
      userId:       trainer3.id,
      bio:          'Cybersecurity professional, CompTIA Security+ certified. 5 years in network security.',
      skills:       ['Cyber Hygiene', 'Basics in Cyber Security'],
      availability: 'online-only',
      motivation:   'Digital safety is a right, not a privilege. Every Kenyan youth should know how to protect themselves online.',
      status:       'APPROVED',
    }
  })

  // Pending application
  await prisma.trainerProfile.create({
    data: {
      userId:       pendingTrainer.id,
      bio:          'Graphic designer with 2 years freelance experience on Fiverr and Upwork.',
      skills:       ['Graphic Design'],
      availability: 'weekends',
      motivation:   'I earn from design every month and want to help others do the same.',
      status:       'PENDING',
    }
  })

  logger.info('✅ Created 5 trainer profiles (4 approved, 1 pending)')

  // ======== Sessions =================

  // COMPLETED sessions (past)
  const session1 = await prisma.session.create({
    data: {
      title:        'Cyber Hygiene Bootcamp — Nairobi',
      skillArea:    'Cyber Hygiene',
      description:  'Learn how to protect yourself and your devices online. Covers passwords, phishing, safe browsing, and social media safety.',
      date:         past(21, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue:        'Nairobi Innovation Hub, Westlands',
      county:       'Nairobi',
      capacity:     30,
      status:       'COMPLETED',
      trainerId:    trainer3.id,
    }
  })

  const session2 = await prisma.session.create({
    data: {
      title:        'Introduction to Data Analysis — Kisumu',
      skillArea:    'Data Analysis',
      description:  'Hands-on intro to spreadsheets, basic statistics, and reading data to make decisions. No experience needed.',
      date:         past(14, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue:        'Kisumu Youth Polytechnic, Milimani',
      county:       'Kisumu',
      capacity:     25,
      status:       'COMPLETED',
      trainerId:    trainer1.id,
    }
  })

  const session3 = await prisma.session.create({
    data: {
      title:        'Content Creation & Monetization — Online',
      skillArea:    'Content Creation & Monetization',
      description:  'How to create content on YouTube, TikTok, and Instagram — and actually earn from it. Covers brand deals, AdSense, and audience building.',
      date:         past(7, 14),
      durationMins: 180,
      locationType: 'ONLINE',
      venue:        'https://meet.google.com/aicn-content-001',
      county:       null,
      capacity:     50,
      status:       'COMPLETED',
      trainerId:    trainer2.id,
    }
  })

  // Completed session led by super dev trainer (so they show up in history)
  const session0 = await prisma.session.create({
    data: {
      title:        'Digital Skills Orientation — Nairobi',
      skillArea:    'Soft Skills',
      description:  'Introductory orientation session covering the AICN programme, what to expect, and how to make the most of the training calendar.',
      date:         past(30, 10),
      durationMins: 90,
      locationType: 'PHYSICAL',
      venue:        'iHub Nairobi, Ngong Road',
      county:       'Nairobi',
      capacity:     40,
      status:       'COMPLETED',
      trainerId:    superTrainer.id,
    }
  })

  // SCHEDULED sessions (upcoming)
  const session4 = await prisma.session.create({
    data: {
      title:        'Digital Marketing Fundamentals — Nairobi',
      skillArea:    'Digital Marketing',
      description:  'SEO, social media marketing, email campaigns, and how to run paid ads on a budget. Real examples from Kenyan businesses.',
      date:         future(7, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue:        'iHub Nairobi, Ngong Road',
      county:       'Nairobi',
      capacity:     30,
      status:       'SCHEDULED',
      trainerId:    trainer2.id,
    }
  })

  const session5 = await prisma.session.create({
    data: {
      title:        'Graphic Design for Beginners — Nakuru',
      skillArea:    'Graphic Design',
      description:  'From zero to Canva and Photoshop basics. Design posters, social media graphics, and simple logos. Laptops required.',
      date:         future(10, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue:        'Nakuru Business Centre, Section 58',
      county:       'Nakuru',
      capacity:     20,
      status:       'SCHEDULED',
      trainerId:    null, // not yet assigned
    }
  })

  const session6 = await prisma.session.create({
    data: {
      title:        'Cyber Security Basics — Online',
      skillArea:    'Basics in Cyber Security',
      description:  'Understanding threats, firewalls, VPNs, and how to build a career in cybersecurity. Certification pathways covered.',
      date:         future(14, 14),
      durationMins: 180,
      locationType: 'ONLINE',
      venue:        'https://meet.google.com/aicn-cyber-002',
      county:       null,
      capacity:     60,
      status:       'SCHEDULED',
      trainerId:    trainer3.id,
    }
  })

  const session7 = await prisma.session.create({
    data: {
      title:        'Introduction to Online Jobs — Kisii',
      skillArea:    'Introduction to Online Jobs',
      description:  'Freelancing on Upwork and Fiverr, remote work platforms, building a portfolio, and how to get your first client.',
      date:         future(18, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue:        'Kisii University Community Hub',
      county:       'Kisii',
      capacity:     25,
      status:       'SCHEDULED',
      trainerId:    trainer1.id,
    }
  })

  const session8 = await prisma.session.create({
    data: {
      title:        'Data Analysis with Google Sheets — Online',
      skillArea:    'Data Analysis',
      description:  'Pivot tables, VLOOKUP, charts and dashboards. Practical exercises using real Kenyan business datasets.',
      date:         future(21, 10),
      durationMins: 180,
      locationType: 'ONLINE',
      venue:        'https://meet.google.com/aicn-data-003',
      county:       null,
      capacity:     40,
      status:       'SCHEDULED',
      trainerId:    trainer1.id,
    }
  })

  const session9 = await prisma.session.create({
    data: {
      title:        'Video Editing with CapCut & DaVinci — Nairobi',
      skillArea:    'Video Editing',
      description:  'Edit videos for social media, YouTube, and client projects. Free tools only — no paid software needed.',
      date:         future(28, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue:        'Nairobi Garage, Westlands',
      county:       'Nairobi',
      capacity:     20,
      status:       'SCHEDULED',
      trainerId:    trainer2.id,
    }
  })

  // Upcoming session led by super dev trainer
  const session11 = await prisma.session.create({
    data: {
      title:        'Data Analysis Masterclass — Online',
      skillArea:    'Data Analysis',
      description:  'Advanced data storytelling, dashboard design, and presenting insights to non-technical stakeholders.',
      date:         future(5, 11),
      durationMins: 150,
      locationType: 'ONLINE',
      venue:        'https://meet.google.com/aicn-dev-001',
      county:       null,
      capacity:     50,
      status:       'SCHEDULED',
      trainerId:    superTrainer.id,
    }
  })

  // CANCELLED session
  const session10 = await prisma.session.create({
    data: {
      title:        'Soft Skills Workshop — Narok',
      skillArea:    'Soft Skills',
      description:  'Communication, teamwork, time management and professional etiquette.',
      date:         past(3, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue:        'Narok County Library',
      county:       'Narok',
      capacity:     30,
      status:       'CANCELLED',
      trainerId:    null,
    }
  })

  logger.info('✅ Created 12 sessions (4 completed, 7 scheduled, 1 cancelled)')

  // ============= Enrolments ================================

  // Super learner — rich history: attended past sessions, enrolled in upcoming ones
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session0.id,  status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session1.id,  status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session2.id,  status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session3.id,  status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session4.id,  status: 'ENROLLED' } })
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session6.id,  status: 'ENROLLED' } })
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session11.id, status: 'ENROLLED' } })

  // Completed session 1 — Cyber Hygiene Nairobi
  await prisma.enrolment.create({ data: { userId: learner1.id, sessionId: session1.id, status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: learner4.id, sessionId: session1.id, status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: learner5.id, sessionId: session1.id, status: 'ABSENT'   } })

  // Completed session 2 — Data Analysis Kisumu
  await prisma.enrolment.create({ data: { userId: learner2.id, sessionId: session2.id, status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: learner6.id, sessionId: session2.id, status: 'ATTENDED' } })

  // Completed session 3 — Content Creation Online
  await prisma.enrolment.create({ data: { userId: learner1.id, sessionId: session3.id, status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: learner2.id, sessionId: session3.id, status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: learner3.id, sessionId: session3.id, status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: learner5.id, sessionId: session3.id, status: 'ABSENT'   } })

  // Completed session 0 — Orientation (mock learners)
  await prisma.enrolment.create({ data: { userId: learner1.id, sessionId: session0.id, status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: learner3.id, sessionId: session0.id, status: 'ATTENDED' } })
  await prisma.enrolment.create({ data: { userId: learner6.id, sessionId: session0.id, status: 'ABSENT'   } })

  // Upcoming session 4 — Digital Marketing Nairobi
  await prisma.enrolment.create({ data: { userId: learner1.id, sessionId: session4.id, status: 'ENROLLED' } })
  await prisma.enrolment.create({ data: { userId: learner3.id, sessionId: session4.id, status: 'ENROLLED' } })
  await prisma.enrolment.create({ data: { userId: learner4.id, sessionId: session4.id, status: 'ENROLLED' } })

  // Upcoming session 6 — Cyber Security Online
  await prisma.enrolment.create({ data: { userId: learner1.id, sessionId: session6.id, status: 'ENROLLED' } })
  await prisma.enrolment.create({ data: { userId: learner5.id, sessionId: session6.id, status: 'ENROLLED' } })
  await prisma.enrolment.create({ data: { userId: learner6.id, sessionId: session6.id, status: 'ENROLLED' } })

  // Upcoming session 7 — Online Jobs Kisii
  await prisma.enrolment.create({ data: { userId: learner2.id, sessionId: session7.id, status: 'ENROLLED' } })
  await prisma.enrolment.create({ data: { userId: learner6.id, sessionId: session7.id, status: 'ENROLLED' } })

  logger.info('✅ Created 26 enrolments across sessions')

  // ======== Certificates ====================================
  // Only for ATTENDED enrolments on COMPLETED sessions

  // Super learner — earns certs for all attended completed sessions
  await prisma.certificate.create({ data: { userId: superLearner.id, sessionId: session0.id, certCode: generateCertCode(superLearner.id, session0.id) } })
  await prisma.certificate.create({ data: { userId: superLearner.id, sessionId: session1.id, certCode: generateCertCode(superLearner.id, session1.id) } })
  await prisma.certificate.create({ data: { userId: superLearner.id, sessionId: session2.id, certCode: generateCertCode(superLearner.id, session2.id) } })
  await prisma.certificate.create({ data: { userId: superLearner.id, sessionId: session3.id, certCode: generateCertCode(superLearner.id, session3.id) } })

  // Session 1 — Cyber Hygiene
  await prisma.certificate.create({ data: { userId: learner1.id, sessionId: session1.id, certCode: generateCertCode(learner1.id, session1.id) } })
  await prisma.certificate.create({ data: { userId: learner4.id, sessionId: session1.id, certCode: generateCertCode(learner4.id, session1.id) } })

  // Session 2 — Data Analysis Kisumu
  await prisma.certificate.create({ data: { userId: learner2.id, sessionId: session2.id, certCode: generateCertCode(learner2.id, session2.id) } })
  await prisma.certificate.create({ data: { userId: learner6.id, sessionId: session2.id, certCode: generateCertCode(learner6.id, session2.id) } })

  // Session 3 — Content Creation Online
  await prisma.certificate.create({ data: { userId: learner1.id, sessionId: session3.id, certCode: generateCertCode(learner1.id, session3.id) } })
  await prisma.certificate.create({ data: { userId: learner2.id, sessionId: session3.id, certCode: generateCertCode(learner2.id, session3.id) } })
  await prisma.certificate.create({ data: { userId: learner3.id, sessionId: session3.id, certCode: generateCertCode(learner3.id, session3.id) } })

  // Session 0 — Orientation
  await prisma.certificate.create({ data: { userId: learner1.id, sessionId: session0.id, certCode: generateCertCode(learner1.id, session0.id) } })
  await prisma.certificate.create({ data: { userId: learner3.id, sessionId: session0.id, certCode: generateCertCode(learner3.id, session0.id) } })

  logger.info('✅ Issued 13 certificates')

  // ====== Announcements =================================

  await prisma.announcement.createMany({
    data: [
      {
        title:    'Welcome to the AICN Platform!',
        body:     'We have launched our new digital platform. Register, browse sessions, and enrol directly — no more WhatsApp back-and-forth. Your certificates will now be issued here too.',
        audience: 'all',
      },
      {
        title:    'New sessions added for June',
        body:     'We have added 6 new training sessions across Nairobi, Kisumu, Nakuru, and Kisii. Log in and book your spot — some sessions have limited capacity.',
        audience: 'learners',
      },
      {
        title:    'Trainers: session reports are now required',
        body:     'After each completed session, please mark attendance for all enrolled learners. This triggers automatic certificate issuance. Thank you for keeping the records clean.',
        audience: 'trainers',
      },
    ]
  })

  logger.info('✅ Created 3 announcements')

  // ========== Summary =================

  logger.info('\n======= SEEDING COMPLETE =============================')
  logger.info('\n🔑 DEV SUPER USER ACCOUNTS (use these for testing UIs):')
  logger.info('  ★ ADMIN:    calvince@africaictcsnetwork.org  /  admin123')
  logger.info('  ★ TRAINER:  trainer@aicn.africa              /  Test123!@#  ← super trainer (approved profile, past + upcoming sessions)')
  logger.info('  ★ LEARNER:  learner@aicn.africa              /  Test123!@#  ← super learner (4 certs, past + upcoming enrolments)')
  logger.info('\n📋 Mock accounts (additional data only):')
  logger.info('  TRAINER:  amara.osei@aicn.org               /  trainer123')
  logger.info('  TRAINER:  fatuma.njeri@aicn.org             /  trainer123')
  logger.info('  TRAINER:  brian.otieno@aicn.org             /  trainer123')
  logger.info('  LEARNER:  dev@example.com                   /  learner123')
  logger.info('  LEARNER:  akinyi@example.com                /  learner123')
  logger.info('  LEARNER:  juma@example.com                  /  learner123')
  logger.info('  LEARNER:  wanjiku@example.com               /  learner123')
  logger.info('  LEARNER:  emmanuel@example.com              /  learner123')
  logger.info('  LEARNER:  zawadi@example.com                /  learner123')
  logger.info('  PENDING:  moses.kamau@example.com           /  pending123')
  logger.info('\n📊 Data summary:')
  logger.info('  Users:          13  (1 admin · 4 trainers · 7 learners · 1 pending)')
  logger.info('  Sessions:       12  (4 completed · 7 scheduled · 1 cancelled)')
  logger.info('  Enrolments:     26')
  logger.info('  Certificates:   13')
  logger.info('  Announcements:   3')
  logger.info('  Trainer apps:    5  (4 approved · 1 pending)')
  logger.info('======================================================\n')
}

main()
  .catch(e => { logger.error('❌ Seed failed:', e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })