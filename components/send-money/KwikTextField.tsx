import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'number-pad' | 'phone-pad';
  prefix?: string;
};

export function KwikTextField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  prefix,
}: Props) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {prefix ? (
        <View style={styles.inputWithPrefix}>
          <Text style={styles.prefix}>{prefix} </Text>
          <TextInput
            style={styles.inputInner}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.35)"
            keyboardType={keyboardType}
          />
        </View>
      ) : (
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.35)"
          keyboardType={keyboardType}
          autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.75)',
  },
  input: {
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  inputWithPrefix: {
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.22)',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefix: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  inputInner: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#FFFFFF',
    padding: 0,
  },
});
