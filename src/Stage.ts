import { EventEmitter } from './EventEmitter';
import { CollisionSystem } from './collisions';
import { DrawingCallbackFunction, Game, ScheduledCallbackFunction, SoundOptions } from './Game';
import { ScheduledCallbackExecutor } from './ScheduledCallbackExecutor';
import { Sprite } from './Sprite';
import { ScheduledCallbackItem } from './ScheduledCallbackItem';
import { ErrorMessages, Registry } from './utils';
import { ScheduledState } from './ScheduledState';
import { Camera } from './Camera';

export class Stage {
    id: Symbol;
    eventEmitter: EventEmitter;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    collisionSystem: CollisionSystem;
    camera: Camera;

    private game: Game;
    private scheduledCallbackExecutor: ScheduledCallbackExecutor;
    private background: HTMLCanvasElement = null;
    private backgroundIndex = null;
    private backgrounds = [];
    private sprites = new Map<number, Sprite[]>();
    private drawings = new Map<number, DrawingCallbackFunction[]>();
    private sounds = [];
    private soundNames = [];
    private addedSprites = 0;
    private loadedSprites = 0;
    private pendingBackgrounds = 0;
    private pendingSounds = 0;
    private pendingRun = false;
    private onReadyPending = true;
    private onReadyCallbacks = [];
    private onStartCallbacks = [];
    private scheduledCallbacks: Array<ScheduledCallbackItem> = [];
    private tempScheduledCallbacks: Array<ScheduledCallbackItem> = [];
    private _stopped = true;
    private _running = false;
    private stoppedTime = null;
    private diffTime = null;

    constructor(background: string = null) {
        if (!Registry.getInstance().has('game')) {
            throw new Error('You need create Game instance before Stage instance.');
        }
        this.game = Registry.getInstance().get('game');

        let stage = this;
        if (this.game.displayErrors) {
            stage = this.game.validatorFactory.createValidator(this, 'Stage');
        }

        stage.id = Symbol();
        stage.eventEmitter = new EventEmitter();

        stage.collisionSystem = new CollisionSystem();
        stage.canvas = stage.game.canvas;
        stage.context = stage.game.context;

        if (background) {
            stage.addBackground(background);
        }

        stage.addListeners();

        stage.game.addStage(stage);

        stage.scheduledCallbackExecutor = new ScheduledCallbackExecutor(stage);
        stage.stoppedTime = Date.now();

        stage.init();
        stage.camera = new Camera(stage);

        return stage;
    }

    init() {}

    /**
     * Events
     */

    onStart(onStartCallback: CallableFunction): void {
        this.onStartCallbacks.push(onStartCallback);
    }

    onReady(callback: CallableFunction): void {
        this.onReadyCallbacks.push(callback);
    }

    /**
     * States
     */

    get running(): boolean {
        return this._running;
    }

    get stopped(): boolean {
        return this._stopped;
    }

    isReady(): boolean {
        return this.addedSprites == this.loadedSprites && this.pendingBackgrounds === 0;
    }

