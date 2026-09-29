import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Carousel } from "./carousel";

vi.mock("next/image", () => ({
    default: (props: React.ComponentProps<"img">) => <img alt={props.alt} src={props.src} />,
}));

describe("Carousel", () => {
    const images = ["/a.jpg", "/b.jpg", "/c.jpg"];

    it("renders the first image and hides navigation when there is only one image", () => {
        render(<Carousel images={["/a.jpg"]} alt="Logement" />);
        expect(screen.getByAltText(/Logement - image 1 sur 1/)).toBeInTheDocument();
        expect(screen.queryByLabelText("Image suivante")).not.toBeInTheDocument();
    });

    it("goes to the next image and wraps back to the first after the last", () => {
        render(<Carousel images={images} alt="Logement" />);
        expect(screen.getByAltText(/image 1 sur 3/)).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText("Image suivante"));
        expect(screen.getByAltText(/image 2 sur 3/)).toBeInTheDocument();

        fireEvent.click(screen.getByLabelText("Image suivante"));
        fireEvent.click(screen.getByLabelText("Image suivante"));
        expect(screen.getByAltText(/image 1 sur 3/)).toBeInTheDocument();
    });

    it("goes to the previous image and wraps to the last one from the first", () => {
        render(<Carousel images={images} alt="Logement" />);
        fireEvent.click(screen.getByLabelText("Image précédente"));
        expect(screen.getByAltText(/image 3 sur 3/)).toBeInTheDocument();
    });

    it("supports keyboard navigation with arrow keys", () => {
        render(<Carousel images={images} alt="Logement" />);
        const region = screen.getByRole("region");
        fireEvent.keyDown(region, { key: "ArrowRight" });
        expect(screen.getByAltText(/image 2 sur 3/)).toBeInTheDocument();
        fireEvent.keyDown(region, { key: "ArrowLeft" });
        expect(screen.getByAltText(/image 1 sur 3/)).toBeInTheDocument();
    });
});