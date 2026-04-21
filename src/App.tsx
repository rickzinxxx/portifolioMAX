/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Lenis from "lenis";
import { useTranslation } from "react-i18next";
import "./lib/i18n";
import { 
  Instagram, 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  Menu, 
  X, 
  ArrowUpRight,
  Code2,
  Figma,
  Smartphone,
  Globe,
  Languages,
  ChevronRight,
  ChevronLeft,
  Rocket
} from "lucide-react";
import { NeuralNoise } from "@/components/ui/neural-noise";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BackgroundShaders from "@/components/ui/background-shaders";
import InteractiveNeuralVortex from "@/components/ui/interactive-neural-vortex-background";
import MaximusKningtChat from "@/components/ui/maximus-kningt-chat";
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const STACK = [
  "React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", 
  "MongoDB", "Three.js", "GSAP", "Framer Motion", "Figma"
];

const BIO_LINKS = [
  { title: "Meus Repositórios", icon: Github, link: "https://github.com/rickzinxxx", color: "bg-primary" },
  { title: "Instagram Oficial", icon: Instagram, link: "https://www.instagram.com/rickzinxx_/", color: "bg-white/5" },
  { title: "Contato Direto", icon: Mail, link: "mailto:rickmarketing81@gmail.com", color: "bg-white/5" },
  { title: "Portfólio em Tech", icon: Globe, link: "#", color: "bg-white/5" },
  { title: "Último Lançamento", icon: Rocket, link: "#", color: "bg-white/5" }
];

