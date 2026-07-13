import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
export default function App() {
  const [activeLang, setActiveLang] = useState<"IT" | "EN">("IT");
  const [menuOpen, setMenuOpen] = useState(false);

  // States to drive the elegant Apple-style intro sequence
  const [panelAnimCompleted, setPanelAnimCompleted] = useState(false);
  const [showBg, setShowBg] = useState(false);
  const [animateTextStage, setAnimateTextStage] = useState<"idle" | "first" | "second">("idle");
  const [isMobile, setIsMobile] = useState(false);

  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // 1. O painel começa a subir imediatamente após a montagem (dura 400ms)
    // 2. Aos 400ms, o painel some e o fundo definitivo começa a ser exibido (showBg = true)
    const bgTimeout = setTimeout(() => {
      setPanelAnimCompleted(true);
      setShowBg(true);
    }, 400);

    // 3. Após um atraso adicional de 500ms (ou seja, aos 900ms no total), a primeira frase entra deslizando da direita
    const firstPhraseTimeout = setTimeout(() => {
      setAnimateTextStage("first");
    }, 900);

    // 4. A primeira animação leva 800ms para concluir. Assim, aos 1700ms no total, a segunda frase entra deslizando da esquerda
    const secondPhraseTimeout = setTimeout(() => {
      setAnimateTextStage("second");
    }, 1700);

    return () => {
      clearTimeout(bgTimeout);
      clearTimeout(firstPhraseTimeout);
      clearTimeout(secondPhraseTimeout);
    };
  }, []);

  useEffect(() => {
    if (!showBg) return;
    if (isMobile) return;

    const heroBg = bgRef.current;
    if (!heroBg) return;

    let targetX = heroBg.clientWidth / 2;
    let targetY = heroBg.clientHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    // Set initial values
    heroBg.style.setProperty('--x', `${currentX}px`);
    heroBg.style.setProperty('--y', `${currentY}px`);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroBg.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const animate = () => {
      const ease = 0.09;
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;

      heroBg.style.setProperty('--x', `${currentX}px`);
      heroBg.style.setProperty('--y', `${currentY}px`);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [showBg, isMobile]);

  // Framer Motion variants mimicking Apple's elegant ease-out without overshoot
  const firstPhraseVariants = {
    hidden: { opacity: 0, x: 80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth ease-out with zero bounce
      },
    },
  };

  const secondPhraseVariants = {
    hidden: { opacity: 0, x: -80 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Custom ultra-smooth ease-out with zero bounce
      },
    },
  };

  return (
    <div className="relative w-full bg-black text-white overflow-x-hidden scroll-smooth font-sans-clean select-none">
      
      {/* HERO SECTION CONTAINER */}
      <div className="relative min-h-screen w-full flex flex-col justify-between py-8 px-6 md:px-12 lg:px-16 overflow-hidden z-10">
      
      {/* Background Giant Translucent Letter "A" on the far left - fades in with the background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: showBg ? 0.06 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute -left-12 md:-left-20 top-0 text-[35rem] md:text-[55rem] lg:text-[70rem] font-serif-luxury text-white leading-none pointer-events-none select-none z-0"
        style={{ transform: "translateY(-12%)" }}
      >
        A
      </motion.div>

      {/* Definitive Background of the Hero: Architectural Blueprint with Reveal Effect */}
      <motion.div
        ref={bgRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: showBg ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        style={{
          backgroundColor: "#2a1006",
        }}
      >
        {/* layer-base */}
        <div 
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #451c0c, #1c0904)" }}
        />

        {/* plan-dim */}
        <div className="absolute inset-0 opacity-[0.14] pointer-events-none">
          <BlueprintSVG />
        </div>

        {/* plan-bright */}
        <div 
          className="hidden md:block absolute inset-0 opacity-[0.62] pointer-events-none"
          style={{
            WebkitMaskImage: `radial-gradient(circle 280px at var(--x, 50%) var(--y, 50%), black 0%, rgba(0,0,0,0.5) 45%, transparent 90%)`,
            maskImage: `radial-gradient(circle 280px at var(--x, 50%) var(--y, 50%), black 0%, rgba(0,0,0,0.5) 45%, transparent 90%)`,
          }}
        >
          <BlueprintSVG />
        </div>

        {/* layer-texture */}
        <div 
          className="absolute inset-0 opacity-[0.78] pointer-events-none"
          style={{
            background: `
              repeating-linear-gradient(45deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 2px, transparent 2px, transparent 6px),
              repeating-linear-gradient(-45deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 6px),
              radial-gradient(ellipse at 30% 20%, #7a3517, #2a1006 70%)
            `,
          }}
        />
      </motion.div>

      {/* Wipe Panel & Mask Reveal (Inspired by Apple's transition) */}
      {!panelAnimCompleted && (
        <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
          {/* Rising Horizontal Black Panel */}
          <motion.div
            initial={{ top: "100%" }}
            animate={{ top: "0%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 right-0 h-[4px] bg-[#1a1a1a] border-t border-white/20 z-50"
          />
          {/* Black Wipe Mask underneath */}
          <motion.div
            initial={{ height: "0%" }}
            animate={{ height: "100%" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 left-0 right-0 bg-black z-40"
          />
        </div>
      )}

      {/* HEADER SECTION - Always visible from start */}
      <header className="relative z-10 flex items-center justify-between w-full h-16">
        
        {/* Left: Logo */}
        <div className="flex flex-col items-start">
          <span className="text-xl md:text-2xl font-light tracking-[0.25em] text-white font-sans-clean">
            TECNOARREDA
          </span>
          <span className="text-[9px] md:text-[10px] tracking-[0.35em] text-white/50 font-light mt-0.5 pl-0.5">
            &gt;INTERIOR DESIGN
          </span>
        </div>

        {/* Middle Line and Language Switcher */}
        <div className="flex items-center gap-6 md:gap-10 lg:gap-14 flex-1 justify-end">
          
          {/* Elegant horizontal line stretching from logo to Lang switcher */}
          <div className="hidden md:block flex-1 max-w-[50%] h-[0.5px] bg-white/20 ml-6"></div>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-2 text-[11px] md:text-[12px] tracking-[0.2em] font-light">
            <button 
              onClick={() => setActiveLang("IT")}
              className={`transition-colors duration-300 ${activeLang === "IT" ? "text-white font-medium" : "text-white/40 hover:text-white"}`}
            >
              IT
            </button>
            <span className="text-white/20">/</span>
            <button 
              onClick={() => setActiveLang("EN")}
              className={`transition-colors duration-300 ${activeLang === "EN" ? "text-white font-medium" : "text-white/40 hover:text-white"}`}
            >
              EN
            </button>
          </div>

          {/* Far Right: Minimal Hamburger Menu */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col justify-center items-end gap-1.5 w-8 h-8 group cursor-pointer"
            aria-label="Menu"
          >
            <span className={`h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "w-8 rotate-45 translate-y-[4px]" : "w-8 group-hover:w-6"}`}></span>
            <span className={`h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "w-8 -rotate-45 -translate-y-[4px]" : "w-8 group-hover:w-7"}`}></span>
          </button>
        </div>
      </header>

      {/* MAIN HERO CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col justify-center py-12 md:py-16">
        
        {/* Headline Container with customized editorial stagger */}
        <div className="w-full flex flex-col">
          {/* Top Left: STUDIO DI - Slightly shifted to the right as in the original */}
          <div className="overflow-hidden pl-0 ml-0 md:ml-[-25px] mt-0 md:mt-[-20px]">
            <motion.h1 
              initial="hidden"
              animate={animateTextStage !== "idle" ? "visible" : "hidden"}
              variants={firstPhraseVariants}
              style={{ display: "inline-block", transform: "scaleX(0.88)", transformOrigin: "left" }}
              className="pl-0 md:pl-[50px] text-fluid-studio text-[10vw] md:text-[8vw] lg:text-[7.5vw] font-serif-luxury text-white font-normal uppercase leading-[0.8] -tracking-[0.04em] text-left"
            >
              STUDIO DI
            </motion.h1>
          </div>

          {/* Left: ARCHITETTURA */}
          <div className="relative overflow-visible mt-2">
            <motion.h1 
              initial="hidden"
              animate={animateTextStage !== "idle" ? "visible" : "hidden"}
              variants={firstPhraseVariants}
              style={{ 
                display: "inline-block", 
                transform: "scaleX(0.88)", 
                transformOrigin: "left",
                fontSize: isMobile ? undefined : "108.92px",
                lineHeight: isMobile ? undefined : "105px"
              }}
              className="text-fluid-architettura text-[12vw] md:text-[10vw] lg:text-[9.5vw] font-serif-luxury text-white font-normal uppercase -tracking-[0.04em] text-left md:w-[800px]"
            >
              ARCHITETTURA
            </motion.h1>            
          </div>

          {/* Right Side Stack: INTERIOR */}
          <div className="flex flex-col items-start md:items-end pr-0 md:pr-10 lg:pr-20 mt-3 md:mt-8">
            {/* Row 1: INTERIOR */}
            <div className="overflow-hidden mr-0 md:mr-[-75px] mt-0 md:mt-[-20px]">
              <motion.h2 
                initial="hidden"
                animate={animateTextStage === "second" ? "visible" : "hidden"}
                variants={secondPhraseVariants}
                style={{ 
                  display: "inline-block", 
                  transform: "scaleX(0.88)", 
                  transformOrigin: isMobile ? "left" : "right",
                  lineHeight: isMobile ? undefined : "93.16px",
                  paddingTop: isMobile ? "0px" : "50px"
                }}
                className="text-fluid-interior text-[10vw] md:text-[8vw] lg:text-[7.5vw] font-serif-luxury text-white font-normal uppercase -tracking-[0.04em]"
              >
                INTERIOR
              </motion.h2>
            </div>
          </div>

          {/* Row 2: DESIGN on the right, and Design esclusivo on the left (at the same height) */}
          <div className="flex flex-col-reverse md:flex-row md:items-end justify-between w-full mt-3 md:mt-4">
            
            {/* Left Side: Editorial sub-text (same height as DESIGN) */}
            <div className="pl-1 md:pl-4 mt-4 md:mt-0 mb-4 md:mb-0">
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={animateTextStage === "second" ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{ fontSize: isMobile ? undefined : "30.65px", paddingTop: "0px" }}
                className="text-fluid-tagline flex flex-col font-serif-text text-[5.5vw] md:text-[2.2vw] lg:text-[1.8vw] text-white/90 leading-tight tracking-wide italic font-light"
              >
                <span>Design esclusivo,</span>
                <span className="not-italic opacity-85 mt-0.5">emozioni senza tempo</span>
              </motion.div>
            </div>

            {/* Right Side: DESIGN (retaining the exact positioning relative to the screen layout) */}
            <div className="flex flex-col items-start md:items-end pr-0 md:pr-10 lg:pr-20">
              <div className="overflow-hidden mr-0 md:mr-24 lg:mr-36">
                <motion.h2 
                  initial="hidden"
                  animate={animateTextStage === "second" ? "visible" : "hidden"}
                  variants={secondPhraseVariants}
                  style={{ 
                    display: "inline-block", 
                    transform: "scaleX(0.88)", 
                    transformOrigin: isMobile ? "left" : "right",
                    fontSize: isMobile ? undefined : "126.92px"
                  }}
                  className="text-fluid-design text-[12vw] md:text-[10vw] lg:text-[9.5vw] font-serif-luxury text-white font-normal uppercase leading-[0.8] -tracking-[0.04em]"
                >
                  DESIGN
                </motion.h2>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* FOOTER / BOTTOM ROW - Always visible from start */}
      <footer className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-end w-full gap-6 md:gap-0 mt-auto">
        
        {/* Right Side: Subtle luxury reference indicator (matches agency aesthetics) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="hidden md:block text-[9px] tracking-[0.3em] uppercase text-white font-light pr-1"
        >
          © TECNOARREDA 2026
        </motion.div>

      </footer>

      </div> {/* CLOSE HERO SECTION CONTAINER */}

      {/* FULLSCREEN MINIMALIST MENU DRAWER (Only opens on Hamburger trigger) */}
      <div 
        className={`fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-8 md:p-16 transition-all duration-500 ease-in-out ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center w-full">
          <span className="text-xl font-light tracking-[0.2em]">TECNOARREDA</span>
          <button 
            onClick={() => setMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center text-white text-2xl font-light"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-6 md:gap-10 text-3xl md:text-5xl font-serif-luxury italic pl-4">
          <a href="#studio" onClick={() => setMenuOpen(false)} className="hover:text-white/60 transition-colors duration-300">The Studio</a>
          <a href="#portfolio" onClick={() => setMenuOpen(false)} className="hover:text-white/60 transition-colors duration-300">Portfolio</a>
          <a href="#contatti" onClick={() => setMenuOpen(false)} className="hover:text-white/60 transition-colors duration-300">Contatti</a>
        </nav>

        {/* Mobile Language Switcher inside Drawer */}
        <div className="block md:hidden pl-4 my-2">
          <span className="text-[10px] tracking-[0.25em] text-white/40 uppercase block mb-3 font-sans-clean font-light">Language / Lingua</span>
          <div className="flex items-center gap-4 text-base tracking-[0.2em] font-sans-clean font-light">
            <button 
              onClick={() => {
                setActiveLang("IT");
                setMenuOpen(false);
              }}
              className={`transition-colors duration-300 ${activeLang === "IT" ? "text-white font-medium underline underline-offset-4" : "text-white/40 hover:text-white"}`}
            >
              ITALIANO
            </button>
            <span className="text-white/20">|</span>
            <button 
              onClick={() => {
                setActiveLang("EN");
                setMenuOpen(false);
              }}
              className={`transition-colors duration-300 ${activeLang === "EN" ? "text-white font-medium underline underline-offset-4" : "text-white/40 hover:text-white"}`}
            >
              ENGLISH
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between text-xs text-white/40 font-light gap-4 md:gap-0">
          <div>MILANO — LUGANO — COMONEXT</div>
          <div>INFO@TECNOARREDA.IT</div>
        </div>
      </div>

    </div>
  );
}

function BlueprintSVG() {
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,170,110,0.35)" strokeWidth={1}/>
        </pattern>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        </pattern>
      </defs>
      <rect width="1600" height="900" fill="url(#grid)"/>
      <g fill="none" stroke="rgba(255,190,140,0.9)" strokeWidth={4} strokeLinejoin="miter">
        <rect x={150} y={100} width={1350} height={680}/>
        <path d="M770 100 V780"/>
        <path d="M850 100 V780"/>
        <path d="M150 380 H330"/>
        <path d="M850 420 H1220"/>
        <path d="M1220 100 V420"/>
        <path d="M1220 260 H1500"/>
        <path d="M1150 420 V640"/>
        <path d="M850 640 H1150"/>
        <path d="M1150 640 H1500"/>
      </g>
      <g>
        <path d="M770 215 A35 35 0 0 0 735 250" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={2}/>
        <path d="M770 215 L770 250" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={1} strokeDasharray="2 3"/>
        <path d="M770 565 A35 35 0 0 0 735 600" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={2}/>
        <path d="M770 565 L770 600" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={1} strokeDasharray="2 3"/>
        <path d="M850 215 A35 35 0 0 1 885 250" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={2}/>
        <path d="M850 215 L850 250" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={1} strokeDasharray="2 3"/>
        <path d="M850 465 A35 35 0 0 1 885 500" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={2}/>
        <path d="M850 465 L850 500" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={1} strokeDasharray="2 3"/>
        <path d="M850 665 A35 35 0 0 1 885 700" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={2}/>
        <path d="M850 665 L850 700" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={1} strokeDasharray="2 3"/>
        <path d="M1220 150 A30 30 0 0 1 1250 180" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={2}/>
        <path d="M1220 150 L1220 180" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={1} strokeDasharray="2 3"/>
        <path d="M1220 310 A30 30 0 0 1 1250 340" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={2}/>
        <path d="M1220 310 L1220 340" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={1} strokeDasharray="2 3"/>
        <path d="M1150 430 A30 30 0 0 0 1120 460" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={2}/>
        <path d="M1150 430 L1150 460" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={1} strokeDasharray="2 3"/>
        <path d="M800 740 A40 40 0 0 1 840 780" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={2}/>
        <path d="M800 740 L800 780" fill="none" stroke="rgba(255,190,140,0.7)" strokeWidth={1} strokeDasharray="2 3"/>
      </g>
      <g>
        <line x1={300.0} y1={92} x2={300.0} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={333.3333333333333} y1={92} x2={333.3333333333333} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={366.6666666666667} y1={92} x2={366.6666666666667} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={400.0} y1={92} x2={400.0} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={950.0} y1={92} x2={950.0} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={986.6666666666666} y1={92} x2={986.6666666666666} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1023.3333333333334} y1={92} x2={1023.3333333333334} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1060.0} y1={92} x2={1060.0} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1300.0} y1={92} x2={1300.0} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1340.0} y1={92} x2={1340.0} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1380.0} y1={92} x2={1380.0} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1420.0} y1={92} x2={1420.0} y2={108} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={142} y1={600.0} x2={158} y2={600.0} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={142} y1={633.3333333333334} x2={158} y2={633.3333333333334} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={142} y1={666.6666666666666} x2={158} y2={666.6666666666666} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={142} y1={700.0} x2={158} y2={700.0} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1492} y1={680.0} x2={1508} y2={680.0} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1492} y1={706.6666666666666} x2={1508} y2={706.6666666666666} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1492} y1={733.3333333333334} x2={1508} y2={733.3333333333334} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1492} y1={760.0} x2={1508} y2={760.0} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={250.0} y1={772} x2={250.0} y2={788} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={283.3333333333333} y1={772} x2={283.3333333333333} y2={788} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={316.6666666666667} y1={772} x2={316.6666666666667} y2={788} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={350.0} y1={772} x2={350.0} y2={788} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1000.0} y1={772} x2={1000.0} y2={788} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1036.6666666666667} y1={772} x2={1036.6666666666667} y2={788} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1073.3333333333333} y1={772} x2={1073.3333333333333} y2={788} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <line x1={1110.0} y1={772} x2={1110.0} y2={788} stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
      </g>
      <g>
        <rect x={170} y={120} width={580} height={45} fill="url(#hatch)" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={170} y={120} width={45} height={235} fill="url(#hatch)" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={340} y={230} width={190} height={65} rx={6} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <circle cx={380} cy={250} r={9} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1}/>
        <circle cx={420} cy={250} r={9} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1}/>
        <circle cx={380} cy={275} r={9} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1}/>
        <circle cx={420} cy={275} r={9} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1}/>
        <rect x={600} y={128} width={80} height={34} rx={3} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <ellipse cx={640} cy={145} rx={26} ry={10} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1}/>
        <rect x={700} y={125} width={55} height={90} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <line x1={727} y1={125} x2={727} y2={215} stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <circle cx={250} cy={320} r={55} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <circle cx={250} cy={255} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={250} cy={385} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={185} cy={320} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={315} cy={320} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={470} cy={240} r={4} fill="none" stroke="rgba(255,205,165,0.5)" strokeWidth={1}/>
        <circle cx={600} cy={240} r={4} fill="none" stroke="rgba(255,205,165,0.5)" strokeWidth={1}/>
      </g>
      <g>
        <rect x={180} y={550} width={70} height={140} rx={8} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={180} y={620} width={220} height={70} rx={8} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={300} y={558} width={110} height={55} rx={6} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <rect x={430} y={460} width={72} height={72} rx={10} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <rect x={170} y={392} width={180} height={16} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <rect x={190} y={540} width={260} height={180} rx={10} fill="none" stroke="rgba(255,190,140,0.4)" strokeWidth={1.5} strokeDasharray="4 4"/>
        <rect x={152} y={460} width={16} height={180} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <line x1={152} y1={490} x2={168} y2={490} stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <line x1={152} y1={520} x2={168} y2={520} stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <line x1={152} y1={550} x2={168} y2={550} stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <line x1={152} y1={580} x2={168} y2={580} stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <line x1={152} y1={610} x2={168} y2={610} stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <circle cx={460} cy={700} r={7} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <line x1={460} y1={707} x2={460} y2={740} stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <circle cx={175} cy={760} r={16} fill="url(#hatch)" stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <circle cx={310} cy={450} r={5} fill="none" stroke="rgba(255,205,165,0.5)" strokeWidth={1} strokeDasharray="2 2"/>
      </g>
      <g>
        <rect x={560} y={520} width={160} height={90} rx={8} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={600} y={700} width={180} height={35} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
      </g>
      <g>
        <circle cx={600} cy={500} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={660} cy={500} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={720} cy={500} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={600} cy={640} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={660} cy={640} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={720} cy={640} r={12} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
      </g>
      <g>
        <circle cx={600} cy={500} r={5} fill="none" stroke="rgba(255,205,165,0.45)" strokeWidth={1} strokeDasharray="2 2"/>
        <circle cx={660} cy={500} r={5} fill="none" stroke="rgba(255,205,165,0.45)" strokeWidth={1} strokeDasharray="2 2"/>
        <circle cx={720} cy={500} r={5} fill="none" stroke="rgba(255,205,165,0.45)" strokeWidth={1} strokeDasharray="2 2"/>
      </g>
      <g>
        <rect x={900} y={140} width={220} height={185} rx={8} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={915} y={155} width={80} height={40} rx={6} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <rect x={1005} y={155} width={80} height={40} rx={6} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <line x1={900} y1={260} x2={1120} y2={260} stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <rect x={870} y={200} width={26} height={36} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <rect x={1124} y={200} width={26} height={36} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <circle cx={883} cy={192} r={5} fill="none" stroke="rgba(255,205,165,0.5)" strokeWidth={1}/>
        <circle cx={1137} cy={192} r={5} fill="none" stroke="rgba(255,205,165,0.5)" strokeWidth={1}/>
        <rect x={915} y={335} width={170} height={28} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <rect x={1150} y={105} width={60} height={130} fill="url(#hatch)" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <circle cx={1010} cy={180} r={5} fill="none" stroke="rgba(255,205,165,0.5)" strokeWidth={1} strokeDasharray="2 2"/>
      </g>
      <g>
        <ellipse cx={1260} cy={150} rx={18} ry={24} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={1246} y={118} width={28} height={18} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <rect x={1400} y={115} width={80} height={30} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <ellipse cx={1440} cy={130} rx={28} ry={9} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <rect x={1340} y={175} width={110} height={75} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <line x1={1340} y1={175} x2={1450} y2={250} stroke="rgba(255,190,140,0.35)" strokeWidth={1} strokeDasharray="3 3"/>
        <circle cx={1395} cy={215} r={4} fill="none" stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
      </g>
      <g>
        <line x1={1240} y1={290} x2={1480} y2={290} stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <rect x={1250} y={276} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1290} y={276} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1330} y={276} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1370} y={276} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1410} y={276} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1450} y={276} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <line x1={1240} y1={320} x2={1480} y2={320} stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <rect x={1250} y={306} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1290} y={306} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1330} y={306} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1370} y={306} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1410} y={306} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1450} y={306} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <line x1={1240} y1={350} x2={1480} y2={350} stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <rect x={1250} y={336} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1290} y={336} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1330} y={336} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1370} y={336} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1410} y={336} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1450} y={336} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <line x1={1240} y1={380} x2={1480} y2={380} stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <rect x={1250} y={366} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1290} y={366} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1330} y={366} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1370} y={366} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1410} y={366} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <rect x={1450} y={366} width={26} height={12} fill="none" stroke="rgba(255,190,140,0.3)" strokeWidth={0.75}/>
        <line x1={1240} y1={270} x2={1480} y2={270} stroke="rgba(255,190,140,0.4)" strokeWidth={1} strokeDasharray="2 3"/>
      </g>
      <g>
        <rect x={880} y={450} width={150} height={120} rx={6} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={895} y={460} width={55} height={28} rx={5} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <rect x={1000} y={580} width={120} height={38} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <circle cx={1060} cy={562} r={14} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <rect x={880} y={590} width={55} height={38} fill="url(#hatch)" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <circle cx={1000} cy={500} r={5} fill="none" stroke="rgba(255,205,165,0.45)" strokeWidth={1} strokeDasharray="2 2"/>
      </g>
      <g>
        <rect x={1180} y={450} width={280} height={85} rx={18} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={1188} y={465} width={18} height={55} rx={4} fill="none" stroke="rgba(255,190,140,0.4)" strokeWidth={1}/>
        <ellipse cx={1400} cy={580} rx={18} ry={24} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={1386} y={548} width={28} height={18} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <rect x={1180} y={560} width={90} height={30} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <ellipse cx={1225} cy={575} rx={28} ry={9} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <circle cx={1320} cy={470} r={5} fill="none" stroke="rgba(255,205,165,0.45)" strokeWidth={1} strokeDasharray="2 2"/>
      </g>
      <g>
        <rect x={880} y={670} width={180} height={65} rx={8} fill="none" stroke="rgba(255,190,140,0.6)" strokeWidth={1.5}/>
        <rect x={1100} y={660} width={220} height={45} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <rect x={1100} y={660} width={45} height={95} fill="none" stroke="rgba(255,190,140,0.55)" strokeWidth={1.5}/>
        <circle cx={1160} cy={725} r={13} fill="none" stroke="rgba(255,190,140,0.45)" strokeWidth={1}/>
        <rect x={1450} y={655} width={40} height={110} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <line x1={1450} y1={680} x2={1490} y2={680} stroke="rgba(255,190,140,0.35)"/>
        <line x1={1450} y1={705} x2={1490} y2={705} stroke="rgba(255,190,140,0.35)"/>
        <line x1={1450} y1={730} x2={1490} y2={730} stroke="rgba(255,190,140,0.35)"/>
        <circle cx={1000} cy={700} r={5} fill="none" stroke="rgba(255,205,165,0.45)" strokeWidth={1} strokeDasharray="2 2"/>
      </g>
      <g>
        <rect x={778} y={700} width={65} height={14} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
        <rect x={778} y={740} width={65} height={18} fill="none" stroke="rgba(255,190,140,0.5)" strokeWidth={1.5}/>
      </g>
      <g stroke="rgba(255,190,140,0.55)" strokeWidth={1} fontFamily="Arial, sans-serif" fontSize={14} fill="rgba(255,205,165,0.8)">
        <line x1={150} y1={70} x2={770} y2={70}/>
        <line x1={150} y1={60} x2={150} y2={80}/>
        <line x1={770} y1={60} x2={770} y2={80}/>
        <text x={460} y={60} textAnchor="middle">12.40m</text>
        <line x1={850} y1={70} x2={1500} y2={70}/>
        <line x1={850} y1={60} x2={850} y2={80}/>
        <line x1={1500} y1={60} x2={1500} y2={80}/>
        <text x={1175} y={60} textAnchor="middle">13.00m</text>
        <line x1={1540} y1={100} x2={1540} y2={780}/>
        <line x1={1530} y1={100} x2={1550} y2={100}/>
        <line x1={1530} y1={780} x2={1550} y2={780}/>
        <text x={1565} y={440} transform="rotate(90 1565 440)" textAnchor="middle">13.60m</text>
        <line x1={770} y1={830} x2={850} y2={830}/>
        <line x1={770} y1={820} x2={770} y2={840}/>
        <line x1={850} y1={820} x2={850} y2={840}/>
        <text x={810} y={850} textAnchor="middle">1.60m</text>
      </g>
      <g fontFamily="Georgia, serif" fontSize={17} letterSpacing="1.5" fill="rgba(255,205,165,0.85)">
        <text x={200} y={185}>KITCHEN</text>
        <text x={200} y={205} fontSize={11} fontFamily="Arial" letterSpacing="0.5">15.2 m2</text>
        <text x={220} y={420}>LIVING</text>
        <text x={220} y={440} fontSize={11} fontFamily="Arial" letterSpacing="0.5">24.6 m2</text>
        <text x={600} y={470}>DINING</text>
        <text x={600} y={490} fontSize={11} fontFamily="Arial" letterSpacing="0.5">12.8 m2</text>
        <text x={895} y={130}>MASTER BEDROOM</text>
        <text x={895} y={150} fontSize={11} fontFamily="Arial" letterSpacing="0.5">18.4 m2</text>
        <text x={1240} y={150}>EN-SUITE</text>
        <text x={1240} y={310}>CLOSET</text>
        <text x={895} y={450}>BEDROOM 2</text>
        <text x={895} y={470} fontSize={11} fontFamily="Arial" letterSpacing="0.5">11.2 m2</text>
        <text x={1195} y={450}>BATH</text>
        <text x={1350} y={700}>BEDROOM 3 / OFFICE</text>
        <text x={1350} y={720} fontSize={11} fontFamily="Arial" letterSpacing="0.5">13.6 m2</text>
        <text x={790} y={770} fontSize={11} fontFamily="Arial" letterSpacing="0.5">HALL</text>
      </g>
      <g>
        <circle cx={215} cy={720} r={26} fill="none" stroke="rgba(255,205,165,0.5)" strokeWidth={1}/>
        <path d="M215 700 L215 740 M215 700 L208 712 M215 700 L222 712" fill="none" stroke="rgba(255,205,165,0.6)" strokeWidth={1.5}/>
        <text x={215} y={695} textAnchor="middle" fontFamily="Arial, sans-serif" fontSize={12} fill="rgba(255,205,165,0.6)">N</text>
      </g>
      <g fontFamily="Arial, sans-serif" fontSize={12} fill="rgba(255,205,165,0.7)">
        <text x={150} y={808}>PROJECT: RESIDENCE MDR — FOR·LIVING STUDIO</text>
        <text x={150} y={826}>SCALE 1:100 · SHEET A-101 · REV. 03</text>
      </g>
    </svg>
  );
}
