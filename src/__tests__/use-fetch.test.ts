import { renderHook, waitFor } from "@testing-library/react";
import { useFetch } from "../use-fetch";
import { server } from "../testing/mock-server";
import { http, HttpResponse } from "msw";

const MOCK_JSON_RESPONSE = {
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
};

describe("useFetch", () => {
  describe("loading", () => {
    it("returns the loading state", async () => {
      server.use(
        http.get("https://pokeapi.co/api/v2/pokemon", () => {
          return HttpResponse.json(MOCK_JSON_RESPONSE);
        })
      );

      const { result } = renderHook(() =>
        useFetch("https://pokeapi.co/api/v2/pokemon")
      );

      // starts as loading
      const { isLoading } = result.current;
      expect(isLoading).toBe(true);

      await waitFor(() => {
        // loading stops when data is fetched
        const { isLoading } = result.current;
        expect(isLoading).toBe(false);
      });
    });
  });

  describe("GET requests", () => {
    it("returns the data", async () => {
      server.use(
        http.get("https://pokeapi.co/api/v2/pokemon", () => {
          return HttpResponse.json(MOCK_JSON_RESPONSE);
        })
      );

      const params = {
        limit: "10",
        offset: "0",
      };
      const { result } = renderHook(() =>
        useFetch(
          `https://pokeapi.co/api/v2/pokemon?${new URLSearchParams(params)}`
        )
      );

      await waitFor(() => {
        const { data } = result.current;
        expect(data).toEqual(MOCK_JSON_RESPONSE);
      });
    });
  });

  describe("POST requests", () => {
    it("submits the data", async () => {
      server.use(
        http.post("/create-dummy-pokemon", async ({ request }) => {
          const newPokemon = await request.json();
          return HttpResponse.json(newPokemon, { status: 201 });
        })
      );

      const NEW_DUMMY_POKEMON = { name: "test-dummy" };

      const options = {
        method: "POST",
        body: JSON.stringify(NEW_DUMMY_POKEMON),
      };
      const { result } = renderHook(() =>
        useFetch("/create-dummy-pokemon", options)
      );

      await waitFor(() => {
        const { data } = result.current;
        expect(data).toEqual(NEW_DUMMY_POKEMON);
      });
    });
  });

  describe("error handling", () => {
    it("returns an error for 401 http code", async () => {
      server.use(
        http.get("https://pokeapi.co/api/v2/pokemon", () => {
          return HttpResponse.json(
            { error: "Not Authorized" },
            { status: 401 }
          );
        })
      );

      const { result } = renderHook(() =>
        useFetch("https://pokeapi.co/api/v2/pokemon")
      );

      await waitFor(() => {
        const { error } = result.current;
        expect(error).toEqual("Not Authorized");
      });
    });

    it("returns an error for 500 http code", async () => {
      server.use(
        http.get("https://pokeapi.co/api/v2/pokemon", () => {
          return HttpResponse.json({ error: "Server Error" }, { status: 500 });
        })
      );

      const { result } = renderHook(() =>
        useFetch("https://pokeapi.co/api/v2/pokemon")
      );

      await waitFor(() => {
        const { error } = result.current;
        expect(error).toEqual("Server Error");
      });
    });

    it("returns an error when the server is down", async () => {
      server.use(
        http.get("https://pokeapi.co/api/v2/pokemon", () => {
          return HttpResponse.error();
        })
      );

      const { result } = renderHook(() =>
        useFetch("https://pokeapi.co/api/v2/pokemon")
      );

      await waitFor(() => {
        const { error } = result.current;
        expect(error).toEqual("Failed to fetch");
      });
    });
  });
});
