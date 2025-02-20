import { useEffect, useState } from "react";

type Pokemon = {
  name: string;
};

const PokemonList = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  useEffect(() => {
    const params = new URLSearchParams({ limit: "2", offset: "0" });
    fetch(`https://pokeapi.co/api/v2/pokemon?${params}`)
      .then((result) => result.json())
      .then((data) => setPokemons(data.results));
  }, []);

  return (
    <ol>
      {pokemons.map((pokemon) => (
        <li key={pokemon.name}>{pokemon.name}</li>
      ))}
    </ol>
  );
};

export default PokemonList;
