import React, { useState, FC, ReactNode, useRef, useEffect } from 'react';
import { Page } from './types';
import { 
  Music, MonitorSpeaker, Mic, Headphones, Cable, Menu, X, Facebook, Twitter, Instagram, Linkedin, 
  PartyPopper, Phone, Mail, MapPin, Quote, CheckCircle, PlayCircle, MessageSquare, ClipboardList, 
  Play, Award, Heart, Star, Users, Pause, Link, Share2, Volume2, Volume1, VolumeX, ChevronLeft, 
  ChevronRight, Speaker, Send, ShoppingCart, Info, Calendar, User, Clock, Square,
  // Add the missing icons:
  Lightbulb, Video, Layers, Zap, Palette, BarChart3, Theater
} from 'lucide-react';
import { GoogleGenAI, Chat } from '@google/genai';

const API_BASE_URL = 'http://localhost:3001/api';

// ~~~ TYPE DEFINITIONS ~~~
interface AppState {
  currentPage: Page;
  currentService: string | null;
  currentProduct: string | null;
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
  id: number;
  iconName: string;
  icon?: React.ElementType;
  title: string;
  description: string;
  longDescription: string;
  features: string[];
  image: string;
  highlightImage: string;
  category: ServiceCategory;
}

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  event: string;
  avatar: string;
}

interface GalleryImage {
  src: string;
  caption: string;
}

interface ArtistShowcase {
  artistName: string;
  albumArt: string;
  trackTitle: string;
  trackUrl: string;
  description: string;
  genre: 'Pop' | 'Rock' | 'Gospel' | 'Hip-Hop' | 'Afrobeat';
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  error?: boolean;
}

type ProductCategory = 'Microphones' | 'Speakers' | 'Mixers' | 'Lighting';

interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  brand: string;
  image: string;
  description: string;
  longDescription: string;
  specs: { key: string; value: string }[];
}

interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  eventType: string;
  subject: string;
  service: string;
  eventDate: string;
  details: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// ~~~ HELPER DATA ~~~
const navLinks: { page: Page; title: string }[] = [
  { page: 'home', title: 'Home' },
  { page: 'about', title: 'About' },
  { page: 'services', title: 'Services' },
  { page: 'gallery', title: 'Gallery' },
  { page: 'products', title: 'Products'},
  { page: 'booking', title: 'Booking' },
  { page: 'contact', title: 'Contact' },
];

const serviceIcons: { [key: string]: React.ElementType } = {
  Music,
  MonitorSpeaker,
  Mic,
  Headphones,
  Cable,
  PartyPopper,
};

const galleryImages: GalleryImage[] = [
  { src: '/images/gallery/e1.jpeg', caption: 'Live concert setup with vibrant stage lights' },
  { src: '/images/gallery/e2.jpeg', caption: 'Corporate event audio-visual arrangement' },
  { src: '/images/gallery/e3.jpeg', caption: 'Intimate wedding reception sound system' },
  { src: '/images/gallery/e4.jpeg', caption: 'Music festival main stage production' },
  { src: '/images/gallery/e5.jpeg', caption: 'Studio recording session in progress' },
  { src: '/images/gallery/e6.jpeg', caption: 'Outdoor event sound reinforcement' },
  { src: '/images/gallery/e7.jpeg', caption: 'DJ booth with professional equipment' },
  { src: '/images/gallery/e8.jpeg', caption: 'Detailed shot of a mixing console' },
  { src: '/images/gallery/e9.jpeg', caption: 'Team setting up for a large-scale event' },
  { src: '/images/gallery/e10.jpeg', caption: 'Team setting up for a large-scale event' },
  { src: '/images/gallery/e11.jpeg', caption: 'Team setting up for a large-scale event' },
  { src: '/images/gallery/e15.jpeg', caption: 'Team setting up for a large-scale event' },
];

