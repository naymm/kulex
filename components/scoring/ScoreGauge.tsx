import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import {
  KULEX_SCORE_MAX,
  KULEX_SCORE_MIN,
  SCORE_BANDS,
} from '@/constants/scoring';
import { getScoreBand, getScoreProgress } from '@/lib/scoring';

const COUNT_DURATION_MS = 2000;
const GAUGE_WIDTH = 298;
const GAUGE_HEIGHT = 250;
/** Arco superior: 180° = esquerda (score baixo) → 360° = direita (score alto). */
const ARC_LEFT_DEG = 180;
const ARC_RIGHT_DEG = 360;

/** Centro e raios calibrados com o Lottie original (298×250). */
const CENTER_X_RATIO = 156 / GAUGE_WIDTH;
const CENTER_Y_RATIO = 144.5 / GAUGE_HEIGHT;
const ARC_RADIUS_RATIO = 118 / GAUGE_WIDTH;
const FACE_INSET = 14;

type ScoreGaugeProps = {
  score: number;
  bandLabel: string;
  bandColor: string;
  width?: number;
};

function polar(cx: number, cy: number, radius: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

function describeArc(cx: number, cy: number, radius: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, radius, startDeg);
  const end = polar(cx, cy, radius, endDeg);
  const sweep = endDeg > startDeg ? 1 : 0;
  const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

function scoreToAngle(score: number) {
  const progress = getScoreProgress(score);
  return ARC_LEFT_DEG + progress * (ARC_RIGHT_DEG - ARC_LEFT_DEG);
}

export function ScoreGauge({ score, bandLabel, bandColor, width = 280 }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showBand, setShowBand] = useState(false);

  const height = (width / GAUGE_WIDTH) * GAUGE_HEIGHT;
  const scale = width / GAUGE_WIDTH;

  const cx = width * CENTER_X_RATIO;
  const cy = height * CENTER_Y_RATIO;
  const arcRadius = width * ARC_RADIUS_RATIO;
  const strokeWidth = 22 * scale;
  const innerRadius = arcRadius - strokeWidth / 2 - FACE_INSET * scale;
  const pointerRadius = 11.5 * scale;
  const pointerStroke = 3.5 * scale;

  const fullArc = useMemo(
    () => describeArc(cx, cy, arcRadius, ARC_LEFT_DEG, ARC_RIGHT_DEG),
    [arcRadius, cx, cy],
  );

  const gradientStops = useMemo(() => {
    const step = 100 / SCORE_BANDS.length;
    const stops: { offset: string; color: string }[] = [];
    SCORE_BANDS.forEach((band, index) => {
      const start = (index * step).toFixed(1);
      const end = ((index + 1) * step).toFixed(1);
      stops.push({ offset: `${start}%`, color: band.color });
      if (index < SCORE_BANDS.length - 1) {
        stops.push({ offset: `${end}%`, color: band.color });
      }
    });
    return stops;
  }, []);

  const pointerAngle = scoreToAngle(animatedScore);
  const pointer = polar(cx, cy, arcRadius, pointerAngle);
  const pointerColor = showBand ? getScoreBand(Math.round(animatedScore)).color : '#1E88E5';

  const gradX1 = cx - arcRadius;
  const gradX2 = cx + arcRadius;

  useEffect(() => {
    setDisplayScore(0);
    setAnimatedScore(0);
    setShowBand(false);

    const start = Date.now();
    let frameId = 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(1, elapsed / COUNT_DURATION_MS);
      const eased = 1 - (1 - progress) ** 3;
      const nextScore = Math.round(score * eased);
      setDisplayScore(nextScore);
      setAnimatedScore(score * eased);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
        return;
      }

      setDisplayScore(score);
      setAnimatedScore(score);
      setShowBand(true);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [score]);

  const textTop = cy - innerRadius * 0.52;

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient
            id="scoreArcGradient"
            x1={gradX1}
            y1={cy}
            x2={gradX2}
            y2={cy}
            gradientUnits="userSpaceOnUse">
            {gradientStops.map((stop, index) => (
              <Stop key={`${stop.offset}-${index}`} offset={stop.offset} stopColor={stop.color} />
            ))}
          </LinearGradient>
        </Defs>

        <Circle cx={cx} cy={cy} r={innerRadius} fill="#F8FAFC" />

        <Path
          d={fullArc}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />

        <Path
          d={fullArc}
          stroke="url(#scoreArcGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
        />

        <Circle
          cx={pointer.x}
          cy={pointer.y}
          r={pointerRadius}
          fill={pointerColor}
          stroke="#FFFFFF"
          strokeWidth={pointerStroke}
        />
      </Svg>

      <View style={[styles.textCluster, { top: textTop, width }]} pointerEvents="none">
        <Text style={styles.scoreLabel}>Scoring</Text>
        <Text style={[styles.score, showBand && { color: bandColor }]}>{displayScore}</Text>
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
