import { render, screen } from "@testing-library/react";
import MusicPlayer from "./MusicPlayer";

describe("Music Player", () => {
  test("shows select song message", () => {
    render(
      <MusicPlayer
        currentSong={null}
      />
    );

    expect(
      screen.getByText(/select/i)
    ).toBeInTheDocument();
  });
});