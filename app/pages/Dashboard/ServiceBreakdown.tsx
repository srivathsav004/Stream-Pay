import React from 'react';
import Card from '@/components/ui/Card';
import Separator from '@/components/ui/Separator';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ServiceUsageData } from './types';

interface ServiceBreakdownProps {
  serviceData: ServiceUsageData[];
  activeDays?: number;
}

const ServiceBreakdown: React.FC<ServiceBreakdownProps> = ({ serviceData, activeDays }) => {
  const totalAmount = (serviceData || []).reduce((sum, service) => sum + service.amount, 0);
  const totalSessions = (serviceData || []).reduce((sum, service) => sum + (service.sessions || 0), 0);
  const avgPerSession = totalSessions > 0 ? (totalAmount / totalSessions) : 0;
  const mostUsed = (serviceData || []).reduce((max, s) => {
    if (!max) return s;
    return (max.sessions || 0) > (s.sessions || 0) ? max : s;
  }, serviceData?.[0]);

  // Prepare data for donut chart
  const chartData = (serviceData || []).map((service) => ({
    name: service.service,
    value: service.sessions || 0,
    color: service.color,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const service = serviceData.find((s) => s.service === data.name);
      return (
        <div className="bg-[#141414] border border-[#262626] rounded-lg p-3 shadow-lg">
          <p className="text-sm font-semibold text-white mb-1">{data.name}</p>
          <p className="text-sm text-[#a1a1a1]">
            Transactions: {data.value}
          </p>
          {service && (
            <>
              <p className="text-xs text-[#a1a1a1] mt-1">Total spent: {service.amount.toFixed(3)} USDC</p>
              <p className="text-xs text-[#a1a1a1]">
                Avg per pay: {(service.amount / service.sessions).toFixed(3)} USDC
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mb-8 items-stretch">
      <Card className="p-6 xl:col-span-3 h-full flex flex-col">
        <h2 className="text-lg font-semibold text-white mb-6">Service Usage</h2>
        <div className="flex-1 min-h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={CustomLabel}
                outerRadius="78%"
                innerRadius="55%"
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => {
                  const service = (serviceData || []).find((s) => s.service === value);
                  const totalTx = (serviceData || []).reduce((sum, s) => sum + (s.sessions || 0), 0);
                  const percentage = service && totalTx > 0 ? (service.sessions / totalTx) * 100 : 0;
                  return service ? `${value} (${Math.round(percentage)}%)` : value;
                }}
                wrapperStyle={{ color: '#ffffff', fontSize: '12px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="pt-4 border-t border-[#262626]">
          <div className="text-sm text-[#a1a1a1]">Total: {totalSessions} transactions</div>
        </div>
      </Card>

      <Card className="p-6 xl:col-span-2 h-full flex flex-col">
        <h2 className="text-lg font-semibold text-white mb-6">Usage Metrics</h2>
        <div className="flex flex-1 flex-col gap-6">
          <div>
            <div className="text-xs tracking-wide text-[#a1a1a1] uppercase mb-1">Total Spent (All Time)</div>
            <div className="text-2xl md:text-[28px] font-semibold text-white">{totalAmount.toFixed(2)} USDC</div>
            {/* <div className="text-sm text-[#a1a1a1]">—</div> */}
          </div>
          <Separator />
          <div>
            <div className="text-xs tracking-wide text-[#a1a1a1] uppercase mb-1">Avg Per Pay</div>
            <div className="text-2xl md:text-[28px] font-semibold text-white">{avgPerSession.toFixed(3)} USDC</div>
            <div className="text-sm text-[#a1a1a1]">
              Average USDC spent per payment transaction
            </div>
          </div>
          <Separator />
          <div>
            <div className="text-xs tracking-wide text-[#a1a1a1] uppercase mb-1">Most Used Service</div>
            <div className="text-2xl md:text-[28px] font-semibold text-white">{mostUsed ? mostUsed.service : '—'}</div>
            <div className="text-sm text-[#a1a1a1]">{mostUsed ? `${mostUsed.sessions} payments` : '—'}</div>
          </div>
          <Separator />
          <div>
            <div className="text-xs tracking-wide text-[#a1a1a1] uppercase mb-1">Active Days</div>
            <div className="text-2xl md:text-[28px] font-semibold text-white">{activeDays ?? 0}</div>
            <div className="text-sm text-[#a1a1a1]">Days with at least one paid usage</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServiceBreakdown;

