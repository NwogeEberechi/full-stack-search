import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll } from "vitest";
import React from "react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

global.React = React;

const mockHotel = {
  _id: "1",
  chain_name: "Chain",
  hotel_name: "Sample Hotel",
  city: "Sample City",
  country: "Sample Country",
};

const mockCity = {
  name: "Sample City",
};

const mockCountry = {
  country: "Sample Country",
};

const handlers = [
  http.get("http://localhost:3001/search", ({ params }) => {
    const { query } = params;
    if (query === "Round Rock (TX)") {
      return HttpResponse.json({ hotels: [], cities: [], countries: [] });
    }
    return HttpResponse.json({
      hotels: [mockHotel],
      cities: [mockCity],
      countries: [mockCountry],
    });
  }),
  http.get("http://localhost:3001/hotels/1", () =>
    HttpResponse.json(mockHotel)
  ),
  http.get("http://localhost:3001/cities/Sample%20City", () =>
    HttpResponse.json(mockCity)
  ),
  http.get("http://localhost:3001/countries/Sample%20Country", () =>
    HttpResponse.json(mockCountry)
  ),
];

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen();
});
afterAll(() => {
  server.close();
});
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
