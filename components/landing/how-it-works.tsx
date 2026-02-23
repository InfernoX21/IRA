import { BrainCircuit, Database, LineChart, Map, SlidersHorizontal, Waypoints } from "lucide-react";
import ScrollAnimationWrapper from "../scroll-animation-wrapper";

const steps = [
  {
    icon: <Database className="h-8 w-8" />,
    title: "Data Collection",
    description: "Aggregating diverse datasets from climate, soil, satellite, and urban sources.",
  },
  {
    icon: <SlidersHorizontal className="h-8 w-8" />,
    title: "Soil Analysis",
    description: "Deep environmental factor analysis for site conditions.",
  },
  {
    icon: <LineChart className="h-8 w-8" />,
    title: "Modeling",
    description: "Algorithmic forecasting for growth and climate risks.",
  },
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: "AI Engine",
    description: "Context-aware strategies for sustainable development.",
  },
  {
    icon: <Waypoints className="h-8 w-8" />,
    title: "Visualization",
    description: "Actionable insights through interactive maps and charts.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <h2 className="section-title">Intelligent Decision Engine</h2>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper delay={200}>
          {/* Desktop View */}
          <div className="hidden md:block relative">
            <div className="absolute left-0 top-8 w-full h-0.5 bg-primary/20 -translate-y-1/2" />

            {/* GIS Infrastructure Lines (Bezier Paths) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0" style={{ top: '8px' }}>
              <path
                d="M 50 0 Q 250 -50, 450 0 T 850 0"
                fill="none"
                stroke="hsla(var(--primary), 0.15)"
                strokeWidth="1"
                strokeDasharray="4 8"
                className="animate-[dash_20s_linear_infinite]"
              />
              <path
                d="M 150 0 Q 350 50, 550 0 T 950 0"
                fill="none"
                stroke="hsla(var(--primary), 0.1)"
                strokeWidth="1"
                strokeDasharray="4 8"
                className="animate-[dash_25s_linear_infinite]"
              />
            </svg>

            <div className="grid grid-cols-5 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="group relative flex flex-col items-center pt-20 text-center">
                  <div className="absolute top-8 -translate-y-1/2 w-6 h-6 bg-primary rounded-full transition-all duration-500 group-hover:scale-125 shadow-[0_0_15px_rgba(0,200,83,0.5)] z-10" />
                  <div className="relative">
                    <div className="mx-auto w-20 h-20 glass-card glass-card-interactive flex items-center justify-center text-primary group-hover:text-white group-hover:bg-primary/50 transition-all duration-500 group-hover:scale-110">
                      {step.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 mt-4 font-headline">{step.title}</h3>
                    <p className="text-sm text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Mobile View */}
          <div className="md:hidden relative mt-8">
            <div className="absolute left-6 top-0 w-0.5 h-full bg-primary/20" />
            <div className="flex flex-col gap-12">
              {steps.map((step, index) => (
                <div key={index} className="relative pl-16">
                  <div className="absolute top-0 left-6 -translate-x-1/2 w-10 h-10 glass-card flex items-center justify-center text-primary z-10">
                    {step.icon}
                  </div>
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-2 font-headline">{step.title}</h3>
                    <p className="text-sm text-neutral-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollAnimationWrapper>
      </div>
    </section>
  );
}
