import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  View,
  Vibration,
} from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import assets from '../assets';
import {
  AUTO_DROP_MS,
  BOARD_BORDER,
  BOARD_MAX_W,
  BOARD_PAD,
  COLS,
  LIP_HEIGHT,
  SHELF_LINE_RATIO,
  TRAY_SIZE,
} from '../constants/config';
import theme from '../constants/theme';
import { collectValue, kindForDrop } from '../game/economy';
import type { CoinBody } from '../game/physics';
import type { SpinResult } from '../game/reels';
import AppShell from '../components/AppShell';
import Cabinet from '../components/Cabinet';
import Coin from '../components/Coin';
import CoinBalance from '../components/CoinBalance';
import CloverSpinOverlay from '../components/CloverSpinOverlay';
import CoinShowerOverlay from '../components/CoinShowerOverlay';
import ControlBar from '../components/ControlBar';
import DropRail from '../components/DropRail';
import GhostButton from '../components/GhostButton';
import IconButton from '../components/IconButton';
import PrimaryButton from '../components/PrimaryButton';
import ScreenHeader from '../components/ScreenHeader';
import usePusherPhysics from '../hooks/usePusherPhysics';

const SCREEN_W = Dimensions.get('window').width;

// Board frame maths — the parent's padding + border never counts toward the
// children's content box, so the cabinet width is derived from the cell size.
const FRAME = BOARD_PAD + BOARD_BORDER;
const CAB_MAX = Math.min(SCREEN_W - 32, BOARD_MAX_W);
const CELL = Math.floor((CAB_MAX - 2 * FRAME) / COLS);
const PLAY_W = CELL * COLS;
const CABINET_W = PLAY_W + 2 * FRAME;
const COIN_SIZE = Math.min(30, CELL - 2);
const SLOT_W = 46;

export type RoundSummary = { collected: number; bonuses: number; charms: number };

type Props = {
  balance: number;
  tray: number;
  trayRef: React.MutableRefObject<number>;
  consumeTray: () => boolean;
  hapticStrength: 'off' | 'soft' | 'strong';
  reducedMotion: boolean;
  onAddBalance: (amount: number) => void;
  onCharmFound: () => void;
  onGameOver: (summary: RoundSummary) => void;
  onHome: () => void;
};

