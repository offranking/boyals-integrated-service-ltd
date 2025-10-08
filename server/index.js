import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Database Configuration for XAMPP (remove invalid options)
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'boyal_service',
  socketPath: process.env.DB_SOCKET_PATH || '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  // Removed: acquireTimeout, timeout, reconnect (not valid for mysql2)
};

// Create connection pool with error handling
let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log('✅ MySQL connection pool created for XAMPP');
} catch (error) {
  console.error('❌ Failed to create connection pool:', error.message);
  pool = null;
}

// Helper function to fix image paths
const fixImagePath = (imagePath) => {
  if (!imagePath) return '/images/placeholder.jpg';
  return imagePath.replace(/^\/public/, '');
};

// Mock data for fallback
const mockServices = [
  {
    id: 1,
    iconName: 'Music',
    title: 'Music Production',
    description: 'Professional studio recording and production services',
    longDescription: 'Full-service music production from recording to mastering in our state-of-the-art studio facilities.',
    features: ['Studio Recording', 'Mixing & Mastering', 'Vocal Tuning', 'Audio Restoration'],
    image: '/images/services/Music.jpg',
    highlightImage: '/images/services/Music.jpg',
    category: 'Production'
  }
];

const mockProducts = [
  {
    id: 1,
    name: 'Drums Chair',
    category: 'Lighting',
    brand: 'Drumsboy',
    image: '/images/products/1o.png',
    description: 'Drum Throne Padded Braced Seat / Stool.',
    longDescription: 'High Load Capacity: We add three double-layer thickened metal support bars to the base to provide additional support for the entire drum throne.',
    specs: [
      { key: 'Frame Material', value: 'Metal' },
      { key: 'Item Weight', value: '4 Pounds' }
    ]
  }
];

const mockTestimonials = [
  {
    id: 1,
    quote: "Boyal Integrated Service transformed our corporate event into an unforgettable experience. The audio quality was crystal clear and the lighting created the perfect ambiance.",
    author: "Sarah Johnson",
    event: "Corporate Gala 2024",
    avatar: "/images/avatars/avatar1.jpg"
  }
];

// Test database connection
async function testConnection() {
  if (!pool) {
    console.log('❌ No database connection pool available');
    return false;
  }

  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('📝 Using mock data instead');
    return false;
  }
}

// Create necessary tables if they don't exist
async function initializeDatabase() {
  if (!pool) {
    console.log('❌ Skipping database initialization - no connection pool');
    return;
  }

  try {
    // Check if services table exists and has the right structure
    try {
      await pool.execute('SELECT id, icon_name, title FROM services LIMIT 1');
      console.log('✅ Services table exists with expected structure');
    } catch (error) {
      console.log('🔄 Creating services table...');
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS services (
          id INT AUTO_INCREMENT PRIMARY KEY,
          icon_name VARCHAR(50) NOT NULL DEFAULT 'Music',
          title VARCHAR(100) NOT NULL,
          description TEXT,
          long_description TEXT,
          features JSON,
          image VARCHAR(255),
          highlight_image VARCHAR(255),
          category VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
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
        }
      ];

      for (const service of sampleServices) {
        await pool.execute(
          'INSERT INTO services (icon_name, title, description, long_description, features, image, highlight_image, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [service.icon_name, service.title, service.description, service.long_description, service.features, service.image, service.highlight_image, service.category]
        );
      }
      console.log('✅ Services table created and sample data inserted');
    }

    // Check if bookings table exists
    try {
      await pool.execute('SELECT id FROM bookings LIMIT 1');
      console.log('✅ Bookings table exists');
    } catch (error) {
      console.log('🔄 Creating bookings table...');
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
          status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

    // Check if testimonials table exists
    try {
      await pool.execute('SELECT id, quote FROM testimonials LIMIT 1');
      console.log('✅ Testimonials table exists with expected structure');
    } catch (error) {
      console.log('🔄 Creating testimonials table...');
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
    }

    // Check if contact_messages table exists
    try {
      await pool.execute('SELECT id FROM contact_messages LIMIT 1');
      console.log('✅ Contact messages table exists');
    } catch (error) {
      console.log('🔄 Creating contact_messages table...');
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          message TEXT NOT NULL,
          status VARCHAR(20) DEFAULT 'unread',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
  }
}

// Enhanced API Routes with better error handling
app.get('/api/services', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database not available');
    }
    
    // Try the new structure first, fallback to alternative structures
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
        features: row.features ? JSON.parse(row.features) : [],
        image: fixImagePath(row.image),
        highlightImage: fixImagePath(row.highlightImage)
      }));
      
      console.log(`✅ Fetched ${services.length} services from database`);
      res.json(services);
    } catch (structureError) {
      console.log('🔄 Trying alternative service structure...');
      // If the above fails, try a simpler query
      const [rows] = await pool.execute('SELECT id, title, description, image FROM services ORDER BY id');
      const services = rows.map(row => ({
        id: row.id,
        iconName: 'Music',
        title: row.title,
        description: row.description,
        longDescription: row.description,
        features: ['Professional Service', 'Quality Guaranteed'],
        image: fixImagePath(row.image),
        highlightImage: fixImagePath(row.image),
        category: 'Production'
      }));
      res.json(services);
    }
  } catch (error) {
    console.error('Error fetching services:', error.message);
    console.log('📝 Using mock services data');
    res.json(mockServices);
  }
});

