import { Fragment } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { INSURANCE_ACCENT } from '@/constants/insurance';

const INACTIVE = '#D1D5DB';
const NAVY = '#1A1A4E';
const CIRCLE_SIZE = 28;

type Props = {
  steps: readonly string[];
  currentStep: number;
};

export function InsuranceProgressStepper({ steps, currentStep }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.trackRow}>
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;
          const isLast = index === steps.length - 1;

          return (
            <Fragment key={label}>
              <View style={styles.circleWrap}>
                <View style={[styles.circle, isActive ? styles.circleActive : styles.circleInactive]}>
                  <Text style={[styles.circleText, isActive && styles.circleTextActive]}>
                    {stepNumber}
                  </Text>
                </View>
              </View>
              {!isLast ? (
                <View
                  style={[
                    styles.line,
                    stepNumber < currentStep ? styles.lineActive : styles.lineInactive,
                  ]}
                />
              ) : null}
            </Fragment>
          );
        })}
      </View>

      <View style={styles.labelsRow}>
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber <= currentStep;

          return (
            <View key={label} style={styles.labelCell}>
              <Text
                style={[styles.label, isActive ? styles.labelActive : styles.labelInactive]}
                numberOfLines={2}>
                {label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleWrap: {
    width: CIRCLE_SIZE,
    alignItems: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    backgroundColor: INSURANCE_ACCENT,
  },
  circleInactive: {
    backgroundColor: INACTIVE,
  },
  circleText: {
    fontSize: 12,
    fontWeight: '700',
    color: NAVY,
  },
  circleTextActive: {
    color: '#FFFFFF',
  },
  line: {
    flex: 1,
    height: 2,
    minWidth: 8,
  },
  lineActive: {
    backgroundColor: INSURANCE_ACCENT,
  },
  lineInactive: {
    backgroundColor: INACTIVE,
  },
  labelsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  labelCell: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
  },
  labelActive: {
    color: NAVY,
  },
  labelInactive: {
    color: '#9CA3AF',
  },
});
