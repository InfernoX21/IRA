import { Puzzle, BarChart3, CheckCircle, LayoutDashboard, Map, ShieldCheck } from "lucide-react";
import ScrollAnimationWrapper from "../scroll-animation-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const features = [
  {
    icon: <Map className="h-8 w-8 text-primary" />,
    title: 'Site Selection',
    description: 'AI identification of optimal project locations.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'Impact Analytics',
    description: 'Predictive ROI and sustainability forecasting.',
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Risk Forecasting',
    description: 'Visualize flooding and heatwave risks.',
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: 'Ecological Mapping',
    description: 'Feasibility mapping for urban greening.',
  },
  {
    icon: <LayoutDashboard className="h-8 w-8 text-primary" />,
    title: 'Admin Dashboard',
    description: 'Integrated command center for city planners.',
  },
  {
    icon: <Puzzle className="h-8 w-8 text-primary" />,
    title: 'API Integration',
    description: 'Connect with existing legacy systems.',
  },
];

export default function Features() {
  return (
    <section id="features" className="bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <h2 className="section-title">Platform Features</h2>
        </ScrollAnimationWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollAnimationWrapper key={feature.title} delay={index * 100}>
              <Card className="glass-card glass-card-interactive h-full">
                <CardHeader className="flex flex-row items-center gap-4">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-300">{feature.description}</p>
                </CardContent>
              </Card>
            </ScrollAnimationWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
