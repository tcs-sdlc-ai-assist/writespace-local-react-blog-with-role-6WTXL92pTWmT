import React from 'react';

const colorMap = {
  violet: {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
  },
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
  },
  rose: {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
  },
  teal: {
    bg: 'bg-teal-100',
    text: 'text-teal-600',
  },
  pink: {
    bg: 'bg-pink-100',
    text: 'text-pink-600',
  },
};

export default function StatCard({ value, label, icon, color = 'indigo' }) {
  const colors = colorMap[color] || colorMap.indigo;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex items-center gap-4 hover:shadow-lg transition-shadow duration-200">
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-full ${colors.bg} ${colors.text} text-xl flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className={`text-2xl font-bold ${colors.text}`}>{value}</span>
        <span className="text-sm text-gray-500">{label}</span>
      </div>
    </div>
  );
}