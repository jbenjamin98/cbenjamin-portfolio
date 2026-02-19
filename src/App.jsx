import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Linkedin, Mail, Flag, Phone, Github } from 'lucide-react';

import VisitorCounter from './components/VisitorCounter';
import resumeData from './data/resumeData.json';
import headshot from './assets/headshot.png';
import uvaLogo from './assets/uvaLogo.png';

const STRIPES = [
  { color: "#222337", d: "M-144 -200 L 48 40 L 48 10000" },
  { color: "#ef4b2f", d: "M-128 -200 L 64 40 L 64 10000" },
  { color: "#ff9a14", d: "M-112 -200 L 80 40 L 80 10000" },
  { color: "#ffffe5", d: "M-96 -200 L 96 40 L 96 10000" },
  { color: "#4d80d3", d: "M-80 -200 L 112 40 L 112 10000" },
];

const MOBILE_STRIPES = [
  { color: "#222337", d: "M-72 -200 L 24 40 L 24 10000" },
  { color: "#ef4b2f", d: "M-64 -200 L 32 40 L 32 10000" },
  { color: "#ff9a14", d: "M-56 -200 L 40 40 L 40 10000" },
  { color: "#ffffe5", d: "M-48 -200 L 48 40 L 48 10000" },
  { color: "#4d80d3", d: "M-40 -200 L 56 40 L 56 10000" },
];

const NAV_ITEMS = [
  { id: 'about', label: 'About', color: '#ef4b2f' },
  { id: 'education', label: 'Edu', color: '#ff9a14' },
  { id: 'projects', label: 'Projects', color: '#4d80d3' },
  { id: 'experience', label: 'Exp', color: '#222337' },
  { id: 'skills', label: 'Skills', color: '#ef4b2f' },
];

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia('(max-width: 768px)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isMobile;
};

const SpinningCoin = ({ className = "" }) => (
  <div className={`relative shrink-0 ${className}`} style={{ perspective: "1000px" }}>
    <div 
      className="absolute inset-0 rounded-full bg-[#ff9a14]/10 border-4 border-[#ff9a14] shadow-[4px_4px_0px_0px_#ff9a14] overflow-hidden flex items-center justify-center animate-spin-y"
      style={{ transformStyle: "preserve-3d" }}
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-80">
        <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          {STRIPES.map((stripe, index) => (
            <path key={index} d={stripe.d} stroke={stripe.color} strokeWidth="16" strokeLinejoin="round" />
          ))}
        </svg>
      </div>
      <img src={uvaLogo} alt="UVA Logo" className="relative w-[75%] h-[75%] object-contain z-10" />
    </div>
  </div>
);

