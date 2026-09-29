import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LikedPropertiesGrid } from "./likedPropertiesGrid";
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

const properties: PropertyBase[] = [
    { id: "1", title: "Loft Paris", location: "Paris", price_per_night: 120 },
    { id: "2", title: "Villa Nice", location: "Nice", price_per_night: 200 },
];

describe("LikedPropertiesGrid", () => {
    it("renders every liked property", () => {
        render(<LikedPropertiesGrid initialProperties={properties} />);
        expect(screen.getByText("Loft Paris")).toBeInTheDocument();
        expect(screen.getByText("Villa Nice")).toBeInTheDocument();
    });

    it("removes a property from the grid once it is unliked", async () => {
        const user = userEvent.setup();
        render(<LikedPropertiesGrid initialProperties={properties} />);

        const [firstUnlikeButton] = screen.getAllByRole("button");
        await user.click(firstUnlikeButton);

        await waitFor(() => expect(screen.queryByText("Loft Paris")).not.toBeInTheDocument());
        expect(screen.getByText("Villa Nice")).toBeInTheDocument();
    });
});