// prisma/seed-super-trainer.js
// Run: node prisma/seed-super-trainer.js
// This script adds rich session data to the existing super trainer account

const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const logger = require('../utils/logger');
const crypto = require('crypto');

// ========== Helpers ==================
const generateCertCode = () => {
  return `CERT-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
};

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

// ========== Main ==================

async function main() {
  logger.info('🌱 Seeding additional super trainer data...\n');

  // Find the super trainer
  const superTrainer = await prisma.user.findUnique({
    where: { email: 'trainer@aicn.africa' },
  });

  if (!superTrainer) {
    logger.error('❌ Super trainer not found! Please run the main seed first.');
    logger.info('   Email: trainer@aicn.africa');
    process.exit(1);
  }

  logger.info(`✅ Found super trainer: ${superTrainer.name} (${superTrainer.id})`);

  // Get all learners for enrolments
  const learners = await prisma.user.findMany({
    where: { role: 'LEARNER' },
  });

  if (learners.length === 0) {
    logger.error('❌ No learners found! Please run the main seed first.');
    process.exit(1);
  }

  logger.info(`✅ Found ${learners.length} learners`);

  // Get the super learner if exists
  const superLearner = await prisma.user.findUnique({
    where: { email: 'learner@aicn.africa' },
  });

  // ============ SESSION DATA DEFINITIONS ============

  const completedSessions = [
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

  const scheduledSessions = [
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
    // Almost full session
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
      enrolCount: 29, // Almost full
    },
    // Full session
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
      enrolCount: 30, // Full
    },
    // Empty session
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
      enrolCount: 0, // Empty
    },
  ];

  const cancelledSessions = [
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

  const inProgressSession = {
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

  // ============ CREATE SESSIONS ============

  let totalSessions = 0;
  let totalEnrolments = 0;
  let totalCertificates = 0;

  // Helper to create enrolments with mixed statuses
  function getEnrolmentStatuses(totalEnrolments, attendedCount, absentCount) {
    const statuses = [];
    
    // Add ATTENDED
    for (let i = 0; i < attendedCount; i++) {
      statuses.push('ATTENDED');
    }
    
    // Add ABSENT
    for (let i = 0; i < absentCount; i++) {
      statuses.push('ABSENT');
    }
    
    // Add ENROLLED (for sessions that are still upcoming)
    const remaining = totalEnrolments - attendedCount - absentCount;
    for (let i = 0; i < remaining; i++) {
      statuses.push('ENROLLED');
    }
    
    return statuses;
  }

  async function createSessionWithEnrolments(sessionData, isPast = true) {
    const date = sessionData.daysAgo !== undefined 
      ? past(sessionData.daysAgo, sessionData.hour)
      : future(sessionData.daysAhead, sessionData.hour);

    // Determine enrolment statuses based on session status
    let attendedCount = 0;
    let absentCount = 0;
    let enrolledCount = 0;
    let enrolStatuses = [];

    if (sessionData.status === 'COMPLETED') {
      // For completed sessions: mix of ATTENDED and ABSENT
      const total = sessionData.enrolCount;
      attendedCount = Math.floor(total * 0.7); // 70% attended
      absentCount = total - attendedCount; // 30% absent
      enrolStatuses = getEnrolmentStatuses(total, attendedCount, absentCount);
    } else if (sessionData.status === 'CANCELLED') {
      // For cancelled sessions: all CANCELLED
      enrolStatuses = Array(sessionData.enrolCount).fill('CANCELLED');
    } else {
      // For SCHEDULED and IN_PROGRESS: all ENROLLED
      enrolStatuses = Array(sessionData.enrolCount).fill('ENROLLED');
    }

    // Create the session
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

    totalSessions++;

    // Create enrolments
    const learnersToEnrol = [...learners];
    
    // Add super learner if exists
    if (superLearner) {
      learnersToEnrol.push(superLearner);
    }

    // Shuffle learners and take the needed amount
    const shuffled = learnersToEnrol.sort(() => 0.5 - Math.random());
    const selectedLearners = shuffled.slice(0, sessionData.enrolCount);

    for (let i = 0; i < selectedLearners.length; i++) {
      const status = enrolStatuses[i] || 'ENROLLED';
      await prisma.enrolment.create({
        data: {
          userId: selectedLearners[i].id,
          sessionId: session.id,
          status: status,
        },
      });
      totalEnrolments++;
    }

    return session;
  }

  // Create COMPLETED sessions
  logger.info('\n📝 Creating COMPLETED sessions...');
  for (const sessionData of completedSessions) {
    await createSessionWithEnrolments(sessionData, true);
  }

  // Create SCHEDULED sessions
  logger.info('📝 Creating SCHEDULED sessions...');
  for (const sessionData of scheduledSessions) {
    await createSessionWithEnrolments(sessionData, false);
  }

  // Create CANCELLED sessions
  logger.info('📝 Creating CANCELLED sessions...');
  for (const sessionData of cancelledSessions) {
    await createSessionWithEnrolments(sessionData, true);
  }

  // Create IN_PROGRESS session
  logger.info('📝 Creating IN_PROGRESS session...');
  await createSessionWithEnrolments(inProgressSession, false);

  // ============ ISSUE CERTIFICATES ============

  logger.info('\n📜 Issuing certificates for attended learners...');

  // Get all completed sessions for super trainer
  const completedSessionsForCert = await prisma.session.findMany({
    where: {
      trainerId: superTrainer.id,
      status: 'COMPLETED',
    },
    include: {
      enrolments: {
        where: {
          status: 'ATTENDED',
        },
        include: {
          user: true,
        },
      },
    },
  });

  let certificatesIssued = 0;

  for (const session of completedSessionsForCert) {
    // Skip if no attendees
    if (session.enrolments.length === 0) continue;

    for (const enrolment of session.enrolments) {
      // Check if certificate already exists
      const existingCert = await prisma.certificate.findFirst({
        where: {
          userId: enrolment.userId,
          sessionId: session.id,
        },
      });

      if (!existingCert) {
        await prisma.certificate.create({
          data: {
            userId: enrolment.userId,
            sessionId: session.id,
            certCode: generateCertCode(),
          },
        });
        certificatesIssued++;
      }
    }
  }

  totalCertificates = certificatesIssued;

  // ============ STATS ============

  const stats = await prisma.$queryRaw`
    SELECT 
      COUNT(DISTINCT s.id) as total_sessions,
      COUNT(DISTINCT CASE WHEN s.status = 'COMPLETED' THEN s.id END) as completed_sessions,
      COUNT(DISTINCT CASE WHEN s.status = 'SCHEDULED' THEN s.id END) as scheduled_sessions,
      COUNT(DISTINCT CASE WHEN s.status = 'IN_PROGRESS' THEN s.id END) as in_progress_sessions,
      COUNT(DISTINCT CASE WHEN s.status = 'CANCELLED' THEN s.id END) as cancelled_sessions,
      COUNT(DISTINCT e."userId") as total_learners,
      COUNT(DISTINCT CASE WHEN e.status = 'ATTENDED' THEN e."userId" END) as attended_learners,
      COUNT(DISTINCT CASE WHEN e.status = 'ABSENT' THEN e."userId" END) as absent_learners,
      COUNT(DISTINCT c.id) as total_certificates
    FROM "Session" s
    LEFT JOIN "Enrolment" e ON s.id = e."sessionId"
    LEFT JOIN "Certificate" c ON s.id = c."sessionId"
    WHERE s."trainerId" = ${superTrainer.id}
  `;

  // ============ SUMMARY ============

  logger.info('\n======= SUPER TRAINER SEEDING COMPLETE =============================');
  logger.info('\n🔑 SUPER TRAINER ACCOUNT:');
  logger.info('  Email: trainer@aicn.africa');
  logger.info('  Password: Test123!@#');
  logger.info('\n📊 SESSION STATISTICS:');
  logger.info(`  Total Sessions:  ${stats[0].total_sessions}`);
  logger.info(`  Completed:       ${stats[0].completed_sessions}`);
  logger.info(`  Scheduled:       ${stats[0].scheduled_sessions}`);
  logger.info(`  In Progress:     ${stats[0].in_progress_sessions}`);
  logger.info(`  Cancelled:       ${stats[0].cancelled_sessions}`);
  logger.info('\n👥 LEARNER STATISTICS:');
  logger.info(`  Total Learners:  ${stats[0].total_learners}`);
  logger.info(`  Attended:        ${stats[0].attended_learners}`);
  logger.info(`  Absent:          ${stats[0].absent_learners}`);
  logger.info('\n📜 CERTIFICATE STATISTICS:');
  logger.info(`  Certificates:    ${stats[0].total_certificates}`);
  logger.info('\n📊 SESSION BREAKDOWN:');
  logger.info(`  Total New Sessions:   ${totalSessions}`);
  logger.info(`  Total Enrolments:     ${totalEnrolments}`);
  logger.info(`  Certificates Issued:  ${totalCertificates}`);
  logger.info('==============================================================\n');
}

main()
  .catch(e => {
    logger.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });