import React, { useState, FC, ReactNode, useRef, useEffect } from 'react';
import { Page } from './types';
import { Music, MonitorSpeaker, Mic, Headphones, Cable, Menu, X, Facebook, Twitter, Instagram, Linkedin, PartyPopper, Phone, Mail, MapPin, Quote, CheckCircle, PlayCircle, MessageSquare, ClipboardList, Play, Award, Heart, Star, Users, Pause, Link, Share2, Volume2, Volume1, VolumeX, ChevronLeft, ChevronRight, Speaker } from 'lucide-react';

// ~~~ TYPE DEFINITIONS ~~~
interface AppState {
  currentPage: Page;
  currentService: string | null;
}

interface NavLinkProps {
  page: Page;
  appState: AppState;
  navigateTo: (page: Page, service?: string | null) => void;
  children: ReactNode;
  isMobile?: boolean;
  className?: string;
}

type ServiceCategory = 'Production' | 'Live Sound' | 'Planning';

interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  image: string;
  highlightImage: string;
  category: ServiceCategory;
}

interface Testimonial {
  quote: string;
  author: string;
  event: string;
  avatar: string;
}

interface GalleryImage {
  src: string;
  caption: string;
}

interface TeamMember {
    name: string;
    title: string;
    avatar: string;
}

interface ArtistShowcase {
  artistName: string;
  albumArt: string;
  trackTitle: string;
  trackUrl: string;
  description: string;
  genre: 'Pop' | 'Rock' | 'Electronic' | 'Hip-Hop' | 'Afrobeat';
}


// ~~~ HELPER DATA ~~~
const navLinks: { page: Page; title: string }[] = [
  { page: 'home', title: 'Home' },
  { page: 'about', title: 'About' },
  { page: 'services', title: 'Services' },
  { page: 'gallery', title: 'Gallery' },
  { page: 'booking', title: 'Booking' },
  { page: 'contact', title: 'Contact' },
];

const services: Service[] = [
  { 
    icon: Music, 
    title: 'Music Production', 
    description: 'High-quality music production for artists and events.',
    longDescription: "From initial concept to final master, our music production services cover every aspect of creating professional-grade audio. Whether you're a solo artist, a band, or need a custom soundtrack for an event, our state-of-the-art studio and experienced engineers are at your service.",
    features: ["Multi-track Recording", "Mixing & Mastering", "Beat Production", "Vocal Tuning"],
    image: "https://picsum.photos/seed/musicprod/1200/800",
    highlightImage: "https://picsum.photos/seed/musicprod-highlight/800/600",
    category: 'Production',
  },
  { 
    icon: MonitorSpeaker, 
    title: 'Concert Productions', 
    description: 'Full-scale concert production and management.',
    longDescription: "We bring concerts to life. Our team handles everything from stage design and lighting to sound engineering and logistics. We work with you to create an unforgettable live experience for both the performers and the audience.",
    features: ["Staging & Rigging", "Advanced Lighting Systems", "Video Wall Integration", "Logistics & Crew Management"],
    image: "https://picsum.photos/seed/concert/1200/800",
    highlightImage: "https://picsum.photos/seed/concert-highlight/800/600",
    category: 'Production',
  },
  { 
    icon: Mic, 
    title: 'Sound Reinforcement', 
    description: 'Crystal clear sound for any venue size.',
    longDescription: "Ensure every word and note is heard with perfect clarity. Our sound reinforcement solutions are tailored to your specific venue and event type, using top-of-the-line speakers, microphones, and mixing consoles to deliver pristine audio.",
    features: ["PA System Design & Tuning", "Wireless Microphone Systems", "Audio Delay Towers", "Corporate AV Support"],
    image: "https://picsum.photos/seed/sound/1200/800",
    highlightImage: "https://picsum.photos/seed/sound-highlight/800/600",
    category: 'Live Sound',
  },
  { 
    icon: Headphones, 
    title: 'Live Sound Engineering', 
    description: 'Professional audio engineering for live performances.',
    longDescription: "A great performance deserves great sound. Our experienced live sound engineers work tirelessly behind the scenes to mix and balance audio in real-time, ensuring a flawless sonic experience for your audience.",
    features: ["Front of House (FOH) Mixing", "Monitor/In-Ear Mixing", "System Optimization", "Experienced Engineers"],
    image: "https://picsum.photos/seed/live/1200/800",
    highlightImage: "https://picsum.photos/seed/live-highlight/800/600",
    category: 'Live Sound',
  },
  { 
    icon: Cable, 
    title: 'Live Recording', 
    description: 'Capture your event with pristine multi-track recording.',
    longDescription: "Preserve the magic of your live performance forever. We provide professional multi-track recording services that capture every nuance of your event, delivering high-quality audio ready for post-production, broadcast, or a live album release.",
    features: ["High-Fidelity Multi-track Capture", "Redundant Recording Systems", "Post-Event Mixing & Mastering", "Broadcast Feeds"],
    image: "https://picsum.photos/seed/recording/1200/800",
    highlightImage: "https://picsum.photos/seed/recording-highlight/800/600",
    category: 'Production',
  },
  { 
    icon: PartyPopper, 
    title: 'Event Planning', 
    description: 'Complete event planning and coordination.',
    longDescription: "Beyond the technical, we offer comprehensive event planning services. From venue selection to vendor coordination, we manage the details so you can focus on your guests and enjoy a perfectly executed social engagement.",
    features: ["Venue Sourcing", "Vendor Management", "Event Theming & Design", "On-site Coordination"],
    image: "https://picsum.photos/seed/planning/1200/800",
    highlightImage: "https://picsum.photos/seed/planning-highlight/800/600",
    category: 'Planning',
  },
];

