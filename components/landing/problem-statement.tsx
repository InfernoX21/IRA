import { Building, Globe, Recycle, Search } from 'lucide-react';
import AnimatedCounter from '../animated-counter';
import ScrollAnimationWrapper from '../scroll-animation-wrapper';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const problems = [
  {
    icon: <Building className="h-8 w-8 text-primary" />,
    title: 'Urban Expansion',
    description: 'Strained infrastructure from rapid unchecked growth.',
    color: 'primary',
    stat: {
      value: 68,
      suffix: '%',
      label: 'of world population in cities by 2050',
    },
  },
  {
    icon: <Recycle className="h-8 w-8 text-accent" />,
    title: 'Resource Waste',
    description: 'Inefficient allocation of water and energy.',
    color: 'accent',
    stat: {
      value: 1.3,
      suffix: 'B tons',
      label: 'of food wasted annually',
      decimals: 1,
    },
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: 'Climate Risks',
    description: 'Increasing threats from extreme weather events.',
    color: 'primary',
    stat: {
      value: 90,
      suffix: '%',
      label: 'of urban areas are coastal',
    },
  },
  {
    icon: <Search className="h-8 w-8 text-accent" />,
    title: 'Reactive Planning',
    description: 'Absence of data-driven foresight in urban growth.',
    color: 'accent',
    stat: {
      value: 40,
      suffix: '%',
      label: 'of planning is reactive',
    },
  },
];

export default function ProblemStatement() {
  return (
    <section id="problem" className="bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <h2 className="section-title">
            The Urban <span className="text-accent">Crisis</span>
          </h2>
        </ScrollAnimationWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <ScrollAnimationWrapper key={problem.title} delay={index * 100}>
              <Card className="glass-card glass-card-interactive h-full text-center">
                <CardHeader className="items-center">
                  <div className="p-4 bg-card rounded-full mb-4">{problem.icon}</div>
                  <CardTitle className="text-lg font-bold font-headline">{problem.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-400 text-sm mb-4">{problem.description}</p>
                  <div className={problem.color === 'accent' ? "text-accent" : "text-primary"}>
                    <p className="text-3xl sm:text-4xl font-bold font-headline tabular-nums">
                      <AnimatedCounter end={problem.stat.value} decimals={problem.stat.decimals} />
                      {problem.stat.suffix}
                    </p>
                    <p className="text-xs text-neutral-500">{problem.stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
