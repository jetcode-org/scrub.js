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

/**
 * A Bounding Volume Hierarchy (BVH) used to find potential collisions quickly
 * @class
 * @private
 */
declare class BVH {
    static readonly MAX_DEPTH = 10000;
    protected _hierarchy: any;
    protected _bodies: any[];
    protected _dirty_branches: any[];
    /**
     * Inserts a body into the BVH
     * @param {CircleCollider|PolygonCollider|PointCollider} body The body to insert
     * @param {Boolean} [updating = false] Set to true if the body already exists in the BVH (used internally when updating the body's position)
     */
    insert(body: any, updating?: boolean): void;
    /**
     * Removes a body from the BVH
     * @param {CircleCollider|PolygonCollider|PointCollider} body The body to remove
     * @param {Boolean} [updating = false] Set to true if this is a temporary removal (used internally when updating the body's position)
     */
    remove(body: any, updating?: boolean): void;
    /**
     * Updates the BVH. Moved bodies are removed/inserted.
     */
    update(): void;
    /**
     * Returns a list of potential collisions for a body
     * @param {CircleCollider|PolygonCollider|PointCollider} body The body to test
     * @returns {Array<Collider>}
     */
    potentials(body: any): any[];
    /**
     * Draws the bodies within the BVH to a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The context to draw to
     */
    draw(context: any): void;
    /**
     * Draws the BVH to a CanvasRenderingContext2D's current path. This is useful for testing out different padding values for bodies.
     * @param {CanvasRenderingContext2D} context The context to draw to
     */
    drawBVH(context: any): void;
}

/**
 * A branch within a BVH
 * @class
 * @private
 */
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
    /**
     * Returns a branch from the branch pool or creates a new branch
     * @returns {BVHBranch}
     */
    static getBranch(): any;
    /**
     * Releases a branch back into the branch pool
     * @param {BVHBranch} branch The branch to release
     */
    static releaseBranch(branch: any): void;
    /**
     * Sorting callback used to sort branches by deepest first
     * @param {BVHBranch} a The first branch
     * @param {BVHBranch} b The second branch
     * @returns {Number}
     */
    static sortBranches(a: any, b: any): 1 | -1;
}

/**
 * A polygon used to detect collisions
 * @class
 */
declare class PolygonCollider extends Collider {
    /**
     * The angle of the body in radians
     */
    angle: number;
    /**
     * The scale of the body along the X axis
     */
    scale_x: number;
    /**
     * The scale of the body along the Y axis
     */
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
    /**
     * @constructor
     * @param {Number} [x = 0] The starting X coordinate
     * @param {Number} [y = 0] The starting Y coordinate
     * @param {Array<Number[]>} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     * @param {Number} [angle = 0] The starting rotation in radians
     * @param {Number} [scale_x = 1] The starting scale along the X axis
     * @param {Number} [scale_y = 1] The starting scale long the Y axis
     * @param {Number} [padding = 5] The amount to pad the bounding volume when testing for potential collisions
     */
    constructor(x?: number, y?: number, points?: any[], angle?: number, scale_x?: number, scale_y?: number, padding?: number);
    /**
     * Draws the polygon to a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The context to add the shape to
     */
    draw(context: any): void;
    /**
     * Sets the points making up the polygon. It's important to use this function when changing the polygon's shape to ensure internal data is also updated.
     * @param {Array<Number[]>} new_points An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     */
    setPoints(new_points: any): void;
    /**
     * Calculates and caches the polygon's world coordinates based on its points, angle, and scale
     */
    _calculateCoords(): void;
    /**
     * Calculates the normals and edges of the polygon's sides
     */
    _calculateNormals(): void;
    get points(): any;
}

/**
 * A point used to detect collisions
 * @class
 */
declare class PointCollider extends PolygonCollider {
    /**
     * @constructor
     * @param {Number} [x = 0] The starting X coordinate
     * @param {Number} [y = 0] The starting Y coordinate
     * @param {Number} [padding = 5] The amount to pad the bounding volume when testing for potential collisions
     */
    constructor(x?: number, y?: number, padding?: number);
}