const TypingHeading = ({ text, className }) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setVisibleCount((prev) => {
          if (prev >= text.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isInView, text]);

  return (
    <h2 ref={ref} className={className} aria-label={text}>
      <span aria-hidden="true">{text.slice(0, visibleCount)}</span>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-3 h-[1em] bg-[#ef4b2f] ml-1 align-middle"
        aria-hidden="true"
      />
      <span aria-hidden="true" className="opacity-0">{text.slice(visibleCount)}</span>
    </h2>
  );
};

const Card = ({ children, className = "", stripeScale = 1, disableStripePadding = false, ...props }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const stripesY = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const isMobile = useIsMobile();

  const desktopStripes = STRIPES;

  const stripes = isMobile ? MOBILE_STRIPES : desktopStripes;
  const strokeWidth = isMobile ? "8" : "16";

  return (
    <motion.div
      ref={ref}
      className={`relative bg-[#ff9a14]/10 border-2 border-[#ff9a14] rounded-xl p-6 shadow-[4px_4px_0px_0px_#ff9a14] md:hover:shadow-[8px_8px_0px_0px_#ff9a14] transition-shadow duration-300 overflow-hidden ${className}`}
      {...props}
    >
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-80">
        <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.g style={{ y: stripesY, scale: stripeScale, originX: 0, originY: 0, willChange: "transform" }}>
            {stripes.map((stripe, index) => (
              <path key={index} d={stripe.d} stroke={stripe.color} strokeWidth={strokeWidth} strokeLinejoin="round" />
            ))}
            {stripes.map((stripe, index) => (
              <path
                key={`anim-${index}`}
                d={stripe.d}
                stroke="white"
                strokeWidth={strokeWidth}
                strokeLinejoin="round"
                strokeDasharray="100 100"
                className="opacity-10 animate-dash-scroll"
                style={{ willChange: "stroke-dashoffset" }}
              />
            ))}
          </motion.g>
        </svg>
      </div>
      <div className="relative z-10" style={{ paddingLeft: disableStripePadding ? 0 : (isMobile ? `${stripeScale * 3.5}rem` : `${stripeScale * 7}rem`) }}>{children}</div>
    </motion.div>
  );
};

const FloatingNav = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [bottomOffset, setBottomOffset] = useState(32);
  const navRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, top: 0, height: 0, opacity: 0 });
  const isMobile = useIsMobile();

  useEffect(() => {
    let ticking = false;
    let sectionPositions = [];
    let footerTop = null;

    const cacheElements = () => {
      const sections = ['hero', 'about', 'education', 'projects', 'experience', 'skills'];
      sectionPositions = sections.map(id => {
        const el = document.getElementById(id);
        if (!el) return null;
        return { id, top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight };
      }).filter(Boolean);
      const footerEl = document.getElementById('contact');
      if (footerEl) footerTop = footerEl.offsetTop;
    };

    cacheElements();

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 300;

          for (const { id, top, bottom } of sectionPositions) {
            if (scrollPosition >= top && scrollPosition < bottom) {
              setActiveSection(id);
            }
          }

          if (footerTop !== null) {
            const footerRectTop = footerTop - window.scrollY;
            const windowHeight = window.innerHeight;
            if (footerRectTop < windowHeight) {
              setBottomOffset(32 + (windowHeight - footerRectTop));
            } else {
              setBottomOffset(32);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      cacheElements();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const updatePill = () => {
      if (!navRef.current) return;
      const activeLink = navRef.current.querySelector(`a[href="#${activeSection}"]`);
      if (activeLink) {
        setPillStyle({
          left: activeLink.offsetLeft,
          width: activeLink.offsetWidth,
          top: activeLink.offsetTop,
          height: activeLink.offsetHeight,
          opacity: 1
        });
      } else {
        setPillStyle(prev => ({ ...prev, opacity: 0 }));
      }
    };

    updatePill();
    window.addEventListener('resize', updatePill);
    return () => window.removeEventListener('resize', updatePill);
  }, [activeSection]);

  const activeItem = NAV_ITEMS.find(item => item.id === activeSection);

  return (
    <div className="fixed inset-x-0 z-40 flex justify-center pointer-events-none" style={{ bottom: `${bottomOffset}px` }}>
      <nav ref={navRef} className={`pointer-events-auto relative flex items-center gap-1 p-2 rounded-full border-2 border-[#222337] bg-[#ffffe5]/90 ${isMobile ? '' : 'backdrop-blur-md'} shadow-[4px_4px_0px_0px_#222337] overflow-x-auto max-w-[90vw]`}>
        <motion.div
          className="absolute rounded-full"
          initial={false}
          animate={{
            left: pillStyle.left,
            width: pillStyle.width,
            top: pillStyle.top,
            height: pillStyle.height,
            backgroundColor: activeItem ? activeItem.color : 'transparent',
            opacity: pillStyle.opacity
          }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`relative px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-['Space_Mono'] font-bold transition-colors duration-300 whitespace-nowrap z-10 ${isActive ? 'text-[#ffffe5]' : 'text-[#222337]'}`}
            >
              {item.label}
            </a>
          );
        })}
      </nav>
    </div>
  );
};

