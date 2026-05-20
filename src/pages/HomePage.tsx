import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Rocket, ArrowUpRight, Globe, Code2, ShieldAlert, Sparkles, Star } from "lucide-react";
import { ShaderButton } from "../components/ui/shader-button";
import { cn } from "@/lib/utils";
import LandingPage from "../components/ui/landing-page";
import { Link } from "react-router-dom";
import { ParticleText } from "../components/ui/particle-text";

const STACK = [
  "React", "HTML5", "CSS3", "JavaScript", "Next.js", "Three.js", "GSAP", 
  "Tailwind CSS", "SASS", "Node.js", "TypeScript", "Framer Motion", "Git"
];

export default function HomePage({ isMobile }: { isMobile: boolean }) {
  const { t } = useTranslation();
  const [typedText, setTypedText] = useState("");
  const [statProjects, setStatProjects] = useState(0);
  const [statClients, setStatClients] = useState(0);
  const [statExperience, setStatExperience] = useState(0);

  // Typing effect
  useEffect(() => {
    const occupations = [
      "Desenvolvedor Frontend",
      "Especialista em React",
      "UI Developer",
      "JavaScript Developer"
    ];
    let occupationIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let timer: NodeJS.Timeout;

    const handleType = () => {
      const current = occupations[occupationIndex];
      if (isDeleting) {
        setTypedText(current.substring(0, charIndex - 1));
        charIndex--;
        typingSpeed = 50;
      } else {
        setTypedText(current.substring(0, charIndex + 1));
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === current.length) {
        isDeleting = true;
        typingSpeed = 1500; // Pause at the end
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        occupationIndex = (occupationIndex + 1) % occupations.length;
        typingSpeed = 600; // Pause before starting next word
      }

      timer = setTimeout(handleType, typingSpeed);
    };

    timer = setTimeout(handleType, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Stats counting animation on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const intervalTime = 30;
    const steps = duration / intervalTime;

    let step = 0;
    const projectIncrement = 10 / steps;
    const clientIncrement = 5 / steps;
    const expIncrement = 3 / steps;

    const timer = setInterval(() => {
      step++;
      setStatProjects(prev => (prev < 10 ? Math.min(10, Math.ceil(prev + projectIncrement)) : 10));
      setStatClients(prev => (prev < 5 ? Math.min(5, Math.ceil(prev + clientIncrement)) : 5));
      setStatExperience(prev => (prev < 3 ? Math.min(3, Math.ceil(prev + expIncrement)) : 3));

      if (step >= steps) {
        setStatProjects(10);
        setStatClients(5);
        setStatExperience(3);
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  const BIO_LINKS = [
    { title: "WhatsApp Profissional", icon: Rocket, link: "https://wa.me/5581999130885", color: "bg-primary text-black" },
    { title: "Instagram Oficial", icon: Globe, link: "https://www.instagram.com/rickzinxx_/", color: "bg-white/5" },
    { title: "Meus Projetos", icon: Code2, link: "/projects", color: "bg-white/5", internal: true },
    { title: "Sobre Mim", icon: Star, link: "/about", color: "bg-white/5", internal: true },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-20 flex flex-col items-center gap-20">
      {/* Hero Section */}
      <section className="w-full max-w-2xl">
        <div className="text-center mb-10">
          {/* Accent Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-6 font-mono text-[10px] font-black uppercase tracking-widest text-primary">
            <Sparkles size={10} className="animate-spin" />
            <span>DISPONÍVEL PARA NOVOS PROJETOS</span>
          </div>

          {/* Hero Heading with ParticleText and glowing effect */}
          <div className="flex flex-col items-center justify-center mb-6 overflow-visible select-none">
            <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none mb-1">
              {t("hero.title")}
            </h2>
            <ParticleText 
              text="RICKZINXX"
              fontFamily="Inter, Montserrat, sans-serif"
              particleSize={0.06}
              animationSpeed={1.8}
              mouseForce={180}
              interactionMode="repel"
            />
          </div>

          {/* Typing Subtitle */}
          <div className="h-8 mb-6 flex items-center justify-center">
            <span className="font-mono text-xs md:text-sm font-black uppercase tracking-widest text-primary/95 border-r-2 border-primary animate-pulse pr-1">
              {typedText}
            </span>
          </div>

          <p className="text-zinc-300 text-sm md:text-base max-w-lg mx-auto font-medium leading-relaxed mb-10 drop-shadow-sm">
            {t("hero.subtitle")}
          </p>

          <ShaderButton
            lightMode={isMobile}
            onClick={() => window.open("https://wa.me/5581999130885", "_blank")}
            className="w-full text-white font-black text-xl italic uppercase py-6 shadow-[0_20px_50px_rgba(255,40,0,0.3)] mb-4 flex items-center justify-center gap-3"
          >
            <Rocket size={24} fill="currentColor" />
            {t("hero.cta")}
          </ShaderButton>
          
          <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50 mt-4">
            {t("hero.subtext")}
          </div>
        </div>

        {/* Stats Section with sleek visual board */}
        <div className="grid grid-cols-3 gap-4 border border-white/5 bg-white/[0.01] p-6 rounded-[2rem] mb-12">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black italic text-primary">{statProjects}</div>
            <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Projetos</div>
          </div>
          <div className="text-center border-x border-white/5">
            <div className="text-3xl md:text-4xl font-black italic text-primary">{statClients}</div>
            <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Clientes</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-black italic text-primary">{statExperience}</div>
            <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold mt-1">Anos Exp</div>
          </div>
        </div>

        {/* Action Link List */}
        <div className="flex flex-col gap-3">
          {BIO_LINKS.map((link, i) => (
            link.internal ? (
              <Link key={i} to={link.link} className="w-full group">
                <div className={cn(
                  "flex items-center justify-between p-4 border transition-all duration-500 bg-black/40 border-white/[0.05] hover:border-primary/20 text-white/40 hover:text-white rounded-[2rem]"
                )}>
                  <div className="flex items-center gap-5">
                    <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-primary/20 transition-colors text-zinc-300 group-hover:text-primary">
                      <link.icon size={20} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-zinc-300 group-hover:text-white transition-colors">{link.title}</span>
                  </div>
                  <ArrowUpRight size={18} className="text-zinc-500 group-hover:text-white group-hover:opacity-100 transition-all opacity-100" />
                </div>
              </Link>
            ) : (
              <ShaderButton
                key={i}
                lightMode={isMobile}
                onClick={() => window.open(link.link, "_blank")}
                className="w-full group"
              >
                <div className={cn(
                  "flex items-center justify-between p-4 border transition-all duration-500",
                  link.color.includes("bg-primary")
                    ? "bg-transparent text-white border-transparent"
                    : "bg-black/40 border-white/[0.05] hover:border-primary/20 text-white/40 hover:text-white"
                )}>
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "p-3 rounded-2xl",
                      link.color.includes("bg-primary") ? "bg-white/10" : "bg-white/5 group-hover:bg-primary/20 transition-colors text-zinc-300 group-hover:text-primary"
                    )}>
                      <link.icon size={20} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-widest text-zinc-200 group-hover:text-white transition-colors">{link.title}</span>
                  </div>
                  <ArrowUpRight size={18} className="text-zinc-500 group-hover:text-white group-hover:opacity-100 transition-all opacity-100" />
                </div>
              </ShaderButton>
            )
          ))}
        </div>
      </section>

      {/* Technical Supremacy Cards */}
      <section className="w-full mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-2 gap-4">
          <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-center md:text-left text-white">Diferenciais Técnicos</h3>
          <div className="hidden md:block h-[1px] flex-1 bg-white/5 mx-8" />
          <Code2 className="text-primary w-6 h-6" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { 
              title: "Código Clean-Code", 
              desc: "Projetos construídos seguindo estritamente as diretrizes de manutenibilidade, Clean Code e tipagem 100% robusta.",
              icon: ShieldAlert
            },
            { 
              title: "Otimização de Performance", 
              desc: "Tempo mínimo de bundle, imagens modernas otimizadas e renderizações fluidas de 60fps usando componentes leves.",
              icon: Rocket
            },
            { 
              title: "Foco na Experiência", 
              desc: "Interfaces desenhadas para prender a atenção do usuário com micro-interações responsivas excelentes.",
              icon: Globe
            }
          ].map((card, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white/[0.01]/70 border border-white/5 hover:border-primary/20 transition-all duration-500 group text-center md:text-left flex flex-col items-center md:items-start text-white">
              <card.icon className="w-10 h-10 text-primary mb-6 transition-transform group-hover:scale-110" />
              <h4 className="text-lg font-black italic uppercase tracking-tighter mb-4 text-white group-hover:text-primary transition-colors">{card.title}</h4>
              <p className="text-sm text-zinc-400 font-medium leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Central Pro Highlight Banner */}
        <div className="mt-8 p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 relative overflow-hidden group flex flex-col items-center md:items-start text-center md:text-left">
          <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:rotate-12 pointer-events-none text-white">
            <Code2 size={200} />
          </div>
          <div className="relative z-10 max-w-xl flex flex-col items-center md:items-start text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-6 font-black italic uppercase tracking-widest text-primary">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px]">Frontend Developer Elite</span>
            </div>
            <h4 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-6 leading-none">
              Transformando códigos complexos em <span className="text-primary">interfaces digitais impecáveis.</span>
            </h4>
            <p className="text-zinc-300 text-sm md:text-base font-medium leading-relaxed mb-8 drop-shadow-sm">
              Não se trata apenas de alinhar elementos ou carregar componentes. Trata-se de craft conceitual e fluidez extrema no navegador. Com foco total no ecossistema Javascript e React, entrego sites rápidos, responsivos e acessíveis de verdade.
            </p>
            <ShaderButton 
              onClick={() => window.open("https://wa.me/5581999130885", "_blank")}
              className="px-10 py-5 text-white font-black italic uppercase text-sm"
            >
              Falar com Rickzinxx
            </ShaderButton>
          </div>
        </div>
      </section>

      {/* Infinite stack loop banner style */}
      <div className="mt-20 border-y border-white/5 py-12 overflow-hidden relative w-full">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-10 whitespace-nowrap items-center w-max"
        >
          {[...STACK, ...STACK].map((skill, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_10px_rgba(255,40,0,0.5)]" />
              <span className="text-3xl font-black italic uppercase tracking-tighter text-white/40 hover:text-white transition-colors cursor-default">
                {skill}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <section className="w-full mt-20 relative">
        <LandingPage />
      </section>
    </div>
  );
}
