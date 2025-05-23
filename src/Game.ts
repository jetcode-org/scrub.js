import { ErrorMessages, Keyboard, Mouse, Registry, Styles, ValidatorFactory } from './utils';
import { Stage } from './Stage';
import { Sprite } from './Sprite';
import { ScheduledState } from './ScheduledState';
import { EventEmitter } from './EventEmitter';
import { PointCollider } from './collisions';

export type DrawingCallbackFunction = (context: CanvasRenderingContext2D, object: Stage | Sprite) => void;
export type ScheduledCallbackFunction = (context: Stage | Sprite, state: ScheduledState) => boolean | void;
export type Locale = 'ru' | 'en';

export type TransformableObject = {
    x: number,
    y: number,
    globalX?: number,
    globalY?: number
};

export type GridCostumeOptions = {
    cols: number,
    rows: number,
    limit?: number,
    offset?: number,
    name?: string,
    rotate?: number,
    flipX?: boolean,
    flipY?: boolean,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    alphaColor?: string | { r: number; g: number; b: number },
    alphaTolerance?: number,
    crop?: number,
    cropTop?: number,
    cropRight?: number,
    cropBottom?: number,
    cropLeft?: number
};

export type CostumeOptions = {
    name?: string,
    rotate?: number,
    flipX?: boolean,
    flipY?: boolean,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    alphaColor?: string | { r: number; g: number; b: number },
    alphaTolerance?: number,
    crop?: number,
    cropTop?: number,
    cropRight?: number,
    cropBottom?: number,
    cropLeft?: number
};

export type SoundOptions = {
    volume?: number,
    currentTime?: number,
    loop?: boolean
};

export class Game {
    id: Symbol;
    eventEmitter: EventEmitter;
    validatorFactory: ValidatorFactory;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    keyboard: Keyboard;
    mouse: Mouse;

    debugMode = 'none'; // none, hover, forever;
    debugCollider = false;
    debugColor = 'red';

    static readonly STAGE_READY_EVENT = 'scrubjs.stage.ready';
    static readonly STAGE_BACKGROUND_READY_EVENT = 'scrubjs.stage.background_ready';
    static readonly SPRITE_READY_EVENT = 'scrubjs.sprite.ready';

    private stages: Stage[] = [];
    private activeStage: Stage = null
    private styles = null;
    private loadedStages = 0;
    private onReadyCallbacks = [];
    private onUserInteractedCallbacks = [];
    private onReadyPending = true;
    protected running = false;
    private pendingRun = false;
    private reportedError = false;
    private _displayErrors = true;
    private _locale = 'ru';
    private _userInteracted = false;
    private userInteractionPromise: Promise<unknown>;

    constructor(width: number = null,
                height: number = null,
                canvasId: string = null,
                displayErrors = true,
                locale: Locale = 'ru',
                smoothingEnabled = false
    ) {
        this._displayErrors = displayErrors;
        this._locale = locale;
        this.validatorFactory = new ValidatorFactory(this);

        let game = this;
        if (this.displayErrors) {
            game = this.validatorFactory.createValidator(this, 'Game');
        }

        window.onerror = () => {
            game.reportError(ErrorMessages.getMessage(ErrorMessages.SCRIPT_ERROR, game._locale));
        };

        game.id = Symbol();
        game.eventEmitter = new EventEmitter();
        game.keyboard = new Keyboard();

        if (canvasId) {
            const element = document.getElementById(canvasId);

            if (element instanceof HTMLCanvasElement) {
                game.canvas = element;
            }

        } else {
            game.canvas = document.createElement('canvas');
            document.body.appendChild(game.canvas);
        }

        game.canvas.width = width;
        game.canvas.height = height;
        game.styles = new Styles(game.canvas, width, height);
        game.mouse = new Mouse(game);
        game.context = game.canvas.getContext('2d');
        game.context.imageSmoothingEnabled = smoothingEnabled;

        Registry.getInstance().set('game', game);

        game.addListeners();

        return game;
    }

    addStage(stage: Stage): this {
        this.stages.push(stage);

        return this;
    }

    getLastStage(): Stage | null {
        if (!this.stages.length) {
            return null;
        }

        return this.stages[this.stages.length - 1];
    }

    getActiveStage(): Stage | null {
        if (this.activeStage) {
            return this.activeStage;
        }

        return null;
    }

