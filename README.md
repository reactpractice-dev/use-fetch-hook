# Build a custom useFetch hook

> This repository is the companion to the ["Build a custom useFetch hook"](https://reactpractice.dev/exercise/build-a-custom-usefetch-hook/) practice exercise.

Build a custom useFetch hook that encapsulates the logic for handling the loading and error states when fetching data:

```
const { data, isLoading, error } = useFetch(SOME_URL, MAYBE_OPTIONS);
```

The code should

- return the response from the server
- handle error and loading states
- support custom headers through an options parameter
- support all HTTP methods - e.g. both GET and POST requests

Use Typescript to build your solution.

## Getting started:

- `npm install`
- `npm run dev`
