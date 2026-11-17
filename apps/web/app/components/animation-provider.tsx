import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { LazyMotion, MotionConfig } from "motion/react"
import type Lenis from "lenis"

import { loadGsap, type GsapRuntime } from "../lib/animations/gsap"
import "lenis/dist/lenis.css"
import "../styles/animations.css"

const loadMotionFeatures = () =>
  import("../lib/animations/motion-features").then((module) => module.default)

type ScrollRuntime = GsapRuntime & { lenis: Lenis }
type AnimationContextValue = {
  runtime: ScrollRuntime | null
  reducedMotion: boolean
  error: string | null
}

const AnimationContext = createContext<AnimationContextValue | null>(null)

/** One provider per application. It does not animate any page content. */
export function AnimationProvider({ children }: { children: ReactNode }) {
  // Conservative SSR default: effects only become available after hydration.
  const [value, setValue] = useState<AnimationContextValue>({
    runtime: null,
    reducedMotion: true,
    error: null,
  })

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let disposed = false
    let generation = 0
    let cleanup = () => {}

    function configure() {
      const currentGeneration = ++generation
      cleanup()
      cleanup = () => {}
      setValue({
        runtime: null,
        reducedMotion: preference.matches,
        error: null,
      })
      if (preference.matches) return

      void Promise.all([import("lenis"), loadGsap()])
        .then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
          if (disposed || currentGeneration !== generation) return

          const lenis = new Lenis({
            autoRaf: false,
            smoothWheel: true,
            // A softer wheel response, with a bounded duration for section links.
            lerp: 0.075,
            syncTouch: false,
            anchors: {
              lerp: 0,
              duration: 1.1,
              easing: (progress: number) => 1 - Math.pow(1 - progress, 4),
            },
            stopInertiaOnNavigate: true,
          })

          // Lenis has no independent RAF loop; GSAP owns the single clock.
          const advanceLenis = (seconds: number) => lenis.raf(seconds * 1000)
          const updateScrollTrigger = () => ScrollTrigger.update()
          lenis.on("scroll", updateScrollTrigger)
          gsap.ticker.add(advanceLenis)

          cleanup = () => {
            gsap.ticker.remove(advanceLenis)
            lenis.off("scroll", updateScrollTrigger)
            lenis.destroy()
          }
          setValue({
            runtime: { gsap, ScrollTrigger, lenis },
            reducedMotion: false,
            error: null,
          })
        })
        .catch((error: unknown) => {
          if (disposed || currentGeneration !== generation) return
          // Content stays visible and scrolling stays native if a chunk fails.
          cleanup()
          setValue({
            runtime: null,
            reducedMotion: preference.matches,
            error:
              error instanceof Error
                ? error.message
                : "Animation runtime could not load.",
          })
          console.error(
            "Animation runtime unavailable; native scrolling remains active.",
            error
          )
        })
    }

    configure()
    preference.addEventListener("change", configure)
    return () => {
      disposed = true
      generation++
      preference.removeEventListener("change", configure)
      cleanup()
    }
  }, [])

  return (
    <AnimationContext.Provider value={value}>
      <MotionConfig reducedMotion="user">
        <LazyMotion features={loadMotionFeatures} strict>
          {children}
        </LazyMotion>
      </MotionConfig>
    </AnimationContext.Provider>
  )
}

/** Future scroll effects must wait for runtime and revert when it changes. */
export function useAnimationRuntime() {
  const context = useContext(AnimationContext)
  if (!context)
    throw new Error("useAnimationRuntime requires AnimationProvider.")
  return context
}
