'use client';

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface DemoRequestModalProps {
    children: React.ReactNode;
}

export default function DemoRequestModal({ children }: DemoRequestModalProps) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(event.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch("https://formspree.io/f/ayush21.pradhan@gmail.com", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                toast({
                    title: "Request Sent Successfully",
                    description: "Ayush will get back to you shortly.",
                });
                setOpen(false);
            } else {
                throw new Error("Failed to send request");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] glass-card border-primary/20 bg-background/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline font-bold text-primary">Request a Demo</DialogTitle>
                    <DialogDescription className="text-neutral-400">
                        Enter your details below to schedule a presentation of the IRA platform.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-neutral-300">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            required
                            className="bg-white/5 border-white/10 focus:border-primary/50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-neutral-300">Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            required
                            className="bg-white/5 border-white/10 focus:border-primary/50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone" className="text-neutral-300">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            required
                            className="bg-white/5 border-white/10 focus:border-primary/50"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    >
                        {isSubmitting ? "Sending..." : "Submit Request"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
