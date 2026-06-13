import { useCallback, useState } from 'react';
import { PixelRatio, StyleSheet, type LayoutChangeEvent } from 'react-native';
import {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import type { EdgeInsets } from 'react-native-safe-area-context';

const TOOLBAR_EXPANDED = 62;
const TOOLBAR_COLLAPSED = 52;
const SHEET_OVERLAP = 8;

export function scaleHeroHeight(baseHeight: number): number {
  return Math.ceil(baseHeight * Math.max(1, PixelRatio.getFontScale()));
}

export function useCollapsibleHomeHeader(insets: EdgeInsets, baseHeroHeight: number) {
  const [heroHeight, setHeroHeight] = useState(() => scaleHeroHeight(baseHeroHeight));
  const scrollY = useSharedValue(0);
  const collapseRange = heroHeight;
  const expandedHeight = insets.top + 12 + TOOLBAR_EXPANDED + heroHeight;
  const collapsedHeight = insets.top + 8 + TOOLBAR_COLLAPSED;
  const paddingTopExpanded = insets.top + 12;
  const paddingTopCollapsed = insets.top + 6;

  const onHeroLayout = useCallback((event: LayoutChangeEvent) => {
    const measured = Math.ceil(event.nativeEvent.layout.height);
    if (measured > 0) {
      setHeroHeight((current) => (measured > current ? measured : current));
    }
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, collapseRange],
      [expandedHeight, collapsedHeight],
      Extrapolation.CLAMP,
    ),
    shadowOpacity: interpolate(scrollY.value, [0, collapseRange * 0.6], [0, 0.2], Extrapolation.CLAMP),
    elevation: interpolate(scrollY.value, [0, collapseRange * 0.6], [0, 8], Extrapolation.CLAMP),
  }));

  const headerPaddingStyle = useAnimatedStyle(() => ({
    paddingTop: interpolate(
      scrollY.value,
      [0, collapseRange],
      [paddingTopExpanded, paddingTopCollapsed],
      Extrapolation.CLAMP,
    ),
  }));

  const toolbarStyle = useAnimatedStyle(() => ({
    paddingBottom: interpolate(scrollY.value, [0, collapseRange], [14, 6], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, collapseRange], [0, -4], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [0, collapseRange], [1, 0.88], Extrapolation.CLAMP),
      },
    ],
  }));

  const heroContentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [0, collapseRange * 0.7],
      [1, 0],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(scrollY.value, [0, collapseRange], [0, -32], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [0, collapseRange], [1, 0.94], Extrapolation.CLAMP),
      },
    ],
  }));

  const sheetLiftStyle = useAnimatedStyle(() => ({
    marginTop: interpolate(
      scrollY.value,
      [0, collapseRange],
      [-SHEET_OVERLAP, -SHEET_OVERLAP - 6],
      Extrapolation.CLAMP,
    ),
  }));

  const headerBorderStyle = useAnimatedStyle(() => ({
    borderBottomWidth: interpolate(
      scrollY.value,
      [0, collapseRange * 0.5],
      [0, StyleSheet.hairlineWidth],
      Extrapolation.CLAMP,
    ),
    borderBottomColor: 'rgba(255,255,255,0.12)',
  }));

  return {
    scrollHandler,
    headerStyle,
    headerPaddingStyle,
    toolbarStyle,
    heroContentStyle,
    sheetLiftStyle,
    headerBorderStyle,
    expandedHeight,
    onHeroLayout,
  };
}
