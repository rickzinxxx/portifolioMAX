import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Rocket, ArrowUpRight, ChevronRight, ShieldAlert, Globe, Code2 } from "lucide-react";
import { ShaderButton } from "../components/ui/shader-button";
import { pricingVariants } from "../components/ui/animated-pricing-cards";
import { cn } from "@/lib/utils";
import LandingPage from "../components/ui/landing-page";
import { Link } from "react-router-dom";

const STACK = [
  "React", "Next.js", "Three.js", "GSAP", "Tailwind CSS", "Node.js", 
  "TypeScript", "Framer Motion", "MongoDB", "Figma"
];

const BIO_LINKS = [
  { title: "WhatsApp Business", icon: Rocket, link: "https://wa.me/558199130885", color: "bg-primary text-black" },
  { title: "Instagram Oficial", icon: Globe, link: "https://www.instagram.com/rickzinxx_/", color: "bg-white/5" },
  { title: "LinkedIn Pro", icon: Globe, link: "#", color: "bg-white/5" },
  { title: "Projetos", icon: Code2, link: "/projects", color: "bg-white/5", internal: true },
];

export default function HomePage({ isMobile }: { isMobile: boolean }) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto px-6 pt-20 flex flex-col items-center gap-20">
      {/* Parte 2: Conexão & Negócios */}
      <section className="w-full max-w-2xl">
        <div className="text-center mb-10">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 leading-[0.9] cinema-text-shadow">
               {t("hero.title")}<span className="text-primary">{t("hero.titleSuffix")}</span>
            </h2>
            <p className="text-zinc-200 text-sm md:text-lg max-w-sm mx-auto font-medium leading-relaxed mb-10 drop-shadow-sm">
               {t("hero.subtitle")}
            </p>

            <ShaderButton
               lightMode={isMobile}
               onClick={() => window.open("https://wa.me/558199130885", "_blank")}
               className="w-full text-white font-black text-xl italic uppercase py-6 shadow-[0_20px_50px_rgba(255,40,0,0.3)] mb-4 flex items-center justify-center gap-3"
            >
               <Rocket size={24} fill="currentColor" />
               {t("hero.cta")}
            </ShaderButton>
            <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
               {t("hero.subtext")}
            </div>
        </div>

        <div className="flex flex-col gap-3">
            {BIO_LINKS.map((link, i) => (
            link.internal ? (
              <Link key={i} to={link.link} className="w-full group">
                <div className={cn(
                  "flex items-center justify-between p-4 border transition-all duration-500 bg-black/40 border-white/[0.05] hover:border-primary/20 text-white/40 hover:text-white rounded-[2rem] mb-3"
                )}>
                   <div className="flex items-center gap-5">
                      <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-primary/20 transition-colors">
                         <link.icon size={20} />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">{link.title}</span>
                   </div>
                   <ArrowUpRight size={18} className="text-white/60 group-hover:text-white group-hover:opacity-100 transition-all opacity-100" />
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
                        link.color.includes("bg-primary") ? "bg-white/10" : "bg-white/5 group-hover:bg-primary/20 transition-colors"
                      )}>
                         <link.icon size={20} />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest text-white/90 group-hover:text-white transition-colors">{link.title}</span>
                   </div>
                   <ArrowUpRight size={18} className="text-white/60 group-hover:text-white group-hover:opacity-100 transition-all opacity-100" />
                </div>
              </ShaderButton>
            )
          ))}
        </div>
      </section>

      {/* Part 5: Por que sou o melhor desenvolvedor */}
      <section className="w-full mt-20">
         <div className="flex flex-col md:flex-row items-center justify-between mb-8 px-2 gap-4">
             <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-center md:text-left">Supremacia Técnica</h3>
             <div className="hidden md:block h-[1px] flex-1 bg-white/5 mx-8" />
             <Code2 className="text-primary" />
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { 
                title: "Arquitetura Limpa", 
                desc: "Codebase construído para escala extrema. Baixo acoplamento, alta coesão e 100% de segurança de tipos.",
                icon: ShieldAlert
              },
              { 
                title: "Performance Primeiro", 
                desc: "WebGL otimizado, tamanho mínimo de bundle e pontuações 100/100 no Lighthouse em todos os projetos.",
                icon: Rocket
              },
              { 
                title: "Escala Global", 
                desc: "Sistemas multilíngues atendendo milhares de usuários mensalmente com tempo de inatividade zero.",
                icon: Globe
              }
            ].map((card, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-all duration-500 group text-center md:text-left flex flex-col items-center md:items-start text-white">
                 <card.icon className="w-10 h-10 text-primary mb-6 transition-transform group-hover:scale-110" />
                 <h4 className="text-lg font-black italic uppercase tracking-tighter mb-4 text-white group-hover:text-primary transition-colors">{card.title}</h4>
                 <p className="text-sm text-zinc-400 font-medium leading-relaxed">{card.desc}</p>
              </div>
            ))}
         </div>

         <div className="mt-8 p-12 rounded-[3rem] bg-gradient-to-br from-primary/10 to-transparent border border-primary/10 relative overflow-hidden group flex flex-col items-center md:items-start text-center md:text-left">
            <div className="absolute top-0 right-0 p-8 opacity-10 transition-transform group-hover:rotate-12 pointer-events-none text-white">
               <Code2 size={200} />
            </div>
            <div className="relative z-10 max-w-xl flex flex-col items-center md:items-start text-white">
               <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-6 font-black italic uppercase tracking-widest text-primary">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px]">Master Developer Elite</span>
               </div>
               <h4 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-6 leading-none">
                  Eu transformo problemas complexos em <span className="text-primary">armas digitais perfeitas.</span>
               </h4>
               <p className="text-zinc-200 text-sm md:text-base font-medium leading-relaxed mb-8 drop-shadow-sm">
                  Não sou apenas mais um desenvolvedor. Sou um arquiteto de escalabilidade digital. Meus sistemas não apenas funcionam — eles dominam. De shaders pixel-perfect a infraestruturas de backend blindadas, entrego a "Vantagem Desleal" para o seu negócio.
               </p>
               <ShaderButton 
                 onClick={() => window.open("https://wa.me/558199130885", "_blank")}
                 className="px-10 py-5 text-white font-black italic uppercase text-sm"
               >
                  Contrate O Melhor
               </ShaderButton>
            </div>
         </div>
      </section>

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
