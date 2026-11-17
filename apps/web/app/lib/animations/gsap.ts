/** Browser-only loader. Import this function freely; call it from an effect. */
async function createGsapRuntime() {
  const [{ gsap }, { ScrollTrigger }, { useGSAP }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("@gsap/react"),
  ])

  gsap.registerPlugin(ScrollTrigger, useGSAP)
  // Lenis and ScrollTrigger must advance on the same unadjusted clock.
  // This is a shared application setting, not a per-component setting.
  gsap.ticker.lagSmoothing(0)
  return { gsap, ScrollTrigger }
}

export type GsapRuntime = Awaited<ReturnType<typeof createGsapRuntime>>
let runtimePromise: Promise<GsapRuntime> | undefined

export function loadGsap(): Promise<GsapRuntime> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("GSAP runtime must be loaded in a browser effect.")
    )
  }

  runtimePromise ??= createGsapRuntime().catch((error: unknown) => {
    runtimePromise = undefined
    throw error
  })
  return runtimePromise
}
