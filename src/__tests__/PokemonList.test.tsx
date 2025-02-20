import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import PokemonList from "../PokemonList";
import { server } from "../testing/mock-server";
import { http, HttpResponse } from "msw";

describe("Pokemon List", () => {
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

  it("tells the user the data is loading", () => {
    render(<PokemonList />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows the pokemons", async () => {
    render(<PokemonList />);

    await waitForElementToBeRemoved(screen.queryByText(/loading/i));

    const pokemonListItems = await screen.findAllByRole("listitem");
    const pokemonNames = pokemonListItems.map((li) => li.textContent);
    expect(pokemonNames).toEqual(["mock bulbasaur", "mock ivysaur"]);
  });

  it("tells the user when there was an error", async () => {
    server.use(
      http.get("https://pokeapi.co/api/v2/pokemon", () => {
        return HttpResponse.error();
      })
    );

    render(<PokemonList />);

    await screen.findByText(/Failed to fetch/i);
  });
});