const testimonials: Testimonial[] = [
    { quote: "Boyal Integrated Service transformed our annual gala. The sound was impeccable and the team was incredibly professional. A flawless experience!", author: "Jane Doe", event: "Corporate Gala", avatar: "https://i.pravatar.cc/150?u=jane" },
    { quote: "The best concert production we've ever had. They handled everything with ease and expertise. Our fans are still talking about the show!", author: "John Smith", event: "The Rockers Band", avatar: "https://i.pravatar.cc/150?u=john" },
    { quote: "We hired them for our wedding reception, and it was the best decision we made. The music and lighting created the perfect atmosphere. Highly recommended!", author: "Emily & Mark", event: "Wedding Reception", avatar: "https://i.pravatar.cc/150?u=emily" }
];

const galleryImages: GalleryImage[] = Array.from({ length: 9 }, (_, i) => ({
    src: `https://picsum.photos/seed/${i + 1}/600/400`,
    caption: `Vibrant event atmosphere, Setup #${i + 1}`,
}));

const teamMembers: TeamMember[] = [
    { name: "Alex Boyal", title: "Founder & Lead Engineer", avatar: "https://i.pravatar.cc/150?u=alex" },
    { name: "Maria Garcia", title: "Events Director", avatar: "https://i.pravatar.cc/150?u=maria" },
    { name: "David Chen", title: "Creative Lead", avatar: "https://i.pravatar.cc/150?u=david" },
    { name: "Sarah Jenkins", title: "Client Relations", avatar: "https://i.pravatar.cc/150?u=sarah" },
];

const artistShowcases: ArtistShowcase[] = [
    {
        artistName: "Burna Boy",
        albumArt: "https://dims.apnews.com/dims4/default/b753522/2147483647/strip/true/crop/3472x2315+0+0/resize/599x399!/quality/90/?url=https%3A%2F%2Fassets.apnews.com%2F95%2Fbb%2Fb7658baccb4573645e2f21b6052e%2F6c42c0fc53bd47e49792c6c946a1f637",
        trackTitle: "Lagos Groove",
        trackUrl: "https://cdn.trendybeatz.com/audio/Burna-Boy-23.mp3",
        description: "A vibrant Afrobeat track that blends traditional rhythms with modern production. We focused on a rich, layered percussion section.",
        genre: 'Afrobeat',
    },
    {
        artistName: "Tems",
        albumArt: "https://upload.wikimedia.org/wikipedia/commons/e/ec/Tems_on_NdaniTV_Sessions_-cropped.png",
        trackTitle: "King Around Here",
        trackUrl: "https://cdn.pixabay.com/download/audio/2022/08/04/audio_2d02511475.mp3",
        description: "We worked with Tems to craft the synth-heavy soundscape of her breakout EP. Our team handled mixing and mastering to bring her ethereal vision to life.",
        genre: 'Electronic',
    },
    {
        artistName: "Boy Spyce",
        albumArt: "https://trendybeatz.com/images/Boy-Spyce-Picture.jpg",
        trackTitle: "The Rock",
        trackUrl: "https://cdn.pixabay.com/download/audio/2022/05/23/audio_784133496c.mp3",
        description: "A raw, high-energy rock track. We captured the band's live energy with multi-track recording and produced a powerful, radio-ready mix.",
        genre: 'Rock',
    },
    {
        artistName: "Ayra Starr",
        albumArt: "https://unorthodoxreviews.com/wp-content/uploads/2025/03/photo-output-16.jpeg",
        trackTitle: "It's Hip Hop",
        trackUrl: "https://cdn.pixabay.com/download/audio/2022/09/26/audio_55392b5123.mp3",
        description: "For MC Flow's latest single, our beat production and vocal engineering provided the perfect foundation for his intricate lyricism.",
        genre: 'Hip-Hop',
    },
    {
        artistName: "Davido",
        albumArt: "https://d1jcea4y7xhp7l.cloudfront.net/wp-content/uploads/2025/06/Davido-2-edited.png",
        trackTitle: "Upbeat Pop Day",
        trackUrl: "https://cdn.pixabay.com/download/audio/2022/12/26/audio_51322253d8.mp3",
        description: "A chart-topping pop hit. We co-wrote, produced, and mastered this track, focusing on a clean, dynamic sound that captivates listeners.",
        genre: 'Pop',
    },
    {
        artistName: "Temsi",
        albumArt: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=600&auto=format=fit=crop",
        trackTitle: "Afro Pop",
        trackUrl: "https://cdn.pixabay.com/download/audio/2023/04/24/audio_9273c336b1.mp3",
        description: "This soulful Afro Pop record required a warm, analog mix to complement Temsi's smooth vocals. We mastered it for both streaming and vinyl.",
        genre: 'Afrobeat',
    },
];


// ~~~ REUSABLE COMPONENTS ~~~

const Section: FC<{ children: ReactNode; id: string; className?: string }> = ({ children, id, className = '' }) => (
  <section id={id} className={`py-24 px-4 sm:px-6 lg:px-8 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {children}
    </div>
  </section>
);

const NavLink: FC<NavLinkProps> = ({ page, appState, navigateTo, children, isMobile = false, className = '' }) => {
  const baseClasses = "font-medium transition-colors duration-300 ease-in-out rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500";
  const mobileClasses = "block text-lg py-2 px-3";
  const desktopClasses = "text-sm py-2 px-3";
  const activeClasses = "text-red-600 font-semibold";
  const inactiveClasses = "text-gray-600 hover:text-red-600";

  return (
    <button
      onClick={() => navigateTo(page)}
      aria-current={appState.currentPage === page ? 'page' : undefined}
      className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses} ${appState.currentPage === page ? activeClasses : inactiveClasses} ${className}`}
    >
      {children}
    </button>
  );
};


