import { useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Platform, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from './src/lib/supabase';
import { fetchReviewerDetail } from './src/lib/api';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import UploadScreen from './src/screens/UploadScreen';
import GeneratingScreen from './src/screens/GeneratingScreen';
import ReviewerScreen from './src/screens/ReviewerScreen';
import ReviewersScreen from './src/screens/ReviewersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import ChangePasswordScreen from './src/screens/ChangePasswordScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StatsScreen from './src/screens/StatsScreen';
import TabBar from './src/components/TabBar';
import StatusOverlay from './src/components/StatusOverlay';
import Transition from './src/components/Transition';
import SwipeBack from './src/components/SwipeBack';
import SwipeTabs from './src/components/SwipeTabs';

const BG = '#080A1C';
const AUTH_SCREENS = ['welcome', 'login', 'signup'];
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RANK = {
  welcome: 0,
  login: 1,
  signup: 2,
  main: 3,
  upload: 4,
  settings: 4,
  editprofile: 4,
  changepassword: 4,
  generating: 5,
  reviewer: 6,
};
const TAB_ORDER = ['home', 'reviewers', 'stats', 'profile'];

export default function App() {
  const [booting, setBooting] = useState(true);
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState('welcome');
  const [tab, setTab] = useState('home');
  const [reviewer, setReviewer] = useState(null);
  const [job, setJob] = useState(null);
  const [overlay, setOverlay] = useState(null);

  const prevScreen = useRef(screen);
  const screenDir = useRef(1);
  if (prevScreen.current !== screen) {
    screenDir.current = (RANK[screen] ?? 0) >= (RANK[prevScreen.current] ?? 0) ? 1 : -1;
    prevScreen.current = screen;
  }
  const prevTab = useRef(tab);
  const tabDir = useRef(1);
  if (prevTab.current !== tab) {
    tabDir.current = TAB_ORDER.indexOf(tab) >= TAB_ORDER.indexOf(prevTab.current) ? 1 : -1;
    prevTab.current = tab;
  }

  const firstName = (session?.user?.user_metadata?.full_name || 'there').split(' ')[0];

  const openReviewer = async (r) => {
    setOverlay({ state: 'loading', title: 'Opening reviewer…' });
    let detail;
    try {
      detail = await fetchReviewerDetail(r.id);
    } catch (e) {
      setOverlay(null);
      Alert.alert('Could not open this reviewer', e.message || 'Please try again.');
      return;
    }
    setReviewer(detail);
    setScreen('reviewer');
    setOverlay(null);
  };

  const openGenerated = async (id) => {
    setOverlay({ state: 'success', title: 'Your reviewer is ready!', message: 'Opening it now…' });
    let detail;
    try {
      detail = await fetchReviewerDetail(id);
      await sleep(1000);
    } catch (e) {
      setOverlay(null);
      Alert.alert('Your reviewer is ready', 'Open it from the Reviewers tab.');
      setScreen('main');
      return;
    }
    setReviewer(detail);
    setScreen('reviewer');
    setOverlay(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setScreen(data.session ? 'main' : 'welcome');
      setBooting(false);
    });
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession) setScreen((cur) => (AUTH_SCREENS.includes(cur) ? cur : 'welcome'));
    });
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') NavigationBar.setVisibilityAsync('hidden');
  }, [overlay]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (overlay) return true;
      if (screen === 'signup') return setScreen('login'), true;
      if (screen === 'login') return setScreen('welcome'), true;
      if (screen === 'generating') return true;
      if (screen === 'upload' || screen === 'reviewer' || screen === 'editprofile')
        return setScreen('main'), true;
      if (screen === 'settings') return setScreen('main'), true;
      if (screen === 'changepassword') return setScreen('settings'), true;
      return false;
    });
    return () => sub.remove();
  }, [screen, overlay]);

  const handleLogin = async ({ email, password }) => {
    if (!email || !password) return 'Enter your email and password.';
    setOverlay({ state: 'loading', title: 'Logging in…' });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setOverlay(null);
      return error.message;
    }
    setOverlay({ state: 'success', title: 'Welcome back!', message: "You're logged in." });
    await sleep(1200);
    setOverlay(null);
    setTab('home');
    setScreen('main');
    return null;
  };

  const handleSignup = async ({ fullName, email, password }) => {
    setOverlay({ state: 'loading', title: 'Creating your account…' });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      setOverlay(null);
      return error.message;
    }
    if (!data.session) {
      setOverlay(null);
      return 'Check your email to confirm your account, then log in.';
    }
    setOverlay({ state: 'success', title: 'Account created!', message: 'Welcome to StudyGen.' });
    await sleep(1200);
    setOverlay(null);
    setTab('home');
    setScreen('main');
    return null;
  };

  const handleSignOut = async () => {
    setOverlay({ state: 'loading', title: 'Signing out…' });
    await supabase.auth.signOut();
    setOverlay({ state: 'success', title: 'Signed out', message: 'See you soon!' });
    await sleep(900);
    setOverlay(null);
    setTab('home');
    setScreen('welcome');
  };

  const swipeTab = (step) => {
    const next = TAB_ORDER[TAB_ORDER.indexOf(tab) + step];
    if (next) setTab(next);
  };

  if (booting) return <View style={{ flex: 1, backgroundColor: BG }} />;

  const renderTab = () => {
    if (tab === 'home') {
      return (
        <HomeScreen
          name={firstName}
          onUpload={() => setScreen('upload')}
          onOpenReviewers={() => setTab('reviewers')}
          onOpenReviewer={openReviewer}
        />
      );
    }
    if (tab === 'reviewers') return <ReviewersScreen onUpload={() => setScreen('upload')} onOpenReviewer={openReviewer} />;
    if (tab === 'stats') return <StatsScreen name={firstName} onOpenReviewer={openReviewer} onUpload={() => setScreen('upload')} />;
    return (
      <ProfileScreen
        name={firstName}
        onOpenReviewers={() => setTab('reviewers')}
        onOpenStats={() => setTab('stats')}
        onOpenSettings={() => setScreen('settings')}
        onEditProfile={() => setScreen('editprofile')}
      />
    );
  };

  const renderScreen = () => {
    switch (screen) {
      case 'welcome':
        return <WelcomeScreen onGetStarted={() => setScreen('login')} />;
      case 'login':
        return <LoginScreen onBack={() => setScreen('welcome')} onLogin={handleLogin} onCreateAccount={() => setScreen('signup')} />;
      case 'signup':
        return <SignupScreen onBack={() => setScreen('login')} onCreateAccount={handleSignup} onLogIn={() => setScreen('login')} />;
      case 'upload':
        return (
          <SwipeBack key="upload" onBack={() => setScreen('main')}>
            <UploadScreen
              onBack={() => setScreen('main')}
              onGenerate={(opts) => {
                setJob(opts);
                setScreen('generating');
              }}
            />
          </SwipeBack>
        );
      case 'generating':
        return job ? <GeneratingScreen job={job} onDone={openGenerated} onBack={() => setScreen('main')} /> : null;
      case 'settings':
        return (
          <SwipeBack key="settings" onBack={() => setScreen('main')}>
            <SettingsScreen
              onBack={() => setScreen('main')}
              onSignOut={handleSignOut}
              onChangePassword={() => setScreen('changepassword')}
            />
          </SwipeBack>
        );
      case 'editprofile':
        return (
          <SwipeBack key="editprofile" onBack={() => setScreen('main')}>
            <EditProfileScreen
              onBack={() => setScreen('main')}
              onSaved={() => setScreen('main')}
            />
          </SwipeBack>
        );
      case 'changepassword':
        return (
          <SwipeBack key="changepassword" onBack={() => setScreen('settings')}>
            <ChangePasswordScreen onBack={() => setScreen('settings')} />
          </SwipeBack>
        );
      case 'reviewer':
        return reviewer ? (
          <SwipeBack key="reviewer" onBack={() => setScreen('main')}>
            <ReviewerScreen reviewer={reviewer} onBack={() => setScreen('main')} />
          </SwipeBack>
        ) : null;
      default:
        return (
          <View style={{ flex: 1, backgroundColor: BG }}>
            <View style={{ flex: 1 }}>
              <Transition viewKey={tab} direction={tabDir.current} distance={36}>
                <SwipeTabs onSwipe={swipeTab}>{renderTab()}</SwipeTabs>
              </Transition>
            </View>
            <TabBar active={tab} onChange={setTab} />
          </View>
        );
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <View style={{ flex: 1, backgroundColor: BG }}>
        <Transition viewKey={screen} direction={screenDir.current} distance={56}>
          {renderScreen()}
        </Transition>
      </View>
      <StatusOverlay overlay={overlay} />
    </SafeAreaProvider>
  );
}