    run(stage: Stage = null): void {
        if (this.activeStage && this.activeStage == stage) {
            return;
        }

        if (!stage && this.stages.length) {
            stage = this.stages[0];
        }

        if (!stage) {
            this.throwError(ErrorMessages.NEED_STAGE_BEFORE_RUN_GAME);
        }

        if (!this.running) { // only first run
            for (const inStage of this.stages) {
                inStage.ready();
            }
        }

        if (this.activeStage && this.activeStage.running) {
            this.activeStage.stop();
        }

        this.running = false;
        this.pendingRun = true;
        this.activeStage = stage;

        this.tryDoRun();
    }

    isReady(): boolean {
        return this.loadedStages == this.stages.length;
    }

    onReady(callback: CallableFunction): void {
        this.onReadyCallbacks.push(callback);
    }

    onUserInteracted(callback: CallableFunction): void {
        this.onUserInteractedCallbacks.push(callback);
    }

    stop(): void {
        if (this.activeStage && this.activeStage.running) {
            this.activeStage.stop();
        }

        this.running = false;
    }

    get displayErrors(): boolean {
        return this._displayErrors;
    }

    get locale(): string {
        return this._locale;
    }

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
        return this.canvas.height;
    }

    get userInteracted(): boolean {
        return this._userInteracted;
    }

    isInsideGame(x: number, y: number): boolean {
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    }

    correctMouseX(mouseX: number): number {
        const cameraOffsetX = this.activeStage ? this.activeStage.camera.startCornerX : 0;

        return mouseX - this.styles.canvasRect.left + cameraOffsetX;
    }

    correctMouseY(mouseY: number): number {
        const cameraOffsetY = this.activeStage ? this.activeStage.camera.startCornerY : 0;

        return mouseY - this.styles.canvasRect.top + cameraOffsetY;
    }

    keyPressed(char: string | string[]): boolean {
        if (Array.isArray(char)) {
            for (const oneChar of char) {
                const pressed = this.keyboard.keyPressed(oneChar);

                if (pressed) {
                    return true;
                }
            }

            return false;
        }

        return this.keyboard.keyPressed(char);
    }

    keyDown(char: string, callback: CallableFunction): void {
        this.keyboard.keyDown(char, callback);
    }

    keyUp(char: string, callback: CallableFunction): void {
        this.keyboard.keyUp(char, callback);
    }

    mouseDown(): boolean {
        return this.mouse.isMouseDown(this.activeStage);
    }

    mouseDownOnce(): boolean {
        const isMouseDown = this.mouse.isMouseDown(this.activeStage);
        this.mouse.clearMouseDown();

        return isMouseDown;
    }

    getMousePoint(): PointCollider {
        return this.mouse.getPoint();
    }

    getRandom(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    throwError(messageId: string, variables: {} | null = null, reportError = true): void {
        const message = ErrorMessages.getMessage(messageId, this.locale, variables);

        this.throwErrorRaw(message, reportError);
    }

    throwErrorRaw(message: string, reportError = true): void {
        if (reportError) {
            this.reportError(message);
        }

        throw new Error(message);
    }

    private reportError(message): void {
        if (this._displayErrors && !this.reportedError) {
            alert(message);

            this.reportedError = true;
        }
    }

    private addListeners(): void {
        this.eventEmitter.on(Game.STAGE_READY_EVENT, Game.STAGE_READY_EVENT, (event: CustomEvent) => {
            this.loadedStages++;
            this.tryDoOnReady();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (this.activeStage && this.activeStage.running) {
                    this.activeStage.stop();
                }

            } else {
                if (this.activeStage && this.activeStage.stopped) {
                    this.activeStage.run();
                }
            }
        });

        this.userInteractionPromise = new Promise((resolve) => {
            document.addEventListener('click', resolve, { once: true });

            document.addEventListener('keydown', (event) => {
                const excludedKeys = ['Control', 'Shift', 'CapsLock', 'NumLock', 'Alt', 'Meta'];
                if (!excludedKeys.includes(event.key)) {
                    resolve(true);
                }
            }, { once: true });
        });
    }

    private tryDoOnReady(): void {
        if (this.isReady() && this.onReadyPending) {
            this.onReadyPending = false;

            if (this.onReadyCallbacks.length) {
                for (const callback of this.onReadyCallbacks) {
                    callback();
                }
                this.onReadyCallbacks = [];
            }

            this.userInteractionPromise.then(() => {
                this._userInteracted = true;

                this.onUserInteractedCallbacks.filter(callback => {
                    callback(this);

                    return false
                });
            });

            this.tryDoRun();
        }
    }

    private tryDoRun(): void {
        if (this.pendingRun && !this.running && this.isReady()) {
            this.running = true;
            this.pendingRun = false;

            this.activeStage.run();
        }
    }
}
