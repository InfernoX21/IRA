import { AreaChart, Check, Shield, TrendingUp } from 'lucide-react';
import AnimatedCounter from '../animated-counter';
import ScrollAnimationWrapper from '../scroll-animation-wrapper';

const impacts = [
  {
    icon: <AreaChart className="h-10 w-10 text-primary" />,
    value: 30,
    suffix: '%',
    title: 'Urban Planning Optimization',
    description: 'Increase in planning efficiency and resource allocation accuracy.',
  },
  {
    icon: <Shield className="h-10 w-10 text-primary" />,
    value: 45,
    suffix: '%',
    title: 'Reduced Environmental Risk',
    description: 'Decrease in potential damages from climate-related events.',
  },
  {
    icon: <Check className="h-10 w-10 text-primary" />,
    value: 60,
    suffix: '%',
    title: 'Data-Driven Governance',
    description: 'Higher adoption of evidence-based policies for urban development.',
  },
  {
    icon: <TrendingUp className="h-10 w-10 text-primary" />,
    value: 25,
    suffix: '%',
    title: 'Smart Infrastructure ROI',
    description: 'Improved return on investment for sustainable infrastructure projects.',
  },
];

export default function Impact() {
  return (
    <section id="impact" className="bg-background/80">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <h2 className="section-title">Impact at Scale</h2>
        </ScrollAnimationWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {impacts.map((impact, index) => (
            <ScrollAnimationWrapper key={impact.title} delay={index * 100}>
              <div className="p-6">
                {impact.icon}
                <p className="text-4xl sm:text-5xl md:text-6xl font-bold font-headline my-4 text-primary tabular-nums">
                  <AnimatedCounter end={impact.value} />
                  {impact.suffix}
                </p>
                <h3 className="text-lg font-semibold">{impact.title}</h3>
                <p className="text-sm text-neutral-400 mt-2">{impact.description}</p>
              </div>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
