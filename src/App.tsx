import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform, useMotionTemplate } from 'motion/react';
import createGlobe from 'cobe';
import { 
  Facebook, 
  Instagram, 
  BarChart3, 
  Target, 
  ArrowRight, 
  Mail, 
  Linkedin, 
  Twitter, 
  Menu, 
  X, 
  ChevronRight,
  Settings,
  Plus,
  Trash2,
  Save,
  LogOut,
  Check,
  Upload,
  Loader2,
  Globe as GlobeIcon,
  Layout,
  Database,
  Image as ImageIcon,
  User,
  Type,
  Palette,
  FileText,
  MessageSquare,
  History,
  GripVertical,
  Eye,
  EyeOff,
  Clock,
  ExternalLink,
  Phone,
  MapPin,
  CheckCircle2,
  Award,
  Users,
  TrendingUp,
  Play,
  Pause,
  Volume2,
  VolumeX,
  MousePointer2,
  Zap,
  Search,
  ChevronLeft
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AppData, PortfolioItem, Skill, Testimonial, SiteIdentity, HeroData, BlogPost, ContactLead, HistoryItem } from './types';

// Custom Cursor Component
const CustomCursor = () => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 40, stiffness: 450, mass: 0.2 };
  const dotSpringConfig = { damping: 50, stiffness: 1000, mass: 0.1 };
  
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);
  const dotX = useSpring(cursorX, dotSpringConfig);
  const dotY = useSpring(cursorY, dotSpringConfig);

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';
      
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{
          x: springX,
          y: springY,
        }}
        animate={{
          scale: isHovered ? 1.5 : 1,
        }}
        transition={{ 
          scale: { duration: 0.15, ease: "easeOut" } 
        }}
      />
      <motion.div
        className="custom-cursor-dot"
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          scale: isHovered ? 0 : 1,
        }}
        transition={{ 
          scale: { duration: 0.15, ease: "easeOut" } 
        }}
      />
    </>
  );
};

// Magnetic Effect Component
const Magnetic: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;

    // Magnetic pull strength
    const strength = 0.3;
    setPosition({ x: distanceX * strength, y: distanceY * strength });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', damping: 15, stiffness: 150, mass: 0.1 }}
    >
      {children}
    </motion.div>
  );
};

// 3D Tilt Card Component
const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degrees
    const rotateY = ((x - centerX) / centerX) * 10; // Max 10 degrees

    setRotate({ x: rotateX, y: rotateY });
    
    // Calculate glare position in percentage
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlare({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div className={`tilt-card-container ${className}`}>
      <div
        ref={cardRef}
        className="tilt-card h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          // @ts-ignore
          '--glare-x': `${glare.x}%`,
          '--glare-y': `${glare.y}%`
        }}
      >
        <div className="tilt-card-content h-full">
          {children}
        </div>
        <div className="glare-effect" />
      </div>
    </div>
  );
};

// Globe Component
const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (canvasRef.current) {
      observer.observe(canvasRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let phi = 0;
    let width = 0;
    
    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current || !isVisible) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 1, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.0902, -95.7129], size: 0.1 }, // USA
        { location: [55.3781, -3.4360], size: 0.1 },  // UK
        { location: [-25.2744, 133.7751], size: 0.1 }, // Australia
        { location: [23.6850, 90.3563], size: 0.1 },   // Bangladesh
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phi += 0.005;
        }
        state.phi = phi + r;
        state.width = width * 2;
        state.height = width * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [isVisible, r]);

  return (
    <div className="w-full aspect-square max-w-[600px] mx-auto relative">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            setR(delta / 200);
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta;
            setR(delta / 200);
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          contain: 'layout paint size',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s ease',
        }}
      />
    </div>
  );
};

// Global Reach Section
const GlobalReach = () => (
  <section className="py-32 bg-dark relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-white/40 mb-6 block">Global Impact</span>
          <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">Scaling Brands Across Borders.</h2>
          <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-xl">
            From the bustling markets of New York to the tech hubs of Sydney, I help businesses dominate their local and international markets through precision-targeted media buying.
          </p>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl font-serif mb-2">12+</div>
              <div className="text-xs uppercase tracking-widest text-white/40">Countries Reached</div>
            </div>
            <div className="glass p-6 rounded-2xl">
              <div className="text-3xl font-serif mb-2">24/7</div>
              <div className="text-xs uppercase tracking-widest text-white/40">Global Monitoring</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-full blur-3xl -z-10" />
          <Globe />
        </motion.div>
      </div>
    </div>
  </section>
);

