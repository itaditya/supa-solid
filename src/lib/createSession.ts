import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from './clientContext';

interface CreateSessionReturn {
  signIn: SupabaseClient['auth']['signIn'];
}

export function createSession(): CreateSessionReturn {
  const { auth } = useSupabaseClient();

  const signIn = auth.signIn.bind(auth);

  return {
    signIn,
  };
}
