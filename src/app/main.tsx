import { render } from 'solid-js/web';
import { createClient } from '@supabase/supabase-js';
import { SupabaseProvider } from '@lib';
import App from './App';

const supabaseUrl = 'https://glkjsznmwmwnqccqizjv.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const appRender = () => {
  return (
    <SupabaseProvider client={supabase}>
      <App />
    </SupabaseProvider>
  );
};

const rootElem = document.getElementById('app') as HTMLElement;

render(appRender, rootElem);
