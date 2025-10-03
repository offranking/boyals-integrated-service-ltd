

// FIX: Changed import to use express as a namespace to resolve type conflicts with global DOM types for Request and Response.
import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001;

// Specific CORS configuration for development
const corsOptions = {
  origin: 'http://localhost:5173', // Allow only the frontend dev server
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// --- DATA (moved from frontend) ---

const services = [
  { 
    iconName: 'Music', 
    title: 'Music Production', 
    description: 'High-quality music production for artists and events.',
    longDescription: "From initial concept to final master, our music production services cover every aspect of creating professional-grade audio. Whether you're a solo artist, a band, or need a custom soundtrack for an event, our state-of-the-art studio and experienced engineers are at your service.",
    features: ["Multi-track Recording", "Mixing & Mastering", "Beat Production", "Vocal Tuning"],
    image: "/public/images/services/Music.jpg",
    highlightImage: "/public/images/services/Music.jpg",
    category: 'Production',
  },
  { 
    iconName: 'MonitorSpeaker', 
    title: 'Concert Productions', 
    description: 'Full-scale concert production and management.',
    longDescription: "We bring concerts to life. Our team handles everything from stage design and lighting to sound engineering and logistics. We work with you to create an unforgettable live experience for both the performers and the audience.",
    features: ["Staging & Rigging", "Advanced Lighting Systems", "Video Wall Integration", "Logistics & Crew Management"],
    image: "/public/images/services/concert.jpeg",
    highlightImage: "/public/images/services/concert.jpeg",
    category: 'Production',
  },
  { 
    iconName: 'Mic', 
    title: 'Sound Reinforcement', 
    description: 'Crystal clear sound for any venue size.',
    longDescription: "Ensure every word and note is heard with perfect clarity. Our sound reinforcement solutions are tailored to your specific venue and event type, using top-of-the-line speakers, microphones, and mixing consoles to deliver pristine audio.",
    features: ["PA System Design & Tuning", "Wireless Microphone Systems", "Audio Delay Towers", "Corporate AV Support"],
    image: "/public/images/services/Sound.jpg",
    highlightImage: "/public/images/services/Sound.jpg",
    category: 'Live Sound',
  },
  { 
    iconName: 'Headphones', 
    title: 'Live Sound Engineering', 
    description: 'Professional audio engineering for live performances.',
    longDescription: "A great performance deserves great sound. Our experienced live sound engineers work tirelessly behind the scenes to mix and balance audio in real-time, ensuring a flawless sonic experience for your audience.",
    features: ["Front of House (FOH) Mixing", "Monitor/In-Ear Mixing", "System Optimization", "Experienced Engineers"],
    image: "/public/images/services/Live.jpeg",
    highlightImage: "/public/images/services/Live.jpeg",
    category: 'Live Sound',
  },
  { 
    iconName: 'Cable', 
    title: 'Live Recording', 
    description: 'Capture your event with pristine multi-track recording.',
    longDescription: "Preserve the magic of your live performance forever. We provide professional multi-track recording services that capture every nuance of your event, delivering high-quality audio ready for post-production, broadcast, or a live album release.",
    features: ["High-Fidelity Multi-track Capture", "Redundant Recording Systems", "Post-Event Mixing & Mastering", "Broadcast Feeds"],
    image: "/public/images/services/liverord.jpeg",
    highlightImage: "/public/images/services/liverord.jpeg",
    category: 'Production',
  },
  { 
    iconName: 'PartyPopper', 
    title: 'Event Planning', 
    description: 'Complete event planning and coordination.',
    longDescription: "Beyond the technical, we offer comprehensive event planning services. From venue selection to vendor coordination, we manage the details so you can focus on your guests and enjoy a perfectly executed social engagement.",
    features: ["Venue Sourcing", "Vendor Management", "Event Theming & Design", "On-site Coordination"],
    image: "/public/images/services/event.jpg",
    highlightImage: "/public/images/services/event.jpg",
    category: 'Planning',
  },
];

const products = [
  {
    id: 1,
    name: "Drums Chair",
    category: 'Lighting',
    brand: "Drumsboy",
    image: "/public/images/products/1o.png",
    description: "Drum Throne Padded Braced Seat / Stool.",
    longDescription: "High Load Capacity: We add three double-layer thickened metal support bars to the base to provide additional support for the entire drum throne. The height of the drum stool is about 20.8inch, with the load capacity up to 370lbs. It is very suitable for both children and adults",
    specs: [
      { key: "Frame Material", value: "Metal" },
      { key: "Item Weight", value: "4 Pounds" },
      { key: "Shape", value: "Round" },
      { key: "Seat Material Type", value: "Metal" }
    ]
  },
  {
    id: 2,
    name: "Shure SLXD Dual",
    category: 'Microphones',
    brand: "Shure",
    image: "/public/images/products/1.png",
    description: "Shure SLXD24/SM58 Digital Wireless Handheld Microphone System - H55 Band",
    longDescription: "Featuring two legendary SM58® Cardioid Dynamic Microphone capsules on SLXD2 handheld wireless transmitters, the SLXD24D/SM58 provides transparent digital audio and rock-solid RF stability for lecture halls and live performances.",
    specs: [
        { key: "Microphone Type", value: "Dynamic" },
        { key: "Configuration", value: "Dual" },
        { key: "Connectivity", value: "Wireless" },
        { key: "Performance", value: "Stable" }
    ]
  },
  {
    id: 3,
    name: "Shure SM57",
    category: 'Microphones',
    brand: "Shure",
    image: "/public/images/products/2.png",
    description: "Shure SM57 Pro XLR Dynamic Microphone - Professional Studio & Live Performance C",
    longDescription: "The StudioMix console brings classic analog warmth and modern flexibility to your setup. Featuring high-quality preamps on every channel, a comprehensive EQ section, and flexible routing options, it's the heart of any professional audio environment.",
    specs: [
        { key: "Channels", value: "24 (16 mono, 4 stereo)" },
        { key: "Preamps", value: "20 High-Headroom Preamps" },
        { key: "EQ", value: "3-band with sweepable mid" },
        { key: "Connectivity", value: "USB Audio Interface" }
    ]
  },
  {
    id: 4,
    name: "IEM dual",
    category: 'Microphones',
    brand: "XTUGA",
    image: "/public/images/products/3.png",
    description: "XTUGA IEM1200 Wireless in Ear Monitor Dual Channel 4 Bodypacks Ear Monitors.",
    longDescription: "Your performance should never be in question. Whether presenting, educating, praising or entertaining, your relationship with your audience is singular",
    specs: [
        { key: "Unit of Measure", value: "EA" },
        { key: "Unit Size", value: "1" },
        { key: "Mfr.", value: "SLXD14D-G58" },
        { key: "Manufacturer", value: "Shure" }
    ]
  },
  {
    id: 5,
    name: "IEM body pack",
    category: 'Microphones',
    brand: "UHF",
    image: "/public/images/products/4.png",
    description: "Receivers Wireless In Ear Monitor System Pro Audio UHF 2 channel Stage Studio.",
    longDescription: "LMBGM UHF Wireless In-Ear Monitoring System with 4 Bodypack Monitors, USB Rechargeable, 16-Channel Selectable, Microphone Gain, Headset Wireless Type, Ideal for Stage, Studio, Recording Studio, Church, Karaoke - Christmas Gift, Studio Audio Equipment | Modern Audio Gear | Durable Audio Equipment, Wireless Microphone, Wireles Earbud For Men, Earbud Wireles",
    specs: [
      { key: "Type", value: "Dynamic" },
      { key: "Polar Pattern", value: "Cardioid" },
      { key: "Frequency Response", value: "50Hz - 15kHz" },
      { key: "Impedance", value: "150 ohm" }
    ]
  },
  {
    id: 6,
    name: "BLX Cover",
    category: 'Speakers',
    brand: "BLX",
    image: "/public/images/products/5.png",
    description: "Generic BLX2 Microphone Battery Cup Cover for Shure BLX Wireless Microphone System (Black)",
    longDescription: "The black Replacement Battery Cup for BLX2 Series Handheld Transmitters is compatible with BLX2/B58, BLX2/PG58, and BLX2/SM58 handheld wireless transmitters",
    specs: [
        { key: "Power", value: "1500W (Peak power handling capacity.)" },
        { key: "RMS", value: "750W (Continuous power handling capacity.)" },
        { key: "Driver", value: "18-inch (The diameter of the main woofer cone.)" },
        { key: "Impedance", value: "8-Ohm (The electrical resistance of the voice coil.)" }
    ]
  },
  {
    id: 7,
    name: "Saxophone microphones",
    category: 'Microphones',
    brand: "BOMGE",
    image: "/public/images/products/6.png",
    description: "BOMGE Wireless Saxophone Microphone System, Clip on Instrument Microphone Suitable for Saxophones and Speakers.",
    longDescription: "These are small, lightweight mics that attach directly to the bell or body of the saxophone on a short gooseneck. Great for live performance mobility.",
    specs: [
        { key: "Polar Pattern", value: "Supercardioid" },
        { key: "Mounting", value: "Adjustable Gooseneck Clamp" },
        { key: "Max SPL", value: "≥142 dB" },
        { key: "Technology", value: "CORE+ / Transformerless" }
    ]
  },
  {
    id: 8,
    name: "Conference Microphone",
    category: 'Microphones',
    brand: "Unbanded",
    image: "/public/images/products/7.png",
    description: "The best type of microphone depends heavily on the room size, setup, and whether video conferencing is involved.",
    longDescription: "A conference microphone is a specialized audio device designed to capture clear, intelligible speech in meeting spaces, boardrooms, and lecture halls, ensuring that all participants—both in the room and remote—can be heard clearly",
    specs: [
        { key: "Boundary Microphones", value: "Small to Medium Huddle Rooms" },
        { key: "Gooseneck Microphones", value: "Podium/Lecterns, Panel Discussions, Delegate Systems" },
        { key: "Tabletop Array Microphones", value: "Medium to Large Meeting Rooms" },
        { key: "Ceiling Array Microphones", value: "Large, High-Aesthetic Rooms" }
    ]
  },
  {
    id: 9,
    name: "Shure SM58",
    category: 'Microphones',
    brand: "Shure",
    image: "/public/images/products/8.png",
    description: "Dual-Channel Operation: Simultaneously supports two performers from a single BLX88 tabletop receiver..",
    longDescription: "The Shure BLX288/SM58 Dual Channel Handheld Wireless System is a professional, cost-effective wireless solution designed for two vocalists, presenters, or speakers.",
    specs: [
        { key: "Microphones", value: "(2) SM58 Handheld Capsules" },
        { key: "Channels", value: "Dual-Channel Receiver" },
        { key: "Range", value: "Up to 300 ft (Line of Sight)" },
        { key: "Setup", value: "One-touch QuickScan Frequency Selection" }
    ]
  },
];

const testimonials = [
    { quote: "Boyal Integrated Service transformed our annual gala. The sound was impeccable and the team was incredibly professional. A flawless experience!", author: "Jane Doe", event: "Corporate Gala", avatar: "https://i.pravatar.cc/150?u=jane" },
    { quote: "The best concert production we've ever had. They handled everything with ease and expertise. Our fans are still talking about the show!", author: "John Smith", event: "The Rockers Band", avatar: "https://i.pravatar.cc/150?u=john" },
    { quote: "We hired them for our wedding reception, and it was the best decision we made. The music and lighting created the perfect atmosphere. Highly recommended!", author: "Emily & Mark", event: "Wedding Reception", avatar: "https://i.pravatar.cc/150?u=emily" }
];

// --- API ENDPOINTS ---

// FIX: Use namespaced types to ensure correct type inference.
app.get('/api/services', (_req: express.Request, res: express.Response) => {
  res.json(services);
});

// FIX: Use namespaced types to ensure correct type inference.
app.get('/api/products', (_req: express.Request, res: express.Response) => {
  res.json(products);
});

// FIX: Use namespaced types to ensure correct type inference.
app.get('/api/testimonials', (_req: express.Request, res: express.Response) => {
    res.json(testimonials);
});

// FIX: Use namespaced types to ensure correct type inference.
app.post('/api/booking', (req: express.Request, res: express.Response) => {
  console.log('Booking request received:', req.body);
  // In a real app, you would save this to a database, send an email, etc.
  res.status(200).json({ message: 'Booking request received successfully!' });
});

// FIX: Use namespaced types to ensure correct type inference.
app.post('/api/contact', (req: express.Request, res: express.Response) => {
  console.log('Contact message received:', req.body);
  // In a real app, you would process this message
  res.status(200).json({ message: 'Contact message received successfully!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});