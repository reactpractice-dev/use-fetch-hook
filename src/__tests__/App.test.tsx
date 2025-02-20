import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders the demo Vite text", () => {
    render(<App />);

    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
});