/**
 * An object used to collect the detailed results of a collision test
 *
 * > **Note:** It is highly recommended you recycle the same Result object if possible in order to avoid wasting memory
 * @class
 */
declare class CollisionResult {
    /**
     * True if a collision was detected
     */
    collision: boolean;
    /**
     * The source body tested
     */
    a: CircleCollider | PolygonCollider | PointCollider;
    /**
     * The target body tested against
     */
    b: CircleCollider | PolygonCollider | PointCollider;
    /**
     * True if A is completely contained within B
     */
    a_in_b: boolean;
    /**
     * True if B is completely contained within A
     */
    b_in_a: boolean;
    /**
     * The magnitude of the shortest axis of overlap
     */
    overlap: number;
    /**
     * The X direction of the shortest axis of overlap
     */
    overlap_x: number;
    /**
     * The Y direction of the shortest axis of overlap
     */
    overlap_y: number;
}

/**
 * The base class for bodies used to detect collisions
 * @class
 * @protected
 */
declare class Collider {
    /**
     * The X coordinate of the body
     */
    x: number;
    /**
     * The Y coordinate of the body
     */
    y: number;
    /**
     * The width of the body
     */
    width: number;
    /**
     * The width of the body
     */
    height: number;
    /**
     * The amount to pad the bounding volume when testing for potential collisions
     */
    padding: number;
    /**
     * The offset of the body along X axis
     */
    protected _offset_x: number;
    /**
     * The offset of the body along Y axis
     */
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
    /**
     * @constructor
     * @param {Number} [x = 0] The starting X coordinate
     * @param {Number} [y = 0] The starting Y coordinate
     * @param {Number} [padding = 5] The amount to pad the bounding volume when testing for potential collisions
     */
    constructor(x?: number, y?: number, padding?: number);
    /**
     * Determines if the body is colliding with another body
     * @param {CircleCollider|PolygonCollider|PointCollider} target The target body to test against
     * @param {CollisionResult} [result = null] A Result object on which to store information about the collision
     * @param {Boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own potential collision heuristic)
     * @returns {Boolean}
     */
    collides(target: any, result?: any, aabb?: boolean): boolean;
    /**
     * Returns a list of potential collisions
     * @returns {Array<Collider>}
     */
    potentials(): any;
    /**
     * Removes the body from its current collision system
     */
    remove(): void;
    set parentSprite(value: any);
    get parentSprite(): any;
    set offset_x(value: number);
    get offset_x(): number;
    set offset_y(value: number);
    get offset_y(): number;
    get center_offset_x(): number;
    get center_offset_y(): number;
    /**
     * Creates a {@link CollisionResult} used to collect the detailed results of a collision test
     */
    createResult(): CollisionResult;
    updateCenterParams(): void;
    /**
     * Creates a Result used to collect the detailed results of a collision test
     */
    static createResult(): CollisionResult;
}

/**
 * A circle used to detect collisions
 * @class
 */
declare class CircleCollider extends Collider {
    radius: number;
    scale: number;
    /**
     * @constructor
     * @param {Number} [x = 0] The starting X coordinate
     * @param {Number} [y = 0] The starting Y coordinate
     * @param {Number} [radius = 0] The radius
     * @param {Number} [scale = 1] The scale
     * @param {Number} [padding = 5] The amount to pad the bounding volume when testing for potential collisions
     */
    constructor(x?: number, y?: number, radius?: number, scale?: number, padding?: number);
    /**
     * Draws the circle to a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The context to add the arc to
     */
    draw(context: any): void;
}

/**
 * A collision system used to track bodies in order to improve collision detection performance
 * @class
 */
