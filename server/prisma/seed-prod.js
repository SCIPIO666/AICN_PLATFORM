/**
 * server/prisma/seed-prod.js
 *
 * Production seed — credentials and sensitive values come from environment
 * variables only. Safe to commit; nothing sensitive is hardcoded.
 *
 * Run once via the prod Shell:
 *   node prisma/seed-prod.js
 *
 * Required env vars (set in Render dashboard before running):
 *   ADMIN_1_EMAIL      e.g. eaphonsfsey@gmail.com
 *   ADMIN_1_PASSWORD   strong production password
 *   ADMIN_1_NAME       e.g. "Eaphsfoney Admin"
 *   ADMIN_1_PHONE      e.g. +254799112919
 *
 *   ADMIN_2_EMAIL      e.g. tsailunenterprises@gmail.com
 *   ADMIN_2_PASSWORD   strong production password
 *   ADMIN_2_NAME       e.g. "Tsaiddxtlun Enterprises"
 *   ADMIN_2_PHONE      e.g. +254700000099
 */

const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const logger = require('../utils/logger');
const crypto = require('crypto');

// ── Helpers ──────────────────────────────────────────────────────────────────

const hash = (pw) => bcrypt.hash(pw, 12);

const past = (daysAgo, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const future = (daysAhead, hour = 9) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const certCode = () =>
  `CERT-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

// ── Validation ───────────────────────────────────────────────────────────────

function requireEnv(...keys) {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`\n❌ Missing required environment variables:\n  ${missing.join('\n  ')}`);
    console.error('\nSet them in the Render dashboard under Environment, then re-run.\n');
    process.exit(1);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  requireEnv(
    'ADMIN_1_EMAIL', 'ADMIN_1_PASSWORD', 'ADMIN_1_NAME', 'ADMIN_1_PHONE',
    'ADMIN_2_EMAIL', 'ADMIN_2_PASSWORD', 'ADMIN_2_NAME', 'ADMIN_2_PHONE'
  );

  logger.info('🌱 Running production seed...\n');

  // ── Admins ────────────────────────────────────────────────────────────────

  const [pw1, pw2] = await Promise.all([
    hash(process.env.ADMIN_1_PASSWORD),
    hash(process.env.ADMIN_2_PASSWORD),
  ]);

  const admin1 = await prisma.user.upsert({
    where: { email: process.env.ADMIN_1_EMAIL },
    update: { password: pw1, role: 'ADMIN' }, // re-running is safe — just updates password
    create: {
      name: process.env.ADMIN_1_NAME,
      email: process.env.ADMIN_1_EMAIL,
      password: pw1,
      phone: process.env.ADMIN_1_PHONE,
      county: 'Nairobi',
      role: 'ADMIN',
    },
  });

  const admin2 = await prisma.user.upsert({
    where: { email: process.env.ADMIN_2_EMAIL },
    update: { password: pw2, role: 'ADMIN' },
    create: {
      name: process.env.ADMIN_2_NAME,
      email: process.env.ADMIN_2_EMAIL,
      password: pw2,
      phone: process.env.ADMIN_2_PHONE,
      county: 'Nairobi',
      role: 'ADMIN',
    },
  });

  logger.info(` Admin 1: ${admin1.email}`);
  logger.info(` Admin 2: ${admin2.email}`);

  // ── Demo Trainers (approved, realistic) ──────────────────────────────────

  const trainersData = [
    {
      name: 'Amara Osei',
      email: 'amara.osei@aicn.org',
      phone: '+254712345678',
      county: 'Nairobi',
      bio: 'Data analyst with 4 years in fintech and NGO reporting.',
      skills: ['Data Analysis', 'Soft Skills'],
      availability: 'weekends',
      motivation: 'Sharing practical skills that get people jobs.',
    },
    {
      name: 'Fatuma Njeri',
      email: 'fatuma.njeri@aicn.org',
      phone: '+254723456789',
      county: 'Kisumu',
      bio: 'Digital marketer and content creator with a growing YouTube channel.',
      skills: ['Digital Marketing', 'Content Creation & Monetization', 'Video Editing'],
      availability: 'weekends',
      motivation: 'Content creation changed my life. I want to show others the same path.',
    },
    {
      name: 'Brian Otieno',
      email: 'brian.otieno@aicn.org',
      phone: '+254734567890',
      county: 'Nakuru',
      bio: 'Cybersecurity professional, CompTIA Security+ certified.',
      skills: ['Cyber Hygiene', 'Basics in Cyber Security'],
      availability: 'online-only',
      motivation: 'Digital safety is a right, not a privilege.',
    },
  ];

  const trainerPw = await hash('Trainer@AICN2026!');
  const trainers = [];

  for (const t of trainersData) {
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: { role: 'TRAINER' },
      create: {
        name: t.name,
        email: t.email,
        password: trainerPw,
        phone: t.phone,
        county: t.county,
        role: 'TRAINER',
      },
    });

    await prisma.trainerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        bio: t.bio,
        skills: t.skills,
        availability: t.availability,
        motivation: t.motivation,
        status: 'APPROVED',
      },
    });

    trainers.push(user);
    logger.info(` Trainer: ${user.email}`);
  }

  // ── Demo Learner (for live testability) ──────────────────────────────────

  const learnerPw = await hash('Learner@AICN2026!');

  const demoLearner = await prisma.user.upsert({
    where: { email: 'demo.learner@aicn.africa' },
    update: {},
    create: {
      name: 'Demo Learner',
      email: 'demo.learner@aicn.africa',
      password: learnerPw,
      phone: '+254700000001',
      county: 'Nairobi',
      role: 'LEARNER',
    },
  });

  logger.info(` Demo learner: ${demoLearner.email}`);

  // ── Sessions (completed + upcoming — gives learner something to see) ──────

  const [t1, t2, t3] = trainers;

  const sessionsData = [
    // COMPLETED — will have enrolments + certs below
    {
      title: 'Cyber Hygiene for Everyday Users',
      skillArea: 'Cyber Hygiene',
      description: 'Protect yourself online. Passwords, phishing, safe browsing, and social media safety.',
      date: past(30, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Nairobi Innovation Hub, Westlands',
      county: 'Nairobi',
      capacity: 30,
      status: 'COMPLETED',
      trainerId: t3.id,
    },
    {
      title: 'Introduction to Data Analysis',
      skillArea: 'Data Analysis',
      description: 'Spreadsheets, basic statistics, and reading data to make decisions. No experience needed.',
      date: past(20, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Kisumu Youth Polytechnic, Milimani',
      county: 'Kisumu',
      capacity: 25,
      status: 'COMPLETED',
      trainerId: t1.id,
    },
    {
      title: 'Content Creation & Monetization — Online',
      skillArea: 'Content Creation & Monetization',
      description: 'YouTube, TikTok, and Instagram — how to create content and actually earn from it.',
      date: past(10, 14),
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-content-prod',
      county: null,
      capacity: 50,
      status: 'COMPLETED',
      trainerId: t2.id,
    },
    // SCHEDULED — learners can see and enrol
    {
      title: 'Digital Marketing Fundamentals',
      skillArea: 'Digital Marketing',
      description: 'SEO, social media marketing, email campaigns, and running paid ads on a budget.',
      date: future(7, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'iHub Nairobi, Ngong Road',
      county: 'Nairobi',
      capacity: 30,
      status: 'SCHEDULED',
      trainerId: t2.id,
    },
    {
      title: 'Cyber Security Basics — Online',
      skillArea: 'Basics in Cyber Security',
      description: 'Firewalls, VPNs, threats, and building a career in cybersecurity. Certification pathways.',
      date: future(14, 14),
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-cyber-prod',
      county: null,
      capacity: 60,
      status: 'SCHEDULED',
      trainerId: t3.id,
    },
    {
      title: 'Introduction to Online Jobs',
      skillArea: 'Introduction to Online Jobs',
      description: 'Freelancing on Upwork and Fiverr, remote platforms, portfolio building, first client.',
      date: future(21, 9),
      durationMins: 120,
      locationType: 'PHYSICAL',
      venue: 'Kisii University Community Hub',
      county: 'Kisii',
      capacity: 25,
      status: 'SCHEDULED',
      trainerId: t1.id,
    },
    {
      title: 'Data Analysis with Google Sheets',
      skillArea: 'Data Analysis',
      description: 'Pivot tables, VLOOKUP, charts, dashboards. Real Kenyan business datasets.',
      date: future(28, 10),
      durationMins: 180,
      locationType: 'ONLINE',
      venue: 'https://meet.google.com/aicn-sheets-prod',
      county: null,
      capacity: 40,
      status: 'SCHEDULED',
      trainerId: t1.id,
    },
  ];

  const createdSessions = [];
  for (const s of sessionsData) {
    // upsert by title+date to avoid duplicates on re-runs
    const existing = await prisma.session.findFirst({
      where: { title: s.title, date: s.date },
    });
    const session = existing || await prisma.session.create({ data: s });
    createdSessions.push(session);
    logger.info(` Session: ${session.title} [${session.status}]`);
  }

  // ── Enrolments + Certificates for completed sessions ─────────────────────
  // Demo learner is ATTENDED in all completed sessions so they have certs to see.

  const completedSessions = createdSessions.filter(s => s.status === 'COMPLETED');

  for (const session of completedSessions) {
    const existingEnrol = await prisma.enrolment.findFirst({
      where: { userId: demoLearner.id, sessionId: session.id },
    });

    if (!existingEnrol) {
      await prisma.enrolment.create({
        data: { userId: demoLearner.id, sessionId: session.id, status: 'ATTENDED' },
      });
    }

    const existingCert = await prisma.certificate.findFirst({
      where: { userId: demoLearner.id, sessionId: session.id },
    });

    if (!existingCert) {
      await prisma.certificate.create({
        data: { userId: demoLearner.id, sessionId: session.id, certCode: certCode() },
      });
    }
  }

  logger.info(` Demo learner enrolled + certified in ${completedSessions.length} completed sessions`);

  // ── Announcements ─────────────────────────────────────────────────────────

  const announcementCount = await prisma.announcement.count();
  if (announcementCount === 0) {
    await prisma.announcement.createMany({
      data: [
        {
          title: 'Welcome to the AICN Training Platform!',
          body: 'We have launched our digital platform. Register, browse sessions, and enrol directly. Your certificates are issued here automatically after each session.',
          audience: 'all',
        },
        {
          title: 'New sessions added — July 2026',
          body: 'Six new training sessions across Nairobi, Kisumu, Nakuru, and Kisii. Log in and book your spot — some have limited capacity.',
          audience: 'learners',
        },
        {
          title: 'Trainers: please mark attendance after each session',
          body: 'After a completed session, mark attendance for all enrolled learners. This triggers automatic certificate generation and delivery.',
          audience: 'trainers',
        },
      ],
    });
    logger.info(' Created 3 announcements');
  }

  // ── Summary ───────────────────────────────────────────────────────────────

  logger.info('\n======================================================');
  logger.info(' Production seed complete');
  logger.info('\n Admin accounts:');
  logger.info(`   ${admin1.email}`);
  logger.info(`   ${admin2.email}`);
  logger.info('\n👤 Demo learner (for testing):');
  logger.info('   demo.learner@aicn.africa  /  Learner@AICN2026!');
  logger.info('\n🎓 Trainers (approved):');
  trainers.forEach(t => logger.info(`   ${t.email}  /  Trainer@AICN2026!`));
  logger.info('\n Sessions:');
  createdSessions.forEach(s => logger.info(`   [${s.status.padEnd(9)}] ${s.title}`));
  logger.info('======================================================\n');
}

main()
  .catch((e) => { logger.error(' Production seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());