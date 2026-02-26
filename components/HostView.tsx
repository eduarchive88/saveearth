import React, { useState } from 'react';
import { GameState, QuizQuestion, Country } from '../types';
import { QUIZ_POOL, MAX_TURNS } from '../constants';
import AbilityPanel from './AbilityPanel';

interface Props {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onUseAbility: (countryId: any, params?: any) => void;
}

const HostView: React.FC<Props> = ({ gameState, setGameState, onUseAbility }) => {
  const [newQuiz, setNewQuiz] = useState({ question: '', options: ['', '', '', ''], answer: 0 });

  if (gameState.phase === 'SETUP') {
    return (
      <div className="glass p-10 rounded-3xl space-y-8">
        <h2 className="text-4xl font-black">퀴즈 설정</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4 h-[600px] overflow-y-auto custom-scrollbar">
            <h3 className="text-2xl font-black text-emerald-400">퀴즈 뱅크 ({gameState.selectedQuizIds.length}/{MAX_TURNS})</h3>
            {QUIZ_POOL.map(q => (
              <div
                key={q.id}
                onClick={() => {
                  const isSel = gameState.selectedQuizIds.includes(q.id);
                  const nextSel = isSel ? gameState.selectedQuizIds.filter(id => id !== q.id) : [...gameState.selectedQuizIds, q.id];
                  if (nextSel.length <= MAX_TURNS) setGameState(prev => ({ ...prev, selectedQuizIds: nextSel }));
                }}
                className={`p-4 rounded-xl cursor-pointer ${gameState.selectedQuizIds.includes(q.id) ? 'bg-emerald-600/30 border-2 border-emerald-500' : 'bg-white/5 hover:bg-white/10'}`}
              >
                <div className="font-bold">{q.question}</div>
                {gameState.selectedQuizIds.includes(q.id) && (
                  <div className="text-sm text-emerald-300 mt-2">정답: {q.answer + 1}번</div>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-blue-400">커스텀 퀴즈</h3>
            <input type="text" placeholder="질문" value={newQuiz.question} onChange={e => setNewQuiz({ ...newQuiz, question: e.target.value })} className="w-full p-4 bg-white/5 rounded-xl" />
            <div className="grid grid-cols-2 gap-2">
              {newQuiz.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`선택지 ${i + 1}`}
                  value={opt}
                  onChange={e => {
                    const opts = [...newQuiz.options];
                    opts[i] = e.target.value;
                    setNewQuiz({ ...newQuiz, options: opts });
                  }}
                  onClick={() => setNewQuiz({ ...newQuiz, answer: i })}
                  className={`p-3 rounded-lg ${newQuiz.answer === i ? 'bg-blue-600/30 border-2 border-blue-500' : 'bg-white/5'}`}
                />
              ))}
            </div>
            <button
              onClick={() => {
                const q: QuizQuestion = { id: Date.now(), question: newQuiz.question, options: [...newQuiz.options], answer: newQuiz.answer, explanation: '' };
                setGameState(prev => ({ ...prev, customQuizzes: [...prev.customQuizzes, q], selectedQuizIds: [...prev.selectedQuizIds, q.id].slice(0, MAX_TURNS) }));
                setNewQuiz({ question: '', options: ['', '', '', ''], answer: 0 });
              }}
              className="w-full p-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-black"
            >
              추가
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (gameState.phase === 'QUIZ') {
    const q = [...QUIZ_POOL, ...gameState.customQuizzes].find(q => q.id === gameState.currentQuizId);
    return (
      <div className="glass p-10 rounded-3xl text-center space-y-8">
        <h2 className="text-4xl font-black text-purple-400">퀴즈 진행 중</h2>
        {q && (
          <>
            <p className="text-5xl font-black">{q.question}</p>
            <div className="grid grid-cols-2 gap-6">
              {q.options.map((opt, i) => (
                <div key={i} className={`p-6 rounded-2xl ${i === q.answer ? 'bg-emerald-600/30 border-2 border-emerald-500' : 'bg-white/5'}`}>
                  <span className="font-black text-2xl">{i + 1}. {opt}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (gameState.phase === 'DISCUSSION' || gameState.phase === 'DEVELOPMENT' || gameState.phase === 'UN_MEETING') {
    return (
      <div className="space-y-8">
        <div className="glass p-8 rounded-3xl">
          <h2 className="text-3xl font-black mb-6">국가 현황</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(gameState.countries).filter((c: Country) => c.isJoined).map((c: Country) => (
              <div key={c.id} className="p-6 bg-white/5 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl">{c.flag}</span>
                  <div>
                    <div className="text-2xl font-black">{c.nickname}</div>
                    <div className="text-xs opacity-50">{c.name}</div>
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-400">{c.gp} GP</div>
                {c.lastChoice && <div className="text-sm mt-2 text-blue-400">선택: {c.lastChoice}</div>}
                {c.isCorrect !== null && (
                  <div className={`text-sm mt-2 ${c.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                    퀴즈: {c.isCorrect ? '정답' : '오답'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <AbilityPanel gameState={gameState} onUseAbility={onUseAbility} />
      </div>
    );
  }

  if (gameState.phase === 'END') {
    return (
      <div className="glass p-10 rounded-3xl text-center space-y-8">
        <h2 className="text-6xl font-black">게임 종료</h2>
        <div className="text-4xl font-black">최종 기온: {gameState.temperature.toFixed(1)}°C</div>
        <div className="space-y-4">
          {Object.values(gameState.countries)
            .filter((c: Country) => c.isJoined)
            .sort((a, b) => b.gp - a.gp)
            .map((c: Country, i) => (
              <div key={c.id} className="p-6 bg-white/5 rounded-2xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black">{i + 1}위</span>
                  <span className="text-4xl">{c.flag}</span>
                  <span className="text-2xl font-black">{c.nickname}</span>
                </div>
                <div className="text-3xl font-black text-emerald-400">{c.gp} GP</div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  return null;
};

export default HostView;