    /**
     * Dimensions
     */

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
        return this.canvas.height;
    }

    /**
     * Backgrounds
     */

    set backgroundColor(color: string) {
        this.drawBackground((context, stage) => {
            context.fillStyle = color;
            context.fillRect(0, 0, stage.width, stage.height);
        });
    }

    drawBackground(callback: DrawingCallbackFunction): this {
        const backgroundCanvas = document.createElement('canvas');
        const context = backgroundCanvas.getContext('2d');

        backgroundCanvas.width = this.width;
        backgroundCanvas.height = this.height;

        this.pendingBackgrounds++;
        callback(context, this);

        this.backgrounds.push(backgroundCanvas);
        this.pendingBackgrounds--;

        return this;
    }

    addBackground(backgroundPath: string): this {
        const backgroundImage = new Image();
        backgroundImage.src = backgroundPath;

        this.pendingBackgrounds++;

        const onLoad = () => {
            const backgroundCanvas = document.createElement('canvas');
            const context = backgroundCanvas.getContext('2d');
            backgroundCanvas.width = this.width;
            backgroundCanvas.height = this.height;

            context.drawImage(
                backgroundImage,
                0,
                0,
                this.width,
                this.height
            );

            this.backgrounds.push(backgroundCanvas);
            this.pendingBackgrounds--;

            this.tryDoOnReady();
            this.tryDoRun();

            backgroundImage.removeEventListener('load', onLoad);
        };
        backgroundImage.addEventListener('load', onLoad);

        backgroundImage.addEventListener('error', () => {
            this.game.throwError(ErrorMessages.BACKGROUND_NOT_LOADED, {backgroundPath});
        });

        return this;
    }

    switchBackground(backgroundIndex: number): void {
        this.backgroundIndex = backgroundIndex;
        const background = this.backgrounds[backgroundIndex];

        if (background) {
            this.background = background;
        }
    }

    nextBackground(): void {
        let nextBackgroundIndex = this.backgroundIndex + 1;

        if (nextBackgroundIndex > this.backgrounds.length - 1) {
            nextBackgroundIndex = 0;
        }

        if (nextBackgroundIndex !== this.backgroundIndex) {
            this.switchBackground(nextBackgroundIndex);
        }
    }

    /**
     * Sounds
     */

    addSound(soundPath: string, soundName: string): this {
        if (this.soundNames.includes(soundName)) {
            this.game.throwError(ErrorMessages.SOUND_NAME_ALREADY_EXISTS, {soundName});
        }

        const sound = new Audio();
        sound.src = soundPath;

        this.sounds.push(sound);
        this.soundNames.push(soundName);
        this.pendingSounds++;

        sound.load();

        const onLoadSound = () => {
            this.pendingSounds--;
            this.tryDoOnReady();

            sound.removeEventListener('loadedmetadata', onLoadSound);
        };
        sound.addEventListener('loadedmetadata', onLoadSound);

        return this;
    }

    removeSound(soundName: string): this {
        const soundIndex = this.soundNames.indexOf(soundName);

        if (soundIndex < 0) {
            this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, {soundName});
        }

        this.sounds.splice(soundIndex, 1);

        return this;
    }

    playSound(soundName: string, options: SoundOptions = {}): void {
        const sound = this.getSound(soundName);
        this.doPlaySound(sound, options);
    }

    startSound(soundName: string, options: SoundOptions = {}): HTMLAudioElement {
        const sound = this.cloneSound(soundName);
        this.doPlaySound(sound, options);

        return sound;
    }

    pauseSound(soundName: string): void {
        const sound = this.getSound(soundName);

        sound.pause();
    }

    getSound(soundName: string): HTMLAudioElement {
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.SOUND_USE_NOT_READY);
        }

        const soundIndex = this.soundNames.indexOf(soundName);

        if (soundIndex < 0) {
            this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, {soundName});
        }

        const sound = this.sounds[soundIndex];

        if (!(sound instanceof Audio)) {
            this.game.throwError(ErrorMessages.SOUND_INDEX_NOT_FOUND, {soundIndex});
        }

        return sound;
    }

    cloneSound(soundName: string): HTMLAudioElement {
        const originSound = this.getSound(soundName);

        return new Audio(originSound.src);
    }

    private doPlaySound(sound: HTMLAudioElement, options: SoundOptions = {}): void {
        if (options.volume !== undefined) {
            sound.volume = options.volume;
        }

        if (options.currentTime !== undefined) {
            sound.currentTime = options.currentTime;
        }

        if (options.loop !== undefined) {
            sound.loop = options.loop;
        }

        const playPromise = sound.play();

        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                if (error.name === "NotAllowedError") {
                    this.game.throwError(ErrorMessages.SOUND_NOT_ALLOWED_ERROR, {}, false);

                } else {
                    console.error("Audio playback error:", error);
                }
            });
        }
    }

    /**
     * Sprite management
     */

    addSprite(sprite: Sprite): this {
        let layerSprites: Sprite[];

        if (this.sprites.has(sprite.layer)) {
            layerSprites = this.sprites.get(sprite.layer);

        } else {
            layerSprites = [];
            this.sprites.set(sprite.layer, layerSprites);
        }

        layerSprites.push(sprite);
        this.addedSprites++;

        return this;
    }

    removeSprite(sprite: Sprite, layer: number): this {
        if (!this.sprites.has(layer)) {
            this.game.throwErrorRaw('The layer "' + layer + '" not defined in the stage.');
        }

        const layerSprites = this.sprites.get(layer);
        layerSprites.splice(layerSprites.indexOf(sprite), 1);

        if (!layerSprites.length) {
            this.sprites.delete(layer);
        }

        if (sprite.deleted || sprite.isReady()) {
            this.loadedSprites--;
        }

        this.addedSprites--;

        return this;
    }

    getSprites(): Sprite[] {
        return Array.from(this.sprites.values()).reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
    }

    changeSpriteLayer(sprite: Sprite, fromLayer: number, toLayer: number): void {
        if (!this.sprites.has(fromLayer)) {
            this.game.throwErrorRaw('The layer "' + fromLayer + '" not defined in the stage.');
        }

        const fromLayerSprites = this.sprites.get(fromLayer);
        fromLayerSprites.splice(fromLayerSprites.indexOf(sprite), 1);

        if (!fromLayerSprites.length) {
            this.sprites.delete(fromLayer);
        }

        let toLayerSprites = [];
        if (this.sprites.has(toLayer)) {
            toLayerSprites = this.sprites.get(toLayer);

        } else {
            this.sprites.set(toLayer, toLayerSprites);
        }

        toLayerSprites.push(sprite);
    }

    /**
     * Draw
     */

    drawSprite(sprite: Sprite): void {
        const costume = sprite.getCostume();
        const image = costume.image;
        const dstX = sprite.imageCenterX - sprite.sourceWidth / 2;
        const dstY = sprite.imageCenterY - sprite.sourceHeight / 2;
        const dstWidth = sprite.sourceWidth;
        const dstHeight = sprite.sourceHeight;
        const direction = sprite.globalDirection;
        const rotateStyle = sprite.rotateStyle;
        let colliderOffsetX = (sprite.sourceWidth - costume.width * sprite.size / 100) / 2;
        let colliderOffsetY = (sprite.sourceHeight - costume.height * sprite.size / 100) / 2;

        const needSave =
            (rotateStyle === 'normal' && direction !== 0) ||
            (rotateStyle === 'leftRight' && direction > 180) ||
            sprite.opacity !== null ||
            (sprite.filter !== null && sprite.filter != '');

        if (needSave) {
            this.context.save();
        }

        if (sprite.opacity !== null) {
            this.context.globalAlpha = sprite.opacity;
        }

        if (sprite.filter) {
            this.context.filter = sprite.filter;
        }

        if (rotateStyle === 'normal' && direction !== 0) {
            this.context.translate(dstX + dstWidth / 2, dstY + dstHeight / 2);
            this.context.rotate(sprite.globalAngleRadians);
            this.context.translate(-dstX - dstWidth / 2, -dstY - dstHeight / 2);
        }

        if (rotateStyle === 'leftRight' && direction > 180) {
            this.context.scale(-1, 1);

            // mirror image
            this.context.drawImage(
                image,
                0,
                0,
                costume.width,
                costume.height,
                -dstX - dstWidth + colliderOffsetX,
                dstY + colliderOffsetY,
                costume.width * sprite.size / 100,
                costume.height * sprite.size / 100
            );

        } else {
            // usual image
            this.context.drawImage(
                image,
                0,
                0,
                costume.width,
                costume.height,
                dstX + colliderOffsetX,
                dstY + colliderOffsetY,
                costume.width * sprite.size / 100,
                costume.height * sprite.size / 100
            );
        }

        if (needSave) {
            this.context.restore();
        }
    }

    stampImage(stampImage: HTMLCanvasElement | HTMLImageElement, x: number, y: number, direction = 0): void {
        if (this.background instanceof HTMLCanvasElement) {
            const backgroundCanvas = document.createElement('canvas');
            const context = backgroundCanvas.getContext('2d');
            backgroundCanvas.width = this.width;
            backgroundCanvas.height = this.height;

            context.drawImage(
                this.background,
                0,
                0,
                this.width,
                this.height
            );

            const stampWidth = stampImage instanceof HTMLImageElement ? stampImage.naturalWidth : stampImage.width;
            const stampHeight = stampImage instanceof HTMLImageElement ? stampImage.naturalHeight : stampImage.height;
            const stampDstX = x - stampWidth / 2;
            const stampDstY = y - stampHeight / 2;

            if (direction !== 0) {
                const angleRadians = direction * Math.PI / 180;

                context.translate(stampDstX + stampWidth / 2, stampDstY + stampHeight / 2);
                context.rotate(angleRadians);
                context.translate(-stampDstX - stampWidth / 2, -stampDstY - stampHeight / 2);
            }

            context.drawImage(
                stampImage,
                stampDstX,
                stampDstY,
                stampWidth,
                stampHeight
            );

            this.background = backgroundCanvas;
            this.backgrounds[this.backgroundIndex] = this.background;
        }
    }

    pen(callback: DrawingCallbackFunction, layer = 0): void {
        let layerDrawings: DrawingCallbackFunction[];

        if (this.drawings.has(layer)) {
            layerDrawings = this.drawings.get(layer);

        } else {
            layerDrawings = [];
            this.drawings.set(layer, layerDrawings);
        }

        layerDrawings.push(callback);
    }

    /**
     * Schedulers and render
     */

    timeout(callback: ScheduledCallbackFunction, timeout: number): void {
        this.repeat(callback, 1, null, timeout, undefined);
    }

    repeat(callback: ScheduledCallbackFunction,
           repeat: number,
           interval: number = null,
           timeout: number = null,
           finishCallback?: ScheduledCallbackFunction
    ): ScheduledState {
        const state = new ScheduledState(interval, repeat, 0);

        if (timeout) {
            timeout = Date.now() + timeout;
        }

        this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));

        return state;
    }

    forever(callback: ScheduledCallbackFunction,
            interval: number = null,
            timeout: number = null,
            finishCallback?: ScheduledCallbackFunction
    ): ScheduledState {
        const state = new ScheduledState(interval);

        if (timeout) {
            timeout = Date.now() + timeout;
        }

        this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));

        return state;
    }

    render(): void {
        this.update();
        this.collisionSystem.update();

        this.context.clearRect(this.camera.startCornerX - this.camera.width / this.camera.zoom / 2, this.camera.startCornerY - this.camera.height / this.camera.zoom / 2, this.width + this.camera.width / this.camera.zoom, this.height + this.camera.height / this.camera.zoom);

        if (this.background) {
            this.context.drawImage(this.background, 0, 0, this.width, this.height);
        }

        let layers = Array.from(this.sprites.keys()).concat(Array.from(this.drawings.keys()));
        layers = layers.filter((item, pos) => layers.indexOf(item) === pos);
        layers = layers.sort((a, b) => a - b);

        for (const layer of layers) {
            if (this.drawings.has(layer)) {
                const layerDrawings = this.drawings.get(layer);

                for (const drawing of layerDrawings) {
                    drawing(this.context, this);
                }
            }

            if (this.sprites.has(layer)) {
                const layerSprites = this.sprites.get(layer);

                for (const sprite of layerSprites) {
                    if (sprite.hidden) {
                        continue;
                    }

                    const distance = Math.hypot(sprite.imageCenterX - this.camera.x, sprite.imageCenterY - this.camera.y);
                    const spriteRadius = Math.hypot(sprite.sourceWidth, sprite.sourceHeight) / 2 * this.camera.zoom;

                    if (distance > this.camera.renderRadius + spriteRadius) {
                        continue;
                    }

                    if (this.game.debugMode !== 'none') {
                        const fn = () => {

                            const x = sprite.imageCenterX - (this.context.measureText(sprite.name).width / 2);
                            let y = sprite.imageCenterY + sprite.height + 20;

                            this.context.fillStyle = this.game.debugColor;

                            this.context.font = '16px Arial';
                            this.context.fillText(sprite.name, x, y);
                            y += 20;

                            this.context.font = '14px Arial';
                            this.context.fillText('x: ' + sprite.x, x, y);
                            y += 20;
                            this.context.fillText('y: ' + sprite.y, x, y);
                            y += 20;
                            this.context.fillText('direction: ' + sprite.direction, x, y);
                            y += 20;
                            this.context.fillText('costume: ' + sprite.getCostumeName(), x, y);
                            y += 20;
                            this.context.fillText('xOffset: ' + sprite.pivotOffsetX, x, y);
                            y += 20;
                            this.context.fillText('yOffset: ' + sprite.pivotOffsetY, x, y);
                            // this.context.font = '40px Arial';
                            this.context.beginPath();
                            this.context.moveTo(sprite.globalX - 2, sprite.globalY);
                            this.context.lineTo(sprite.globalX + 2, sprite.globalY);
                            this.context.moveTo(sprite.globalX, sprite.globalY - 2);
                            this.context.lineTo(sprite.globalX, sprite.globalY + 2);
                            this.context.stroke()
                        };

                        if (this.game.debugMode === 'hover') {
                            if (sprite.touchMouse()) {
                                fn();
                            }
                        }

                        if (this.game.debugMode === 'forever') {
                            fn();
                        }
                    }

                    let phrase = sprite.getPhrase();
                    if (phrase) {
                        this.context.font = '20px Arial';
                        this.context.fillStyle = 'black';
                        this.context.fillText(phrase, 40, this.canvas.height - 40);
                    }

                    if (sprite.getCostume()) {
                        this.drawSprite(sprite);
                    }

                    for (const drawing of sprite.drawings) {
                        drawing(this.context, sprite);
                    }
                }
            }
        }

        if (this.game.debugCollider) {
            this.context.strokeStyle = this.game.debugColor;
            this.context.beginPath();
            this.collisionSystem.draw(this.context);
            this.context.stroke();
        }

        this.context.translate(-this.camera.changes.x, -this.camera.changes.y);

        const centerPointX = this.width / 2 + this.camera.startCornerX;
        const centerPointY = this.height / 2 + this.camera.startCornerY;

        this.context.translate(centerPointX, centerPointY);
        this.context.scale(this.camera.changes.zoom, this.camera.changes.zoom);
        // this.context.rotate(this.camera.changes.direction * Math.PI / 180);
        this.context.translate(-centerPointX, -centerPointY);

        this.camera.changes.reset();
    }

    private update(): void {
        if (this.tempScheduledCallbacks.length) {
            this.scheduledCallbacks = this.scheduledCallbacks.concat(this.tempScheduledCallbacks);
            this.tempScheduledCallbacks = [];
        }

        this.scheduledCallbacks = this.scheduledCallbacks.filter(
            this.scheduledCallbackExecutor.execute(Date.now(), this.diffTime)
        );

        this.sprites.forEach((layerSprites, layer) => {
            for (const sprite of layerSprites) {
                if (sprite.deleted) {
                    this.removeSprite(sprite, layer);
                    return;
                }

                sprite.update(this.diffTime);
            }
        });

        this.diffTime = 0;
    }

    /**
     * Run and stop
     */

    run(): void {
        if (!this._stopped) {
            return;
        }

        this._stopped = false;

        for (const layerSprites of this.sprites.values()) {
            for (const sprite of layerSprites) {
                sprite.run();
            }
        }

        this.pendingRun = true;
        this.tryDoRun();
    }

    ready(): void {
        this.tryDoOnReady();
        this.tryDoRun();

        for (const layerSprites of this.sprites.values()) {
            for (const sprite of layerSprites) {
                sprite.ready();
            }
        }
    }

    stop(): void {
        if (this._stopped) {
            return;
        }

        this._running = false;
        this._stopped = true;

        for (const layerSprites of this.sprites.values()) {
            for (const sprite of layerSprites) {
                sprite.stop();
            }
        }

        this.stoppedTime = Date.now();
    }

    private tryDoOnReady(): void {
        if (this.onReadyPending && this.isReady()) {
            this.onReadyPending = false;

            if (this.backgrounds.length && this.backgroundIndex === null) {
                this.switchBackground(0);
            }

            if (this.onReadyCallbacks.length) {
                for (const callback of this.onReadyCallbacks) {
                    callback();
                }
                this.onReadyCallbacks = [];
            }

            this.game.eventEmitter.emit(Game.STAGE_READY_EVENT, {
                stage: this
            });
        }
    }

    private doOnStart(): void {
        for (const callback of this.onStartCallbacks) {
            setTimeout(() => {
                callback();
            });
        }
    }

    private tryDoRun(): void {
        if (this.pendingRun && !this._running && this.isReady()) {
            this._running = true;
            this.pendingRun = false;

            this.doOnStart();
            this.diffTime = Date.now() - this.stoppedTime;

            setTimeout(() => { // Fix bug with "The parent is not defined in the collision system".
                const stoppedTime = this.stoppedTime;
                const loop = () => {
                    if (this._stopped || stoppedTime !== this.stoppedTime) {
                        return;
                    }

                    this.render();
                    requestAnimationFrame(loop);
                };

                loop();
            });
        }
    }

    private addListeners(): void {
        this.eventEmitter.on(Game.SPRITE_READY_EVENT, Game.SPRITE_READY_EVENT, (event: CustomEvent) => {
            if (this.id == event.detail.stageId) {
                this.loadedSprites++;
                this.tryDoOnReady();
                this.tryDoRun();
            }
        });
    }
}
