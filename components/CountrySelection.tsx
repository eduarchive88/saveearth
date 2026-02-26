import React from 'react';
import { motion } from 'framer-motion';
import { Country, CountryId } from '../types';

interface Props {
  countries: Record<CountryId, Country>;
  onSelect: (id: CountryId) => void;
}

const CountrySelection: React.FC<Props> = ({ countries, onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-black italic text-white mb-4">국가 선택</h1>
          <p className="text-2xl text-emerald-400 font-bold">당신의 국가를 선택하세요</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.values(countries).map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => !c.isJoined && onSelect(c.id as CountryId)}
              disabled={c.isJoined}
              className={`p-8 rounded-3xl border-4 transition-all ${
                c.isJoined 
                  ? 'bg-white/5 border-white/10 opacity-30 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-emerald-600/20 to-blue-600/20 border-emerald-500/50 hover:scale-105 hover:border-emerald-400'
              }`}
            >
              <div className="text-8xl mb-4">{c.flag}</div>
              <h3 className="text-3xl font-black mb-2">{c.name}</h3>
              <div className="text-emerald-400 font-bold text-xl mb-4">초기 GP: {c.gp}</div>
              <div className="bg-black/40 p-4 rounded-xl mb-2">
                <div className="text-sm font-bold text-blue-400 mb-1">{c.abilityName}</div>
                <div className="text-xs text-white/70">{c.abilityDesc}</div>
              </div>
              {c.isJoined && (
                <div className="mt-4 text-red-400 font-black text-lg">이미 선택됨</div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountrySelection;
