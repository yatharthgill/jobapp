import HeroSection from "@/components/Hero";
import FeaturesSection from "@/components/Features";
import TestimonialsSection from "@/components/Testimonials";

export default function App() {
  return (
    <div className="bg-white">
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
      </main>
    </div>
  );
}