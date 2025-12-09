import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { TimelineEvent, SleepStage } from '../types';

interface SleepChartProps {
  data: TimelineEvent[];
}

const STAGE_MAP: Record<string, number> = {
  [SleepStage.Awake]: 3,
  [SleepStage.REM]: 2,
  [SleepStage.Light]: 1,
  [SleepStage.Deep]: 0,
};

const REVERSE_STAGE_MAP: Record<number, string> = {
  3: 'Awake',
  2: 'REM',
  1: 'Light',
  0: 'Deep',
};

const SleepChart: React.FC<SleepChartProps> = ({ data }) => {
  const chartData = data.map(point => ({
    ...point,
    stageValue: STAGE_MAP[point.stage] ?? 1, // Default to Light if unknown
  }));

  const formatYAxis = (tick: number) => {
    return REVERSE_STAGE_MAP[tick] || '';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const stageVal = payload[0].value;
      const stageName = REVERSE_STAGE_MAP[stageVal];
      return (
        <div className="bg-night-800 border border-night-700 p-2 rounded shadow-lg text-xs">
          <p className="font-semibold text-indigo-400">{label}</p>
          <p className="text-white">Stage: {stageName}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64 bg-night-800/50 rounded-xl p-4 border border-night-700">
      <h3 className="text-sm font-medium text-slate-400 mb-4 uppercase tracking-wider">Hypnogram</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorStage" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke="#94a3b8" 
            tick={{fontSize: 12}}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[0, 3]} 
            ticks={[0, 1, 2, 3]} 
            tickFormatter={formatYAxis} 
            stroke="#94a3b8"
            tick={{fontSize: 10}}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="stepAfter" 
            dataKey="stageValue" 
            stroke="#818cf8" 
            fillOpacity={1} 
            fill="url(#colorStage)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepChart;