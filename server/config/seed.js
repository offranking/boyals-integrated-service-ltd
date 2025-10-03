import { Service } from '../models/Service.js';
import { Product } from '../models/Product.js';
import { Testimonial } from '../models/Testimonial.js';

const sampleData = {
  services: [
    {
      iconName: 'Music',
      title: 'Music Production',
      description: 'Professional studio recording and production services',
      longDescription: 'Full-service music production from recording to mastering...',
      features: ['Studio Recording', 'Mixing & Mastering', 'Vocal Tuning'],
      image: '/images/services/studio.jpeg',
      highlightImage: '/images/services/studio-highlight.jpeg',
      category: 'Production'
    }
    // Add more sample services...
  ],
  // Add sample products and testimonials...
};

// Run this once to populate your database