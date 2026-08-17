const { execSync } = require('child_process');

console.log('[BUILD RESILIENT] Starting build pipeline...');

// 1. Always generate Prisma client (so type checks succeed)
try {
  console.log('[BUILD] Generating Prisma Client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
} catch (err) {
  console.error('[BUILD FATAL] Prisma generation failed:', err.message);
  process.exit(1);
}

// 2. Attempt DB synchronization & Seeding. Skip if DB is unreachable.
try {
  console.log('[BUILD] Syncing schema with database...');
  execSync('npx prisma db push --accept-data-loss', { stdio: 'inherit', timeout: 5000 });
  
  console.log('[BUILD] Running initial database seeds...');
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
  console.log('[BUILD] Database sync completed successfully.');
} catch (err) {
  console.warn('[BUILD WARNING] Database server is unreachable or timed out. Bypassing DB migrations, proceeding to build in resilient offline mode.');
}

// 3. Run Next.js production build
try {
  console.log('[BUILD] Executing Next.js production compile...');
  execSync('npx next build', { stdio: 'inherit' });
  console.log('[BUILD] Next.js build completed successfully.');
} catch (err) {
  console.error('[BUILD FATAL] Next.js build compilation failed:', err.message);
  process.exit(1);
}