// ~~~ PAGE COMPONENTS ~~~

const ServicesHighlightSection: FC<{ navigateTo: (page: Page, service?: string | null) => void }> = ({ navigateTo }) => (
  <Section id="home-services" className="bg-gray-50">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Signature Services</h2>
      <p className="text-red-600 mt-4 text-lg">Comprehensive Solutions for Unforgettable Events</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.slice(0, 3).map((service) => (
         <div 
            key={service.title} 
            role="button"
            tabIndex={0}
            onClick={() => navigateTo('serviceDetail', service.title)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigateTo('serviceDetail', service.title);
                }
            }}
            className="group relative rounded-xl shadow-2xl overflow-hidden cursor-pointer focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2"
         >
            <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out bg-zoom"
                style={{ backgroundImage: `url(${service.highlightImage})` }}
                aria-hidden="true"
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" aria-hidden="true"></div>
            <div className="relative h-full flex flex-col justify-end p-8 text-white min-h-[400px]">
                <div className="transform transition-transform duration-500 ease-in-out group-hover:-translate-y-4">
                    <service.icon className="h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
                    <h3 className="text-3xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-h-0 group-hover:max-h-screen">{service.description}</p>
                    <span className="font-semibold text-red-500 flex items-center">
                        Learn More <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">&rarr;</span>
                    </span>
                </div>
            </div>
        </div>
      ))}
    </div>
  </Section>
);

