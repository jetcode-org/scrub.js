class Costume {
    image: HTMLCanvasElement;
    ready = false;
    colliderPaddingTop = 0;
    colliderPaddingRight = 0;
    colliderPaddingBottom = 0;
    colliderPaddingLeft = 0;

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
