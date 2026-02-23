'use client';

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import ScrollAnimationWrapper from '../scroll-animation-wrapper';
import { Card, CardContent } from '../ui/card';
import { Linkedin, Github, Instagram, Mail } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { Button } from '../ui/button';

const teamMember = {
  name: 'Ayush Ranjan Pradhan',
  role: 'Project Lead',
  bio: "Architecting the blueprint for autonomous urban intelligence, Ayush Ranjan Pradhan serves as the principal Project Lead of IRA (Intelligent Research Architecture). He bridges high-level strategic vision with hands-on system design, engineering the analytical models that transform geospatial data into predictive insights. He is driven by the philosophy that the ultimate role of technology is to weave a silent, self-correcting intelligence into the physical fabric of our world.",
  image: 'profpic.jpg',
  linkedin: 'https://www.linkedin.com/in/ayush-ranjan-pradhan-008468309',
  github: 'https://github.com/InfernoX21',
  email: 'mailto:ayush21.pradhan@gmail.com',
  instagram: 'https://www.instagram.com/ayushh.btw',
};

export default function Team() {
  const member = useMemo(() => {
    return {
      ...teamMember,
      imageData: PlaceHolderImages.find(img => img.id === teamMember.image),
    };
  }, []);

  return (
    <section id="team" className="bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <h2 className="section-title">Meet the Architect</h2>
        </ScrollAnimationWrapper>
        <div className="flex justify-center">
          <ScrollAnimationWrapper className="w-full max-w-2xl">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
              <Card className="relative glass-card glass-card-interactive overflow-hidden text-center transition-all duration-500">
                <CardContent className="p-8 md:p-12">
                  <Image
                    src={member.image}
                    alt={`Profile of ${member.name}`}
                    width={280}
                    height={280}
                    className="rounded-full mx-auto mb-6 border-4 border-primary/50 transition-all duration-500 transform group-hover:scale-105"
                  />
                  <h3 className="text-3xl font-bold font-headline">{member.name}</h3>
                  <p className="text-primary font-medium text-lg mb-4">{member.role}</p>
                  <p className="text-neutral-300 text-base mt-3 mb-8 max-w-md mx-auto">{member.bio}</p>
                  <div className="flex justify-center gap-4">
                    <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Link href={member.linkedin} passHref>
                        <Linkedin className="h-6 w-6" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Link href={member.github} passHref>
                        <Github className="h-6 w-6" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Link href={member.instagram} passHref>
                        <Instagram className="h-6 w-6" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="icon" className="rounded-full h-12 w-12">
                      <Link href={member.email} passHref>
                        <Mail className="h-6 w-6" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </section>
  );
}
