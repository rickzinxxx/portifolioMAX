import { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { Code2, ChevronRight, Palette, Laptop, Sparkles, Cpu, Layers, GitBranch, Terminal, Camera } from "lucide-react";
import BlurTextAnimation from "../components/ui/blur-text-animation";
import { useAvatar } from "../lib/useAvatar";
import AvatarUploadModal from "../components/ui/AvatarUploadModal";

const SKILLS = [
  { name: "HTML5", icon: Layers, desc: "Estruturação semântica e acessível" },
  { name: "CSS3", icon: Palette, desc: "Layouts modernos, Grid e Flexbox" },
  { name: "JavaScript", icon: Terminal, desc: "ES6+, assincronismo e manipulação de DOM" },
  { name: "React", icon: Cpu, desc: "SPA, Hooks, Context API e State Management" },
  { name: "SASS / Tailwind", icon: Laptop, desc: "Estilização avançada e design atômico" },
  { name: "Git", icon: GitBranch, desc: "Controle de versão e trabalho colaborativo" },
  { name: "NPM / Node", icon: Code2, desc: "Gerenciamento de pacotes e ferramentas de build" },
  { name: "Responsivo", icon: Sparkles, desc: "Mobile-first e adaptações multi-resolução" }
];

export default function AboutPage() {
  const { t } = useTranslation();
  const { avatarUrl } = useAvatar();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20 flex flex-col gap-12">
      {/* Title */}
      <div className="flex flex-col md:flex-row items-center justify-between px-2 gap-4">
        <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-center md:text-left">
          {t("nav.sobre")}
        </h3>
        <div className="hidden md:block h-[1px] flex-1 bg-white/5 mx-8" />
        <Code2 className="text-primary animate-pulse w-8 h-8" />
      </div>

      {/* Main Content Info */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        {/* Left Side: Avatar frame with real user photo (Rickzinxx visual brand) */}
        <div className="md:col-span-4 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-48 h-48 md:w-64 md:h-64 rounded-full p-1 bg-gradient-to-tr from-primary to-orange-500 shadow-[0_0_50px_rgba(255,40,0,0.3)] group overflow-hidden cursor-pointer"
            onClick={() => setIsUploadOpen(true)}
            title="Clique para anexar foto manualmente"
          >
            <div className="w-full h-full rounded-full bg-black/90 flex flex-col items-center justify-center relative overflow-hidden text-center">
              <img 
                src={avatarUrl} 
                alt="Rickzinxx" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Sophiaticated interactive text on hover */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center p-4">
                <Camera className="w-8 h-8 text-primary mb-1 animate-pulse" />
                <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-300 font-bold">Mudar Foto</span>
                <span className="font-sans font-black text-xs uppercase text-white mt-1">Painel Admin</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Bio details */}
        <div className="md:col-span-8 flex flex-col gap-6 text-zinc-300 text-left">
          <BlurTextAnimation 
            text="Sou um Desenvolvedor Frontend apaixonado por criar interfaces web intuitivas e responsivas. Minha especialidade é transformar designs em código de alta performance, unindo estética e velocidade para garantir a melhor experiência para o usuário."
            highlightWords={["Desenvolvedor", "Frontend"]}
            fontSize="text-base md:text-lg"
            textColor="text-zinc-300"
            once={true}
          />

          <BlurTextAnimation 
            text="Com experiência em projetos freelancer e corporativos, domino as principais tecnologias frontend do mercado. Entendo a fundo os pilares de performance (Core Web Vitals), modularização de componentes React e criação de fluxos limpos de código com tipagem estrita de dados."
            highlightWords={["performance", "Core", "Web", "Vitals"]}
            fontSize="text-sm md:text-base"
            textColor="text-zinc-400"
            once={true}
          />

          <BlurTextAnimation 
            text="Meu foco principal é construir soluções eficientes que impactem positivamente as marcas dos meus clientes, seguindo à risca as melhores práticas de SEO, acessibilidade e design responsivo mobile-first."
            highlightWords={["SEO", "acessibilidade", "mobile-first"]}
            fontSize="text-sm md:text-base"
            textColor="text-zinc-400"
            once={true}
          />
        </div>
      </div>

      {/* Technologies Section */}
      <div className="mt-8 flex flex-col gap-8">
        <div>
          <h4 className="text-lg font-black uppercase tracking-widest text-white mb-2 italic">
            Tecnologias que Utilizo
          </h4>
          <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">Meu Tech Stack e Ferramentas Diárias</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {SKILLS.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5, borderColor: "rgba(255, 40, 0, 0.3)" }}
              className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col gap-3 group transition-all duration-300 text-left"
            >
              <div className="p-2.5 rounded-2xl bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-colors text-zinc-400 self-start">
                <skill.icon className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-black italic uppercase tracking-wider text-white text-sm">
                  {skill.name}
                </h5>
                <p className="text-zinc-500 text-[10px] font-semibold tracking-wide mt-1 uppercase">
                  {skill.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AvatarUploadModal 
        isOpen={isUploadOpen} 
        onClose={() => setIsUploadOpen(false)} 
        onSuccess={() => {}} 
      />
    </div>
  );
}
