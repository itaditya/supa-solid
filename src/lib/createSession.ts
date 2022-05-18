import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from './clientContext';

type CreateSessionReturn = Pick<SupabaseClient['auth'], 'signIn' | 'signOut'>;

export function createSession(): CreateSessionReturn {
  const { auth } = useSupabaseClient();

  const signIn = auth.signIn.bind(auth);
  const signOut = auth.signOut.bind(auth);

  return {
    signIn,
    signOut,
  };
}