/** Pusher Cabinet — G2 floating-controls layout. */
export function GameScreen({
  balance,
  tray,
  trayRef,
  consumeTray,
  hapticStrength,
  reducedMotion,
  onAddBalance,
  onCharmFound,
  onGameOver,
  onHome,
}: Props) {
  const [fieldH, setFieldH] = useState(0);
  const [collected, setCollected] = useState(0);
  const [bonuses, setBonuses] = useState(0);
  const [charms, setCharms] = useState(0);
  const [autoOn, setAutoOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [spinVisible, setSpinVisible] = useState(false);
  const [shower, setShower] = useState(0);

  const dropIndexRef = useRef(0);
  const overRef = useRef(false);

  // Mirrors so the frame-loop callbacks never read stale state, and a late-bound
  // handle on the live coin array the physics hook owns.
  const bodiesHandle = useRef<CoinBody[]>([]);
  const removeHandle = useRef<(id: number) => void>(() => {});
  const collectedRef = useRef(0);
  const bonusRef = useRef(0);
  const charmRef = useRef(0);
  collectedRef.current = collected;
  bonusRef.current = bonuses;
  charmRef.current = charms;

  const lipFlash = useRef(new Animated.Value(0)).current;
  const slotGlow = useRef(new Animated.Value(0.25)).current;
  const riseY = useRef(new Animated.Value(reducedMotion ? 0 : 40)).current;
  const riseOpacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;

  const buzz = useCallback(
    (pattern: number | number[]) => {
      if (hapticStrength === 'off' || reducedMotion) {
        return;
      }
      if (typeof pattern === 'number') {
        Vibration.vibrate(hapticStrength === 'soft' ? Math.max(4, pattern / 2) : pattern);
      } else {
        Vibration.vibrate(pattern);
      }
    },
    [hapticStrength, reducedMotion],
  );

  const field = useMemo(
    () => ({
      width: PLAY_W,
      height: fieldH,
      coin: COIN_SIZE,
      lip: LIP_HEIGHT,
      shelfLine: fieldH * SHELF_LINE_RATIO,
    }),
    [fieldH],
  );

  const busy = spinVisible || shower > 0 || paused;

  const handleCollect = useCallback(
    (coin: CoinBody) => {
      if (coin.kind === 'charm') {
        setCharms(c => c + 1);
        onCharmFound();
        buzz(22);
        return;
      }
      const value = collectValue(coin.kind);
      setCollected(c => c + value);
      onAddBalance(value);
      buzz(22);
      lipFlash.setValue(0.9);
      Animated.timing(lipFlash, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    },
    [buzz, lipFlash, onAddBalance, onCharmFound],
  );

  const handleLand = useCallback(() => {
    buzz(8);
  }, [buzz]);

  const physics = usePusherPhysics({
    field,
    active: !busy && !overRef.current && fieldH > 0,
    onCollect: handleCollect,
    onLand: handleLand,
    onSettled: () => {
      if (overRef.current) {
        return;
      }
      // A golden token at rest inside the centre slot opens Clover Spin; the
      // slot swallows the token so the bonus cannot retrigger off it.
      const line = fieldH * SHELF_LINE_RATIO;
      const golden = bodiesHandle.current.find(
        b =>
          b.kind === 'golden' &&
          Math.abs(b.x - PLAY_W / 2) < SLOT_W / 2 &&
          b.y > line - 34 &&
          b.y < line + 58,
      );
      if (golden) {
        removeHandle.current(golden.id);
        buzz([0, 30, 40, 30]);
        setSpinVisible(true);
        return;
      }
      if (trayRef.current <= 0) {
        overRef.current = true;
        onGameOver({
          collected: collectedRef.current,
          bonuses: bonusRef.current,
          charms: charmRef.current,
        });
      }
    },
  });

  const { drop, coins, getMotion, shelfY, remove, bodiesRef } = physics;
  bodiesHandle.current = bodiesRef.current;
  removeHandle.current = remove;

  const doDrop = useCallback(
    (railX: number) => {
      if (busy || overRef.current || fieldH <= 0) {
        return;
      }
      if (!consumeTray()) {
        return;
      }
      dropIndexRef.current += 1;
      const kind = kindForDrop(dropIndexRef.current);
      drop(railX - FRAME, kind);
      buzz(8);
    },
    [busy, buzz, consumeTray, drop, fieldH],
  );

  const dropCentre = useCallback(() => {
    doDrop(FRAME + PLAY_W / 2 + (Math.random() * 40 - 20));
  }, [doDrop]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    Animated.parallel([
      Animated.spring(riseY, { toValue: 0, useNativeDriver: true, ...theme.animation.entry }),
      Animated.timing(riseOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [reducedMotion, riseOpacity, riseY]);

  useEffect(() => {
    if (reducedMotion) {
      slotGlow.setValue(0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(slotGlow, { toValue: 0.7, duration: 750, useNativeDriver: true }),
        Animated.timing(slotGlow, { toValue: 0.2, duration: 750, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [reducedMotion, slotGlow]);

  useEffect(() => {
    if (!autoOn || busy) {
      return;
    }
    const id = setInterval(dropCentre, AUTO_DROP_MS);
    return () => clearInterval(id);
  }, [autoOn, busy, dropCentre]);

  const handleSpinFinish = useCallback(
    (result: SpinResult) => {
      setSpinVisible(false);
      setBonuses(b => b + 1);
      if (result.outcome === 'three') {
        setShower(result.reward);
      } else {
        setCollected(c => c + result.reward);
        onAddBalance(result.reward);
      }
    },
    [onAddBalance],
  );

  const handleShowerFinish = useCallback(() => {
    setCollected(c => c + shower);
    onAddBalance(shower);
    setShower(0);
  }, [onAddBalance, shower]);

  const endSession = useCallback(() => {
    if (overRef.current) {
      return;
    }
    overRef.current = true;
    setPaused(false);
    onGameOver({ collected, bonuses, charms });
  }, [bonuses, charms, collected, onGameOver]);

  const handleFieldLayout = useCallback((e: LayoutChangeEvent) => {
    setFieldH(e.nativeEvent.layout.height);
  }, []);

  return (
    <AppShell gradient={theme.gradients.game}>
      <ScreenHeader
        title="MEADOW CABINET"
        subtitle={'TRAY ' + tray + ' / ' + TRAY_SIZE}
        leftSlot={<IconButton label="Back to lobby" Icon={ArrowLeft} onPress={onHome} />}
        rightSlot={
          <View style={styles.headerRight}>
            <CoinBalance value={balance} compact />
            <IconButton
              label="Pause"
              source={assets.iconPause}
              size={40}
              onPress={() => setPaused(true)}
            />
          </View>
        }
      />

      <View style={styles.railWrap}>
        <DropRail width={CABINET_W} disabled={busy} onDrop={doDrop} />
      </View>

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.arena,
          { opacity: riseOpacity, transform: [{ translateY: riseY }] },
        ]}>
        <Cabinet
          cabinetWidth={CABINET_W}
          playWidth={PLAY_W}
          cellSize={CELL}
          fieldHeight={fieldH}
          shelfY={shelfY}
          lipFlash={lipFlash}
          slotGlow={slotGlow}
          slotWidth={SLOT_W}
          onFieldLayout={handleFieldLayout}>
          {coins.map(c => {
            const motion = getMotion(c.id);
            if (!motion) {
              return null;
            }
            return <Coin key={c.id} kind={c.kind} size={COIN_SIZE} motion={motion} />;
          })}
        </Cabinet>
      </Animated.View>

      <ControlBar
        collected={collected}
        autoOn={autoOn}
        disabled={busy || tray <= 0}
        onDrop={dropCentre}
        onAuto={() => setAutoOn(v => !v)}
        onHome={onHome}
      />

      <CloverSpinOverlay
        visible={spinVisible}
        panelWidth={CABINET_W}
        reducedMotion={reducedMotion}
        onFinish={handleSpinFinish}
      />

      <CoinShowerOverlay
        visible={shower > 0}
        amount={shower}
        reducedMotion={reducedMotion}
        onFinish={handleShowerFinish}
      />

      {paused ? (
        <View style={StyleSheet.absoluteFill}>
          <View style={styles.scrim} pointerEvents="none" />
          <View style={styles.pauseCenter} pointerEvents="box-none">
            <View style={styles.pauseCard}>
              <View pointerEvents="none" style={styles.pauseHighlight} />
              <Text style={styles.pauseTitle}>PAUSED</Text>
              <Text style={styles.pauseBody}>
                All coins, tokens and charms in this arena are virtual.
              </Text>
              <PrimaryButton label="KEEP PLAYING" onPress={() => setPaused(false)} />
              <GhostButton label="END SESSION" onPress={endSession} />
              <GhostButton label="BACK TO LOBBY" onPress={onHome} />
            </View>
          </View>
        </View>
      ) : null}
    </AppShell>
  );
}

const styles = StyleSheet.create({
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  railWrap: { paddingHorizontal: 16, paddingTop: 10, alignItems: 'center' },
  arena: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 128,
  },
  scrim: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.ui.scrim },
  pauseCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  pauseCard: {
    width: '100%',
    borderRadius: 28,
    backgroundColor: theme.colors.bg.surface,
    borderWidth: 2,
    borderColor: theme.colors.accent.gold,
    padding: 22,
    alignItems: 'center',
    gap: 12,
    overflow: 'hidden',
    ...theme.shadows.clay,
  },
  pauseHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: theme.colors.ui.highlight,
  },
  pauseTitle: { fontSize: 26, fontWeight: '900', letterSpacing: 2, color: theme.colors.text.primary },
  pauseBody: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 19,
    textAlign: 'center',
    color: theme.colors.text.secondary,
    marginBottom: 4,
  },
});

export default GameScreen;
