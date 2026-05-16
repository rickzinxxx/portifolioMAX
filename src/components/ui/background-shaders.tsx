import { Warp } from "@paper-design/shaders-react"

export default function BackgroundShaders({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
      <Warp
        style={{ width: "100%", height: "100%" }}
        proportion={isMobile ? 0.6 : 0.45}
        softness={0.9}
        distortion={0.3}
        swirl={0.8}
        swirlIterations={8}
        shape="checks"
        shapeScale={isMobile ? 0.05 : 0.08}
        scale={1}
        rotation={0}
        speed={0.15}
        colors={["#FF1A00", "#220000", "#000000", "#FF0000"]}
        className="size-full opacity-60"
      />
    </div>
  )
}
