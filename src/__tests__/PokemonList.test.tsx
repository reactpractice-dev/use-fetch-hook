import { render, screen } from "@testing-library/react";
import PokemonList from "../PokemonList";
import { server } from "../testing/mock-server";
import { http, HttpResponse } from "msw";

describe("before hook", () => {
  beforeEach(() => {
    server.use(
      http.get("https://pokeapi.co/api/v2/pokemon", () => {
        return HttpResponse.json({
          count: 1304,
          next: "https://pokeapi.co/api/v2/pokemon?offset=2&limit=2",
          previous: null,
          results: [
            {
              name: "mock bulbasaur",
              url: "https://pokeapi.co/api/v2/pokemon/1/",
            },
            {
              name: "mock ivysaur",
              url: "https://pokeapi.co/api/v2/pokemon/2/",
            },
          ],
        });
      })
    );
  });

  it("shows the pokemons", async () => {
    render(<PokemonList />);

    const pokemonListItems = await screen.findAllByRole("listitem");
    const pokemonNames = pokemonListItems.map((li) => li.textContent);
    expect(pokemonNames).toEqual(["mock bulbasaur", "mock ivysaur"]);
  });
});
