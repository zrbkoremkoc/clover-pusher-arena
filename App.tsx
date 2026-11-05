/**
 * CloverPusherArena — virtual-coin coin-pusher arcade.
 *
 * App.tsx is the screen state machine only; all gameplay lives in
 * src/screens/GameScreen.tsx. No react-navigation, conditional render only.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { DEFAULT_SETTINGS, START_BALANCE } from './src/constants/config';
import type { AppSettings } from './src/constants/config';
import theme from './src/constants/theme';
import BreakReminderModal from './src/components/BreakReminderModal';
import useRefillTimer from './src/hooks/useRefillTimer';
import useSessionReminder from './src/hooks/useSessionReminder';
import AboutScreen from './src/screens/AboutScreen';
import AlbumScreen from './src/screens/AlbumScreen';
import CabinetsScreen from './src/screens/CabinetsScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import GameScreen from './src/screens/GameScreen';
import type { RoundSummary } from './src/screens/GameScreen';
import GuideScreen from './src/screens/GuideScreen';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'gameover'
  | 'album'
  | 'cabinets'
  | 'guide'
  | 'settings'
  | 'about';

const EMPTY_SUMMARY: RoundSummary = { collected: 0, bonuses: 0, charms: 0 };

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [balance, setBalance] = useState(START_BALANCE);
  const [charms, setCharms] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [activeCabinet, setActiveCabinet] = useState('meadow');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [summary, setSummary] = useState<RoundSummary>(EMPTY_SUMMARY);
  const [roundKey, setRoundKey] = useState(0);

  const { tray, trayRef, msLeft, consume, refillNow } = useRefillTimer();
  const reminder = useSessionReminder(settings.reminderMinutes);

  const screenRef = useRef(screen);
  screenRef.current = screen;

  // Android hardware back: anything but the lobby returns to the lobby.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = screenRef.current;
      if (current === 'menu' || current === 'loader') {
        return false;
      }
      setScreen('menu');
      return true;
    });
    return () => sub.remove();
  }, []);

  const addBalance = useCallback((amount: number) => {
    setBalance(prev => prev + amount);
  }, []);

  const handleCharmFound = useCallback(() => {
    setCharms(prev => prev + 1);
  }, []);

  const startRound = useCallback(() => {
    if (trayRef.current <= 0) {
      refillNow();
    }
    setRoundKey(k => k + 1);
    setScreen('game');
  }, [refillNow, trayRef]);

  const handleGameOver = useCallback((result: RoundSummary) => {
    setSummary(result);
    setRounds(prev => prev + 1);
    setScreen('gameover');
  }, []);

  const resetBalance = useCallback(() => {
    setBalance(START_BALANCE);
    setCharms(0);
    refillNow();
  }, [refillNow]);

  const goMenu = useCallback(() => setScreen('menu'), []);

  const handleNavigate = useCallback(
    (key: 'cabinets' | 'album' | 'guide' | 'settings' | 'about') => setScreen(key),
    [],
  );

  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          balance={balance}
          tray={tray}
          msLeft={msLeft}
          charms={charms}
          reducedMotion={settings.reducedMotion}
          onPlay={startRound}
          onNavigate={handleNavigate}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={roundKey}
          balance={balance}
          tray={tray}
          trayRef={trayRef}
          consumeTray={consume}
          hapticStrength={settings.haptic}
          reducedMotion={settings.reducedMotion}
          onAddBalance={addBalance}
          onCharmFound={handleCharmFound}
          onGameOver={handleGameOver}
          onHome={goMenu}
        />
      ) : null}

      {screen === 'gameover' ? (
        <GameOverScreen
          collected={summary.collected}
          bonuses={summary.bonuses}
          charms={summary.charms}
          balance={balance}
          rounds={rounds}
          reducedMotion={settings.reducedMotion}
          onPlayAgain={startRound}
          onMenu={goMenu}
        />
      ) : null}

      {screen === 'cabinets' ? (
        <CabinetsScreen
          rounds={rounds}
          activeId={activeCabinet}
          onSelect={setActiveCabinet}
          onBack={goMenu}
        />
      ) : null}

      {screen === 'album' ? <AlbumScreen charms={charms} onBack={goMenu} /> : null}

      {screen === 'guide' ? <GuideScreen onBack={goMenu} /> : null}

      {screen === 'settings' ? (
        <SettingsScreen
          settings={settings}
          onChange={setSettings}
          onResetBalance={resetBalance}
          onBack={goMenu}
        />
      ) : null}

      {screen === 'about' ? <AboutScreen onBack={goMenu} /> : null}

      <BreakReminderModal
        visible={reminder.due && screen !== 'loader'}
        minutes={settings.reminderMinutes}
        onContinue={reminder.dismiss}
        onLobby={() => {
          reminder.dismiss();
          goMenu();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.deep },
});

export default App;
