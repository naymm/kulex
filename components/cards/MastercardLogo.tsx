import { View, StyleSheet } from 'react-native';

export function MastercardLogo({ size = 36 }: { size?: number }) {
  const overlap = size * 0.42;

  return (
    <View style={[styles.wrap, { width: size * 1.55, height: size }]}>
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#EB001B',
            left: 0,
          },
        ]}
      />
      <View
        style={[
          styles.circle,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: '#F79E1B',
            left: overlap,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    top: 0,
    opacity: 0.95,
  },
});
