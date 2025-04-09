class Sprite {
    id: Symbol;
    eventEmitter: EventEmitter;
    collisionResult: CollisionResult;
    name = 'No name';

    private game: Game = null;
    protected costumeIndex = null;
    private costume: Costume = null;
    protected stage = null
    private costumes = [];
    private costumeNames = [];
    private sounds = [];
    private soundNames = [];
    private colliders = new Map<string, Collider>;
    private phrase = null;
    private phraseLiveTime = null;
    private _x = 0;
    private _y = 0;
    private _pivotOffsetX = 0;
    private _pivotOffsetY = 0;
    private _width = 0;
    private _height = 0;
    private _defaultColliderNone = false;
    private _direction = 0;
    private _size = 100;
    private _rotateStyle = 'normal'; // 'normal', 'leftRight', 'none'
    private _hidden = false;
    private _opacity = null;
    private _filter = null;
    protected _deleted = false;
    private _stopped = true;
    private _layer: number;
    private onReadyCallbacks = [];
    private onReadyPending = true;
    private scheduledCallbacks: Array<ScheduledCallbackItem> = [];
    private scheduledCallbackExecutor: ScheduledCallbackExecutor;
    private _drawings:  DrawingCallbackFunction[] = [];
    private pendingCostumeGrids =  0;
    private pendingCostumes =  0;
    private pendingSounds =  0;
    private _centerDistance = 0;
    private _centerAngle = 0;
    private _tags = [];
    private _parentSprite = null;
    private currentColliderName: string|null = null;
    private _children: Sprite[] = [];
    private _collidedSprite: Sprite|null = null

    constructor(stage: Stage = null, layer = 1, costumePaths = [], soundPaths = []) {
        if (!Registry.getInstance().has('game')) {
            throw new Error('You need create Game instance before Stage instance.');
        }
        this.game = Registry.getInstance().get('game');

        let sprite = this;
        if (this.game.displayErrors) {
            sprite = this.game.validatorFactory.createValidator(this, 'Sprite');
        }

        sprite.id = Symbol();
        sprite.eventEmitter = new EventEmitter();
        sprite.collisionResult = new CollisionResult();

        sprite.stage = stage;
        if (!this.stage) {
            sprite.stage = this.game.getLastStage();
        }

        if (!sprite.stage) {
            sprite.game.throwError(ErrorMessages.NEED_CREATE_STAGE_BEFORE_SPRITE);
        }

        sprite._layer = layer;

        sprite._x = sprite.game.width / 2;
        sprite._y = sprite.game.height / 2;

        for (const costumePath of costumePaths) {
            sprite.addCostume(costumePath);
        }

        for (const soundPath of soundPaths) {
            sprite.addSound(soundPath);
        }

        sprite.scheduledCallbackExecutor = new ScheduledCallbackExecutor(sprite);
        sprite.stage.addSprite(sprite);

        return sprite;
    }

    isReady() {
        return this.pendingCostumes === 0 && this.pendingCostumeGrids === 0 && this.pendingSounds === 0;
    }

    onReady(callback) {
        this.onReadyCallbacks.push(callback);
    }

    addCostume(
        costumePath: string,
        options?: CostumeOptions
    ): this {
        const costume = new Costume();
        const costumeIndex = this.costumes.length;
        const costumeName = (options?.name ?? 'Costume') + '-' + costumeIndex;

        this.costumes.push(costume);
        this.costumeNames.push(costumeName);
        this.pendingCostumes++;

        const image = new Image();
        image.src = costumePath;

        if (options?.alphaColor) {
            image.crossOrigin = 'anonymous';
        }

        const onLoadImage = () => {
            if (this.deleted) {
                return;
            }

            const transformedImage = this.transformImage(
                image,
                options?.rotate ?? 0,
                options?.flipX ?? false,
                options?.flipY ?? false,
                options?.x ?? 0,
                options?.y ?? 0,
                options?.width ?? image.naturalWidth,
                options?.height ?? image.naturalHeight,
                options?.alphaColor ?? null,
                options?.alphaTolerance ?? 0,
                options?.crop ?? 0,
                options?.cropTop ?? null,
                options?.cropRight ?? null,
                options?.cropBottom ?? null,
                options?.cropLeft ?? null
            );

            costume.image = transformedImage;
            costume.ready = true;

            this.pendingCostumes--;
            this.tryDoOnReady();

            image.removeEventListener('load', onLoadImage);
        };
        image.addEventListener('load', onLoadImage);

        image.addEventListener('error', () => {
            this.game.throwError(ErrorMessages.COSTUME_NOT_LOADED, {costumePath});
        });

        return this;
    }

    addCostumeGrid(
        costumePath: string,
        options: GridCostumeOptions
    ): this {
        const image = new Image();
        image.src = costumePath;

        let costumeName = options?.name ?? 'Costume';
        this.pendingCostumeGrids++;

        const onLoadImage = () => {
            image.naturalWidth;
            image.naturalHeight;

            let cols = options.cols;
            let rows = options.rows;
            let limit = options.limit;
            let offset = options.offset;

            const chunkWidth = image.naturalWidth / cols;
            const chunkHeight = image.naturalHeight / rows;
            let skip = false;

            let costumeIndex = 0;
            let x = 0;
            let y = 0;
            for (let i = 0; i < rows; i++) {
                for (let t = 0; t < cols; t++) {
                    skip = false;
                    if (offset !== null) {
                        if (offset > 0) {
                            offset--;
                            skip = true;
                        }
                    }

                    if (!skip) {
                        if (limit !== null) {
                            if (limit == 0) {
                                break;
                            }

                            if (limit > 0) {
                                limit--;
                            }
                        }

                        const costume = new Costume();

                        this.costumes.push(costume);
                        this.costumeNames.push(costumeName + '-' + costumeIndex);

                        const transformedImage = this.transformImage(
                            image,
                            options?.rotate ?? 0,
                            options?.flipX ?? false,
                            options?.flipY ?? false,
                            x + (options?.imageX ?? 0),
                            y + (options?.imageY ?? 0),
                            (options?.width ?? chunkWidth),
                            (options?.height ?? chunkHeight),
                            options?.alphaColor ?? null,
                            options?.alphaTolerance ?? 0,
                            options?.crop ?? 0,
                            options?.cropTop ?? null,
                            options?.cropRight ?? null,
                            options?.cropBottom ?? null,
                            options?.cropLeft ?? null
                        );

                        costume.image = transformedImage;
                        costume.ready = true;

                        costumeIndex++;
                    }

                    x += chunkWidth;
                }

                x = 0;
                y += chunkHeight;
            }

            this.pendingCostumeGrids--;
            this.tryDoOnReady();
            image.removeEventListener('load', onLoadImage);
        };

        image.addEventListener('load', onLoadImage);

        return this;
    }

    drawCostume(callback: DrawingCallbackFunction, options?: CostumeOptions): this {
        let image = document.createElement('canvas');
        const context = image.getContext('2d');

        image.width = options?.width ?? 100;
        image.height = options?.height ?? 100;

        this.pendingCostumes++;
        callback(context, this);

        const costumeIndex = this.costumes.length;
        const costumeName = (options?.name ?? 'Costume') + '-' + costumeIndex;

        const needTransform = Object.values(options || {}).some(value => !!value);
        if (needTransform) {
            image = this.transformImage(
                image,
                options?.rotate ?? 0,
                options?.flipX ?? false,
                options?.flipY ?? false,
                options?.x ?? 0,
                options?.y ?? 0,
                options?.width ?? image.width,
                options?.height ?? image.height,
                options?.alphaColor ?? null,
                options?.alphaTolerance ?? 0,
                options?.crop ?? 0,
                options?.cropTop ?? null,
                options?.cropRight ?? null,
                options?.cropBottom ?? null,
                options?.cropLeft ?? null
            );
        }

        const costume = new Costume();
        costume.image = image;
        costume.ready = true;

        this.costumes.push(costume);
        this.costumeNames.push(costumeName + '-' + costumeIndex);
        this.pendingCostumes--;

        return this;
    }

    removeCostume(costumeIndex: number): this {
        if (this.costumes[costumeIndex] === undefined) {
            this.game.throwError(ErrorMessages.COSTUME_INDEX_NOT_FOUND, {costumeIndex});
        }

        this.costumes.splice(costumeIndex, 1);
        this.costumeNames.splice(costumeIndex, 1);

        if (this.costumeIndex === costumeIndex) {
            this.costumeIndex = null;

            if (this.costumes.length > 0) {
                this.nextCostume();

            } else {
                this.costume = null;
            }
        }

        return this;
    }

    stamp(costumeIndex: number = null, withRotation = true) {
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.STAMP_NOT_READY);
        }

        costumeIndex = costumeIndex ?? this.costumeIndex;

        if (!this.costumes[costumeIndex]) {
            this.game.throwError(ErrorMessages.STAMP_COSTUME_NOT_FOUND, {costumeIndex});
        }

        const costume = this.costumes[costumeIndex];
        if (!(costume.image instanceof HTMLCanvasElement)) {
            this.game.throwErrorRaw('The image inside the costume was not found.');
        }

        let direction = 0;
        if (withRotation && this._rotateStyle === 'normal') {
            direction = this.direction;
        }

        this.stage.stampImage(costume.image, this.x, this.y, direction);
    }

    switchCostume(costumeIndex): void {
        if (this.deleted) {
            return;
        }

        const costume = this.costumes[costumeIndex];

        if (costume instanceof Costume && costume.ready) {
            this.costumeIndex = costumeIndex;
            this.costume = costume;
        }
    }

    switchCostumeByName(costumeName): void {
        const costumeIndex = this.costumeNames.indexOf(costumeName);

        if (costumeIndex > -1) {
            this.switchCostume(costumeIndex);

        } else {
            this.game.throwError(ErrorMessages.COSTUME_NAME_NOT_FOUND, {costumeName});
        }
    }

    nextCostume(minCostume = 0, maxCostume: number = null): void {
        if (this.deleted) {
            return;
        }

        const maxCostumeIndex = this.costumes.length - 1;
        minCostume = Math.min(maxCostumeIndex, Math.max(0, minCostume));
        maxCostume = Math.min(maxCostumeIndex, Math.max(0, maxCostume ?? maxCostumeIndex));

        let nextCostumeIndex = this.costumeIndex + 1;
        if (nextCostumeIndex > maxCostume || nextCostumeIndex < minCostume) {
            nextCostumeIndex = minCostume;
        }

        if (nextCostumeIndex !== this.costumeIndex) {
            this.switchCostume(nextCostumeIndex);
        }
    }

    prevCostume(minCostume = 0, maxCostume: number = null): void {
        if (this.deleted) {
            return;
        }

        const maxCostumeIndex = this.costumes.length - 1;
        minCostume = Math.min(maxCostumeIndex, Math.max(0, minCostume));
        maxCostume = Math.min(maxCostumeIndex, Math.max(0, maxCostume ?? maxCostumeIndex));

        let prevCostumeIndex = this.costumeIndex - 1;
        if (prevCostumeIndex < minCostume || prevCostumeIndex > maxCostume) {
            prevCostumeIndex = maxCostume;
        }

        if (prevCostumeIndex !== this.costumeIndex) {
            this.switchCostume(prevCostumeIndex);
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

    private cloneSound(sound: typeof Audio, name: string) {
        this.sounds.push(sound);
        this.soundNames.push(name);
    }

    addChild(child: Sprite): this {
        if (!this._children.includes(child)) {
            this._children.push(child);
            child.parent = this;
            child.layer = this.layer;
            child.x = 0;
            child.y = 0;
            child.direction = 0;
            for (const tag of this.tags){
                child.addTag(tag);
            }
        }

        child.parent = this;

        return this;
    }

    removeChild(child: Sprite): this {
        const foundChildIndex = this._children.indexOf(child);

        if (foundChildIndex > -1){
            const child = this._children[foundChildIndex];

            child.parent = null;
            for (const tag of this.tags){
                child.removeTag(tag);
            }
            this._children.splice(foundChildIndex, 1);
        }

        return this;
    }

    getChildren(): Sprite[] {
        return this._children;
    }

    move(steps): void {
        const angleRadians = this.absoluteAngleRadians;

        this.x += (steps * Math.sin(angleRadians));
        this.y -= (steps * Math.cos(angleRadians));
    }

    bounceOnEdge(): void {
        if (this.touchTopEdge() || this.touchBottomEdge()) {
            this.direction = 180 - this.direction;
        }

        if (this.touchLeftEdge() || this.touchRightEdge()) {
            this.direction *= -1;
        }
    }

    touchSprite(sprite: Sprite, checkChildren = true): boolean {
        this._collidedSprite = null;

        if (
              sprite.hidden ||
              this.hidden ||
              sprite.stopped ||
              this.stopped ||
              sprite.deleted ||
              this.deleted
        ) {
            return false;
        }

        const collider = this.collider;
        const otherCollider = sprite.collider;

        let isTouch = collider && otherCollider && collider.collides(otherCollider, this.collisionResult);
        if (isTouch) {
            return true;
        }

        if (collider) {
            for (const otherChild of sprite.getChildren()) {
                if (this.touchSprite(otherChild, false)) {
                    return true
                }
            }
        }

        if (!checkChildren) {
            return false;
        }

        for (const child of this._children) {
            if (otherCollider && child.touchSprite(sprite)) {
                this._collidedSprite = child;

                return true
            }

            for (const otherChild of sprite.getChildren()) {
                if (child.touchSprite(otherChild)) {
                    this._collidedSprite = child;

                    return true
                }
            }
        }

        return false;
    }

    touchSprites(sprites: Sprite[], checkChildren = true): boolean {
        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        for (const sprite of sprites) {
            if (this.touchSprite(sprite, checkChildren)) {
                return true;
            }
        }

        return false;
    }

    touchEdge(checkChildren = true): boolean {
        const result = this.getPureCollisionResult();
        this._collidedSprite = null;

        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        if (this.collider) {
            const gameWidth = this.game.width;
            const gameHeight = this.game.height;

            // top edge
            if (this.topY < 0) {
                result.collision = true;
                result.overlap = -this.topY;
                result.overlap_y = -1;

                return true;
            }

            // bottom edge
            if (this.bottomY > gameHeight) {
                result.collision = true;
                result.overlap = this.bottomY - gameHeight;
                result.overlap_y = 1;

                return true;
            }

            // left edge
            if (this.leftX < 0) {
                result.collision = true;
                result.overlap = -this.leftX;
                result.overlap_x = -1;

                return true;
            }

            // right edge
            if (this.rightX > gameWidth) {
                result.collision = true;
                result.overlap = this.rightX - gameWidth;
                result.overlap_x = 1;

                return true;
            }
        }

        if (checkChildren) {
            for (const child of this._children) {
                if (child.touchEdge()) {
                    this._collidedSprite = child;

                    return true;
                }
            }
        }

        return false;
    }

    touchTopEdge(checkChildren = true): boolean {
        this.clearCollisionResult();
        this._collidedSprite = null;

        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        if (this.collider && this.topY < 0) {
            this.collisionResult.collision = true;
            this.collisionResult.overlap = -this.topY;
            this.collisionResult.overlap_y = -1;

            return true;
        }

        if (checkChildren) {
            for (const child of this._children) {
                if (child.touchTopEdge()) {
                    this._collidedSprite = child;

                    return true;
                }
            }
        }

        return false;
    }

    touchBottomEdge(checkChildren = true): boolean {
        this.clearCollisionResult();
        this._collidedSprite = null;

        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        if (this.collider && this.bottomY > this.game.height) {
            this.collisionResult.collision = true;
            this.collisionResult.overlap = this.bottomY - this.game.height;
            this.collisionResult.overlap_y = 1;

            return true;
        }

        if (checkChildren) {
            for (const child of this._children) {
                if (child.touchBottomEdge()) {
                    this._collidedSprite = child;

                    return true;
                }
            }
        }

        return false;
    }

    touchLeftEdge(checkChildren = true): boolean {
        this.clearCollisionResult();
        this._collidedSprite = null;

        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        if (this.collider && this.leftX < 0) {
            this.collisionResult.collision = true;
            this.collisionResult.overlap = -this.leftX;
            this.collisionResult.overlap_x = -1;

            return true;
        }

        if (checkChildren) {
            for (const child of this._children) {
                if (child.touchLeftEdge()) {
                    this._collidedSprite = child;

                    return true;
                }
            }
        }

        return false;
    }

    touchRightEdge(checkChildren = true): boolean {
        this.clearCollisionResult();
        this._collidedSprite = null;

        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        if (this.collider && this.rightX > this.game.width) {
            this.collisionResult.collision = true;
            this.collisionResult.overlap = this.rightX - this.game.width;
            this.collisionResult.overlap_x = 1;

            return true;
        }

        if (checkChildren) {
            for (const child of this._children) {
                if (child.touchRightEdge()) {
                    this._collidedSprite = child;

                    return true;
                }
            }
        }

        return false;
    }

    get overlap() {
        if (this._collidedSprite) {
            return this._collidedSprite.overlap;
        }

        if (!this.collisionResult.collision) {
            return 0;
        }

        return this.collisionResult.overlap;
    }

    get overlapX() {
        if (this._collidedSprite) {
            return this._collidedSprite.overlapX;
        }

        if (!this.collisionResult.collision) {
            return 0;
        }

        return this.collisionResult.overlap_x * this.collisionResult.overlap;
    }

    get overlapY() {
        if (this._collidedSprite) {
            return this._collidedSprite.overlapY;
        }

        if (!this.collisionResult.collision) {
            return 0;
        }

        return this.collisionResult.overlap_y * this.collisionResult.overlap;
    }

    get drawings(): DrawingCallbackFunction[] {
        return this._drawings;
    }

    clearCollisionResult(): void {
        this.collisionResult.collision = false;
        this.collisionResult.a = null;
        this.collisionResult.b = null;
        this.collisionResult.a_in_b = false;
        this.collisionResult.b_in_a = false;
        this.collisionResult.overlap = 0;
        this.collisionResult.overlap_x = 0;
        this.collisionResult.overlap_y = 0;
    }

    getPureCollisionResult(): CollisionResult {
        this.clearCollisionResult();

        return this.collisionResult;
    }

    touchMouse(checkChildren = true): boolean {
        return this.touchMousePoint(this.game.getMousePoint(), checkChildren);
    }

    touchMousePoint(mousePoint: PointCollider, checkChildren = true): boolean {
        this._collidedSprite = null;

        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        const collider = this.collider;
        const isTouch = collider && collider.collides(mousePoint, this.collisionResult);

        if (isTouch) {
            return true;
        }

        if (checkChildren) {
            for (const child of this._children) {
                if (child.touchMousePoint(child.game.getMousePoint())) {
                    this._collidedSprite = child.otherSprite;

                    return true;
                }
            }
        }

        return false;
    }

    pointForward(object): void {
        let absoluteX = object.absoluteX ? object.absoluteX : object.x;
        let absoluteY = object.absoluteY ? object.absoluteY : object.y;

        this.direction = (Math.atan2(this.absoluteY - absoluteY , this.absoluteX - absoluteX) / Math.PI * 180) - 90
    }

    getDistanceTo(object): number {
        let absoluteX = object.absoluteX ? object.absoluteX : object.x;
        let absoluteY = object.absoluteY ? object.absoluteY : object.y;

        return Math.sqrt((Math.abs(this.absoluteX - absoluteX)) + (Math.abs(this.absoluteY - absoluteY)));
    }

    say(text, time = null): void {
        this.phrase = this.name + ': ' + text;

        this.phraseLiveTime = null;
        if (time) {
            const currentTime = (new Date()).getTime();
            this.phraseLiveTime = currentTime + time;
        }
    }

    getPhrase(): string|null {
        if (this.phrase) {
            if (this.phraseLiveTime === null) {
                return this.phrase;
            }

            const currentTime = (new Date()).getTime();
            if (this.phraseLiveTime > currentTime) {
                return this.phrase;

            } else {
                this.phrase = null;
                this.phraseLiveTime = null;
            }
        }

        return null;
    }

    createClone(stage: Stage = null): Sprite {
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.CLONED_NOT_READY);
        }

        if (!stage) {
            stage = this.stage;
        }

        const clone = new Sprite(stage, this.layer);

        clone.name = this.name;
        clone._rotateStyle = this._rotateStyle;

        clone.x = this.x;
        clone.y = this.y;
        clone.pivotOffsetX = this.pivotOffsetX;
        clone.pivotOffsetY = this.pivotOffsetY;
        clone.direction = this.direction;
        clone.size = this.size;
        clone.hidden = this.hidden;
        clone._deleted = this.deleted;
        clone._stopped = this.stopped;
        clone._tags.push(...this.tags);
        clone.defaultColliderNone = this.defaultColliderNone;

        for (let i = 0; i < this.costumes.length; i++) {
            clone.cloneCostume(this.costumes[i], this.costumeNames[i]);
        }

        clone.switchCostume(this.costumeIndex);

        for (let [soundIndex, sound] of this.sounds.entries()) {
            clone.cloneSound(sound, this.soundNames[soundIndex]);
        }

        clone.currentColliderName = null;
        clone.cloneCollider(this);

        if (this.currentColliderName) {
            clone.switchCollider(this.currentColliderName);
        }

        for (const child of this._children) {
            const childClone = child.createClone();
            clone.addChild(childClone);

            childClone.x = child.x;
            childClone.y = child.y;
        }

        clone.ready();

        return clone;
    }

    timeout(callback: ScheduledCallbackFunction, timeout: number): void {
        this.repeat(callback, 1, null, timeout, undefined);
    }

    repeat(callback: ScheduledCallbackFunction, repeat: number, interval: number = null, timeout: number = null, finishCallback: ScheduledCallbackFunction): ScheduledState {
        const state = new ScheduledState(interval, repeat, 0);

        if (timeout) {
            timeout = Date.now() + timeout;
        }

        this.scheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));

        return state;
    }

    forever(callback: ScheduledCallbackFunction, interval: number = null, timeout: number = null, finishCallback: ScheduledCallbackFunction): ScheduledState {
        const state = new ScheduledState(interval);

        if (timeout) {
            timeout = Date.now() + timeout;
        }

        this.scheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));

        return state;
    }

    pen(callback: DrawingCallbackFunction): void {
        this._drawings.push(callback);
    }

    update(diffTime: number) {
        if (this.deleted) {
            return;
        }

        this.scheduledCallbacks = this.scheduledCallbacks.filter(
          this.scheduledCallbackExecutor.execute(Date.now(), diffTime)
        );
    }

    delete(): void {
        if (this.deleted) {
            return;
        }

        this.stage.removeSprite(this, this.layer);

        this.eventEmitter.clearAll();
        this.removeCollider();
        this.scheduledCallbackExecutor = null;

        let props = Object.keys(this);
        for (let i = 0; i < props.length; i++) {
            delete this[props[i]];
        }

        this.costumes = [];
        this.costumeNames = [];
        this.sounds = [];
        this.soundNames = [];
        this.onReadyCallbacks = [];
        this.scheduledCallbacks = [];
        this._children = [];

        for (const child of this._children) {
            child.delete();
        }

        this._deleted = true;
    }

    run(): void {
        this._stopped = false;
    }

    stop(): void {
        this._stopped = true;
    }

    setPivotOffset(x: number = 0, y: number = 0): this {
        this.pivotOffsetX = x;
        this.pivotOffsetY = y;

        return this;
    }

    switchCollider(colliderName: string): this {
        if (!this.colliders.has(colliderName)) {
            this.game.throwError(ErrorMessages.COLLIDER_NAME_NOT_FOUND, {colliderName});
        }

        if (this.currentColliderName === colliderName) {
            return this;
        }

        const prevCollider = this.collider;
        if (prevCollider) {
            this.stage.collisionSystem.remove(prevCollider);
        }

        this.currentColliderName = colliderName;

        const newCollider = this.collider;
        this.stage.collisionSystem.insert(newCollider);

        this._width = newCollider.width;
        this._height = newCollider.height;

        return this;
    }

    getCollider(colliderName: string): Collider {
        if (!this.colliders.has(colliderName)) {
            this.game.throwError(ErrorMessages.COLLIDER_NAME_NOT_FOUND, {colliderName});
        }

        return this.colliders.get(colliderName);
    }

    hasCollider(colliderName: string): boolean {
        return this.colliders.has(colliderName);
    }

    get collider(): Collider|null {
        if (this.currentColliderName && this.colliders.has(this.currentColliderName)) {
            return this.colliders.get(this.currentColliderName);
        }

        return null;
    }

    setCollider(colliderName: string, collider: Collider, offsetX = 0, offsetY = 0): this {
        collider.parentSprite = this;
        collider.offset_x = offsetX;
        collider.offset_y = offsetY;

        if (this.currentColliderName === colliderName && this.colliders.has(colliderName)) {
            const prevCollider = this.colliders.get(colliderName);
            this.stage.collisionSystem.remove(prevCollider);
            this.currentColliderName = null;
        }

        this.colliders.set(colliderName, collider);
        this.updateColliderPosition(collider);

        if (this.isReady() && !this.collider) {
            this.switchCollider(colliderName);
        }

        return this;
    }

    setRectCollider(colliderName: string, width: number, height: number, offsetX = 0,  offsetY = 0): this {
        let angle = 0;
        if (this._rotateStyle != 'leftRight') {
            angle = this.absoluteAngleRadians; // to radian
        }

        const collider = new PolygonCollider(this.x, this.y, [
            [(width / 2) * -1, (height / 2) * -1],
            [width / 2, (height / 2) * -1],
            [width / 2, height / 2],
            [(width / 2) * -1, height / 2]
        ], angle, this.size / 100, this.size / 100);

        collider.width = width;
        collider.height = height;

        this.setCollider(colliderName, collider, offsetX,  offsetY);

        return this;
    }

    setPolygonCollider(colliderName: string, points: [number, number][] = [], offsetX = 0,  offsetY = 0): this {
        let angleRadians = 0;
        if (this._rotateStyle != 'leftRight') {
            angleRadians = this.absoluteAngleRadians;
        }

        const centroid = this.calculateCentroid(points);

        const centeredPoints: [number, number][] = points.map(point => [
            point[0] - centroid.x,
            point[1] - centroid.y
        ]);

        const collider = new PolygonCollider(this.x, this.y, centeredPoints, angleRadians, this.size / 100, this.size / 100);
        const { width, height } = this.calculatePolygonSize(centeredPoints);

        collider.width = width;
        collider.height = height;

        this.setCollider(colliderName, collider, offsetX, offsetY);

        return this;
    }

    setCircleCollider(colliderName: string, radius: number, offsetX = 0,  offsetY = 0): this {
        const collider = new CircleCollider(this.x, this.y, radius, this.size / 100);

        collider.width = radius * 2;
        collider.height = radius * 2;

        this.setCollider(colliderName, collider, offsetX, offsetY);

        return this;
    }

    setCostumeCollider(colliderName: string, costumeIndex = 0, offsetX = 0,  offsetY = 0): this {
        if (this.costumes[costumeIndex] === undefined) {
            this.game.throwError(ErrorMessages.COSTUME_INDEX_NOT_FOUND, {costumeIndex});
        }

        const costume = this.costumes[costumeIndex];

        this.setRectCollider(colliderName, costume.width, costume.height, offsetX, offsetY);

        return this;
    }

    removeCollider(colliderName: string = null) {
        if (colliderName) {
            this.removeColliderByName(colliderName);

        } else {
            const collider = this.collider;
            if (collider) {
                this.stage.collisionSystem.remove(collider);
            }

            this.colliders.clear();
            this.currentColliderName = null;
            this.defaultColliderNone = true;
        }
    }

    removeColliderByName(colliderName: string) {
        const collider = this.getCollider(colliderName);

        this.colliders.delete(colliderName);

        if (this.colliders.size === 0) {
            this.defaultColliderNone = true;
        }

        if (colliderName === this.currentColliderName) {
            this.stage.collisionSystem.remove(collider);

            if (this.colliders.size) {
                const nextColliderName = this.colliders.keys().next().value;
                this.switchCollider(nextColliderName);
            }
        }
    }

    getCostume(): Costume {
        return this.costume;
    }

    getCostumeName(): string {
        if (this.costumeIndex === null) {
            return 'No costume';
        }

        return this.costumeNames[this.costumeIndex];
    }

    getCostumeIndex(): string {
        return this.costumeIndex;
    }

    touchTag(tagName: string, checkChildren = true): boolean {
        this._collidedSprite = null;

        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        const collider = this.collider;
        if (collider) {
            const potentialsColliders = collider.potentials();

            if (!potentialsColliders.length) {
                return false;
            }

            for (const potentialCollider of potentialsColliders) {
                const potentialSprite = potentialCollider.parentSprite;

                if (potentialSprite && potentialSprite.hasTag(tagName)) {
                    if (
                        !potentialSprite.hidden &&
                        !potentialSprite.stopped &&
                        !potentialSprite.deleted &&
                        potentialSprite.collider &&
                        collider.collides(potentialCollider, this.collisionResult)
                    ) {
                        return true;
                    }
                }
            }
        }

        if (checkChildren) {
            for (const child of this._children) {
                if (child.touchTag(tagName)) {
                    this._collidedSprite = child;

                    return true;
                }
            }
        }

        return false;
    }

    touchTagAll(tagName: string, checkChildren = true) {
        this._collidedSprite = null;

        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        const collidedSprites = []
        const collider = this.collider;

        if (collider) {
            const potentialsColliders = collider.potentials();
            if (!potentialsColliders.length) {
                return false;
            }

            for (const potentialCollider of potentialsColliders) {
                const potentialSprite = potentialCollider.parentSprite;

                if (potentialSprite && potentialSprite.hasTag(tagName)) {
                    if (
                        !potentialSprite.hidden &&
                        !potentialSprite.stopped &&
                        !potentialSprite.deleted &&
                        potentialSprite.collider &&
                        collider.collides(potentialCollider, this.collisionResult)
                    ) {
                        collidedSprites.push(potentialSprite);
                    }
                }
            }
        }

        if (checkChildren) {
            for (const child of this._children) {
                const collision = child.touchTagAll(tagName);

                if (collision && !collision.length) {
                    for (const sprite of collision) {
                        collidedSprites.push(sprite);
                    }
                }
            }
        }

        if (!collidedSprites.length) {
            return collidedSprites;
        }

        return false;
    }

    touchAnySprite(checkChildren = true) {
        this._collidedSprite = null;

        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }

        const collider = this.collider;
        if (collider) {
            const potentialsColliders = collider.potentials();
            if (!potentialsColliders.length) {
                return false;
            }

            for (const potentialCollider of potentialsColliders) {
                const potentialSprite = potentialCollider.parentSprite;

                if (
                    !potentialSprite.hidden &&
                    !potentialSprite.stopped &&
                    !potentialSprite.deleted &&
                    potentialSprite.collider &&
                    collider.collides(potentialCollider, this.collisionResult)
                ) {
                    return true;
                }
            }
        }

        if (checkChildren) {
            for (const child of this._children) {
                if (child.touchAnySprite()) {
                    this._collidedSprite = child;

                    return true;
                }
            }
        }

        return false;
    }

    hasTag(tagName: string): boolean {
        return this._tags.includes(tagName);
    }

    addTag(tagName: string): this {
        if (!this.hasTag(tagName)) {
            this._tags.push(tagName);
        }

        for (const child of this._children) {
            child.addTag(tagName);
        }

        return this;
    }

    removeTag(tagName: string): this {
        const foundIndex = this._tags.indexOf(tagName);

        if (foundIndex > -1) {
            this._tags.splice(foundIndex, 1);
        }

        for (const child of this._children) {
            child.addTag(tagName);
        }

        return this;
    }

    set direction(direction: number) {
        if ((direction * 0) !== 0) { // d is +/-Infinity or NaN
            return;
        }

        direction = direction % 360;

        if (direction < 0) {
            direction += 360;
        }

        this._direction = (direction > 360) ? direction - 360 : direction;

        this.updateColliderAngle()

        for (const child of this._children) {
            child.updateColliderAngle()
        }
    }

    get direction(): number {
        return this._direction;
    }

    get absoluteDirection(): number{
        return this._parentSprite ? this._parentSprite.direction + this.direction : this.direction;
    }

    set defaultColliderNone (colliderNone: boolean) {
        this._defaultColliderNone = colliderNone;
    }

    get defaultColliderNone(): boolean {
        return this._defaultColliderNone;
    }

    get absoluteAngleRadians(): number {
        return this.absoluteDirection * Math.PI / 180;
    }

    get sourceWidth(): number {
        return this._width * this.size / 100;
    }

    get sourceHeight(): number {
        return this._height * this.size / 100;
    }

    get width(): number {
        if (this.collider instanceof PolygonCollider) {
            const angleRadians = this.absoluteAngleRadians;

            return Math.abs(this.sourceWidth * Math.cos(angleRadians)) + Math.abs(this.sourceHeight * Math.sin(angleRadians));
        }

        return this.sourceWidth;
    }

    get height(): number {
        if (this.collider instanceof PolygonCollider) {
            const angleRadians = this.absoluteAngleRadians;

            return Math.abs(this.sourceWidth * Math.sin(angleRadians)) + Math.abs(this.sourceHeight * Math.cos(angleRadians));
        }

        return this.sourceHeight;
    }

    set x(value: number) {
        this._x = value

        if (this._children.length) {
            this.updateCenterParams();
        }

        const collider = this.collider;
        if (collider) {
            this.updateColliderPosition(collider);
        }

        for (const child of this._children) {
            if (child.collider){
                child.updateColliderPosition(child.collider)
            }
        }
    }

    get x(): number {
        return this._x;
    }

    set y(value: number) {
        this._y = value;

        if (this._children.length) {
            this.updateCenterParams();
        }

        const collider = this.collider;
        if (collider) {
            this.updateColliderPosition(collider);
        }

        for (const child of this._children) {
            if (child.collider){
                child.updateColliderPosition(child.collider)
            }
        }
    }

    get y(): number {
        return this._y;
    }

    get sourceX() {
        if (this._rotateStyle === 'leftRight' || this._rotateStyle === 'none') {
            const leftRightMultiplier = this._direction > 180 && this._rotateStyle === 'leftRight' ? -1 : 1;

            return this.absoluteX - this._pivotOffsetX * leftRightMultiplier * this.size / 100;
        }

        return this.absoluteX + Math.cos(this._centerAngle - this.absoluteAngleRadians) * this._centerDistance * this.size / 100;
    }

    get sourceY() {
        if (this._rotateStyle === 'leftRight' || this._rotateStyle === 'none') {
            return this.absoluteY - this._pivotOffsetY * this.size / 100;
        }

        return this.absoluteY - Math.sin(this._centerAngle - this.absoluteAngleRadians) * this._centerDistance * this.size / 100;
    }

    get realX(): number {
        return this.x - this.width / 2;
    }

    get realY(): number {
        return this.y - this.height / 2;
    }

    get absoluteX() {
        if (this._parentSprite) {
            if (this._rotateStyle === 'leftRight' || this._rotateStyle === 'none') {
                const leftRightMultiplier = this._direction > 180 && this._rotateStyle === 'leftRight' ? -1 : 1;

                return this._parentSprite.absoluteX + this._x * leftRightMultiplier * this.size / 100;
            }

            return this._parentSprite.absoluteX + this.distanceToParent * Math.cos(this.angleToParent - this._parentSprite.absoluteAngleRadians) * this.size / 100;
        }

        return this._x;
    }

    get absoluteY() {
        if (this._parentSprite) {
            if (this._rotateStyle === 'leftRight' || this._rotateStyle === 'none') {
                return this._parentSprite.absoluteY + this._y;
            }

            return this._parentSprite.absoluteY - this.distanceToParent * Math.sin(this.angleToParent - this._parentSprite.absoluteAngleRadians) * this.size / 100;
        }

        return this._y;
    }

    get rightX(): number {
        const collider = this.collider;

        return this.sourceX + this.width / 2 + (collider ? collider.center_offset_x * this.size / 100 : 0);
    }

    get leftX(): number {
        const collider = this.collider;

        return this.sourceX - this.width / 2 + (collider ? collider.center_offset_x * this.size / 100 : 0);
    }

    get topY(): number {
        const collider = this.collider;

        return this.sourceY - this.height / 2 + (collider ? collider.center_offset_y * this.size / 100 : 0);
    }

    get bottomY(): number {
        const collider = this.collider;

        return this.sourceY + this.height / 2 + (collider ? collider.center_offset_y * this.size / 100 : 0);
    }

    set size(value: number) {
        this._size = value;

        const collider = this.collider;
        if (collider) {
            this.updateColliderSize(collider);
        }

        for (const child of this._children){
            child.size = value;
        }
    }

    get size(): number {
        return this._size;
    }

    set rotateStyle(value: string) {
        this._rotateStyle = value;

        for (const child of this._children){
            child.rotateStyle = value;
        }
    }

    get rotateStyle(){
        return this._rotateStyle;
    }

    set hidden(value: boolean) {
        this._hidden = value;

        for (const child of this._children){
            child.hidden = value;
        }

        // TODO need test
        // if (value) {
        //     this.removeBody();
        //
        // } else {
        //     if (this.costume instanceof Costume) {
        //         this.createBody(this.costume);
        //     }
        // }
    }

    get hidden(): boolean {
        return this._hidden;
    }

    get collidedSprite(){
        return this._collidedSprite;
    }

    set opacity(value: number|null) {
        if (value === null) {
            this._opacity = null;

        } else {
            this._opacity = Math.min(1, Math.max(0, value));
        }
    }

    get opacity(): number|null {
        return this._opacity;
    }

    set filter(value: string|null) {
        this._filter = value;
    }

    get filter(): string|null {
        return this._filter;
    }

    get deleted(): boolean {
        return this._deleted;
    }

    get stopped(): boolean {
        return this._stopped;
    }

    set pivotOffsetX(value:number) {
        const prevX = this.x;
        this._pivotOffsetX = value;
        this.updateCenterParams()
        this.x = prevX;
    }

    get pivotOffsetX() {
        return this._pivotOffsetX;
    }

    set pivotOffsetY(value:number) {
        const prevY = this.y;
        this._pivotOffsetY = value;
        this.updateCenterParams()
        this.y = prevY;
    }

    get pivotOffsetY() {
        return this._pivotOffsetY;
    }

    set layer(newLayer: number) {
        this.stage.changeSpriteLayer(this, this._layer, newLayer);
        this._layer = newLayer;

        for (const child of this._children) {
            child.layer = child.layer + this._layer;
        }
    }

    get layer(): number {
        return this._layer;
    }

    get tags(){
        return this._tags;
    }

    get otherSprite() {
        if (!this.collisionResult.collision) {
            return null;
        }
        return this.collisionResult.b.parentSprite;
    }

    get otherMainSprite() {
        if (!this.collisionResult.collision) {
            return null;
        }

        return this.collisionResult.b.parentSprite.getMainSprite();
    }

    set parent(newParent) {
        this._parentSprite = newParent;
    }

    get parent(){
        return this._parentSprite;
    }

    get angleToParent(){
        return -Math.atan2(this.y, this.x);
    }

    get distanceToParent(){
        return Math.hypot(this.x, this.y);
    }

    ready(): void {
        this.tryDoOnReady();
    }

    private transformImage(
        srcImage: HTMLImageElement|HTMLCanvasElement,
        rotate: number,
        flipX: boolean = false,
        flipY: boolean = false,
        imageX: number = 0,
        imageY: number = 0,
        imageWidth: number = null,
        imageHeight: number = null,
        imageAlphaColor = null,
        imageAlphaTolerance = 0,
        crop = 0,
        cropTop = null,
        cropRight = null,
        cropBottom = null,
        cropLeft = null
    ): HTMLCanvasElement {
        cropTop = cropTop ?? crop;
        cropRight = cropRight ?? crop;
        cropBottom = cropBottom ?? crop;
        cropLeft = cropLeft ?? crop;

        imageX += cropRight;
        imageWidth -= cropRight;
        imageWidth -= cropLeft;
        imageY += cropTop;
        imageHeight -= cropTop;
        imageHeight -= cropBottom;

        let imageCanvas = document.createElement('canvas');
        const context = imageCanvas.getContext('2d')!;

        const radians = rotate * Math.PI / 180;
        let canvasWidth = imageWidth ?? (srcImage instanceof HTMLImageElement ? srcImage.naturalWidth : srcImage.width);
        let canvasHeight = imageHeight ?? (srcImage instanceof HTMLImageElement ? srcImage.naturalHeight : srcImage.height);

        if (rotate) {
            const absCos = Math.abs(Math.cos(radians));
            const absSin = Math.abs(Math.sin(radians));

            canvasWidth = canvasWidth * absCos + canvasHeight * absSin;
            canvasHeight = canvasWidth * absSin + canvasHeight * absCos;
        }

        imageCanvas.width = Math.ceil(canvasWidth);
        imageCanvas.height = Math.ceil(canvasHeight);

        context.translate(imageCanvas.width / 2, imageCanvas.height / 2);

        if (rotate) {
            context.rotate(radians);
        }

        if (flipX || flipY) {
            context.scale(flipX ? -1 : 1, flipY ? -1 : 1);
        }

        const offsetX = -imageWidth / 2;
        const offsetY = -imageHeight / 2;

        context.drawImage(
            srcImage,
            imageX,
            imageY,
            imageWidth,
            imageHeight,
            offsetX,
            offsetY,
            imageWidth,
            imageHeight
        );

        if (imageAlphaColor) {
            imageCanvas = this.setAlpha(imageCanvas, imageAlphaColor, imageAlphaTolerance ?? 0);
        }

        return imageCanvas;
    }

    private setAlpha(
      image: HTMLCanvasElement,
      targetColor: { r: number; g: number; b: number } | string,
      tolerance = 0
    ): HTMLCanvasElement {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('Canvas context is not available');
        }

        canvas.width = image.width;
        canvas.height = image.height;

        const imageData = image.getContext('2d').getImageData(0, 0, image.width, image.height);
        const data = imageData.data;

        let targetRGB: { r: number; g: number; b: number };
        if (typeof targetColor === 'string') {
            targetRGB = this.hexToRgb(targetColor);

            if (!targetRGB) {
                throw new Error(`Invalid HEX color: ${targetColor}`);
            }

        } else {
            targetRGB = targetColor;
        }

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];     // Красный канал
            const g = data[i + 1]; // Зеленый канал
            const b = data[i + 2]; // Синий канал

            if (
              Math.abs(r - targetRGB.r) <= tolerance &&
              Math.abs(g - targetRGB.g) <= tolerance &&
              Math.abs(b - targetRGB.b) <= tolerance
            ) {
                data[i + 3] = 0;
            }
        }

        context.putImageData(imageData, 0, 0);

        return canvas;
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        // Убираем символ "#" из строки, если он есть
        hex = hex.replace(/^#/, '');

        // Проверяем длину строки (3 или 6 символов)
        if (hex.length === 3) {
            hex = hex.split('').map(char => char + char).join('');
        }

        if (hex.length !== 6) {
            return null;
        }

        const bigint = parseInt(hex, 16);

        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    }

    cloneCostume(costume: Costume, name: string) {
        this.costumes.push(costume);
        this.costumeNames.push(name);
    }

    cloneCollider(sprite: Sprite): void {
        const colliders = sprite.getColliders();
        for (const [colliderName, sourceCollider] of colliders) {
            if (sourceCollider instanceof CircleCollider) {
                this.setCircleCollider(colliderName, sourceCollider.radius, sourceCollider.offset_x, sourceCollider.offset_y);
            }

            if (sourceCollider instanceof PolygonCollider) {
                this.setPolygonCollider(colliderName, sourceCollider.points, sourceCollider.offset_x, sourceCollider.offset_y);
            }
        }
    }

    private tryDoOnReady() {
        if (this.onReadyPending && this.isReady()) {
            this.onReadyPending = false;

            if (this.costumes.length && this.costume === null) {
                this.switchCostume(0);
            }

            if (!this.defaultColliderNone && this.colliders.size === 0 && this.costumes.length) {
                const colliderName = 'main';
                this.setCostumeCollider(colliderName, 0);
                this.switchCollider(colliderName);
                this.updateColliderPosition(this.collider);
                this.updateColliderSize(this.collider);
            }

            if (!this.collider && this.colliders.size) {
                const colliderName = this.colliders.keys().next().value;
                this.switchCollider(colliderName);
                this.updateColliderPosition(this.collider);
                this.updateColliderSize(this.collider);
            }

            if (this.onReadyCallbacks.length) {
                for (const callback of this.onReadyCallbacks) {
                    callback();
                }
                this.onReadyCallbacks = [];
            }

            this.stage.eventEmitter.emit(Game.SPRITE_READY_EVENT, {
                sprite: this,
                stageId: this.stage.id
            });
        }
    }

    private calculateCentroid(points: [number, number][]): { x: number; y: number } {
        let xSum = 0;
        let ySum = 0;

        for (const point of points) {
            xSum += point[0];
            ySum += point[1];
        }

        const x = xSum / points.length;
        const y = ySum / points.length;

        return { x, y };
    }

    private calculatePolygonSize(points: [number, number][]): { width: number; height: number } {
        let minX = points[0][0];
        let minY = points[0][1];
        let maxX = points[0][0];
        let maxY = points[0][1];

        for (const vertex of points) {
            if (vertex[0] < minX) minX = vertex[0];
            if (vertex[0] > maxX) maxX = vertex[0];
            if (vertex[1] < minY) minY = vertex[1];
            if (vertex[1] > maxY) maxY = vertex[1];
        }

        const width = maxX - minX;
        const height = maxY - minY;

        return {width, height};
    }

    private updateCenterParams(): void {
        this._centerDistance = Math.hypot(this._pivotOffsetX, this._pivotOffsetY);
        this._centerAngle = -Math.atan2(-this._pivotOffsetY , -this._pivotOffsetX);
    }

    private updateColliderPosition(collider: Collider): void {
        collider.x = this.sourceX + collider.center_offset_x * this.size / 100;
        collider.y = this.sourceY + collider.center_offset_y * this.size / 100;
    }

    updateColliderAngle() {
        const collider = this.collider;
        if (collider instanceof PolygonCollider) {
            if (this._rotateStyle == 'leftRight') {
                collider.angle = 0; // to radian

            } else {
                collider.angle = this.absoluteAngleRadians; // to radian
            }
        }

        if (collider) {
            this.updateColliderPosition(collider);
        }
    }

    private updateColliderSize(collider: Collider): void {
        if (collider instanceof PolygonCollider) {
            collider.scale_x = this.size / 100;
            collider.scale_y = this.size / 100;

        } else if (collider instanceof CircleCollider) {
            collider.scale = this.size / 100;
        }
    }

    private getColliders(): IterableIterator<[string, Collider]> {
        return this.colliders.entries();
    }

    getMainSprite(){
        if (this._parentSprite){
            return this._parentSprite.getMainSprite();
        }

        return this;
    }

    setParent(parent: Sprite): this{
        parent.addChild(this);

        return this;
    }
}