const App = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const isMobile = useIsMobile();

  return (
    <div className="font-['Space_Mono'] transition-colors duration-300 text-[#222337] overflow-x-hidden">
      <div className="fixed inset-0 z-[-2] bg-[#ffffe5]" />
      
      {/* Noise Overlay */}
      {!isMobile && (
        <div className="fixed inset-0 z-[0] pointer-events-none opacity-[0.04] mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
      )}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
          
          .text-shadow-hero {
            text-shadow: 3px 3px 0px #ef4b2f;
          }

          .text-shadow-section {
            text-shadow: 2px 2px 0px #ff9a14;
          }

          @media (max-width: 768px) {
            ::-webkit-scrollbar {
              display: none;
            }
            html {
              scrollbar-width: none;
              scroll-behavior: smooth;
              scroll-padding-top: 80px;
            }
          }

          @media (min-width: 769px) {
            ::-webkit-scrollbar {
              width: 12px;
            }
            html {
              scroll-behavior: smooth;
              scroll-padding-top: 100px;
            }
            ::-webkit-scrollbar-track {
              background: #ffffe5;
            }
            ::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #222337 0%, #222337 20%, #ef4b2f 20%, #ef4b2f 40%, #ff9a14 40%, #ff9a14 60%, #ffffe5 60%, #ffffe5 80%, #4d80d3 80%, #4d80d3 100%);
              border-radius: 6px;
              border: 2px solid #ffffe5;
            }
          }

          @media print {
            .fixed {
              display: none !important;
            }
            main {
              padding-top: 0 !important;
            }
          }

          @keyframes spin-y {
            from { transform: rotateY(0deg); }
            to { transform: rotateY(360deg); }
          }
          .animate-spin-y {
            animation: spin-y 5s linear infinite;
          }
          @keyframes dash-scroll {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: -200; }
          }
          .animate-dash-scroll {
            animation: dash-scroll 10s linear infinite;
          }
        `}
      </style>
      <Header scaleX={scaleX} />
      <FloatingNav />
      <main className="pt-24 relative z-10">
        <Hero />
        <About />
        <Education />
        <Projects />
        <Experience />
        <Skills />
      </main>
      <Footer className="relative z-10" />
    </div>
  );
};

const Header = ({ scaleX }) => {
  const dashOffset = useTransform(scaleX, [0, 1], [0, -1000]);
  const nameRef = useRef(null);
  const [nameRight, setNameRight] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const updatePosition = () => {
      if (nameRef.current) {
        setNameRight(nameRef.current.getBoundingClientRect().right);
      }
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, []);

  const stripes = [
    { color: "#222337", y: 15, offset: 100 },
    { color: "#ef4b2f", y: 25, offset: 100 },
    { color: "#ff9a14", y: 35, offset: 100 },
    { color: "#ffffe5", y: 45, offset: 100 },
    { color: "#4d80d3", y: 55, offset: 100 },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isMobile ? '' : 'backdrop-blur-md'} border-b-2 shadow-[0_4px_0_0_rgba(34,35,55,0.05)] transition-colors duration-300 bg-[#ffffe5]/90 border-[#222337]/10 overflow-hidden`}>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {stripes.map((stripe, index) => (
            <path key={index} d={`M${(nameRight + stripe.offset) - ((stripe.y + 20) * 2)} -30 L ${nameRight + stripe.offset} ${stripe.y} L 10000 ${stripe.y}`} stroke={stripe.color} strokeWidth="10" strokeLinejoin="round" />
          ))}
          {stripes.map((stripe, index) => (
            <motion.path
              key={`shine-${index}`}
              d={`M${(nameRight + stripe.offset) - ((stripe.y + 20) * 3)} -20 L ${nameRight + stripe.offset} ${stripe.y} L 10000 ${stripe.y}`}
              stroke="white"
              strokeWidth="10"
              strokeLinejoin="round"
              strokeDasharray="100 100"
              style={{ strokeDashoffset: dashOffset, opacity: 0.1, willChange: "stroke-dashoffset" }}
            />
          ))}
        </svg>
      </div>
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center relative z-10">
        <a ref={nameRef} href="#" className="font-['Orbitron'] text-xl md:text-3xl font-extrabold tracking-tighter transition-colors text-[#222337]">
          {resumeData.personal_information.name}
        </a>
      </nav>
    </header>
  );
};

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const headshotY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const stripes = STRIPES;

  return (
    <section ref={ref} id="hero" className="container mx-auto px-6 py-32 flex flex-col md:flex-row items-center justify-center gap-12 relative overflow-hidden">
      <motion.div
        className="relative w-72 h-72"
      >
        <motion.div
          className="absolute inset-0 rounded-full bg-[#ff9a14]/10 border-4 border-[#ff9a14] shadow-[4px_4px_0px_0px_#ff9a14] overflow-hidden flex items-center justify-center"
        >
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-80">
            <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
              {stripes.map((stripe, index) => (
                <path key={index} d={stripe.d} stroke={stripe.color} strokeWidth="16" strokeLinejoin="round" />
              ))}
            </svg>
          </div>
          <motion.img 
            style={{ y: headshotY }} 
            src={headshot} 
            alt="Christian Benjamin" 
            className="relative w-[100%] h-[100%] max-w-none object-cover z-10" 
            loading="eager"
            fetchPriority="high"
          />
        </motion.div>
      </motion.div>
      <motion.div style={{ y }} className="w-full md:w-auto max-w-lg">
        <Card>
          <h1 className="text-4xl font-['Orbitron'] font-bold text-[#222337] text-shadow-hero">{resumeData.personal_information.name}</h1>
          <h2 className="text-xl font-['Space_Mono'] text-[#ef4b2f] mt-2">{resumeData.personal_information.title}</h2>

          <div className="mt-6 space-y-3 font-['Space_Mono'] text-sm md:text-base">
            <div className="flex items-center gap-3">
              <Flag className="w-5 h-5 text-[#ef4b2f]" />
              <span>{resumeData.personal_information.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#ff9a14]" />
              <a href={`mailto:${resumeData.personal_information.email}`} className="hover:text-[#ef4b2f] transition-colors" aria-label="Email">{resumeData.personal_information.email}</a>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#4d80d3]" />
              <a href={`tel:${resumeData.personal_information.phone}`} className="hover:text-[#ef4b2f] transition-colors" aria-label="Phone">{resumeData.personal_information.phone}</a>
            </div>
            <div className="flex gap-4 mt-4 pt-4 border-t-2 border-[#222337]/10">
              <motion.a 
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                href={resumeData.personal_information.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#222337] hover:text-[#ef4b2f] transition-colors" 
                aria-label="GitHub"
              >
                <Github className="w-6 h-6" />
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.2, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
                href={resumeData.personal_information.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#222337] hover:text-[#ef4b2f] transition-colors" 
                aria-label="LinkedIn"
              >
                <Linkedin className="w-6 h-6" />
              </motion.a>
            </div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

const About = () => {
  return (
    <section id="about" className="container mx-auto px-6 py-32">
      <TypingHeading text="About Me" className="text-4xl font-['Orbitron'] font-bold text-center text-shadow-section" />
      <div className="mt-8 max-w-3xl mx-auto">
        <Card>
          <p className="text-sm md:text-base">
            {resumeData.personal_information.summary}
          </p>
        </Card>
      </div>
    </section>
  )
}

const Education = () => {
  const education = [resumeData.education];
  const stripes = STRIPES;

  return (
    <section id="education" className="container mx-auto px-6 py-32 relative">
      <TypingHeading text="Education" className="text-4xl font-['Orbitron'] font-bold text-center text-shadow-section" />
      <div className="mt-12 flex justify-center relative">
        {education.map((edu, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-8 w-full max-w-5xl">
            <SpinningCoin className="hidden md:block w-48 h-48" />
            <Card
              className="w-full flex-1"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                opacity: { duration: 0.5 },
                scale: { duration: 0.5 },
              }}
            >
              <div className="md:hidden flex justify-center mb-6">
                <SpinningCoin className="w-32 h-32" />
              </div>
              <div className="w-full text-left">
                <h3 className="text-xl font-bold font-['Orbitron']">{edu.institution}</h3>
                <p className="font-['Space_Mono'] text-sm md:text-base">{edu.degree}</p>
                <p className="text-sm text-[#ef4b2f]">{edu.graduation_date}</p>
              </div>
            <div className="mt-8">
              <h4 className="font-bold text-sm mb-4 font-['Orbitron'] text-left">Relevant Coursework:</h4>
              <div className="flex flex-wrap justify-start gap-3">
                {edu.related_coursework.map((course, i) => (
                  <motion.div
                    key={i}
                    className="px-3 py-1 border-2 border-[#222337] bg-[#ffffe5] text-[#222337] font-bold shadow-[4px_4px_0px_0px_#ef4b2f] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-default text-xs md:text-sm"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    {course}
                  </motion.div>
                ))}
              </div>
            </div>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="container mx-auto px-6 py-32 relative">
      <TypingHeading text="Projects" className="text-4xl font-['Orbitron'] font-bold text-center text-shadow-section" />
      <div className="mt-12 grid md:grid-cols-2 gap-8 relative">
        {resumeData.projects.map((project, index) => (
          <Card
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <h3 className="text-xl font-bold font-['Orbitron']">{project.title}</h3>
            <ul className="mt-2 list-disc list-inside text-sm md:text-base">
              {project.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.technologies.split(', ').map(tag => <span key={tag} className="px-3 py-1 md:px-4 md:py-2 border-2 border-[#222337] bg-[#ffffe5] text-[#222337] font-bold shadow-[4px_4px_0px_0px_#ef4b2f] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-default text-xs md:text-base">{tag}</span>)}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

const Experience = () => {
  return (
    <section id="experience" className="container mx-auto px-6 py-32 relative">
      <TypingHeading text="Experience" className="text-4xl font-['Orbitron'] font-bold text-center text-shadow-section" />
      <div className="mt-12 relative">
        {resumeData.work_experience.map((job, index) => (
          <Card
            key={index}
            className="mb-12"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-xl font-bold font-['Orbitron']">{job.role} @ {job.company}</h3>
            <p className="text-sm text-[#ef4b2f] font-['Space_Mono']">{job.dates}</p>
            <ul className="mt-2 list-disc list-inside text-sm md:text-base">
              {job.details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </section>
  );
};

const Skills = () => {
  return (
    <section id="skills" className="container mx-auto px-6 py-32 relative">
      <TypingHeading text="Skills" className="text-4xl font-['Orbitron'] font-bold text-center text-shadow-section" />
      <div className="mt-12 max-w-4xl mx-auto font-['Space_Mono'] relative">
        <Card>
          <div className="space-y-8">
            {Object.entries(resumeData.skills).map(([category, skills], categoryIndex) => (
              <div key={category}>
                <h3 className="text-xl font-bold mb-4 font-['Orbitron'] capitalize">
                  {category.replace('_', ' ')}
                </h3>
                <div className="flex flex-wrap gap-4">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      className="px-3 py-1 md:px-4 md:py-2 border-2 border-[#222337] bg-[#ffffe5] text-[#222337] font-bold shadow-[4px_4px_0px_0px_#ef4b2f] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all cursor-default text-xs md:text-base"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: (categoryIndex * 0.2) + (index * 0.05) }}
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
};

const Footer = ({ className = "" }) => {
  return (
    <footer id="contact" className={`bg-[#222337] text-[#ffffe5] mt-20 py-12 ${className}`}>
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        <div className="text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} {resumeData.personal_information.name}. All Rights Reserved.</p>
        </div>
        <div className="flex items-center space-x-6">
          <motion.a 
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            href={resumeData.personal_information.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#ff9a14] transition-colors" 
            aria-label="GitHub"
          >
            <Github />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2, rotate: -5 }}
            whileTap={{ scale: 0.9 }}
            href={resumeData.personal_information.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#ff9a14] transition-colors" 
            aria-label="LinkedIn"
          >
            <Linkedin />
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            href={`mailto:${resumeData.personal_information.email}`} 
            className="hover:text-[#ff9a14] transition-colors" 
            aria-label="Email"
          >
            <Mail />
          </motion.a>
          <VisitorCounter />
        </div>

      </div>
    </footer>
  );
};

export default App;