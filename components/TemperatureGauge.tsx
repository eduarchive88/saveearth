
import React from 'react';

interface Props {
  temp: number;
}

const TemperatureGauge: React.FC<Props> = ({ temp }) => {
  const percentage = Math.min(100, Math.max(0, ((temp - 15) / (20 - 15)) * 100));
  
  let colorClass = "bg-blue-400";
  let statusText = "안정적";
  let Icon = '❄️';

  if (temp >= 16) { colorClass = "bg-green-400"; statusText = "변화 시작"; Icon = '🌱'; }
  if (temp >= 17) { colorClass = "bg-yellow-400"; statusText = "위험 감지"; Icon = '⚠️'; }
  if (temp >= 18) { colorClass = "bg-orange-500"; statusText = "심각한 파괴"; Icon = '🔥'; }
  if (temp >= 19) { colorClass = "bg-red-600 animate-pulse"; statusText = "인류 위기"; Icon = '☠️'; }
  if (temp >= 20) { colorClass = "bg-black text-white"; statusText = "지구 멸망"; Icon = '💀'; }

  return (
    <div className="flex flex-col items-center w-full p-6 glass rounded-3xl border border-white/20 shadow-xl">
      <div className="flex justify-between w-full mb-3 px-2 text-sm font-bold uppercase tracking-wider">
        <span>15.0°C</span>
        <span className="text-red-400 font-extrabold">20.0°C</span>
      </div>
      <div className="relative w-full h-12 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700 shadow-inner">
        <div 
          className={`h-full transition-all duration-1000 ease-out flex items-center justify-end px-4 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 15 && <span className="font-bold drop-shadow-md text-slate-900">{temp.toFixed(1)}°C</span>}
        </div>
      </div>
      <div className={`mt-4 flex items-center gap-3 text-xl font-bold ${temp >= 19 ? 'text-red-500 animate-pulse' : ''}`}>
        <span className="text-3xl">{Icon}</span>
        <span>{statusText}</span>
      </div>
    </div>
  );
};

export default TemperatureGauge;
