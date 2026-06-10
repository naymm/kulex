import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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
import {
  AddMoneyPrimaryButton,
  AddMoneyShell,
} from '@/components/add-money/AddMoneyShell';
import { CONTACTS, getContactById, type Contact } from '@/constants/contacts';
import { KIXIKILA_ORGANIZER_ID, KIXIKILA_ORGANIZER_NAME } from '@/constants/kixikila';

const NAVY = '#1A1A4E';

function MemberRow({
  contact,
  selected,
  disabled,
  onToggle,
}: {
  contact: Contact;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      style={[styles.memberRow, disabled && styles.memberRowDisabled]}
      accessibilityRole="button"
      disabled={disabled}
      onPress={onToggle}>
      <View style={[styles.avatar, { backgroundColor: contact.color }]}>
        <Text style={styles.avatarText}>{contact.initials}</Text>
      </View>
      <View style={styles.memberText}>
        <Text style={styles.memberName}>{contact.name}</Text>
        <Text style={styles.memberPhone}>{contact.phone}</Text>
      </View>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected ? <Ionicons name="checkmark" size={14} color={NAVY} /> : null}
      </View>
    </Pressable>
  );
}

function ContactSheetRow({
  contact,
  onPress,
}: {
  contact: Contact;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.sheetContactRow} accessibilityRole="button" onPress={onPress}>
      <View style={[styles.sheetAvatar, { backgroundColor: contact.color }]}>
        <Text style={styles.sheetAvatarText}>{contact.initials}</Text>
      </View>
      <View style={styles.sheetContactText}>
        <Text style={styles.sheetContactName}>{contact.name}</Text>
        <Text style={styles.sheetContactPhone}>{contact.phone}</Text>
      </View>
    </Pressable>
  );
}

export default function AdicionarMembroScreen() {
  const params = useLocalSearchParams<{
    groupName?: string;
    contribution?: string;
    frequency?: string;
    members?: string;
    protection?: string;
    debitDay?: string;
    durationMonths?: string;
  }>();

  const memberCapacity = Number(typeof params.members === 'string' ? params.members : '5');
  const requiredInvitees = Math.max(memberCapacity - 1, 1);
  const organizer = getContactById(KIXIKILA_ORGANIZER_ID);

  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
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

  const selectableContacts = useMemo(
    () => CONTACTS.filter((contact) => contact.id !== KIXIKILA_ORGANIZER_ID),
    []
  );

  const filteredContacts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return selectableContacts;
    return selectableContacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(normalized) ||
        contact.phone.replace(/\s/g, '').includes(normalized.replace(/\s/g, ''))
    );
  }, [query, selectableContacts]);

  const sheetContacts = useMemo(() => {
    const normalized = sheetQuery.trim().toLowerCase();
    if (!normalized) return selectableContacts;
    return selectableContacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(normalized) ||
        contact.phone.replace(/\s/g, '').includes(normalized.replace(/\s/g, ''))
    );
  }, [sheetQuery, selectableContacts]);

  const selectedCount = selectedIds.length + 1;
  const isComplete = selectedIds.length === requiredInvitees;

  const toggleContact = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= requiredInvitees) return prev;
      return [...prev, id];
    });
  };

  const selectFromSheet = (contact: Contact) => {
    setNewContactOpen(false);
    toggleContact(contact.id);
  };

  const handleContinue = () => {
    if (!isComplete) return;
    router.push({
      pathname: '/kixikila/criar/ordem',
      params: {
        ...params,
        selectedMembers: selectedIds.join(','),
      },
    });
  };

  return (
    <>
      <AddMoneyShell
        title="Adicionar Membro"
        footer={
          <AddMoneyPrimaryButton
            label="Continuar"
            onPress={handleContinue}
            disabled={!isComplete}
          />
        }>
        <View style={styles.summaryPill}>
          <Text style={styles.summaryText}>
            {selectedCount} de {memberCapacity} membros · faltam{' '}
            {Math.max(memberCapacity - selectedCount, 0)} para iniciar
          </Text>
        </View>

        {organizer ? (
          <View style={styles.organizerRow}>
            <View style={[styles.avatar, { backgroundColor: organizer.color }]}>
              <Text style={styles.avatarText}>{organizer.initials}</Text>
            </View>
            <View style={styles.memberText}>
              <Text style={styles.memberName}>{KIXIKILA_ORGANIZER_NAME}</Text>
              <Text style={styles.organizerBadge}>Organizador</Text>
            </View>
          </View>
        ) : null}

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
            <Ionicons name="add" size={24} color={NAVY} />
          </Pressable>
        </View>

        <FlatList
          data={filteredContacts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MemberRow
              contact={item}
              selected={selectedIds.includes(item.id)}
              disabled={!selectedIds.includes(item.id) && selectedIds.length >= requiredInvitees}
              onToggle={() => toggleContact(item.id)}
            />
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
        onRequestClose={() => setNewContactOpen(false)}>
        <Animated.View
          pointerEvents={newContactOpen ? 'auto' : 'none'}
          style={[styles.modalOverlay, { opacity: overlayOpacity }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setNewContactOpen(false)}
          />
        </Animated.View>

        <Animated.View style={[styles.sheet, { transform: [{ translateY: sheetY }] }]}>
          <Pressable
            style={styles.sheetClose}
            accessibilityRole="button"
            onPress={() => setNewContactOpen(false)}>
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
              <ContactSheetRow
                key={contact.id}
                contact={contact}
                onPress={() => selectFromSheet(contact)}
              />
            ))}
          </View>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  summaryPill: {
    marginTop: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  summaryText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
    marginTop: 8,
  },
  organizerBadge: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '600',
    color: '#C9A227',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
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
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  memberRowDisabled: {
    opacity: 0.45,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  memberText: {
    flex: 1,
  },
  memberName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  memberPhone: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.55)',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxSelected: {
    backgroundColor: '#FFFFFF',
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
  sheetContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  sheetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  sheetAvatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  sheetContactText: {
    flex: 1,
  },
  sheetContactName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  sheetContactPhone: {
    marginTop: 3,
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
});
