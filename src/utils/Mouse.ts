import { PointCollider } from '../collisions';
import { Stage } from '../Stage';
import { Game } from '../Game';

export class Mouse {
    x = 0;
    y = 0;
    private isDown = false;
    private point: PointCollider;
    private lastStage: Stage;

    constructor(game: Game) {
        document.addEventListener('mousedown', () => {
            this.isDown = true;
            this.lastStage = game.getActiveStage();
        });

        document.addEventListener('mouseup', () => {
            this.isDown = false;
        });

        document.addEventListener('mousemove', (e) => {
            this.x = game.correctMouseX(e.clientX);
            this.y = game.correctMouseY(e.clientY);
        });

        this.point = new PointCollider(this.x, this.y);
    }

    getPoint() {
        this.point.x = this.x;
        this.point.y = this.y;

        return this.point;
    }

    isMouseDown(stage: Stage) {
        return this.isDown && stage === this.lastStage;
    }

    clearMouseDown(): void {
        this.isDown = false;
    }
}
