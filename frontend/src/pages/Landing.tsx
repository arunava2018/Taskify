import Faq from "@/components/Landing Page/FAQ"
import Feature from "@/components/Landing Page/Feature"
import HeroSection from "@/components/Landing Page/HeroSection"
import Testimonials from "@/components/Landing Page/Testimonials"
import type { FC } from "react"
const Landing : FC = () => {
  return (
    <div>
      <HeroSection/>
      <Feature/>
      <Testimonials/>
      <Faq/>
    </div>
  )
}

export default Landing
