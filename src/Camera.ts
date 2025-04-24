import { Stage } from './Stage';
import { CameraChanges } from './CameraChanges';

export class Camera {

    stage: Stage;

    changes: CameraChanges;

    private _x: number;
    private _y: number;
    private _direction: number = 0;
    private _renderRadius: number;
    private _zoom = 1;

    constructor(stage:Stage) {
        this.stage = stage;
        this._x = this.stage.width / 2;
        this._y = this.stage.height / 2;
        this.updateRenderRadius();
        this.changes = new CameraChanges();
    }

    set direction(value){
        if (this.changes.direction == 0) {
            let direction = value % 360;
            direction = direction < 0 ? direction + 360 : direction;

            this.changes.direction = direction - this._direction;

            this._direction = direction;
        }
    }

    get direction(){
        return this._direction;
    }

    get angleDirection() {
        return this._direction * Math.PI / 180;
    }

    get width(){
        return this.stage.width / this._zoom;
    }

    get height(){
        return this.stage.height / this._zoom;
    }

    set x(value){
            this.changes.x = value - this._x;
    }

    get x(){
        return this._x + this.changes.x;
    }

    set y(value){
            this.changes.y = value - this._y;
    }

    get y(){
        return this._y + this.changes.y;
    }

    get startCornerX (): number {
        return this._x - this.stage.width / 2;
    }

    get startCornerY (): number {
        return this._y - this.stage.height / 2;
    }

    get renderRadius() {
        return this._renderRadius;
    }

    set zoom(value){
        if (this.changes.zoom == 1){
            const newZoom = value < 0.1 ? 0.1 : value

            this.changes.zoom = newZoom / this._zoom;

            this._zoom = newZoom;
            this.updateRenderRadius()
        }
    }

    get zoom(){
        return this._zoom;
    }

    stop(){
        console.log('камера сброшена')
        this.stage.context.translate(this._x - this.stage.width / 2, this._y - this.stage.height / 2);

        this.stage.context.translate(this.stage.width / 2, this.stage.height / 2);
        this.stage.context.scale(1 / this._zoom, 1 / this._zoom);
        // this.context.rotate(-this._direction * Math.PI / 180);
        this.stage.context.translate(-this.stage.width / 2, -this.stage.height / 2);
        this._renderRadius = Math.hypot(this.stage.width, this.stage.height) / 1.5;
    }

    run(){
        console.log('камера запущена')
        this.stage.context.translate(-this._x + this.stage.width / 2, -this._y + this.stage.height / 2);

        this.stage.context.translate(this._x, this._y);
        this.stage.context.scale(this._zoom, this._zoom);
        // this.context.rotate(this._direction * Math.PI / 180);
        this.stage.context.translate(-this._x, -this._y);

        this.updateRenderRadius();

        this.changes.reset();
    }

    update() {
        this._x += this.changes.x;
        this._y += this.changes.y;
    }

    private updateRenderRadius(){
        this._renderRadius = Math.hypot(this.width, this.height) / 1.5;
    }
}
