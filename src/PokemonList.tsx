import { useEffect, useState } from "react";

type Pokemon = {
  name: string;
};

const PokemonList = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const fetchPokemonData = async () => {
      const params = new URLSearchParams({ limit: "10", offset: "0" });
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon?${params}`
        );
        const data = await response.json();

        setPokemons(data.results);
        setIsLoading(false);
      } catch (e) {
        const errorMessage = (e as { message: string }).message;
        setError(errorMessage);
        setIsLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  if (isLoading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <ol>
      {pokemons.map((pokemon) => (
        <li key={pokemon.name}>{pokemon.name}</li>
      ))}
    </ol>
  );
};

export default PokemonList;
