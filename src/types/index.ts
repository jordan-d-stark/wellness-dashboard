export interface WellnessMetric {
  date: string;
  value: number;
  unit: string;
}

export interface WellnessData {
  steps: WellnessMetric[];
  sleep: WellnessMetric[];
  meditation: WellnessMetric[];
  productivity: WellnessMetric[];
}

export interface MetricCardProps {
  title: string;
  data: WellnessMetric[];
  color: string;
  icon: string;
} 