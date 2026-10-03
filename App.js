import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import TabBar from './src/components/TabBar';

const BG = '#080A1C';

function Placeholder({ title }) {
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: '#8E92B2', marginTop: 6 }}>Coming soon</Text>
    </SafeAreaView>
  );
}

export default function App() {
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState('home');

  useEffect(() => {
    if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {!started ? (
        <WelcomeScreen onGetStarted={() => setStarted(true)} />
      ) : (
        <View style={{ flex: 1, backgroundColor: BG }}>
          {tab === 'home' && <HomeScreen name="Nicole" onOpenReviewers={() => setTab('reviewers')} />}
          {tab === 'reviewers' && <Placeholder title="Reviewers" />}
          {tab === 'stats' && <Placeholder title="Stats" />}
          {tab === 'profile' && <Placeholder title="Profile" />}
          <TabBar active={tab} onChange={setTab} />
        </View>
      )}
    </SafeAreaProvider>
  );
}