import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'boyal_service',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('📝 Using mock data instead');
  }
}

// Initialize database with sample data
async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        icon_name VARCHAR(50) NOT NULL,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        long_description TEXT,
        features JSON,
        image VARCHAR(255),
        highlight_image VARCHAR(255),
        category ENUM('Production', 'Live Sound', 'Planning'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category ENUM('Microphones', 'Speakers', 'Mixers', 'Lighting'),
        brand VARCHAR(50),
        image VARCHAR(255),
        description TEXT,
        long_description TEXT,
        specs JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        quote TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        event VARCHAR(100),
        avatar VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        event_type VARCHAR(100),
        subject VARCHAR(200),
        service VARCHAR(100),
        event_date DATE,
        details TEXT,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.execute(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if we need to insert sample data
    const [serviceRows] = await pool.execute('SELECT COUNT(*) as count FROM services');
    if (serviceRows[0].count === 0) {
      console.log('📥 Inserting sample data into database...');
      
      // Insert sample services
      const sampleServices = [
        {
          icon_name: 'Music',
          title: 'Music Production',
          description: 'Professional studio recording and production services',
          long_description: 'Full-service music production from recording to mastering in our state-of-the-art studio facilities.',
          features: JSON.stringify(['Studio Recording', 'Mixing & Mastering', 'Vocal Tuning', 'Audio Restoration']),
          image: '/images/services/Music.jpg',
          highlight_image: '/images/services/Music.jpg',
          category: 'Production'
        },
        {
          icon_name: 'MonitorSpeaker',
          title: 'Concert Productions',
          description: 'Large-scale live event production and management',
          long_description: 'End-to-end concert production including sound, lighting, stage design, and event management.',
          features: JSON.stringify(['Sound Reinforcement', 'Lighting Design', 'Stage Management', 'Crowd Control']),
          image: '/images/services/concert.jpeg',
          highlight_image: '/images/services/concert.jpeg',
          category: 'Live Sound'
        },
        {
          icon_name: 'Mic',
          title: 'Live Sound Engineering',
          description: 'Professional audio engineering for live events',
          long_description: 'Expert live sound engineering for events of all sizes with top-tier equipment.',
          features: JSON.stringify(['Front of House Mixing', 'Monitor Mixing', 'System Tuning', 'Wireless Management']),
          image: '/images/services/Live.jpeg',
          highlight_image: '/images/services/Live.jpeg',
          category: 'Live Sound'
        },
        {
          icon_name: 'Headphones',
          title: 'Studio Recording',
          description: 'Professional recording studio services',
          long_description: 'High-quality recording services in acoustically treated studios with professional gear.',
          features: JSON.stringify(['Multi-track Recording', 'Vocal Booths', 'Instrument Recording', 'Producer Sessions']),
          image: '/images/services/liverord.jpeg',
          highlight_image: '/images/services/liverord.jpeg',
          category: 'Production'
        },
        {
          icon_name: 'Cable',
          title: 'Equipment Rental',
          description: 'Professional audio-visual equipment rental',
          long_description: 'Rent top-quality audio, video, and lighting equipment for your events.',
          features: JSON.stringify(['Audio Equipment', 'Lighting Gear', 'Video Systems', 'Technical Support']),
          image: '/images/services/equipment.jpeg',
          highlight_image: '/images/services/equipment-highlight.jpeg',
          category: 'Planning'
        },
        {
          icon_name: 'PartyPopper',
          title: 'Event Planning',
          description: 'Complete event planning and coordination',
          long_description: 'Full-service event planning from concept to execution with experienced coordinators.',
          features: JSON.stringify(['Venue Selection', 'Vendor Coordination', 'Timeline Management', 'Budget Planning']),
          image: '/images/services/planning.jpeg',
          highlight_image: '/images/services/planning-highlight.jpeg',
          category: 'Planning'
        }
      ];

      for (const service of sampleServices) {
        await pool.execute(
          'INSERT INTO services (icon_name, title, description, long_description, features, image, highlight_image, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [service.icon_name, service.title, service.description, service.long_description, service.features, service.image, service.highlight_image, service.category]
        );
      }

      // Insert sample products
      const sampleProducts = [
        {
          name: 'Shure SM7B',
          category: 'Microphones',
          brand: 'Shure',
          image: '/images/products/sm7b.jpeg',
          description: 'Professional dynamic microphone',
          long_description: 'The Shure SM7B is a professional dynamic microphone renowned for its smooth, flat frequency response and exceptional ability to reduce background noise.',
          specs: JSON.stringify([
            { key: 'Type', value: 'Dynamic' },
            { key: 'Pattern', value: 'Cardioid' },
            { key: 'Frequency Response', value: '50Hz - 20kHz' },
            { key: 'Connector', value: 'XLR' }
          ])
        },
        {
          name: 'Yamaha MG10XU',
          category: 'Mixers',
          brand: 'Yamaha',
          image: '/images/products/mg10xu.jpeg',
          description: '10-input analog mixer with effects',
          long_description: 'Compact analog mixer with high-quality preamps, built-in effects, and USB connectivity.',
          specs: JSON.stringify([
            { key: 'Channels', value: '10' },
            { key: 'Effects', value: 'SPX Digital Effects' },
            { key: 'USB', value: 'Yes' },
            { key: 'Preamps', value: 'D-PRE' }
          ])
        },
        {
          name: 'JBL EON712',
          category: 'Speakers',
          brand: 'JBL',
          image: '/images/products/eon712.jpeg',
          description: 'Powered portable PA speaker',
          long_description: 'Professional powered speaker with advanced waveguide technology for superior sound dispersion.',
          specs: JSON.stringify([
            { key: 'Power', value: '1000W Peak' },
            { key: 'Woofer', value: '12-inch' },
            { key: 'Tweeter', value: '1.5-inch' },
            { key: 'Connections', value: 'XLR, 1/4", RCA' }
          ])
        }
      ];

      for (const product of sampleProducts) {
        await pool.execute(
          'INSERT INTO products (name, category, brand, image, description, long_description, specs) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [product.name, product.category, product.brand, product.image, product.description, product.long_description, product.specs]
        );
      }

      // Insert sample testimonials
      const sampleTestimonials = [
        {
          quote: "Boyal Integrated Service transformed our corporate event into an unforgettable experience. The audio quality was crystal clear and the lighting created the perfect ambiance.",
          author: "Sarah Johnson",
          event: "Corporate Gala 2024",
          avatar: "/images/avatars/avatar1.jpg"
        },
        {
          quote: "Working with their team on our album production was seamless. Their attention to detail and professional equipment made all the difference in the final sound quality.",
          author: "David Chen",
          event: "Album Recording Project",
          avatar: "/images/avatars/avatar2.jpg"
        },
        {
          quote: "The equipment rental service saved our event when our original supplier fell through. Quick response and top-quality gear!",
          author: "Maria Rodriguez",
          event: "Music Festival 2024",
          avatar: "/images/avatars/avatar3.jpg"
        }
      ];

      for (const testimonial of sampleTestimonials) {
        await pool.execute(
          'INSERT INTO testimonials (quote, author, event, avatar) VALUES (?, ?, ?, ?)',
          [testimonial.quote, testimonial.author, testimonial.event, testimonial.avatar]
        );
      }

      console.log('✅ Sample data inserted successfully');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  }
}

// API Routes with Database
app.get('/api/services', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        icon_name as iconName,
        title,
        description,
        long_description as longDescription,
        features,
        image,
        highlight_image as highlightImage,
        category
      FROM services 
      ORDER BY id
    `);
    
    const services = rows.map(row => ({
      ...row,
      features: JSON.parse(row.features)
    }));
    
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    // Fallback to mock data if database fails
    res.json([
      {
        iconName: 'Music',
        title: 'Music Production',
        description: 'Professional studio recording and production services',
        longDescription: 'Full-service music production from recording to mastering in our state-of-the-art studio facilities.',
        features: ['Studio Recording', 'Mixing & Mastering', 'Vocal Tuning', 'Audio Restoration'],
        image: '/images/services/Music.jpg',
        highlightImage: '/images/services/Music.jpg',
        category: 'Production'
      },
      // ... include other mock services as fallback
    ]);
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        category,
        brand,
        image,
        description,
        long_description as longDescription,
        specs
      FROM products 
      ORDER BY id
    `);
    
    const products = rows.map(row => ({
      ...row,
      specs: JSON.parse(row.specs)
    }));
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to mock data
    res.json([]);
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        id,
        quote,
        author,
        event,
        avatar
      FROM testimonials 
      ORDER BY created_at DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    // Fallback to mock data
    res.json([]);
  }
});

app.post('/api/booking', async (req, res) => {
  try {
    const { fullName, email, phone, eventType, subject, service, eventDate, details } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO bookings (full_name, email, phone, event_type, subject, service, event_date, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [fullName, email, phone, eventType, subject, service, eventDate, details]
    );
    
    console.log('Booking created with ID:', result.insertId);
    res.json({ 
      message: 'Booking request received successfully', 
      status: 'success',
      bookingId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );
    
    console.log('Contact message created with ID:', result.insertId);
    res.json({ 
      message: 'Message sent successfully', 
      status: 'success',
      contactId: result.insertId 
    });
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.execute('SELECT 1');
    res.json({ 
      status: 'OK', 
      message: 'Server and database are running',
      database: 'connected'
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      message: 'Server is running but database is disconnected',
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Serve static files from public directory
app.use(express.static('public'));

// Initialize database and start server
async function startServer() {
  await testConnection();
  await initializeDatabase();
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🎵 Services: http://localhost:${PORT}/api/services`);
    console.log(`🛍️ Products: http://localhost:${PORT}/api/products`);
  });
}

startServer().catch(console.error);