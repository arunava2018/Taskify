import Faq from "@/components/Landing Page/FAQ"
import Feature from "@/components/Landing Page/Feature"
import HeroSection from "@/components/Landing Page/HeroSection"
import Testimonials from "@/components/Landing Page/Testimonials"
import Footer from "@/layout/Footer"
import type { FC } from "react"
const Landing : FC = () => {
  return (
    <div>
      <HeroSection/>
      <Feature/>
      <Testimonials/>
      <Faq/>
      <Footer/>
    </div>
  )
}

export default Landing
