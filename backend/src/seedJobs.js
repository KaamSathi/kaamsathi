const mongoose = require('mongoose');
const Job = require('./models/Job');
const User = require('./models/User');
require('dotenv').config({ path: '../.env' });

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME });

  // Find or create an employer
  let employer = await User.findOne({ role: 'employer' });
  if (!employer) {
    employer = await User.create({
      name: 'Demo Employer',
      email: 'employer@example.com',
      password: 'Password123!', // Should be hashed in real app
      role: 'employer',
      companyName: 'Demo Company',
      isVerified: true,
    });
  }

  // Create a job
  const job = await Job.create({
    title: 'Electrician Needed',
    description: 'Looking for a certified electrician for a 2-week project.',
    employer: employer._id,
    category: 'electrical',
    location: {
      address: '123 Main St',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: { latitude: 19.076, longitude: 72.8777 },
    },
    type: 'contract',
    duration: {
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      estimatedHours: 80,
      isFlexible: false,
    },
    salary: {
      type: 'fixed',
      min: 15000,
      max: 20000,
      currency: 'INR',
      isNegotiable: true,
    },
    requirements: {
      experience: '1-2 years',
      skills: ['wiring', 'maintenance'],
      education: 'secondary',
      languages: ['hindi', 'english'],
      certifications: ['Electrician License'],
      tools: ['multimeter'],
    },
    workingHours: {
      startTime: '09:00',
      endTime: '18:00',
      daysPerWeek: 6,
      isFlexible: false,
      shiftType: 'day',
    },
    benefits: ['food-provided', 'bonus'],
    applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxApplications: 10,
    contactInfo: {
      name: 'Demo Employer',
      phone: '9876543210',
      email: 'employer@example.com',
      preferredContactMethod: 'app-message',
    },
    additionalInfo: {
      equipmentProvided: true,
      safetyRequirements: ['helmet'],
      workEnvironment: 'indoor',
      physicalRequirements: ['lifting'],
      trainingProvided: true,
    },
    images: [],
    documents: [],
    tags: ['electrician', 'contract'],
    preferredWorkerProfile: {
      ageRange: { min: 21, max: 50 },
      gender: 'any',
      localityPreference: false,
      maxDistance: 50,
    },
    status: 'active',
    priority: 'high',
    isUrgent: true,
  });

  console.log('Seeded job:', job.title);
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
}); 