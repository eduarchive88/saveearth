import React from 'react';
import { motion } from 'framer-motion';
import { GameState, CountryId, Country } from '../types';
import { QUIZ_POOL } from '../constants';
import * as syncService from '../services/syncService';

interface Props {
  gameState: GameState;
  myCountryId: CountryId;
  finalCoins: Record<CountryId, number>;
}

const GuestView: React.FC<Props> = ({ gameState, myCountryId, finalCoins }) => {
  const myCountry = gameState.countries[myCountryId];

  if (gameState.phase === 'DEVELOPMENT') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 rounded-3xl space-y-12">
        <div className="text-center">
          <div className="text-8xl mb-4">{myCountry.flag}</div>
          <h2 className="text-5xl font-black">{myCountry.nickname}</h2>
          <div className="text-3xl font-black text-emerald-400 mt-4">{myCountry.gp} GP</div>
        </div>
        
        <div className="space-y-8">
          <h3 className="text-4xl font-black text-center">개발 전략 선택</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: 'ECONOMIC', label: '경제 우선', desc: '+10 GP', color: 'orange', icon: '🏭' },
              { id: 'BALANCED', label: '균형 개발', desc: '+8 GP', color: 'emerald', icon: '⚖️' },
              { id: 'ENVIRONMENTAL', label: '환경 우선', desc: '+5 GP', color: 'sky', icon: '🌱' }
            ].map(btn => (
              <motion.button
                key={btn.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => syncService.sendAction(gameState.roomId, { type: 'SELECT_DEVELOPMENT', countryId: myCountryId, choice: btn.id })}
                className={`p-10 rounded-3xl border-4 ${myCountry.lastChoice === btn.id ? `bg-${btn.color}-600/40 border-${btn.color}-400` : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <div className="text-6xl mb-4">{btn.icon}</div>
                <div className="text-2xl font-black">{btn.label}</div>
                <div className="text-lg text-white/60">{btn.desc}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  if (gameState.phase === 'QUIZ') {
    const q = [...QUIZ_POOL, ...gameState.customQuizzes].find(q => q.id === gameState.currentQuizId);
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 rounded-3xl space-y-12">
        <h2 className="text-4xl font-black text-center text-purple-400">환경 퀴즈</h2>
        {q && (
          <>
            <p className="text-4xl font-black text-center">{q.question}</p>
            <div className="grid grid-cols-2 gap-6">
              {q.options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    syncService.sendAction(gameState.roomId, { type: 'QUIZ_RESULT', countryId: myCountryId, correct: i === q.answer });
                  }}
                  disabled={myCountry.isCorrect !== null}
                  className={`p-8 rounded-2xl border-4 text-2xl font-black ${myCountry.isCorrect !== null ? 'opacity-30' : 'bg-white/5 border-white/10 hover:bg-purple-600/20'}`}
                >
                  {i + 1}. {opt}
                </motion.button>
              ))}
            </div>
            {myCountry.isCorrect !== null && (
              <div className="text-3xl font-black text-center text-emerald-400">제출 완료!</div>
            )}
          </>
        )}
      </motion.div>
    );
  }

  if (gameState.phase === 'DISCUSSION' || gameState.phase === 'UN_MEETING') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 rounded-3xl text-center space-y-8">
        <div className="text-8xl">{myCountry.flag}</div>
        <h2 className="text-5xl font-black">{myCountry.nickname}</h2>
        <div className="text-4xl font-black text-emerald-400">{myCountry.gp} GP</div>
        <div className="text-2xl text-white/60">회의 진행 중...</div>
      </motion.div>
    );
  }

  if (gameState.phase === 'END') {
    const ranked = Object.values(gameState.countries)
      .filter((c: Country) => c.isJoined)
      .sort((a, b) => b.gp - a.gp);
    const myRank = ranked.findIndex(c => c.id === myCountryId) + 1;
    const myCoins = finalCoins[myCountryId] || 0;

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 rounded-3xl text-center space-y-8">
        <h2 className="text-6xl font-black">게임 종료</h2>
        <div className="text-8xl">{myCountry.flag}</div>
        <div className="text-5xl font-black">{myCountry.nickname}</div>
        <div className="space-y-4">
          <div className="text-4xl font-black">순위: {myRank}위</div>
          <div className="text-4xl font-black text-emerald-400">{myCountry.gp} GP</div>
          <div className="text-5xl font-black text-yellow-400">🪙 {myCoins} 코인</div>
        </div>
        <div className="text-2xl text-white/60">최종 기온: {gameState.temperature.toFixed(1)}°C</div>
      </motion.div>
    );
  }

  if (gameState.rpsTargetA === myCountryId || gameState.rpsTargetB === myCountryId) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 rounded-3xl space-y-12">
        <h2 className="text-4xl font-black text-center">가위바위보 대결!</h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { id: 'ROCK', label: '바위', icon: '✊' },
            { id: 'PAPER', label: '보', icon: '✋' },
            { id: 'SCISSORS', label: '가위', icon: '✌️' }
          ].map(btn => (
            <motion.button
              key={btn.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => syncService.sendAction(gameState.roomId, { type: 'RPS_CHOICE', countryId: myCountryId, choice: btn.id })}
              className="p-12 rounded-3xl bg-white/5 hover:bg-blue-600/20 border-4 border-white/10"
            >
              <div className="text-7xl mb-4">{btn.icon}</div>
              <div className="text-2xl font-black">{btn.label}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-12 rounded-3xl text-center space-y-8">
      <div className="text-8xl">{myCountry.flag}</div>
      <h2 className="text-5xl font-black">{myCountry.nickname}</h2>
      <div className="text-4xl font-black text-emerald-400">{myCountry.gp} GP</div>
      <div className="text-2xl text-white/60">대기 중...</div>
    </motion.div>
  );
};

export default GuestView;
