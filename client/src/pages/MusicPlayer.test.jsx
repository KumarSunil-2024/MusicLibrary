import { render, screen } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("Search Bar", () => {
  test("renders search input", () => {
    render(
      <SearchBar
        search=""
        setSearch={() => {}}
        suggestions={[]}
        selectSong={() => {}}
      />
    );

    expect(
      screen.getByPlaceholderText(/search/i)
    ).toBeInTheDocument();
  });
});