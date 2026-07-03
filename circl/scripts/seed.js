import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';

// Check if credentials JSON exists, otherwise skip
const SERVICE_ACCOUNT_PATH = './firebase-credentials.json';

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.log('⚠️  firebase-credentials.json not found. Skipping seeding script.');
  console.log('To run the seeder, download your Firebase Service Account JSON key, save it here, and execute "node scripts/seed.js"');
  process.exit(0);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const seedData = async () => {
  console.log('🌱 Starting database seed operations...');

  // 1. Seed demo posts
  const posts = [
    {
      authorName: 'Anish Kapoor',
      authorPhoto: '',
      verified: true,
      content: 'Found a set of keys near the main gate. Please contact me if you\'ve lost them.',
      category: 'general',
      city: 'Mumbai',
      area: 'Bandra',
      colony: 'Hill View',
      society: 'Sunshine Apts',
      likes: [],
      saves: [],
      reactions: {},
      createdAt: new Date(),
    },
    {
      authorName: 'Sneha Patil',
      authorPhoto: '',
      verified: true,
      content: 'Electricians are working on the Phase 1 street light lines. Expect short power fluctuations in Block A.',
      category: 'power_water',
      city: 'Mumbai',
      area: 'Bandra',
      colony: 'Hill View',
      society: 'Sunshine Apts',
      likes: ['user_2'],
      saves: [],
      reactions: { user_2: 'pray' },
      createdAt: new Date(Date.now() - 3600000),
    }
  ];

  for (const post of posts) {
    await db.collection('posts').add(post);
  }
  console.log('✅ Seeded demo posts successfully.');

  // 2. Seed businesses
  const businesses = [
    {
      name: 'Verma Kirana & General Store',
      category: 'Grocery',
      rating: 4.8,
      reviewCount: 1,
      address: 'Shop 2, Hill View Market, Bandra',
      whatsapp: '919876543210',
      logo: '',
      verified: true,
      description: 'Free home delivery within Sunshine Apartments. Fresh milk, bread, vegetables, and daily household items.',
      services: ['Home Delivery', 'Monthly Credit Available', 'Fresh Vegetables'],
      timings: '8:00 AM - 10:00 PM',
      city: 'Mumbai',
      area: 'Bandra',
      colony: 'Hill View',
      society: 'Sunshine Apts',
      createdAt: new Date(),
    }
  ];

  for (const biz of businesses) {
    await db.collection('businesses').add(biz);
  }
  console.log('✅ Seeded demo local businesses successfully.');

  console.log('🎉 Seeding completed successfully!');
  process.exit(0);
};

seedData().catch((err) => {
  console.error('❌ Seeding failed with error:', err);
  process.exit(1);
});
