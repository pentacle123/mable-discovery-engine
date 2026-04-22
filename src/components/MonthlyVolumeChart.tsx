'use client';

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { brand, formatNumber } from '@/lib/brand';

interface Props {
  volumes: number[];
  color: string;
}

export default function MonthlyVolumeChart({ volumes, color }: Props) {
  const data = volumes.map((v, i) => ({ month: labelFor(i, volumes.length), volume: v }));

  return (
    <div
      style={{
        background: brand.surface,
        border: `1px solid ${brand.border}`,
        borderRadius: 14,
        padding: 18,
        height: 260
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: 10
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 800, color: brand.text }}>
          📈 월별 검색 트렌드 (최근 14개월)
        </div>
        <div style={{ fontSize: 11, color: brand.textMuted }}>
          피크 {formatNumber(Math.max(...volumes))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={brand.border} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fill: brand.textMuted }}
            axisLine={{ stroke: brand.border }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: brand.textMuted }}
            axisLine={{ stroke: brand.border }}
            tickLine={false}
            tickFormatter={(v) => formatNumber(v as number)}
            width={60}
          />
          <Tooltip
            contentStyle={{
              background: brand.surface,
              border: `1px solid ${brand.border}`,
              borderRadius: 8,
              fontSize: 12
            }}
            formatter={(value) => [formatNumber(Number(value)), '검색량']}
            labelStyle={{ color: brand.textMuted }}
          />
          <Area
            type="monotone"
            dataKey="volume"
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#grad-${color.replace('#', '')})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function labelFor(i: number, total: number): string {
  // Assume latest month is current month; count backwards
  const now = new Date();
  const monthsAgo = total - 1 - i;
  const d = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);
  return `${d.getMonth() + 1}월`;
}
