import { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { supabase } from '../lib/supabase';

export default function useResetPasswordLink(onReady) {
  useEffect(() => {
    const handleUrl = async (url) => {
      if (!url || !url.includes('reset-password')) return;

      const [base, hash = ''] = url.split('#');
      const queryParams = new URLSearchParams(base.split('?')[1] || '');
      const hashParams = new URLSearchParams(hash);

      const errorDesc = hashParams.get('error_description') || queryParams.get('error_description');
      if (errorDesc) {
        Alert.alert('Link problem', errorDesc.replace(/\+/g, ' '));
        return;
      }

      try {
        const code = queryParams.get('code');
        if (code) {
          // PKCE flow
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
        } else {
          const access_token = hashParams.get('access_token');
          const refresh_token = hashParams.get('refresh_token');
          if (!access_token || !refresh_token) return;
          const { error } = await supabase.auth.setSession({ access_token, refresh_token });
          if (error) throw error;
        }
        onReady?.();
      } catch (e) {
        Alert.alert('Error', e.message || 'This reset link is invalid or has expired.');
      }
    };

    Linking.getInitialURL().then(handleUrl);
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, []);
}