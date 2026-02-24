import Link from "next/link";
import { Linkedin, Github, Twitter } from "lucide-react";

import Image from 'next/image';
import { getAssetPath } from '@/lib/path-utils';
import DemoRequestModal from "@/components/request-demo-modal";
import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <footer className="relative bg-background/20 backdrop-blur-xl pt-12">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
            <div className="container mx-auto px-4 md:px-6 py-8">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Link href="#" className="flex items-center gap-2 mb-4" prefetch={false}>
                            <Image src={getAssetPath("/logo.png")} alt="IRA Logo" width={300} height={100} className="w-60 h-auto object-contain" />
                        </Link>
                        <p className="text-sm text-neutral-400 max-w-xs">Intelligent Resource Architecture for a sustainable urban future.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 uppercase tracking-widest text-xs">About</h3>
                        <ul className="space-y-2 text-sm">
                            <li><a href="https://docs.google.com/document/d/18Ntbe14ux4KmefIHe34MetlUVu21roKB7zlvomkJ5dI/export?format=pdf" download="IRA_Technical_Whitepaper.pdf" className="text-neutral-400 hover:text-primary transition-colors">Documentation</a></li>
                            <li><Link href="#research" className="text-neutral-400 hover:text-primary transition-colors">Research</Link></li>
                            <li><Link href="#how-it-works" className="text-neutral-400 hover:text-primary transition-colors">Process</Link></li>
                            <li><Link href="#impact" className="text-neutral-400 hover:text-primary transition-colors">Impact</Link></li>
                            <li><Link href="#team" className="text-neutral-400 hover:text-primary transition-colors">Team</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4 uppercase tracking-widest text-xs">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <DemoRequestModal>
                                    <button className="text-neutral-400 hover:text-primary transition-colors text-left">Contact</button>
                                </DemoRequestModal>
                            </li>
                            <li>
                                <DemoRequestModal>
                                    <button className="text-neutral-400 hover:text-primary transition-colors text-left">Partner Program</button>
                                </DemoRequestModal>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="text-neutral-400 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-neutral-400 hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center text-sm text-neutral-500">
                    <p>&copy; 2026 IRA. All rights reserved.</p>
                    <div className="flex gap-4 mt-4 sm:mt-0">
                        <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 hover:text-primary transition-colors" /></Link>
                        <Link href="#" aria-label="GitHub"><Github className="h-5 w-5 hover:text-primary transition-colors" /></Link>
                        <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 hover:text-primary transition-colors" /></Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
