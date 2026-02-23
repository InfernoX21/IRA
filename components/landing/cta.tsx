import { Button } from "../ui/button";
import ScrollAnimationWrapper from "../scroll-animation-wrapper";
import DemoRequestModal from "../request-demo-modal";

export default function Cta() {
    return (
        <section id="contact" className="bg-transparent relative">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />
            <div className="container mx-auto px-4 md:px-6">
                <ScrollAnimationWrapper>
                    <div className="relative glass-card p-8 md:p-16 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                        <div className="text-center">
                            <h2 className="font-headline text-3xl md:text-5xl font-bold">
                                Building Sustainable Cities with Intelligence.
                            </h2>
                            <p className="mt-4 max-w-2xl mx-auto text-neutral-300">
                                Join us in shaping the future of urban development. Explore how IRA can transform your city's planning and sustainability outcomes.
                            </p>
                            <div className="mt-8 flex flex-wrap justify-center gap-4">
                                <DemoRequestModal>
                                    <Button size="lg">Request Demo</Button>
                                </DemoRequestModal>
                                <Button size="lg" variant="outline">Partner With Us</Button>
                                <Button size="lg" variant="ghost" asChild>
                                    <a href="https://docs.google.com/document/d/18Ntbe14ux4KmefIHe34MetlUVu21roKB7zlvomkJ5dI/edit?usp=sharing" target="_blank" rel="noopener noreferrer">
                                        Download Whitepaper
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </ScrollAnimationWrapper>
            </div>
        </section>
    )
}
