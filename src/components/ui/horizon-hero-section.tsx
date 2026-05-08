import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

export const HorizonHeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });
  
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 3;
  
  const threeRefs = useRef<{
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    composer: EffectComposer | null;
    stars: THREE.Points[];
    nebula: THREE.Mesh | null;
    mountains: THREE.Mesh[];
    animationId: number | null;
    targetCameraX?: number;
    targetCameraY?: number;
    targetCameraZ?: number;
    locations?: number[];
  }>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null
  });

  // Initialize Three.js
  useEffect(() => {
    const initThree = () => {
      const { current: refs } = threeRefs;
      
      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x050000, 0.0008); // Dark Red fog

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      // Renderer
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current!,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 1.0;


      // Post-processing
      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,
        0.4,
        0.85
      );
      refs.composer.addPass(bloomPass);

      // Create scene elements
      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();
      
      // Get initial mountain positions
      const locations: number[] = [];
      refs.mountains.forEach((mountain, i) => {
        locations[i] = mountain.position.z;
      });
      refs.locations = locations;

      // Start animation
      animate();
      
      setIsReady(true);
    };

    const createStarField = () => {
      const { current: refs } = threeRefs;
      const starCount = 5000;
      
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const colorChoice = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.9 + Math.random() * 0.1);
          } else {
            color.setHSL(0, 1.0, 0.6); // Pure Red stars
          }

          
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene!.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const { current: refs } = threeRefs;
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0xff0000) }, // Brand Red
          color2: { value: new THREE.Color(0x330000) }, // Deep Dark Red
          opacity: { value: 0.3 }
        },

        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      refs.scene!.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const { current: refs } = threeRefs;
      const layers = [
        { distance: -50, height: 60, color: 0x100500, opacity: 1 },
        { distance: -100, height: 80, color: 0x1a0805, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x25100a, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x301510, opacity: 0.4 }
      ];

      layers.forEach((layer) => {
        const points = [];
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y = Math.sin(i * 0.1) * layer.height + 
                   Math.sin(i * 0.05) * layer.height * 0.5 +
                   Math.random() * layer.height * 0.2 - 100;
          points.push(new THREE.Vector2(x, y));
        }
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance };
        refs.scene!.add(mountain);
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = () => {
      const { current: refs } = threeRefs;
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(1.0, 0.0, 0.0) * intensity;
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            gl_FragColor = vec4(atmosphere, intensity * 0.4);
          }
        `,

        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene!.add(atmosphere);
    };

    const animate = () => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.stars.forEach((starField) => {
        if (starField.material instanceof THREE.ShaderMaterial) {
          starField.material.uniforms.time.value = time;
        }
      });

      if (refs.nebula && refs.nebula.material instanceof THREE.ShaderMaterial) {
        refs.nebula.material.uniforms.time.value = time * 0.5;
      }

      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * smoothingFactor;
        
        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;
        
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      refs.mountains.forEach((mountain, i) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + (Math.cos(time * 0.15) * 1 * parallaxFactor);
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    initThree();

    const handleResize = () => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      const { current: refs } = threeRefs;
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener('resize', handleResize);
      refs.stars.forEach(starField => {
        starField.geometry.dispose();
        (starField.material as THREE.Material).dispose();
      });
      refs.mountains.forEach(mountain => {
        mountain.geometry.dispose();
        (mountain.material as THREE.Material).dispose();
      });
      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        (refs.nebula.material as THREE.Material).dispose();
      }
      if (refs.renderer) refs.renderer.dispose();
    };
  }, []);

  // GSAP Animations
  useEffect(() => {
    if (!isReady) return;
    
    const targets = [titleRef.current, subtitleRef.current, scrollProgressRef.current].filter(Boolean);
    if (targets.length > 0) {
      gsap.set(targets, {
        visibility: 'visible'
      });
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      if (titleRef.current) {
        const titleChars = titleRef.current.querySelectorAll('.title-char');
        if (titleChars.length > 0) {
          tl.from(titleChars, {
            y: 200,
            opacity: 0,
            duration: 1.5,
            stagger: 0.05,
            ease: "power4.out"
          });
        }
      }

      if (subtitleRef.current) {
        const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
        if (subtitleLines.length > 0) {
          tl.from(subtitleLines, {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
          }, titleRef.current ? "-=0.8" : 0);
        }
      }

      if (scrollProgressRef.current) {
        tl.from(scrollProgressRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power2.out"
        }, "-=0.5");
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [isReady]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const maxScroll = documentHeight - windowHeight;
      const progress = Math.min(scrollY / (maxScroll || 1), 1);
      
      setScrollProgress(progress);
      const newSection = Math.floor(progress * (totalSections - 0.01));
      setCurrentSection(newSection);

      const { current: refs } = threeRefs;
      const totalProgress = progress * (totalSections - 1);
      const sectionProgress = totalProgress % 1;
      
      const cameraPositions = [
        { x: 0, y: 30, z: 300 },    
        { x: 0, y: 40, z: -50 },     
        { x: 0, y: 50, z: -700 }     
      ];
      
      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[newSection + 1] || currentPos;
      
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      refs.mountains.forEach((mountain, i) => {
        const speed = 1 + i * 0.9;
        const targetZ = mountain.userData.baseZ + scrollY * speed * 0.5;
        if (refs.nebula) refs.nebula.position.z = (targetZ + progress * speed * 0.01) - 100;
        
        if (progress > 0.7) {
          mountain.position.z = 600000;
        } else if (refs.locations) {
          mountain.position.z = refs.locations[i];
        }
      });
      
      if (refs.nebula && refs.mountains[3]) {
        refs.nebula.position.z = refs.mountains[3].position.z;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const splitTitle = (text: string) => {
    return text.split('').map((char, i) => (
      <span key={i} className="title-char">
        {char}
      </span>
    ));
  };

  const sectionsData = [
    {
      title: 'PORTFÓLIO',
      sub1: 'Bem-vindo ao meu universo criativo onde cada pixel conta uma história.',
      sub2: 'Explore o amanhã através de interfaces imersivas e código refinado.'
    },
    {
      title: 'ENGENHARIA',
      sub1: 'Elevando marcas através de tecnologia 3D',
      sub2: 'e interfaces de alto impacto com a Techify.'
    },
    {
      title: 'TECHIFY',
      sub1: 'Criado por Marcos Henrique e a empresa Techify.',
      sub2: 'Liderando a revolução digital com performance extrema e visão futura.'
    }
  ];

  return (
    <div ref={containerRef} className="hero-container cosmos-style bg-black text-white selection:bg-white/20">
      <canvas ref={canvasRef} className="hero-canvas fixed inset-0 z-0" />
      
      <div className="scroll-sections relative z-10 w-full">
        {sectionsData.map((section, i) => (
          <section key={i} className="content-section min-h-[120vh] flex flex-col items-center justify-center text-center px-4 relative">
            <div className="max-w-6xl mx-auto">
              <h1 
                ref={i === 0 ? titleRef : null}
                className="hero-title text-5xl md:text-8xl lg:text-[11rem] font-black tracking-tighter leading-none mb-8 overflow-hidden italic uppercase text-white drop-shadow-[0_0_30px_rgba(255,40,0,0.8)]"
              >
                {splitTitle(section.title)}
              </h1>
          
              <div 
                ref={i === 0 ? subtitleRef : null}
                className="hero-subtitle text-base md:text-xl font-bold tracking-widest text-white max-w-3xl mx-auto uppercase leading-relaxed bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/5"
              >
                <p className="subtitle-line mb-4 drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] px-4">
                  {section.sub1}
                </p>
                <p className="subtitle-line text-primary drop-shadow-[0_0_10px_rgba(255,40,0,0.5)] px-4">
                  {section.sub2}
                </p>
              </div>
            </div>
          </section>
        ))}
      </div>

      <div ref={scrollProgressRef} className="scroll-progress fixed bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-4" style={{ visibility: 'hidden' }}>
        <div className="scroll-text text-[10px] tracking-[1.5em] font-black text-primary mb-2 animate-pulse">SCROLL</div>
        <div className="progress-track w-48 h-px bg-white/10 relative overflow-hidden">
          <div 
            className="progress-fill absolute top-0 left-0 h-full bg-primary shadow-[0_0_15px_rgba(255,40,0,0.8)] transition-all duration-300 ease-out" 
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <div className="section-counter font-black text-xs tracking-[0.3em] text-white/50">
          {String(currentSection + 1).padStart(2, '0')} <span className="text-primary">/</span> {String(totalSections).padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};