const ProcessSection: FC = () => {
    const steps = [
        { icon: MessageSquare, title: "Consultation", description: "We start by understanding your vision, goals, and requirements." },
        { icon: ClipboardList, title: "Planning & Design", description: "Our experts craft a detailed plan, from technical specs to creative design." },
        { icon: Play, title: "Flawless Execution", description: "Our professional crew brings the plan to life with precision and passion." },
        { icon: Award, title: "Unforgettable Success", description: "We deliver a memorable experience that exceeds all expectations." },
    ];

    return (
        <Section id="process">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Your Vision, Our Blueprint</h2>
                <p className="text-red-600 mt-4 text-lg">Our Simple Path to Your Perfect Event</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                    <div key={step.title} className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out transform border-t-4 border-red-200 hover:border-red-500">
                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mx-auto mb-6">
                            <step.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                        <p className="text-gray-600">{step.description}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const TestimonialsSection: FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const goToSlide = (index: number) => {
        setActiveIndex(index);
    };

    const nextSlide = () => {
        setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
    };

    const prevSlide = () => {
        setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
    };
    
    if (!testimonials.length) return null;

    return (
      <Section id="testimonials" className="bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">What Our Clients Say</h2>
          <p className="text-red-600 mt-4 text-lg">Stories of Success from Events Like Yours</p>
        </div>
        <div className="relative max-w-3xl mx-auto">
            <div className="overflow-hidden relative min-h-[350px] flex items-center justify-center">
                {testimonials.map((testimonial, index) => (
                    <div
                        key={index}
                        className={`transition-opacity duration-700 ease-in-out absolute w-full ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}
                    >
                        {activeIndex === index && (
                             <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col text-center animate-fade-in">
                                <img className="w-20 h-20 rounded-full mx-auto mb-4" src={testimonial.avatar} alt={`Avatar of ${testimonial.author}`} />
                                <Quote className="w-10 h-10 text-red-300 mb-4 mx-auto" aria-hidden="true"/>
                                <p className="text-gray-600 italic text-lg mb-6 flex-grow">"{testimonial.quote}"</p>
                                <div className="mt-auto">
                                    <p className="font-bold text-xl text-gray-900">{testimonial.author}</p>
                                    <p className="text-md text-gray-500">{testimonial.event}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
             <button onClick={prevSlide} aria-label="Previous testimonial" className="absolute top-1/2 -left-4 md:-left-16 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500">
                <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button onClick={nextSlide} aria-label="Next testimonial" className="absolute top-1/2 -right-4 md:-right-16 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500">
                <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex space-x-2">
                {testimonials.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                        className={`w-3 h-3 rounded-full transition-colors ${activeIndex === index ? 'bg-red-600' : 'bg-gray-300 hover:bg-gray-400'}`}
                    ></button>
                ))}
            </div>
        </div>
      </Section>
    );
};

const CtaSection: FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => (
  <section 
    className="relative bg-cover bg-center bg-fixed py-24" 
    style={{ backgroundImage: "url('https://picsum.photos/seed/cta/1920/1080')" }}
    aria-labelledby="cta-heading"
  >
    <div className="absolute inset-0 bg-gray-900 bg-opacity-70" aria-hidden="true"></div>
    <div className="relative max-w-4xl mx-auto text-center px-4">
      <h2 id="cta-heading" className="text-4xl md:text-5xl font-extrabold text-white">Ready to Create Something Unforgettable?</h2>
      <p className="mt-6 text-lg text-gray-300">Let's discuss how we can elevate your next event from great to absolutely legendary. We're here to bring your vision to life.</p>
      <div className="mt-12 flex justify-center gap-4">
        <button
          onClick={() => navigateTo('booking')}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105 animate-pulse-cta"
        >
          Book a Consultation
        </button>
        <button
          onClick={() => navigateTo('contact')}
          className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900 transition-transform transform hover:scale-105"
        >
          Contact Us
        </button>
      </div>
    </div>
  </section>
);


const HomePage: FC<{ navigateTo: (page: Page, service?: string | null) => void }> = ({ navigateTo }) => {
  const featuredArtist = artistShowcases[1];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    }
  };

  const whyChooseUsFeatures = [
    { icon: Award, title: "Unmatched Quality", description: "We use state-of-the-art equipment to deliver pristine audio and stunning visuals." },
    { icon: Users, title: "Expert Team", description: "Our passionate professionals are dedicated to flawless execution and client satisfaction." },
    { icon: Heart, title: "Custom Solutions", description: "Every event is unique. We tailor our services to match your specific vision and goals." },
  ];

  return (
    <div className="animate-page-content-enter">
        <header 
            className="relative h-screen flex items-center justify-center text-white text-center px-4 overflow-hidden"
            role="banner"
        >
            <div className="absolute top-0 left-0 w-full h-full">
                <video 
                    className="w-full h-full object-cover" 
                    src="https://videos.pexels.com/video-files/2022752/2022752-hd_1920_1080_30fps.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    poster="https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070&auto=format&fit=crop"
                />
            </div>
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="relative z-10 stagger-in">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight" style={{ animationDelay: '0.1s' }}>Crafting Unforgettable <span className="text-red-500">Experiences</span></h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-200" style={{ animationDelay: '0.3s' }}>From intimate gatherings to large-scale productions, we provide the sound, vision, and expertise to make your event a stunning success.</p>
                <div className="mt-10 flex flex-wrap justify-center gap-4" style={{ animationDelay: '0.5s' }}>
                    <button onClick={() => navigateTo('services')} className="flex items-center gap-2 bg-red-600 text-white font-bold py-3 px-8 rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 animate-pulse-cta">
                        <Speaker size={20} /> Our Services
                    </button>
                    <button onClick={() => navigateTo('gallery')} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-bold py-3 px-8 rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50">
                        <PlayCircle size={20} /> View Our Work
                    </button>
                </div>
            </div>
        </header>
        <main>
            <Section id="why-us">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {whyChooseUsFeatures.map((feature, index) => (
                        <div key={index} className="p-8">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mx-auto mb-6">
                                <feature.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                            <p className="text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </Section>
            <ServicesHighlightSection navigateTo={navigateTo} />
            <ProcessSection />

            <Section id="featured-work" className="bg-gray-900 text-white">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <p className="text-red-500 font-semibold tracking-wide">Featured Work</p>
                        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">{featuredArtist.trackTitle}</h2>
                        <p className="text-lg text-red-400">{featuredArtist.artistName}</p>
                        <p className="text-gray-300">{featuredArtist.description}</p>
                        <button onClick={() => navigateTo('about')} className="mt-4 inline-flex items-center gap-2 text-white font-bold py-3 px-6 rounded-full bg-red-600 hover:bg-red-700 transition-colors">
                            More Collaborations <span aria-hidden="true">&rarr;</span>
                        </button>
                    </div>
                    <div className="flex justify-center items-center">
                        <div className="relative w-full max-w-sm">
                            <img src={featuredArtist.albumArt} alt={`Album art for ${featuredArtist.trackTitle}`} className="w-full rounded-lg shadow-2xl" />
                            <div className="absolute -bottom-8 w-11/12 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-lg rounded-lg p-4 flex items-center space-x-4">
                                <audio ref={audioRef} src={featuredArtist.trackUrl} onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} />
                                <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'} className="bg-red-600 text-white rounded-full p-3 hover:bg-red-700 shadow-md flex-shrink-0">
                                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                                </button>
                                <div className="flex-grow">
                                    <p className="font-bold text-white truncate">{featuredArtist.trackTitle}</p>
                                    <p className="text-sm text-gray-200">{featuredArtist.artistName}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>
            
            <TestimonialsSection />
            <CtaSection navigateTo={navigateTo} />
        </main>
    </div>
  );
};

const PageContent: FC<{ title: string; subtitle: string; children: ReactNode }> = ({ title, subtitle, children }) => (
  <div className="animate-page-content-enter">
    <header 
        className="relative bg-cover bg-center text-white py-20 px-4 text-center"
        style={{ backgroundImage: "url('https://picsum.photos/seed/stage-lights/1920/500')" }}
    >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/60 to-transparent" aria-hidden="true"></div>
        <div className="relative z-10">
            <h1 className="text-5xl font-extrabold">{title}</h1>
            <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">{subtitle}</p>
        </div>
    </header>
    <main>
      {children}
    </main>
  </div>
);

const ArtistShowcaseSection: FC = () => {
    const soundGenres = ['All', 'Electronic', 'Rock', 'Hip-Hop', 'Pop', 'Afrobeat'];
    const [activeFilter, setActiveFilter] = useState('All');
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [copiedTrack, setCopiedTrack] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [prevVolume, setPrevVolume] = useState(1);
    const audioRef = useRef<HTMLAudioElement>(null);

    const filteredShowcases = artistShowcases.filter(showcase => activeFilter === 'All' || showcase.genre === activeFilter);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);
        const handleVolumeChange = () => setVolume(audio.volume);
        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('volumechange', handleVolumeChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('volumechange', handleVolumeChange);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        
        if (currentlyPlaying) {
            if (audio.src !== currentlyPlaying) {
                audio.src = currentlyPlaying;
            }
            if (isPlaying) {
                audio.play().catch(e => console.error("Audio play failed:", e));
            } else {
                audio.pause();
            }
        }
    }, [isPlaying, currentlyPlaying]);

    const handlePlayPause = (trackUrl: string) => {
        if (currentlyPlaying === trackUrl) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentlyPlaying(trackUrl);
            setIsPlaying(true);
        }
    };

    const handleCopyLink = (trackTitle: string) => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setCopiedTrack(trackTitle);
            setTimeout(() => setCopiedTrack(null), 2000);
        }).catch(err => console.error('Failed to copy text: ', err));
    };

    const formatTime = (timeInSeconds: number) => {
        if (isNaN(timeInSeconds) || timeInSeconds === 0) return '0:00';
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || !isFinite(duration)) return;
        const progressBar = e.currentTarget;
        const clickPosition = e.clientX - progressBar.getBoundingClientRect().left;
        const progressBarWidth = progressBar.offsetWidth;
        const seekTime = (clickPosition / progressBarWidth) * duration;
        audio.currentTime = seekTime;
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (!audio) return;
        const newVolume = parseFloat(e.target.value);
        audio.volume = newVolume;
    };

    const toggleMute = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (volume > 0) {
            setPrevVolume(volume);
            audio.volume = 0;
        } else {
            audio.volume = prevVolume;
        }
    };

    const VolumeIcon = () => {
        if (volume === 0) return <VolumeX size={22} />;
        if (volume < 0.5) return <Volume1 size={22} />;
        return <Volume2 size={22} />;
    };

    return (
        <Section id="artist-showcase" className="bg-gray-50">
            <audio ref={audioRef} />
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Featured Artist Collaborations</h2>
                <p className="text-red-600 mt-4 text-lg">Hear the quality and creativity we bring to every project we touch.</p>
            </div>
            
            <div className="flex justify-center mb-12">
                <div className="bg-white p-2 rounded-full shadow-md flex-wrap inline-flex">
                    {soundGenres.map(genre => (
                        <button
                            key={genre}
                            onClick={() => setActiveFilter(genre)}
                            aria-pressed={activeFilter === genre}
                            className={`px-4 sm:px-6 py-2 m-1 rounded-full text-sm sm:text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                                activeFilter === genre
                                    ? 'bg-red-600 text-white shadow'
                                    : 'bg-transparent text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredShowcases.map(showcase => {
                    const isActiveTrack = currentlyPlaying === showcase.trackUrl;
                    const isCurrentlyPlaying = isActiveTrack && isPlaying;
                    const shareUrl = window.location.href;
                    const shareText = `Check out "${showcase.trackTitle}" by ${showcase.artistName}! Produced by Boyal Integrated Service.`;
                    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
                    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

                    return (
                        <div key={showcase.trackTitle} className={`bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transition-shadow duration-300 ${isActiveTrack ? 'ring-2 ring-red-500' : ''}`}>
                            <div className="relative">
                                <img src={showcase.albumArt} alt={`Album art for ${showcase.trackTitle}`} className="w-full h-64 object-cover" />
                                <button 
                                    onClick={() => handlePlayPause(showcase.trackUrl)}
                                    aria-label={isCurrentlyPlaying ? `Pause ${showcase.trackTitle}` : `Play ${showcase.trackTitle}`}
                                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:bg-opacity-50 focus:outline-none"
                                >
                                    {isCurrentlyPlaying ? (
                                        <Pause className="h-16 w-16 text-white drop-shadow-lg" />
                                    ) : (
                                        <Play className="h-16 w-16 text-white drop-shadow-lg" />
                                    )}
                                </button>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold text-gray-900">{showcase.trackTitle}</h3>
                                <p className="text-md text-red-600 mb-2">{showcase.artistName}</p>
                                <p className="text-gray-600 text-sm flex-grow">{showcase.description}</p>
                                
                                {isActiveTrack && (
                                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-fade-in">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs font-mono text-gray-500 w-10 text-left">{formatTime(currentTime)}</span>
                                            <div onClick={handleSeek} className="w-full h-2 bg-gray-200 rounded-full cursor-pointer group/progress">
                                                <div style={{ width: `${(duration > 0 ? (currentTime / duration) : 0) * 100}%` }} className="h-full bg-red-600 rounded-full relative transition-all duration-75 ease-linear">
                                                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-2 border-red-600 opacity-0 group-hover/progress:opacity-100 transition-opacity"></div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-mono text-gray-500 w-10 text-right">{formatTime(duration)}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 w-1/3">
                                                <button onClick={toggleMute} aria-label={volume > 0 ? 'Mute' : 'Unmute'} className="text-gray-500 hover:text-red-600 transition-colors">
                                                    <VolumeIcon />
                                                </button>
                                                <input
                                                    type="range"
                                                    min="0" max="1" step="0.01"
                                                    value={volume}
                                                    onChange={handleVolumeChange}
                                                    aria-label="Volume"
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                                                />
                                            </div>
                                            <div className="w-1/3 flex justify-center">
                                                 <button onClick={() => setIsPlaying(!isPlaying)} className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 shadow-md">
                                                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                                </button>
                                            </div>
                                            <div className="w-1/3"></div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className={`mt-4 pt-4 ${!isActiveTrack ? 'border-t' : ''} border-gray-200 flex items-center justify-between`}>
                                    <p className="text-sm font-semibold text-gray-700 flex items-center"><Share2 size={16} className="mr-2"/> Share</p>
                                    <div className="flex items-center space-x-2">
                                        <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" className="text-gray-500 hover:text-blue-500 transition-colors p-2 rounded-full hover:bg-gray-100"><Twitter size={20}/></a>
                                        <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="text-gray-500 hover:text-blue-700 transition-colors p-2 rounded-full hover:bg-gray-100"><Facebook size={20}/></a>
                                        <button onClick={() => handleCopyLink(showcase.trackTitle)} aria-label="Copy link" className="text-gray-500 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-gray-100 w-20 text-center">
                                            {copiedTrack === showcase.trackTitle ? 'Copied!' : <Link size={20} className="mx-auto" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Section>
    );
};

const AboutPage: FC<{navigateTo: (page: Page) => void}> = ({ navigateTo }) => {
    const values = [
        { icon: Heart, title: "Passion", description: "Our work is driven by a deep love for creating incredible audio-visual experiences." },
        { icon: Star, title: "Excellence", description: "We uphold the highest standards, using top-tier equipment and expert techniques." },
        { icon: Users, title: "Partnership", description: "We collaborate closely with our clients, treating their vision as our own." },
    ];

    const stats = [
        { value: "10+", label: "Years of Experience" },
        { value: "500+", label: "Successful Events" },
        { value: "100%", label: "Passion for Perfection" },
    ];

    return (
        <PageContent title="About Us" subtitle="The Passion and Expertise Behind Every Event">
            {/* Our Story Section */}
            <Section id="our-story" className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="prose prose-lg max-w-none text-gray-600">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey in Sound</h2>
                        <p>
                            Founded over a decade ago with a single microphone and an immense passion for audio, Boyal Integrated Service has grown into a premier provider of production and event services. Our philosophy is simple: combine cutting-edge technology with creative artistry to produce experiences that resonate.
                        </p>
                        <p>
                            We believe that every event, from a corporate conference to a sold-out concert, is a unique story waiting to be told. Our role is to provide the perfect sonic and visual backdrop for that story. We are a team of engineers, planners, and artists dedicated to the pursuit of perfection.
                        </p>
                    </div>
                    <div>
                        <img 
                            src="https://picsum.photos/seed/about-team/800/600" 
                            alt="The Boyal Integrated Service team collaborating in their studio." 
                            className="rounded-xl shadow-2xl w-full h-auto object-cover"
                        />
                    </div>
                </div>
            </Section>

            {/* Stats Section */}
            <section className="bg-gray-900 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        {stats.map((stat) => (
                            <div key={stat.label}>
                                <p className="text-5xl font-extrabold text-red-500">{stat.value}</p>
                                <p className="mt-2 text-lg font-medium text-gray-300">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <Section id="core-values" className="bg-gray-50">
                 <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Core Values</h2>
                    <p className="text-red-600 mt-4 text-lg">The Principles That Guide Us</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {values.map((value) => (
                        <div key={value.title} className="text-center p-8 bg-white rounded-xl shadow-lg border-t-4 border-red-500">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mx-auto mb-6">
                                <value.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                            <p className="text-gray-600">{value.description}</p>
                        </div>
                    ))}
                </div>
            </Section>

            {/* Meet the Team Section */}
            <Section id="team">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Meet the Team</h2>
                    <p className="text-red-600 mt-4 text-lg">The Experts Behind the Magic</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {teamMembers.map((member) => (
                        <div key={member.name} className="text-center group">
                            <div className="relative w-48 h-48 mx-auto mb-4">
                                <img 
                                    src={member.avatar} 
                                    alt={`Portrait of ${member.name}`} 
                                    className="w-full h-full rounded-full object-cover shadow-lg transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                            <p className="text-red-600 font-medium">{member.title}</p>
                        </div>
                    ))}
                </div>
            </Section>
            
            <ArtistShowcaseSection />
            <CtaSection navigateTo={navigateTo} />
        </PageContent>
    );
};

const ServicesPage: FC<{ navigateTo: (page: Page, service?: string | null) => void }> = ({ navigateTo }) => {
    const categories: ServiceCategory[] = ['Production', 'Live Sound', 'Planning'];
    const allCategories: ('All' | ServiceCategory)[] = ['All', ...categories];
    const [activeFilter, setActiveFilter] = useState<'All' | ServiceCategory>('All');

    const filteredServices = services.filter(service => activeFilter === 'All' || service.category === activeFilter);

    return (
        <PageContent title="Our Services" subtitle="Comprehensive Solutions for Audio, Video, and Event Production">
            <Section id="services-list" className="bg-gray-50">
                <div className="flex justify-center mb-12">
                    <div className="bg-white p-2 rounded-full shadow-md">
                        {allCategories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveFilter(category)}
                                aria-pressed={activeFilter === category}
                                className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                                    activeFilter === category
                                        ? 'bg-red-600 text-white shadow'
                                        : 'bg-transparent text-gray-600 hover:bg-gray-100'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredServices.map(service => (
                        <div 
                            key={service.title}
                            className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300"
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center mb-3 text-red-600">
                                    <service.icon className="h-6 w-6 mr-3" />
                                    <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                </div>
                                <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                                <button
                                    onClick={() => navigateTo('serviceDetail', service.title)}
                                    className="mt-auto self-start font-semibold text-red-600 hover:text-red-800 transition-colors duration-300 flex items-center group"
                                >
                                    Learn More
                                    <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </Section>
        </PageContent>
    );
};


const ServiceDetailPage: FC<{ serviceTitle: string; navigateTo: (page: Page) => void }> = ({ serviceTitle, navigateTo }) => {
    const service = services.find(s => s.title === serviceTitle);

    if (!service) {
        return (
            <PageContent title="Error" subtitle="Service not found.">
                <div className="text-center py-16">
                    <p>The service you are looking for does not exist.</p>
                    <button onClick={() => navigateTo('services')} className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700">
                        Back to Services
                    </button>
                </div>
            </PageContent>
        );
    }

    return (
        <div className="animate-page-content-enter">
            <header 
                className="relative bg-cover bg-center text-white py-32 px-4 text-center"
                style={{ backgroundImage: `url(${service.image})` }}
            >
                <div className="absolute inset-0 bg-black opacity-60"></div>
                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold">{service.title}</h1>
                    <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">{service.description}</p>
                </div>
            </header>
            <main>
                <Section id="service-details" className="bg-white">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                        <div className="lg:col-span-3">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Service Overview</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">{service.longDescription}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
                            <ul className="space-y-3">
                                {service.features.map(feature => (
                                    <li key={feature} className="flex items-center">
                                        <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="lg:col-span-2">
                            <div className="bg-gray-50 p-8 rounded-lg shadow-lg sticky top-24">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Interested in this service?</h3>
                                <p className="text-gray-600 mb-6">Let's start a conversation about how we can make your next event a success.</p>
                                <button
                                    onClick={() => navigateTo('booking')}
                                    className="w-full bg-red-600 text-white font-bold py-3 px-6 rounded-md hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50"
                                >
                                    Book Now
                                </button>
                                <button
                                    onClick={() => navigateTo('contact')}
                                    className="w-full mt-4 bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-md hover:bg-gray-300 transition-all duration-300"
                                >
                                    Contact Us
                                </button>
                            </div>
                        </div>
                    </div>
                </Section>
                <CtaSection navigateTo={navigateTo} />
            </main>
        </div>
    );
};

const GalleryPage: FC = () => {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);

    const openModal = (image: GalleryImage, element: HTMLButtonElement) => {
        setSelectedImage(image);
        triggerRef.current = element;
    };
    const closeModal = () => setSelectedImage(null);

    useEffect(() => {
        // This useEffect hook manages focus trapping for accessibility.
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeModal();

            // Focus trap logic
            if (e.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll<HTMLElement>('button');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };

        if (selectedImage) {
            document.addEventListener('keydown', handleKeyDown);
            // Move focus to the modal when it opens
            modalRef.current?.focus();
        } else {
            // Return focus to the image that opened the modal
            triggerRef.current?.focus();
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedImage]);

    return (
        <PageContent title="Our Gallery" subtitle="A Glimpse Into the Unforgettable Experiences We've Created">
            <Section id="gallery-grid">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {galleryImages.map((image, index) => (
                        <div key={index} className="group relative aspect-square overflow-hidden rounded-md">
                             <button
                                onClick={(e) => openModal(image, e.currentTarget)}
                                className="w-full h-full block focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-offset-2 rounded-md"
                                aria-label={`View larger image for ${image.caption}`}
                            >
                                <img
                                    src={image.src}
                                    alt={image.caption}
                                    className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                    <span className="text-white text-lg font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">&#43;</span>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>
            </Section>

            {selectedImage && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-caption"
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 animate-fade-in"
                    onClick={closeModal}
                >
                    <div
                        ref={modalRef}
                        tabIndex={-1}
                        className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-11/12 max-h-[90vh] flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                         <div className="p-4 flex-grow flex items-center justify-center">
                            <img src={selectedImage.src.replace('600/400', '1200/800')} alt={selectedImage.caption} className="max-w-full max-h-[75vh] object-contain rounded"/>
                         </div>
                        <div id="modal-caption" className="bg-black/70 text-white text-center p-3">
                            <p>{selectedImage.caption}</p>
                        </div>
                         <button
                            onClick={closeModal}
                            aria-label="Close image viewer"
                            className="absolute -top-4 -right-4 h-10 w-10 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors duration-300 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </PageContent>
    );
};

const BookingPage: FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <PageContent title="Book Our Services" subtitle="Let's Start Planning Your Next Unforgettable Event">
      <Section id="booking-form" className="bg-gray-50">
        <div className="max-w-3xl mx-auto">
            <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl">
                {isSubmitted ? (
                    <div className="text-center p-8 animate-fade-in-up">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                        <p className="text-gray-600 mb-6">Your booking request has been sent successfully. We will get back to you shortly to confirm the details.</p>
                        <button
                            onClick={() => {
                                setIsSubmitted(false);
                                setSelectedService('');
                            }}
                            className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-all duration-300"
                        >
                            Submit Another Request
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <input type="text" placeholder="Full Name" aria-label="Full Name" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
                            <input type="email" placeholder="Email Address" aria-label="Email Address" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
                            <input type="tel" placeholder="Phone Number" aria-label="Phone Number" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
                            <input type="text" placeholder="Event Type (e.g., Concert, Wedding)" aria-label="Event Type" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
                        </div>
                        <div className="mb-6">
                            <select
                                name="service"
                                aria-label="Service Type"
                                required
                                value={selectedService}
                                onChange={(e) => setSelectedService(e.target.value)}
                                className={`w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${selectedService ? 'text-gray-900' : 'text-gray-500'}`}
                            >
                                <option value="" disabled>Select a Service...</option>
                                {services.map((service) => (
                                    <option key={service.title} value={service.title} className="text-gray-900">
                                        {service.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-6">
                             <input type="date" aria-label="Event Date" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-500"/>
                        </div>
                        <div className="mb-6">
                            <textarea placeholder="Tell us more about your event..." aria-label="Event Details" rows={6} required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-500 focus:ring-opacity-50 text-lg">
                            Submit Request
                        </button>
                    </form>
                )}
            </div>
        </div>
      </Section>
    </PageContent>
  );
};

const ContactPage: FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const contactDetails = [
    { icon: Phone, text: "+1 (555) 123-4567", href: "tel:+1-555-123-4567" },
    { icon: Mail, text: "contact@boyalservice.com", href: "mailto:contact@boyalservice.com" },
    { icon: MapPin, text: "123 Music Row, Nashville, TN", href: "#" },
  ];
  return (
    <PageContent title="Contact Us" subtitle="We're Here to Help. Reach Out with Any Questions or Inquiries.">
      <Section id="contact-details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl">
              {isSubmitted ? (
                  <div className="text-center p-8 animate-fade-in-up">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
                      <p className="text-gray-600 mb-6">Your message has been sent successfully. We will get back to you shortly.</p>
                      <button
                          onClick={() => setIsSubmitted(false)}
                          className="bg-red-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-700 transition-all duration-300"
                      >
                          Send Another Message
                      </button>
                  </div>
              ) : (
                  <>
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                      <form onSubmit={handleSubmit}>
                          <div className="grid grid-cols-1 gap-6 mb-6">
                              <input type="text" placeholder="Your Name" aria-label="Your Name" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
                              <input type="email" placeholder="Your Email" aria-label="Your Email" required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"/>
                              <textarea placeholder="Your Message" aria-label="Your Message" rows={5} required className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"></textarea>
                          </div>
                          <button type="submit" className="w-full bg-red-600 text-white font-bold py-4 px-8 rounded-lg hover:bg-red-700 transition-all duration-300">
                              Send Message
                          </button>
                      </form>
                  </>
              )}
          </div>
          <div className="space-y-8">
              <h2 className="text-3xl font-bold text-gray-900">Contact Information</h2>
              <p className="text-gray-600 text-lg">
                  Have a question or want to discuss a project? Get in touch with us through any of the channels below. We look forward to hearing from you.
              </p>
              <ul className="space-y-6">
                {contactDetails.map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="flex-shrink-0 h-12 w-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                      <item.icon className="h-6 w-6"/>
                    </div>
                    <a href={item.href} className="ml-4 text-lg text-gray-700 hover:text-red-600 transition-colors">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex space-x-4 mt-6">
                  <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-red-600 transition-colors"><Facebook size={28}/></a>
                  <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-red-600 transition-colors"><Twitter size={28}/></a>
                  <a href="#" aria-label="Instagram" className="text-gray-500 hover:text-red-600 transition-colors"><Instagram size={28}/></a>
                  <a href="#" aria-label="LinkedIn" className="text-gray-500 hover:text-red-600 transition-colors"><Linkedin size={28}/></a>
              </div>
          </div>
        </div>
      </Section>
    </PageContent>
  );
};

// ~~~ MAIN APP COMPONENT ~~~

const App: FC = () => {
  const [appState, setAppState] = useState<AppState>({ currentPage: 'home', currentService: null });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigateTo = (page: Page, service: string | null = null) => {
    setAppState({ currentPage: page, currentService: service });
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };
  
  const renderPage = () => {
    switch (appState.currentPage) {
      case 'home': return <HomePage navigateTo={navigateTo} />;
      case 'about': return <AboutPage navigateTo={navigateTo} />;
      case 'services': return <ServicesPage navigateTo={navigateTo} />;
      case 'serviceDetail': return <ServiceDetailPage serviceTitle={appState.currentService!} navigateTo={navigateTo} />;
      case 'gallery': return <GalleryPage />;
      case 'booking': return <BookingPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="bg-white text-gray-800">
      <nav role="navigation" aria-label="Main navigation" className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
                <button onClick={() => navigateTo('home')} className="flex-shrink-0 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-lg">
                    <Music className="h-10 w-10 text-red-600" />
                    <span className="text-xl font-bold text-gray-900">Boyal Integrated Service</span>
                </button>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-1">
                {navLinks.map(({ page, title }) => (
                  <NavLink key={page} page={page} appState={appState} navigateTo={navigateTo}>
                    {title}
                  </NavLink>
                ))}
              </div>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navLinks.map(({ page, title }) => (
                <NavLink key={page} page={page} appState={appState} navigateTo={navigateTo} isMobile>
                  {title}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      {renderPage()}

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Services</h3>
              <ul className="mt-4 space-y-2">
                {services.slice(0, 4).map(s => (
                  <li key={s.title}>
                    <button onClick={() => navigateTo('serviceDetail', s.title)} className="text-base text-gray-300 hover:text-white">{s.title}</button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2">
                 {['about', 'gallery', 'contact'].map(p => (
                   <li key={p}>
                     <button onClick={() => navigateTo(p as Page)} className="text-base text-gray-300 hover:text-white capitalize">{p}</button>
                   </li>
                 ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect With Us</h3>
                <p className="mt-4 text-base text-gray-300">Follow us on social media for the latest updates and behind-the-scenes content.</p>
                <div className="flex space-x-6 mt-4">
                    <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white"><Facebook size={24}/></a>
                    <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white"><Twitter size={24}/></a>
                    <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white"><Instagram size={24}/></a>
                    <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white"><Linkedin size={24}/></a>
                </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} Boyal Integrated Service. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
