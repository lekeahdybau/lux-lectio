import { MesseCarousel } from "@/components/messe-carousel"
import { testMesses } from "@/components/test-messes"

export default function MesseCarouselDemo() {
  // testMesses doit être un tableau de messes avec lectures
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <MesseCarousel messes={testMesses} />
    </div>
  )
}
