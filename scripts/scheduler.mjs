const site = (process.env.SITE_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');
const secret = process.env.CRON_SECRET;
if (!secret) {
  console.error('CRON_SECRET is required.');
  process.exit(1);
}
async function run() {
  const started = new Date().toISOString();
  try {
    const res = await fetch(`${site}/api/cron/news`, { headers: { Authorization: `Bearer ${secret}` } });
    const text = await res.text();
    console.log(`[${started}] ${res.status} ${text}`);
  } catch (error) {
    console.error(`[${started}] scheduler error`, error);
  }
}
await run();
setInterval(run, 30 * 60 * 1000);
console.log(`News scheduler active. Calling ${site} every 30 minutes.`);
