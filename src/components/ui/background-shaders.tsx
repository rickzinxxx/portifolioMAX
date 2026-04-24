import { Warp } from "@paper-design/shaders-react"

export default function BackgroundShaders({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
      <Warp
        style={{ width: "100%", height: "100%" }}
        proportion={0.5}
        softness={0.8}
        distortion={0.4}
        swirl={1.5}
        swirlIterations={isMobile ? 8 : 20}
        shape="checks"
        shapeScale={0.1}
        scale={isMobile ? 1.5 : 2.0}
        rotation={0}
        speed={isMobile ? 0.6 : 1.0}
        colors={["#880000", "#220000", "#550000", "#000000"]}
      />
    </div>
  )
}
