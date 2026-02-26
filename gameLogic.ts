import { GameState, Country, CountryId, DevelopmentChoice } from './types';

export const applyDevelopmentChoices = (state: GameState): GameState => {
  const next = { ...state };
  Object.values(next.countries).forEach((c: Country) => {
    if (!c.isJoined || !c.lastChoice) return;
    
    let choice = c.lastChoice;
    
    // 브라질 능력: 경제/환경 반전
    if (next.activeEffects.brazilActive && c.id !== 'BRAZIL') {
      if (choice === 'ECONOMIC') choice = 'ENVIRONMENTAL';
      else if (choice === 'ENVIRONMENTAL') choice = 'ECONOMIC';
    }
    
    // 일본/덴마크/프랑스 강제 환경 우선
    const forcedEnv = (next.activeEffects.japanActive && next.lastTurnChoices[c.id] === 'ECONOMIC') ||
                      (next.activeEffects.denmarkTurnsLeft > 0 && isTopThreeGP(c.id, next)) ||
                      (next.activeEffects.franceActive && c.id !== 'FRANCE');
    
    if (forcedEnv) choice = 'ENVIRONMENTAL';
    
    // GP 적용
    if (choice === 'ECONOMIC') c.gp += 10;
    else if (choice === 'BALANCED') c.gp += 8;
    else if (choice === 'ENVIRONMENTAL') c.gp += 5;
  });
  
  // 스웨덴 능력 체크
  if (next.activeEffects.swedenWaiting) {
    const allEnv = Object.values(next.countries).every((c: Country) => 
      !c.isJoined || c.lastChoice === 'ENVIRONMENTAL'
    );
    if (allEnv) {
      next.temperature -= 0.4;
      next.logs = ['🇸🇪 스웨덴 능력 발동! 전 세계 환경 우선 → 기온 -0.4°C', ...next.logs];
    }
    next.activeEffects.swedenWaiting = false;
  }
  
  // 턴 종료 시 효과 감소
  if (next.activeEffects.denmarkTurnsLeft > 0) next.activeEffects.denmarkTurnsLeft--;
  next.activeEffects.japanActive = false;
  next.activeEffects.franceActive = false;
  next.activeEffects.brazilActive = false;
  
  return next;
};

export const calculateUNMeeting = (state: GameState): GameState => {
  const next = { ...state };
  const totalGP = Object.values(next.countries).reduce((sum: number, c: Country) => 
    c.isJoined ? sum + c.gp : sum, 0
  );
  
  let tempChange = 0;
  if (totalGP <= 45) tempChange = -0.2;
  else if (totalGP <= 55) tempChange = 0.1;
  else if (totalGP <= 65) tempChange = 0.3;
  else if (totalGP <= 75) tempChange = 0.6;
  else if (totalGP <= 85) tempChange = 0.9;
  else tempChange = 1.2;
  
  next.temperature += tempChange;
  next.logs = [`🌍 UN 환경보전회의: 총 GP ${totalGP} → 기온 ${tempChange >= 0 ? '+' : ''}${tempChange}°C`, ...next.logs];
  
  // GP 재분배
  Object.values(next.countries).forEach((c: Country) => {
    if (!c.isJoined) return;
    if (c.gp <= 45) {
      next.logs = [`🟢 ${c.nickname} 지속가능 달성 (GP ${c.gp})`, ...next.logs];
    } else if (c.gp >= 55) {
      const others = Object.values(next.countries).filter((o: Country) => o.isJoined && o.id !== c.id);
      const share = Math.floor(1);
      others.forEach((o: Country) => o.gp += share);
      c.gp -= share * others.length;
      next.logs = [`🔴 ${c.nickname} 환경파괴 → GP ${share * others.length} 분배`, ...next.logs];
    }
  });
  
  return next;
};

export const calculateFinalCoins = (state: GameState): Record<CountryId, number> => {
  const coins: Record<string, number> = {};
  const temp = state.temperature;
  
  let prizes = [0, 0, 0];
  if (temp < 16) prizes = [4500, 4000, 2500];
  else if (temp < 17) prizes = [3600, 3200, 2000];
  else if (temp < 18) prizes = [2700, 2400, 1500];
  else if (temp < 19) prizes = [1700, 1600, 1000];
  else if (temp < 20) prizes = [900, 800, 500];
  
  const ranked = Object.values(state.countries)
    .filter((c: Country) => c.isJoined)
    .sort((a, b) => b.gp - a.gp);
  
  ranked.forEach((c, i) => {
    coins[c.id] = prizes[i] || 0;
  });
  
  return coins as Record<CountryId, number>;
};

