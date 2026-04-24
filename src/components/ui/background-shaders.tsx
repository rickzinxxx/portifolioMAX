import { Dithering } from "@paper-design/shaders-react"

export default function BackgroundShaders({ isMobile }: { isMobile?: boolean }) {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
      <Dithering
        colorBack="#000000"
        colorFront="#FF0000"
        shape="warp"
        type="4x4"
        speed={0.12}
        className="size-full opacity-60"
        minPixelRatio={isMobile ? 1 : 1.2}
      />
    </div>
  )
}
