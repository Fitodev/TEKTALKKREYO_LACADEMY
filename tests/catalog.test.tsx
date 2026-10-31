import { it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Catalog } from "@/components/catalog";
it("filters courses and reports an empty result", () => {
  render(<Catalog />);
  expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
    "Google Workspace",
  );
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "inexistant" },
  });
  expect(screen.queryByRole("heading", { level: 3 })).not.toBeInTheDocument();
  expect(screen.getByText("Nou pa jwenn kou pou rechèch sa a.")).toBeVisible();
  fireEvent.change(screen.getByRole("searchbox"), {
    target: { value: "ENTELIJANS" },
  });
  expect(screen.getByRole("heading", { level: 3 })).toBeVisible();
});
