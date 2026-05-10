/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(process.cwd(), '.env.local'));

const MONGODB_URI = (process.env.MONGODB_URI || '').trim();
if (!MONGODB_URI) {
  console.error('MONGODB_URI is missing in .env.local');
  process.exit(1);
}

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: 'zaybaash' });

  const db = mongoose.connection.db;

  console.log('Deleting all products...');
  const prodResult = await db.collection('products').deleteMany({});
  console.log(`Deleted ${prodResult.deletedCount} products.`);

  console.log('Deleting all categories...');
  const catResult = await db.collection('categories').deleteMany({});
  console.log(`Deleted ${catResult.deletedCount} categories.`);

  console.log('Done.');
  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error(err);
  try { await mongoose.disconnect(); } catch {}
  process.exit(1);
});
