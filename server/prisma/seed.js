// prisma/seed.js
// Run: node prisma/seed.js

const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const logger = require('../utils/logger');
const crypto = require('crypto');

// ========== Helpers ==================
const hash = (pw) => bcrypt.hash(pw, 12);

const future = (daysFromNow, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const past = (daysAgo, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const generateCertCode = () => {
  return `CERT-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
};

// ========== Main seeder function ===================

async function main() {
  logger.info(' Seeding AICN database...\n');

  // Clear existing data
  await prisma.announcement.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.enrolment.deleteMany();
  await prisma.trainerProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  logger.info('🗑  Cleared existing data');

  // ============ Password hashes ===================================

  const [
    adminPw,
    trainerPw,
    learnerPw,
    pendingPw,
    superLearnerPw,
    superTrainerPw,
    tsailunPw,
  ] = await Promise.all([
    hash('admin123'),
    hash('trainer123'),
    hash('learner123'),
    hash('pending123'),
    hash('Test123!@#'),
    hash('Test123!@#'),
    hash('Test123!@#'),
  ]);

  // ============ Users ===================================

  // --- Admin ---
  const admin = await prisma.user.create({
    data: {
      name: 'Calvince Wise',
      email: 'calvince@africaictcsnetwork.org',
      password: adminPw,
      phone: '+254799112919',
      county: 'Nairobi',
      role: 'ADMIN',
    }
  });

  // --- Second Super Admin (REAL working email — use for live email/PDF/Cloudinary testing) ---
  const tsailunAdmin = await prisma.user.create({
    data: {
      name: 'Tsailun Enterprises',
      email: 'tsailunenterprises@gmail.com',
      password: tsailunPw,
      phone: '+254700000099',
      county: 'Nairobi',
      role: 'ADMIN',
    }
  });

  // --- Super Dev Trainer (full-featured, to test trainer UI) ---
  const superTrainer = await prisma.user.create({
    data: {
      name: 'Trainer User',
      email: 'trainer@aicn.africa',
      password: superTrainerPw,
      phone: '+254722222222',
      county: 'Mombasa',
      role: 'TRAINER',
    }
  });

  // --- Regular mock trainers ---
  const trainer1 = await prisma.user.create({
    data: {
      name: 'Amara Osei',
      email: 'amara.osei@aicn.org',
      password: trainerPw,
      phone: '+254712345678',
      county: 'Nairobi',
      role: 'TRAINER',
    }
  });

  const trainer2 = await prisma.user.create({
    data: {
      name: 'Fatuma Njeri',
      email: 'fatuma.njeri@aicn.org',
      password: trainerPw,
      phone: '+254723456789',
      county: 'Kisumu',
      role: 'TRAINER',
    }
  });

  const trainer3 = await prisma.user.create({
    data: {
      name: 'Brian Otieno',
      email: 'brian.otieno@aicn.org',
      password: trainerPw,
      phone: '+254734567890',
      county: 'Nakuru',
      role: 'TRAINER',
    }
  });

  // --- Super Dev Learner (full-featured, use this to test learner UI) ---
  const superLearner = await prisma.user.create({
    data: {
      name: 'Learner User',
      email: 'learner@aicn.africa',
      password: superLearnerPw,
      phone: '+254733333333',
      county: 'Nairobi',
      role: 'LEARNER',
    }
  });

  // --- Regular mock learners ---
  const learner1 = await prisma.user.create({
    data: {
      name: 'Dev Scipio',
      email: 'dev@example.com',
      password: learnerPw,
      phone: '+254700000001',
      county: 'Nairobi',
      role: 'LEARNER',
    }
  });

  const learner2 = await prisma.user.create({
    data: {
      name: 'Akinyi Moraa',
      email: 'akinyi@example.com',
      password: learnerPw,
      phone: '+254700000002',
      county: 'Kisumu',
      role: 'LEARNER',
    }
  });

  const learner3 = await prisma.user.create({
    data: {
      name: 'Juma Baraka',
      email: 'juma@example.com',
      password: learnerPw,
      phone: '+254700000003',
      county: 'Mombasa',
      role: 'LEARNER',
    }
  });

  const learner4 = await prisma.user.create({
    data: {
      name: 'Wanjiku Mwangi',
      email: 'wanjiku@example.com',
      password: learnerPw,
      phone: '+254700000004',
      county: 'Nakuru',
      role: 'LEARNER',
    }
  });

  const learner5 = await prisma.user.create({
    data: {
      name: 'Emmanuel Kipchoge',
      email: 'emmanuel@example.com',
      password: learnerPw,
      phone: '+254700000005',
      county: 'Narok',
      role: 'LEARNER',
    }
  });

  const learner6 = await prisma.user.create({
    data: {
      name: 'Zawadi Adhiambo',
      email: 'zawadi@example.com',
      password: learnerPw,
      phone: '+254700000006',
      county: 'Kisii',
      role: 'LEARNER',
    }
  });

  // Pending applicant (stays LEARNER until approved)
  const pendingTrainer = await prisma.user.create({
    data: {
      name: 'Moses Kamau',
      email: 'moses.kamau@example.com',
      password: pendingPw,
      phone: '+254711111111',
      county: 'Nairobi',
      role: 'LEARNER',
    }
  });

  logger.info('✅ Created 14 users (2 admins incl. live-email super admin, 2 dev super users, 3 mock trainers, 6 mock learners, 1 pending applicant)');

  // ============ Trainer Profiles =======================

  // Super dev trainer — approved, rich profile
  await prisma.trainerProfile.create({
    data: {
      userId: superTrainer.id,
      bio: 'All-rounder trainer used for development and QA. Covers multiple skill areas and has both online and physical sessions.',
      skills: ['Digital Marketing', 'Data Analysis', 'Soft Skills', 'Cyber Hygiene'],
      availability: 'weekdays',
      motivation: 'Dev account — testing all trainer flows end-to-end.',
      status: 'APPROVED',
    }
  });

  await prisma.trainerProfile.create({
    data: {
      userId: trainer1.id,
      bio: 'Data analyst with 4 years experience in fintech and NGO reporting. Passionate about making data accessible to young people.',
      skills: ['Data Analysis', 'Soft Skills'],
      availability: 'weekends',
      motivation: 'I want to give back to my community by sharing practical skills that actually get people jobs.',
      status: 'APPROVED',
    }
  });

  await prisma.trainerProfile.create({
    data: {
      userId: trainer2.id,
      bio: 'Digital marketer and content creator. Runs a successful YouTube channel on East African tech trends.',
      skills: ['Digital Marketing', 'Content Creation & Monetization', 'Video Editing'],
      availability: 'weekends',
      motivation: 'Content creation changed my life financially. I want to show others the same path.',
      status: 'APPROVED',
    }
  });

  await prisma.trainerProfile.create({
    data: {
      userId: trainer3.id,
      bio: 'Cybersecurity professional, CompTIA Security+ certified. 5 years in network security.',
      skills: ['Cyber Hygiene', 'Basics in Cyber Security'],
      availability: 'online-only',
      motivation: 'Digital safety is a right, not a privilege. Every Kenyan youth should know how to protect themselves online.',
      status: 'APPROVED',
    }
  });

  // Pending application
  await prisma.trainerProfile.create({
    data: {
      userId: pendingTrainer.id,
      bio: 'Graphic designer with 2 years freelance experience on Fiverr and Upwork.',
      skills: ['Graphic Design'],
      availability: 'weekends',
      motivation: 'I earn from design every month and want to help others do the same.',
      status: 'PENDING',
    }
  });

  logger.info('✅ Created 5 trainer profiles (4 approved, 1 pending)');

  // ======== BASE SESSIONS (Other trainers) =================

  // COMPLETED sessions (past) for other trainers
  const session1 = await prisma.session.create({
    data: {
      title: 'Cyber Hygiene Bootcamp — Nairobi',
      skillArea: 'Cyber Hygiene',
      description: 'Learn how to protect yourself and your devices online. Covers passwords, phishing, safe browsing, and social media safety.',
      date: past(21, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Nairobi Innovation Hub, Westlands',
      county: 'Nairobi',
      capacity: 30,
      status: 'COMPLETED',
      trainerId: trainer3.id,
    }
  });

  const session2 = await prisma.session.create({
    data: {
      title: 'Introduction to Data Analysis — Kisumu',
      skillArea: 'Data Analysis',
      description: 'Hands-on intro to spreadsheets, basic statistics, and reading data to make decisions. No experience needed.',
      date: past(14, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Kisumu Youth Polytechnic, Milimani',
      county: 'Kisumu',
      capacity: 25,
      status: 'COMPLETED',
      trainerId: trainer1.id,
    }
  });

  const session3 = await prisma.session.create({
    data: {
      title: 'Content Creation & Monetization — Online',
      skillArea: 'Content Creation & Monetization',
      description: 'How to create content on YouTube, TikTok, and Instagram — and actually earn from it. Covers brand deals, AdSense, and audience building.',
      date: past(7, 14),
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-content-001',
      county: null,
      capacity: 50,
      status: 'COMPLETED',
      trainerId: trainer2.id,
    }
  });

  // SCHEDULED sessions for other trainers
  const session4 = await prisma.session.create({
    data: {
      title: 'Digital Marketing Fundamentals — Nairobi',
      skillArea: 'Digital Marketing',
      description: 'SEO, social media marketing, email campaigns, and how to run paid ads on a budget. Real examples from Kenyan businesses.',
      date: future(7, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'iHub Nairobi, Ngong Road',
      county: 'Nairobi',
      capacity: 30,
      status: 'SCHEDULED',
      trainerId: trainer2.id,
    }
  });

  const session5 = await prisma.session.create({
    data: {
      title: 'Graphic Design for Beginners — Nakuru',
      skillArea: 'Graphic Design',
      description: 'From zero to Canva and Photoshop basics. Design posters, social media graphics, and simple logos. Laptops required.',
      date: future(10, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Nakuru Business Centre, Section 58',
      county: 'Nakuru',
      capacity: 20,
      status: 'SCHEDULED',
      trainerId: null,
    }
  });

  const session6 = await prisma.session.create({
    data: {
      title: 'Cyber Security Basics — Online',
      skillArea: 'Basics in Cyber Security',
      description: 'Understanding threats, firewalls, VPNs, and how to build a career in cybersecurity. Certification pathways covered.',
      date: future(14, 14),
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-cyber-002',
      county: null,
      capacity: 60,
      status: 'SCHEDULED',
      trainerId: trainer3.id,
    }
  });

  const session7 = await prisma.session.create({
    data: {
      title: 'Introduction to Online Jobs — Kisii',
      skillArea: 'Introduction to Online Jobs',
      description: 'Freelancing on Upwork and Fiverr, remote work platforms, building a portfolio, and how to get your first client.',
      date: future(18, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Kisii University Community Hub',
      county: 'Kisii',
      capacity: 25,
      status: 'SCHEDULED',
      trainerId: trainer1.id,
    }
  });

  const session8 = await prisma.session.create({
    data: {
      title: 'Data Analysis with Google Sheets — Online',
      skillArea: 'Data Analysis',
      description: 'Pivot tables, VLOOKUP, charts and dashboards. Practical exercises using real Kenyan business datasets.',
      date: future(21, 10),
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-data-003',
      county: null,
      capacity: 40,
      status: 'SCHEDULED',
      trainerId: trainer1.id,
    }
  });

  const session9 = await prisma.session.create({
    data: {
      title: 'Video Editing with CapCut & DaVinci — Nairobi',
      skillArea: 'Video Editing',
      description: 'Edit videos for social media, YouTube, and client projects. Free tools only — no paid software needed.',
      date: future(28, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Nairobi Garage, Westlands',
      county: 'Nairobi',
      capacity: 20,
      status: 'SCHEDULED',
      trainerId: trainer2.id,
    }
  });

  // CANCELLED session
  const session10 = await prisma.session.create({
    data: {
      title: 'Soft Skills Workshop — Narok',
      skillArea: 'Soft Skills',
      description: 'Communication, teamwork, time management and professional etiquette.',
      date: past(3, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Narok County Library',
      county: 'Narok',
      capacity: 30,
      status: 'CANCELLED',
      trainerId: null,
    }
  });

  // ============ SUPER TRAINER SESSIONS (Rich QA Data) ============

  logger.info('\n📝 Creating SUPER TRAINER sessions for QA testing...');

  // Helper to create enrolments with mixed statuses
  function getEnrolmentStatuses(totalEnrolments, attendedCount, absentCount) {
    const statuses = [];
    for (let i = 0; i < attendedCount; i++) statuses.push('ATTENDED');
    for (let i = 0; i < absentCount; i++) statuses.push('ABSENT');
    const remaining = totalEnrolments - attendedCount - absentCount;
    for (let i = 0; i < remaining; i++) statuses.push('ENROLLED');
    return statuses;
  }

  async function createSuperTrainerSession(sessionData, isPast = true) {
    const date = sessionData.daysAgo !== undefined 
      ? past(sessionData.daysAgo, sessionData.hour)
      : future(sessionData.daysAhead, sessionData.hour);

    let enrolStatuses = [];
    const learnersList = [learner1, learner2, learner3, learner4, learner5, learner6];
    if (superLearner) learnersList.push(superLearner);

    if (sessionData.status === 'COMPLETED') {
      const total = sessionData.enrolCount;
      const attendedCount = Math.floor(total * 0.7);
      const absentCount = total - attendedCount;
      enrolStatuses = getEnrolmentStatuses(total, attendedCount, absentCount);
    } else if (sessionData.status === 'CANCELLED') {
      enrolStatuses = Array(sessionData.enrolCount).fill('CANCELLED');
    } else {
      enrolStatuses = Array(sessionData.enrolCount).fill('ENROLLED');
    }

    const shuffled = learnersList.sort(() => 0.5 - Math.random());
    const selectedLearners = shuffled.slice(0, sessionData.enrolCount);

    const session = await prisma.session.create({
      data: {
        title: sessionData.title,
        skillArea: sessionData.skillArea,
        description: sessionData.description,
        date: date,
        durationMins: sessionData.durationMins,
        locationType: sessionData.locationType,
        venue: sessionData.venue,
        county: sessionData.county,
        capacity: sessionData.capacity,
        status: sessionData.status,
        trainerId: superTrainer.id,
      },
    });

    for (let i = 0; i < selectedLearners.length; i++) {
      await prisma.enrolment.create({
        data: {
          userId: selectedLearners[i].id,
          sessionId: session.id,
          status: enrolStatuses[i] || 'ENROLLED',
        },
      });
    }

    return session;
  }

  // Super Trainer Completed Sessions
  const superCompletedSessions = [
    {
      title: 'Data Analysis Fundamentals',
      skillArea: 'Data Analysis',
      description: 'Complete introduction to data analysis using spreadsheets and basic statistics. Real-world examples from Kenyan businesses.',
      daysAgo: 45,
      hour: 9,
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Nairobi Innovation Hub',
      county: 'Nairobi',
      capacity: 30,
      status: 'COMPLETED',
      enrolCount: 7,
    },
    {
      title: 'Excel Masterclass for Professionals',
      skillArea: 'Data Analysis',
      description: 'Advanced Excel techniques: pivot tables, VLOOKUP, macros, and dashboard creation.',
      daysAgo: 38,
      hour: 14,
      durationMins: 180,
      locationType: 'PHYSICAL',
      venue: 'Nairobi Garage, Westlands',
      county: 'Nairobi',
      capacity: 25,
      status: 'COMPLETED',
      enrolCount: 5,
    },
    {
      title: 'Digital Marketing Strategy',
      skillArea: 'Digital Marketing',
      description: 'Comprehensive digital marketing strategy including SEO, social media, email campaigns, and analytics.',
      daysAgo: 30,
      hour: 10,
      durationMins: 150,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-digital-001',
      county: null,
      capacity: 50,
      status: 'COMPLETED',
      enrolCount: 7,
    },
    {
      title: 'Cyber Hygiene Essentials',
      skillArea: 'Cyber Hygiene',
      description: 'Learn how to protect yourself from cyber threats. Password management, phishing awareness, and safe browsing.',
      daysAgo: 25,
      hour: 9,
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'iHub Nairobi',
      county: 'Nairobi',
      capacity: 35,
      status: 'COMPLETED',
      enrolCount: 6,
    },
    {
      title: 'Soft Skills for Career Growth',
      skillArea: 'Soft Skills',
      description: 'Communication, teamwork, leadership, and professional etiquette for career advancement.',
      daysAgo: 20,
      hour: 14,
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Kisumu Youth Polytechnic',
      county: 'Kisumu',
      capacity: 40,
      status: 'COMPLETED',
      enrolCount: 7,
    },
    {
      title: 'Content Creation Bootcamp',
      skillArea: 'Content Creation & Monetization',
      description: 'Create and monetize content on YouTube, TikTok, and Instagram. Brand deals, AdSense, and audience building.',
      daysAgo: 15,
      hour: 10,
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-content-002',
      county: null,
      capacity: 60,
      status: 'COMPLETED',
      enrolCount: 6,
    },
    {
      title: 'Introduction to Online Jobs',
      skillArea: 'Introduction to Online Jobs',
      description: 'Freelancing platforms, remote work opportunities, building a portfolio, and getting your first client.',
      daysAgo: 10,
      hour: 9,
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Nakuru Business Centre',
      county: 'Nakuru',
      capacity: 25,
      status: 'COMPLETED',
      enrolCount: 3,
    },
  ];

  // Super Trainer Scheduled Sessions
  const superScheduledSessions = [
    {
      title: 'Power BI for Decision Makers',
      skillArea: 'Data Analysis',
      description: 'Learn Power BI to create interactive dashboards and business intelligence reports. No coding required.',
      daysAhead: 7,
      hour: 9,
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-powerbi-001',
      county: null,
      capacity: 50,
      status: 'SCHEDULED',
      enrolCount: 7,
    },
    {
      title: 'AI for Beginners',
      skillArea: 'Basics in Cyber Security',
      description: 'Introduction to Artificial Intelligence, machine learning, and how AI is transforming industries.',
      daysAhead: 14,
      hour: 14,
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Nairobi Innovation Hub',
      county: 'Nairobi',
      capacity: 30,
      status: 'SCHEDULED',
      enrolCount: 3,
    },
    {
      title: 'Professional CV Writing Workshop',
      skillArea: 'Soft Skills',
      description: 'Learn to write a professional CV that gets you interviews. Stand out in the Kenyan job market.',
      daysAhead: 21,
      hour: 10,
      durationMins: 90,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-cv-001',
      county: null,
      capacity: 40,
      status: 'SCHEDULED',
      enrolCount: 6,
    },
    {
      title: 'Advanced Data Visualization',
      skillArea: 'Data Analysis',
      description: 'Create compelling data visualizations using Tableau and Google Data Studio. Tell stories with data.',
      daysAhead: 28,
      hour: 9,
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-visual-001',
      county: null,
      capacity: 50,
      status: 'SCHEDULED',
      enrolCount: 3,
    },
    {
      title: 'Machine Learning Fundamentals',
      skillArea: 'Data Analysis',
      description: 'Introduction to machine learning concepts, algorithms, and practical applications.',
      daysAhead: 10,
      hour: 14,
      durationMins: 150,
      locationType: 'PHYSICAL',
      venue: 'Nairobi Innovation Hub',
      county: 'Nairobi',
      capacity: 30,
      status: 'SCHEDULED',
      enrolCount: 29,
    },
    {
      title: 'Python for Data Science',
      skillArea: 'Data Analysis',
      description: 'Learn Python programming for data analysis, visualization, and machine learning.',
      daysAhead: 15,
      hour: 9,
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-python-001',
      county: null,
      capacity: 30,
      status: 'SCHEDULED',
      enrolCount: 30,
    },
    {
      title: 'SQL for Beginners',
      skillArea: 'Data Analysis',
      description: 'Learn SQL to query databases, extract insights, and work with real-world data.',
      daysAhead: 30,
      hour: 10,
      durationMins: 120,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-sql-001',
      county: null,
      capacity: 40,
      status: 'SCHEDULED',
      enrolCount: 0,
    },
  ];

  // Super Trainer Cancelled Sessions
  const superCancelledSessions = [
    {
      title: 'Freelancing Masterclass',
      skillArea: 'Introduction to Online Jobs',
      description: 'Master the art of freelancing on Upwork, Fiverr, and other platforms.',
      daysAgo: 12,
      hour: 9,
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-freelance-001',
      county: null,
      capacity: 40,
      status: 'CANCELLED',
      enrolCount: 3,
    },
    {
      title: 'Graphic Design Essentials',
      skillArea: 'Graphic Design',
      description: 'Learn Canva, Photoshop, and Illustrator basics. Create professional designs.',
      daysAgo: 8,
      hour: 14,
      durationMins: 150,
      locationType: 'PHYSICAL',
      venue: 'Nakuru Business Centre',
      county: 'Nakuru',
      capacity: 25,
      status: 'CANCELLED',
      enrolCount: 2,
    },
  ];

  // Super Trainer In-Progress Session
  const superInProgressSession = {
    title: 'React Fundamentals Live Cohort',
    skillArea: 'Basics in Cyber Security',
    description: 'Build modern web applications with React. Hooks, state management, and component architecture.',
    daysAhead: 0,
    hour: 10,
    durationMins: 180,
    locationType: 'ONLINE',
    venue: 'https://meet.google.com/aicn-react-001',
    county: null,
    capacity: 30,
    status: 'IN_PROGRESS',
    enrolCount: 7,
  };

  // Create all super trainer sessions
  let superSessionCount = 0;
  for (const sessionData of superCompletedSessions) {
    await createSuperTrainerSession(sessionData, true);
    superSessionCount++;
  }
  for (const sessionData of superScheduledSessions) {
    await createSuperTrainerSession(sessionData, false);
    superSessionCount++;
  }
  for (const sessionData of superCancelledSessions) {
    await createSuperTrainerSession(sessionData, true);
    superSessionCount++;
  }
  await createSuperTrainerSession(superInProgressSession, false);
  superSessionCount++;

  logger.info(`✅ Created ${superSessionCount} sessions for super trainer`);

  // ============ BASE ENROLMENTS ================================

  // Super learner enrolments
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session1.id, status: 'ATTENDED' } });
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session2.id, status: 'ATTENDED' } });
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session3.id, status: 'ATTENDED' } });
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session4.id, status: 'ENROLLED' } });
  await prisma.enrolment.create({ data: { userId: superLearner.id, sessionId: session6.id, status: 'ENROLLED' } });

  // Other trainer enrolments
  await prisma.enrolment.create({ data: { userId: learner1.id, sessionId: session1.id, status: 'ATTENDED' } });
  await prisma.enrolment.create({ data: { userId: learner4.id, sessionId: session1.id, status: 'ATTENDED' } });
  await prisma.enrolment.create({ data: { userId: learner5.id, sessionId: session1.id, status: 'ABSENT' } });

  await prisma.enrolment.create({ data: { userId: learner2.id, sessionId: session2.id, status: 'ATTENDED' } });
  await prisma.enrolment.create({ data: { userId: learner6.id, sessionId: session2.id, status: 'ATTENDED' } });

  await prisma.enrolment.create({ data: { userId: learner1.id, sessionId: session3.id, status: 'ATTENDED' } });
  await prisma.enrolment.create({ data: { userId: learner2.id, sessionId: session3.id, status: 'ATTENDED' } });
  await prisma.enrolment.create({ data: { userId: learner3.id, sessionId: session3.id, status: 'ATTENDED' } });
  await prisma.enrolment.create({ data: { userId: learner5.id, sessionId: session3.id, status: 'ABSENT' } });

  await prisma.enrolment.create({ data: { userId: learner1.id, sessionId: session4.id, status: 'ENROLLED' } });
  await prisma.enrolment.create({ data: { userId: learner3.id, sessionId: session4.id, status: 'ENROLLED' } });
  await prisma.enrolment.create({ data: { userId: learner4.id, sessionId: session4.id, status: 'ENROLLED' } });

  await prisma.enrolment.create({ data: { userId: learner1.id, sessionId: session6.id, status: 'ENROLLED' } });
  await prisma.enrolment.create({ data: { userId: learner5.id, sessionId: session6.id, status: 'ENROLLED' } });
  await prisma.enrolment.create({ data: { userId: learner6.id, sessionId: session6.id, status: 'ENROLLED' } });

  await prisma.enrolment.create({ data: { userId: learner2.id, sessionId: session7.id, status: 'ENROLLED' } });
  await prisma.enrolment.create({ data: { userId: learner6.id, sessionId: session7.id, status: 'ENROLLED' } });

  // Tsailun (live-email super admin) enrolments — covers every QA scenario
  // 1) ATTENDED + certificate already issued (session1)
  await prisma.enrolment.create({ data: { userId: tsailunAdmin.id, sessionId: session1.id, status: 'ATTENDED' } });
  // 2) ATTENDED, NO certificate yet — use this one to test live issuance (email/PDF/Cloudinary) via Calvince's admin account
  await prisma.enrolment.create({ data: { userId: tsailunAdmin.id, sessionId: session2.id, status: 'ATTENDED' } });
  // 3) ABSENT on a completed session — no cert
  await prisma.enrolment.create({ data: { userId: tsailunAdmin.id, sessionId: session3.id, status: 'ABSENT' } });
  // 4) ENROLLED on an upcoming scheduled session
  await prisma.enrolment.create({ data: { userId: tsailunAdmin.id, sessionId: session4.id, status: 'ENROLLED' } });
  // 5) CANCELLED enrolment on a cancelled session
  await prisma.enrolment.create({ data: { userId: tsailunAdmin.id, sessionId: session10.id, status: 'CANCELLED' } });

  logger.info('✅ Created base enrolments');

  // ============ CERTIFICATES ====================================

  async function issueCertificatesForSuperTrainer() {
    const completedSessionsForCert = await prisma.session.findMany({
      where: {
        trainerId: superTrainer.id,
        status: 'COMPLETED',
      },
      include: {
        enrolments: {
          where: { status: 'ATTENDED' },
          include: { user: true },
        },
      },
    });

    let count = 0;
    for (const session of completedSessionsForCert) {
      for (const enrolment of session.enrolments) {
        const existing = await prisma.certificate.findFirst({
          where: { userId: enrolment.userId, sessionId: session.id },
        });
        if (!existing) {
          await prisma.certificate.create({
            data: {
              userId: enrolment.userId,
              sessionId: session.id,
              certCode: generateCertCode(),
            },
          });
          count++;
        }
      }
    }
    return count;
  }

  const superCertCount = await issueCertificatesForSuperTrainer();

  // Other trainer certificates
  await prisma.certificate.create({ data: { userId: superLearner.id, sessionId: session1.id, certCode: generateCertCode() } });
  await prisma.certificate.create({ data: { userId: superLearner.id, sessionId: session2.id, certCode: generateCertCode() } });
  await prisma.certificate.create({ data: { userId: superLearner.id, sessionId: session3.id, certCode: generateCertCode() } });

  await prisma.certificate.create({ data: { userId: learner1.id, sessionId: session1.id, certCode: generateCertCode() } });
  await prisma.certificate.create({ data: { userId: learner4.id, sessionId: session1.id, certCode: generateCertCode() } });

  await prisma.certificate.create({ data: { userId: learner2.id, sessionId: session2.id, certCode: generateCertCode() } });
  await prisma.certificate.create({ data: { userId: learner6.id, sessionId: session2.id, certCode: generateCertCode() } });

  await prisma.certificate.create({ data: { userId: learner1.id, sessionId: session3.id, certCode: generateCertCode() } });
  await prisma.certificate.create({ data: { userId: learner2.id, sessionId: session3.id, certCode: generateCertCode() } });
  await prisma.certificate.create({ data: { userId: learner3.id, sessionId: session3.id, certCode: generateCertCode() } });

  // Tsailun: certificate already issued for session1 (ATTENDED).
  // NOTE: session2 enrolment is deliberately left WITHOUT a certificate — use it to live-test
  // certificate issuance (email + PDF generation + Cloudinary upload) by issuing it manually
  // from Calvince's (calvince@africaictcsnetwork.org) admin account.
  await prisma.certificate.create({ data: { userId: tsailunAdmin.id, sessionId: session1.id, certCode: generateCertCode() } });

  logger.info(`✅ Issued ${superCertCount + 10} certificates total`);

  // ====== Announcements =================================

  await prisma.announcement.createMany({
    data: [
      {
        title: 'Welcome to the AICN Platform!',
        body: 'We have launched our new digital platform. Register, browse sessions, and enrol directly — no more WhatsApp back-and-forth. Your certificates will now be issued here too.',
        audience: 'all',
      },
      {
        title: 'New sessions added for June',
        body: 'We have added 6 new training sessions across Nairobi, Kisumu, Nakuru, and Kisii. Log in and book your spot — some sessions have limited capacity.',
        audience: 'learners',
      },
      {
        title: 'Trainers: session reports are now required',
        body: 'After each completed session, please mark attendance for all enrolled learners. This triggers automatic certificate issuance. Thank you for keeping the records clean.',
        audience: 'trainers',
      },
    ]
  });

  logger.info('✅ Created 3 announcements');

// ========== Final Summary (Safer Alternative) =================

const totalSessions = await prisma.session.count();
const completedSessions = await prisma.session.count({ where: { status: 'COMPLETED' } });
const scheduledSessions = await prisma.session.count({ where: { status: 'SCHEDULED' } });
const inProgressSessions = await prisma.session.count({ where: { status: 'IN_PROGRESS' } });
const cancelledSessions = await prisma.session.count({ where: { status: 'CANCELLED' } });
const totalLearners = await prisma.user.count({ where: { role: 'LEARNER' } });
const totalCertificates = await prisma.certificate.count();

logger.info('\n======= SEEDING COMPLETE =============================');
logger.info('\n🔑 DEV SUPER USER ACCOUNTS (use these for testing UIs):');
logger.info('  ★ ADMIN:    calvince@africaictcsnetwork.org  /  admin123');
logger.info('  ★ ADMIN:    tsailunenterprises@gmail.com     /  Test123!@#  ← REAL inbox, use to verify email/PDF/Cloudinary delivery');
logger.info('  ★ TRAINER:  trainer@aicn.africa              /  Test123!@#  ← super trainer (rich QA data)');
logger.info('  ★ LEARNER:  learner@aicn.africa              /  Test123!@#  ← super learner (rich history)');
logger.info('\n📋 Mock accounts (additional data only):');
logger.info('  TRAINER:  amara.osei@aicn.org               /  trainer123');
logger.info('  TRAINER:  fatuma.njeri@aicn.org             /  trainer123');
logger.info('  TRAINER:  brian.otieno@aicn.org             /  trainer123');
logger.info('  LEARNER:  dev@example.com                   /  learner123');
logger.info('  LEARNER:  akinyi@example.com                /  learner123');
logger.info('  LEARNER:  juma@example.com                  /  learner123');
logger.info('  LEARNER:  wanjiku@example.com               /  learner123');
logger.info('  LEARNER:  emmanuel@example.com              /  learner123');
logger.info('  LEARNER:  zawadi@example.com                /  learner123');
logger.info('  PENDING:  moses.kamau@example.com           /  pending123');
logger.info('\n📊 Platform Summary:');
logger.info(`  Total Sessions:     ${totalSessions}`);
logger.info(`  Completed:          ${completedSessions}`);
logger.info(`  Scheduled:          ${scheduledSessions}`);
logger.info(`  In Progress:        ${inProgressSessions}`);
logger.info(`  Cancelled:          ${cancelledSessions}`);
logger.info(`  Total Learners:     ${totalLearners}`);
logger.info(`  Certificates:       ${totalCertificates}`);
logger.info('======================================================\n');
}

main()
  .catch(e => { logger.error('❌ Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });