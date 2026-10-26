import { useState } from "react";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  PushDrawer,
  PushDrawerBody,
  PushDrawerContent,
  PushDrawerTitle,
  PushDrawerTrigger,
} from "./push-drawer";

function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <PushDrawer open={open} onOpenChange={setOpen}>
      <PushDrawerTrigger>Open menu</PushDrawerTrigger>
      <PushDrawerBody open={open} className="page-body">
        <p>Page content</p>
      </PushDrawerBody>
      <PushDrawerContent open={open} closeLabel="Close menu" aria-describedby={undefined}>
        <PushDrawerTitle>Navigation</PushDrawerTitle>
        <a href="/contact">Contact</a>
      </PushDrawerContent>
    </PushDrawer>
  );
}

const getPanel = () => document.body.querySelector('[role="dialog"]') as HTMLElement;
const getOverlay = () =>
  document.body.querySelector('[data-slot="push-drawer-overlay"]') as HTMLElement;

describe("PushDrawer", () => {
  it("starts closed: panel off-screen, page untransformed so fixed children stay pinned", () => {
    const { container } = render(<Harness />);

    expect(getPanel().style.transform).toContain("translateX(100%)");
    expect(getPanel()).toHaveAttribute("inert");

    const body = container.querySelector(".page-body") as HTMLElement;
    expect(body.style.transform).toBe("none");
  });

  it("slides the panel in and pushes the page aside by exactly the panel width", () => {
    const { container, getByText } = render(<Harness />);

    fireEvent.click(getByText("Open menu"));

    expect(getPanel().style.transform).toBe("translateX(0) rotateY(0deg)");
    expect(getPanel()).not.toHaveAttribute("inert");

    // jsdom's default window.innerWidth is 1024, so min(20rem, 100vw) caps at 320px.
    const body = container.querySelector(".page-body") as HTMLElement;
    expect(body.style.transform).toBe("translateX(-320px) scale(0.97)");
  });

  it("closes and restores the page when the overlay is clicked", () => {
    const { container, getByText } = render(<Harness />);

    fireEvent.click(getByText("Open menu"));
    fireEvent.click(getOverlay());

    expect(getPanel().style.transform).toContain("translateX(100%)");
    const body = container.querySelector(".page-body") as HTMLElement;
    expect(body.style.transform).toBe("none");
  });

  it("closes via the labelled close button", () => {
    const { getByText, getByRole } = render(<Harness />);

    fireEvent.click(getByText("Open menu"));
    fireEvent.click(getByRole("button", { name: "Close menu" }));

    expect(getPanel().style.transform).toContain("translateX(100%)");
  });
});
