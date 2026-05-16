import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { ChevronRight, ArrowLeft, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import EarbudShowcase from "../components/ui/spatial-product-showcase";
import { PricingWrapper, Heading as CardHeading, Price as CardPrice, Paragraph as CardParagraph } from "../components/ui/animated-pricing-cards";
import { CTASection } from "../components/ui/hero-dithering-card";
import { cn } from "@/lib/utils";

const PROJECTS = [
  {
    title: "Techify Office",
    desc: "Plataforma de gestão e inteligência corporativa da Techify.",
    stack: "Next.js + Tailwind",
    link: "https://techify-office.vercel.app",
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Techify Max",
    desc: "Sistema avançado de automação e escala digital.",
    stack: "React + GSAP",
    link: "https://techify-max.vercel.app",
    image: "https://images.unsplash.com/photo-1551288049-bbdac8a28a1e?q=80&w=2070&auto=format&fit=crop"
  }
];

export default function ProjectsPage() {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20 flex flex-col gap-20">
      <section className="w-full">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors mb-12 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Home
        </Link>

        <div className="flex flex-col md:flex-row items-center justify-between mb-12 px-2 gap-4">
            <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-center md:text-left">{t("projects.title")}</h3>
            <div className="hidden md:block h-[1px] flex-1 bg-white/5 mx-8" />
            <ChevronRight className="text-primary animate-pulse" />
        </div>

        <div className="mb-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 mb-6 font-black italic">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] uppercase tracking-widest text-primary">{t("projects.featured")}</span>
            </div>
            <h4 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-white mb-3 cinema-text-shadow">{t("projects.spatialTitle")}</h4>
            <p className="text-zinc-500 text-xs md:text-sm font-medium uppercase tracking-[0.2em]">{t("projects.spatialSubtitle")}</p>
          </div>
          <EarbudShowcase />
        </div>

        <div className="flex items-center gap-4 mb-12 px-2">
            <div className="h-[1px] flex-1 bg-white/5" />
            <h4 className="text-[10px] font-black italic uppercase tracking-[0.3em] text-white/20 whitespace-nowrap">{t("projects.others")}</h4>
            <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROJECTS.map((project, idx) => (
              <PricingWrapper 
                key={idx} 
                contactHref={project.link} 
                type={idx % 2 === 0 ? 'waves' : 'crosses'}
                color={idx === 0 ? 'bg-primary' : 'bg-white/[0.03]'}
                image={project.image}
                className="max-w-none hover:scale-[1.02] transition-transform duration-500"
              >
                 <CardHeading className={idx === 0 ? 'text-black' : 'text-white'}>
                   {project.title}
                 </CardHeading>
                 <CardPrice className={idx === 0 ? 'text-black/60' : 'text-primary'}>
                   {project.stack}
                 </CardPrice>
                 <CardParagraph className={idx === 0 ? 'text-black/80' : 'text-zinc-200 font-medium'}>
                   {project.desc}
                 </CardParagraph>
                 <div className={cn(
                   "mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest",
                   idx === 0 ? "text-black/40" : "text-primary"
                 )}>
                   <ExternalLink size={12} />
                   Acessar Projeto
                 </div>
              </PricingWrapper>
            ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
}
