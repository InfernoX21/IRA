'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

import Image from 'next/image';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  return (
    <header className={cn("sticky top-0 z-50 transition-all duration-300", scrolled || mobileMenuOpen ? "bg-background/80 backdrop-blur-xl border-b border-white/10" : "bg-transparent")}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <Image src="logo.png" alt="IRA Logo" width={200} height={80} className="w-40 h-auto object-contain" />
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium">
            <Link href="#research" className="hover:text-primary transition-colors" prefetch={false}>Research</Link>
            <Link href="#features" className="hover:text-primary transition-colors" prefetch={false}>Features</Link>
            <Link href="#team" className="hover:text-primary transition-colors" prefetch={false}>Team</Link>
          </nav>
          <div className="hidden md:block">
            <Button>Request Demo</Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-lg">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <Link href="#" className="flex items-center gap-2" prefetch={false}>
                <Image src="/logo.png" alt="IRA Logo" width={160} height={60} className="w-32 h-auto object-contain" />
              </Link>
              <div className="-mr-2">
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
            <div className="mt-12">
              <nav className="grid gap-y-8 text-center">
                <Link href="#research" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium hover:text-primary transition-colors" prefetch={false}>Research</Link>
                <Link href="#features" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium hover:text-primary transition-colors" prefetch={false}>Features</Link>
                <Link href="#team" onClick={() => setMobileMenuOpen(false)} className="text-xl font-medium hover:text-primary transition-colors" prefetch={false}>Team</Link>
              </nav>
            </div>
            <div className="absolute bottom-10 left-4 right-4">
              <Button className="w-full" size="lg">Request Demo</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
