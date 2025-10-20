import React, { useMemo, useState } from 'react';
import { Alert, StatusBar, useColorScheme, View, ScrollView, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { NewAppScreen } from '@react-native/new-app-screen';
import data from './Data';
import Square from './Square';
import styles from './style';


const S = StyleSheet.create({
  section: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginVertical: 8, elevation: 1 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  row: { gap: 8 },
  label: { fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#f9fafb' },
  btn: { backgroundColor: '#2563eb', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  btnText: { color: '#fff', fontWeight: '700' },
  success: { color: '#059669', fontWeight: '700', marginTop: 6 },
  box: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 10, padding: 10, backgroundColor: '#f9fafb', marginTop: 6 },
  output: { fontWeight: '600' },
  seq: { maxHeight: 140 },
});

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={S.section}>
    <Text style={S.title}>{title}</Text>
    <View style={S.row}>{children}</View>
  </View>
);

const Field: React.FC<{ label: string; value: string; onChangeText: (t: string) => void; keyboardType?: 'default' | 'numeric'; placeholder?: string; }>
  = ({ label, value, onChangeText, keyboardType = 'default', placeholder }) => (
    <View>
      <Text style={S.label}>{label}</Text>
      <TextInput style={S.input} value={value} onChangeText={onChangeText} keyboardType={keyboardType} placeholder={placeholder} />
    </View>
  );

const Button: React.FC<{ title: string; onPress: () => void }> = ({ title, onPress }) => (
  <TouchableOpacity onPress={onPress} style={S.btn}>
    <Text style={S.btnText}>{title}</Text>
  </TouchableOpacity>
);

// 1) Employee form
type EmployeeFormProps = { initialFullName?: string; initialAge?: number; initialOccupation?: string; initialSpecialization?: string; };
const EmployeeForm: React.FC<EmployeeFormProps> = ({ initialFullName = '', initialAge = 0, initialOccupation = '', initialSpecialization = '' }) => {
  const [fullName, setFullName] = useState(initialFullName);
  const [age, setAge] = useState(String(initialAge || ''));
  const [occupation, setOccupation] = useState(initialOccupation);
  const [specialization, setSpecialization] = useState(initialSpecialization);
  const [message, setMessage] = useState('');

  const onUpdate = () => {
    if (!fullName.trim()) {
      setMessage('');
      return Alert.alert('Validation', 'Full name is required');
    }

    const ageNum = Number(age);
    if (!Number.isFinite(ageNum) || ageNum <= 0) {
      setMessage('');
      return Alert.alert('Validation', 'Age must be a positive number');
    }
    setMessage('✅ Update success!');
    Alert.alert('Success', 'Employee updated successfully');
  };

  return (
    <Section title="1) Employee Information">
      <Field label="Full name" value={fullName} onChangeText={setFullName} placeholder="Nguyen Van A" />
      <Field label="Age" value={age} onChangeText={setAge} keyboardType="numeric" placeholder="20" />
      <Field label="Occupation" value={occupation} onChangeText={setOccupation} placeholder="Software Engineer" />
      <Field label="Specialized in training" value={specialization} onChangeText={setSpecialization} placeholder="Mobile Development" />
      <Button title="Update" onPress={onUpdate} />
      {!!message && <Text style={S.success}>{message}</Text>}
      <View style={S.box}>
        <Text style={S.output}>Preview</Text>
        <Text>Full name: {fullName || '-'}</Text>
        <Text>Age: {age || '-'}</Text>
        <Text>Occupation: {occupation || '-'}</Text>
        <Text>Specialized in: {specialization || '-'}</Text>
      </View>
    </Section>
  );
};

// 2 Sum of first & last digit 
const SumFirstLast: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string>('');

  const calc = () => {
    const s = input.trim();
    if (s === '') return Alert.alert('Validation', 'Please enter a positive integer');
    const n = Number(s);
    if (!Number.isFinite(n) || !Number.isInteger(n)) return Alert.alert('Validation', 'Please enter a whole number');

    const first = Number(s[0]);
    const last = Number(s[s.length - 1]);
    setResult(String(first + last));
  };

  return (
    <Section title="2) Sum of First & Last Digit">
      <Field label="Enter an integer" value={input} onChangeText={setInput} keyboardType="numeric" />
      <Button title="Calculate" onPress={calc} />
      {!!result && <Text style={S.output}>Result: {result}</Text>}
    </Section>
  );
};

// 3 Minimum of three numbers 
const MinOfThree: React.FC = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [min, setMin] = useState<string>('');

  const calcMin = () => {
    const n1 = Number(a), n2 = Number(b), n3 = Number(c);
    if ([a, b, c].some((v) => v.trim() === '')) return Alert.alert('Validation', 'Please fill all fields');
    if (![n1, n2, n3].every(Number.isFinite)) return Alert.alert('Validation', 'Please enter valid numbers');
    setMin(String(Math.min(n1, n2, n3)));
  };

  return (
    <Section title="3) Minimum of Three Numbers (State)">
      <Field label="A" value={a} onChangeText={setA} keyboardType="numeric" />
      <Field label="B" value={b} onChangeText={setB} keyboardType="numeric" />
      <Field label="C" value={c} onChangeText={setC} keyboardType="numeric" />
      <Button title="Find Min" onPress={calcMin} />
      {!!min && <Text style={S.output}>Min = {min}</Text>}
    </Section>
  );
};

// 4 Hailstone sequence 
const Hailstone: React.FC = () => {
  const [n, setN] = useState('');
  const [seq, setSeq] = useState<number[]>([]);

  const buildSeq = () => {
    const x = Number(n);
    if (!Number.isFinite(x) || x <= 0 || !Number.isInteger(x)) return Alert.alert('Validation', 'n must be a positive integer (n > 0)');
    const out: number[] = [];
    let cur = x;
    while (cur !== 1) {
      out.push(cur);
      cur = cur % 2 === 0 ? cur / 2 : cur * 3 + 1;
    }
    out.push(1);
    setSeq(out);
  };

  const steps = useMemo(() => (seq.length > 0 ? seq.length - 1 : 0), [seq]);

  return (
    <Section title="4) Hailstone Sequence (State)">
      <Field label="n (> 0)" value={n} onChangeText={setN} keyboardType="numeric" />
      <Button title="Generate" onPress={buildSeq} />
      {seq.length > 0 && (
        <View>
          <Text style={S.output}>Length: {seq.length} (steps: {steps})</Text>
          <ScrollView style={[S.box, S.seq]}>
            <Text selectable>{seq.join(' → ')}</Text>
          </ScrollView>
        </View>
      )}
    </Section>
  );
};


export const App1 = () => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 12 }}>

      {data.map((item: any, index: number) => (
        <Square key={item?.id ?? index} text={`Square ${index + 1}`} />
      ))}

      <EmployeeForm initialAge={20} />
      <SumFirstLast />
      <MinOfThree />
      <Hailstone />
    </ScrollView>
  );
};


function App() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <NewAppScreen templateFileName="App.tsx" safeAreaInsets={safeAreaInsets} />
    </View>
  );
}

export default App1;
