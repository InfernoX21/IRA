'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { BarChart, Layers, Satellite, TestTube2 } from "lucide-react"
import ScrollAnimationWrapper from "../scroll-animation-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import Image from 'next/image'
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Slider } from "../ui/slider"
import { useState, useMemo } from 'react';


const researchItems = [
  {
    icon: <BarChart className="h-6 w-6 text-primary" />,
    title: 'Climate Datasets',
    content: 'Global climate model integration for high-accuracy forecasting.'
  },
  {
    icon: <Layers className="h-6 w-6 text-primary" />,
    title: 'Land Use Data',
    content: 'Complex zoning and infrastructure layout analysis.'
  },
  {
    icon: <Satellite className="h-6 w-6 text-primary" />,
    title: 'Satellite Imaging',
    content: 'ML-powered environmental impact monitoring in real-time.'
  },
  {
    icon: <TestTube2 className="h-6 w-6 text-primary" />,
    title: 'Research Backed',
    content: 'Built on peer-reviewed urban planning and climate science.'
  },
];

const UrbanGrowthSlider = () => {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden">
      <Image
        src="/after.png"
        alt="Urban area after growth"
        fill
        style={{ objectFit: "cover" }}
      />
      <div
        className="absolute top-0 left-0 h-full w-full overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
      >
        <Image
          src="/before.png"
          alt="Urban area before growth"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div className="absolute top-0 bottom-0" style={{ left: `${sliderValue}%`, width: '3px' }}>
        <div className="absolute h-full w-full bg-white/50 backdrop-blur-sm -translate-x-1/2"></div>
      </div>
      <Slider
        defaultValue={[50]}
        max={100}
        step={0.1}
        onValueChange={(value) => setSliderValue(value[0])}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-11/12"
      />
    </div>
  )
}


export default function ResearchFoundation() {
  return (
    <section id="research" className="bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <h2 className="section-title">Backed by Research. Powered by Data.</h2>
        </ScrollAnimationWrapper>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <ScrollAnimationWrapper>
            <div className="glass-card p-4">
              <Accordion type="single" collapsible defaultValue="item-0">
                {researchItems.map((item, index) => (
                  <AccordionItem key={item.title} value={`item-${index}`} className="border-primary/20">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline font-headline">
                      <div className="flex items-center gap-4">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-neutral-300 pl-10">
                      {item.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollAnimationWrapper>
          <ScrollAnimationWrapper delay={200}>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Urban Growth Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <UrbanGrowthSlider />
              </CardContent>
            </Card>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </section>
  )
}