declare class CollisionSystem {
    protected _bvh: BVH;
    /**
     * @constructor
     */
    constructor();
    /**
     * Creates a {@link CircleCollider} and inserts it into the collision system
     * @param {Number} [x = 0] The starting X coordinate
     * @param {Number} [y = 0] The starting Y coordinate
     * @param {Number} [radius = 0] The radius
     * @param {Number} [scale = 1] The scale
     * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     * @returns {CircleCollider}
     */
    createCircle(x?: number, y?: number, radius?: number, scale?: number, padding?: number): CircleCollider;
    /**
     * Creates a {@link PolygonCollider} and inserts it into the collision system
     * @param {Number} [x = 0] The starting X coordinate
     * @param {Number} [y = 0] The starting Y coordinate
     * @param {Array<Number[]>} [points = []] An array of coordinate pairs making up the polygon - [[x1, y1], [x2, y2], ...]
     * @param {Number} [angle = 0] The starting rotation in radians
     * @param {Number} [scale_x = 1] The starting scale along the X axis
     * @param {Number} [scale_y = 1] The starting scale long the Y axis
     * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     * @returns {PolygonCollider}
     */
    createPolygon(x?: number, y?: number, points?: number[][], angle?: number, scale_x?: number, scale_y?: number, padding?: number): PolygonCollider;
    /**
     * Creates a {@link PointCollider} and inserts it into the collision system
     * @param {Number} [x = 0] The starting X coordinate
     * @param {Number} [y = 0] The starting Y coordinate
     * @param {Number} [padding = 0] The amount to pad the bounding volume when testing for potential collisions
     * @returns {PointCollider}
     */
    createPoint(x?: number, y?: number, padding?: number): PointCollider;
    /**
     * Creates a {@link CollisionResult} used to collect the detailed results of a collision test
     */
    createResult(): CollisionResult;
    /**
     * Creates a Result used to collect the detailed results of a collision test
     */
    static createResult(): CollisionResult;
    /**
     * Inserts bodies into the collision system
     * @param {...Circle|...Polygon|...Point} bodies
     */
    insert(...bodies: any[]): this;
    /**
     * Removes bodies from the collision system
     * @param {...Circle|...Polygon|...Point} bodies
     */
    remove(...bodies: any[]): this;
    /**
     * Updates the collision system. This should be called before any collisions are tested.
     */
    update(): this;
    /**
     * Draws the bodies within the system to a CanvasRenderingContext2D's current path
     * @param {CanvasRenderingContext2D} context The context to draw to
     */
    draw(context: any): void;
    /**
     * Draws the system's BVH to a CanvasRenderingContext2D's current path. This is useful for testing out different padding values for bodies.
     * @param {CanvasRenderingContext2D} context The context to draw to
     */
    drawBVH(context: any): void;
    /**
     * Returns a list of potential collisions for a body
     * @param {CircleCollider|PolygonCollider|PointCollider} body The body to test for potential collisions against
     * @returns {Array<Collider>}
     */
    potentials(body: any): any[];
    /**
     * Determines if two bodies are colliding
     * @param source
     * @param {CircleCollider|PolygonCollider|PointCollider} target The target body to test against
     * @param {CollisionResult} [result = null] A Result object on which to store information about the collision
     * @param {Boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own potential collision heuristic)
     * @returns {Boolean}
     */
    collides(source: any, target: any, result?: any, aabb?: boolean): boolean;
}

/**
 * Determines if two bodies are colliding using the Separating Axis Theorem
 * @private
 * @param {CircleCollider|PolygonCollider|PointCollider} a The source body to test
 * @param {CircleCollider|PolygonCollider|PointCollider} b The target body to test against
 * @param {CollisionResult} [result = null] A Result object on which to store information about the collision
 * @param {Boolean} [aabb = true] Set to false to skip the AABB test (useful if you use your own collision heuristic)
 * @returns {Boolean}
 */
declare function SAT(a: any, b: any, result?: any, aabb?: boolean): boolean;
/**
 * Determines if two bodies' axis aligned bounding boxes are colliding
 * @param {CircleCollider|PolygonCollider|PointCollider} a The source body to test
 * @param {CircleCollider|PolygonCollider|PointCollider} b The target body to test against
 */
