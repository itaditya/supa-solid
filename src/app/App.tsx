import { For, Show, Suspense, createSignal, createEffect } from 'solid-js';
import { createFrom } from '@lib';
import './App.css';

function CharacterDetails(p) {
  const [character] = createFrom(
    p.characterSlug,
    async (supabase, characterSlug) => {
      const { data } = await supabase
        .from('characters')
        .select('id,name,gender,slug')
        .eq('slug', characterSlug)
        .single();
      return data;
    }
  );

  const genderMap = {
    0: 'Male',
    1: 'Female',
  };

  function renderCharacter() {
    const c = character();

    if (!c) {
      return null;
    }

    return (
      <div>
        <h3>{c.name}</h3>
        <p>{c.id}</p>
        <p>{c.slug}</p>
        <p>{genderMap[c.gender]}</p>
      </div>
    );
  }

  return <div>{renderCharacter()}</div>;
}

function CharactersView() {
  const [activeSlug, setActiveSlug] = createSignal(null);
  const [characters] = createFrom(2, async (supabase) => {
    const { data } = await supabase.from('characters').select('slug,name');
    return data;
  });

  function handleCharacterSelect(slug) {
    setActiveSlug(slug);
  }

  return (
    <section>
      <ul>
        <For each={characters()}>
          {(item) => (
            <li
              class="character-item"
              classList={{
                active: activeSlug() === item.slug,
              }}
              onClick={[handleCharacterSelect, item.slug]}
            >
              {item.name}
            </li>
          )}
        </For>
      </ul>
      <Show when={activeSlug() !== null}>
        <CharacterDetails characterSlug={activeSlug} />
      </Show>
    </section>
  );
}

function App() {
  return (
    <div class="App">
      <h2>Hey</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <CharactersView />
      </Suspense>
    </div>
  );
}

export default App;
