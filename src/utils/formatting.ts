import { HEATMAP_COLORS } from '@/constants/index';

export function getHeatmapColorByPercentage(percentage: number): string {
  if (percentage < 33) return HEATMAP_COLORS.COLD;
  if (percentage < 66) return HEATMAP_COLORS.WARM;
  return HEATMAP_COLORS.HOT;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('it-IT', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatWeight(weight: number): string {
  return weight.toFixed(1);
}

export function formatNumber(num: number): string {
  return num.toString();
}

export function formatVolume(volume: number): string {
  return `${Math.round(volume)} kg`;
}

export function daysAgo(date: Date | string): number {
  const d = new Date(date);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - d.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function isToday(date: Date | string): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

export function getWeekStartDate(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function getMonthStartDate(date: Date = new Date()): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