const isTopThreeGP = (id: CountryId, state: GameState): boolean => {
  const sorted = Object.values(state.countries)
    .filter((c: Country) => c.isJoined)
    .sort((a, b) => b.gp - a.gp);
  return sorted.slice(0, 3).some(c => c.id === id);
};

export const useAbility = (state: GameState, countryId: CountryId, params?: any): GameState => {
  const next = { ...state };
  const country = next.countries[countryId];
  
  if (country.isAbilityUsed || country.gp < 5) return state;
  
  country.gp -= 5;
  country.isAbilityUsed = true;
  
  switch (countryId) {
    case 'KOREA':
      next.rpsTargetA = params.targetA;
      next.rpsTargetB = params.targetB;
      next.logs = [`🇰🇷 대한민국 녹색성장 발동! ${params.targetA} vs ${params.targetB}`, ...next.logs];
      break;
    case 'USA':
      next.logs = [`🇺🇸 미국 CCS 기술 활성화!`, ...next.logs];
      break;
    case 'SWEDEN':
      next.activeEffects.swedenWaiting = true;
      next.logs = [`🇸🇪 스웨덴 인간 환경 선언 발동!`, ...next.logs];
      break;
    case 'JAPAN':
      if (next.temperature >= 17) {
        next.activeEffects.japanActive = true;
        next.logs = [`🇯🇵 일본 교토의정서 발동! 경제 우선 국가 강제 환경 우선`, ...next.logs];
      }
      break;
    case 'TUVALU':
      if (next.temperature >= 18) {
        next.activeEffects.tuvaluWaiting = true;
        next.logs = [`🇹🇻 투발루 가라앉는 섬 발동! 지원국 모집 중...`, ...next.logs];
      }
      break;
    case 'DENMARK':
      if (next.temperature >= 17) {
        next.activeEffects.denmarkTurnsLeft = 2;
        next.logs = [`🇩🇰 덴마크 코펜하겐 협약 발동! 상위 3국 2턴간 환경 우선 강제`, ...next.logs];
      }
      break;
    case 'FRANCE':
      if (next.temperature >= 19) {
        next.activeEffects.franceActive = true;
        next.logs = [`🇫🇷 프랑스 파리협약 발동! 전 국가 환경 우선 강제`, ...next.logs];
      }
      break;
    case 'BRAZIL':
      next.activeEffects.brazilActive = true;
      next.logs = [`🇧🇷 브라질 리우 회의 발동! 경제/환경 선택 반전`, ...next.logs];
      break;
    case 'NKOREA':
      next.temperature += 1.0;
      next.logs = [`🇰🇵 북한 핵 발사! 기온 +1.0°C`, ...next.logs];
      break;
  }
  
  return next;
};

export const resolveRPS = (state: GameState, choiceA: 'ROCK' | 'PAPER' | 'SCISSORS', choiceB: 'ROCK' | 'PAPER' | 'SCISSORS'): GameState => {
  const next = { ...state };
  if (!next.rpsTargetA || !next.rpsTargetB) return state;
  
  const wins = { ROCK: 'SCISSORS', PAPER: 'ROCK', SCISSORS: 'PAPER' };
  let loser: CountryId | null = null;
  
  if (wins[choiceA] === choiceB) loser = next.rpsTargetB;
  else if (wins[choiceB] === choiceA) loser = next.rpsTargetA;
  
  if (loser) {
    next.countries[loser].gp -= 5;
    next.temperature -= 0.3;
    next.logs = [`✊ 가위바위보 결과: ${loser} 패배 → GP -5, 기온 -0.3°C`, ...next.logs];
  } else {
    next.logs = [`✊ 가위바위보 무승부`, ...next.logs];
  }
  
  next.rpsTargetA = null;
  next.rpsTargetB = null;
  return next;
};
