export class Costume {
    image: HTMLCanvasElement;
    ready = false;

    get width(): number {
        if (this.image instanceof HTMLCanvasElement) {
            return this.image.width;
        }

        return 0;
    }

    get height(): number {
        if (this.image instanceof HTMLCanvasElement) {
            return this.image.height;
        }

        return 0;
    }
}
