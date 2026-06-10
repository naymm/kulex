import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { AddMoneyShell } from '@/components/add-money/AddMoneyShell';
import { CONTACTS, type Contact } from '@/constants/contacts';

function ContactRow({
  contact,
  onPress,
  variant = 'dark',
}: {
  contact: Contact;
  onPress: () => void;
  variant?: 'dark' | 'light';
}) {
  const isDark = variant === 'dark';

  return (
    <Pressable style={styles.contactRow} accessibilityRole="button" onPress={onPress}>
      <View style={[styles.contactAvatar, { backgroundColor: contact.color }]}>
        <Text style={[styles.contactInitials, isDark ? styles.initialsDark : styles.initialsLight]}>
          {contact.initials}
        </Text>
      </View>
      <View style={styles.contactText}>
        <Text style={[styles.contactName, isDark ? styles.nameDark : styles.nameLight]}>
          {contact.name}
        </Text>
        <Text style={[styles.contactPhone, isDark ? styles.phoneDark : styles.phoneLight]}>
          {contact.phone}
        </Text>
      </View>
    </Pressable>
  );
}

export default function SendMoneyContactsScreen() {
  const [query, setQuery] = useState('');
  const [newContactOpen, setNewContactOpen] = useState(false);
  const [sheetQuery, setSheetQuery] = useState('');
  const sheetY = useRef(new Animated.Value(520)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [sheetMounted, setSheetMounted] = useState(false);

  useEffect(() => {
    if (newContactOpen) {
      setSheetMounted(true);
      sheetY.setValue(520);
      overlayOpacity.setValue(0);
      Animated.parallel([
        Animated.timing(overlayOpacity, { toValue: 1, duration: 220, useNativeDriver: true }),
        Animated.timing(sheetY, { toValue: 0, duration: 190, useNativeDriver: true }),
      ]).start();
      return;
    }

    if (!sheetMounted) return;
    Animated.parallel([
      Animated.timing(overlayOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(sheetY, { toValue: 520, duration: 320, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) {
        setSheetMounted(false);
        setSheetQuery('');
      }
    });
  }, [newContactOpen, overlayOpacity, sheetMounted, sheetY]);

  const filteredContacts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return CONTACTS;
    return CONTACTS.filter(
      (contact) =>
        contact.name.toLowerCase().includes(normalized) ||
        contact.phone.replace(/\s/g, '').includes(normalized.replace(/\s/g, ''))
    );
  }, [query]);

  const sheetContacts = useMemo(() => {
    const normalized = sheetQuery.trim().toLowerCase();
    if (!normalized) return CONTACTS;
    return CONTACTS.filter(
      (contact) =>
        contact.name.toLowerCase().includes(normalized) ||
        contact.phone.replace(/\s/g, '').includes(normalized.replace(/\s/g, ''))
    );
  }, [sheetQuery]);

  const openContact = (contact: Contact) => {
    router.push({
      pathname: '/send-money/[contact]',
      params: { contact: contact.id },
    });
  };

  const closeNewContact = () => setNewContactOpen(false);

  const selectFromSheet = (contact: Contact) => {
    closeNewContact();
    openContact(contact);
  };

  return (
    <>
      <AddMoneyShell title="Contactos">
        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={18} color="rgba(255,255,255,0.55)" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Pesquisar contactos existentes"
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.searchInput}
            />
          </View>
          <Pressable
            style={styles.addButton}
            accessibilityRole="button"
            onPress={() => setNewContactOpen(true)}>
            <Ionicons name="add" size={24} color="#1A1A4E" />
          </Pressable>
        </View>

        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ContactRow contact={item} onPress={() => openContact(item)} variant="dark" />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          style={styles.list}
        />
      </AddMoneyShell>

      <Modal
        visible={sheetMounted}
        transparent
        animationType="none"
        onRequestClose={closeNewContact}>
        <Animated.View
          pointerEvents={newContactOpen ? 'auto' : 'none'}
          style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeNewContact} />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          <Pressable
            style={styles.sheetClose}
            accessibilityRole="button"
            onPress={closeNewContact}>
            <Ionicons name="close" size={18} color="#111827" />
          </Pressable>

          <Text style={styles.sheetTitle}>Novo Contacto</Text>

          <View style={styles.sheetSearchWrap}>
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              value={sheetQuery}
              onChangeText={setSheetQuery}
              placeholder="Nome, @lextag, telefone, email"
              placeholderTextColor="#9CA3AF"
              style={styles.sheetSearchInput}
              underlineColorAndroid="transparent"
            />
          </View>

          <Text style={styles.sectionLabel}>Na Kulex</Text>
          <View style={styles.sectionDivider} />

          <View style={styles.sheetContacts}>
            {sheetContacts.map((contact) => (
              <ContactRow
                key={contact.id}
                contact={contact}
                onPress={() => selectFromSheet(contact)}
                variant="light"
              />
            ))}
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 28,
  },
  searchWrap: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    padding: 0,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  contactInitials: {
    fontSize: 14,
    fontWeight: '800',
  },
  initialsDark: {
    color: '#FFFFFF',
  },
  initialsLight: {
    color: '#111827',
  },
  contactText: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
  },
  nameDark: {
    color: '#FFFFFF',
  },
  nameLight: {
    color: '#111827',
  },
  contactPhone: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
  },
  phoneDark: {
    color: 'rgba(255,255,255,0.55)',
  },
  phoneLight: {
    color: '#6B7280',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 24,
    minHeight: 520,
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
  sheetSearchWrap: {
    marginTop: 18,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sheetSearchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#111827',
  },
  sectionLabel: {
    marginTop: 22,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  sectionDivider: {
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  sheetContacts: {
    marginTop: 6,
  },
});
