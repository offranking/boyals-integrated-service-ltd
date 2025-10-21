import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://boyalintegrated.com'], 
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Boyal API is running', timestamp: new Date().toISOString() });
});

// Services API
app.get('/api/services', (req, res) => {
  const services = [
    {
      id: 1,
      iconName: 'Music',
      title: 'Music Production',
      description: 'Professional studio recording, mixing, and mastering services for artists and bands.',
      longDescription: 'Our state-of-the-art music production services provide everything you need to bring your musical vision to life.',
      features: ["Multi-track Recording", "Mixing & Mastering", "Vocal Production", "Beat Making"],
      image: "/images/services/Music.jpg",
      highlightImage: "/images/services/Music.jpg",
      category: 'Production',
    },
    {
      id: 2,
      iconName: 'MonitorSpeaker',
      title: 'Concert Productions',
      description: 'Complete concert and live event production including staging, lighting, and audio.',
      longDescription: 'Transform any venue into a world-class concert experience with our comprehensive production services.',
      features: ["Stage Design & Rigging", "Lighting Systems", "Video Walls", "PA Systems"],
      image: "/images/services/concert.jpeg",
      highlightImage: "/images/services/concert.jpeg",
      category: 'Production',
    },
    // Add other services...
  ];
  res.json(services);
});

// Products API
app.get('/api/products', (req, res) => {
  const products = [
    {
      id: 1,
      name: "Drums Chair",
      category: "Lighting",
      brand: "Drumsboy",
      image: "/images/products/1o.png",
      description: "Drum Throne Padded Braced Seat / Stool.",
      longDescription: "High Load Capacity: We add three double-layer thickened metal support bars to the base.",
      specs: [
        { key: "Frame Material", value: "Metal" },
        { key: "Item Weight", value: "4 Pounds" }
      ]
    }
  ];
  res.json(products);
});

// Testimonials API
app.get('/api/testimonials', (req, res) => {
  const testimonials = [
    { 
      id: 1,
      quote: "Boyal Integrated Service transformed our annual gala. The sound was impeccable!", 
      author: "Jane Doe", 
      event: "Corporate Gala", 
      avatar: "https://i.pravatar.cc/150?u=jane" 
    }
  ];
  res.json(testimonials);
});

// Booking API
app.post('/api/booking', async (req, res) => {
  try {
    const bookingData = req.body;
    console.log('Booking received:', bookingData);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ 
      success: true, 
      message: '�� Booking request submitted successfully! We will contact you within 24 hours.',
      bookingId: 'BKL-' + Date.now()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process booking request.' 
    });
  }
});

// Contact API
app.post('/api/contact', async (req, res) => {
  try {
    const contactData = req.body;
    console.log('Contact form received:', contactData);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.json({ 
      success: true, 
      message: '📧 Message sent successfully! We will get back to you within 2-4 hours.' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send message.' 
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Boyal API Server running on port ${PORT}`);
});
