import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COUNTRIES, flagEmojiFromIso2, type Country } from '@/constants/countries';
import { goBackFromOrigin } from '@/lib/navigation';

const BORDER = '#E6E6E6';

export default function KycStart() {
  const insets = useSafeAreaInsets();
  const { from } = useLocalSearchParams<{ from?: string }>();
  const top = useMemo(() => insets.top + 12, [insets.top]);
  const screenH = useMemo(() => Dimensions.get('window').height, []);
  const [country, setCountry] = useState<Country>({ code: 'AO', name: 'Angola' });
  const [docType, setDocType] = useState('');
  const [countryOpen, setCountryOpen] = useState(false);
  const sheetY = useRef(new Animated.Value(520)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [sheetMounted, setSheetMounted] = useState(false);

  const [docOpen, setDocOpen] = useState(false);
  const docSheetY = useRef(new Animated.Value(520)).current;
  const docOverlayOpacity = useRef(new Animated.Value(0)).current;
  const [docSheetMounted, setDocSheetMounted] = useState(false);

  const docTypes = useMemo(
    () => ['Bilhete de Identidade', 'Carta de Condução', 'Passaporte'],
    []
  );

  useEffect(() => {
    if (countryOpen) {
      setSheetMounted(true);
      sheetY.setValue(screenH);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(sheetY, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!sheetMounted) return;
    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(sheetY, {
        toValue: screenH,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setSheetMounted(false);
    });
  }, [countryOpen, overlayOpacity, sheetMounted, sheetY, screenH]);

  const closeCountry = () => setCountryOpen(false);

  useEffect(() => {
    if (docOpen) {
      setDocSheetMounted(true);
      docSheetY.setValue(screenH);
      docOverlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(docOverlayOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(docSheetY, {
          toValue: 0,
          duration: 380,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    if (!docSheetMounted) return;
    Animated.parallel([
      Animated.timing(docOverlayOpacity, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(docSheetY, {
        toValue: screenH,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) setDocSheetMounted(false);
    });
  }, [docOpen, docOverlayOpacity, docSheetMounted, docSheetY, screenH]);

  const closeDoc = () => setDocOpen(false);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: top }]}>
        <Pressable style={styles.backBtn} onPress={() => goBackFromOrigin(from)}>
          <Ionicons name="arrow-back" size={18} color="#111827" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verifique a sua identidade</Text>
        <Text style={styles.subtitle}>
          Por favor, escolha o país emissor do documento de identidade que você
          tem em mãos.
        </Text>

        <Text style={[styles.label, { marginTop: 28 }]}>
          País emissor do documento
        </Text>
        <Pressable
          style={styles.select}
          accessibilityRole="button"
          onPress={() => setCountryOpen(true)}
        >
          <View style={styles.selectLeft}>
            <Text style={styles.selectFlag}>{flagEmojiFromIso2(country.code)}</Text>
            <Text style={styles.selectValue}>{country.name}</Text>
          </View>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </Pressable>

        <Text style={[styles.label, { marginTop: 18 }]}>Tipo de documento</Text>
        <Pressable
          style={styles.select}
          accessibilityRole="button"
          onPress={() => setDocOpen(true)}
        >
          <Text style={[styles.selectValue, !docType && styles.placeholder]}>
            {docType || 'Selecione um tipo de documento'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#6B7280" />
        </Pressable>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 18) }]}>
        <Pressable
          style={styles.cta}
          accessibilityRole="button"
          onPress={() => router.push('/kyc/document')}
        >
          <Text style={styles.ctaText}>Continue</Text>
        </Pressable>
      </View>

      <Modal
        visible={sheetMounted}
        transparent
        animationType="none"
        onRequestClose={closeCountry}
      >
        <Animated.View
          pointerEvents={countryOpen ? 'auto' : 'none'}
          style={[styles.modalOverlay, { opacity: overlayOpacity }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeCountry} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: sheetY }], paddingTop: insets.top + 12 },
          ]}
        >
          <Pressable
            style={styles.sheetClose}
            onPress={closeCountry}
            accessibilityRole="button"
            hitSlop={12}
          >
            <Ionicons name="close" size={18} color="#111827" />
          </Pressable>

          <Text style={styles.sheetTitle}>Escolha um país</Text>

          <ScrollView
            style={styles.sheetScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {COUNTRIES.map((c) => {
              const selected = c.code === country.code;
              return (
                <Pressable
                  key={c.code}
                  style={styles.sheetItem}
                  accessibilityRole="button"
                  onPress={() => {
                    setCountry(c);
                    closeCountry();
                  }}
                >
                  <View style={styles.flagWrap}>
                    <Text style={styles.flag}>{flagEmojiFromIso2(c.code)}</Text>
                  </View>
                  <Text style={styles.countryName}>{c.name}</Text>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      </Modal>

      <Modal
        visible={docSheetMounted}
        transparent
        animationType="none"
        onRequestClose={closeDoc}
      >
        <Animated.View
          pointerEvents={docOpen ? 'auto' : 'none'}
          style={[styles.modalOverlay, { opacity: docOverlayOpacity }]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDoc} />
        </Animated.View>

        <Animated.View
          style={[
            styles.sheet,
            { transform: [{ translateY: docSheetY }], paddingTop: insets.top + 12 },
          ]}
        >
          <Pressable
            style={styles.sheetClose}
            onPress={closeDoc}
            accessibilityRole="button"
            hitSlop={12}
          >
            <Ionicons name="close" size={18} color="#111827" />
          </Pressable>

          <Text style={styles.sheetTitle}>Tipo de Documento</Text>

          <ScrollView
            style={styles.sheetScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {docTypes.map((t) => {
              const selected = t === docType;
              return (
                <Pressable
                  key={t}
                  style={styles.sheetItem}
                  accessibilityRole="button"
                  onPress={() => {
                    setDocType(t);
                    closeDoc();
                  }}
                >
                  <Text style={styles.countryName}>{t}</Text>
                  <View style={[styles.radio, selected && styles.radioSelected]}>
                    {selected ? <View style={styles.radioDot} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { paddingHorizontal: 22 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: { flex: 1, paddingHorizontal: 22, paddingTop: 18 },
  title: { fontSize: 26, fontWeight: '800', color: '#111827' },
  subtitle: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    color: '#6B7280',
    fontWeight: '500',
    maxWidth: 320,
  },
  label: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 10 },
  select: {
    height: 52,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: BORDER,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectLeft: { flexDirection: 'row', alignItems: 'center' },
  selectFlag: { fontSize: 16, marginRight: 10 },
  selectValue: { fontSize: 14, fontWeight: '500', color: '#111827' },
  placeholder: { color: '#9CA3AF' },
  footer: {
    paddingHorizontal: 22,
    paddingTop: 18,
  },
  cta: {
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1A1A4E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 18,
  },
  sheetClose: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  sheetScroll: {
    marginTop: 16,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  flagWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flag: { fontSize: 16 },
  countryName: { flex: 1, fontSize: 14, fontWeight: '700', color: '#111827' },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: { borderColor: '#111827' },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#111827',
  },
});

