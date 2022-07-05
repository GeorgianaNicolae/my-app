import { render, screen } from "@testing-library/react";
import Input from "./Input";

it("has is-invalid class for input when help is set", () => {
  render(<Input help="Error message" />);
  const input = screen.getByTestId("input", { label: /User name/i });
  expect(input.classList).toContain("is-invalid");
});
it("has invalid-feedback class for span when help is set", () => {
  render(<Input help="Error message" />);
  const span = screen.getByTestId("span");
  expect(span.classList).toContain("invalid-feedback");
});
it("does not have invalid-feedback class for span when help is notset", () => {
  render(<Input help="Error message" />);
  const input = screen.getByTestId("input", { label: /User name/i });
  expect(input.classList).not.toContain(" is-invalid");
});