declare function aabbAABB(a: any, b: any): boolean;
/**
 * Determines if two polygons are colliding
 * @param {PolygonCollider} a The source polygon to test
 * @param {PolygonCollider} b The target polygon to test against
 * @param {CollisionResult} [result = null] A Result object on which to store information about the collision
 * @returns {Boolean}
 */
declare function polygonPolygon(a: any, b: any, result?: any): boolean;
/**
 * Determines if a polygon and a circle are colliding
 * @param {PolygonCollider} a The source polygon to test
 * @param {CircleCollider} b The target circle to test against
 * @param {CollisionResult} [result = null] A Result object on which to store information about the collision
 * @param {Boolean} [reverse = false] Set to true to reverse a and b in the result parameter when testing circle->polygon instead of polygon->circle
 * @returns {Boolean}
 */
declare function polygonCircle(a: any, b: any, result?: any, reverse?: boolean): boolean;
/**
 * Determines if two circles are colliding
 * @param {CircleCollider} a The source circle to test
 * @param {CircleCollider} b The target circle to test against
 * @param {CollisionResult} [result = null] A Result object on which to store information about the collision
 * @returns {Boolean}
 */
declare function circleCircle(a: any, b: any, result?: any): boolean;
/**
 * Determines if two polygons are separated by an axis
 * @param {Array<Number[]>} a_coords The coordinates of the polygon to test
 * @param {Array<Number[]>} b_coords The coordinates of the polygon to test against
 * @param {Number} x The X direction of the axis
 * @param {Number} y The Y direction of the axis
 * @param {CollisionResult} [result = null] A Result object on which to store information about the collision
 * @returns {Boolean}
 */
