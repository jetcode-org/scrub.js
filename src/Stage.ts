class Stage {
    id: Symbol;
    eventEmitter: EventEmitter;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    collisionSystem: CollisionSystem;

    private game: Game;
    private background: HTMLCanvasElement = null;
    private backgroundIndex = null;
    private backgrounds = [];
    private sounds = [];
    private soundNames = [];
    private sprites = new Map<number, Sprite[]>();
    private drawings = new Map<number, DrawingCallbackFunction[]>();
    private addedSprites = 0;
    private loadedSprites = 0;
    private pendingBackgrounds = 0;
    private pendingSounds =  0;
    private pendingRun = false;
    private onReadyCallbacks = [];
    private onStartCallbacks = [];
    private onReadyPending = true;
    private scheduledCallbacks: Array<ScheduledCallbackItem> = [];
    private _stopped = true;
    private _running = false;
    private stoppedTime = null;
    private diffTime = null;
    private scheduledCallbackExecutor: ScheduledCallbackExecutor;

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

        return stage;
    }

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
        return this.canvas.height;
    }

    get running(): boolean {
        return this._running;
    }

    get stopped(): boolean {
        return this._stopped;
    }

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

    addSound(soundPath: string, name: string = null): this {
        if (!name) {
            name = 'No name ' + this.sounds.length;
        }

        const sound = new Audio();
        sound.src = soundPath;

        this.sounds.push(sound);
        this.soundNames.push(name);
        this.pendingSounds++;

        sound.load();

        const onLoadSound =  () => {
            this.pendingSounds--;
            this.tryDoOnReady();

            sound.removeEventListener('loadedmetadata', onLoadSound);
        };
        sound.addEventListener('loadedmetadata', onLoadSound);

        return this;
    }

    removeSound(soundIndex = 0): this {
        if (this.sounds[soundIndex] === undefined) {
            this.game.throwError(ErrorMessages.SOUND_INDEX_NOT_FOUND, {soundIndex});
        }

        this.sounds.splice(soundIndex, 1);

        return this;
    }

    removeSoundByName(soundName: string): this {
        const soundIndex = this.soundNames.indexOf(soundName);

        if (soundIndex < 0) {
            this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, {soundName});
        }

        this.sounds.splice(soundIndex, 1);

        return this;
    }

    playSound(soundIndex = 0, volume: number = null, currentTime: number = null): void {
        const sound = this.sounds[soundIndex];

        if (!(sound instanceof Audio)) {
            this.game.throwError(ErrorMessages.SOUND_INDEX_NOT_FOUND, {soundIndex});
        }

        sound.play();

        if (volume !== null) {
            sound.volume = volume;
        }

        if (currentTime !== null) {
            sound.currentTime = currentTime;
        }
    }

    pauseSound(soundIndex: number): void {
        const sound = this.sounds[soundIndex];

        if (!(sound instanceof Audio)) {
            this.game.throwError(ErrorMessages.SOUND_INDEX_NOT_FOUND, {soundIndex});
        }

        sound.pause();
    }

    playSoundByName(soundName: string, volume: number = null, currentTime: number = null): void {
        const soundIndex = this.soundNames.indexOf(soundName);

        if (soundIndex < 0) {
            this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, {soundName});
        }

        this.playSound(soundIndex, volume, currentTime);
    }

    pauseSoundByName(soundName: string): void {
        const soundIndex = this.soundNames.indexOf(soundName);

        if (soundIndex < 0) {
            this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, {soundName});
        }

        this.pauseSound(soundIndex);
    }

    drawSprite(sprite: Sprite): void {
        const costume = sprite.getCostume();
        const image = costume.image;
        const dstX = sprite.sourceX - sprite.sourceWidth / 2;
        const dstY = sprite.sourceY - sprite.sourceHeight / 2;
        const dstWidth = sprite.sourceWidth;
        const dstHeight = sprite.sourceHeight;
        const direction = sprite.direction;
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
            this.context.rotate(sprite.angleRadians);
            this.context.translate(-dstX - dstWidth / 2, -dstY - dstHeight / 2);
        }

        if (rotateStyle === 'leftRight' && direction > 180) {
            this.context.translate(dstX + dstWidth / 2, 0);
            this.context.scale(-1, 1);

            // mirror image
            this.context.drawImage(
                image,
                0,
                0,
                costume.width,
                costume.height,
                (-dstWidth / 2) + colliderOffsetX,
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

    stampImage(stampImage: HTMLCanvasElement|HTMLImageElement, x: number, y: number, direction = 0) {
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

    render(): void {
        this.update();
        this.collisionSystem.update();

        this.context.clearRect(0, 0, this.width, this.height);

        if (this.background) {
            this.context.drawImage(this.background, 0, 0, this.width, this.height);
        }

        let layers = Array.from(this.sprites.keys()).concat(Array.from(this.drawings.keys()));
        layers = layers.filter((item, pos) => layers.indexOf(item) === pos);
        layers = layers.sort((a, b) => a - b);

        for(const layer of layers) {
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

                    if (this.game.debugMode !== 'none') {
                        const fn = () => {

                            const x = sprite.x - (this.context.measureText(sprite.name).width / 2);
                            let y = sprite.realY + sprite.height + 20;

                            this.context.fillStyle = this.game.debugColor;

                            this.context.font = '16px Arial';
                            this.context.fillText(sprite.name, x, y);
                            y += 20;

                            this.context.font = '14px Arial';
                            this.context.fillText("x: " + sprite.x, x, y);
                            y += 20;
                            this.context.fillText("y: " + sprite.y, x, y);
                            y += 20;
                            this.context.fillText("direction: " + sprite.direction, x, y);
                            y += 20;
                            this.context.fillText("costume: " + sprite.getCostumeName(), x, y);
                            y += 20;
                            this.context.fillText("xOffset: " + sprite.xCenterOffset, x, y);
                            y += 20;
                            this.context.fillText("yOffset: " + sprite.yCenterOffset, x, y);
                            // this.context.font = '40px Arial';
                            this.context.beginPath();
                            this.context.moveTo(sprite.x - 2, sprite.y);
                            this.context.lineTo(sprite.x + 2, sprite.y);
                            this.context.moveTo(sprite.x, sprite.y - 2);
                            this.context.lineTo(sprite.x, sprite.y + 2);
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
    }

    timeout(callback: ScheduledCallbackFunction, timeout: number): void {
        this.repeat(callback, 1, null, timeout, undefined);
    }

    repeat(callback: ScheduledCallbackFunction, repeat: number, interval: number = null, timeout: number = null, finishCallback?: ScheduledCallbackFunction): ScheduledState {
        const state = new ScheduledState(interval, repeat, 0);

        if (timeout) {
            timeout = Date.now() + timeout;
        }

        this.scheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));

        return state;
    }

    forever(callback: ScheduledCallbackFunction, interval: number = null, timeout: number = null, finishCallback?: ScheduledCallbackFunction): ScheduledState {
        const state = new ScheduledState(interval);

        if (timeout) {
            timeout = Date.now() + timeout;
        }

        this.scheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));

        return state;
    }

    isReady() {
        return this.addedSprites == this.loadedSprites && this.pendingBackgrounds === 0;
    }

    run(): void {
        if (!this._stopped) {
            return;
        }

        this._stopped = false;

        for(const layerSprites of this.sprites.values()) {
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

        for(const layerSprites of this.sprites.values()) {
            for (const sprite of layerSprites) {
                sprite.ready();
            }
        }
    }

    onStart(onStartCallback) {
        this.onStartCallbacks.push(onStartCallback);
    }

    onReady(callback) {
        this.onReadyCallbacks.push(callback);
    }

    stop(): void {
        if (this._stopped) {
            return;
        }

        this._running = false;
        this._stopped = true;

        for(const layerSprites of this.sprites.values()) {
            for (const sprite of layerSprites) {
                sprite.stop();
            }
        }

        this.stoppedTime = Date.now();
    }

    getSprites() {
        return Array.from(this.sprites.values()).reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
    }

    private addListeners() {
        this.eventEmitter.on(Game.SPRITE_READY_EVENT, Game.SPRITE_READY_EVENT, (event: CustomEvent) => {
            if (this.id == event.detail.stageId) {
                this.loadedSprites++;
                this.tryDoOnReady();
                this.tryDoRun();
            }
        });
    }

    private tryDoOnReady() {
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

    private doOnStart() {
        for (const callback of this.onStartCallbacks) {
            setTimeout(() => {
                callback();
            });
        }
    }

    private tryDoRun() {
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

    private update() {
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
}
