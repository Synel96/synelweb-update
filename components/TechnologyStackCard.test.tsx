import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TechnologyStackCard } from "./TechnologyStackCard";

describe("TechnologyStackCard", () => {
  it("renders all provided text content and the logo for the given name", () => {
    const { container } = render(
      <TechnologyStackCard
        logo="react"
        name="React"
        title="Component-driven UI"
        summary="Fast, composable interfaces."
        valueLabel="Why it matters"
        valueText="Keeps the UI consistent and maintainable."
        badge="Frontend"
      />
    );

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Component-driven UI")).toBeInTheDocument();
    expect(screen.getByText("Fast, composable interfaces.")).toBeInTheDocument();
    expect(screen.getByText("Why it matters")).toBeInTheDocument();
    expect(screen.getByText("Keeps the UI consistent and maintainable.")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders the title as a heading", () => {
    render(
      <TechnologyStackCard
        logo="django"
        name="Django"
        title="Robust backend"
        summary="..."
        valueLabel="..."
        valueText="..."
        badge="Backend"
      />
    );
    expect(screen.getByRole("heading", { name: "Robust backend" })).toBeInTheDocument();
  });
});
