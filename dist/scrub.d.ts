declare class Costume {
    image: HTMLCanvasElement;
    ready: boolean;
    get width(): number;
    get height(): number;
}
declare class EventEmitter {
    private eventTarget;
    private callbacksMap;
    constructor();
    once(name: string, type: string, callback: EventListenerOrEventListenerObject): boolean;
    on(name: string, type: string, callback: EventListenerOrEventListenerObject): boolean;
    emit(type: string, detail: any): void;
    remove(name: string): boolean;
    removeByType(type: string): void;
    clearAll(): void;
}
type DrawingCallbackFunction = (context: CanvasRenderingContext2D, object: Stage | Sprite) => void;
type ScheduledCallbackFunction = (context: Stage | Sprite, state: ScheduledState) => boolean | void;
type Locale = 'ru' | 'en';
type TransformableObject = {
    x: number;
    y: number;
    globalX?: number;
    globalY?: number;
};
type GridCostumeOptions = {
    cols: number;
    rows: number;
    limit?: number;
    offset?: number;
    name?: string;
    rotate?: number;
    flipX?: boolean;
    flipY?: boolean;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    alphaColor?: string | {
        r: number;
        g: number;
        b: number;
    };
    alphaTolerance?: number;
    crop?: number;
    cropTop?: number;
    cropRight?: number;
    cropBottom?: number;
    cropLeft?: number;
};
type CostumeOptions = {
    name?: string;
    rotate?: number;
    flipX?: boolean;
    flipY?: boolean;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    alphaColor?: string | {
        r: number;
        g: number;
        b: number;
    };
    alphaTolerance?: number;
    crop?: number;
    cropTop?: number;
    cropRight?: number;
    cropBottom?: number;
    cropLeft?: number;
};
declare class Game {
    id: Symbol;
    eventEmitter: EventEmitter;
    validatorFactory: ValidatorFactory;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    keyboard: Keyboard;
    mouse: Mouse;
    debugMode: string;
    debugCollider: boolean;
    debugColor: string;
    static readonly STAGE_READY_EVENT = "scrubjs.stage.ready";
    static readonly STAGE_BACKGROUND_READY_EVENT = "scrubjs.stage.background_ready";
    static readonly SPRITE_READY_EVENT = "scrubjs.sprite.ready";
    private stages;
    private activeStage;
    private styles;
    private loadedStages;
    private onReadyCallbacks;
    private onReadyPending;
    protected running: boolean;
    private pendingRun;
    private reportedError;
    private _displayErrors;
    private _locale;
    constructor(width?: number, height?: number, canvasId?: string, displayErrors?: boolean, locale?: Locale);
    addStage(stage: Stage): this;
    getLastStage(): Stage | null;
    getActiveStage(): Stage | null;
    run(stage?: Stage): void;
    isReady(): boolean;
    onReady(callback: CallableFunction): void;
    stop(): void;
    get displayErrors(): boolean;
    get locale(): string;
    get width(): number;
    get height(): number;
    isInsideGame(x: number, y: number): boolean;
    correctMouseX(mouseX: number): number;
    correctMouseY(mouseY: number): number;
    keyPressed(char: string | string[]): boolean;
    keyDown(char: string, callback: CallableFunction): void;
    keyUp(char: string, callback: CallableFunction): void;
    mouseDown(): boolean;
    mouseDownOnce(): boolean;
    getMousePoint(): PointCollider;
    getRandom(min: number, max: number): number;
    throwError(messageId: string, variables?: {} | null): void;
    throwErrorRaw(message: string): void;
    private reportError;
    private addListeners;
    private tryDoOnReady;
    private tryDoRun;
}
declare class KeyboardMap {
    private static map;
    static getChar(keyCode: number): string;
}
declare class MultiplayerControl {
    private game;
    private connection;
    private trackedKeys;
    private receiveDataConnections;
    private keydownCallback;
    private mousedownCallback;
    private userKeydownCallbacks;
    private systemLockedChars;
    private userLockedChars;
    private userMousedownCallback;
    private systemMouseLocked;
    private userMouseLocked;
    constructor(player: Player, game: MultiplayerGame, connection: JetcodeSocketConnection, isMe: boolean);
    private defineListeners;
    stop(): void;
    keyDown(char: string, callback: any, syncPackName: string, syncData?: SyncObjectInterface[]): void;
    removeKeyDownHandler(char: any): void;
    mouseDown(callback: CallableFunction, syncPackName: string, syncData?: SyncObjectInterface[]): void;
    removeMouseDownHandler(): void;
}
declare class Sprite {
    id: Symbol;
    eventEmitter: EventEmitter;
    collisionResult: CollisionResult;
    name: string;
    private game;
    protected stage: Stage;
    private _parentSprite;
    private _collidedSprite;
    private _original;
    protected costumeIndex: number;
    private costume;
    private costumes;
    private costumeNames;
    private sounds;
    private soundNames;
    private currentColliderName;
    private colliders;
    private phrase;
    private phraseLiveTime;
    private _x;
    private _y;
    private _pivotOffsetX;
    private _pivotOffsetY;
    private _width;
    private _height;
    private _defaultColliderNone;
    private _direction;
    private _size;
    private _centerDistance;
    private _centerAngle;
    private _rotateStyle;
    private _hidden;
    private _opacity;
    private _filter;
    protected _deleted: boolean;
    private _stopped;
    private _layer;
    private pendingCostumeGrids;
    private pendingCostumes;
    private pendingSounds;
    private _children;
    private onReadyCallbacks;
    private onReadyPending;
    private scheduledCallbackExecutor;
    private scheduledCallbacks;
    private tempScheduledCallbacks;
    private _drawings;
    private _tags;
    constructor(stage?: Stage, layer?: number, costumePaths?: any[], soundPaths?: any[]);
    onReady(callback: CallableFunction): void;
    isReady(): boolean;
    get deleted(): boolean;
    get stopped(): boolean;
    setParent(parent: Sprite): this;
    addChild(child: Sprite): this;
    removeChild(child: Sprite): this;
    getChildren(): Sprite[];
    set parent(newParent: Sprite | null);
    get parent(): Sprite | null;
    getMainSprite(): Sprite;
    switchCollider(colliderName: string): this;
    setCollider(colliderName: string, collider: Collider, offsetX?: number, offsetY?: number): this;
    setRectCollider(colliderName: string, width: number, height: number, offsetX?: number, offsetY?: number): this;
    setPolygonCollider(colliderName: string, points: [number, number][], offsetX?: number, offsetY?: number): this;
    setCircleCollider(colliderName: string, radius: number, offsetX?: number, offsetY?: number): this;
    setCostumeCollider(colliderName: string, costumeIndex?: number, offsetX?: number, offsetY?: number): this;
    removeCollider(colliderName?: string): this;
    removeColliderByName(colliderName: string): this;
    getCollider(colliderName: string): Collider;
    hasCollider(colliderName: string): boolean;
    get collider(): Collider | null;
    get collidedSprite(): Sprite | null;
    set defaultColliderNone(colliderNone: boolean);
    get defaultColliderNone(): boolean;
    getColliders(): IterableIterator<[string, Collider]>;
    cloneCollider(sprite: Sprite): void;
    private calculateCentroid;
    private calculatePolygonSize;
    private updateColliderPosition;
    private updateColliderAngle;
    private updateColliderSize;
    addTag(tagName: string): this;
    removeTag(tagName: string): this;
    hasTag(tagName: string): boolean;
    get tags(): string[];
    addCostume(costumePath: string, options?: CostumeOptions): this;
    addCostumeGrid(costumePath: string, options: GridCostumeOptions): this;
    drawCostume(callback: DrawingCallbackFunction, options?: CostumeOptions): this;
    removeCostume(costumeIndex: number): this;
    switchCostume(costumeIndex: number): this;
    switchCostumeByName(costumeName: string): this;
    nextCostume(minCostume?: number, maxCostume?: number): number;
    prevCostume(minCostume?: number, maxCostume?: number): number;
    getCostume(): Costume;
    getCostumeName(): string;
    getCostumeIndex(): number;
    private transformImage;
    private setAlpha;
    private hexToRgb;
    cloneCostume(costume: Costume, name: string): void;
    addSound(soundPath: string, name?: string): this;
    removeSound(soundIndex?: number): this;
    removeSoundByName(soundName: string): this;
    playSound(soundIndex?: number, volume?: number, currentTime?: number): void;
    pauseSound(soundIndex: number): void;
    playSoundByName(soundName: string, volume: number, currentTime: number): void;
    pauseSoundByName(soundName: string): void;
    cloneSound(sound: HTMLAudioElement, name: string): void;
    stamp(costumeIndex?: number, withRotation?: boolean): void;
    pen(callback: DrawingCallbackFunction): void;
    get drawings(): DrawingCallbackFunction[];
    set opacity(value: number | null);
    get opacity(): number | null;
    set filter(value: string | null);
    get filter(): string | null;
    set rotateStyle(value: string);
    get rotateStyle(): string;
    set layer(newLayer: number);
    get layer(): number;
    set hidden(value: boolean);
    get hidden(): boolean;
    say(text: string, time?: number): void;
    getPhrase(): string | null;
    move(steps: number): void;
    pointForward(object: TransformableObject): void;
    getDistanceTo(object: TransformableObject): number;
    bounceOnEdge(): void;
    set x(value: number);
    get x(): number;
    set y(value: number);
    get y(): number;
    get globalX(): number;
    get globalY(): number;
    get imageCenterX(): number;
    get imageCenterY(): number;
    get realX(): number;
    get realY(): number;
    get rightX(): number;
    set rightX(x: number);
    get leftX(): number;
    set leftX(x: number);
    get topY(): number;
    set topY(y: number);
    get bottomY(): number;
    set bottomY(y: number);
    get width(): number;
    get height(): number;
    get sourceWidth(): number;
    get sourceHeight(): number;
    set size(value: number);
    get size(): number;
    set direction(direction: number);
    get direction(): number;
    set globalDirection(value: number);
    get globalDirection(): number;
    get globalAngleRadians(): number;
    get angleToParent(): number;
    get distanceToParent(): number;
    setPivotOffset(x?: number, y?: number): this;
    set pivotOffsetX(value: number);
    get pivotOffsetX(): number;
    set pivotOffsetY(value: number);
    get pivotOffsetY(): number;
    private updateCenterParams;
    touchSprite(sprite: Sprite, checkChildren?: boolean): boolean;
    touchSprites(sprites: Sprite[], checkChildren?: boolean): boolean;
    touchMouse(checkChildren?: boolean): boolean;
    touchPoint(point: PointCollider, checkChildren?: boolean): boolean;
    touchEdge(checkChildren?: boolean): boolean;
    touchTopEdge(checkChildren?: boolean): boolean;
    touchBottomEdge(checkChildren?: boolean): boolean;
    touchLeftEdge(checkChildren?: boolean): boolean;
    touchRightEdge(checkChildren?: boolean): boolean;
    touchTag(tagName: string, checkChildren?: boolean): boolean;
    touchTagAll(tagName: string, checkChildren?: boolean): Sprite[] | false;
    touchAnySprite(checkChildren?: boolean): boolean;
    get overlap(): number;
    get overlapX(): number;
    get overlapY(): number;
    get otherSprite(): Sprite | null;
    get otherMainSprite(): Sprite | null;
    private clearCollisionResult;
    private getPureCollisionResult;
    timeout(callback: ScheduledCallbackFunction, timeout: number): void;
    repeat(callback: ScheduledCallbackFunction, repeat: number, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState;
    forever(callback: ScheduledCallbackFunction, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState;
    update(diffTime: number): void;
    run(): void;
    stop(): void;
    ready(): void;
    get original(): Sprite | null;
    setOriginal(original: Sprite | null): void;
    createClone(stage?: Stage): Sprite;
    delete(): void;
    deleteClones(): void;
    private tryDoOnReady;
}
declare class MultiplayerGame extends Game {
    connection: any;
    private autoSyncGameTimeout;
    private onConnectionCallback;
    private onReceiveCallback;
    private onMemberJoinedCallback;
    private onMemberLeftCallback;
    private onGameStartedCallback;
    private onGameStoppedCallback;
    private onMultiplayerErrorCallback;
    private players;
    private sharedObjects;
    private isHost;
    constructor(socketUrl: string, gameToken: string, width: number, height: number, canvasId?: string, displayErrors?: boolean, locale?: Locale, lobbyId?: string | number, autoSyncGame?: number, multiplayerOptions?: any);
    send(userData: any, parameters: any, syncPackName: string, syncData?: SyncObjectInterface[]): void;
    sync(syncPackName: string, syncData?: SyncObjectInterface[], parameters?: any): void;
    syncGame(): void;
    onConnection(callback: any): void;
    removeConnectionHandler(callback: any): void;
    onReceive(callback: any): void;
    removeReceiveHandler(callback: any): void;
    onMemberJoined(callback: any): void;
    removeMemberJoinedHandler(callback: any): void;
    onMemberLeft(callback: any): void;
    removeMemberLeftHandler(callback: any): void;
    onGameStarted(callback: any): void;
    removeGameStartedHandler(callback: any): void;
    onGameStopped(callback: any): void;
    removeGameStoppedHandler(callback: any): void;
    onMultiplayerError(callback: any): void;
    removeMultiplayerErrorHandler(callback: any): void;
    run(): void;
    stop(): void;
    getPlayers(): Player[];
    addSharedObject(sharedObject: SharedData): void;
    removeSharedObject(sharedObject: SharedData): void;
    getSharedObjects(): SharedData[];
    getMultiplayerSprites(): MultiplayerSprite[];
    getSyncObjects(): SyncObjectInterface[];
    syncObjects(syncData: any, deltaTime: number): void;
    packSyncData(packName: string, syncObjects: SyncObjectInterface[]): any;
    private sendData;
    calcDeltaTime(sendTime: number): number;
    extrapolate(callback: CallableFunction, deltaTime: number, timeout: number): void;
    private initializeConnection;
    private autoSyncGame;
}
declare class MultiplayerSprite extends Sprite implements SyncObjectInterface {
    private multiplayerName;
    private syncId;
    private reservedProps;
    private syncCallback;
    constructor(multiplayerName: string, stage?: Stage, layer?: number, costumePaths?: any[], soundPaths?: any[]);
    generateUniqueId(): string;
    getCustomerProperties(): {};
    getMultiplayerName(): string;
    getSyncId(): number;
    increaseSyncId(): number;
    getSyncData(): {
        size: number;
        rotateStyle: string;
        costumeIndex: number;
        deleted: boolean;
        x: number;
        y: number;
        direction: number;
        hidden: boolean;
        stopped: boolean;
    };
    setSyncData(packName: string, data: any, deltaTime: number): void;
    onSync(callback: CallableFunction): void;
    removeSyncHandler(): void;
    only(...properties: any[]): OrphanSharedData;
}
declare class OrphanSharedData implements SyncObjectInterface {
    private parent;
    private properties;
    constructor(parent: SyncObjectInterface, properties: string[]);
    getMultiplayerName(): string;
    getSyncId(): number;
    increaseSyncId(): number;
    getSyncData(): {};
    setSyncData(packName: string, data: any, deltaTime: number): void;
    onSync(callback: CallableFunction): void;
    removeSyncHandler(): void;
    only(...properties: any[]): OrphanSharedData;
}
declare class Player implements SyncObjectInterface {
    control: MultiplayerControl;
    id: string;
    private _isMe;
    private game;
    private deleted;
    private reservedProps;
    private multiplayerName;
    private syncId;
    private syncCallback;
    constructor(id: string, isMe: boolean, game: MultiplayerGame);
    keyDown(char: string, callback: CallableFunction, syncPackName: string, syncData?: SyncObjectInterface[]): void;
    removeKeyDownHandler(char: any): void;
    mouseDown(callback: CallableFunction, syncPackName: string, syncData?: SyncObjectInterface[]): void;
    removeMouseDownHandler(): void;
    isMe(): boolean;
    delete(): void;
    repeat(i: number, callback: CallableFunction, timeout: any, finishCallback: CallableFunction): void;
    forever(callback: any, timeout?: any): void;
    timeout(callback: any, timeout: number): void;
    getMultiplayerName(): string;
    getSyncId(): number;
    increaseSyncId(): number;
    getSyncData(): {};
    setSyncData(packName: string, data: any, deltaTime: number): void;
    onSync(callback: CallableFunction): void;
    removeSyncHandler(): void;
    only(...properties: any[]): OrphanSharedData;
}
declare class ScheduledCallbackExecutor {
    private context;
    constructor(context: Stage | Sprite);
    execute(now: number, diffTime: number): (item: ScheduledCallbackItem) => boolean;
}
declare class ScheduledCallbackItem {
    callback: ScheduledCallbackFunction;
    state: ScheduledState;
    timeout?: number;
    finishCallback?: ScheduledCallbackFunction;
    control: any;
    constructor(callback: ScheduledCallbackFunction, state: ScheduledState, timeout?: number, finishCallback?: ScheduledCallbackFunction);
}
declare class ScheduledState {
    interval: number;
    maxIterations?: number;
    currentIteration?: number;
    constructor(interval: number, maxIterations?: number, currentIteration?: number);
}
declare class SharedData implements SyncObjectInterface {
    private multiplayerName;
    private syncId;
    private syncCallback;
    constructor(multiplayerName: string);
    generateUniqueId(): string;
    getMultiplayerName(): string;
    getSyncId(): number;
    increaseSyncId(): number;
    getSyncData(): {};
    setSyncData(packName: string, data: any, deltaTime: number): void;
    onSync(callback: CallableFunction): void;
    removeSyncHandler(): void;
    only(...properties: any[]): OrphanSharedData;
}
declare class Stage {
    id: Symbol;
    eventEmitter: EventEmitter;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    collisionSystem: CollisionSystem;
    private game;
    private scheduledCallbackExecutor;
    private background;
    private backgroundIndex;
    private backgrounds;
    private sprites;
    private drawings;
    private sounds;
    private soundNames;
    private addedSprites;
    private loadedSprites;
    private pendingBackgrounds;
    private pendingSounds;
    private pendingRun;
    private onReadyPending;
    private onReadyCallbacks;
    private onStartCallbacks;
    private scheduledCallbacks;
    private tempScheduledCallbacks;
    private _stopped;
    private _running;
    private stoppedTime;
    private diffTime;
    constructor(background?: string);
    onStart(onStartCallback: CallableFunction): void;
    onReady(callback: CallableFunction): void;
    get running(): boolean;
    get stopped(): boolean;
    isReady(): boolean;
    get width(): number;
    get height(): number;
    set backgroundColor(color: string);
    drawBackground(callback: DrawingCallbackFunction): this;
    addBackground(backgroundPath: string): this;
    switchBackground(backgroundIndex: number): void;
    nextBackground(): void;
    addSound(soundPath: string, name?: string): this;
    removeSound(soundIndex?: number): this;
    removeSoundByName(soundName: string): this;
    playSound(soundIndex?: number, volume?: number, currentTime?: number): void;
    pauseSound(soundIndex?: number): void;
    playSoundByName(soundName: string, volume?: number, currentTime?: number): void;
    pauseSoundByName(soundName: string): void;
    addSprite(sprite: Sprite): this;
    removeSprite(sprite: Sprite, layer: number): this;
    getSprites(): Sprite[];
    changeSpriteLayer(sprite: Sprite, fromLayer: number, toLayer: number): void;
    drawSprite(sprite: Sprite): void;
    stampImage(stampImage: HTMLCanvasElement | HTMLImageElement, x: number, y: number, direction?: number): void;
    pen(callback: DrawingCallbackFunction, layer?: number): void;
    timeout(callback: ScheduledCallbackFunction, timeout: number): void;
    repeat(callback: ScheduledCallbackFunction, repeat: number, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState;
    forever(callback: ScheduledCallbackFunction, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState;
    render(): void;
    private update;
    run(): void;
    ready(): void;
    stop(): void;
    private tryDoOnReady;
    private doOnStart;
    private tryDoRun;
    private addListeners;
}
interface SyncObjectInterface {
    getSyncId(): number;
    increaseSyncId(): number;
    getMultiplayerName(): string;
    getSyncData(): any;
    setSyncData(packName: string, data: any, deltaTime: number): void;
    onSync(callback: CallableFunction): void;
    removeSyncHandler(): void;
    only(...properties: any[]): OrphanSharedData;
}
declare class BVH {
    static readonly MAX_DEPTH = 10000;
    protected _hierarchy: any;
    protected _bodies: any[];
    protected _dirty_branches: any[];
    insert(body: any, updating?: boolean): void;
    remove(body: any, updating?: boolean): void;
    update(): void;
    potentials(body: any): any[];
    draw(context: any): void;
    drawBVH(context: any): void;
}
declare const branch_pool: any[];
declare class BVHBranch {
    protected _bvh_parent: any;
    protected _bvh_branch: boolean;
    protected _bvh_left: any;
    protected _bvh_right: any;
    protected _bvh_sort: number;
    protected _bvh_min_x: number;
    protected _bvh_min_y: number;
    protected _bvh_max_x: number;
    protected _bvh_max_y: number;
    static getBranch(): any;
    static releaseBranch(branch: any): void;
    static sortBranches(a: any, b: any): 1 | -1;
}
declare class Collider {
    x: number;
    y: number;
    width: number;
    height: number;
    padding: number;
    protected _offset_x: number;
    protected _offset_y: number;
    protected _circle: boolean;
    protected _polygon: boolean;
    protected _point: boolean;
    protected _bvh: any;
    protected _bvh_parent: any;
    protected _bvh_branch: boolean;
    protected _bvh_padding: number;
    protected _bvh_min_x: number;
    protected _bvh_min_y: number;
    protected _bvh_max_x: number;
    protected _bvh_max_y: number;
    protected _parent_sprite: any;
    protected _center_distance: number;
    protected _center_angle: number;
    constructor(x?: number, y?: number, padding?: number);
    collides(target: any, result?: any, aabb?: boolean): boolean;
    potentials(): any;
    remove(): void;
    set parentSprite(value: any);
    get parentSprite(): any;
    set offset_x(value: number);
    get offset_x(): number;
    set offset_y(value: number);
    get offset_y(): number;
    get center_offset_x(): number;
    get center_offset_y(): number;
    createResult(): CollisionResult;
    updateCenterParams(): void;
    static createResult(): CollisionResult;
}
declare class CircleCollider extends Collider {
    radius: number;
    scale: number;
    constructor(x?: number, y?: number, radius?: number, scale?: number, padding?: number);
    draw(context: any): void;
}
declare class CollisionResult {
    collision: boolean;
    a: CircleCollider | PolygonCollider | PointCollider;
    b: CircleCollider | PolygonCollider | PointCollider;
    a_in_b: boolean;
    b_in_a: boolean;
    overlap: number;
    overlap_x: number;
    overlap_y: number;
}
declare class CollisionSystem {
    protected _bvh: BVH;
    constructor();
    createCircle(x?: number, y?: number, radius?: number, scale?: number, padding?: number): CircleCollider;
    createPolygon(x?: number, y?: number, points?: number[][], angle?: number, scale_x?: number, scale_y?: number, padding?: number): PolygonCollider;
    createPoint(x?: number, y?: number, padding?: number): PointCollider;
    createResult(): CollisionResult;
    static createResult(): CollisionResult;
    insert(...bodies: any[]): this;
    remove(...bodies: any[]): this;
    update(): this;
    draw(context: any): void;
    drawBVH(context: any): void;
    potentials(body: any): any[];
    collides(source: any, target: any, result?: any, aabb?: boolean): boolean;
}
declare class PolygonCollider extends Collider {
    angle: number;
    scale_x: number;
    scale_y: number;
    protected _x: number;
    protected _y: number;
    protected _angle: number;
    protected _scale_x: number;
    protected _scale_y: number;
    protected _min_x: number;
    protected _min_y: number;
    protected _max_x: number;
    protected _max_y: number;
    protected _points: any;
    protected _coords: any;
    protected _edges: any;
    protected _normals: any;
    protected _dirty_coords: boolean;
    protected _dirty_normals: boolean;
    protected _origin_points: any;
    constructor(x?: number, y?: number, points?: any[], angle?: number, scale_x?: number, scale_y?: number, padding?: number);
    draw(context: any): void;
    setPoints(new_points: any): void;
    _calculateCoords(): void;
    _calculateNormals(): void;
    get points(): any;
}
declare class PointCollider extends PolygonCollider {
    constructor(x?: number, y?: number, padding?: number);
}
declare function SAT(a: any, b: any, result?: any, aabb?: boolean): boolean;
declare function aabbAABB(a: any, b: any): boolean;
declare function polygonPolygon(a: any, b: any, result?: any): boolean;
declare function polygonCircle(a: any, b: any, result?: any, reverse?: boolean): boolean;
declare function circleCircle(a: any, b: any, result?: any): boolean;
declare function separatingAxis(a_coords: any, b_coords: any, x: any, y: any, result?: any): boolean;
declare class JetcodeSocket {
    static JOIN_LOBBY: string;
    static LEAVE_LOBBY: string;
    static SEND_DATA: string;
    static JOINED: string;
    static RECEIVE_DATA: string;
    static MEMBER_JOINED: string;
    static MEMBER_LEFT: string;
    static GAME_STARTED: string;
    static GAME_STOPPED: string;
    static ERROR: string;
    private socketUrl;
    private socket;
    private defaultParameters;
    constructor(socketUrl?: string);
    connect(gameToken: any, lobbyId?: any, inParameters?: {}): Promise<unknown>;
}
declare class JetcodeSocketConnection {
    socket: WebSocket;
    lobbyId: string | number;
    memberId: string;
    deltaTime: number;
    private connects;
    private connectActions;
    constructor(socket: WebSocket, gameToken: any, lobbyId?: number);
    _listenSocket(): void;
    emit(action: string, args: any[]): void;
    connect(action: any, callback: any): CallableFunction;
    disconnect(action: string, callback: Function): void;
    sendData(value: any, parameters?: {}): void;
    joinLobby(gameToken: any, lobbyId: any, parameters?: {}): Promise<unknown>;
    leaveLobby(): void;
    _parse(data: any): any[];
}
interface JetcodeSocketParameters {
    LobbyAutoCreate: boolean;
    MinMembers: number;
    MaxMembers: number;
    StartGameWithMembers: number;
}
declare class ErrorMessages {
    static readonly SCRIPT_ERROR = "script_error";
    static readonly MISTAKE_METHOD = "mistake_method";
    static readonly MISTAKE_METHOD_WITH_CLOSEST = "mistake_method_with_closest";
    static readonly NEED_STAGE_BEFORE_RUN_GAME = "need_stage_before_run_game";
    static readonly NEED_CREATE_STAGE_BEFORE_SPRITE = "need_create_stage_before_sprite";
    static readonly COSTUME_NOT_LOADED = "costume_not_loaded";
    static readonly BACKGROUND_NOT_LOADED = "background_not_loaded";
    static readonly CLONED_NOT_READY = "cloned_not_ready";
    static readonly SOUND_INDEX_NOT_FOUND = "sound_index_not_found";
    static readonly SOUND_NAME_NOT_FOUND = "sound_name_not_found";
    static readonly SOUND_USE_NOT_READY = "sound_use_not_ready";
    static readonly COSTUME_INDEX_NOT_FOUND = "costume_index_not_found";
    static readonly COSTUME_NAME_NOT_FOUND = "costume_name_not_found";
    static readonly COSTUME_SWITCH_NOT_READY = "costume_switch_not_ready";
    static readonly STAMP_NOT_READY = "stamp_not_ready";
    static readonly STAMP_COSTUME_NOT_FOUND = "stamp_costume_not_found";
    static readonly COLLIDER_NAME_NOT_FOUND = "collider_name_not_found";
    static readonly messages: {
        script_error: {
            ru: string;
            en: string;
        };
        mistake_method: {
            ru: string;
            en: string;
        };
        mistake_method_with_closest: {
            ru: string;
            en: string;
        };
        need_stage_before_run_game: {
            ru: string;
            en: string;
        };
        need_create_stage_before_sprite: {
            ru: string;
            en: string;
        };
        costume_not_loaded: {
            ru: string;
            en: string;
        };
        background_not_loaded: {
            ru: string;
            en: string;
        };
        cloned_not_ready: {
            ru: string;
            en: string;
        };
        sound_index_not_found: {
            ru: string;
            en: string;
        };
        sound_name_not_found: {
            ru: string;
            en: string;
        };
        sound_use_not_ready: {
            ru: string;
            en: string;
        };
        costume_index_not_found: {
            ru: string;
            en: string;
        };
        costume_name_not_found: {
            ru: string;
            en: string;
        };
        costume_switch_not_ready: {
            ru: string;
            en: string;
        };
        stamp_not_ready: {
            ru: string;
            en: string;
        };
        stamp_costume_not_found: {
            ru: string;
            en: string;
        };
        collider_name_not_found: {
            ru: string;
            en: string;
        };
    };
    static getMessage(messageId: string, locale: string, variables?: {} | null): string;
    private static replaceVariables;
}
declare class Keyboard {
    keys: {};
    constructor();
    keyPressed(char: any): boolean;
    keyDown(char: string, callback: any): void;
    keyUp(char: string, callback: any): void;
}
declare class Mouse {
    x: number;
    y: number;
    private isDown;
    private point;
    private lastStage;
    constructor(game: Game);
    getPoint(): PointCollider;
    isMouseDown(stage: Stage): boolean;
    clearMouseDown(): void;
}
declare class Registry {
    private static instance;
    private data;
    private constructor();
    static getInstance(): Registry;
    set(name: string, value: any): void;
    has(name: string): boolean;
    get(name: string): any;
}
declare class Styles {
    canvas: any;
    canvasRect: any;
    constructor(canvas: any, width: any, height: any);
    setEnvironmentStyles(): void;
    setCanvasSize(width: any, height: any): void;
}
declare class ValidatorFactory {
    private game;
    constructor(game: Game);
    createValidator<T extends object>(target: T, className: string): T;
    static findClosestMethods(input: string, methods: string[], maxDistance?: number): string[];
    static levenshteinDistance(a: string, b: string): number;
}
