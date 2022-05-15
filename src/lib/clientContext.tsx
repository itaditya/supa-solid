import { SupabaseClient } from '@supabase/supabase-js';
import { createContext, useContext, ParentComponent } from 'solid-js';

export const supabaseContext = createContext<SupabaseClient>();

interface Props {
  client: SupabaseClient;
}

export const SupabaseProvider: ParentComponent<Props> = (props) => {
  return (
    <supabaseContext.Provider value={props.client} children={props.children} />
  );
};

export function useSupabaseClient() {
  const client = useContext(supabaseContext);

  if (!client) {
    throw new Error('Please use it inside SupabaseProvider');
  }

  return client;
}
