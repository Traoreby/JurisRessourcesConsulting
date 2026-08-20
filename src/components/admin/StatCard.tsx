import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  description?: string;
  highlight?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-2xl p-6 border shadow-sm flex flex-col gap-4 ${
        highlight ? "border-accent/40 bg-accent/5" : "border-slate-100"
      }`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            highlight ? "bg-accent text-primary" : "bg-primary/5 text-primary"
          }`}
        >
          {icon}
        </div>
        <span className="text-3xl font-extrabold text-primary">{value}</span>
      </div>
      <div>
        <p className="font-semibold text-primary text-sm">{title}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
