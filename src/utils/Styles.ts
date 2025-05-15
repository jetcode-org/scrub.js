export class Styles {
    canvas;
    canvasRect;

    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.setEnvironmentStyles();

        this.setCanvasSize(width, height);
        this.canvasRect = canvas.getBoundingClientRect();

        window.addEventListener('resize', () => {
            this.setCanvasSize(width, height);
            this.canvasRect = canvas.getBoundingClientRect();
        });
    }

    setEnvironmentStyles() {
        document.body.style.margin = '0';
        document.body.style.height = '100' + 'vh';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.display = 'flex';
        document.body.style.alignItems = 'center';
        document.body.style.justifyContent = 'center';
    }

    setCanvasSize(width, height) {
        this.canvas.width = width ? width : document.body.clientWidth;
        this.canvas.height = height ? height : document.body.clientHeight;
    }
}
