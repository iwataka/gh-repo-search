import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("the default value of language input field is 'all'", () => {
  const result = render(<App />);
  const input = result.container.querySelector("#language-input-field");
  expect(input).toHaveValue("all");
});

test("the default value of sort input field is 'stars'", () => {
  const result = render(<App />);
  const input = result.container.querySelector("#sort-input-field");
  expect(input).toHaveValue("stars");
});

test("the default value of pushed input field is '>2021-01-01'", () => {
  const result = render(<App />);
  const input = result.container.querySelector("#pushed-input-field");
  expect(input).toHaveValue(">2021-01-01");
});

test("the default value of number-of-repos input field is 10", () => {
  const result = render(<App />);
  const input = result.container.querySelector("#perPage-input-field");
  expect(input).toHaveValue(10);
});
