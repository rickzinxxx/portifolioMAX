import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  pt: {
    translation: {
      intro: {
        experience: "Experiência",
        cinematicPhrases: [
          "Seja bem vindo ao portifolio do rickzinxx",
          "E da nossa empresa Techify",
          "Fizemos o designer a mao",
          "Temos 5 anos de mercado",
          "Seja bem vindo ao melhor melhor site que voce ja viu"
        ],
        slides: [
          {
            title: "Seja bem vindo ao portfólio de Marcos Henrique",
            subtitle: "Onde a estética encontra o impossível.",
            button: "Prosseguir"
          },
          {
            title: "Uma Nova Dimensão",
            subtitle: "Interfaces construídas com precisão cinematográfica.",
            button: "Descobrir"
          },
          {
            title: "Pronto para a Experiência?",
            subtitle: "Aperte o cinto para entrar no meu universo.",
            button: "ESTOU PRONTO"
          }
        ]
      },
      nav: {
        about: "Sobre",
        stack: "Stack",
        projects: "Projetos",
        contact: "Contato",
        sayHello: "DIGA OLÁ"
      },
      hero: {
        badge: "Desenvolvedor Criativo — 2026",
        title1: "Alquimista",
        title2: "Digital",
        subtitle: "Transcende as fronteiras da web moderna através de engenharia de software de alta performance e estética cinematográfica.",
        ctaStart: "INICIAR PROJETO",
        ctaWorks: "VER MEUS TRABALHOS",
        scrollDown: "Role para baixo"
      },
      about: {
        origins: "01 — Origens",
        title1: "Além dos",
        title2: "Pixels.",
        description: "Eu não apenas construo sites; eu moldo legados digitais. Cada projeto é um experimento para empurrar os limites do que é possível no navegador.",
        stats: {
          realized: "Realizados",
          impact: "Impacto",
          vision: "Visão",
          aura: "Aura",
          impactVal: "Alto",
          visionVal: "4K",
          auraVal: "Neon"
        }
      },
      projects: {
        label: "02 — Trabalhos Selecionados",
        title1: "Odisseia",
        title2: "Visual.",
        description: "Uma coleção de experiências de alta fidelidade projetadas para dominar o cenário digital.",
        card: {
          role: "Papel",
          explore: "Explorar",
          caseStudy: "Estudo de Caso",
          description: "Desenvolvimento técnico e implementação arquitetônica de ambientes web de alta conversão."
        }
      },
      contact: {
        title: "Acenda sua\nVisão.",
        cta: "INICIAR COLAB",
        footer: {
          built: "CONSTRUÍDO PARA EXCELÊNCIA",
          privacy: "Política de Privacidade",
          cookies: "Cookies"
        }
      }
    }
  },
  en: {
    translation: {
      intro: {
        experience: "Experience",
        cinematicPhrases: [
          "Welcome to rickzinxx's portfolio",
          "And to our company, Techify",
          "We crafted the design by hand",
          "We've been in the market for 5 years",
          "Welcome to the best best site you've ever seen"
        ],
        slides: [
          {
            title: "Welcome to Marcos Henrique's portfolio",
            subtitle: "Where aesthetics meets the impossible.",
            button: "Proceed"
          },
          {
            title: "A New Dimension",
            subtitle: "Interfaces built with cinematic precision.",
            button: "Discover"
          },
          {
            title: "Ready for the Experience?",
            subtitle: "Fasten your seatbelt to enter my universe.",
            button: "I'M READY"
          }
        ]
      },
      nav: {
        about: "About",
        stack: "Stack",
        projects: "Projects",
        contact: "Contact",
        sayHello: "SAY HELLO"
      },
      hero: {
        badge: "Creative Developer — 2026",
        title1: "Digital",
        title2: "Alchemist",
        subtitle: "Transcending the boundaries of the modern web through high-performance software engineering and cinematic aesthetics.",
        ctaStart: "START THE PROJECT",
        ctaWorks: "SEE MY WORKS",
        scrollDown: "scroll down"
      },
      about: {
        origins: "01 — Origins",
        title1: "Beyond",
        title2: "Pixels.",
        description: "I don't just build websites; I craft digital legacies. Each project is an experiment in pushing the limits of what's possible in the browser.",
        stats: {
          realized: "Realized",
          impact: "Impact",
          vision: "Vision",
          aura: "Aura",
          impactVal: "High",
          visionVal: "4K",
          auraVal: "Neon"
        }
      },
      projects: {
        label: "02 — Selected Works",
        title1: "Visual",
        title2: "Odyssey.",
        description: "A collection of high-fidelity experiences designed to dominate the digital landscape.",
        card: {
          role: "Role",
          explore: "Explore",
          caseStudy: "Case Study",
          description: "Technical development and architectural implementation of high-converting web environments."
        }
      },
      contact: {
        title: "Ignite Your\nVision.",
        cta: "START COLLAB",
        footer: {
          built: "BUILT FOR EXCELLENCE",
          privacy: "Privacy Policy",
          cookies: "Cookies"
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "pt",
    fallbackLng: "pt",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
