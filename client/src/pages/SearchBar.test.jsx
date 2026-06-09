import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  test("renders search input", () => {
    render(
      <SearchBar
        search=""
        setSearch={vi.fn()}
        suggestions={[]}
        selectSong={vi.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText(/search/i)
    ).toBeInTheDocument();
  });
});