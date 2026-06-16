import { supabase } from './config';
import { User } from '@types';

class AuthService {
  /**
   * Registra un nuovo utente con Supabase Auth e inserisce/aggiorna i dettagli in public.users
   */
  async signUp(
    email: string,
    password: string,
    name: string,
    gender: 'male' | 'female',
    age: number,
    equipment: string[] = []
  ): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registrazione fallita: nessun utente restituito.');

    // Aggiorna i campi aggiuntivi (gender, age, equipment) nel profilo pubblico
    // Poiché il trigger handle_new_user ha già inserito il record su public.users,
    // facciamo un update.
    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .update({
        gender,
        age,
        equipment,
      })
      .eq('id', authData.user.id)
      .select()
      .single();

    if (profileError) {
      console.warn('Errore aggiornamento profilo post-signup, provo a recuperarlo:', profileError);
    }

    return {
      id: authData.user.id,
      email: authData.user.email || email,
      name,
      gender,
      age,
      equipment,
    };
  }

  /**
   * Login con email e password
   */
  async signIn(email: string, password: string): Promise<User> {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Login fallito: sessione non trovata.');

    // Recupera il profilo completo da public.users
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      // Se non esiste il profilo, crealo come fallback
      console.warn('Profilo non trovato nel database public, ne creo uno base:', profileError);
      const defaultUser: User = {
        id: authData.user.id,
        email: authData.user.email || email,
        name: authData.user.user_metadata?.name || 'Utente',
        gender: 'male',
        age: 25,
        equipment: [],
      };
      await supabase.from('users').insert({
        id: defaultUser.id,
        email: defaultUser.email,
        name: defaultUser.name,
        gender: defaultUser.gender,
        age: defaultUser.age,
        equipment: defaultUser.equipment,
      });
      return defaultUser;
    }

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      gender: profile.gender || 'male',
      age: profile.age || 25,
      equipment: profile.equipment || [],
    };
  }

  /**
   * Login speciale come Ospite (Guest Mode) per testing locale rapido
   */
  async signInAsGuest(): Promise<User> {
    // Genera un ID mock univoco o deterministico per i test locali
    const guestId = '00000000-0000-0000-0000-000000000000';
    const guestUser: User = {
      id: guestId,
      email: 'guest@fittrack.local',
      name: 'Ospite / Tester',
      gender: 'male',
      age: 28,
      equipment: ['bilanciere', 'manubri', 'corpo_libero'],
    };

    // Assicurati che l'utente esista nel database public per evitare violazioni di chiavi esterne
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', guestId)
        .single();

      if (error || !data) {
        await supabase.from('users').upsert({
          id: guestId,
          email: guestUser.email,
          password_hash: 'guest_bypass',
          name: guestUser.name,
          gender: guestUser.gender,
          age: guestUser.age,
          equipment: guestUser.equipment,
        });
      }
    } catch (e) {
      console.warn('Errore creazione utente guest su database:', e);
    }

    return guestUser;
  }

  /**
   * Effettua il logout
   */
  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  /**
   * Ottieni l'utente correntemente autenticato o null
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return null;

    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error || !profile) return null;
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        gender: profile.gender || 'male',
        age: profile.age || 25,
        equipment: profile.equipment || [],
      };
    } catch {
      return null;
    }
  }

  /**
   * Aggiunge un listener al cambio dello stato di autenticazione
   */
  onAuthStateChange(callback: (session: any, user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        try {
          const { data: profile } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            callback(session, {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              gender: profile.gender || 'male',
              age: profile.age || 25,
              equipment: profile.equipment || [],
            });
            return;
          }
        } catch {}

        callback(session, {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 'Utente',
          gender: 'male',
          age: 25,
          equipment: [],
        });
      } else {
        callback(null, null);
      }
    });

    return () => subscription.unsubscribe();
  }
}

export const authService = new AuthService();
