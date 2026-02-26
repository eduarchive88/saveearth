import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GameState, CountryId, Country } from './types';
import { COUNTRIES, INITIAL_TEMPERATURE, MAX_TURNS } from './constants';
import * as syncService from './services/syncService';
import * as gameLogic from './gameLogic';
import TemperatureGauge from './components/TemperatureGauge';
import CountrySelection from './components/CountrySelection';
import HostView from './components/HostView';
import GuestView from './components/GuestView';

const App: React.FC = () => {
  const [role, setRole] = useState<'HOST' | 'GUEST' | null>(null);
  const [myCountryId, setMyCountryId] = useState<CountryId | null>(null);
  const [roomInput, setRoomInput] = useState('');
  const [nicknameInput, setNicknameInput] = useState('');
  const [isRoomEntered, setIsRoomEntered] = useState(false);
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const [finalCoins, setFinalCoins] = useState<Record<CountryId, number>>({} as any);

  const [gameState, setGameState] = useState<GameState>({
    roomId: '', phase: 'LOBBY', turn: 1, temperature: INITIAL_TEMPERATURE,
    countries: JSON.parse(JSON.stringify(COUNTRIES)), logs: ['🌍 기후 워룸 시스템 가동'],
    timer: 0, currentQuizId: null, selectedQuizIds: [], customQuizzes: [],
    rpsTargetA: null, rpsTargetB: null, rpsChoiceA: null, rpsChoiceB: null,
    lastTurnChoices: {} as any,
    activeEffects: { swedenWaiting: false, japanActive: false, denmarkTurnsLeft: 0, franceActive: false, brazilActive: false, tuvaluWaiting: false }
  });

  const processedActionIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (role === 'HOST' && isRoomEntered && gameState.phase !== 'LOBBY' && gameState.phase !== 'END' && gameState.phase !== 'SETUP') {
      const interval = setInterval(() => {
        setGameState(prev => {
          if (prev.timer <= 0) return prev;
          const next = { ...prev, timer: prev.timer - 1 };
          if (next.timer % 2 === 0) syncService.syncGameState(next);
          return next;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [role, isRoomEntered, gameState.phase]);

  useEffect(() => {
    if (role === 'HOST' && gameState.timer === 0 && gameState.phase !== 'LOBBY' && gameState.phase !== 'END' && gameState.phase !== 'SETUP') {
      handleNextPhase();
    }
  }, [gameState.timer, role]);

  useEffect(() => {
    if (isRoomEntered && gameState.roomId) {
      if (role === 'GUEST') {
        const stop = syncService.pollGameState(gameState.roomId, (newState) => {
          if (nicknameInput && !myCountryId) {
            const me = Object.values(newState.countries).find((c: Country) => c.nickname === nicknameInput);
            if (me) setMyCountryId(me.id as CountryId);
          }
          setGameState(newState);
        });
        return () => stop();
      } else {
        const stop = syncService.pollActions(gameState.roomId, (actions) => {
          actions.forEach(action => {
            if (!processedActionIds.current.has(action.id)) {
              processedActionIds.current.add(action.id);
              handleAction(action);
            }
          });
        });
        return () => stop();
      }
    }
  }, [isRoomEntered, role, gameState.roomId, nicknameInput, myCountryId]);

  const handleAction = (action: any) => {
    setGameState(prev => {
      let next = { ...prev };
      const cid = action.countryId as CountryId;
      if (!next.countries[cid]) return prev;

      switch (action.type) {
        case 'JOIN':
          if (!next.countries[cid].isJoined) {
            next.countries[cid].isJoined = true;
            next.countries[cid].nickname = action.nickname;
            next.logs = [`🚩 ${next.countries[cid].flag} ${action.nickname} 참가`, ...next.logs];
          }
          break;
        case 'SELECT_DEVELOPMENT':
          next.countries[cid].lastChoice = action.choice;
          break;
        case 'QUIZ_RESULT':
          next.countries[cid].isCorrect = action.correct;
          if (!action.correct) {
            next.temperature += 0.1;
            next.logs = [`❌ ${next.countries[cid].nickname} 오답 → 기온 +0.1°C`, ...next.logs];
          } else {
            if (next.countries['USA'].isAbilityUsed && cid === 'USA') {
              next.temperature -= 0.5;
              next.logs = [`🇺🇸 미국 CCS 기술 발동 → 기온 -0.5°C`, ...next.logs];
            }
          }
          break;
        case 'RPS_CHOICE':
          if (cid === next.rpsTargetA) next.rpsChoiceA = action.choice;
          if (cid === next.rpsTargetB) next.rpsChoiceB = action.choice;
          if (next.rpsChoiceA && next.rpsChoiceB) {
            next = gameLogic.resolveRPS(next, next.rpsChoiceA, next.rpsChoiceB);
            next.rpsChoiceA = null;
            next.rpsChoiceB = null;
          }
          break;
      }
      syncService.syncGameState(next);
      return next;
    });
  };

  const handleEnterRoom = async (r: 'HOST' | 'GUEST') => {
    const rid = roomInput.trim().toUpperCase();
    if (!rid) return alert("방 코드 입력");
    if (r === 'GUEST' && !nicknameInput.trim()) return alert("닉네임 입력");
    
    setRole(r);
    setIsRoomEntered(true);
    
    if (r === 'HOST') {
      const initial = { ...gameState, roomId: rid };
      setGameState(initial);
      await syncService.syncGameState(initial);
      await syncService.clearActions(rid);
    } else {
      setGameState(prev => ({ ...prev, roomId: rid }));
      setShowCountrySelect(true);
    }
  };

  const handleCountrySelect = async (id: CountryId) => {
    setMyCountryId(id);
    setShowCountrySelect(false);
    await syncService.sendAction(gameState.roomId, { type: 'JOIN', countryId: id, nickname: nicknameInput });
  };

  const handleNextPhase = () => {
    setGameState(prev => {
      let next = { ...prev };
      
      if (next.phase === 'LOBBY') {
        next.phase = 'SETUP';
      } else if (next.phase === 'SETUP') {
        if (next.selectedQuizIds.length < MAX_TURNS) {
          alert(`최소 ${MAX_TURNS}개 퀴즈 필요`);
          return prev;
        }
        next.phase = 'DEVELOPMENT';
        next.timer = 30;
      } else if (next.phase === 'DEVELOPMENT') {
        next = gameLogic.applyDevelopmentChoices(next);
        Object.values(next.countries).forEach((c: Country) => {
          if (c.lastChoice) next.lastTurnChoices[c.id as CountryId] = c.lastChoice;
        });
        next.phase = 'QUIZ';
        next.timer = 60;
        next.currentQuizId = next.selectedQuizIds[next.turn - 1];
      } else if (next.phase === 'QUIZ') {
        next.phase = 'DISCUSSION';
        next.timer = 180;
      } else if (next.phase === 'DISCUSSION') {
        Object.values(next.countries).forEach((c: Country) => {
          c.isCorrect = null;
          c.lastChoice = null;
        });
        
        if (next.turn === 4) {
          next.phase = 'UN_MEETING';
          next.timer = 60;
        } else if (next.turn === MAX_TURNS) {
          next.phase = 'END';
          setFinalCoins(gameLogic.calculateFinalCoins(next));
        } else {
          next.turn++;
          next.phase = 'DEVELOPMENT';
          next.timer = 30;
        }
      } else if (next.phase === 'UN_MEETING') {
        next = gameLogic.calculateUNMeeting(next);
        next.turn++;
        next.phase = 'DEVELOPMENT';
        next.timer = 30;
      }
      
      if (next.temperature >= 20) {
        next.phase = 'END';
        next.logs = ['💀 지구 멸망! 게임 종료', ...next.logs];
      }
      
      syncService.syncGameState(next);
      return next;
    });
  };

  const handleUseAbility = (countryId: CountryId, params?: any) => {
    setGameState(prev => {
      const next = gameLogic.useAbility(prev, countryId, params);
      syncService.syncGameState(next);
      return next;
    });
  };

  if (!isRoomEntered) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-950">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8 w-full max-w-md">
          <h1 className="text-8xl font-black text-white">CLIMATE <span className="text-emerald-400">WAR</span></h1>
          <div className="space-y-4">
            <input type="text" placeholder="방 코드" value={roomInput} onChange={(e) => setRoomInput(e.target.value.toUpperCase())} className="w-full p-6 bg-black/40 border-2 border-emerald-500/30 rounded-3xl text-center text-3xl font-black text-white" />
            <input type="text" placeholder="닉네임" value={nicknameInput} onChange={(e) => setNicknameInput(e.target.value)} className="w-full p-5 bg-black/40 border border-white/10 rounded-2xl text-center text-2xl font-bold text-white" />
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => handleEnterRoom('HOST')} className="p-6 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-xl">교사</button>
              <button onClick={() => handleEnterRoom('GUEST')} className="p-6 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xl">학생</button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (showCountrySelect) {
    return <CountrySelection countries={gameState.countries} onSelect={handleCountrySelect} />;
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 ${gameState.temperature >= 19 ? 'animate-crisis' : ''}`}>
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-6xl font-black text-white">{gameState.phase}</h1>
              <p className="text-xl text-emerald-400 font-bold">ROUND {gameState.turn} / {MAX_TURNS}</p>
            </div>
            <div className="text-right">
              <div className="text-7xl font-black text-white">{gameState.timer}s</div>
              {role === 'HOST' && gameState.phase !== 'LOBBY' && gameState.phase !== 'END' && (
                <button onClick={handleNextPhase} className="mt-4 px-12 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-2xl">다음 ▶</button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="space-y-6">
              <TemperatureGauge temp={gameState.temperature} />
              <div className="glass p-6 rounded-3xl h-96 flex flex-col">
                <h3 className="text-sm font-black uppercase opacity-40 mb-4">로그</h3>
                <div className="overflow-y-auto flex-1 space-y-2 custom-scrollbar">
                  {gameState.logs.map((log, i) => (
                    <div key={i} className="text-sm border-l-2 border-emerald-500/50 pl-3 py-2">{log}</div>
                  ))}
                </div>
              </div>
            </aside>

            <main className="lg:col-span-3">
              {role === 'HOST' ? (
                <HostView gameState={gameState} setGameState={setGameState} onUseAbility={handleUseAbility} />
              ) : myCountryId ? (
                <GuestView gameState={gameState} myCountryId={myCountryId} finalCoins={finalCoins} />
              ) : null}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
