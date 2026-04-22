import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  pt: {
    translation: {
      intro: {
        experience: "Experiência",
        cinematicPhrases: [
          "Seja bem vindo ao portfólio do rickzinxx",
          "E da nossa empresa Techify",
          "Fizemos o design à mão",
          "Temos 5 anos de mercado",
          "O melhor site que você já viu"
        ]
      },
      nav: {
        brand: "MARCOS",
        brandSuffix: " Henrique",
        language: "Idioma"
      },
      hero: {
        title: "Engenharia de",
        titleSuffix: " Software",
        subtitle: "Elevando marcas através de tecnologias 3D e interfaces de alto impacto com a Techify.",
        cta: "🚀 Iniciar um Projeto",
        subtext: "Consultoria Técnica & Desenvolvimento Premium"
      },
      dev: {
        title: "EM DESENVOLVIMENTO",
        description: "Estamos moldando esta experiência para ser absoluta. Volte em breve para ver o resultado.",
        close: "Fechar [ESC]"
      },
      projects: {
        title: "Projetos Techify"
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
          "5 years of experience",
          "The best site you've ever seen"
        ]
      },
      nav: {
        brand: "MARCOS",
        brandSuffix: " Henrique",
        language: "Language"
      },
      hero: {
        title: "Software",
        titleSuffix: " Engineering",
        subtitle: "Elevating brands through 3D technologies and high-impact interfaces with Techify.",
        cta: "🚀 Start a Project",
        subtext: "Technical Consulting & Premium Development"
      },
      dev: {
        title: "UNDER DEVELOPMENT",
        description: "We are shaping this experience to be absolute. Come back soon to see the result.",
        close: "Close [ESC]"
      },
      projects: {
        title: "Techify Projects"
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
