import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Login from "./Login";

describe("Login Page", () => {
  test("renders music library heading", () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(
      screen.getByText(/music library/i)
    ).toBeInTheDocument();
  });
});