const ANIM_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full hover:bg-white/5")}>
        <Languages className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-black/90 border-white/10 backdrop-blur-xl">
        <DropdownMenuItem 
          onClick={() => i18n.changeLanguage("pt")}
          className="text-white hover:bg-primary hover:text-black focus:bg-primary focus:text-black cursor-pointer font-bold uppercase text-[10px] tracking-widest"
        >
          PT-BR
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => i18n.changeLanguage("en")}
          className="text-white hover:bg-primary hover:text-black focus:bg-primary focus:text-black cursor-pointer font-bold uppercase text-[10px] tracking-widest"
        >
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default function App() {
  const { t } = useTranslation();
  const [hasEntered, setHasEntered] = useState(false);
  const [isDeveloping, setIsDeveloping] = useState(false);
  const [devTitle, setDevTitle] = useState("");
  
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-black font-sans overflow-x-hidden cursor-default">
      
      {/* Dynamic Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnimatedGradientBackground Breathing={true} animationSpeed={0.015} />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
      </div>

      <AnimatePresence>
        {!hasEntered ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
             {/* Abstract Background */}
             <div className="absolute inset-0 z-0">
                <InteractiveNeuralVortex primaryColor={[1.0, 0.0, 0.1]} />
                <div className="absolute inset-0 bg-black/60" />
             </div>

             {/* Content Overlay */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="relative z-20 text-center px-6 flex flex-col items-center justify-center"
             >
                 <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase mb-4 cinema-text-shadow leading-none">
                    RICK<span className="text-primary">ZINXX</span>
                 </h1>
                 <p className="text-white/40 uppercase tracking-[0.5em] text-[9px] md:text-[10px] mb-12 font-bold font-mono">
                    Alquimista Digital & Dev Criativo
                 </p>
                 
                 <Button 
                    size="lg" 
                    onClick={() => {
                      setHasEntered(true);
                    }}
                    className="group rounded-full px-12 h-16 bg-primary text-black hover:bg-white hover:text-black font-black text-lg transition-all duration-500 shadow-[0_0_60px_rgba(255,40,0,0.25)] hover:scale-105 active:scale-95 mb-4"
                 >
                    ENTRAR NA EXPERIÊNCIA
                 </Button>

                 <div className="flex items-center gap-2 mt-6 opacity-20 group cursor-default">
                    <div className="w-12 h-[1px] bg-white transition-all group-hover:w-20" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Est. 2026</span>
                    <div className="w-12 h-[1px] bg-white transition-all group-hover:w-20" />
                 </div>
             </motion.div>
          </motion.div>
        ) : (
          <motion.main 
            key="content"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20 flex flex-col items-center"
          >
            {/* Header / Brand */}
            <div className="w-full flex justify-between items-center mb-16">
               <div className="text-sm font-black italic tracking-tighter">RICK<span className="text-primary uppercase">Zinxx</span></div>
               <LanguageSwitcher />
            </div>

            {/* Main Content Info */}
            <div className="pt-10 pb-20 text-center">
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 leading-[0.9]">
                   Desenvolvedor <span className="text-primary underline decoration-4 underline-offset-[12px]">Criativo</span>
                </h2>
                <p className="text-white/50 text-sm md:text-lg max-w-sm mx-auto font-medium leading-relaxed mb-8">
                   Criando experiências digitais de alto nível com Maximus Kningt.
                </p>
                
                <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                   {STACK.map((tag) => (
                      <span key={tag} className="text-[10px] font-black uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full bg-white/5 text-white/40">
                         {tag}
                      </span>
                   ))}
                </div>
            </div>

            {/* Links Section */}
            <div className="w-full flex flex-col gap-4 mb-24">
              <div className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 ml-2 mb-2">Conectar & Explorar</div>
              {BIO_LINKS.map((link, i) => (
                <motion.button
                  key={i}
                  onClick={() => {
                    if (link.link === "#") {
                      setDevTitle(link.title);
                      setIsDeveloping(true);
                    } else {
                      window.open(link.link, "_blank");
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ x: 10 }}
                  className={cn(
                    "group flex items-center justify-between p-6 rounded-3xl border transition-all duration-500 backdrop-blur-xl text-left w-full",
                    link.color === "bg-primary" 
                      ? "bg-primary text-black border-transparent shadow-[0_20px_40px_rgba(255,40,0,0.1)]" 
                      : "bg-white/[0.03] border-white/[0.05] hover:bg-white/[0.08] hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "p-3 rounded-2xl transition-all duration-500",
                      link.color === "bg-primary" ? "bg-black/10" : "bg-white/5 group-hover:bg-primary/20 group-hover:text-primary"
                    )}>
                      <link.icon size={22} />
                    </div>
                    <span className="font-black uppercase tracking-tighter text-base md:text-lg">{link.title}</span>
                  </div>
                  <ArrowUpRight size={20} className="text-white/20 group-hover:text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </motion.button>
              ))}
            </div>

            {/* AI Experience Section */}
            <div className="w-full mb-24 overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02]">
               <div className="p-8 pb-0">
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Conheça <span className="text-primary italic">Maximus Kningt</span></h3>
                  <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-6 leading-relaxed">
                    Minha inteligência artificial personalizada que faz de tudo — de código a design. Explore agora.
                  </p>
               </div>
               
               <MaximusKningtChat />
            </div>

            {/* Simple Footer */}
            <footer className="w-full text-center pb-12">
               <div className="flex justify-center gap-10 mb-12">
                  <a href="https://www.instagram.com/rickzinxx_/" target="_blank" className="text-white/20 hover:text-primary transition-all scale-125"><Instagram size={24} /></a>
                  <a href="https://github.com/rickzinxxx" target="_blank" className="text-white/20 hover:text-primary transition-all scale-125"><Github size={24} /></a>
                  <a href="mailto:rickmarketing81@gmail.com" className="text-white/20 hover:text-primary transition-all scale-125"><Mail size={24} /></a>
               </div>
               <div className="text-[10px] font-black text-white/20 tracking-[0.5em] uppercase mb-1">
                 © 2026 RICKZINXX
               </div>
               <div className="text-[8px] font-black text-primary/40 uppercase tracking-widest italic">
                 Arte Digital Feita à Mão
               </div>
            </footer>

          </motion.main>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeveloping && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] overflow-hidden p-8 text-center"
            >
              <div className="absolute inset-0 z-0 opacity-40">
                <AnimatedGradientBackground Breathing={true} startingGap={150} animationSpeed={0.03} />
              </div>
              
              <div className="relative z-10">
                <div className="w-48 h-48 mx-auto mb-6">
                  <DotLottieReact
                    src="https://lottie.host/8cf4ba71-e5fb-44f3-8134-178c4d389417/0CCsdcgNIP.json"
                    loop
                    autoplay
                  />
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{devTitle}</h3>
                <p className="text-sm font-bold text-white/40 uppercase tracking-widest mb-8">
                  EM DESENVOLVIMENTO
                </p>
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-relaxed">
                    Estamos moldando esta experiência para ser absoluta. Volte em breve para ver o resultado do Maximus Kningt.
                  </p>
                </div>
                <Button 
                  onClick={() => setIsDeveloping(false)}
                  variant="ghost" 
                  className="mt-8 rounded-full font-black text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white"
                >
                  Fechar [ESC]
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        body { --primary-rgb: 255, 40, 0; }
        ::selection { background: rgba(var(--primary-rgb), 0.9); color: black; }
        .cinema-text-shadow { text-shadow: 0 0 30px rgba(255, 40, 0, 0.5); }
      `}</style>
    </div>
  );
}