app.get('/api/products', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database not available');
    }
    
    const [rows] = await pool.execute(`
      SELECT 
        id,
        name,
        category,
        brand,
        imageUrl as image,
        description,
        specs,
        price
      FROM products 
      WHERE status = 'active'
      ORDER BY id
    `);
    
    const products = rows.map(row => ({
      id: row.id,
      name: row.name,
      category: row.category,
      brand: row.brand,
      image: fixImagePath(row.image),
      description: row.description,
      longDescription: row.description,
      specs: row.specs ? JSON.parse(row.specs) : [],
      price: row.price
    }));
    
    console.log(`✅ Fetched ${products.length} products from database`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    console.log('📝 Using mock products data');
    res.json(mockProducts);
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    if (!pool) {
      throw new Error('Database not available');
    }
    
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
      
      const testimonials = rows.map(row => ({
        ...row,
        avatar: fixImagePath(row.avatar)
      }));
      
      console.log(`✅ Fetched ${testimonials.length} testimonials from database`);
      res.json(testimonials);
    } catch (structureError) {
      console.log('🔄 No testimonials table or wrong structure, using mock data');
      res.json(mockTestimonials);
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error.message);
    console.log('📝 Using mock testimonials data');
    res.json(mockTestimonials);
  }
});

app.post('/api/booking', async (req, res) => {
  try {
    const { fullName, email, phone, eventType, subject, service, eventDate, details } = req.body;
    
    console.log('📨 Booking request received:', { fullName, email, eventType, service });

    if (!pool) {
      console.log('📝 Database unavailable - logging booking to console');
      return res.json({ 
        message: 'Booking request received! (Logged to console)', 
        status: 'success' 
      });
    }
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO bookings (full_name, email, phone, event_type, subject, service, event_date, details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [fullName, email, phone, eventType, subject, service, eventDate, details]
      );
      
      console.log('✅ Booking created with ID:', result.insertId);
      res.json({ 
        message: 'Booking request received successfully! We will contact you soon.', 
        status: 'success',
        bookingId: result.insertId 
      });
    } catch (dbError) {
      console.error('❌ Database error with bookings table:', dbError.message);
      // Fallback: log to console and return success
      console.log('📝 Booking logged (database issue):', { fullName, email, eventType, service });
      res.json({ 
        message: 'Booking request received! We have logged your request.', 
        status: 'success'
      });
    }
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    res.status(500).json({ 
      error: 'Failed to create booking',
      message: 'Please try again or contact us directly.' 
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    console.log('📨 Contact message received:', { name, email });

    if (!pool) {
      console.log('📝 Database unavailable - logging contact message to console');
      return res.json({ 
        message: 'Message received! (Logged to console)', 
        status: 'success'
      });
    }
    
    try {
      const [result] = await pool.execute(
        'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)',
        [name, email, message]
      );
      
      console.log('✅ Contact message created with ID:', result.insertId);
      res.json({ 
        message: 'Message sent successfully! We will respond soon.', 
        status: 'success',
        contactId: result.insertId 
      });
    } catch (dbError) {
      console.error('❌ Database error with contact_messages table:', dbError.message);
      // Fallback: log to console and return success
      console.log('📝 Contact message logged (database issue):', { name, email });
      res.json({ 
        message: 'Message received! We have logged your request.', 
        status: 'success'
      });
    }
  } catch (error) {
    console.error('❌ Error creating contact message:', error);
    res.status(500).json({ 
      error: 'Failed to send message',
      message: 'Please try again or call us directly.' 
    });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    if (!pool) {
      return res.json({ 
        status: 'OK', 
        message: 'Server is running but database is disconnected',
        database: 'disconnected',
        mode: 'mock-data'
      });
    }
    
    await pool.execute('SELECT 1');
    res.json({ 
      status: 'OK', 
      message: 'Server and database are running',
      database: 'connected',
      mode: 'live-data'
    });
  } catch (error) {
    res.json({ 
      status: 'OK', 
      message: 'Server is running but database is disconnected',
      database: 'disconnected',
      mode: 'mock-data',
      error: error.message 
    });
  }
});

// Serve static files from public directory
app.use(express.static('public'));

// Initialize database and start server
async function startServer() {
  const dbConnected = await testConnection();
  
  if (dbConnected) {
    await initializeDatabase();
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📊 API Health: http://localhost:${PORT}/api/health`);
    console.log(`🎵 Services: http://localhost:${PORT}/api/services`);
    console.log(`🛍️ Products: http://localhost:${PORT}/api/products`);
    console.log(`💬 Testimonials: http://localhost:${PORT}/api/testimonials`);
    console.log(dbConnected ? '✅ Database: CONNECTED' : '📝 Database: USING MOCK DATA');
  });
}

startServer().catch(console.error);