declare function separatingAxis(a_coords: any, b_coords: any, x: any, y: any, result?: any): boolean;

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
    static readonly SOUND_NAME_ALREADY_EXISTS = "sound_name_already_exists";
    static readonly SOUND_NOT_ALLOWED_ERROR = "sound_not_allowed_error";
    static readonly SOUND_USE_NOT_READY = "sound_use_not_ready";
    static readonly COSTUME_INDEX_NOT_FOUND = "costume_index_not_found";
    static readonly COSTUME_NAME_NOT_FOUND = "costume_name_not_found";
    static readonly COSTUME_SWITCH_NOT_READY = "costume_switch_not_ready";
    static readonly STAMP_NOT_READY = "stamp_not_ready";
    static readonly STAMP_COSTUME_NOT_FOUND = "stamp_costume_not_found";
    static readonly COLLIDER_NAME_NOT_FOUND = "collider_name_not_found";
    static readonly STAGE_SET_BEFORE_GAME_READY = "stage_set_before_game_ready";
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
        sound_name_already_exists: {
            ru: string;
            en: string;
        };
        sound_use_not_ready: {
            ru: string;
            en: string;
        };
        sound_not_allowed_error: {
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
        stage_set_before_game_ready: {
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

declare class KeyboardMap {
    private static map;
    static getChar(keyCode: number): string;
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

declare class Costume {
    image: HTMLCanvasElement;
    ready: boolean;
    get width(): number;
    get height(): number;
}

declare class ScheduledState {
    interval: number;
    maxIterations?: number;
    currentIteration?: number;
    constructor(interval: number, maxIterations?: number, currentIteration?: number);
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
    private stoppedTime;
    private diffTime;
    constructor(stage?: Stage, layer?: number, costumePaths?: any[]);
    init(): void;
    /**
     * Events
     */
    onReady(callback: CallableFunction): void;
    /**
     * States
     */
    isReady(): boolean;
    get deleted(): boolean;
    get stopped(): boolean;
    /**
     * Parent and children
     */
    setParent(parent: Sprite): this;
    addChild(child: Sprite): this;
    removeChild(child: Sprite): this;
    getChildren(): Sprite[];
    set parent(newParent: Sprite | null);
    get parent(): Sprite | null;
    getMainSprite(): Sprite;
    /**
     * Colliders
     */
    switchCollider(colliderName: string): this;
    get launched(): boolean;
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
    /**
     * Tags
     */
    addTag(tagName: string): this;
    removeTag(tagName: string): this;
    hasTag(tagName: string): boolean;
    get tags(): string[];
    /**
     * Costumes
     */
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
    /**
     * Sounds
     */
    addSound(soundPath: string, soundName: string): this;
    removeSound(soundName: string): this;
    playSound(soundName: string, options?: SoundOptions): void;
    startSound(soundName: string, options?: SoundOptions): HTMLAudioElement;
    pauseSound(soundName: string): void;
    getSound(soundName: string): HTMLAudioElement;
    cloneSound(soundName: string): HTMLAudioElement;
    private doPlaySound;
    /**
     * Visual functionality
     */
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
    set globalLayer(newLayer: number);
    get globalLayer(): number;
    set hidden(value: boolean);
    get hidden(): boolean;
    say(text: string, time?: number): void;
    getPhrase(): string | null;
    /**
     * Movements functionality.
     */
    move(steps: number): void;
    pointForward(object: TransformableObject): void;
    getDistanceTo(object: TransformableObject): number;
    bounceOnEdge(): void;
    /**
     * Coordinates, dimensions, rotations, pivots, etc.
     */
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
    /**
     * Touches
     */
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
    /**
     * Schedulers
     */
    timeout(callback: ScheduledCallbackFunction, timeout: number): void;
    repeat(callback: ScheduledCallbackFunction, repeat: number, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState;
    forever(callback: ScheduledCallbackFunction, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState;
    update(): void;
    /**
     * Start and stop, create and delete
     */
    run(): void;
    stop(): void;
    ready(): void;
    get original(): Sprite | null;
    get activeStage(): Stage;
    setOriginal(original: Sprite | null): void;
    createClone(stage?: Stage): Sprite;
    delete(): void;
    deleteClones(): void;
    setStage(newStage: Stage): void;
    private tryDoOnReady;
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
type SoundOptions = {
    volume?: number;
    currentTime?: number;
    loop?: boolean;
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
    private onUserInteractedCallbacks;
    private onReadyPending;
    protected running: boolean;
    private pendingRun;
    private reportedError;
    private _displayErrors;
    private _locale;
    private _userInteracted;
    private userInteractionPromise;
    constructor(width?: number, height?: number, canvasId?: string, displayErrors?: boolean, locale?: Locale);
    addStage(stage: Stage): this;
    getLastStage(): Stage | null;
    getActiveStage(): Stage | null;
    run(stage?: Stage): void;
    isReady(): boolean;
    onReady(callback: CallableFunction): void;
    onUserInteracted(callback: CallableFunction): void;
    stop(): void;
    get displayErrors(): boolean;
    get locale(): string;
    get width(): number;
    get height(): number;
    get userInteracted(): boolean;
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
    throwError(messageId: string, variables?: {} | null, reportError?: boolean): void;
    throwErrorRaw(message: string, reportError?: boolean): void;
    private reportError;
    private addListeners;
    private tryDoOnReady;
    private tryDoRun;
}

declare class CameraChanges {
    x: number;
    y: number;
    zoom: number;
    direction: number;
    reset(): void;
}

declare class Camera {
    stage: Stage;
    changes: CameraChanges;
    private _x;
    private _y;
    private _direction;
    private _renderRadius;
    private _zoom;
    constructor(stage: Stage);
    set direction(value: number);
    get direction(): number;
    get angleDirection(): number;
    get width(): number;
    get height(): number;
    set x(value: number);
    get x(): number;
    set y(value: number);
    get y(): number;
    get startCornerX(): number;
    get startCornerY(): number;
    get renderRadius(): number;
    set zoom(value: number);
    get zoom(): number;
    stop(): void;
    run(): void;
    update(): void;
    private updateRenderRadius;
}

declare class Stage {
    id: Symbol;
    eventEmitter: EventEmitter;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    collisionSystem: CollisionSystem;
    camera: Camera;
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
    init(): void;
    /**
     * Events
     */
    onStart(onStartCallback: CallableFunction): void;
    onReady(callback: CallableFunction): void;
    /**
     * States
     */
    get running(): boolean;
    get stopped(): boolean;
    isReady(): boolean;
    /**
     * Dimensions
     */
    get width(): number;
    get height(): number;
    /**
     * Backgrounds
     */
    set backgroundColor(color: string);
    get currentStoppedTime(): any;
    drawBackground(callback: DrawingCallbackFunction): this;
    addBackground(backgroundPath: string): this;
    switchBackground(backgroundIndex: number): void;
    nextBackground(): void;
    /**
     * Sounds
     */
    addSound(soundPath: string, soundName: string): this;
    removeSound(soundName: string): this;
    playSound(soundName: string, options?: SoundOptions): void;
    startSound(soundName: string, options?: SoundOptions): HTMLAudioElement;
    pauseSound(soundName: string): void;
    getSound(soundName: string): HTMLAudioElement;
    cloneSound(soundName: string): HTMLAudioElement;
    private doPlaySound;
    /**
     * Sprite management
     */
    addSprite(sprite: Sprite): this;
    removeSprite(sprite: Sprite, layer: number): this;
    getSprites(): Sprite[];
    changeSpriteLayer(sprite: Sprite, fromLayer: number, toLayer: number): void;
    /**
     * Draw
     */
    drawSprite(sprite: Sprite): void;
    stampImage(stampImage: HTMLCanvasElement | HTMLImageElement, x: number, y: number, direction?: number): void;
    pen(callback: DrawingCallbackFunction, layer?: number): void;
    /**
     * Schedulers and render
     */
    timeout(callback: ScheduledCallbackFunction, timeout: number): void;
    repeat(callback: ScheduledCallbackFunction, repeat: number, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState;
    forever(callback: ScheduledCallbackFunction, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState;
    render(): void;
    private update;
    /**
     * Run and stop
     */
    run(): void;
    ready(): void;
    stop(): void;
    private tryDoOnReady;
    private doOnStart;
    private tryDoRun;
    private addListeners;
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

declare class ScheduledCallbackItem {
    callback: ScheduledCallbackFunction;
    state: ScheduledState;
    timeout?: number;
    finishCallback?: ScheduledCallbackFunction;
    control: any;
    constructor(callback: ScheduledCallbackFunction, state: ScheduledState, timeout?: number, finishCallback?: ScheduledCallbackFunction);
}

declare class ScheduledCallbackExecutor {
    private context;
    constructor(context: Stage | Sprite);
    execute(now: number, diffTime: number): (item: ScheduledCallbackItem) => boolean;
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

declare class MultiplayerSprite extends Sprite implements SyncObjectInterface {
    private multiplayerName;
    private syncId;
    private reservedProps;
    private syncCallback;
    constructor(multiplayerName: string, stage?: Stage, layer?: number, costumePaths?: any[]);
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

export { BVH, BVHBranch, Camera, CameraChanges, CircleCollider, Collider, CollisionResult, CollisionSystem, Costume, type CostumeOptions, type DrawingCallbackFunction, ErrorMessages, EventEmitter, Game, type GridCostumeOptions, JetcodeSocket, JetcodeSocketConnection, type JetcodeSocketParameters, Keyboard, KeyboardMap, type Locale, Mouse, MultiplayerControl, MultiplayerGame, MultiplayerSprite, OrphanSharedData, Player, PointCollider, PolygonCollider, Registry, SAT, ScheduledCallbackExecutor, type ScheduledCallbackFunction, ScheduledCallbackItem, ScheduledState, SharedData, type SoundOptions, Sprite, Stage, Styles, type SyncObjectInterface, type TransformableObject, ValidatorFactory, aabbAABB, circleCircle, polygonCircle, polygonPolygon, separatingAxis };
