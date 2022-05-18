import { For, Show, Suspense, createSignal, createEffect } from 'solid-js';
import { createSession, createUser, createFrom } from '@lib';
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
    },
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
        <Suspense fallback={<div>Loading details...</div>}>
          <CharacterDetails characterSlug={activeSlug} />
        </Suspense>
      </Show>
    </section>
  );
}

function SigninForm() {
  const [email, setEmail] = createSignal('adityaa803@gmail.com');
  const [password, setPassword] = createSignal('pass');
  const { signIn } = createSession();

  function handleChange(fieldName, event) {
    const fieldValue = event.target.value;

    if (fieldName === 'email') {
      setEmail(fieldValue);
    }

    if (fieldName === 'password') {
      setPassword(fieldValue);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const { session, user, error } = await signIn({
      email: email(),
      // password: password(),
    });
    console.log(`error`, error); // aditodo remove this
    console.log(`session`, session); // aditodo remove this
    console.log(`user`, user); // aditodo remove this
  }

  return (
    <form class="auth-form auth-form--signin" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        value={email()}
        onChange={[handleChange, 'email']}
      />
      <br />
      <input
        type="password"
        name="password"
        placeholder="Enter Password"
        value={password()}
        onChange={[handleChange, 'password']}
      />
      <br />
      <button type="submit">Login</button>
    </form>
  );
}

function EditEmailForm() {
  const { user, update } = createUser();
  const [email, setEmail] = createSignal('');

  createEffect(() => {
    const userValue = user();

    if (userValue) {
      setEmail(userValue.email);
    }
  });

  function handleChange(event) {
    const fieldValue = event.target.value;
    setEmail(fieldValue);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await update({
      email: email(),
    });
  }

  return (
    <form class="auth-form auth-form--edit-email" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Enter Email"
        value={email()}
        onChange={handleChange}
      />
      <br />
      <button type="submit">Save</button>
    </form>
  );
}

function SignoutButton() {
  const { signOut } = createSession();

  return <button onClick={signOut}>Sign Out</button>;
}

function App() {
  return (
    <div class="App">
      <h2>Hey</h2>
      <SignoutButton />
      <SigninForm />
      <EditEmailForm />
      <Suspense fallback={<div>Loading Characters...</div>}>
        <CharactersView />
      </Suspense>
    </div>
  );
}

export default App;
