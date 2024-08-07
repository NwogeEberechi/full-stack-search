import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import App from "./app";
import SearchHotel from "./components/SearchHotels";
import ItemDetail from "./components/ItemDetails";

// Mock server setup

describe("App Component", () => {
  it("renders search input", () => {
    render(<App />);
    const input = screen.getByPlaceholderText("Search accommodation...");
    expect(input).toBeInTheDocument();
  });

  it("renders SearchHotel and navigates to ItemDetail on clicking a link", async () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<SearchHotel />} />
          <Route path="/:type/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Search accommodation..."), {
      target: { value: "Sample" },
    });

    await waitFor(() => {
      expect(screen.getByText("Sample Hotel")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Sample Hotel"));

    await waitFor(() => {
      expect(screen.getByText("Sample Hotel")).toBeInTheDocument();
    });
  });
});

describe("ItemDetail Component", () => {
  it("renders loading state initially", () => {
    render(
      <MemoryRouter initialEntries={["/hotels/1"]}>
        <Routes>
          <Route path="/:type/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading.../)).toBeInTheDocument();
  });

  it("renders item details correctly for hotels", async () => {
    render(
      <MemoryRouter initialEntries={["/hotels/1"]}>
        <Routes>
          <Route path="/:type/:id" element={<ItemDetail />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Sample Hotel/)).toBeInTheDocument();
    });
  });
});
