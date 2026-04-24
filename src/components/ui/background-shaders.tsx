import { Warp } from "@paper-design/shaders-react"

export default function BackgroundShaders() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
      <Warp
        style={{ width: "100%", height: "100%" }}
        proportion={0.5}
        softness={0.8}
        distortion={0.4}
        swirl={1.5}
        swirlIterations={20}
        shape="checks"
        shapeScale={0.1}
        scale={2.0}
        rotation={0}
        speed={1.0}
        colors={["#880000", "#220000", "#550000", "#000000"]}
      />
    </div>
  )
}
