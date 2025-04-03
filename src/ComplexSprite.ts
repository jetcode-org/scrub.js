class ComplexSprite{

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
    private _centerDistance = 0;
    private _centerAngle = 0;

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

        return complexSprite;
    }

    set x(value){
        this._x = value;
        this.updateCenterParams()

        for (const child of this._children) {
            child.updateColliderPosition()
        }
    }

    get x() {
        return this._x;
    }

    get absoluteX() {
        return this._parentComplexSprite ? this._x + this._parentComplexSprite.x : this._x;
    }

    set y(value){
        this._y = value;
        for (const child of this._children) {
            child.updateColliderPosition()
        }
        this.updateCenterParams()
    }

    get y(){
        return this._y;
    }

    get absoluteY() {
        return this._parentComplexSprite ? this._y + this._parentComplexSprite.y : this._y;
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
        return this._collidedSprite;
    }

    get otherMainSprite(){
        if (!this._collidedSprite){
            return null;
        }
        return this._collidedSprite.getMainSprite();
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
        this._collidedSprite = null;
        for (const child of this._children) {
            if (child.toucheSprite(sprite)){
                this._collidedSprite = child;
                return true;
            }
        }
        return false;
    }

    touchTag(nameOfTag){
        for (const child of this._children) {
            if (child.touchTag(nameOfTag)){
                this._collidedSprite = child.otherSprite;
            }
        }
    }

    touchTagAll(nameOfTag){
        for (const child of this._children) {
            const collidedSprites = child.touchTagAll(nameOfTag);
            if (!collidedSprites.length){
                return collidedSprites;
            }
        }
        return false;
    }

    pointForward(object): void {
        this.direction = (Math.atan2(this.absoluteY - object.absoluteY , this.absoluteX - object.absoluteX) / Math.PI * 180) - 90
    }

    getDistanceTo(object): number {
        return Math.sqrt((Math.abs(this.absoluteX - object.absoluteX)) + (Math.abs(this.absoluteY - object.absoluteY)));
    }

    touchMouse(): boolean {
        for (const child of this._children) {
            if (child.touchMousePoint(child.game.getMousePoint())){
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
        }

        clone.x = this.x;
        clone.y = this.y;
        clone.direction = this.direction;
        clone.size = this.size;
        clone.layer = this.layer;

        clone.parent = null;

        return clone;
    }
}