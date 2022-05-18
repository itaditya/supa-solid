import { Accessor, createEffect, createSignal } from 'solid-js';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { useSupabaseClient } from './clientContext';

type Status = 'idle' | 'loading' | 'error' | 'success';

interface CreateUserReturn {
  user: Accessor<User>;
  status: Accessor<Status>;
  update: SupabaseClient['auth']['update'];
}

export function createUser(): CreateUserReturn {
  const { auth } = useSupabaseClient();
  const initialUser = auth.user();
  const [user, setUser] = createSignal<User>(initialUser);
  const [status, setStatus] = createSignal<Status>('idle');

  createEffect(() => {
    auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      setUser(session.user);
    });
  });

  async function update(args) {
    setStatus('loading');
    const res = await auth.update(args);
    const { error } = res;

    if (error) {
      setStatus('error');
    }

    setStatus('success');

    return res;
  }

  return { user, status, update };
}
