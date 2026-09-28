require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Post = require('../models/Post');

const DEMO_POSTS = [
  {
    title: 'Black Backpack',
    description: 'Black SwissGear backpack left in the main library reading room.',
    type: 'Lost',
    category: 'Bags',
    location: 'Main Library, 2nd Floor',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    contactName: 'John Doe',
    contactEmail: 'jdoe@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/black-backpack.svg',
  },
  {
    title: 'iPhone 13',
    description: 'Found a black iPhone 13 with a clear case near the cafeteria entrance.',
    type: 'Found',
    category: 'Electronics',
    location: 'Cafeteria',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    contactName: 'Security Office',
    contactEmail: 'security@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/smartphone.svg',
  },
  {
    title: 'AirPods Pro',
    description: 'Found white AirPods Pro in the CS Block Lab 2.',
    type: 'Found',
    category: 'Electronics',
    location: 'CS Block, Lab 2',
    date: new Date(),
    contactName: 'Jane Smith',
    contactEmail: 'jsmith@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/airpods.jpg',
  },
  {
    title: 'Student ID Card - 2nd Year',
    description: 'Lost my ID card (Name: Alice Kumar, ID: 23AD055) around the Mech building.',
    type: 'Lost',
    category: 'ID Cards',
    location: 'Mech Building',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    contactName: 'Alice Kumar',
    contactEmail: '23ad055@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/id-card.svg',
  },
  {
    title: 'Black Leather Wallet',
    description: 'Found a black men\'s wallet mostly empty except for some cafe receipts.',
    type: 'Found',
    category: 'Wallet',
    location: 'Auditorium',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    contactName: 'Lost & Found Desk',
    contactEmail: 'admin@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/wallet.svg',
  },
  {
    title: 'College Notebook (Physics)',
    description: 'Blue spiral notebook with Physics notes. Important for midterms!',
    type: 'Lost',
    category: 'Books',
    location: 'Science Block, Room 104',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    contactName: 'Bob Williams',
    contactEmail: 'bwilliams@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/notebook.svg',
  },
  {
    title: 'Casio Scientific Calculator',
    description: 'Found a silver Casio fx-991EX scientific calculator on desk row 3.',
    type: 'Found',
    category: 'Electronics',
    location: 'Exam Hall B',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    contactName: 'Exam Invigilator',
    contactEmail: 'exams@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/calculator.svg',
  },
  {
    title: 'Honda Bike Key',
    description: 'Lost a single bike key with a red Honda keychain attached.',
    type: 'Lost',
    category: 'Keys',
    location: 'Parking Lot A',
    date: new Date(),
    contactName: 'Charlie Davis',
    contactEmail: 'cdavis@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/bike-key.svg',
  },
  {
    title: 'Blue Milton Water Bottle',
    description: 'Found a 1L blue stainless steel water bottle near the sports ground.',
    type: 'Found',
    category: 'Accessories',
    location: 'Sports Ground',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    contactName: 'Sports Dept',
    contactEmail: 'sports@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/water-bottle.svg',
  },
  {
    title: 'Ray-Ban Reading Spectacles',
    description: 'Lost my reading glasses, black frame, in a brown case.',
    type: 'Lost',
    category: 'Accessories',
    location: 'Library',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    contactName: 'Diana Prince',
    contactEmail: 'dprince@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/spectacles.svg',
  },
  {
    title: 'SanDisk 64GB USB Drive',
    description: 'Found a silver dual-drive SanDisk USB. Plugged into lab computer 12.',
    type: 'Found',
    category: 'Electronics',
    location: 'CS Lab 1',
    date: new Date(),
    contactName: 'Lab Assistant',
    contactEmail: 'cslab@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/usb-drive.jpg',
  },
  {
    title: 'Grey College Backpack',
    description: 'Left my grey Puma college bag near the basketball court.',
    type: 'Lost',
    category: 'Bags',
    location: 'Basketball Court',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    contactName: 'Evan Wright',
    contactEmail: 'ewright@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/college-bag.svg',
  },
  {
    title: 'Engineering Mathematics Textbook',
    description: 'Found "Higher Engineering Mathematics" by B.S. Grewal lying on a bench.',
    type: 'Found',
    category: 'Books',
    location: 'Main Ground Benches',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    contactName: 'Fiona Gallagher',
    contactEmail: 'fgallagher@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/textbook.svg',
  },
  {
    title: 'Logitech Wireless Mouse',
    description: 'Lost my black Logitech M330 silent mouse.',
    type: 'Lost',
    category: 'Electronics',
    location: 'ECE Block',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    contactName: 'George Harris',
    contactEmail: 'gharris@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/wireless-mouse.svg',
  },
  {
    title: 'Wired Earphones - Sony',
    description: 'Found black wired Sony earphones tangled on a chair.',
    type: 'Found',
    category: 'Electronics',
    location: 'Seminar Hall',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    contactName: 'Event Coordinator',
    contactEmail: 'events@kpriet.ac.in',
    status: 'Active',
    isDemo: true,
    imageUrl: '/demo-items/earphones.svg',
  },
];

const seedDemoPosts = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lost_and_found';
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // 1. Delete broken/test HP laptop posts or any old demo posts without isDemo set properly
    console.log('Cleaning up old test items...');
    await Post.deleteMany({ title: { $regex: /HP Laptop/i } });
    await Post.deleteMany({ title: { $regex: /HP Victus/i } });
    await Post.deleteMany({ title: { $regex: /laptop/i }, isDemo: { $exists: false } }); // clean up any old test laptops
    
    // Check if new demo data exists
    const demoCount = await Post.countDocuments({ isDemo: true });
    
    if (demoCount > 0) {
      console.log(`Demo data already exists (${demoCount} items). Skipping insertion to avoid duplicates.`);
    } else {
      console.log('Inserting pristine demo items...');
      await Post.insertMany(DEMO_POSTS);
      console.log('✅ 15 Demo items inserted successfully.');
    }
    
    mongoose.disconnect();
    console.log('Operation complete.');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seedDemoPosts();
