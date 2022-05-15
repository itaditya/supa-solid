import { createResource } from 'solid-js';
import { SupabaseClient } from '@supabase/supabase-js';
import { useSupabaseClient } from './clientContext';

type Cb = (supabase: SupabaseClient, sourceArg: any) => unknown;

export function createFrom(source, cb: Cb) {
  const supabase = useSupabaseClient();

  return createResource(source, (sourceArg) => {
    return cb(supabase, sourceArg);
  });
}
