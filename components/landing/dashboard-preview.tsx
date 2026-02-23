'use client';

import ScrollAnimationWrapper from "../scroll-animation-wrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import Image from 'next/image';
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Progress } from "../ui/progress";
import { useMemo } from "react";

const chartData = [
  { name: '2020', risk: 40 },
  { name: '2025', risk: 45 },
  { name: '2030', risk: 52 },
  { name: '2035', risk: 68 },
  { name: '2040', risk: 75 },
  { name: '2045', risk: 82 },
];

const projectData = [
  { name: 'Greenway Park', status: 'Optimal', score: 95 },
  { name: 'South District Housing', status: 'Moderate Risk', score: 68 },
  { name: 'West-End Industrial', status: 'High Risk', score: 32 },
]

export default function DashboardPreview() {
  const mapImage = useMemo(() => PlaceHolderImages.find(img => img.id === 'dashboard-map'), []);

  return (
    <section id="dashboard-preview" className="bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <ScrollAnimationWrapper>
          <h2 className="section-title">Live Dashboard Preview</h2>
        </ScrollAnimationWrapper>
        <ScrollAnimationWrapper delay={200}>
          <Card className="glass-card shadow-2xl shadow-black/50 overflow-hidden">
            <div className="grid lg:grid-cols-3">
              <div className="lg:col-span-2 p-4 md:p-6">
                <CardTitle className="mb-4">City Overview: Sector 7G</CardTitle>
                {mapImage && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden relative shadow-lg">
                    <Image
                      src={mapImage.imageUrl}
                      alt="Dashboard map view"
                      fill
                      style={{ objectFit: "cover" }}
                      className="animate-pulse-slow"
                      data-ai-hint={mapImage.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                )}
              </div>
              <div className="lg:col-span-1 p-4 md:p-6 border-l border-white/10 bg-white/5">
                <Card className="glass-card mb-4">
                  <CardHeader>
                    <CardTitle>Sustainability Index</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="relative">
                      <Progress value={82} className="h-4" />
                      <p className="text-4xl font-bold font-headline mt-2 tabular-nums">82/100</p>
                    </div>
                    <CardDescription>Overall city rating</CardDescription>
                  </CardContent>
                </Card>
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Climate Risk Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                          <Bar
                            dataKey="risk"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                            animationDuration={2000}
                            animationEasing="ease-in-out"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="p-4 md:p-6 border-t border-white/10">
              <CardTitle className="mb-4">Project Feasibility</CardTitle>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Feasibility Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projectData.map(p => (
                    <TableRow key={p.name}>
                      <TableCell className="font-medium">{p.name}</TableCell>
                      <TableCell>
                        <Badge variant={p.score > 80 ? 'default' : p.score > 50 ? 'secondary' : 'destructive'} className={p.score > 80 ? 'text-primary-foreground' : p.score > 50 ? 'bg-yellow-500/80 text-black' : 'bg-accent/80 text-accent-foreground'}>
                          {p.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">{p.score}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </ScrollAnimationWrapper>
      </div>
    </section>
  )
}
