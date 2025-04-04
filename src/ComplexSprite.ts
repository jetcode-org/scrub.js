class ComplexSprite {

    name = 'No Name';

    private game: Game = null;
    protected stage = null;
    private _children = [];
    private _x = 0;
    private _y = 0;
    private _direction = 0;
    private _rotateStyle = 'normal';
    private _pivotOffsetX = 0;
    private _pivotOffsetY = 0;
    private _collidedSprite = null;
    private _layer: number;
    private _parentComplexSprite = null;
    private _size = 100;
    private scheduledCallbacks: Array<ScheduledCallbackItem> = [];
    private scheduledCallbackExecutor: ScheduledCallbackExecutor;
    private _centerDistance = 0;
    private _centerAngle = 0;
    protected _deleted = false;
    private _hidden = false;

    constructor(stage: Stage = null, layer = 1) {
        if (!Registry.getInstance().has('game')) {
            throw new Error('You need create Game instance before Stage instance.');
        }
        this.game = Registry.getInstance().get('game');

        let complexSprite = this;
        if (this.game.displayErrors) {
            complexSprite = this.game.validatorFactory.createValidator(this, 'ComplexSprite');
        }

        complexSprite.stage = stage;
        if (!this.stage) {
            complexSprite.stage = this.game.getLastStage();
        }

        if (!complexSprite.stage) {
            complexSprite.game.throwError(ErrorMessages.NEED_CREATE_STAGE_BEFORE_SPRITE);
        }

        complexSprite._layer = layer;

        complexSprite._x = complexSprite.game.width / 2;
        complexSprite._y = complexSprite.game.height / 2;

        // complexSprite.scheduledCallbackExecutor = new ScheduledCallbackExecutor(complexSprite);
        // this.stage.addSprite();

        return complexSprite;
    }

    set x(value){
        this._x = value;
        this.updateCenterParams()

        for (const child of this._children) {
            if (child.collider){
                child.updateColliderPosition()
            }
        }
    }

    get x() {
        return this._x;
    }

    get absoluteX() {
        if (this._parentComplexSprite) {
            if (this.rotateStyle === 'leftRight' || this.rotateStyle === 'none') {
                const leftRightMultiplier = this._direction > 180 && this.rotateStyle === 'leftRight' ? -1 : 1;

                return this._parentComplexSprite.absoluteX + this._x * leftRightMultiplier * this.size / 100;
            }
            else {
                return this._parentComplexSprite.absoluteX + this.distanceToParent * Math.cos(this.angleToParent - this._parentComplexSprite.angleRadians) * this.size / 100;
            }
        }

        return this._x;
    }

    set y(value){
        this._y = value;
        for (const child of this._children) {
            if (child.collider){
                child.updateColliderPosition()
            }
        }
        this.updateCenterParams()
    }

    get y(){
        return this._y;
    }

    get absoluteY() {
        if (this._parentComplexSprite) {
            if (this.rotateStyle === 'leftRight' || this.rotateStyle === 'none') {
                return this._parentComplexSprite.absoluteY + this._y;
            }
            else {
                return this._parentComplexSprite.absoluteY - this.distanceToParent * Math.sin(this.angleToParent - this._parentComplexSprite.angleRadians) * this.size / 100;
            }
        }

        return this._y;
    }

    get angleToParent(){
        return -Math.atan2(this.y, this.x);
    }

    get distanceToParent(){
        return Math.hypot(this.x, this.y);
    }


    set direction(value) {
        let direction = value;

        direction = direction % 360;

        if (direction < 0) {
            direction += 360;
        }

        this._direction = direction;

        for (const child of this._children) {
            child.direction = direction;
        }
    }

    get direction(){
        return this._direction;
    }

    get angleRadians() {
        return this._direction * Math.PI / 180;
    }

    set layer(newLayer) {
        this._layer = newLayer;

        for (const child of this._children) {
            child.layer = this._layer;
        }
    }

    get layer() {
        return this._layer;
    }

    set parent(value:ComplexSprite){
        this._parentComplexSprite = value;
    }

    get parent(){
        return this._parentComplexSprite;
    }

    set size(value){
        this._size = value;

        for (const child of this._children){
            child.size = value;
        }
    }

    get size() {
        return this._size;
    }

    set rotateStyle(value){
        this._rotateStyle = value;
        for (const child of this._children){
            child.rotateStyle = value;
        }
    }

    get rotateStyle(){
        return this._rotateStyle;
    }

    get otherSprite(){
        if (!this._collidedSprite){
            return null;
        }
        return this._collidedSprite.collisionResult.b;
    }

    get otherMainSprite(){
        if (!this._collidedSprite){
            return null;
        }
        return this._collidedSprite.collisionResult.b.getMainSprite();
    }
    
    set hidden(value){
        this._hidden = value;
        for (const child of this._children){
            child.hidden = value;
        }
    }
    
    get hidden(){
        return this._hidden;
    }

    get collidedSprite(){
        return this._collidedSprite;
    }

    get deleted(){
        return this._deleted;
    }

    get overlap() {
        if (!this._collidedSprite.collisionResult.collision) {
            return 0;
        }

        return this._collidedSprite.collisionResult.overlap;
    }

    get overlapX() {
        if (!this._collidedSprite.collisionResult.collision) {
            return 0;
        }

        return this._collidedSprite.collisionResult.overlap_x * this._collidedSprite.collisionResult.overlap;
    }

    get overlapY() {
        if (!this._collidedSprite.collisionResult.collision) {
            return 0;
        }

        return this._collidedSprite.collisionResult.overlap_y * this._collidedSprite.collisionResult.overlap;
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

    addChild(child:Sprite|ComplexSprite) {
        if (!this._children.includes(child)) {
            this._children.push(child);
            child.parent = this;
            child.layer = this.layer;
            child.x = 0;
            child.y = 0;
            child.direction = this.direction;
        }
    }

    removeChild(child){
        const foundChildIndex = this._children.indexOf(child);

        if (foundChildIndex > -1){
            const child = this._children[foundChildIndex];

            child.parent = null;
            this._children.splice(foundChildIndex, 1);
        }
    }

    getChildren(){
        return this._children;
    }

    move(steps){
        const angleRadians = this.angleRadians;

        this.x += (steps * Math.sin(angleRadians));
        this.y -= (steps * Math.cos(angleRadians));
    }

    touchSprite(sprite){
        if (!this._deleted && !this._hidden) {
            this._collidedSprite = null;
            for (const child of this._children) {
                if (child.toucheSprite(sprite)) {
                    this._collidedSprite = child;
                    return true;
                }
            }
        }
        return false;
    }

    touchTag(nameOfTag){
        if (!this._deleted && !this._hidden) {
            for (const child of this._children) {
                if (child.touchTag(nameOfTag)) {
                    this._collidedSprite = child;
                    return true;
                }
            }
        }
        return false;
    }

    touchTagAll(nameOfTag){
        const collidedSprites = [];

        if (!this._deleted && !this._hidden) {
            for (const child of this._children) {
                const collision = child.touchTagAll(nameOfTag);
                if (!collision.length) {
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

    touchMouse(): boolean {
        for (const child of this._children) {
            if (child.touchMousePoint(child.game.getMousePoint())){
                this._collidedSprite = child.otherSprite;
                return true;
            }
        }
        return false;
    }

    private updateCenterParams(): void {
        this._centerDistance = Math.hypot(this._pivotOffsetX, this._pivotOffsetY);
        this._centerAngle = -Math.atan2(-this._pivotOffsetY , -this._pivotOffsetX);
    }

    getMainSprite(){
        if (this._parentComplexSprite){
            return this._parentComplexSprite.getMainSprite();
        }
        return this;
    }

    createClone(stage = null){
        if (!stage) {
            stage = this.stage;
        }

        const clone = new ComplexSprite(stage);

        for (const child of this._children) {
            const childClone = child.createClone();
            clone.addChild(childClone)
            childClone.x = child.x;
            childClone.y = child.y;
        }

        clone.x = this.x;
        clone.y = this.y;
        clone.direction = this.direction;
        clone.size = this.size;
        clone.layer = this.layer;

        clone.parent = null;

        return clone;
    }

    addTag(nameOfTag){
       for (const child of this._children) {
           child.addTag(nameOfTag);
       }
    }

    removeTag(nameOfTag){
        for (const child of this._children) {
            child.removeTag(nameOfTag);
        }
    }
    
    delete() {
        for (const child of this._children){
            child.delete();
        }
        this._deleted = true;
    }

    touchEdge () {
        for (const child of this._children) {
            if (child.touchEdge()) {
                this._collidedSprite = child;
                return true;
            }
        }
        return false;
    }

    touchTopEdge(){
        for (const child of this._children) {
            if (child.touchTopEdge()) {
                this._collidedSprite = child;
                return true;
            }
        }
        return false;
    }

    touchBottomEdge(){
        for (const child of this._children) {
            if (child.touchBottomEdge()) {
                this._collidedSprite = child;
                return true;
            }
        }
        return false;
    }

    touchLeftEdge(){
        for (const child of this._children) {
            if (child.touchLeftEdge()) {
                this._collidedSprite = child;
                return true;
            }
        }
        return false;
    }

    touchRightEdge(){
        for (const child of this._children) {
            if (child.touchRightEdge()) {
                this._collidedSprite = child;
                return true;
            }
        }
        return false;
    }

    bounceOnEdge(): void {
        if (this.touchTopEdge() || this.touchBottomEdge()) {
            this.direction = 180 - this.direction;
        }

        if (this.touchLeftEdge() || this.touchRightEdge()) {
            this.direction *= -1;
        }
    }

}
