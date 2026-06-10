import LottieView from 'lottie-react-native';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { KULEX_SCORE_MAX, KULEX_SCORE_MIN } from '@/constants/scoring';

const SCORING_LOTTIE = require('@/assets/animations/scoring-lottie.json');
const COUNT_DURATION_MS = 2000;
const LOTTIE_WIDTH = 298;
const LOTTIE_HEIGHT = 250;

/** Posições originais das camadas de texto no Lottie (298×250) */
const TEXT_CENTER_X = 156;
const TEXT_TOP_Y = 113.5;
const TEXT_BLOCK_WIDTH = 170;

type ScoreGaugeProps = {
  score: number;
  bandLabel: string;
  bandColor: string;
  width?: number;
};

export function ScoreGauge({ score, bandLabel, bandColor, width = 280 }: ScoreGaugeProps) {
  const animationRef = useRef<LottieView>(null);
  const [displayScore, setDisplayScore] = useState(0);
  const [showBand, setShowBand] = useState(false);
  const height = (width / LOTTIE_WIDTH) * LOTTIE_HEIGHT;
  const scale = width / LOTTIE_WIDTH;

  const textBlockWidth = TEXT_BLOCK_WIDTH * scale;
  const textBlockLeft = (TEXT_CENTER_X / LOTTIE_WIDTH) * width - textBlockWidth / 2;
  const textBlockTop = (TEXT_TOP_Y / LOTTIE_HEIGHT) * height;

  useEffect(() => {
    setDisplayScore(0);
    setShowBand(false);
    animationRef.current?.reset();
    animationRef.current?.play();

    const start = Date.now();
    let frameId = 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / COUNT_DURATION_MS);
      const eased = 1 - (1 - progress) ** 3;
      setDisplayScore(Math.round(score * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      setDisplayScore(score);
      setShowBand(true);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [score]);

  return (
    <View style={[styles.wrap, { width, height }]}>
      <LottieView
        ref={animationRef}
        source={SCORING_LOTTIE}
        autoPlay={false}
        loop={false}
        style={{ width, height }}
      />

      <View
        style={[
          styles.textCluster,
          {
            top: textBlockTop,
            left: textBlockLeft,
            width: textBlockWidth,
          },
        ]}
        pointerEvents="none">
        <Text style={styles.scoreLabel}>Scoring</Text>
        <Text style={styles.score}>{displayScore}</Text>
        {showBand ? (
          <Text style={[styles.band, { color: bandColor }]}>{bandLabel}</Text>
        ) : (
          <View style={styles.bandPlaceholder} />
        )}
        <Text style={styles.range}>
          {KULEX_SCORE_MIN} – {KULEX_SCORE_MAX}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCluster: {
    position: 'absolute',
    alignItems: 'center',
  },
  scoreLabel: {
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#00B4D8',
    letterSpacing: 0.2,
    includeFontPadding: false,
  },
  score: {
    width: '100%',
    textAlign: 'center',
    fontSize: 46,
    fontWeight: '800',
    color: '#282E38',
    letterSpacing: -0.5,
    lineHeight: 50,
    marginTop: 2,
    includeFontPadding: false,
    fontVariant: ['tabular-nums'],
  },
  band: {
    width: '100%',
    textAlign: 'center',
    marginTop: 0,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 18,
    includeFontPadding: false,
  },
  bandPlaceholder: {
    height: 18,
    marginTop: 0,
  },
  range: {
    width: '100%',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 14,
    includeFontPadding: false,
    fontVariant: ['tabular-nums'],
  },
});
