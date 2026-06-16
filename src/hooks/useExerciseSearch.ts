import { useEffect, useState } from 'react';
import { exerciseService } from '@/services/exercise.service';
import { Exercise } from '@types';

export function useExerciseSearch(query: string) {
  const [results, setResults] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await exerciseService.searchExercises(query);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore nella ricerca');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(search, 300); // debounce
    return () => clearTimeout(timer);
  }, [query]);

  return { results, isLoading, error };
}