const artistShowcases: ArtistShowcase[] = [
  {
    artistName: "Made Kuti",
    albumArt: "/images/artists/Mide.jpeg",
    trackTitle: "The Homeland",
    trackUrl: "https://cdn.trendybeatz.com/audio/Burna-Boy-23.mp3",
    description: "Song by Busy Signal, Made Kuti, and Morgan Heritage",
    genre: 'Afrobeat',
  },
  {
    artistName: "Nathaniel Bassey",
    albumArt: "/images/artists/Bassy.jpg",
    trackTitle: "The River",
    trackUrl: "https://cdn.pixabay.com/download/audio/2022/08/04/audio_2d02511475.mp3",
    description: "We Come Before Your Presence · Nathaniel Bassey · Yahweh Sabaoth · Nathaniel Bassey",
    genre: 'Gospel',
  },
  {
    artistName: "Naira Marley",
    albumArt: "/images/artists/Naira.jpeg",
    trackTitle: "Soapy",
    trackUrl: "https://cdn.pixabay.com/download/audio/2022/05/23/audio_784133496c.mp3",
    description: "Soapy appears to be crude song about masturbation but that is just what Naira wants the powers that be to think",
    genre: 'Afrobeat',
  },
  {
    artistName: "Sunmisola Agbebi",
    albumArt: "/images/artists/Sumi.jpg",
    trackTitle: "Prevalling Worship",
    trackUrl: "https://cdn.pixabay.com/download/audio/2022/09/26/audio_55392b5123.mp3",
    description: "Prevailing Worship from Prevailing Worship by Yinka Okeleye, Sunmisola Agbebi & Moses Bliss now.",
    genre: 'Gospel',
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
const ServicesHighlightSection: FC<{ services: Service[], navigateTo: (page: Page, service?: string | null) => void }> = ({ services, navigateTo }) => (
  <Section id="home-services" className="bg-gray-50">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Signature Services</h2>
      <p className="text-red-600 mt-4 text-lg">Comprehensive Solutions for Unforgettable Events</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {services.slice(0, 3).map((service) => {
        const Icon = service.icon;
        if (!Icon) return null;
        return (
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
                    <Icon className="h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
                    <h3 className="text-3xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 max-h-0 group-hover:max-h-screen">{service.description}</p>
                    <span className="font-semibold text-red-500 flex items-center">
                        Learn More <span className="ml-2 transition-transform duration-300 group-hover:translate-x-2" aria-hidden="true">&rarr;</span>
                    </span>
                </div>
            </div>
        </div>
        );
      })}
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

const TestimonialsSection: FC<{testimonials: Testimonial[]}> = ({ testimonials }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
      if (!testimonials.length) return;
      const interval = setInterval(() => {
          setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
      }, 5000);
      return () => clearInterval(interval);
  }, [testimonials]);

  const goToSlide = (index: number) => {
      setActiveIndex(index);
  };

  const nextSlide = () => {
      setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  };

  const prevSlide = () => {
      setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };
  
  if (!testimonials.length) return (
      <Section id="testimonials" className="bg-gray-50">
          <div className="text-center">Loading testimonials...</div>
      </Section>
  );

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

const HomePage: FC<{ services: Service[], testimonials: Testimonial[], navigateTo: (page: Page, service?: string | null) => void }> = ({ services, testimonials, navigateTo }) => {
  const featuredArtist = artistShowcases[1];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(error => {
              console.error('Error playing audio:', error);
            });
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
            <ServicesHighlightSection services={services} navigateTo={navigateTo} />
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
            
            <TestimonialsSection testimonials={testimonials} />
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

// Services Page
const ServicesPage: FC<{ services: Service[], navigateTo: (page: Page, service?: string | null) => void }> = ({ services, navigateTo }) => {
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

              {filteredServices.length === 0 ? (
                  <div className="text-center py-12">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 max-w-2xl mx-auto">
                          <Info className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-yellow-800 mb-2">No Services Found</h3>
                          <p className="text-yellow-700">No services match the selected category filter.</p>
                          <button 
                              onClick={() => setActiveFilter('All')}
                              className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors"
                          >
                              Show All Services
                          </button>
                      </div>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {filteredServices.map(service => {
                          const Icon = service.icon;
                          if (!Icon) return null;
                          return (
                          <div 
                              key={service.title}
                              className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300"
                          >
                              <div className="relative h-56 overflow-hidden">
                                  <img 
                                      src={service.image} 
                                      alt={service.title} 
                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                      onError={(e) => {
                                          const target = e.target as HTMLImageElement;
                                          target.src = '/images/placeholder-service.jpg';
                                      }}
                                  />
                                  <div className="absolute top-3 left-3">
                                      <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
                                          {service.category}
                                      </span>
                                  </div>
                              </div>
                              <div className="p-6 flex flex-col flex-grow">
                                  <div className="flex items-center mb-3 text-red-600">
                                      <Icon className="h-6 w-6 mr-3" />
                                      <h3 className="text-xl font-bold text-gray-900">{service.title}</h3>
                                  </div>
                                  <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
                                  <div className="flex flex-wrap gap-1 mb-4">
                                      {service.features.slice(0, 3).map((feature, index) => (
                                          <span key={index} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                              {feature}
                                          </span>
                                      ))}
                                  </div>
                                  <button
                                      onClick={() => navigateTo('serviceDetail', service.title)}
                                      className="mt-auto self-start font-semibold text-red-600 hover:text-red-800 transition-colors duration-300 flex items-center group"
                                  >
                                      Learn More
                                      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                                  </button>
                              </div>
                          </div>
                          );
                      })}
                  </div>
              )}
          </Section>
      </PageContent>
  );
};

// Individual Service Page Components
const MusicProductionPage: FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => (
  <PageContent title="Music Production" subtitle="Professional studio recording, mixing, and mastering services">
    <Section id="music-production-detail" className="bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="/images/services/music-production-hero.jpg" 
              alt="Professional Music Production Studio"
              className="w-full rounded-2xl shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/services/Music.jpg';
              }}
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Professional Music Production</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Transform your musical vision into professional-quality recordings with our state-of-the-art 
              production facilities. From initial concept to final master, we provide comprehensive music 
              production services for artists, bands, and producers.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Multi-track Recording</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Expert Mixing</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Professional Mastering</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Vocal Production</span>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigateTo('booking')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                Book Studio Session
              </button>
              <button 
                onClick={() => navigateTo('contact')}
                className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-colors font-semibold text-lg"
              >
                Get Consultation
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">What We Offer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Recording Sessions",
                description: "Professional recording in acoustically treated studios with top-tier equipment",
                features: ["Multi-track recording", "Live band sessions", "Vocal booths", "Instrument tracking"]
              },
              {
                title: "Mixing & Mastering",
                description: "Expert audio engineering to perfect your sound across all platforms",
                features: ["EQ & Compression", "Spatial effects", "Loudness optimization", "Format conversion"]
              },
              {
                title: "Vocal Production",
                description: "Professional vocal recording, tuning, and production services",
                features: ["Pitch correction", "Harmony creation", "Vocal comping", "Effects processing"]
              },
              {
                title: "Beat Production",
                description: "Custom beat creation and arrangement for your projects",
                features: ["Original compositions", "Sample clearance", "Drum programming", "Arrangement"]
              },
              {
                title: "Session Musicians",
                description: "Access to professional session players for your recordings",
                features: ["Guitarists", "Drummers", "Keyboardists", "String sections"]
              },
              {
                title: "Final Delivery",
                description: "Complete delivery in all required formats for distribution",
                features: ["WAV & MP3 formats", "Streaming optimized", "CD mastering", "Metadata inclusion"]
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Studio Equipment</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Recording Gear</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span>Neumann U87 Microphones</span>
                  <span className="text-red-600 font-semibold">4 units</span>
                </li>
                <li className="flex justify-between">
                  <span>Universal Audio Apollo Interfaces</span>
                  <span className="text-red-600 font-semibold">2 systems</span>
                </li>
                <li className="flex justify-between">
                  <span>Pro Tools | HD Systems</span>
                  <span className="text-red-600 font-semibold">3 stations</span>
                </li>
                <li className="flex justify-between">
                  <span>Yamaha NS10 Monitors</span>
                  <span className="text-red-600 font-semibold">2 pairs</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Software & Plugins</h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex justify-between">
                  <span>Waves Platinum Bundle</span>
                  <span className="text-red-600 font-semibold">Full suite</span>
                </li>
                <li className="flex justify-between">
                  <span>Native Instruments Komplete</span>
                  <span className="text-red-600 font-semibold">Latest version</span>
                </li>
                <li className="flex justify-between">
                  <span>Antares Auto-Tune</span>
                  <span className="text-red-600 font-semibold">Professional</span>
                </li>
                <li className="flex justify-between">
                  <span>iZotope Ozone</span>
                  <span className="text-red-600 font-semibold">Advanced</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-red-50 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Pricing Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic Session",
                price: "₦50,000",
                duration: "4 hours",
                features: ["2-track recording", "Basic mixing", "WAV file delivery", "Engineer included"]
              },
              {
                name: "Professional Package",
                price: "₦150,000",
                duration: "Full day",
                features: ["Unlimited tracks", "Advanced mixing", "Mastering included", "Vocal tuning", "Multiple formats"]
              },
              {
                name: "Album Production",
                price: "₦500,000",
                duration: "Custom",
                features: ["Complete album", "Professional mastering", "Artwork consultation", "Distribution prep", "Unlimited revisions"]
              }
            ].map((packageItem, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-red-600 text-white p-6 text-center">
                  <h4 className="text-2xl font-bold">{packageItem.name}</h4>
                  <div className="text-3xl font-bold mt-2">{packageItem.price}</div>
                  <div className="text-red-100">{packageItem.duration}</div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {packageItem.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => navigateTo('booking')}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold mt-6"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  </PageContent>
);

const ConcertProductionsPage: FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => (
  <PageContent title="Concert Productions" subtitle="Complete concert and live event production services">
    <Section id="concert-production-detail" className="bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="/images/services/concert-production-hero.jpg" 
              alt="Large Concert Production"
              className="w-full rounded-2xl shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/services/concert.jpeg';
              }}
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Complete Concert Production</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              From intimate club shows to massive festival stages, we deliver unforgettable concert experiences. 
              Our comprehensive production services cover every aspect of live event production, ensuring 
              flawless execution and maximum audience impact.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Stage Design</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Lighting Systems</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Audio Engineering</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Video Production</span>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigateTo('booking')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                Plan Your Concert
              </button>
              <button 
                onClick={() => navigateTo('contact')}
                className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-colors font-semibold text-lg"
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid - FIXED ICONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: MonitorSpeaker,
              title: "Audio Systems",
              description: "Professional PA systems and mixing for crystal-clear sound",
              details: ["Line array systems", "Digital mixing consoles", "Monitor systems", "Wireless microphones"]
            },
            {
              icon: Lightbulb,
              title: "Lighting Design",
              description: "Creative lighting solutions to enhance your performance",
              details: ["Moving heads", "LED fixtures", "Atmospheric effects", "Control systems"]
            },
            {
              icon: Video,
              title: "Video Production",
              description: "Large-scale video displays and IMAG systems",
              details: ["LED video walls", "Projection mapping", "Camera systems", "Content creation"]
            },
            {
              icon: Layers,
              title: "Stage & Rigging",
              description: "Professional staging and rigging solutions",
              details: ["Modular staging", "Truss systems", "Rigging engineering", "Safety systems"]
            },
            {
              icon: Zap,
              title: "Power Distribution",
              description: "Reliable power solutions for all equipment",
              details: ["Generator systems", "Power distribution", "Cable management", "Backup systems"]
            },
            {
              icon: Users,
              title: "Crew & Management",
              description: "Professional crew and event management",
              details: ["Audio engineers", "Lighting operators", "Stage managers", "Production coordinators"]
            }
          ].map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
              <div className="flex items-center justify-center h-12 w-12 bg-red-100 text-red-600 rounded-lg mb-4">
                <service.icon className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.details.map((detail, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-center">
                    <CheckCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Event Scale Options */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Event Scale Solutions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                scale: "Small Events",
                capacity: "50-500 people",
                description: "Perfect for club shows, private events, and corporate functions",
                equipment: ["Compact PA systems", "Basic lighting", "Small stage setup"],
                price: "From ₦200,000"
              },
              {
                scale: "Medium Events",
                capacity: "500-5,000 people",
                description: "Ideal for theater shows, conferences, and medium-sized festivals",
                equipment: ["Line array systems", "Advanced lighting", "Video projection", "Full staging"],
                price: "From ₦800,000"
              },
              {
                scale: "Large Events",
                capacity: "5,000+ people",
                description: "Designed for major concerts, festivals, and large-scale productions",
                equipment: ["Multiple PA systems", "Extensive lighting", "LED video walls", "Complex rigging"],
                price: "From ₦2,000,000"
              }
            ].map((event, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-red-600 text-white p-6 text-center">
                  <h4 className="text-2xl font-bold">{event.scale}</h4>
                  <div className="text-red-100 mt-2">{event.capacity}</div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <h5 className="font-semibold text-gray-900 mb-3">Includes:</h5>
                  <ul className="space-y-2 mb-6">
                    {event.equipment.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-center">
                        <CheckCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="text-2xl font-bold text-red-600 text-center">{event.price}</div>
                  <button 
                    onClick={() => navigateTo('booking')}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold mt-4"
                  >
                    Get Quote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process Timeline */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Production Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Consultation",
                description: "We discuss your vision, requirements, and budget"
              },
              {
                step: "02",
                title: "Planning",
                description: "Detailed technical planning and equipment selection"
              },
              {
                step: "03",
                title: "Setup",
                description: "Professional installation and testing of all systems"
              },
              {
                step: "04",
                title: "Execution",
                description: "Flawless operation during your event with expert crew"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  </PageContent>
);

// Enhanced Sound Reinforcement Page
const SoundReinforcementPage: FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => (
  <PageContent title="Sound Reinforcement" subtitle="Professional audio systems for events of any size">
    <Section id="sound-reinforcement-detail" className="bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="/images/services/sound-reinforcement-hero.jpg" 
              alt="Professional Sound System Setup"
              className="w-full rounded-2xl shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/services/Sound.jpg';
              }}
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Professional Sound Reinforcement</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Ensure every word and note is heard with perfect clarity through our professional sound 
              reinforcement services. We design and implement audio solutions tailored to your specific 
              venue and event requirements.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Crystal-clear audio quality</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Advanced system tuning</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Wireless microphone systems</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Monitor systems</span>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigateTo('booking')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                Inquire About Sound Services
              </button>
            </div>
          </div>
        </div>

        {/* Equipment Brands */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Premium Equipment Brands</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { name: "Martin Audio", specialty: "Line Array Systems" },
              { name: "Shure", specialty: "Microphones" },
              { name: "Yamaha", specialty: "Mixing Consoles" },
              { name: "d&b audiotechnik", specialty: "PA Systems" }
            ].map((brand, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 mb-2">{brand.name}</h4>
                <p className="text-red-600 text-sm">{brand.specialty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  </PageContent>
);

const StudioRecordingPage: FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => (
  <PageContent title="Studio Recording" subtitle="Professional recording sessions in our state-of-the-art studio">
    <Section id="studio-recording-detail" className="bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="/images/services/studio-recording-hero.jpg" 
              alt="Professional Recording Studio"
              className="w-full rounded-2xl shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/services/liverord.jpeg';
              }}
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Studio Recording Services</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Capture your sound with the highest fidelity in our professionally designed recording studio. 
              Featuring acoustically treated rooms, high-end microphones, and both analog and digital 
              recording equipment.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Acoustically treated rooms</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">High-end microphones</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Professional engineers</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Analog & digital equipment</span>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigateTo('booking')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                Book Studio Time
              </button>
            </div>
          </div>
        </div>

        {/* Studio Features */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Studio Features & Amenities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                feature: "Control Room",
                description: "Professionally designed control room with premium monitoring",
                details: ["SSL console", "Genelec monitors", "Acoustic treatment"]
              },
              {
                feature: "Live Room",
                description: "Spacious live room for full band recordings",
                details: ["200 sqm space", "Natural reverb", "Isolation booths"]
              },
              {
                feature: "Vocal Booth",
                description: "Dedicated vocal recording booth",
                details: ["Soundproof design", "Neumann microphones", "Comfortable environment"]
              },
              {
                feature: "Equipment",
                description: "Top-tier recording equipment",
                details: ["Analog outboard gear", "Premium microphones", "Latest interfaces"]
              },
              {
                feature: "Software",
                description: "Professional DAW and plugins",
                details: ["Pro Tools HD", "Waves plugins", "Virtual instruments"]
              },
              {
                feature: "Amenities",
                description: "Comfortable artist facilities",
                details: ["Lounge area", "Kitchen facilities", "Secure parking"]
              }
            ].map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.feature}</h4>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.details.map((detail, idx) => (
                    <li key={idx} className="text-sm text-gray-700 flex items-center">
                      <CheckCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  </PageContent>
);

// Enhanced Equipment Rental Page
const EquipmentRentalPage: FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => (
  <PageContent title="Equipment Rental" subtitle="High-quality audio, lighting, and production equipment">
    <Section id="equipment-rental-detail" className="bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="/images/services/equipment-rental-hero.jpg" 
              alt="Professional Audio Equipment"
              className="w-full rounded-2xl shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/services/equipment.jpg';
              }}
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Equipment Rental Services</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Need professional production equipment? We offer a comprehensive range of rental options 
              including complete PA systems, microphones, mixing consoles, lighting equipment, and staging. 
              All equipment is regularly maintained and tested.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Regularly maintained equipment</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Technical support available</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Delivery and setup</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-600 mr-3" />
                <span className="text-gray-700">Flexible rental periods</span>
              </div>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigateTo('products')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                View Available Equipment
              </button>
              <button 
                onClick={() => navigateTo('contact')}
                className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-colors font-semibold text-lg"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>

        {/* Equipment Categories - FIXED ICONS */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Equipment Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                category: "Audio Systems",
                items: ["PA Systems", "Mixing Consoles", "Microphones", "Monitors"],
                icon: Speaker
              },
              {
                category: "Lighting",
                items: ["Moving Heads", "LED Fixtures", "Control Systems", "Effects"],
                icon: Lightbulb
              },
              {
                category: "Staging",
                items: ["Modular Stages", "Trussing", "Backdrops", "Rigging"],
                icon: Theater
              },
              {
                category: "Accessories",
                items: ["Cables", "Stands", "Cases", "Power Distribution"],
                icon: Cable
              }
            ].map((category, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg text-center">
                <div className="flex items-center justify-center h-12 w-12 bg-red-100 text-red-600 rounded-lg mx-auto mb-4">
                  <category.icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">{category.category}</h4>
                <ul className="space-y-2">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-gray-700">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  </PageContent>
);

// Enhanced Event Planning Page
const EventPlanningPage: FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => (
  <PageContent title="Event Planning" subtitle="Complete event planning and coordination services">
    <Section id="event-planning-detail" className="bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="/images/services/event-planning-hero.jpg" 
              alt="Professional Event Planning"
              className="w-full rounded-2xl shadow-2xl"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/services/event-planning.jpg';
              }}
            />
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Complete Event Planning</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              From concept to execution, our event planning service ensures every detail is perfect. 
              We coordinate all aspects of your event including venue selection, vendor management, 
              timeline coordination, and technical requirements.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Venue Selection</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Vendor Coordination</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Timeline Management</span>
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium">Budget Planning</span>
            </div>
            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => navigateTo('booking')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                Plan Your Event
              </button>
              <button 
                onClick={() => navigateTo('contact')}
                className="border-2 border-red-600 text-red-600 px-8 py-4 rounded-lg hover:bg-red-50 transition-colors font-semibold text-lg"
              >
                Get Consultation
              </button>
            </div>
          </div>
        </div>

        {/* Services Grid - FIXED ICONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Calendar,
              title: "Event Strategy",
              description: "Comprehensive planning and strategy development",
              details: ["Concept development", "Budget planning", "Timeline creation", "Goal setting"]
            },
            {
              icon: MapPin,
              title: "Venue Management",
              description: "Perfect venue selection and coordination",
              details: ["Venue sourcing", "Site inspections", "Contract negotiation", "Logistics planning"]
            },
            {
              icon: Users,
              title: "Vendor Coordination",
              description: "Professional vendor management and coordination",
              details: ["Vendor selection", "Contract management", "Quality control", "Payment processing"]
            },
            {
              icon: ClipboardList,
              title: "Program Management",
              description: "Detailed program and timeline management",
              details: ["Agenda planning", "Speaker coordination", "Entertainment booking", "Run sheet creation"]
            },
            {
              icon: Palette,
              title: "Creative Design",
              description: "Creative elements and theme development",
              details: ["Theme development", "Decor planning", "Brand integration", "Visual design"]
            },
            {
              icon: BarChart3,
              title: "Budget Management",
              description: "Comprehensive budget planning and control",
              details: ["Budget creation", "Cost tracking", "Expense management", "Financial reporting"]
            }
          ].map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-red-500">
              <div className="flex items-center justify-center h-12 w-12 bg-red-100 text-red-600 rounded-lg mb-4">
                <service.icon className="h-6 w-6" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h4>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.details.map((detail, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-center">
                    <CheckCircle className="h-4 w-4 text-red-600 mr-2 flex-shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Event Types */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Event Types We Specialize In</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: "Corporate Events",
                examples: ["Conferences", "Product launches", "Team building", "Award ceremonies"]
              },
              {
                type: "Social Events",
                examples: ["Weddings", "Birthdays", "Anniversaries", "Family gatherings"]
              },
              {
                type: "Music Events",
                examples: ["Concerts", "Festivals", "Album launches", "Music videos"]
              },
              {
                type: "Special Events",
                examples: ["Charity galas", "Fundraisers", "Community events", "Cultural festivals"]
              }
            ].map((eventType, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="text-lg font-bold text-gray-900 mb-4 text-center">{eventType.type}</h4>
                <ul className="space-y-2">
                  {eventType.examples.map((example, idx) => (
                    <li key={idx} className="text-sm text-gray-700 text-center">{example}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Planning Process */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Event Planning Process</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Discovery",
                description: "We understand your vision, goals, and requirements"
              },
              {
                step: "02",
                title: "Planning",
                description: "Detailed strategy development and vendor coordination"
              },
              {
                step: "03",
                title: "Execution",
                description: "Flawless on-site management and coordination"
              },
              {
                step: "04",
                title: "Evaluation",
                description: "Post-event analysis and follow-up for future improvements"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Packages */}
        <div className="bg-red-50 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Planning Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Basic Planning",
                price: "₦150,000",
                description: "Perfect for small to medium events",
                features: ["Initial consultation", "Vendor recommendations", "Basic timeline", "Email support"]
              },
              {
                name: "Full Service",
                price: "₦500,000",
                description: "Comprehensive planning for important events",
                features: ["Full planning services", "Vendor management", "Day-of coordination", "Budget management", "Unlimited revisions"]
              },
              {
                name: "Premium Package",
                price: "₦1,000,000",
                description: "White-glove service for premium events",
                features: ["Dedicated planner", "Full creative design", "Vendor negotiations", "On-site management", "Post-event analysis"]
              }
            ].map((packageItem, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-red-600 text-white p-6 text-center">
                  <h4 className="text-2xl font-bold">{packageItem.name}</h4>
                  <div className="text-3xl font-bold mt-2">{packageItem.price}</div>
                  <div className="text-red-100">{packageItem.description}</div>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {packageItem.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => navigateTo('booking')}
                    className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold mt-6"
                  >
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  </PageContent>
);

// Fixed ServiceDetailPage component
const ServiceDetailPage: FC<{ 
  serviceName: string | null; 
  navigateTo: (page: Page, service?: string | null) => void 
}> = ({ serviceName, navigateTo }) => {
  
  // Route to the appropriate service detail page based on serviceName
  switch (serviceName) {
    case 'Music Production':
      return <MusicProductionPage navigateTo={navigateTo} />;
    case 'Concert Productions':
      return <ConcertProductionsPage navigateTo={navigateTo} />;
    case 'Sound Reinforcement':
      return <SoundReinforcementPage navigateTo={navigateTo} />;
    case 'Studio Recording':
      return <StudioRecordingPage navigateTo={navigateTo} />;
    case 'Event Planning':
      return <EventPlanningPage navigateTo={navigateTo} />;
    case 'Equipment Rental':
      return <EquipmentRentalPage navigateTo={navigateTo} />;
    default:
      // Fallback to services list if service not found
      return (
        <PageContent title="Service Not Found" subtitle="The requested service could not be found">
          <Section id="service-not-found" className="bg-white text-center py-12">
            <div className="max-w-2xl mx-auto">
              <Info className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Not Available</h2>
              <p className="text-gray-600 mb-6">
                The service "{serviceName}" is not currently available. Please browse our available services below.
              </p>
              <button 
                onClick={() => navigateTo('services')}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                View All Services
              </button>
            </div>
          </Section>
        </PageContent>
      );
  }
};

// Products Page
const ProductsPage: FC<{ products: Product[], navigateTo: (page: Page, product?: string | null) => void }> = ({ products, navigateTo }) => {
  return (
    <PageContent title="Our Products" subtitle="High-quality audio equipment and professional gear">
      <Section id="products">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              onClick={() => navigateTo('productDetail', product.name)}
            >
              <div className="h-64 bg-gray-200">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-product.jpg';
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{product.brand}</p>
                <p className="text-gray-700 mb-4">{product.description}</p>
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PageContent>
  );
};

// Product Detail Page
const ProductDetailPage: FC<{ products: Product[], productName: string, navigateTo: (page: Page, product?: string | null) => void }> = ({ products, productName, navigateTo }) => {
  const product = products.find(p => p.name === productName);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
          <button 
            onClick={() => navigateTo('products')}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const handleInquireClick = () => {
    navigateTo('booking');
  };

  return (
    <div className="animate-page-content-enter">
      <Section id="product-detail" className="bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="flex justify-center">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full max-w-md h-96 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-product.jpg';
                }}
              />
            </div>

            <div>
              <div className="mb-6">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">{product.category}</span>
                <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
                <p className="text-xl text-gray-600 mt-1">{product.brand}</p>
              </div>

              <p className="text-lg text-gray-700 mb-6">{product.longDescription}</p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h3>
                <div className="space-y-3">
                  {product.specs.map((spec, index) => (
                    <div key={index} className="flex justify-between border-b border-gray-200 pb-2">
                      <span className="font-medium text-gray-700">{spec.key}</span>
                      <span className="text-gray-600">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleInquireClick}
                className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
              >
                Inquire About This Product
              </button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

// ArtistCard Component
const ArtistCard: FC<{ artist: ArtistShowcase; index: number }> = ({ artist, index }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={artist.albumArt} 
          alt={`${artist.artistName} - ${artist.trackTitle}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder-artist.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            artist.genre === 'Gospel' ? 'bg-purple-100 text-purple-800' :
            artist.genre === 'Afrobeat' ? 'bg-green-100 text-green-800' :
            artist.genre === 'Pop' ? 'bg-blue-100 text-blue-800' :
            artist.genre === 'Rock' ? 'bg-orange-100 text-orange-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {artist.genre}
          </span>
        </div>
        
        {/* Play/Pause overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="bg-red-600 text-white rounded-full p-3 hover:bg-red-700 transition-colors transform scale-90 group-hover:scale-100"
            aria-label={isPlaying ? 'Pause' : 'Play preview'}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{artist.artistName}</h3>
        <p className="text-red-600 font-semibold text-sm mb-2 line-clamp-1">{artist.trackTitle}</p>
        <p className="text-gray-600 text-xs line-clamp-2 mb-3">{artist.description}</p>
        
        {/* Audio Player */}
        <div className="space-y-2">
          <audio
            ref={audioRef}
            src={artist.trackUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            preload="metadata"
          />
          
          {/* Progress Bar */}
          <div 
            className="w-full bg-gray-200 rounded-full h-1.5 cursor-pointer"
            onClick={handleProgressClick}
          >
            <div 
              className="bg-red-600 h-1.5 rounded-full transition-all duration-100"
              style={{ width: duration > 0 ? `${(currentTime / duration) * 100}%` : '0%' }}
            />
          </div>
          
          {/* Time and Controls */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatTime(currentTime)}
            </span>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={togglePlay}
                className="text-red-600 hover:text-red-700 transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    audioRef.current.pause();
                    setIsPlaying(false);
                  }
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Stop"
              >
                <Square size={14} />
              </button>
            </div>
            
            <span className="text-xs text-gray-500">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// AboutPage Component
const AboutPage: FC<{ navigateTo: (page: Page) => void }> = ({ navigateTo }) => {
  const values = [
      { icon: Heart, title: "Passion", description: "Our work is driven by a deep love for creating incredible audio-visual experiences." },
      { icon: Star, title: "Excellence", description: "We uphold the highest standards, using top-tier equipment and expert techniques." },
      { icon: Users, title: "Partnership", description: "We collaborate closely with our clients, treating their vision as our own." },
  ];

  const stats = [
      { value: "10+", label: "Years of Experience" },
      { value: "500+", label: "Successful Events" },
      { value: "100%", label: "Client Satisfaction" },
  ];

  return (
      <PageContent title="About Us" subtitle="The Passion and Expertise Behind Every Event">
          {/* Our Story Section */}
          <Section id="our-story" className="bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div className="prose prose-lg max-w-none text-gray-600">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey in Sound</h2>
                      <p className="mb-4">
                          Founded over a decade ago with a single microphone and an immense passion for audio, Boyal Integrated Service has grown into a premier provider of production and event services. Our philosophy is simple: combine cutting-edge technology with creative artistry to produce experiences that resonate.
                      </p>
                      <p className="mb-4">
                          We believe that every event, from a corporate conference to a sold-out concert, is a unique story waiting to be told. Our role is to provide the perfect sonic and visual backdrop for that story. We are a team of engineers, planners, and artists dedicated to the pursuit of perfection.
                      </p>
                      <p>
                          What sets us apart is our commitment to understanding your vision and translating it into an unforgettable experience. We don't just provide equipment; we provide solutions that elevate your event to new heights.
                      </p>
                  </div>
                  <div className="relative">
                      <img 
                          src="/images/services/concert.jpeg" 
                          alt="The Boyal Integrated Service team collaborating in their studio." 
                          className="rounded-xl shadow-2xl w-full h-auto object-cover"
                          onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-service.jpg';
                          }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                  </div>
              </div>
          </Section>

          {/* Stats Section */}
          <section className="bg-gray-900 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                      {stats.map((stat, index) => (
                          <div key={stat.label} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                              <p className="text-5xl font-extrabold text-red-500 mb-2">{stat.value}</p>
                              <p className="text-lg font-medium text-gray-300">{stat.label}</p>
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
                  {values.map((value, index) => (
                      <div 
                          key={value.title} 
                          className="text-center p-8 bg-white rounded-xl shadow-lg border-t-4 border-red-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                          <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mx-auto mb-6">
                              <value.icon className="h-8 w-8" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                          <p className="text-gray-600">{value.description}</p>
                      </div>
                  ))}
              </div>
          </Section>

          {/* Artist Collaborations Section */}
          <Section id="artist-collaborations" className="bg-white">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Artist Collaborations</h2>
                  <p className="text-red-600 mt-4 text-lg">Listen to Our Work with Talented Artists</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {artistShowcases.map((artist, index) => (
                      <ArtistCard key={`${artist.artistName}-${index}`} artist={artist} index={index} />
                  ))}
              </div>
          </Section>

          {/* Technology Section */}
          <Section id="technology" className="bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                  <div>
                      <img 
                          src="/images/services/equipment.jpg" 
                          alt="State-of-the-art audio equipment used by Boyal Integrated Service"
                          className="rounded-xl shadow-2xl w-full h-auto object-cover"
                          onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/images/placeholder-service.jpg';
                          }}
                      />
                  </div>
                  <div className="prose prose-lg max-w-none text-gray-600">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">State-of-the-Art Technology</h2>
                      <p className="mb-4">
                          We invest in the latest audio and visual technology to ensure your event sounds and looks exceptional. From digital mixing consoles to advanced wireless systems, our equipment is regularly updated and meticulously maintained.
                      </p>
                      <p className="mb-4">
                          Our inventory includes top brands like Shure, Yamaha, Martin Audio, and Digico, ensuring professional-grade quality for every project. We believe that great results come from the perfect combination of skilled operators and superior equipment.
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-600">
                          <li>Digital mixing consoles with full recall capabilities</li>
                          <li>Advanced wireless microphone systems</li>
                          <li>Line array speaker systems for optimal coverage</li>
                          <li>Redundant backup systems for critical events</li>
                      </ul>
                  </div>
              </div>
          </Section>

          {/* Process Section */}
          <Section id="process" className="bg-white">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">Our Process</h2>
                  <p className="text-red-600 mt-4 text-lg">How We Deliver Exceptional Results</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[
                      { step: "01", title: "Consultation", description: "We listen to your vision and requirements" },
                      { step: "02", title: "Planning", description: "Detailed technical planning and equipment selection" },
                      { step: "03", title: "Execution", description: "Professional setup and operation during your event" },
                      { step: "04", title: "Support", description: "Post-event follow-up and ongoing relationship" }
                  ].map((item) => (
                      <div key={item.step} className="text-center">
                          <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                              {item.step}
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                  ))}
              </div>
          </Section>

          <CtaSection navigateTo={navigateTo} />
      </PageContent>
  );
};

// Gallery Page
const GalleryPage: FC = () => {
  return (
    <PageContent title="Our Gallery" subtitle="A visual journey through our events and productions">
      <Section id="gallery">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <img 
                src={image.src} 
                alt={image.caption}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-gallery.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-end">
                <div className="p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-sm">{image.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </PageContent>
  );
};

// Booking Page
const BookingPage: FC<{ appState: AppState; services: Service[] }> = ({ appState, services }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    eventType: '',
    subject: '',
    service: '',
    eventDate: '',
    details: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      console.log('📤 Submitting booking form data:', formData);
      
      const bookingData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        eventType: formData.eventType,
        subject: formData.subject.trim(),
        service: formData.service,
        eventDate: formData.eventDate,
        details: formData.details.trim()
      };

      console.log('📦 Final booking data being sent:', bookingData);

      const response = await fetch(`${API_BASE_URL}/booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);

      let result;
      try {
        result = await response.json();
        console.log('📨 Response data:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: result.message || '🎉 Booking request submitted successfully! We will contact you within 24 hours.'
        });
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          eventType: '',
          subject: '',
          service: '',
          eventDate: '',
          details: ''
        });
      } else {
        if (response.status === 500) {
          throw new Error('Server error. Please try again later or contact us directly.');
        } else {
          throw new Error(result.error || result.message || `Failed to submit booking (Status: ${response.status})`);
        }
      }
    } catch (error) {
      console.error('❌ Booking submission error:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '❌ Failed to submit booking. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.fullName.trim() && 
                     formData.email.trim() && 
                     formData.eventType && 
                     formData.service && 
                     formData.subject.trim() && 
                     formData.details.trim();

  return (
    <PageContent title="Book Our Services" subtitle="Let's discuss your event and how we can make it unforgettable">
      <Section id="booking">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {submitMessage && (
              <div className={`mb-6 p-4 rounded-lg border ${
                submitMessage.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  {submitMessage.type === 'success' ? (
                    <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  ) : (
                    <X className="h-5 w-5 mr-2 flex-shrink-0" />
                  )}
                  <span>{submitMessage.text}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type *
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Event Type</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate">Corporate Event</option>
                  <option value="Concert">Concert</option>
                  <option value="Conference">Conference</option>
                  <option value="Private Party">Private Party</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                  Service Interested In *
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a Service</option>
                  {services.map(service => (
                    <option key={service.id} value={service.title}>{service.title}</option>
                  ))}
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="General Consultation">General Consultation</option>
                </select>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Brief description of your needs"
                />
              </div>

              <div>
                <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                  Event Details *
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  required
                  rows={6}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Please provide details about your event, including location, expected number of guests, specific requirements, budget, timeline, etc."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Submit Booking Request'
                )}
              </button>
              
              <p className="text-sm text-gray-500 text-center mt-4">
                We'll get back to you within 24 hours to discuss your event requirements.
              </p>
            </form>
          </div>
        </div>
      </Section>
    </PageContent>
  );
};

// Contact Page
const contactDetails = [
  {
    icon: Phone,
    text: '+2348025028905',
    href: 'tel:+2348025028905'
  },
  {
    icon: Mail,
    text: 'info@boyalservice.com',
    href: 'mailto:info@boyalservice.com'
  },
  {
    icon: MapPin,
    text: '52, Greenville estate road, Badore  Ajah, Lekki Lagos',
    href: 'https://maps.app.goo.gl/bCHdnuB3v37o1BYU9'
  }
];

const ContactPage: FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      console.log('📤 Submitting contact form data:', formData);
      
      const contactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim()
      };

      console.log('📦 Final contact data being sent:', contactData);

      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      console.log('📨 Response status:', response.status);
      console.log('📨 Response ok:', response.ok);

      let result;
      try {
        result = await response.json();
        console.log('📨 Response data:', result);
      } catch (parseError) {
        console.error('❌ Failed to parse response:', parseError);
        throw new Error('Invalid response from server');
      }

      if (response.ok) {
        setSubmitMessage({
          type: 'success',
          text: result.message || '🎉 Message sent successfully! We will get back to you within 2-4 hours.'
        });
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        if (response.status === 500) {
          throw new Error('Server error. Please try again later or call us directly.');
        } else {
          throw new Error(result.error || result.message || `Failed to send message (Status: ${response.status})`);
        }
      }
    } catch (error) {
      console.error('❌ Contact submission error:', error);
      setSubmitMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '❌ Failed to send message. Please try again or call us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name.trim() && formData.email.trim() && formData.message.trim();

  return (
    <PageContent title="Contact Us" subtitle="Get in touch with our team for any inquiries or support">
      <Section id="contact">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              {submitMessage && (
                <div className={`mb-6 p-4 rounded-lg border ${
                  submitMessage.type === 'success' 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="flex items-center">
                    {submitMessage.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 mr-2 flex-shrink-0" />
                    )}
                    <span>{submitMessage.text}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </button>
                
                <p className="text-sm text-gray-500 text-center mt-4">
                  We typically respond to all messages within 2-4 hours during business hours.
                </p>
              </form>
            </div>
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

// Live Chat Component
interface LiveChatWidgetProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isTyping: boolean;
}

const LiveChatWidget: FC<LiveChatWidgetProps> = ({ messages, onSendMessage, isTyping }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {isOpen && (
        <div className="chat-widget-enter w-[calc(100vw-40px)] sm:w-96 h-[60vh] sm:h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-200">
          <header className="p-4 bg-gray-900 text-white rounded-t-2xl flex justify-between items-center flex-shrink-0">
            <div>
              <h3 className="font-bold text-lg">Boyal Support</h3>
              <p className="text-sm text-gray-300">AI Assistant</p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="p-1 rounded-full hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
              <X size={20} />
            </button>
          </header>
          
          <div role="log" aria-live="polite" className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'ai' && <img src="/images/logo.png" alt="AI Assistant" className="w-8 h-8 rounded-full bg-gray-900 object-contain p-1 flex-shrink-0" />}
                  {msg.sender === 'ai' && msg.text === '' && !msg.error ? (
                     <div className="bg-gray-200 rounded-2xl rounded-bl-none p-3">
                        <div className="flex items-center space-x-1">
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                        </div>
                     </div>
                  ) : (
                    <div className={`max-w-xs md:max-w-sm rounded-2xl p-3 shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-red-600 text-white rounded-br-none' 
                        : `bg-white text-gray-800 rounded-bl-none ${msg.error ? 'bg-red-100 text-red-800' : ''}`
                    }`}>
                      <p className="text-sm break-words">{msg.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                aria-label="Chat input"
                className="flex-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                disabled={isTyping}
              />
              <button type="submit" aria-label="Send message" className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-400" disabled={isTyping || !input.trim()}>
                <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      )}

      <button onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close chat' : 'Open chat'} className={`w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-400 transition-transform hover:scale-110 ${!isOpen ? 'chat-pulse' : ''}`}>
        {isOpen ? <X size={30} /> : <MessageSquare size={30} />}
      </button>
    </div>
  );
};

// ~~~ MAIN APP COMPONENT ~~~
const App: FC = () => {
  const [appState, setAppState] = useState<AppState>({ currentPage: 'home', currentService: null, currentProduct: null });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
      { id: 1, text: "Hello! How can I help you with our services or products today?", sender: 'ai' }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [services, setServices] = useState<Service[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for fallback
  const mockServices: Service[] = [
    { 
      id: 1,
      iconName: 'Music', 
      icon: Music,
      title: 'Music Production', 
      description: 'Professional studio recording, mixing, and mastering services for artists and bands.',
      longDescription: 'Our state-of-the-art music production services provide everything you need to bring your musical vision to life. From initial recording sessions to final mastering, we work with artists, bands, and producers to create professional-quality audio. Our experienced engineers and producers use the latest digital audio workstations and analog equipment to ensure your music sounds its best across all platforms.',
      features: ["Multi-track Recording", "Mixing & Mastering", "Vocal Production", "Beat Making", "Audio Restoration", "Session Musicians"],
      image: "/images/services/Music.jpg",
      highlightImage: "/images/services/Music.jpg",
      category: 'Production',
    },
    { 
      id: 2,
      iconName: 'MonitorSpeaker', 
      icon: MonitorSpeaker,
      title: 'Concert Productions', 
      description: 'Complete concert and live event production including staging, lighting, and audio.',
      longDescription: 'Transform any venue into a world-class concert experience with our comprehensive production services. We handle every aspect of live event production, from stage design and rigging to advanced lighting systems and crystal-clear audio reinforcement. Our team works with artists, promoters, and venues to create unforgettable live experiences that engage audiences and showcase performers at their best.',
      features: ["Stage Design & Rigging", "Lighting Systems", "Video Walls", "PA Systems", "Backline Equipment", "Crew Management"],
      image: "/images/services/concert.jpeg",
      highlightImage: "/images/services/concert.jpeg",
      category: 'Production',
    },
    { 
      id: 3,
      iconName: 'Mic', 
      icon: Mic,
      title: 'Sound Reinforcement', 
      description: 'Professional audio systems for events, conferences, and live performances of any size.',
      longDescription: 'Ensure every word and note is heard with perfect clarity through our professional sound reinforcement services. We design and implement audio solutions tailored to your specific venue and event requirements. From intimate corporate meetings to large-scale outdoor festivals, our expert audio engineers use top-tier equipment to deliver pristine sound quality that enhances the audience experience.',
      features: ["PA System Design", "Wireless Microphones", "Monitor Systems", "Audio Delay Towers", "System Tuning", "Live Mixing"],
      image: "/images/services/Sound.jpg",
      highlightImage: "/images/services/Sound.jpg",
      category: 'Live Sound',
    },
    { 
      id: 4,
      iconName: 'Headphones', 
      icon: Headphones,
      title: 'Studio Recording', 
      description: 'Professional recording sessions in our acoustically treated studio environment.',
      longDescription: 'Capture your sound with the highest fidelity in our professionally designed recording studio. Featuring acoustically treated rooms, high-end microphones, and both analog and digital recording equipment, we provide the perfect environment for vocals, instruments, and full band recordings. Work with experienced engineers who understand how to get the best performances and sounds.',
      features: ["Vocal Recording", "Instrument Tracking", "Sound Proofing", "Professional Engineers", "Analog & Digital", "Editing Services"],
      image: "/images/services/studio.jpg",
      highlightImage: "/images/services/studio-recording.jpg",
      category: 'Production',
    },
    { 
      id: 5,
      iconName: 'PartyPopper', 
      icon: PartyPopper,
      title: 'Event Planning', 
      description: 'Complete event planning and coordination services for corporate and private events.',
      longDescription: 'From concept to execution, our event planning service ensures every detail is perfect. We coordinate all aspects of your event including venue selection, vendor management, timeline coordination, and technical requirements. Whether it\'s a corporate conference, wedding, or private party, we handle the logistics so you can focus on enjoying your event.',
      features: ["Venue Selection", "Vendor Coordination", "Timeline Management", "Budget Planning", "Technical Coordination", "On-site Management"],
      image: "/images/services/event-planning.jpg",
      highlightImage: "/images/services/event-planning.jpg",
      category: 'Planning',
    },
    { 
      id: 6,
      iconName: 'Cable', 
      icon: Cable,
      title: 'Equipment Rental', 
      description: 'High-quality audio, lighting, and production equipment rental services.',
      longDescription: 'Need professional production equipment? We offer a comprehensive range of rental options including complete PA systems, microphones, mixing consoles, lighting equipment, and staging. All equipment is regularly maintained, tested, and comes with optional technical support. Perfect for events, tours, or when you need to supplement your existing gear.',
      features: ["PA Systems", "Microphones", "Mixing Consoles", "Lighting Equipment", "Staging", "Technical Support"],
      image: "/images/services/equipment.jpg",
      highlightImage: "/images/services/equipment.jpg",
      category: 'Live Sound',
    }
  ];

  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Drums Chair",
      category: 'Lighting',
      brand: "Drumsboy",
      image: "/images/products/1o.png",
      description: "Drum Throne Padded Braced Seat / Stool.",
      longDescription: "High Load Capacity: We add three double-layer thickened metal support bars to the base to provide additional support for the entire drum throne. The height of the drum stool is about 20.8inch, with the load capacity up to 370lbs. It is very suitable for both children and adults",
      specs: [
        { key: "Frame Material", value: "Metal" },
        { key: "Item Weight", value: "4 Pounds" },
        { key: "Shape", value: "Round" },
        { key: "Seat Material Type", value: "Metal" }
      ]
    }
  ];

  const mockTestimonials: Testimonial[] = [
    { 
      id: 1,
      quote: "Boyal Integrated Service transformed our annual gala. The sound was impeccable and the team was incredibly professional. A flawless experience!", 
      author: "Jane Doe", 
      event: "Corporate Gala", 
      avatar: "https://i.pravatar.cc/150?u=jane" 
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching data from API...');
        
        const [servicesRes, productsRes, testimonialsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/services`),
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/testimonials`),
        ]);

        // Handle services
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          console.log('Services data:', servicesData);
          
          if (servicesData && servicesData.length > 0) {
            const servicesWithIcons = servicesData.map((service: any) => {
              const mappedService: Service = {
                id: service.id,
                iconName: service.iconName || service.title?.replace(/\s+/g, '') || 'Music',
                title: service.title || 'Service',
                description: service.description || 'Professional service',
                longDescription: service.longDescription || service.description || 'Detailed description coming soon.',
                features: service.features || ['Professional Service', 'Quality Guaranteed'],
                image: service.image || '/images/services/default.jpg',
                highlightImage: service.highlightImage || service.image || '/images/services/default.jpg',
                category: (service.category as ServiceCategory) || 'Production'
              };
              mappedService.icon = serviceIcons[mappedService.iconName] || Music;
              return mappedService;
            });
            setServices(servicesWithIcons);
          } else {
            setServices(mockServices);
          }
        } else {
          setServices(mockServices);
        }

        // Handle products
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          console.log('Products data:', productsData);
          
          if (productsData && productsData.length > 0) {
            const productsMapped = productsData.map((product: any) => ({
              id: product.id,
              name: product.name,
              category: (product.category as ProductCategory) || 'Microphones',
              brand: product.brand || 'Generic',
              image: product.image || '/images/products/default.png',
              description: product.description || 'Professional equipment',
              longDescription: product.longDescription || product.description || 'Detailed product description coming soon.',
              specs: product.specs || [
                { key: "Type", value: "Professional" },
                { key: "Quality", value: "Premium" }
              ]
            }));
            setProducts(productsMapped);
          } else {
            setProducts(mockProducts);
          }
        } else {
          setProducts(mockProducts);
        }

        // Handle testimonials
        if (testimonialsRes.ok) {
          const testimonialsData = await testimonialsRes.json();
          console.log('Testimonials data:', testimonialsData);
          
          if (testimonialsData && testimonialsData.length > 0) {
            const testimonialsMapped = testimonialsData.map((testimonial: any, index: number) => ({
              id: testimonial.id || index + 1,
              quote: testimonial.quote || testimonial.content || 'Great service!',
              author: testimonial.author || testimonial.customerName || 'Happy Client',
              event: testimonial.event || testimonial.company || 'Event',
              avatar: testimonial.avatar || testimonial.imageUrl || `https://i.pravatar.cc/150?u=${testimonial.author || index}`
            }));
            setTestimonials(testimonialsMapped);
          } else {
            setTestimonials(mockTestimonials);
          }
        } else {
          setTestimonials(mockTestimonials);
        }

      } catch (err) {
        console.error('Data fetching error:', err);
        setError('Failed to load data from server. Using demo data.');
        setServices(mockServices);
        setProducts(mockProducts);
        setTestimonials(mockTestimonials);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_API_KEY || 'demo-key' });
      const chatInstance = ai.chats.create({
        model: 'gemini-2.0-flash-exp',
        config: {
          systemInstruction: 'You are a friendly and helpful customer support agent for Boyal Integrated Service. Your goal is to answer questions about their services (Music Production, Concert Productions, etc.) and products (microphones, speakers, etc.), help users with booking inquiries, and provide information about the company. Be concise and professional.',
        },
      });
      setChat(chatInstance);
    } catch (e) {
      console.error("Failed to initialize Gemini Chat", e);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: "Sorry, the chat service is currently unavailable.",
        sender: 'ai',
        error: true
      }]);
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!chat || isAiTyping) return;

    const userMessage: ChatMessage = { id: Date.now(), text, sender: 'user' };
    const aiMessageId = Date.now() + 1;
    const aiPlaceholder: ChatMessage = { id: aiMessageId, text: '', sender: 'ai' };

    setMessages(prev => [...prev, userMessage, aiPlaceholder]);
    setIsAiTyping(true);

    try {
      const stream = await chat.sendMessageStream({ message: text });
      
      let responseText = '';
      for await (const chunk of stream) {
        responseText += chunk.text;
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId ? { ...msg, text: responseText } : msg
        ));
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMessageId 
        ? { ...msg, text: "Sorry, I encountered an error. Please try again.", error: true } 
        : msg
      ));
    } finally {
      setIsAiTyping(false);
    }
  };

  const navigateTo = (page: Page, detailItem: string | null = null) => {
    const isMainPage = ['home', 'about', 'services', 'gallery', 'products', 'contact'].includes(page);

    setAppState(prevState => {
      let nextState = {...prevState, currentPage: page};
      
      if (page === 'serviceDetail') {
        nextState.currentService = detailItem;
      }
      if (page === 'productDetail') {
        nextState.currentProduct = detailItem;
      }
      
      if(isMainPage) {
        nextState.currentService = null;
        nextState.currentProduct = null;
      }
      return nextState;
    });

    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };
  
  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-700">Loading Boyal Integrated Service...</h2>
            <p className="text-gray-500 mt-2">Preparing your experience</p>
          </div>
        </div>
      );
    }

    if (error && services.length === 0) {
      return (
        <div className="h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <div className="bg-yellow-100 border border-yellow-400 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Info className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Demo Mode</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">You can still explore all features with sample data.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      );
    }

    switch (appState.currentPage) {
      case 'home': return <HomePage services={services} testimonials={testimonials} navigateTo={navigateTo} />;
      case 'about': return <AboutPage navigateTo={navigateTo} />;
      case 'services': return <ServicesPage services={services} navigateTo={navigateTo} />;
      case 'serviceDetail': return <ServiceDetailPage serviceName={appState.currentService} navigateTo={navigateTo} />;
      case 'gallery': return <GalleryPage />;
      case 'products': return <ProductsPage products={products} navigateTo={navigateTo} />;
      case 'productDetail': return <ProductDetailPage products={products} productName={appState.currentProduct!} navigateTo={navigateTo} />;
      case 'booking': return <BookingPage appState={appState} services={services} />;
      case 'contact': return <ContactPage />;
      default: return <HomePage services={services} testimonials={testimonials} navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <nav role="navigation" aria-label="Main navigation" className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <button onClick={() => navigateTo('home')} className="flex-shrink-0 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-lg p-2">
                <img src="/images/logo.png" alt="Boyal Integrated Service logo" className="h-16 w-auto" />
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

      <main>
        {renderPage()}
      </main>
      
      <LiveChatWidget messages={messages} onSendMessage={handleSendMessage} isTyping={isAiTyping} />

      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Services</h3>
              <ul className="mt-4 space-y-2">
                {services.slice(0, 4).map(s => (
                  <li key={s.title}>
                    <button onClick={() => navigateTo('serviceDetail', s.title)} className="text-base text-gray-300 hover:text-white transition-colors text-left">
                      {s.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
              <ul className="mt-4 space-y-2">
                 {['about', 'gallery', 'products', 'contact'].map(p => (
                   <li key={p}>
                     <button onClick={() => navigateTo(p as Page)} className="text-base text-gray-300 hover:text-white transition-colors text-left capitalize">
                       {p}
                     </button>
                   </li>
                 ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-2">
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Connect With Us</h3>
              <p className="mt-4 text-base text-gray-300">Follow us on social media for the latest updates and behind-the-scenes content.</p>
              <div className="flex space-x-6 mt-4">
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook size={24}/>
                </a>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter size={24}/>
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram size={24}/>
                </a>
                <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={24}/>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-base text-gray-400">
              &copy; {new Date().getFullYear()} Boyal Integrated Service. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;