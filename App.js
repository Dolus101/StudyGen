import { useEffect, useState } from 'react';
import { BackHandler, Platform, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import WelcomeScreen from './src/screens/WelcomeScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import ReviewerScreen from './src/screens/ReviewerScreen';
import ReviewersScreen from './src/screens/ReviewersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
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
  const [screen, setScreen] = useState('welcome'); // welcome | main | upload | reviewer | settings
  const [tab, setTab] = useState('home');
  const [reviewer, setReviewer] = useState(null);

  const openReviewer = (r) => {
    setReviewer(r);
    setScreen('reviewer');
  };

  useEffect(() => {
    if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('hidden');
  }, []);

  // Android back button: upload / reviewer -> main
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'upload' || screen === 'reviewer' || screen === 'settings') {
        setScreen('main');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [screen]);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {screen === 'welcome' && <WelcomeScreen onGetStarted={() => setScreen('main')} />}

      {screen === 'upload' && (
        <UploadScreen onBack={() => setScreen('main')} onGenerate={(opts) => console.log('Generate', opts)} />
      )}

      {screen === 'settings' && <SettingsScreen onBack={() => setScreen('main')} />}

      {screen === 'reviewer' && reviewer && <ReviewerScreen reviewer={reviewer} onBack={() => setScreen('main')} />}

      {screen === 'main' && (
        <View style={{ flex: 1, backgroundColor: BG }}>
          {tab === 'home' && (
            <HomeScreen
              name="Nicole"
              onUpload={() => setScreen('upload')}
              onOpenReviewers={() => setTab('reviewers')}
              onOpenReviewer={openReviewer}
            />
          )}
          {tab === 'reviewers' && <ReviewersScreen onUpload={() => setScreen('upload')} onOpenReviewer={openReviewer} />}
          {tab === 'stats' && <Placeholder title="Stats" />}
          {tab === 'profile' && <ProfileScreen name="Nicole" onOpenReviewers={() => setTab('reviewers')} onOpenStats={() => setTab('stats')} onOpenSettings={() => setScreen('settings')} />}
          <TabBar active={tab} onChange={setTab} />
        </View>
      )}
    </SafeAreaProvider>
  );
}
