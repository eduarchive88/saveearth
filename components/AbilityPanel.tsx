import React, { useState } from 'react';
import { GameState, CountryId } from '../types';

interface Props {
  gameState: GameState;
  onUseAbility: (countryId: CountryId, params?: any) => void;
}

const AbilityPanel: React.FC<Props> = ({ gameState, onUseAbility }) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryId | null>(null);
  const [rpsA, setRpsA] = useState<CountryId | null>(null);
  const [rpsB, setRpsB] = useState<CountryId | null>(null);

  const joinedCountries = Object.values(gameState.countries).filter(c => c.isJoined);

  return (
    <div className="glass p-8 rounded-3xl border border-white/10">
      <h3 className="text-3xl font-black mb-6 text-purple-400">특수 능력 발동</h3>
      
      <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {joinedCountries.map(c => (
          <div key={c.id} className={`p-4 rounded-2xl border-2 ${c.isAbilityUsed ? 'bg-white/5 border-white/10 opacity-50' : 'bg-purple-600/20 border-purple-500/50'}`}>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{c.flag}</span>
                <div>
                  <div className="font-black text-lg">{c.nickname}</div>
                  <div className="text-xs text-purple-400">{c.abilityName}</div>
                </div>
              </div>
              {!c.isAbilityUsed && c.gp >= 5 && (
                <button
                  onClick={() => {
                    if (c.id === 'KOREA') {
                      setSelectedCountry(c.id as CountryId);
                    } else {
                      onUseAbility(c.id as CountryId);
                    }
                  }}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl font-black text-sm"
                >
                  발동
                </button>
              )}
            </div>
            <div className="text-xs text-white/60">{c.abilityDesc}</div>
          </div>
        ))}
      </div>

      {selectedCountry === 'KOREA' && (
        <div className="mt-6 p-6 bg-blue-600/20 rounded-2xl border-2 border-blue-500">
          <h4 className="font-black mb-4">대한민국 녹색성장: 대결 국가 선택</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <select 
              value={rpsA || ''} 
              onChange={(e) => setRpsA(e.target.value as CountryId)}
              className="p-3 bg-black/40 rounded-xl border border-white/20"
            >
              <option value="">국가 A 선택</option>
              {joinedCountries.map(c => (
                <option key={c.id} value={c.id}>{c.nickname}</option>
              ))}
            </select>
            <select 
              value={rpsB || ''} 
              onChange={(e) => setRpsB(e.target.value as CountryId)}
              className="p-3 bg-black/40 rounded-xl border border-white/20"
            >
              <option value="">국가 B 선택</option>
              {joinedCountries.map(c => (
                <option key={c.id} value={c.id}>{c.nickname}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => {
              if (rpsA && rpsB && rpsA !== rpsB) {
                onUseAbility('KOREA', { targetA: rpsA, targetB: rpsB });
                setSelectedCountry(null);
                setRpsA(null);
                setRpsB(null);
              }
            }}
            disabled={!rpsA || !rpsB || rpsA === rpsB}
            className="w-full p-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 rounded-xl font-black"
          >
            대결 시작
          </button>
        </div>
      )}
    </div>
  );
};

export default AbilityPanel;
