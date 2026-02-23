import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BrainCircuit, Cloud, Database, Map, Wind } from "lucide-react";
import ScrollAnimationWrapper from "../scroll-animation-wrapper";

const technologies = [
  { name: 'Gemini API', icon: <BrainCircuit className="h-10 w-10"/>, description: 'Powering our AI Recommendation Engine' },
  { name: 'Weather API', icon: <Wind className="h-10 w-10"/>, description: 'For real-time climate data integration' },
  { name: 'Firebase', icon: <Database className="h-10 w-10"/>, description: 'Secure and scalable data storage' },
  { name: 'Map API', icon: <Map className="h-10 w-10"/>, description: 'For geospatial visualization and analysis' },
  { name: 'AI/ML Models', icon: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect x="4" y="12" width="16" height="8" rx="2"/><path d="M4 12v-2a2 2 0 0 1 2-2h4"/><path d="M12 12v-2a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
    ), description: 'Custom models for predictive analytics' },
  { name: 'Cloud Infrastructure', icon: <Cloud className="h-10 w-10"/>, description: 'Robust, scalable, and secure hosting' },
];

export default function TechStack() {
  return (
    <section id="tech-stack" className="bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <h2 className="section-title">Powering the Intelligence</h2>
        </ScrollAnimationWrapper>
        <TooltipProvider>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {technologies.map((tech, index) => (
              <ScrollAnimationWrapper key={tech.name} delay={index * 100} className="h-full">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="group relative glass-card glass-card-interactive p-8 flex flex-col items-center justify-center gap-4 text-neutral-400 hover:text-primary transition-colors duration-500 cursor-pointer h-full">
                      <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 border-2 border-transparent rounded-xl transform scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 group-hover:border-primary/50 transition-all duration-500" />
                      {tech.icon}
                      <p className="font-semibold text-center">{tech.name}</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="glass-card">
                    <p>{tech.description}</p>
                  </TooltipContent>
                </Tooltip>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </section>
  );
}