// Funnel Section Component
const FunnelSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 'tofu',
      title: 'Top of Funnel (TOFU)',
      label: 'Awareness',
      description: 'Attract a broad audience and build brand awareness.',
      strategies: [
        'Facebook & Instagram Video Ads',
        'High-Impact Content Marketing',
        'Influencer Collaborations',
        'SEO & Educational Blog Posts'
      ],
      color: 'bg-white/20',
      width: 'w-full'
    },
    {
      id: 'mofu',
      title: 'Middle of Funnel (MOFU)',
      label: 'Consideration',
      description: 'Nurture leads and build trust with your audience.',
      strategies: [
        'Dynamic Retargeting Ads',
        'Email Marketing Sequences',
        'Case Studies & Whitepapers',
        'Webinars & Product Demos'
      ],
      color: 'bg-white/10',
      width: 'w-[80%]'
    },
    {
      id: 'bofu',
      title: 'Bottom of Funnel (BOFU)',
      label: 'Conversion',
      description: 'Convert prospects into high-paying customers.',
      strategies: [
        'Limited-Time Offers & Discounts',
        'Personalized Sales Outreach',
        'Customer Testimonials & Reviews',
        'Seamless Checkout Experience'
      ],
      color: 'bg-white/5',
      width: 'w-[60%]'
    }
  ];

  return (
    <section className="py-32 bg-dark overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-xs uppercase tracking-[0.4em] text-white/40 mb-4 block">Our Process</span>
          <h2 className="text-4xl md:text-5xl font-serif">My Proven Scaling Funnel</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 items-center lg:items-start">
          {/* Funnel Visual */}
          <div className="flex-1 w-full flex flex-col items-center space-y-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                onMouseEnter={() => setActiveStep(index)}
                onClick={() => setActiveStep(index)}
                className={`
                  ${step.width} h-32 glass flex items-center justify-center cursor-pointer relative group transition-all duration-500
                  ${activeStep === index ? 'bg-white/20 border-white/40' : 'hover:bg-white/10'}
                  rounded-xl overflow-hidden
                `}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="text-center z-10">
                  <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{step.label}</div>
                  <div className="text-xl font-serif font-bold">{step.id.toUpperCase()}</div>
                </div>
                {activeStep === index && (
                  <motion.div 
                    layoutId="funnel-highlight"
                    className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none"
                  />
                )}
              </motion.div>
            ))}
          </div>

          {/* Strategy Details */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="glass p-10 rounded-3xl h-full border-white/20"
              >
                <div className="mb-8">
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-2">{steps[activeStep].label}</div>
                  <h3 className="text-3xl font-serif mb-4">{steps[activeStep].title}</h3>
                  <p className="text-white/60 leading-relaxed">{steps[activeStep].description}</p>
                </div>

                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-widest text-white/40 mb-4">Core Strategies:</div>
                  {steps[activeStep].strategies.map((strategy, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 text-white/80"
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      <span className="text-sm md:text-base">{strategy}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

// Video Reel Component for Testimonials
const VideoReel = ({ testimonial }: { testimonial: Testimonial }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  return (
    <div className="relative aspect-[9/16] w-full max-w-[300px] mx-auto overflow-hidden rounded-3xl glass group cursor-pointer">
      <video
        ref={videoRef}
        src={testimonial.video}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
        loop
        onClick={toggleMute}
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      
      {/* Content Overlay */}
      <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
        <div className="flex items-center gap-3 mb-3">
          <img 
            src={testimonial.image} 
            alt={testimonial.name} 
            className="w-8 h-8 rounded-full border border-white/20"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-white">{testimonial.name}</div>
            <div className="text-[10px] text-white/60">{testimonial.role}</div>
          </div>
        </div>
        <div className="glass px-3 py-1.5 rounded-full inline-block text-[10px] font-bold uppercase tracking-widest bg-white/10 border-white/20">
          {testimonial.result || 'Great Results'}
        </div>
      </div>

      {/* Mute/Unmute Indicator */}
      <div className="absolute top-4 right-4 glass p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
        {isMuted ? <BarChart3 size={14} className="rotate-90" /> : <BarChart3 size={14} />}
      </div>
    </div>
  );
};

// Components
const Navbar = ({ data, onAdminClick }: { data: AppData; onAdminClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Portfolio', 'Skills', 'Contact'];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-xl py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-serif font-bold tracking-tighter">{data.identity.logoText}</div>
        
        <div 
          className="hidden md:flex items-center space-x-1 text-sm uppercase tracking-widest font-medium"
          onMouseLeave={() => setHoveredItem(null)}
        >
          {navItems.map((item) => (
            <Magnetic key={item}>
              <a 
                href={`#${item.toLowerCase()}`} 
                className="relative px-6 py-2.5 block transition-colors text-white/70 hover:text-white"
                onMouseEnter={() => setHoveredItem(item)}
              >
                {hoveredItem === item && (
                  <motion.div
                    layoutId="navbar-spotlight"
                    className="absolute inset-0 -z-10 rounded-xl overflow-hidden"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    {/* Top edge highlight */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-white/80" />
                    {/* Spotlight beam */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/10 via-white/5 to-transparent" />
                    {/* Soft glow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1/2 h-6 bg-white/30 blur-xl rounded-full" />
                  </motion.div>
                )}
                <span className="relative z-10">{item}</span>
              </a>
            </Magnetic>
          ))}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass absolute top-full w-full py-8 px-6 flex flex-col space-y-6 text-center uppercase tracking-widest text-sm"
          >
            {navItems.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMobileMenuOpen(false)}>
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ data }: { data: AppData }) => (
  <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/50 to-dark z-10" />
      <img 
        src={data.hero.image} 
        alt="Hero Background" 
        className="w-full h-full object-cover opacity-40 grayscale"
        referrerPolicy="no-referrer"
      />
    </div>

    <div className="max-w-7xl mx-auto px-6 relative z-20 w-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl"
      >
        <span className="text-sm uppercase tracking-[0.3em] text-white/60 mb-4 block">
          {data.hero.headline}
        </span>
        <h1 className="text-6xl md:text-8xl font-serif font-bold leading-tight mb-8 text-gradient inline-block">
          {data.hero.name}
        </h1>
        <p className="text-xl md:text-2xl text-white/70 font-light leading-relaxed mb-10 max-w-2xl">
          {data.hero.subHeadline}
        </p>
        <div className="flex flex-wrap gap-6">
          <Magnetic>
            <a href="#portfolio" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-white/90 transition-all flex items-center gap-2">
              View Portfolio <ArrowRight size={16} />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="px-8 py-4 border border-white/20 hover:bg-white/5 transition-all uppercase tracking-widest text-xs font-bold">
              Let's Talk
            </a>
          </Magnetic>
        </div>
      </motion.div>
    </div>

    <div className="absolute bottom-10 left-10 opacity-30 hidden md:block">
      <span className="text-[10px] uppercase tracking-[0.4em] text-white">Digital Marketing Expert</span>
    </div>

    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 animate-bounce opacity-30">
      <span className="text-[10px] uppercase tracking-[0.4em] text-white rotate-90 mb-8">Scroll</span>
      <div className="w-px h-12 bg-white" />
    </div>
  </section>
);

const About = ({ data }: { data: AppData }) => (
  <section id="about" className="py-32 bg-dark">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden rounded-2xl">
            <img 
              src={data.hero.image} 
              alt="About Me" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-10 -right-10 glass p-8 rounded-2xl hidden md:block">
            <div className="text-4xl font-serif font-bold">5+</div>
            <div className="text-xs uppercase tracking-widest text-white/60">Years Experience</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-xs uppercase tracking-[0.4em] text-white/40 mb-6 block">The Strategy</span>
          <h2 className="text-4xl md:text-5xl font-serif mb-8">Crafting Digital Excellence</h2>
          <p className="text-lg text-white/60 leading-relaxed mb-8">
            Expert in Meta Ads, Google Analytics, and conversion rate optimization. Helping brands scale through data-driven strategies and creative performance marketing.
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <div className="text-2xl font-serif mb-2">$2M+</div>
              <div className="text-xs uppercase tracking-widest text-white/40">Ad Spend Managed</div>
            </div>
            <div>
              <div className="text-2xl font-serif mb-2">150%</div>
              <div className="text-xs uppercase tracking-widest text-white/40">Avg. ROI Increase</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Skills = ({ data }: { data: AppData }) => (
  <section id="skills" className="py-32 bg-black/50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <span className="text-xs uppercase tracking-[0.4em] text-white/40 mb-4 block">Expertise</span>
        <h2 className="text-4xl md:text-5xl font-serif">Core Capabilities</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {data.skills.map((skill, index) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <TiltCard className="h-full">
              <div className="glass p-8 rounded-2xl group hover:bg-white/10 transition-all h-full">
                <div className="flex justify-between items-end mb-6">
                  <h3 className="text-xl font-serif">{skill.name}</h3>
                  <span className="text-sm font-mono text-white/40">{skill.level}%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-white" 
                  />
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

const Portfolio = ({ data }: { data: AppData }) => (
  <section id="portfolio" className="py-32 bg-dark">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-white/40 mb-4 block">Work</span>
          <h2 className="text-4xl md:text-5xl font-serif">Case Studies</h2>
        </div>
        <div className="text-white/40 text-sm max-w-md text-right">
          A selection of high-impact campaigns that delivered measurable growth and exceptional returns.
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {data.portfolio.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="h-full"
          >
            <TiltCard className="h-full">
              <div className="group cursor-pointer h-full">
                <div className="relative aspect-video overflow-hidden rounded-2xl mb-8">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="glass p-4 rounded-full">
                      <ChevronRight />
                    </div>
                  </div>
                  <div className="absolute top-6 left-6 glass px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold">
                    {item.category}
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-serif mb-2 group-hover:text-white/80 transition-colors">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-sm">{item.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-widest text-white/30 mb-1">Result</div>
                    <div className="text-lg font-serif">{item.results}</div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </div>

    </div>
  </section>
);

const Testimonials = ({ data }: { data: AppData }) => (
  <section id="testimonials" className="py-32 bg-black/50">
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-20">
        <span className="text-xs uppercase tracking-[0.4em] text-white/40 mb-4 block">Feedback</span>
        <h2 className="text-4xl md:text-5xl font-serif">Client Success Reels</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {data.testimonials.map((t, index) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="w-full"
          >
            {t.video ? (
              <VideoReel testimonial={t} />
            ) : (
              <div className="glass p-12 rounded-3xl relative h-full flex flex-col justify-between">
                <div className="text-4xl font-serif text-white/10 absolute top-8 right-12">"</div>
                <p className="text-xl text-white/80 italic mb-10 leading-relaxed">
                  {t.content}
                </p>
                <div className="flex items-center gap-4">
                  <img 
                    src={t.image} 
                    alt={t.name} 
                    className="w-12 h-12 rounded-full grayscale"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="font-bold text-sm uppercase tracking-widest">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const Contact = ({ data }: { data: AppData }) => (
  <section id="contact" className="py-32 bg-dark">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-20">
        <div>
          <span className="text-xs uppercase tracking-[0.4em] text-white/40 mb-6 block">Contact</span>
          <h2 className="text-5xl md:text-7xl font-serif mb-10 leading-tight">Let's Scale Your Brand.</h2>
          <p className="text-white/50 text-lg mb-12 max-w-md">
            Ready to take your digital marketing to the next level? Get in touch for a free strategy audit.
          </p>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors cursor-pointer">
              <div className="glass p-3 rounded-full"><Mail size={20} /></div>
              <span>hello@sjkmarketing.com</span>
            </div>
            <div className="flex items-center gap-4 text-white/60 hover:text-white transition-colors cursor-pointer">
              <div className="glass p-3 rounded-full"><Linkedin size={20} /></div>
              <span>linkedin.com/in/sjk</span>
            </div>
          </div>
        </div>

        <div className="glass p-10 rounded-3xl">
          <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Name</label>
                <input type="text" className="w-full bg-transparent border-b border-white/10 py-3 focus:border-white outline-none transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-white/40">Email</label>
                <input type="email" className="w-full bg-transparent border-b border-white/10 py-3 focus:border-white outline-none transition-colors" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-white/40">Message</label>
              <textarea rows={4} className="w-full bg-transparent border-b border-white/10 py-3 focus:border-white outline-none transition-colors resize-none" />
            </div>
            <Magnetic>
              <button className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-white/90 transition-all">
                Send Message
              </button>
            </Magnetic>
          </form>
        </div>
      </div>
    </div>
  </section>
);

const Footer = ({ data, onAdminClick }: { data: AppData; onAdminClick: () => void }) => (
  <footer className="py-20 border-t border-white/5">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-10">
      <div className="text-2xl font-serif font-bold tracking-tighter">{data.identity.logoText}</div>
      <div className="text-white/30 text-[10px] uppercase tracking-widest">
        © {new Date().getFullYear()} {data.identity.logoText} MARKETING. ALL RIGHTS RESERVED.
      </div>
      <div className="flex items-center gap-8">
        <Magnetic>
          <button 
            onClick={onAdminClick}
            className="text-white/20 hover:text-white transition-colors text-[10px] uppercase tracking-widest flex items-center gap-2 px-4 py-2"
          >
            <Settings size={12} /> Studio
          </button>
        </Magnetic>
      </div>
    </div>
  </footer>
);

// Admin Dashboard
const ImageUpload = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        onUpload(data.imageUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button 
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2"
      >
        {isUploading ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />}
        {isUploading ? 'Uploading...' : 'Upload from Device'}
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />
    </div>
  );
};

const SortableItem: React.FC<{ id: number, children: React.ReactNode }> = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div {...attributes} {...listeners} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-2 text-white/20 hover:text-white transition-all z-10">
        <GripVertical size={16} />
      </div>
      {children}
    </div>
  );
};

const AdminDashboard = ({ data, onUpdate, onLogout }: { data: AppData, onUpdate: () => void, onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState<'identity' | 'hero' | 'portfolio' | 'skills' | 'testimonials' | 'blog' | 'leads' | 'history' | 'media'>('identity');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Session Timeout Logic (30 minutes)
  useEffect(() => {
    const timeout = 30 * 60 * 1000; // 30 minutes
    const interval = setInterval(() => {
      if (Date.now() - lastActivity > timeout) {
        onLogout();
      }
    }, 60000); // Check every minute

    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, [lastActivity, onLogout]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const logHistory = async (action: string, details: string) => {
    await fetch('/api/admin/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, details })
    });
  };

  const handleUpdateIdentity = async (identity: SiteIdentity) => {
    setIsSaving(true);
    await fetch('/api/admin/update-identity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(identity)
    });
    await logHistory('Update Identity', 'Modified global site settings');
    setIsSaving(false);
    onUpdate();
  };

  const handleUpdateHero = async (hero: HeroData) => {
    setIsSaving(true);
    await fetch('/api/admin/update-hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hero)
    });
    await logHistory('Update Hero', 'Modified hero section content');
    setIsSaving(false);
    onUpdate();
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    await fetch(`/api/admin/${type}/${id}`, { method: 'DELETE' });
    await logHistory(`Delete ${type}`, `Removed item with ID ${id}`);
    onUpdate();
  };

  const handleSaveItem = async (type: string, item: any) => {
    setIsSaving(true);
    await fetch(`/api/admin/${type}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    await logHistory(`${item.id ? 'Update' : 'Create'} ${type}`, `Saved ${type} item: ${item.title || item.name}`);
    setEditingItem(null);
    setIsSaving(false);
    onUpdate();
  };

  const handleDragEnd = async (event: DragEndEvent, type: 'skills' | 'portfolio' | 'testimonials') => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const items = [...data[type]];
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      const newOrder = arrayMove(items, oldIndex, newIndex);
      
      await fetch('/api/admin/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, items: newOrder.map(i => i.id) })
      });
      onUpdate();
    }
  };

  const menuItems = [
    { id: 'identity', label: 'Site Identity', icon: <GlobeIcon size={18} /> },
    { id: 'hero', label: 'Hero Section', icon: <Layout size={18} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <Database size={18} /> },
    { id: 'skills', label: 'Tools & Skills', icon: <Zap size={18} /> },
    { id: 'blog', label: 'Resources & Blog', icon: <FileText size={18} /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare size={18} /> },
    { id: 'leads', label: 'Leads & Inquiries', icon: <Users size={18} /> },
    { id: 'media', label: 'Media Library', icon: <ImageIcon size={18} /> },
    { id: 'history', label: 'Activity Log', icon: <History size={18} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-dark flex overflow-hidden text-white">
      {/* Sidebar */}
      <div className="w-72 border-r border-white/10 p-8 flex flex-col bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-600/20">S</div>
          <div>
            <div className="font-serif font-bold tracking-tight">STUDIO ADMIN</div>
            <div className="text-[10px] text-white/40 uppercase tracking-widest">Digital Marketing v2.0</div>
          </div>
        </div>
        
        <div className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all group ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className={`${activeTab === item.id ? 'text-white' : 'text-white/30 group-hover:text-white/60'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="activeTab" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 space-y-4">
          <button 
            onClick={onLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-400/10 transition-all font-medium"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12 bg-dark/50">
        <div className="max-w-5xl mx-auto">
          <header className="flex justify-between items-end mb-12">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-2 capitalize">{activeTab.replace(/-/g, ' ')}</h1>
              <p className="text-white/40 text-sm">Manage your website's {activeTab} information and settings.</p>
            </div>
            {isSaving && (
              <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest animate-pulse">
                <Loader2 size={14} className="animate-spin" /> Saving Changes...
              </div>
            )}
          </header>
          {activeTab === 'identity' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="glass p-8 rounded-3xl space-y-6">
                  <h3 className="text-lg font-serif flex items-center gap-2">
                    <Type size={18} className="text-blue-400" /> Branding
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Logo Text</label>
                      <input 
                        type="text"
                        defaultValue={data.identity.logoText}
                        onBlur={(e) => handleUpdateIdentity({ ...data.identity, logoText: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Favicon URL</label>
                      <input 
                        type="text"
                        defaultValue={data.identity.favicon}
                        onBlur={(e) => handleUpdateIdentity({ ...data.identity, favicon: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl space-y-6">
                  <h3 className="text-lg font-serif flex items-center gap-2">
                    <Palette size={18} className="text-blue-400" /> Color Scheme
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Primary Color</label>
                      <div className="flex gap-4">
                        <input 
                          type="color"
                          defaultValue={data.identity.primaryColor}
                          onChange={(e) => handleUpdateIdentity({ ...data.identity, primaryColor: e.target.value })}
                          className="w-12 h-12 bg-transparent border-none cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={data.identity.primaryColor}
                          readOnly
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/60"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Secondary Color</label>
                      <div className="flex gap-4">
                        <input 
                          type="color"
                          defaultValue={data.identity.secondaryColor}
                          onChange={(e) => handleUpdateIdentity({ ...data.identity, secondaryColor: e.target.value })}
                          className="w-12 h-12 bg-transparent border-none cursor-pointer"
                        />
                        <input 
                          type="text"
                          value={data.identity.secondaryColor}
                          readOnly
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white/60"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="glass p-8 rounded-3xl space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-serif flex items-center gap-2">
                    <User size={18} className="text-blue-400" /> Hero Content
                  </h3>
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                    <span className="text-[10px] uppercase tracking-widest text-white/40">Status</span>
                    <button 
                      onClick={() => handleUpdateHero({ ...data.hero, isAvailable: !data.hero.isAvailable })}
                      className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${data.hero.isAvailable ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {data.hero.isAvailable ? <Eye size={14} /> : <EyeOff size={14} />}
                      {data.hero.isAvailable ? 'Available' : 'Busy'}
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Name</label>
                      <input 
                        type="text"
                        defaultValue={data.hero.name}
                        onBlur={(e) => handleUpdateHero({ ...data.hero, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Headline</label>
                      <textarea 
                        defaultValue={data.hero.headline}
                        onBlur={(e) => handleUpdateHero({ ...data.hero, headline: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 outline-none transition-all"
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Sub-headline</label>
                      <textarea 
                        defaultValue={data.hero.subHeadline}
                        onBlur={(e) => handleUpdateHero({ ...data.hero, subHeadline: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-blue-500 outline-none transition-all"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">Profile Photo</label>
                      <div className="relative group rounded-2xl overflow-hidden border border-white/10 aspect-square">
                        <img src={data.hero.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-8">
                          <ImageUpload onUpload={(url) => handleUpdateHero({ ...data.hero, image: url })} />
                        </div>
                      </div>
                      <input 
                        type="text"
                        defaultValue={data.hero.image}
                        onBlur={(e) => handleUpdateHero({ ...data.hero, image: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/40 mt-4 outline-none focus:border-blue-500"
                        placeholder="Image URL"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif">Portfolio Engine</h3>
                <button 
                  onClick={() => setEditingItem({ title: '', category: '', image: '', results: '', problem: '', strategy: '', caseStudyLink: '', status: 'published' })}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
                >
                  <Plus size={16} /> New Case Study
                </button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'portfolio')}>
                <SortableContext items={data.portfolio.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid gap-4">
                    {data.portfolio.map(item => (
                      <SortableItem key={item.id} id={item.id}>
                        <div className="glass p-6 rounded-2xl flex justify-between items-center group/item hover:border-blue-500/50 transition-all pl-12">
                          <div className="flex gap-6 items-center">
                            <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10">
                              <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${item.status === 'published' ? 'bg-emerald-500' : 'bg-white/20'}`}>
                                {item.status}
                              </div>
                            </div>
                            <div>
                              <div className="font-bold text-lg">{item.title}</div>
                              <div className="flex items-center gap-3 mt-1">
                                <span className="text-[10px] uppercase tracking-widest text-white/40 bg-white/5 px-2 py-0.5 rounded">{item.category}</span>
                                <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">{item.results}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingItem(item)} className="p-3 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white">
                              <Settings size={18} />
                            </button>
                            <button onClick={() => handleDelete('portfolio', item.id)} className="p-3 hover:bg-red-400/10 rounded-xl transition-all text-white/40 hover:text-red-400">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif">Technical Proficiency</h3>
                <button 
                  onClick={() => setEditingItem({ name: '', level: 85 })}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
                >
                  <Plus size={16} /> Add Tool
                </button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'skills')}>
                <SortableContext items={data.skills.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.skills.map(skill => (
                      <SortableItem key={skill.id} id={skill.id}>
                        <div className="glass p-6 rounded-2xl flex justify-between items-center group/item hover:border-blue-500/50 transition-all pl-12">
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-bold">{skill.name}</span>
                              <span className="text-xs text-blue-400 font-bold">{skill.level}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                className="h-full bg-blue-600"
                              />
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
                            <button onClick={() => setEditingItem(skill)} className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/40 hover:text-white">
                              <Settings size={16} />
                            </button>
                            <button onClick={() => handleDelete('skills', skill.id)} className="p-2 hover:bg-red-400/10 rounded-lg transition-all text-white/40 hover:text-red-400">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif">Testimonials Hub</h3>
                <button 
                  onClick={() => setEditingItem({ name: '', role: '', company: '', quote: '', rating: 5, image: '' })}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
                >
                  <Plus size={16} /> New Testimonial
                </button>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'testimonials')}>
                <SortableContext items={data.testimonials.map(i => i.id)} strategy={verticalListSortingStrategy}>
                  <div className="grid gap-4">
                    {data.testimonials.map(t => (
                      <SortableItem key={t.id} id={t.id}>
                        <div className="glass p-6 rounded-2xl flex justify-between items-center group/item hover:border-blue-500/50 transition-all pl-12">
                          <div className="flex gap-6 items-center">
                            <img src={t.image} className="w-12 h-12 object-cover rounded-full border border-white/10" referrerPolicy="no-referrer" />
                            <div>
                              <div className="font-bold">{t.name}</div>
                              <div className="text-xs text-white/40">{t.role} @ {t.company}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setEditingItem(t)} className="p-3 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white">
                              <Settings size={18} />
                            </button>
                            <button onClick={() => handleDelete('testimonials', t.id)} className="p-3 hover:bg-red-400/10 rounded-xl transition-all text-white/40 hover:text-red-400">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </SortableItem>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif">Resources & Guides</h3>
                <button 
                  onClick={() => setEditingItem({ title: '', category: '', image: '', content: '', status: 'published' })}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition-all"
                >
                  <Plus size={16} /> New Post
                </button>
              </div>

              <div className="grid gap-6">
                {data.blog.map(post => (
                  <div key={post.id} className="glass p-6 rounded-2xl flex justify-between items-center group/item hover:border-blue-500/50 transition-all">
                    <div className="flex gap-6 items-center">
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-white/10">
                        <img src={post.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">{post.title}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] uppercase tracking-widest text-white/40">{post.date.split('T')[0]}</span>
                          <span className="text-[10px] uppercase tracking-widest text-blue-400 font-bold">{post.category}</span>
                          <span className={`text-[10px] uppercase tracking-widest font-bold ${post.status === 'published' ? 'text-emerald-400' : 'text-white/20'}`}>{post.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingItem(post)} className="p-3 hover:bg-white/10 rounded-xl transition-all text-white/40 hover:text-white">
                        <Settings size={18} />
                      </button>
                      <button onClick={() => handleDelete('blog', post.id)} className="p-3 hover:bg-red-400/10 rounded-xl transition-all text-white/40 hover:text-red-400">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif">Contact Leads</h3>
                <div className="text-xs text-white/40 uppercase tracking-widest">Total: {data.leads.length}</div>
              </div>

              <div className="glass rounded-3xl overflow-hidden border border-white/10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5">
                      <th className="p-6 text-[10px] uppercase tracking-widest text-white/40 font-medium">Date</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest text-white/40 font-medium">Name</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest text-white/40 font-medium">Subject</th>
                      <th className="p-6 text-[10px] uppercase tracking-widest text-white/40 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {data.leads.map(lead => (
                      <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                        <td className="p-6 text-sm text-white/60 font-mono">{new Date(lead.date).toLocaleDateString()}</td>
                        <td className="p-6">
                          <div className="font-bold text-sm">{lead.name}</div>
                          <div className="text-xs text-white/40">{lead.email}</div>
                        </td>
                        <td className="p-6 text-sm text-white/80">{lead.subject}</td>
                        <td className="p-6">
                          <button 
                            onClick={() => setEditingItem({ ...lead, isLead: true })}
                            className="text-blue-400 hover:text-blue-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                          >
                            View <ArrowRight size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif">Activity Log</h3>
                <div className="text-xs text-white/40 uppercase tracking-widest">Recent Actions</div>
              </div>

              <div className="space-y-4">
                {data.history.map(item => (
                  <div key={item.id} className="glass p-5 rounded-2xl flex gap-6 items-center border-l-4 border-l-blue-500">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <History size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-sm">{item.action}</div>
                      <div className="text-xs text-white/40 mt-1">{item.details}</div>
                    </div>
                    <div className="text-[10px] uppercase tracking-widest text-white/20 font-mono">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-4">
                <h2 className="text-3xl font-serif">Media Library</h2>
                <p className="text-white/40 text-sm max-w-2xl">Manage all visual assets across your portfolio. Upload new images or update existing ones to maintain a consistent brand identity.</p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="glass p-8 rounded-3xl space-y-6 group hover:border-blue-500/50 transition-all">
                  <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative">
                    <img src={data.hero.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold">Hero Image</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">URL</label>
                      <input 
                        type="text"
                        defaultValue={data.hero.image}
                        onBlur={(e) => handleUpdateHero({ ...data.hero, image: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono focus:border-white outline-none transition-all"
                      />
                    </div>
                    <ImageUpload onUpload={(url) => handleUpdateHero({ ...data.hero, image: url })} />
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl space-y-6 group hover:border-blue-500/50 transition-all">
                  <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative">
                    <img src={data.hero.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-[10px] uppercase tracking-widest font-bold">About Image</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-white/40">URL</label>
                      <input 
                        type="text"
                        defaultValue={data.hero.image}
                        onBlur={(e) => handleUpdateHero({ ...data.hero, image: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono focus:border-white outline-none transition-all"
                      />
                    </div>
                    <ImageUpload onUpload={(url) => handleUpdateHero({ ...data.hero, image: url })} />
                  </div>
                </div>

                {data.portfolio.slice(0, 3).map(item => (
                  <div key={item.id} className="glass p-8 rounded-3xl space-y-6 group hover:border-blue-500/50 transition-all">
                    <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative">
                      <img src={item.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-[10px] uppercase tracking-widest font-bold">Project: {item.title}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">URL</label>
                        <input 
                          type="text"
                          defaultValue={item.image}
                          onBlur={(e) => handleSaveItem('portfolio', { ...item, image: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs font-mono focus:border-white outline-none transition-all"
                        />
                      </div>
                      <ImageUpload onUpload={(url) => handleSaveItem('portfolio', { ...item, image: url })} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass p-10 rounded-3xl w-full max-w-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-serif">
                  {editingItem.isLead ? 'Lead Details' : `Edit ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1, -1)}`}
                </h3>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-white/10 rounded-full transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {editingItem.isLead ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-widest text-white/40">Name</div>
                        <div className="font-bold">{editingItem.name}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] uppercase tracking-widest text-white/40">Email</div>
                        <div className="font-bold text-blue-400">{editingItem.email}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-widest text-white/40">Subject</div>
                      <div className="font-bold">{editingItem.subject}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] uppercase tracking-widest text-white/40">Message</div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm leading-relaxed whitespace-pre-wrap">
                        {editingItem.message}
                      </div>
                    </div>
                    <div className="pt-4">
                      <a href={`mailto:${editingItem.email}`} className="flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-500 transition-all">
                        Reply via Email <ArrowRight size={16} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <>
                    {Object.keys(editingItem).filter(k => !['id', 'displayOrder', 'date', 'timestamp'].includes(k)).map(key => (
                      <div key={key} className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest text-white/40">{key.replace(/_/g, ' ')}</label>
                        {key === 'content' || key === 'description' || key === 'problem' || key === 'strategy' || key === 'message' ? (
                          <textarea
                            value={editingItem[key]}
                            onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-white outline-none transition-all text-sm"
                            rows={key === 'content' ? 10 : 4}
                            placeholder={`Enter ${key}...`}
                          />
                        ) : key === 'image' || key === 'profile_photo' ? (
                          <div className="space-y-4">
                            <input
                              type="text"
                              value={editingItem[key]}
                              onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-white outline-none transition-all text-xs font-mono"
                              placeholder="Image URL"
                            />
                            <ImageUpload onUpload={(url) => setEditingItem({ ...editingItem, [key]: url })} />
                          </div>
                        ) : key === 'status' ? (
                          <select
                            value={editingItem[key]}
                            onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-white outline-none transition-all text-sm appearance-none"
                          >
                            <option value="published" className="bg-zinc-900">Published</option>
                            <option value="draft" className="bg-zinc-900">Draft</option>
                          </select>
                        ) : (
                          <input
                            type={key === 'level' || key === 'rating' ? 'number' : 'text'}
                            value={editingItem[key]}
                            onChange={(e) => setEditingItem({ ...editingItem, [key]: (key === 'level' || key === 'rating') ? parseInt(e.target.value) : e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-white outline-none transition-all text-sm"
                            placeholder={`Enter ${key}...`}
                          />
                        )}
                      </div>
                    ))}
                    <div className="flex gap-4 pt-6">
                      <button 
                        onClick={() => setEditingItem(null)}
                        className="flex-1 px-8 py-4 rounded-xl border border-white/10 font-bold hover:bg-white/5 transition-all"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSaveItem(activeTab, editingItem)}
                        disabled={isSaving}
                        className="flex-1 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [data, setData] = useState<AppData | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    const res = await fetch('/api/content');
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      setIsLoggedIn(true);
      setError('');
    } else {
      const errorData = await res.json().catch(() => ({}));
      setError(errorData.message || 'Invalid credentials');
    }
  };

  if (!data) return <div className="min-h-screen bg-dark flex items-center justify-center font-serif text-2xl animate-pulse">SJK</div>;

  return (
    <div className="relative">
      <CustomCursor />
      <Navbar data={data} onAdminClick={() => setIsAdminOpen(true)} />
      
      <main>
        <Hero data={data} />
        <About data={data} />
        <Skills data={data} />
        <GlobalReach />
        <FunnelSection />
        <Portfolio data={data} />
        <Testimonials data={data} />
        <Contact data={data} />
      </main>

      <Footer data={data} onAdminClick={() => setIsAdminOpen(true)} />

      {/* Admin Login Modal */}
      <AnimatePresence>
        {isAdminOpen && !isLoggedIn && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdminOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass p-12 rounded-3xl w-full max-w-md relative z-10 text-center"
            >
              <h2 className="text-3xl font-serif mb-8">Studio Access</h2>
              <form onSubmit={handleLogin} className="space-y-6">
                <input 
                  type="text" 
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-white outline-none transition-all text-center"
                />
                <input 
                  type="password" 
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:border-white outline-none transition-all text-center"
                />
                {error && <p className="text-red-400 text-xs uppercase tracking-widest">{error}</p>}
                <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white/90 transition-all">
                  Login
                </button>
              </form>
              <button 
                onClick={() => setIsAdminOpen(false)}
                className="mt-6 text-white/30 hover:text-white transition-colors text-[10px] uppercase tracking-widest"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Dashboard */}
      <AnimatePresence>
        {isLoggedIn && (
          <AdminDashboard 
            data={data} 
            onUpdate={fetchData} 
            onLogout={() => { setIsLoggedIn(false); setIsAdminOpen(false); setUsername(''); setPassword(''); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
