import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FRACIONAMENTO_OPTIONS, SIMULATION_PRICES } from '@/constants/automovel-insurance';
import { INSURANCE_ACCENT } from '@/constants/insurance';

const NAVY = '#1A1A4E';

type Props = {
  visible: boolean;
  onClose: () => void;
  onContinue: () => void;
};

export function AutoSimulationModal({ visible, onClose, onContinue }: Props) {
  const insets = useSafeAreaInsets();
  const sheetY = useRef(new Animated.Value(640)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(false);
  const [holderType, setHolderType] = useState<'particular' | 'empresa'>('particular');
  const [fracionamento, setFracionamento] = useState('Anual');
  const [fracionamentoOpen, setFracionamentoOpen] = useState(false);

  useEffect(() => {
    if (!visible) {
      setFracionamentoOpen(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      sheetY.setValue(640);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(sheetY, { toValue: 0, duration: 320, useNativeDriver: true }),
      ]).start();
      return;
    }
    if (!mounted) return;
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 640, duration: 320, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [visible, mounted, overlayOpacity, sheetY]);

  return (
    <>
      <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose}>
        <Animated.View
          pointerEvents={visible ? 'auto' : 'none'}
          style={[styles.overlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: sheetY }],
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}>
          <View style={styles.sheetHeader}>
            <View style={styles.logoWrap}>
              <Text style={styles.logoViva}>PROTTEJA</Text>
              <Text style={styles.logoSeguros}>SEGUROS</Text>
            </View>
            <Pressable style={styles.closeBtn} onPress={onClose} accessibilityRole="button">
              <Ionicons name="close" size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          <View style={styles.coverageCard}>
            <View>
              <Text style={styles.coverageLabel}>COBERTURA</Text>
              <Text style={styles.coverageValue}>Responsabilidade Civil</Text>
            </View>
            <View style={styles.shieldWrap}>
              <Ionicons name="shield-outline" size={22} color="#EF4444" />
            </View>
          </View>

          <Text style={styles.totalTitle}>Total Simulação</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Trimestral</Text>
            <Text style={styles.priceValue}>AOA {SIMULATION_PRICES.trimestral}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Semestral</Text>
            <Text style={styles.priceValue}>AOA {SIMULATION_PRICES.semestral}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Anual</Text>
            <Text style={styles.priceValue}>AOA {SIMULATION_PRICES.anual}</Text>
          </View>

          <Text style={styles.sectionLabel}>Tipo de tomador de seguro?</Text>
          <View style={styles.typeRow}>
            <Pressable
              style={[styles.typeBtn, holderType === 'particular' && styles.typeBtnActive]}
              onPress={() => setHolderType('particular')}>
              <Ionicons
                name="person-outline"
                size={18}
                color={holderType === 'particular' ? '#FFFFFF' : '#9CA3AF'}
              />
              <Text style={[styles.typeText, holderType === 'particular' && styles.typeTextActive]}>
                Particular
              </Text>
            </Pressable>
            <Pressable
              style={[styles.typeBtn, holderType === 'empresa' && styles.typeBtnActive]}
              onPress={() => setHolderType('empresa')}>
              <Ionicons
                name="briefcase-outline"
                size={18}
                color={holderType === 'empresa' ? '#FFFFFF' : '#9CA3AF'}
              />
              <Text style={[styles.typeText, holderType === 'empresa' && styles.typeTextActive]}>
                Empresa
              </Text>
            </Pressable>
          </View>

          <Text style={styles.fracLabel}>Selecione o fracionamento</Text>
          <Pressable
            style={styles.fracField}
            onPress={() => setFracionamentoOpen(true)}
            accessibilityRole="button">
            <Text style={styles.fracValue}>{fracionamento}</Text>
            <Ionicons name="chevron-down" size={18} color="#FFFFFF" />
          </Pressable>

          <Pressable style={styles.continueBtn} onPress={onContinue}>
            <Text style={styles.continueText}>Continuar</Text>
          </Pressable>
        </Animated.View>

        {fracionamentoOpen ? (
          <View style={styles.pickerRoot} pointerEvents="box-none">
            <Pressable
              style={styles.pickerOverlay}
              onPress={() => setFracionamentoOpen(false)}
              accessibilityRole="button"
            />
            <View style={[styles.pickerSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
              <View style={styles.pickerHeader}>
                <Text style={styles.pickerTitle}>Fracionamento</Text>
                <Pressable
                  style={styles.pickerClose}
                  onPress={() => setFracionamentoOpen(false)}
                  accessibilityRole="button">
                  <Ionicons name="close" size={18} color="#FFFFFF" />
                </Pressable>
              </View>
              {FRACIONAMENTO_OPTIONS.map((option) => {
                const isSelected = option === fracionamento;
                return (
                  <Pressable
                    key={option}
                    style={[styles.pickerRow, isSelected && styles.pickerRowSelected]}
                    onPress={() => {
                      setFracionamento(option);
                      setFracionamentoOpen(false);
                    }}
                    accessibilityRole="button">
                    <Text style={[styles.pickerRowText, isSelected && styles.pickerRowTextSelected]}>
                      {option}
                    </Text>
                    {isSelected ? <Ionicons name="checkmark" size={18} color="#FFFFFF" /> : null}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ) : null}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: NAVY,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 22,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logoWrap: { alignItems: 'flex-start' },
  logoViva: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  logoSeguros: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 22,
  },
  coverageLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 0.8,
  },
  coverageValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  shieldWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(239,68,68,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionLabel: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  typeBtn: {
    flex: 1,
    height: 72,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  typeBtnActive: {
    backgroundColor: INSURANCE_ACCENT,
  },
  typeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  typeTextActive: {
    color: '#FFFFFF',
  },
  fracLabel: {
    marginTop: 18,
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  fracField: {
    marginTop: 10,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fracValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  continueBtn: {
    marginTop: 22,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700',
    color: NAVY,
  },
  pickerRoot: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
  },
  pickerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  pickerSheet: {
    backgroundColor: '#24306B',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  pickerClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  pickerRowSelected: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  pickerRowText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
  },
  pickerRowTextSelected: {
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
