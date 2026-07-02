
// Run: node prisma/seed-cert-test-sessions.js
// adds 5 sessions specifically for testing certificate issuance


const { prisma } = require('../config/db');
const logger = require('../utils/logger');
const crypto = require('crypto');

// ========== Helpers ==================
const past = (daysAgo, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d;
};

// ========== Main ===================

async function main() {
  logger.info(' Adding 5 certificate-test sessions...\n');

  // the super trainer (trainer@aicn.africa)
  const superTrainer = await prisma.user.findUnique({
    where: { email: 'trainer@aicn.africa' },
  });

  if (!superTrainer) {
    logger.error(' Super trainer not found! Please run the main seed first.');
    logger.info('   Email: trainer@aicn.africa');
    process.exit(1);
  }

  logger.info(` Found super trainer: ${superTrainer.name} (${superTrainer.id})`);

  //  all learners for enrolments
  const learners = await prisma.user.findMany({
    where: { role: 'LEARNER' },
  });

  if (learners.length < 3) {
    logger.error(' Not enough learners found! Please run the main seed first.');
    process.exit(1);
  }

  logger.info(` Found ${learners.length} learners`);

  // Get the super learner if exists
  const superLearner = await prisma.user.findUnique({
    where: { email: 'learner@aicn.africa' },
  });

  // Get the Tsailun admin for testing
  const tsailunAdmin = await prisma.user.findUnique({
    where: { email: 'tsailunenterprises@gmail.com' },
  });

  // ============ 5 TEST SESSIONS ============

  const testSessions = [
    {
      title: 'Certificate Test Session 1 — Data Analysis Fundamentals',
      skillArea: 'Data Analysis',
      description: 'TEST SESSION: Complete introduction to data analysis. This session is marked COMPLETED with ATTENDED enrolments but NO certificates issued yet. Use this to test batch certificate issuance.',
      daysAgo: 30,
      hour: 9,
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Nairobi Innovation Hub',
      county: 'Nairobi',
      capacity: 20,
      status: 'COMPLETED',
      enrolCount: 5,
    },
    {
      title: 'Certificate Test Session 2 — Digital Marketing',
      skillArea: 'Digital Marketing',
      description: 'TEST SESSION: SEO, social media marketing, and email campaigns. Marked COMPLETED with ATTENDED enrolments. No certificates issued yet.',
      daysAgo: 25,
      hour: 14,
      durationMins: 150,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/test-session-2',
      county: null,
      capacity: 30,
      status: 'COMPLETED',
      enrolCount: 4,
    },
    {
      title: 'Certificate Test Session 3 — Cyber Hygiene',
      skillArea: 'Cyber Hygiene',
      description: 'TEST SESSION: Learn to protect yourself from cyber threats. COMPLETED session with ATTENDED enrolments. Ready for certificate issuance.',
      daysAgo: 20,
      hour: 10,
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'iHub Nairobi',
      county: 'Nairobi',
      capacity: 25,
      status: 'COMPLETED',
      enrolCount: 3,
    },
    {
      title: 'Certificate Test Session 4 — Soft Skills',
      skillArea: 'Soft Skills',
      description: 'TEST SESSION: Communication, leadership, and professional etiquette. COMPLETED session ready for certificate testing.',
      daysAgo: 15,
      hour: 9,
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Kisumu Youth Polytechnic',
      county: 'Kisumu',
      capacity: 30,
      status: 'COMPLETED',
      enrolCount: 6,
    },
    {
      title: 'Certificate Test Session 5 — Content Creation',
      skillArea: 'Content Creation & Monetization',
      description: 'TEST SESSION: Create and monetize content on YouTube and TikTok. COMPLETED session with multiple ATTENDED learners. Batch issue ready.',
      daysAgo: 10,
      hour: 10,
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/test-session-5',
      county: null,
      capacity: 40,
      status: 'COMPLETED',
      enrolCount: 8,
    },
  ];

  // Helper to create enrolments with all ATTENDED status (for certificate testing)
  function getEnrolmentStatuses(totalEnrolments) {
    return Array(totalEnrolments).fill('ATTENDED');
  }

  // Helper to get random learners
  function getRandomLearners(learnerList, count, excludeIds = []) {
    const available = learnerList.filter(l => !excludeIds.includes(l.id));
    const shuffled = available.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // Track created sessions for reporting
  const createdSessions = [];
  let totalEnrolments = 0;

  // Create sessions
  for (const sessionData of testSessions) {
    const date = past(sessionData.daysAgo, sessionData.hour);
    const statuses = getEnrolmentStatuses(sessionData.enrolCount);

    // Select learners
    const learnersList = [...learners];
    
    // Add super learner if exists
    if (superLearner) {
      // Only add if not already in the list
      if (!learnersList.some(l => l.id === superLearner.id)) {
        learnersList.push(superLearner);
      }
    }

    // Add Tsailun admin if exists
    if (tsailunAdmin) {
      if (!learnersList.some(l => l.id === tsailunAdmin.id)) {
        learnersList.push(tsailunAdmin);
      }
    }

    const selectedLearners = getRandomLearners(learnersList, sessionData.enrolCount);

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

    // Create enrolments (all ATTENDED)
    for (let i = 0; i < selectedLearners.length; i++) {
      await prisma.enrolment.create({
        data: {
          userId: selectedLearners[i].id,
          sessionId: session.id,
          status: statuses[i] || 'ATTENDED',
        },
      });
      totalEnrolments++;
    }

    createdSessions.push({
      id: session.id,
      title: session.title,
      enrolCount: selectedLearners.length,
    });

    logger.info(` Created session: ${session.title} (${selectedLearners.length} enrolments, ID: ${session.id})`);
  }

  // ============ SUMMARY ============

  logger.info('\n======= CERTIFICATE TEST SESSIONS ADDED =============================');
  logger.info(`\n Added ${createdSessions.length} test sessions:`);
  
  createdSessions.forEach((session, index) => {
    logger.info(`  ${index + 1}. ${session.title}`);
    logger.info(`     Session ID: ${session.id}`);
    logger.info(`     Enrolments: ${session.enrolCount} (all ATTENDED)`);
    logger.info(`     Status: COMPLETED (ready for certificates)\n`);
  });

  logger.info('\n How to test certificate issuance:');
  logger.info('  1. Login as: calvince@africaictcsnetwork.org / admin123');
  logger.info('  2. Go to Admin → Certificates');
  logger.info('  3. Click "Batch Issue"');
  logger.info('  4. Paste one of the Session IDs above');
  logger.info('  5. Verify certificates are generated with PDFs and emails');
  logger.info('\n For email verification, check the Tsailun admin email:');
  logger.info('  Email: tsailunenterprises@gmail.com');
  logger.info('  Password: Test123!@#');
  logger.info('\n PDFs will be saved locally to:');
  logger.info('  ./uploads/certificates/');
  logger.info('==============================================================\n');
}

main()
  .catch(e => { logger.error(' Seed failed:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });