"use client";

import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip } from 'recharts';

interface SkillData {
  subject: string;
  A: number;
  fullMark: number;
}

interface SkillRadarProps {
  data: SkillData[];
}

export function SkillRadar({ data }: SkillRadarProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--color-border)" className="opacity-50" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--color-card)", 
              borderColor: "var(--color-border)",
              borderRadius: "0.5rem",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)"
            }} 
            itemStyle={{ color: "var(--color-primary)", fontWeight: 700 }}
          />
          <Radar 
            name="Skill" 
            dataKey="A" 
            stroke="var(--color-primary)" 
            fill="var(--color-primary)" 
            fillOpacity={0.4} 
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
