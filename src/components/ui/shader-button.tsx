import { Warp } from "@paper-design/shaders-react"
import { motion, HTMLMotionProps } from "motion/react"
import { cn } from "@/lib/utils"
import React from "react"

interface ShaderButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode
  shaderClassName?: string
}

export const ShaderButton = React.forwardRef<HTMLButtonElement, ShaderButtonProps>(
  ({ children, className, shaderClassName, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative overflow-hidden group rounded-[2rem] transition-all duration-300",
          className
        )}
        {...props}
      >
        {/* Shader Background */}
        <div className={cn("absolute inset-0 z-0 opacity-80 group-hover:opacity-100 transition-opacity", shaderClassName)}>
          <Warp
            style={{ width: "100%", height: "100%" }}
            proportion={0.5}
            softness={0.7}
            distortion={0.3}
            swirl={1.2}
            swirlIterations={10}
            shape="checks"
            shapeScale={0.08}
            scale={1.5}
            rotation={0}
            speed={1.2}
            colors={["#FF0000", "#CC0000", "#FF4444", "#000000"]}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full h-full">
          {children}
        </div>

        {/* Overlay to darken slightly or add contrast if needed */}
        <div className="absolute inset-0 z-[5] bg-black/10 group-hover:bg-transparent transition-colors" />
      </motion.button>
    )
  }
)

ShaderButton.displayName = "ShaderButton"
