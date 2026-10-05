import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://xxwpikhtxhkqlrbqfmcf.supabase.co',
  'sb_publishable_fNe3QO0gRTWPAiUT8hGibg_zy3EwhFs',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);