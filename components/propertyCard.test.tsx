import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropertyCard } from "./propertyCard";
import { addFavorite, removeFavorite } from "@/app/actions/properties";
import type { PropertyBase } from "@/app/lib/definitions";

vi.mock("next/image", () => ({
    default: (props: React.ComponentProps<"img">) => <img alt={props.alt} src={props.src} />,
}));
vi.mock("next/dist/client/link", () => ({
    default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));
vi.mock("@/app/actions/properties", () => ({
    addFavorite: vi.fn().mockResolvedValue({ ok: true }),
    removeFavorite: vi.fn().mockResolvedValue({ ok: true }),
}));

const property: PropertyBase = {
    id: "1",
    title: "Bel appartement",
    location: "Paris",
    price_per_night: 100,
    cover: "/cover.jpg",
};

describe("PropertyCard favorites", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("marks the property as liked and calls addFavorite when toggled on", async () => {
        const user = userEvent.setup();
        render(<PropertyCard property={property} />);

        const button = screen.getByRole("button");
        await user.click(button);

        await waitFor(() => expect(addFavorite).toHaveBeenCalledWith("1"));
        expect(button.querySelector("img")).toHaveAttribute("src", "/favoris-selected.svg");
    });

    it("calls removeFavorite and notifies the parent when unliking an already liked property", async () => {
        const user = userEvent.setup();
        const onUnlike = vi.fn();
        render(<PropertyCard property={property} liked onUnlike={onUnlike} />);

        const button = screen.getByRole("button");
        await user.click(button);

        await waitFor(() => expect(removeFavorite).toHaveBeenCalledWith("1"));
        expect(onUnlike).toHaveBeenCalledWith("1");
    });
});