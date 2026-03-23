'use client';

/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from 'react';

interface MilestoneCelebrationProps {
  progress: number;
}

const MILESTONES = [
  { threshold: 25, message: "Great start!", emoji: "🎯" },
  { threshold: 50, message: "Halfway there!", emoji: "🚀" },
  { threshold: 75, message: "Almost done!", emoji: "⭐" },
  { threshold: 100, message: "Complete!", emoji: "🎉" },
];

export function MilestoneCelebration({ progress }: MilestoneCelebrationProps) {
  const [celebration, setCelebration] = useState<{ message: string; emoji: string } | null>(null);
  const [celebratedMilestones, setCelebratedMilestones] = useState<Set<number>>(new Set());

  const checkMilestone = useCallback(() => {
    for (const milestone of MILESTONES) {
      if (progress >= milestone.threshold && !celebratedMilestones.has(milestone.threshold)) {
        setCelebration({ message: milestone.message, emoji: milestone.emoji });
        setCelebratedMilestones(prev => new Set(prev).add(milestone.threshold));

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
          setCelebration(null);
        }, 3000);
        break;
      }
    }
  }, [progress, celebratedMilestones]);

  useEffect(() => {
    checkMilestone();
  }, [checkMilestone]);

  if (!celebration) return null;

  return (
    <div className="milestone-celebration">
      <div className="milestone-content">
        <span className="milestone-emoji">{celebration.emoji}</span>
        <span className="milestone-message">{celebration.message}</span>
        <div className="milestone-progress">{Math.round(progress)}% complete</div>
      </div>
    </div>
  );
}
