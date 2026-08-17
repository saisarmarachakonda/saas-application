'use client';

import React from 'react';

// 1. Vertical Bar Chart Widget with Transparent Background
interface BarDataPoint {
  label: string;
  value: number;
  color?: string;
  sublabel?: string;
}

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: BarDataPoint[];
  unit?: string;
  height?: number;
}

export function BarChartWidget({ title, subtitle, data, unit = '', height = 180 }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xs flex flex-col justify-between">
      <div className="mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-end gap-3 justify-between pt-2 border-b border-slate-200/50 dark:border-slate-800/50 pb-2" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const pct = Math.round((item.value / maxValue) * 100);
          const barColor = item.color || '#2563eb';
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-800/90 text-white text-[10px] py-1 px-2 rounded-lg shadow-md pointer-events-none whitespace-nowrap z-20 font-mono font-bold backdrop-blur-md border border-slate-700">
                {item.label}: {unit}{item.value.toLocaleString('en-IN')}
              </div>

              <span className="text-[10px] font-extrabold text-slate-700 dark:text-slate-300 mb-1 font-mono">
                {pct}%
              </span>

              <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-t-lg relative overflow-hidden flex items-end h-full max-w-[42px]">
                <div
                  className="w-full rounded-t-lg transition-all duration-500 ease-out"
                  style={{
                    height: `${pct}%`,
                    backgroundColor: barColor,
                    backgroundImage: `linear-gradient(to top, rgba(255,255,255,0.2), transparent)`
                  }}
                />
              </div>

              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-2 truncate max-w-[50px] text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. SVG Donut Ring Chart Widget with Transparent Fills
interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  subtitle?: string;
  slices: DonutSlice[];
  totalLabel?: string;
}

export function DonutChartWidget({ title, subtitle, slices, totalLabel = 'Total' }: DonutChartProps) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  let cumulativeAngle = 0;

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xs flex flex-col justify-between">
      <div className="mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-200/60 dark:text-slate-800/60"
              strokeWidth="4"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {slices.map((slice, idx) => {
              const pct = (slice.value / total) * 100;
              const strokeDasharray = `${pct} ${100 - pct}`;
              const strokeDashoffset = -cumulativeAngle;
              cumulativeAngle += pct;
              return (
                <path
                  key={idx}
                  stroke={slice.color}
                  strokeWidth="4"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  fill="none"
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-sm font-black text-slate-900 dark:text-white font-mono">{total.toLocaleString()}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{totalLabel}</span>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          {slices.map((slice, idx) => {
            const pct = Math.round((slice.value / total) * 100);
            return (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                  <span className="text-slate-600 dark:text-slate-400 truncate text-[11px] font-semibold">{slice.label}</span>
                </div>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// 3. Smooth Line Area Trend Chart Widget with Transparent Fill Gradients
interface LinePoint {
  label: string;
  value: number;
}

interface LineAreaChartProps {
  title: string;
  subtitle?: string;
  data: LinePoint[];
  color?: string;
  unit?: string;
}

export function LineAreaChartWidget({ title, subtitle, data, color = '#f97316', unit = '' }: LineAreaChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  const width = 300;
  const height = 110;
  const padding = 15;

  const points = data.map((d, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xs flex flex-col justify-between">
      <div className="mb-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">{subtitle}</p>}
      </div>

      <div className="relative w-full overflow-hidden pt-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-28 overflow-visible">
          <defs>
            <linearGradient id={`grad-${title.replace(/[^a-zA-Z0-9]/g, '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Transparent Gradient Area Fill */}
          <polygon points={areaPoints} fill={`url(#grad-${title.replace(/[^a-zA-Z0-9]/g, '')})`} />

          {/* Trend Line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />

          {/* Data Circles */}
          {data.map((d, i) => {
            const x = padding + (i / (data.length - 1)) * (width - padding * 2);
            const y = height - padding - (d.value / maxValue) * (height - padding * 2);
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="4"
                fill="#ffffff"
                stroke={color}
                strokeWidth="2.5"
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>{`${d.label}: ${unit}${d.value}`}</title>
              </circle>
            );
          })}
        </svg>
      </div>

      <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-2 mt-1 text-[9px] font-bold text-slate-400 uppercase">
        {data.map((d, i) => (
          <span key={i}>{d.label}</span>
        ))}
      </div>
    </div>
  );
}

// 4. Horizontal Progress Bar Ranking Chart Widget with Translucent Track
interface HorizontalBarItem {
  label: string;
  value: number;
  displayValue?: string;
  color?: string;
}

interface HorizontalBarChartProps {
  title: string;
  subtitle?: string;
  items: HorizontalBarItem[];
}

export function HorizontalBarChartWidget({ title, subtitle, items }: HorizontalBarChartProps) {
  const maxValue = Math.max(...items.map(i => i.value), 1);

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xs flex flex-col justify-between space-y-3">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">{subtitle}</p>}
      </div>

      <div className="space-y-2.5">
        {items.map((item, idx) => {
          const pct = Math.round((item.value / maxValue) * 100);
          const color = item.color || '#3b82f6';
          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate">{item.label}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-[11px]">
                  {item.displayValue || item.value.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-200/50 dark:bg-slate-800/50 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 5. Radial Progress Meter Gauge Widget with Translucent Background
interface RadialGaugeProps {
  title: string;
  subtitle?: string;
  score: number; // 0 to 100
  scoreLabel: string;
  color?: string;
}

export function RadialGaugeWidget({ title, subtitle, score, scoreLabel, color = '#10b981' }: RadialGaugeProps) {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl shadow-xs flex flex-col justify-between">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-500 dark:text-slate-400 font-light mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center justify-around py-2">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
            <circle
              stroke="currentColor"
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset: 0 }}
              r={normalizedRadius}
              cx="40"
              cy="40"
              className="text-slate-200/60 dark:text-slate-800/60"
            />
            <circle
              stroke={color}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              r={normalizedRadius}
              cx="40"
              cy="40"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{score}%</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-extrabold uppercase text-slate-700 dark:text-slate-300">{scoreLabel}</span>
          <span className="text-[11px] font-bold text-emerald-500 mt-0.5">SLA Target Passed</span>
          <span className="text-[10px] text-slate-400 font-light mt-1">Multi-site Audit Certified</span>
        </div>
      </div>
    </div>
  );
}
