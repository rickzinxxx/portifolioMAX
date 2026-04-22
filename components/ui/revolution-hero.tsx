"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { X, Code2, Figma, Smartphone, Globe, Rocket, Cpu, Palette, Monitor } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/ui/button"

const vertexShader = `
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
`

const fragmentShader = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_intensity;
  
  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)), 
                  dot(p, vec2(269.5, 183.3)), 
                  dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }
  
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
    return mix(mix(dot(hash3(i + vec2(0.0,0.0)).xy, f - vec2(0.0,0.0)), 
                   dot(hash3(i + vec2(1.0,0.0)).xy, f - vec2(1.0,0.0)), u.x),
               mix(dot(hash3(i + vec2(0.0,1.0)).xy, f - vec2(0.0,1.0)), 
                   dot(hash3(i + vec2(1.0,1.0)).xy, f - vec2(1.0,1.0)), u.x), u.y);
  }
  
  float fbm(vec2 p, int octaves) {
    float value = 0.0;
    float amplitude = 1.0;
    float frequency = 0.25;
    
    for(int i = 0; i < 10; i++) {
      if(i >= octaves) break;
      value += amplitude * noise(p * frequency);
      amplitude *= 0.52;
      frequency *= 1.13;
    }
    return value;
  }
  
  float voronoi(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 50.0;
    
    for(int i = -2; i <= 2; i++) {
      for(int j = -2; j <= 2; j++) {
        vec2 g = vec2(i, j);
        vec2 o = hash3(n + g).xy;
        o = 0.5 + 0.41 * sin(u_time * 1.5 + 6.28 * o);
        vec2 r = g + o - f;
        float d = dot(r, r);
        md = min(md, d);
      }
    }
    return sqrt(md);
  }
  
  float plasma(vec2 p, float time) {
    float a = sin(p.x * 8.0 + time * 2.0);
    float b = sin(p.y * 8.0 + time * 1.7);
    float c = sin((p.x + p.y) * 6.0 + time * 1.3);
    float d = sin(sqrt(p.x * p.x + p.y * p.y) * 8.0 + time * 2.3);
    return (a + b + c + d) * 0.5;
  }
  
  vec2 curl(vec2 p, float time) {
    float eps = 0.5;
    float n1 = fbm(p + vec2(eps, 0.0), 6);
    float n2 = fbm(p - vec2(eps, 0.0), 6);
    float n3 = fbm(p + vec2(0.0, eps), 6);
    float n4 = fbm(p - vec2(0.0, eps), 6);
    return vec2((n3 - n4) / (2.0 * eps), (n2 - n1) / (2.0 * eps));
  }

  float grain(vec2 uv, float time) {
    vec2 seed = uv * time;
    return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 st = (uv - 0.5) * 2.0;
    st.x *= u_resolution.x / u_resolution.y;
    
    float time = u_time * 0.25; 
    
    vec2 curlForce = curl(st * 2.0, time) * 0.6;
    vec2 flowField = st + curlForce;
    
    float dist1 = fbm(flowField * 1.5 + time * 1.2, 8) * 0.4;
    float dist2 = fbm(flowField * 2.3 - time * 0.8, 6) * 0.3;
    float dist3 = fbm(flowField * 3.1 + time * 1.8, 4) * 0.2;
    float dist4 = fbm(flowField * 4.7 - time * 1.1, 3) * 0.15;
    
    float cells = voronoi(flowField * 2.5 + time * 0.5);
    cells = smoothstep(0.1, 0.7, cells);
    
    float plasmaEffect = plasma(flowField + vec2(dist1, dist2), time * 1.5) * 0.2;
    float totalDist = dist1 + dist2 + dist3 + dist4 + plasmaEffect;
    
    float streak1 = sin((st.x + totalDist) * 15.0 + time * 3.0) * 0.5 + 0.5;
    float streak2 = sin((st.x + totalDist * 0.7) * 25.0 - time * 2.0) * 0.5 + 0.5;
    float streak3 = sin((st.x + totalDist * 1.3) * 35.0 + time * 4.0) * 0.5 + 0.5;
    
    streak1 = smoothstep(0.3, 0.7, streak1);
    streak2 = smoothstep(0.2, 0.8, streak2);
    streak3 = smoothstep(0.4, 0.6, streak3);
    
    float combinedStreaks = streak1 * 0.6 + streak2 * 0.4 + streak3 * 0.5;
    
    float shape1 = 1.0 - abs(st.x + totalDist * 0.6);
    shape1 = smoothstep(0.0, 1.0, shape1);
    
    vec3 color1 = vec3(1.0, 0.05, 0.0);   // Primary Red
    vec3 color2 = vec3(0.5, 0.0, 0.1);   // Dark Red
    
    float gradient = 1.0 - uv.y;
    float colorNoise = fbm(flowField * 3.0 + time * 0.5, 4) * 0.5 + 0.5;
    
    vec3 finalColor = mix(color2, color1, gradient);
    finalColor = mix(finalColor, color1, colorNoise * 0.5);
    
    float intensity = shape1 * combinedStreaks;
    intensity *= (1.0 + cells * 0.2);
    intensity *= u_intensity;
    
    vec2 mouse = u_mouse / u_resolution.xy;
    mouse = (mouse - 0.5) * 2.0;
    mouse.x *= u_resolution.x / u_resolution.y;
    
    float mouseInfluence = 1.0 - length(st - mouse) * 0.6;
    mouseInfluence = smoothstep(0.0, 1.0, max(0.0, mouseInfluence));
    
    intensity += mouseInfluence * 0.4;
    
    vec3 result = finalColor * intensity;
    result = pow(result, vec3(0.85));
    
    float vignette = smoothstep(0.2, 1.0, 1.0 - length(uv - 0.5) * 0.85);
    result *= vignette;
    
    gl_FragColor = vec4(result, 1.0);
  }
`

interface NavLinkProps {
  children: React.ReactNode
  onClick?: () => void
  gradient: string
}

function NavLink({ children, onClick, gradient }: NavLinkProps) {
  const linkRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const link = linkRef.current
    if (!link) return

    const handleMouseEnter = () => {
      gsap.to(link, {
        scale: 1.05,
        rotationX: -2,
        z: 20,
        duration: 0.6,
        ease: "power3.out",
      })
    }

    const handleMouseLeave = () => {
      gsap.to(link, {
        scale: 1,
        rotationX: 0,
        z: 0,
        duration: 0.6,
        ease: "power3.out",
      })
    }

    link.addEventListener("mouseenter", handleMouseEnter)
    link.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      link.removeEventListener("mouseenter", handleMouseEnter)
      link.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <button
      ref={linkRef}
      onClick={onClick}
      className="block mb-4 text-5xl md:text-7xl lg:text-9xl font-black leading-tight cursor-pointer transition-all duration-300 transform-gpu perspective-1000 text-left w-fit uppercase italic"
      style={{
        background: gradient,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        color: "transparent",
      }}
    >
      {children}
    </button>
  )
}

export default function WebGLHero({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const bufferRef = useRef<WebGLBuffer | null>(null)
  const positionLocationRef = useRef<number>(0)
  const timeLocationRef = useRef<WebGLUniformLocation | null>(null)
  const resolutionLocationRef = useRef<WebGLUniformLocation | null>(null)
  const mouseLocationRef = useRef<WebGLUniformLocation | null>(null)
  const intensityLocationRef = useRef<WebGLUniformLocation | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const [globalIntensity, setGlobalIntensity] = useState(1.0)
  const [isServicesOpen, setIsServicesOpen] = useState(false)

  const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type)
    if (!shader) return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  const initGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl")
    if (!gl) return
    glRef.current = gl

    const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShader)
    const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader)
    if (!vertShader || !fragShader) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)
    programRef.current = program

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    bufferRef.current = buffer

    positionLocationRef.current = gl.getAttribLocation(program, "position")
    timeLocationRef.current = gl.getUniformLocation(program, "u_time")
    resolutionLocationRef.current = gl.getUniformLocation(program, "u_resolution")
    mouseLocationRef.current = gl.getUniformLocation(program, "u_mouse")
    intensityLocationRef.current = gl.getUniformLocation(program, "u_intensity")

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      gl.viewport(0, 0, canvas.width, canvas.height)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const cleanupResize = initGL()
    
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) * window.devicePixelRatio
      mouseRef.current.y = (rect.height - (e.clientY - rect.top)) * window.devicePixelRatio

      gsap.to({ intensity: globalIntensity }, {
        intensity: 1.2,
        duration: 0.3,
        ease: "power2.out",
        onUpdate: function() { setGlobalIntensity(this.targets()[0].intensity) }
      })
      gsap.to({ intensity: 1.2 }, {
        intensity: 1.0,
        duration: 1.2,
        delay: 0.1,
        ease: "power2.out",
        onUpdate: function() { setGlobalIntensity(this.targets()[0].intensity) }
      })
    }
    window.addEventListener("mousemove", handleMouseMove)

    let animFrame: number
    const render = () => {
      const time = (Date.now() - startTimeRef.current) * 0.001
      const gl = glRef.current
      if (gl && programRef.current) {
         gl.useProgram(programRef.current)
         gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current)
         gl.enableVertexAttribArray(positionLocationRef.current)
         gl.vertexAttribPointer(positionLocationRef.current, 2, gl.FLOAT, false, 0, 0)
         gl.uniform1f(timeLocationRef.current, time)
         gl.uniform2f(resolutionLocationRef.current, gl.canvas.width, gl.canvas.height)
         gl.uniform2f(mouseLocationRef.current, mouseRef.current.x, mouseRef.current.y)
         gl.uniform1f(intensityLocationRef.current, globalIntensity)
         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      }
      animFrame = requestAnimationFrame(render)
    }
    render()

    return () => {
      cancelAnimationFrame(animFrame)
      window.removeEventListener("mousemove", handleMouseMove)
      cleanupResize?.()
    }
  }, [initGL])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ background: "#000" }} />

      <div className="relative z-10 h-full flex flex-col justify-end p-12 md:p-24">
        <div className="flex flex-col">
          <NavLink onClick={onEnter} gradient="linear-gradient(135deg, #ff2800, #ff8000)">
            START
          </NavLink>
          <NavLink onClick={() => setIsServicesOpen(true)} gradient="linear-gradient(135deg, #ffffff, #aaaaaa)">
            SERVICOS
          </NavLink>
        </div>
        
        <div className="mt-12 text-white/30 text-xs font-black uppercase tracking-[0.5em] flex items-center gap-4">
          <div className="w-12 h-[1px] bg-white/20" />
          <span>Innovate . Create . Dominate</span>
        </div>
      </div>

      <AnimatePresence>
        {isServicesOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 md:left-auto md:w-[600px] bg-black/95 backdrop-blur-2xl z-[300] border-l border-white/10 p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-primary">Serviços</h2>
              <button onClick={() => setIsServicesOpen(false)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-12 pb-20">
              {/* Seção 1 */}
              <div>
                <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Expertise & Entregas</p>
                <div className="grid gap-4">
                  {[
                    { icon: Palette, title: "Designer", desc: "Criação de marcas e identidades visuais de alto impacto." },
                    { icon: Globe, title: "Criação de Sites", desc: "Landing pages e portfólios institucionais otimizados." },
                    { icon: Rocket, title: "Criação de Loja", desc: "E-commerces focados em conversão e usabilidade." },
                    { icon: Cpu, title: "Automação com IA", desc: "Sistemas inteligentes para otimizar fluxos de trabalho." },
                    { icon: Smartphone, title: "Social Media", desc: "Gestão estratégica de presença digital." },
                    { icon: Monitor, title: "Editor", desc: "Edição de vídeo e motion design para web." }
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4 items-start">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><s.icon size={20} /></div>
                      <div>
                        <h4 className="font-bold text-white uppercase text-sm">{s.title}</h4>
                        <p className="text-xs text-white/50">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Habilidades 3D */}
              <div>
                <p className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-6">Alta Performance & Imersão</p>
                <div className="space-y-6">
                  <div className="space-y-2">
                     <h4 className="font-bold text-primary italic uppercase sm">Experiências Web Imersivas (3D & WebGL)</h4>
                     <p className="text-sm text-white/70 leading-relaxed">Desenvolvimento de ambientes tridimensionais interativos que prendem a atenção e aumentam o tempo de permanência do usuário no site.</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="font-bold text-primary italic uppercase sm">Interfaces de Alta Performance</h4>
                     <p className="text-sm text-white/70 leading-relaxed">Criação de aplicações otimizadas onde a fluidez das animações não compromete a velocidade de carregamento (Core Web Vitals).</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="font-bold text-primary italic uppercase sm">Motion Design para Web</h4>
                     <p className="text-sm text-white/70 leading-relaxed">Implementação de micro-interações e animações complexas (scroll-triggered, parallax, hover effects) que guiam a jornada do usuário.</p>
                  </div>
                  <div className="space-y-2">
                     <h4 className="font-bold text-primary italic uppercase sm">Desenvolvimento Frontend Escalável</h4>
                     <p className="text-sm text-white/70 leading-relaxed">Código limpo e modular utilizando as melhores práticas de mercado para garantir que o projeto possa crescer sem perder qualidade.</p>
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="grid grid-cols-1 gap-8">
                <div>
                   <h3 className="text-xl font-black italic uppercase text-white mb-6">Core Frontend</h3>
                   <ul className="space-y-4 text-sm">
                     <li><span className="text-primary font-bold">React.js:</span> Construção de interfaces dinâmicas e reativas.</li>
                     <li><span className="text-primary font-bold">JS / TS:</span> Robustez e tipagem no desenvolvimento.</li>
                     <li><span className="text-primary font-bold">Next.js:</span> Performance superior e SEO premium.</li>
                   </ul>
                </div>
                <div>
                   <h3 className="text-xl font-black italic uppercase text-white mb-6">Imersão & 3D</h3>
                   <ul className="space-y-4 text-sm">
                     <li><span className="text-primary font-bold">Three.js / R3F:</span> Renderização de cenas 3D no navegador.</li>
                     <li><span className="text-primary font-bold">GLSL (Shaders):</span> Efeitos visuais customizados e texturas dinâmicas.</li>
                     <li><span className="text-primary font-bold">GSAP & Framer:</span> Padrão ouro para animações fluidas.</li>
                   </ul>
                </div>
                <div>
                   <h3 className="text-xl font-black italic uppercase text-white mb-6">Design & Tooling</h3>
                   <ul className="space-y-4 text-sm">
                     <li><span className="text-primary font-bold">UI/UX (Figma):</span> Prototipagem e layouts Bento Grid.</li>
                     <li><span className="text-primary font-bold">Tailwind CSS:</span> Estilização moderna e responsiva.</li>
                     <li><span className="text-primary font-bold">Vercel / Git:</span> Deploy e gerenciamento profissional.</li>
                   </ul>
                </div>
              </div>
              
              <Button 
                onClick={() => window.open("https://wa.me/558199130885", "_blank")}
                className="w-full bg-primary text-black font-black uppercase italic py-8 rounded-2xl"
              >
                🚀 Converse Comigo
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
