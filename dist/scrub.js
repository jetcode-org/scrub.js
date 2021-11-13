var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Costume = (function () {
    function Costume() {
        this.x = 0;
        this.y = 0;
        this.ready = false;
    }
    return Costume;
}());
var GAME_READY_EVENT = 'scrubjs.game.ready';
var STAGE_READY_EVENT = 'scrubjs.stage.ready';
var STAGE_BACKGROUND_READY_EVENT = 'scrubjs.stage.background_ready';
var SPRITE_READY_EVENT = 'scrubjs.sprite.ready';
var SPRITE_COSTUME_READY_EVENT = 'scrubjs.sprite.costume_ready';
var SPRITE_SOUND_READY_EVENT = 'scrubjs.sprite.sound_ready';
var Game = (function () {
    function Game(width, height, canvasId) {
        if (width === void 0) { width = null; }
        if (height === void 0) { height = null; }
        if (canvasId === void 0) { canvasId = null; }
        this.debugMode = 'none';
        this.debugBody = false;
        this.displayErrors = false;
        this.stages = [];
        this.loadedStages = 0;
        this.onReadyCallbacks = [];
        this.onReadyPending = true;
        this.id = Symbol();
        this.keyboard = new Keyboard();
        this.mouse = new Mouse();
        if (canvasId) {
            var element = document.getElementById(canvasId);
            if (element instanceof HTMLCanvasElement) {
                this.canvas = element;
            }
        }
        else {
            this.canvas = document.createElement('canvas');
            document.body.appendChild(this.canvas);
        }
        this.canvas.width = width;
        this.canvas.height = height;
        this.styles = new Styles(this.canvas, width, height);
        this.context = this.canvas.getContext('2d');
        Registry.getInstance().set('game', this);
        this.addListeners();
    }
    Game.prototype.addStage = function (stage) {
        this.stages.push(stage);
    };
    Game.prototype.getLastStage = function () {
        if (!this.stages.length) {
            return null;
        }
        return this.stages[this.stages.length - 1];
    };
    Game.prototype.getActiveStage = function () {
        if (this.activeStage) {
            return this.activeStage;
        }
        return null;
    };
    Game.prototype.run = function (stage) {
        if (stage === void 0) { stage = null; }
        if (!stage && this.stages.length) {
            stage = this.stages[0];
        }
        if (!stage) {
            this.throwError('You need create Stage instance before run game.');
        }
        if (this.activeStage && this.activeStage.running) {
            this.activeStage.stop();
        }
        this.activeStage = stage;
        this.activeStage.run();
    };
    Game.prototype.isReady = function () {
        return this.loadedStages == this.stages.length;
    };
    Game.prototype.onReady = function (callback) {
        this.onReadyCallbacks.push(callback);
    };
    Game.prototype.stop = function () {
        if (this.activeStage && this.activeStage.running) {
            this.activeStage.stop();
        }
    };
    Object.defineProperty(Game.prototype, "width", {
        get: function () {
            return this.canvas.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "height", {
        get: function () {
            return this.canvas.height;
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.keyPressed = function (char) {
        return this.keyboard.keyPressed(char);
    };
    Game.prototype.keyDown = function (char, callback) {
        this.keyboard.keyDown(char, callback);
    };
    Game.prototype.keyUp = function (char, callback) {
        this.keyboard.keyUp(char, callback);
    };
    Game.prototype.mouseDown = function () {
        return this.mouse.isDown;
    };
    Game.prototype.getMousePoint = function () {
        return this.mouse.getPoint();
    };
    Game.prototype.getRandom = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Game.prototype.throwError = function (message) {
        if (this.displayErrors) {
            alert(message);
        }
        throw new Error(message);
    };
    Game.prototype.addListeners = function () {
        var _this = this;
        document.addEventListener(STAGE_READY_EVENT, function (event) {
            _this.loadedStages++;
            _this.tryDoOnReady();
        });
    };
    Game.prototype.tryDoOnReady = function () {
        if (this.isReady() && this.onReadyPending) {
            this.onReadyPending = false;
            if (this.onReadyCallbacks.length) {
                for (var _i = 0, _a = this.onReadyCallbacks; _i < _a.length; _i++) {
                    var callback = _a[_i];
                    callback();
                }
                this.onReadyCallbacks = [];
            }
            var event_1 = new CustomEvent(GAME_READY_EVENT, {
                detail: {
                    game: this
                }
            });
            document.dispatchEvent(event_1);
        }
    };
    return Game;
}());
var Sprite = (function () {
    function Sprite(stage, costumePaths, soundPaths) {
        if (stage === void 0) { stage = null; }
        if (costumePaths === void 0) { costumePaths = []; }
        if (soundPaths === void 0) { soundPaths = []; }
        this.name = 'No name';
        this.size = 100;
        this.rotateStyle = 'normal';
        this.singleBody = true;
        this.costumeIndex = null;
        this.costume = null;
        this.costumes = [];
        this.costumeNames = [];
        this.sounds = [];
        this.soundNames = [];
        this.deleted = false;
        this.phraseLiveTime = null;
        this._x = 0;
        this._y = 0;
        this._direction = 0;
        this._hidden = false;
        this._stopped = true;
        this.loadedCostumes = 0;
        this.loadedSounds = 0;
        this.onReadyCallbacks = [];
        this.onReadyPending = true;
        this.id = Symbol();
        if (!Registry.getInstance().has('game')) {
            this.game.throwError('You need create Game instance before Sprite instance.');
        }
        this.game = Registry.getInstance().get('game');
        this.stage = stage;
        if (!this.stage) {
            this.stage = this.game.getLastStage();
        }
        if (!this.stage) {
            this.game.throwError('You need create Stage instance before Sprite instance.');
        }
        this.position = this.stage.addSprite(this);
        this._x = this.game.width / 2;
        this._y = this.game.height / 2;
        for (var _i = 0, costumePaths_1 = costumePaths; _i < costumePaths_1.length; _i++) {
            var costumePath = costumePaths_1[_i];
            this.addCostume(costumePath);
        }
        for (var _a = 0, soundPaths_1 = soundPaths; _a < soundPaths_1.length; _a++) {
            var soundPath = soundPaths_1[_a];
            this.addSound(soundPath);
        }
        this.addListeners();
    }
    Sprite.prototype.isReady = function () {
        return this.loadedCostumes == this.costumes.length && this.loadedSounds == this.sounds.length;
    };
    Sprite.prototype.onReady = function (callback) {
        this.onReadyCallbacks.push(callback);
    };
    Sprite.prototype.addCostume = function (costumePath, name, x, y, width, height, paddingTop, paddingRight, paddingBottom, paddingLeft) {
        var _this = this;
        if (name === void 0) { name = null; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = null; }
        if (height === void 0) { height = null; }
        if (paddingTop === void 0) { paddingTop = 0; }
        if (paddingRight === void 0) { paddingRight = 0; }
        if (paddingBottom === void 0) { paddingBottom = 0; }
        if (paddingLeft === void 0) { paddingLeft = 0; }
        var costume = new Costume();
        if (!name) {
            var costumeIndex = this.costumes.length;
            name = 'No name ' + costumeIndex;
        }
        this.costumes.push(costume);
        this.costumeNames.push(name);
        var image = new Image();
        image.src = costumePath;
        image.addEventListener('load', function () {
            if (_this.deleted) {
                return;
            }
            _this.addCostumeByImage(costume, image, x, y, width, height, paddingTop, paddingRight, paddingBottom, paddingLeft);
        }, false);
        image.addEventListener('error', function () {
            _this.game.throwError('Costume image "' + costumePath + '" was not loaded. Check that the path is correct.');
        });
    };
    Sprite.prototype.addCostumeByImage = function (costume, image, x, y, width, height, paddingTop, paddingRight, paddingBottom, paddingLeft) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (width === void 0) { width = null; }
        if (height === void 0) { height = null; }
        if (paddingTop === void 0) { paddingTop = 0; }
        if (paddingRight === void 0) { paddingRight = 0; }
        if (paddingBottom === void 0) { paddingBottom = 0; }
        if (paddingLeft === void 0) { paddingLeft = 0; }
        if (width === null) {
            width = image.naturalWidth;
        }
        if (height === null) {
            height = image.naturalHeight;
        }
        costume.image = image;
        costume.x = x;
        costume.y = y;
        costume.width = width;
        costume.height = height;
        costume.body = new Polygon(this.x, this.y, [
            [(costume.width / 2) * -1 + paddingLeft * -1, (costume.height / 2) * -1 + paddingTop * -1],
            [costume.width / 2 + paddingRight, (costume.height / 2) * -1 + paddingTop * -1],
            [costume.width / 2 + paddingRight, costume.height / 2 + paddingBottom],
            [(costume.width / 2) * -1 + paddingLeft * -1, costume.height / 2 + paddingBottom]
        ]);
        costume.ready = true;
        event = new CustomEvent(SPRITE_COSTUME_READY_EVENT, {
            detail: {
                costume: costume,
                spriteId: this.id
            }
        });
        document.dispatchEvent(event);
    };
    Sprite.prototype.addCostumes = function (costumePath, name, cols, rows, limit, offset, paddingTop, paddingRight, paddingBottom, paddingLeft) {
        var _this = this;
        if (name === void 0) { name = null; }
        if (rows === void 0) { rows = 1; }
        if (limit === void 0) { limit = null; }
        if (offset === void 0) { offset = null; }
        if (paddingTop === void 0) { paddingTop = 0; }
        if (paddingRight === void 0) { paddingRight = 0; }
        if (paddingBottom === void 0) { paddingBottom = 0; }
        if (paddingLeft === void 0) { paddingLeft = 0; }
        var image = new Image();
        image.src = costumePath;
        if (!name) {
            name = 'No name';
        }
        image.addEventListener('load', function () {
            image.naturalWidth;
            image.naturalHeight;
            var chunkWidth = image.naturalWidth / cols;
            var chunkHeight = image.naturalHeight / rows;
            var skip = false;
            var costumeIndex = 0;
            var x = 0;
            var y = 0;
            for (var i = 0; i < rows; i++) {
                for (var t = 0; t < cols; t++) {
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
                        var costume = new Costume();
                        var costumeName = name;
                        if (costumeName !== null) {
                            costumeName += ' ' + costumeIndex;
                        }
                        _this.costumes.push(costume);
                        _this.costumeNames.push(name);
                        _this.addCostumeByImage(costume, image, x, y, chunkWidth, chunkHeight, paddingTop, paddingRight, paddingBottom, paddingLeft);
                        costumeIndex++;
                    }
                    x += chunkWidth;
                }
                x = 0;
                y += chunkHeight;
            }
        }, false);
    };
    Sprite.prototype.switchCostume = function (costumeIndex) {
        var _this = this;
        var costume = this.costumes[costumeIndex];
        if (costume instanceof Costume && costume.ready) {
            this.costumeIndex = costumeIndex;
            this.costume = costume;
            if (this.singleBody) {
                if (!(this.body instanceof Polygon)) {
                    this.createBody(costume);
                }
                costume.image.addEventListener('load', function () {
                    _this.createBody(costume);
                }, false);
            }
            else {
                if (this.body instanceof Polygon) {
                    this.removeBody();
                }
                if (costume.body instanceof Polygon) {
                    this.createBody(costume);
                }
                costume.image.addEventListener('load', function () {
                    _this.createBody(costume);
                }, false);
            }
        }
    };
    Sprite.prototype.switchCostumeByName = function (costumeName) {
        var costumeIndex = this.costumeNames.indexOf(costumeName);
        if (costumeIndex > -1) {
            this.switchCostume(costumeIndex);
        }
        else {
            this.game.throwError('Name ' + costumeName + 'not found.');
        }
    };
    Sprite.prototype.nextCostume = function () {
        var nextCostume = this.costumeIndex + 1;
        if (nextCostume > this.costumes.length - 1) {
            nextCostume = 0;
        }
        this.switchCostume(nextCostume);
    };
    Sprite.prototype.changePosition = function (newPosition) {
        this.stage.changeSpritePosition(this, newPosition);
    };
    Sprite.prototype.addSound = function (soundPath, name) {
        var _this = this;
        if (name === void 0) { name = null; }
        if (!name) {
            name = 'No name ' + this.sounds.length;
        }
        var sound = new Audio();
        sound.src = soundPath;
        this.sounds.push(sound);
        this.soundNames.push(name);
        sound.load();
        sound.addEventListener('loadedmetadata', function () {
            event = new CustomEvent(SPRITE_SOUND_READY_EVENT, {
                detail: {
                    sound: sound,
                    spriteId: _this.id
                }
            });
            document.dispatchEvent(event);
        }, false);
    };
    Sprite.prototype.playSound = function (soundIndex, volume, currentTime) {
        if (volume === void 0) { volume = null; }
        if (currentTime === void 0) { currentTime = null; }
        var sound = this.sounds[soundIndex];
        if (sound instanceof Audio) {
            sound.play();
            if (volume !== null) {
                sound.volume = volume;
            }
            if (currentTime !== null) {
                sound.currentTime = currentTime;
            }
        }
        else {
            this.game.throwError('Sound with index "' + soundIndex + '" not found.');
        }
    };
    Sprite.prototype.pauseSound = function (soundIndex) {
        var sound = this.sounds[soundIndex];
        if (sound instanceof Audio) {
            sound.pause();
        }
        else {
            this.game.throwError('Sound with index "' + soundIndex + '" not found.');
        }
    };
    Sprite.prototype.playSoundByName = function (soundName, volume, currentTime) {
        if (volume === void 0) { volume = null; }
        if (currentTime === void 0) { currentTime = null; }
        var soundIndex = this.soundNames.indexOf(soundName);
        if (soundIndex > -1) {
            this.playSound(soundIndex, volume, currentTime);
        }
        else {
            this.game.throwError('Name ' + soundName + 'not found.');
        }
    };
    Sprite.prototype.pauseSoundByName = function (soundName) {
        var soundIndex = this.soundNames.indexOf(soundName);
        if (soundIndex > -1) {
            this.pauseSound(soundIndex);
        }
        else {
            this.game.throwError('Name ' + soundName + 'not found.');
        }
    };
    Sprite.prototype.move = function (steps) {
        this.x += (steps * Math.sin(this.direction * Math.PI / 180));
        this.y -= (steps * Math.cos(this.direction * Math.PI / 180));
    };
    Sprite.prototype.bounceOnEdge = function () {
        if (this.touchTopEdge() || this.touchBottomEdge()) {
            this.direction = 180 - this.direction;
        }
        if (this.touchLeftEdge() || this.touchRightEdge()) {
            this.direction *= -1;
        }
    };
    Sprite.prototype.touchSprite = function (sprite, result) {
        if (result === void 0) { result = null; }
        if (sprite.hidden ||
            this.hidden ||
            sprite.stopped ||
            this.stopped ||
            !(sprite.getBody() instanceof Body) ||
            !(this.body instanceof Body)) {
            return false;
        }
        return this.body.collides(sprite.getBody(), result);
    };
    Sprite.prototype.touchSprites = function (sprites, result) {
        if (result === void 0) { result = null; }
        for (var _i = 0, sprites_1 = sprites; _i < sprites_1.length; _i++) {
            var sprite = sprites_1[_i];
            if (this.touchSprite(sprite, result)) {
                return true;
            }
        }
        return false;
    };
    Sprite.prototype.touchPotentialSprites = function (sprites, result) {
        if (result === void 0) { result = null; }
        if (!(this.body instanceof Polygon)) {
            return false;
        }
        var potentials = this.body.potentials();
        if (!potentials.length) {
            return false;
        }
        var potentialSprites = [];
        for (var _i = 0, sprites_2 = sprites; _i < sprites_2.length; _i++) {
            var sprite = sprites_2[_i];
            if (potentials.indexOf(sprite.getBody()) > -1) {
                potentialSprites.push(sprite);
            }
        }
        for (var _a = 0, potentialSprites_1 = potentialSprites; _a < potentialSprites_1.length; _a++) {
            var potentialSprite = potentialSprites_1[_a];
            if (this.touchSprite(potentialSprite, result)) {
                return true;
            }
        }
        return false;
    };
    Sprite.prototype.touchEdge = function (result) {
        if (result === void 0) { result = null; }
        if (!(this.body instanceof Body)) {
            return false;
        }
        if (this.body.collides(this.stage.getTopEdge(), result)) {
            return true;
        }
        else if (this.body.collides(this.stage.getRightEdge(), result)) {
            return true;
        }
        else if (this.body.collides(this.stage.getBottomEdge(), result)) {
            return true;
        }
        else if (this.body.collides(this.stage.getLeftEdge(), result)) {
            return true;
        }
        return false;
    };
    Sprite.prototype.touchTopEdge = function (result) {
        if (result === void 0) { result = null; }
        if (!(this.body instanceof Body)) {
            return false;
        }
        return this.body.collides(this.stage.getTopEdge(), result);
    };
    Sprite.prototype.touchLeftEdge = function (result) {
        if (result === void 0) { result = null; }
        if (!(this.body instanceof Body)) {
            return false;
        }
        return this.body.collides(this.stage.getLeftEdge(), result);
    };
    Sprite.prototype.touchRightEdge = function (result) {
        if (result === void 0) { result = null; }
        if (!(this.body instanceof Body)) {
            return false;
        }
        return this.body.collides(this.stage.getRightEdge(), result);
    };
    Sprite.prototype.touchBottomEdge = function (result) {
        if (result === void 0) { result = null; }
        if (!(this.body instanceof Body)) {
            return false;
        }
        return this.body.collides(this.stage.getBottomEdge(), result);
    };
    Sprite.prototype.touchMouse = function (result) {
        if (result === void 0) { result = null; }
        if (!(this.body instanceof Body)) {
            return false;
        }
        return this.body.collides(this.game.getMousePoint(), result);
    };
    Sprite.prototype.pointForward = function (sprite) {
        this.direction = (Math.atan2(this.y - sprite.y, this.x - sprite.x) / Math.PI * 180) - 90;
    };
    Sprite.prototype.getDistanceToSprite = function (sprite) {
        return Math.sqrt((Math.abs(this.x - sprite.x)) + (Math.abs(this.y - sprite.y)));
    };
    Sprite.prototype.getDistanceToMouse = function (mouse) {
        return Math.sqrt((Math.abs(this.x - mouse.x)) + (Math.abs(this.y - mouse.y)));
    };
    Sprite.prototype.say = function (text, time) {
        if (time === void 0) { time = null; }
        this.phrase = this.name + ': ' + text;
        this.phraseLiveTime = null;
        if (time) {
            var currentTime = (new Date()).getTime();
            this.phraseLiveTime = currentTime + time;
        }
    };
    Sprite.prototype.getPhrase = function () {
        if (this.phrase) {
            if (this.phraseLiveTime === null) {
                return this.phrase;
            }
            var currentTime = (new Date()).getTime();
            if (this.phraseLiveTime > currentTime) {
                return this.phrase;
            }
            else {
                this.phrase = null;
                this.phraseLiveTime = null;
            }
        }
        return null;
    };
    Sprite.prototype.createClone = function (stage) {
        if (stage === void 0) { stage = null; }
        if (!this.isReady()) {
            this.game.throwError('Sprite cannot be cloned because one is not ready.');
        }
        if (!stage) {
            stage = this.stage;
        }
        var clone = new Sprite(stage);
        clone.x = this.x;
        clone.y = this.y;
        clone.direction = this.direction;
        clone.size = this.size;
        clone.hidden = this.hidden;
        for (var _i = 0, _a = this.costumes; _i < _a.length; _i++) {
            var costume = _a[_i];
            clone.addCostume(costume.image.src);
        }
        clone.switchCostume(this.costumeIndex);
        clone.deleted = this.deleted;
        clone._stopped = this.stopped;
        return clone;
    };
    Sprite.prototype.timeout = function (callback, timeout) {
        var _this = this;
        setTimeout(function () {
            if (_this.deleted || _this.stopped) {
                return;
            }
            requestAnimationFrame(function () { return callback(_this); });
        }, timeout);
    };
    Sprite.prototype.forever = function (callback, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = null; }
        if (this.deleted || this.stopped) {
            return;
        }
        var result = callback(this);
        if (result === false) {
            return;
        }
        if (timeout) {
            setTimeout(function () {
                requestAnimationFrame(function () { return _this.forever(callback, timeout); });
            }, timeout);
        }
        else {
            requestAnimationFrame(function () { return _this.forever(callback); });
        }
    };
    Sprite.prototype.delete = function () {
        if (this.deleted) {
            return;
        }
        this.stage.removeSprite(this);
        var props = Object.keys(this);
        for (var i = 0; i < props.length; i++) {
            delete this[props[i]];
        }
        this.deleted = true;
    };
    Sprite.prototype.run = function () {
        this._stopped = false;
    };
    Sprite.prototype.stop = function () {
        this._stopped = true;
    };
    Sprite.prototype.getBody = function () {
        return this.body;
    };
    Sprite.prototype.getCostume = function () {
        return this.costume;
    };
    Object.defineProperty(Sprite.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (direction) {
            if ((direction * 0) !== 0) {
                return;
            }
            direction = direction % 360;
            if (direction < 0) {
                direction += 360;
            }
            this._direction = (direction > 360) ? direction - 360 : direction;
            if (this.body instanceof Polygon) {
                if (this.rotateStyle == 'leftRight') {
                    this.body.angle = 0;
                }
                else {
                    this.body.angle = this._direction * 3.14 / 180;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "width", {
        get: function () {
            if (this.costume) {
                return this.costume.width * this.size / 100;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "height", {
        get: function () {
            if (this.costume) {
                return this.costume.height * this.size / 100;
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
            if (this.body instanceof Polygon) {
                this.body.x = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
            if (this.body instanceof Polygon) {
                this.body.y = value;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "realX", {
        get: function () {
            return this.x - this.width / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "realY", {
        get: function () {
            return this.y - this.height / 2;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "hidden", {
        get: function () {
            return this._hidden;
        },
        set: function (value) {
            this._hidden = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "stopped", {
        get: function () {
            return this._stopped;
        },
        enumerable: true,
        configurable: true
    });
    Sprite.prototype.addListeners = function () {
        var _this = this;
        document.addEventListener(SPRITE_COSTUME_READY_EVENT, function (event) {
            if (_this.id == event.detail.spriteId) {
                _this.loadedCostumes++;
                _this.tryDoOnReady();
                if (_this.loadedCostumes == _this.costumes.length && _this.costume === null) {
                    _this.switchCostume(0);
                }
            }
        });
        document.addEventListener(SPRITE_SOUND_READY_EVENT, function (event) {
            if (_this.id == event.detail.spriteId) {
                _this.loadedSounds++;
                _this.tryDoOnReady();
            }
        });
    };
    Sprite.prototype.tryDoOnReady = function () {
        if (this.isReady() && this.onReadyPending) {
            this.onReadyPending = false;
            if (this.onReadyCallbacks.length) {
                for (var _i = 0, _a = this.onReadyCallbacks; _i < _a.length; _i++) {
                    var callback = _a[_i];
                    callback();
                }
                this.onReadyCallbacks = [];
            }
            var event_2 = new CustomEvent(SPRITE_READY_EVENT, {
                detail: {
                    sprite: this,
                    stageId: this.stage.id
                }
            });
            document.dispatchEvent(event_2);
        }
    };
    Sprite.prototype.removeBody = function () {
        if (this.body instanceof Polygon) {
            this.stage.collisionSystem.remove(this.body);
            this.body = null;
        }
    };
    Sprite.prototype.createBody = function (costume) {
        this.body = costume.body;
        this.body.scale_x = this.size / 100;
        this.body.scale_y = this.size / 100;
        this.stage.collisionSystem.insert(this.body);
    };
    return Sprite;
}());
var Stage = (function () {
    function Stage(background, padding) {
        if (background === void 0) { background = null; }
        if (padding === void 0) { padding = 0; }
        this.background = null;
        this.backgroundIndex = null;
        this.backgrounds = [];
        this.sprites = [];
        this.drawings = [];
        this.loadedSprites = 0;
        this.loadedBackgrounds = 0;
        this.pendingRun = false;
        this.onReadyCallbacks = [];
        this.onStartCallbacks = [];
        this.onReadyPending = true;
        this._stopped = false;
        this._running = false;
        this.id = Symbol();
        if (!Registry.getInstance().has('game')) {
            this.game.throwError('You need create Game instance before Stage instance.');
        }
        this.game = Registry.getInstance().get('game');
        this.collisionSystem = new CollisionSystem();
        this.canvas = this.game.canvas;
        this.context = this.game.context;
        if (background) {
            this.addBackground(background);
        }
        this.padding = padding;
        this.addListeners();
        this.game.addStage(this);
    }
    Object.defineProperty(Stage.prototype, "padding", {
        get: function () {
            return this._padding;
        },
        set: function (padding) {
            this._padding = padding;
            this.topEdge = this.collisionSystem.createPolygon(0, 0, [[padding, padding], [this.width - padding, padding]]);
            this.rightEdge = this.collisionSystem.createPolygon(0, 0, [[this.width - padding, padding], [this.width - padding, this.height - padding]]);
            this.bottomEdge = this.collisionSystem.createPolygon(0, 0, [[this.width - padding, this.height - padding], [padding, this.height - padding]]);
            this.leftEdge = this.collisionSystem.createPolygon(0, 0, [[padding, this.height - padding], [padding, padding]]);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "width", {
        get: function () {
            return this.canvas.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "height", {
        get: function () {
            return this.canvas.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "running", {
        get: function () {
            return this._running;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "stopped", {
        get: function () {
            return this._stopped;
        },
        enumerable: true,
        configurable: true
    });
    Stage.prototype.addSprite = function (sprite) {
        this.sprites.push(sprite);
        return this.sprites.length - 1;
    };
    Stage.prototype.removeSprite = function (sprite) {
        this.sprites.splice(this.sprites.indexOf(sprite), 1);
    };
    Stage.prototype.addBackground = function (backgroundPath) {
        var _this = this;
        var background = new Image();
        background.src = backgroundPath;
        this.backgrounds.push(background);
        background.addEventListener('load', function () {
            event = new CustomEvent(STAGE_BACKGROUND_READY_EVENT, {
                detail: {
                    background: background,
                    stageId: _this.id
                }
            });
            document.dispatchEvent(event);
        });
        background.addEventListener('error', function () {
            _this.game.throwError('Background image "' + backgroundPath + '" was not loaded. Check that the path is correct.');
        });
    };
    Stage.prototype.switchBackground = function (backgroundIndex) {
        this.backgroundIndex = backgroundIndex;
        var background = this.backgrounds[backgroundIndex];
        if (background) {
            this.background = background;
        }
    };
    Stage.prototype.changeSpritePosition = function (sprite, newPosition) {
        var oldPosition = sprite.position;
        while (oldPosition < 0) {
            oldPosition += this.sprites.length;
        }
        while (newPosition < 0) {
            newPosition += this.sprites.length;
        }
        if (newPosition >= this.sprites.length) {
            var k = newPosition - this.sprites.length + 1;
            while (k--) {
                this.sprites.push(undefined);
            }
        }
        this.sprites.splice(newPosition, 0, this.sprites.splice(oldPosition, 1)[0]);
        sprite.position = newPosition;
    };
    Stage.prototype.drawSprite = function (sprite) {
        var costume = sprite.getCostume();
        var image = costume.image;
        var dstX = sprite.x - sprite.width / 2;
        var dstY = sprite.y - sprite.height / 2;
        var dstWidth = sprite.width;
        var dstHeight = sprite.height;
        var direction = sprite.direction;
        var rotateStyle = sprite.rotateStyle;
        if (rotateStyle === 'normal' && direction !== 0) {
            this.context.save();
            this.context.translate(dstX + dstWidth / 2, dstY + dstHeight / 2);
            this.context.rotate(direction * Math.PI / 180);
            this.context.translate(-dstX - dstWidth / 2, -dstY - dstHeight / 2);
        }
        if (rotateStyle === 'leftRight' && direction > 180) {
            this.context.save();
            this.context.translate(dstX + dstWidth / 2, 0);
            this.context.scale(-1, 1);
            this.context.drawImage(image, costume.x, costume.y, costume.width, costume.height, -dstWidth / 2, dstY, dstWidth, dstHeight);
        }
        else {
            this.context.drawImage(image, costume.x, costume.y, costume.width, costume.height, dstX, dstY, dstWidth, dstHeight);
        }
        if (rotateStyle === 'normal' && direction !== 0 || rotateStyle === 'leftRight' && direction > 180) {
            this.context.restore();
        }
    };
    Stage.prototype.pen = function (callback) {
        this.drawings.push(callback);
    };
    Stage.prototype.render = function () {
        var _this = this;
        this.context.clearRect(0, 0, this.width, this.height);
        if (this.backgroundColor) {
            this.context.fillStyle = this.backgroundColor;
            this.context.fillRect(0, 0, this.width, this.height);
        }
        if (this.background) {
            this.context.drawImage(this.background, 0, 0, this.width, this.height);
        }
        if (this.drawings.length) {
            for (var _i = 0, _a = this.drawings; _i < _a.length; _i++) {
                var drawing = _a[_i];
                drawing(this.context);
            }
        }
        this.collisionSystem.update();
        if (this.game.debugBody) {
            this.collisionSystem.draw(this.context);
            this.context.stroke();
        }
        var _loop_1 = function (sprite) {
            if (sprite.hidden) {
                return "continue";
            }
            if (this_1.game.debugMode !== 'none') {
                var fn = function () {
                    var x = sprite.x - (_this.context.measureText(sprite.name).width / 2);
                    var y = sprite.realY + sprite.height + 20;
                    _this.context.font = '16px Arial';
                    _this.context.fillStyle = 'black';
                    _this.context.fillText(sprite.name, x, y);
                    y += 20;
                    _this.context.font = '14px Arial';
                    _this.context.fillText("x: " + sprite.x, x, y);
                    y += 20;
                    _this.context.fillText("y: " + sprite.y, x, y);
                    y += 20;
                    _this.context.fillText("direction: " + sprite.direction, x, y);
                    y += 20;
                    _this.context.fillText("costume: " + sprite.costumeNames[sprite.costumeIndex], x, y);
                };
                if (this_1.game.debugMode === 'hover') {
                    if (sprite.touchMouse()) {
                        fn();
                    }
                }
                if (this_1.game.debugMode === 'forever') {
                    fn();
                }
            }
            var phrase = sprite.getPhrase();
            if (phrase) {
                this_1.context.font = '20px Arial';
                this_1.context.fillStyle = 'black';
                this_1.context.fillText(phrase, 40, this_1.canvas.height - 40);
            }
            if (sprite.costume) {
                this_1.drawSprite(sprite);
            }
        };
        var this_1 = this;
        for (var _b = 0, _c = this.sprites; _b < _c.length; _b++) {
            var sprite = _c[_b];
            _loop_1(sprite);
        }
    };
    Stage.prototype.timeout = function (callback, timeout) {
        var _this = this;
        setTimeout(function () {
            if (_this._stopped) {
                return;
            }
            requestAnimationFrame(function () { return callback(_this); });
        }, timeout);
    };
    Stage.prototype.forever = function (callback, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = null; }
        if (this._stopped) {
            return;
        }
        var result = callback(this);
        if (result === false) {
            return;
        }
        if (result > 0) {
            timeout = result;
        }
        if (timeout) {
            setTimeout(function () {
                requestAnimationFrame(function () { return _this.forever(callback, timeout); });
            }, timeout);
        }
        else {
            requestAnimationFrame(function () { return _this.forever(callback); });
        }
    };
    Stage.prototype.isReady = function () {
        return this.loadedSprites == this.sprites.length && this.loadedBackgrounds == this.backgrounds.length;
    };
    Stage.prototype.run = function () {
        this._running = true;
        this._stopped = false;
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
            sprite.run();
        }
        this.pendingRun = true;
        this.tryDoRun();
    };
    Stage.prototype.onStart = function (onStartCallback) {
        this.onStartCallbacks.push(onStartCallback);
    };
    Stage.prototype.onReady = function (callback) {
        this.onReadyCallbacks.push(callback);
    };
    Stage.prototype.stop = function () {
        this._running = false;
        this._stopped = true;
        for (var _i = 0, _a = this.sprites; _i < _a.length; _i++) {
            var sprite = _a[_i];
            sprite.stop();
        }
    };
    Stage.prototype.getTopEdge = function () {
        return this.topEdge;
    };
    Stage.prototype.getRightEdge = function () {
        return this.rightEdge;
    };
    Stage.prototype.getBottomEdge = function () {
        return this.bottomEdge;
    };
    Stage.prototype.getLeftEdge = function () {
        return this.leftEdge;
    };
    Stage.prototype.addListeners = function () {
        var _this = this;
        document.addEventListener(SPRITE_READY_EVENT, function (event) {
            if (_this.id == event.detail.stageId) {
                _this.loadedSprites++;
                _this.tryDoOnReady();
                _this.tryDoRun();
            }
        });
        document.addEventListener(STAGE_BACKGROUND_READY_EVENT, function (event) {
            if (_this.id == event.detail.stageId) {
                _this.loadedBackgrounds++;
                _this.tryDoOnReady();
                _this.tryDoRun();
                if (_this.loadedBackgrounds == _this.backgrounds.length && _this.backgroundIndex === null) {
                    _this.switchBackground(0);
                }
            }
        });
    };
    Stage.prototype.tryDoOnReady = function () {
        if (this.isReady() && this.onReadyPending) {
            this.onReadyPending = false;
            if (this.onReadyCallbacks.length) {
                for (var _i = 0, _a = this.onReadyCallbacks; _i < _a.length; _i++) {
                    var callback = _a[_i];
                    callback();
                }
                this.onReadyCallbacks = [];
            }
            var event_3 = new CustomEvent(STAGE_READY_EVENT, {
                detail: {
                    stage: this
                }
            });
            document.dispatchEvent(event_3);
        }
    };
    Stage.prototype.doOnStart = function () {
        var _loop_2 = function (callback) {
            setTimeout(function () {
                callback();
            });
        };
        for (var _i = 0, _a = this.onStartCallbacks; _i < _a.length; _i++) {
            var callback = _a[_i];
            _loop_2(callback);
        }
    };
    Stage.prototype.tryDoRun = function () {
        var _this = this;
        if (this.pendingRun && this.isReady()) {
            this._running = true;
            this.pendingRun = false;
            this.doOnStart();
            this.forever(function () {
                _this.render();
            });
        }
    };
    return Stage;
}());
var BVH = (function () {
    function BVH() {
        this._hierarchy = null;
        this._bodies = [];
        this._dirty_branches = [];
    }
    BVH.prototype.insert = function (body, updating) {
        if (updating === void 0) { updating = false; }
        if (!updating) {
            var bvh = body._bvh;
            if (bvh && bvh !== this) {
                throw new Error('Body belongs to another collision system');
            }
            body._bvh = this;
            this._bodies.push(body);
        }
        var polygon = body._polygon;
        var body_x = body.x;
        var body_y = body.y;
        if (polygon) {
            if (body._dirty_coords ||
                body.x !== body._x ||
                body.y !== body._y ||
                body.angle !== body._angle ||
                body.scale_x !== body._scale_x ||
                body.scale_y !== body._scale_y) {
                body._calculateCoords();
            }
        }
        var padding = body._bvh_padding;
        var radius = polygon ? 0 : body.radius * body.scale;
        var body_min_x = (polygon ? body._min_x : body_x - radius) - padding;
        var body_min_y = (polygon ? body._min_y : body_y - radius) - padding;
        var body_max_x = (polygon ? body._max_x : body_x + radius) + padding;
        var body_max_y = (polygon ? body._max_y : body_y + radius) + padding;
        body._bvh_min_x = body_min_x;
        body._bvh_min_y = body_min_y;
        body._bvh_max_x = body_max_x;
        body._bvh_max_y = body_max_y;
        var current = this._hierarchy;
        var sort = 0;
        if (!current) {
            this._hierarchy = body;
        }
        else {
            while (true) {
                if (current._bvh_branch) {
                    var left = current._bvh_left;
                    var left_min_y = left._bvh_min_y;
                    var left_max_x = left._bvh_max_x;
                    var left_max_y = left._bvh_max_y;
                    var left_new_min_x = body_min_x < left._bvh_min_x ? body_min_x : left._bvh_min_x;
                    var left_new_min_y = body_min_y < left_min_y ? body_min_y : left_min_y;
                    var left_new_max_x = body_max_x > left_max_x ? body_max_x : left_max_x;
                    var left_new_max_y = body_max_y > left_max_y ? body_max_y : left_max_y;
                    var left_volume = (left_max_x - left._bvh_min_x) * (left_max_y - left_min_y);
                    var left_new_volume = (left_new_max_x - left_new_min_x) * (left_new_max_y - left_new_min_y);
                    var left_difference = left_new_volume - left_volume;
                    var right = current._bvh_right;
                    var right_min_x = right._bvh_min_x;
                    var right_min_y = right._bvh_min_y;
                    var right_max_x = right._bvh_max_x;
                    var right_max_y = right._bvh_max_y;
                    var right_new_min_x = body_min_x < right_min_x ? body_min_x : right_min_x;
                    var right_new_min_y = body_min_y < right_min_y ? body_min_y : right_min_y;
                    var right_new_max_x = body_max_x > right_max_x ? body_max_x : right_max_x;
                    var right_new_max_y = body_max_y > right_max_y ? body_max_y : right_max_y;
                    var right_volume = (right_max_x - right_min_x) * (right_max_y - right_min_y);
                    var right_new_volume = (right_new_max_x - right_new_min_x) * (right_new_max_y - right_new_min_y);
                    var right_difference = right_new_volume - right_volume;
                    current._bvh_sort = sort++;
                    current._bvh_min_x = left_new_min_x < right_new_min_x ? left_new_min_x : right_new_min_x;
                    current._bvh_min_y = left_new_min_y < right_new_min_y ? left_new_min_y : right_new_min_y;
                    current._bvh_max_x = left_new_max_x > right_new_max_x ? left_new_max_x : right_new_max_x;
                    current._bvh_max_y = left_new_max_y > right_new_max_y ? left_new_max_y : right_new_max_y;
                    current = left_difference <= right_difference ? left : right;
                }
                else {
                    var grandparent = current._bvh_parent;
                    var parent_min_x = current._bvh_min_x;
                    var parent_min_y = current._bvh_min_y;
                    var parent_max_x = current._bvh_max_x;
                    var parent_max_y = current._bvh_max_y;
                    var new_parent = current._bvh_parent = body._bvh_parent = BVHBranch.getBranch();
                    new_parent._bvh_parent = grandparent;
                    new_parent._bvh_left = current;
                    new_parent._bvh_right = body;
                    new_parent._bvh_sort = sort++;
                    new_parent._bvh_min_x = body_min_x < parent_min_x ? body_min_x : parent_min_x;
                    new_parent._bvh_min_y = body_min_y < parent_min_y ? body_min_y : parent_min_y;
                    new_parent._bvh_max_x = body_max_x > parent_max_x ? body_max_x : parent_max_x;
                    new_parent._bvh_max_y = body_max_y > parent_max_y ? body_max_y : parent_max_y;
                    if (!grandparent) {
                        this._hierarchy = new_parent;
                    }
                    else if (grandparent._bvh_left === current) {
                        grandparent._bvh_left = new_parent;
                    }
                    else {
                        grandparent._bvh_right = new_parent;
                    }
                    break;
                }
            }
        }
    };
    BVH.prototype.remove = function (body, updating) {
        if (updating === void 0) { updating = false; }
        if (!updating) {
            var bvh = body._bvh;
            if (bvh && bvh !== this) {
                throw new Error('Body belongs to another collision system');
            }
            body._bvh = null;
            this._bodies.splice(this._bodies.indexOf(body), 1);
        }
        if (this._hierarchy === body) {
            this._hierarchy = null;
            return;
        }
        var parent = body._bvh_parent;
        var grandparent = parent._bvh_parent;
        var parent_left = parent._bvh_left;
        var sibling = parent_left === body ? parent._bvh_right : parent_left;
        sibling._bvh_parent = grandparent;
        if (sibling._bvh_branch) {
            sibling._bvh_sort = parent._bvh_sort;
        }
        if (grandparent) {
            if (grandparent._bvh_left === parent) {
                grandparent._bvh_left = sibling;
            }
            else {
                grandparent._bvh_right = sibling;
            }
            var branch = grandparent;
            while (branch) {
                var left = branch._bvh_left;
                var left_min_x = left._bvh_min_x;
                var left_min_y = left._bvh_min_y;
                var left_max_x = left._bvh_max_x;
                var left_max_y = left._bvh_max_y;
                var right = branch._bvh_right;
                var right_min_x = right._bvh_min_x;
                var right_min_y = right._bvh_min_y;
                var right_max_x = right._bvh_max_x;
                var right_max_y = right._bvh_max_y;
                branch._bvh_min_x = left_min_x < right_min_x ? left_min_x : right_min_x;
                branch._bvh_min_y = left_min_y < right_min_y ? left_min_y : right_min_y;
                branch._bvh_max_x = left_max_x > right_max_x ? left_max_x : right_max_x;
                branch._bvh_max_y = left_max_y > right_max_y ? left_max_y : right_max_y;
                branch = branch._bvh_parent;
            }
        }
        else {
            this._hierarchy = sibling;
        }
        BVHBranch.releaseBranch(parent);
    };
    BVH.prototype.update = function () {
        var bodies = this._bodies;
        var count = bodies.length;
        for (var i = 0; i < count; ++i) {
            var body = bodies[i];
            var update = false;
            if (!update && body.padding !== body._bvh_padding) {
                body._bvh_padding = body.padding;
                update = true;
            }
            if (!update) {
                var polygon = body._polygon;
                if (polygon) {
                    if (body._dirty_coords ||
                        body.x !== body._x ||
                        body.y !== body._y ||
                        body.angle !== body._angle ||
                        body.scale_x !== body._scale_x ||
                        body.scale_y !== body._scale_y) {
                        body._calculateCoords();
                    }
                }
                var x = body.x;
                var y = body.y;
                var radius = polygon ? 0 : body.radius * body.scale;
                var min_x = polygon ? body._min_x : x - radius;
                var min_y = polygon ? body._min_y : y - radius;
                var max_x = polygon ? body._max_x : x + radius;
                var max_y = polygon ? body._max_y : y + radius;
                update = min_x < body._bvh_min_x || min_y < body._bvh_min_y || max_x > body._bvh_max_x || max_y > body._bvh_max_y;
            }
            if (update) {
                this.remove(body, true);
                this.insert(body, true);
            }
        }
    };
    BVH.prototype.potentials = function (body) {
        var results = [];
        var min_x = body._bvh_min_x;
        var min_y = body._bvh_min_y;
        var max_x = body._bvh_max_x;
        var max_y = body._bvh_max_y;
        var current = this._hierarchy;
        var traverse_left = true;
        if (!current || !current._bvh_branch) {
            return results;
        }
        while (current) {
            if (traverse_left) {
                traverse_left = false;
                var left = current._bvh_branch ? current._bvh_left : null;
                while (left &&
                    left._bvh_max_x >= min_x &&
                    left._bvh_max_y >= min_y &&
                    left._bvh_min_x <= max_x &&
                    left._bvh_min_y <= max_y) {
                    current = left;
                    left = current._bvh_branch ? current._bvh_left : null;
                }
            }
            var branch = current._bvh_branch;
            var right = branch ? current._bvh_right : null;
            if (right &&
                right._bvh_max_x > min_x &&
                right._bvh_max_y > min_y &&
                right._bvh_min_x < max_x &&
                right._bvh_min_y < max_y) {
                current = right;
                traverse_left = true;
            }
            else {
                if (!branch && current !== body) {
                    results.push(current);
                }
                var parent_1 = current._bvh_parent;
                if (parent_1) {
                    while (parent_1 && parent_1._bvh_right === current) {
                        current = parent_1;
                        parent_1 = current._bvh_parent;
                    }
                    current = parent_1;
                }
                else {
                    break;
                }
            }
        }
        return results;
    };
    BVH.prototype.draw = function (context) {
        var bodies = this._bodies;
        var count = bodies.length;
        for (var i = 0; i < count; ++i) {
            bodies[i].draw(context);
        }
    };
    BVH.prototype.drawBVH = function (context) {
        var current = this._hierarchy;
        var traverse_left = true;
        while (current) {
            if (traverse_left) {
                traverse_left = false;
                var left = current._bvh_branch ? current._bvh_left : null;
                while (left) {
                    current = left;
                    left = current._bvh_branch ? current._bvh_left : null;
                }
            }
            var branch = current._bvh_branch;
            var min_x = current._bvh_min_x;
            var min_y = current._bvh_min_y;
            var max_x = current._bvh_max_x;
            var max_y = current._bvh_max_y;
            var right = branch ? current._bvh_right : null;
            context.moveTo(min_x, min_y);
            context.lineTo(max_x, min_y);
            context.lineTo(max_x, max_y);
            context.lineTo(min_x, max_y);
            context.lineTo(min_x, min_y);
            if (right) {
                current = right;
                traverse_left = true;
            }
            else {
                var parent_2 = current._bvh_parent;
                if (parent_2) {
                    while (parent_2 && parent_2._bvh_right === current) {
                        current = parent_2;
                        parent_2 = current._bvh_parent;
                    }
                    current = parent_2;
                }
                else {
                    break;
                }
            }
        }
    };
    return BVH;
}());
var branch_pool = [];
var BVHBranch = (function () {
    function BVHBranch() {
        this._bvh_parent = null;
        this._bvh_branch = true;
        this._bvh_left = null;
        this._bvh_right = null;
        this._bvh_sort = 0;
        this._bvh_min_x = 0;
        this._bvh_min_y = 0;
        this._bvh_max_x = 0;
        this._bvh_max_y = 0;
    }
    BVHBranch.getBranch = function () {
        if (branch_pool.length) {
            return branch_pool.pop();
        }
        return new BVHBranch();
    };
    BVHBranch.releaseBranch = function (branch) {
        branch_pool.push(branch);
    };
    BVHBranch.sortBranches = function (a, b) {
        return a.sort > b.sort ? -1 : 1;
    };
    return BVHBranch;
}());
var Body = (function () {
    function Body(x, y, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (padding === void 0) { padding = 0; }
        this._circle = false;
        this._polygon = false;
        this._point = false;
        this._bvh = null;
        this._bvh_parent = null;
        this._bvh_branch = false;
        this._bvh_min_x = 0;
        this._bvh_min_y = 0;
        this._bvh_max_x = 0;
        this._bvh_max_y = 0;
        this.x = x;
        this.y = y;
        this.padding = padding;
        this._bvh_padding = padding;
    }
    Body.prototype.collides = function (target, result, aabb) {
        if (result === void 0) { result = null; }
        if (aabb === void 0) { aabb = true; }
        return SAT(this, target, result, aabb);
    };
    Body.prototype.potentials = function () {
        var bvh = this._bvh;
        if (bvh === null) {
            throw new Error('Body does not belong to a collision system');
        }
        return bvh.potentials(this);
    };
    Body.prototype.remove = function () {
        var bvh = this._bvh;
        if (bvh) {
            bvh.remove(this, false);
        }
    };
    Body.prototype.createResult = function () {
        return new CollisionResult();
    };
    Body.createResult = function () {
        return new CollisionResult();
    };
    return Body;
}());
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(x, y, radius, scale, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (radius === void 0) { radius = 0; }
        if (scale === void 0) { scale = 1; }
        if (padding === void 0) { padding = 0; }
        var _this = _super.call(this, x, y, padding) || this;
        _this.radius = radius;
        _this.scale = scale;
        return _this;
    }
    Circle.prototype.draw = function (context) {
        var x = this.x;
        var y = this.y;
        var radius = this.radius * this.scale;
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, Math.PI * 2);
    };
    return Circle;
}(Body));
var CollisionResult = (function () {
    function CollisionResult() {
        this.collision = false;
        this.a = null;
        this.b = null;
        this.a_in_b = false;
        this.b_in_a = false;
        this.overlap = 0;
        this.overlap_x = 0;
        this.overlap_y = 0;
    }
    return CollisionResult;
}());
var CollisionSystem = (function () {
    function CollisionSystem() {
        this._bvh = new BVH();
    }
    CollisionSystem.prototype.createCircle = function (x, y, radius, scale, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (radius === void 0) { radius = 0; }
        if (scale === void 0) { scale = 1; }
        if (padding === void 0) { padding = 0; }
        var body = new Circle(x, y, radius, scale, padding);
        this._bvh.insert(body);
        return body;
    };
    CollisionSystem.prototype.createPolygon = function (x, y, points, angle, scale_x, scale_y, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (points === void 0) { points = [[0, 0]]; }
        if (angle === void 0) { angle = 0; }
        if (scale_x === void 0) { scale_x = 1; }
        if (scale_y === void 0) { scale_y = 1; }
        if (padding === void 0) { padding = 0; }
        var body = new Polygon(x, y, points, angle, scale_x, scale_y, padding);
        this._bvh.insert(body);
        return body;
    };
    CollisionSystem.prototype.createPoint = function (x, y, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (padding === void 0) { padding = 0; }
        var body = new Point(x, y, padding);
        this._bvh.insert(body);
        return body;
    };
    CollisionSystem.prototype.createResult = function () {
        return new CollisionResult();
    };
    CollisionSystem.createResult = function () {
        return new CollisionResult();
    };
    CollisionSystem.prototype.insert = function () {
        var bodies = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bodies[_i] = arguments[_i];
        }
        for (var _a = 0, bodies_1 = bodies; _a < bodies_1.length; _a++) {
            var body = bodies_1[_a];
            this._bvh.insert(body, false);
        }
        return this;
    };
    CollisionSystem.prototype.remove = function () {
        var bodies = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bodies[_i] = arguments[_i];
        }
        for (var _a = 0, bodies_2 = bodies; _a < bodies_2.length; _a++) {
            var body = bodies_2[_a];
            this._bvh.remove(body, false);
        }
        return this;
    };
    CollisionSystem.prototype.update = function () {
        this._bvh.update();
        return this;
    };
    CollisionSystem.prototype.draw = function (context) {
        return this._bvh.draw(context);
    };
    CollisionSystem.prototype.drawBVH = function (context) {
        return this._bvh.drawBVH(context);
    };
    CollisionSystem.prototype.potentials = function (body) {
        return this._bvh.potentials(body);
    };
    CollisionSystem.prototype.collides = function (source, target, result, aabb) {
        if (result === void 0) { result = null; }
        if (aabb === void 0) { aabb = true; }
        return SAT(source, target, result, aabb);
    };
    return CollisionSystem;
}());
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon(x, y, points, angle, scale_x, scale_y, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (points === void 0) { points = []; }
        if (angle === void 0) { angle = 0; }
        if (scale_x === void 0) { scale_x = 1; }
        if (scale_y === void 0) { scale_y = 1; }
        if (padding === void 0) { padding = 0; }
        var _this = _super.call(this, x, y, padding) || this;
        _this._min_x = 0;
        _this._min_y = 0;
        _this._max_x = 0;
        _this._max_y = 0;
        _this._points = null;
        _this._coords = null;
        _this._edges = null;
        _this._normals = null;
        _this._dirty_coords = true;
        _this._dirty_normals = true;
        _this.angle = angle;
        _this.scale_x = scale_x;
        _this.scale_y = scale_y;
        _this._polygon = true;
        _this._x = x;
        _this._y = y;
        _this._angle = angle;
        _this._scale_x = scale_x;
        _this._scale_y = scale_y;
        Polygon.prototype.setPoints.call(_this, points);
        return _this;
    }
    Polygon.prototype.draw = function (context) {
        if (this._dirty_coords ||
            this.x !== this._x ||
            this.y !== this._y ||
            this.angle !== this._angle ||
            this.scale_x !== this._scale_x ||
            this.scale_y !== this._scale_y) {
            this._calculateCoords();
        }
        var coords = this._coords;
        if (coords.length === 2) {
            context.moveTo(coords[0], coords[1]);
            context.arc(coords[0], coords[1], 1, 0, Math.PI * 2);
        }
        else {
            context.moveTo(coords[0], coords[1]);
            for (var i = 2; i < coords.length; i += 2) {
                context.lineTo(coords[i], coords[i + 1]);
            }
            if (coords.length > 4) {
                context.lineTo(coords[0], coords[1]);
            }
        }
    };
    Polygon.prototype.setPoints = function (new_points) {
        var count = new_points.length;
        this._points = new Float64Array(count * 2);
        this._coords = new Float64Array(count * 2);
        this._edges = new Float64Array(count * 2);
        this._normals = new Float64Array(count * 2);
        var points = this._points;
        for (var i = 0, ix = 0, iy = 1; i < count; ++i, ix += 2, iy += 2) {
            var new_point = new_points[i];
            points[ix] = new_point[0];
            points[iy] = new_point[1];
        }
        this._dirty_coords = true;
    };
    Polygon.prototype._calculateCoords = function () {
        var x = this.x;
        var y = this.y;
        var angle = this.angle;
        var scale_x = this.scale_x;
        var scale_y = this.scale_y;
        var points = this._points;
        var coords = this._coords;
        var count = points.length;
        var min_x;
        var max_x;
        var min_y;
        var max_y;
        for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
            var coord_x = points[ix] * scale_x;
            var coord_y = points[iy] * scale_y;
            if (angle) {
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                var tmp_x = coord_x;
                var tmp_y = coord_y;
                coord_x = tmp_x * cos - tmp_y * sin;
                coord_y = tmp_x * sin + tmp_y * cos;
            }
            coord_x += x;
            coord_y += y;
            coords[ix] = coord_x;
            coords[iy] = coord_y;
            if (ix === 0) {
                min_x = max_x = coord_x;
                min_y = max_y = coord_y;
            }
            else {
                if (coord_x < min_x) {
                    min_x = coord_x;
                }
                else if (coord_x > max_x) {
                    max_x = coord_x;
                }
                if (coord_y < min_y) {
                    min_y = coord_y;
                }
                else if (coord_y > max_y) {
                    max_y = coord_y;
                }
            }
        }
        this._x = x;
        this._y = y;
        this._angle = angle;
        this._scale_x = scale_x;
        this._scale_y = scale_y;
        this._min_x = min_x;
        this._min_y = min_y;
        this._max_x = max_x;
        this._max_y = max_y;
        this._dirty_coords = false;
        this._dirty_normals = true;
    };
    Polygon.prototype._calculateNormals = function () {
        var coords = this._coords;
        var edges = this._edges;
        var normals = this._normals;
        var count = coords.length;
        for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
            var next = ix + 2 < count ? ix + 2 : 0;
            var x = coords[next] - coords[ix];
            var y = coords[next + 1] - coords[iy];
            var length_1 = x || y ? Math.sqrt(x * x + y * y) : 0;
            edges[ix] = x;
            edges[iy] = y;
            normals[ix] = length_1 ? y / length_1 : 0;
            normals[iy] = length_1 ? -x / length_1 : 0;
        }
        this._dirty_normals = false;
    };
    return Polygon;
}(Body));
var Point = (function (_super) {
    __extends(Point, _super);
    function Point(x, y, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (padding === void 0) { padding = 0; }
        var _this = _super.call(this, x, y, [[0, 0]], 0, 1, 1, padding) || this;
        _this._point = true;
        return _this;
    }
    return Point;
}(Polygon));
Point.prototype.setPoints = undefined;
function SAT(a, b, result, aabb) {
    if (result === void 0) { result = null; }
    if (aabb === void 0) { aabb = true; }
    var a_polygon = a._polygon;
    var b_polygon = b._polygon;
    var collision = false;
    if (result) {
        result.a = a;
        result.b = b;
        result.a_in_b = true;
        result.b_in_a = true;
        result.overlap = null;
        result.overlap_x = 0;
        result.overlap_y = 0;
    }
    if (a_polygon) {
        if (a._dirty_coords ||
            a.x !== a._x ||
            a.y !== a._y ||
            a.angle !== a._angle ||
            a.scale_x !== a._scale_x ||
            a.scale_y !== a._scale_y) {
            a._calculateCoords();
        }
    }
    if (b_polygon) {
        if (b._dirty_coords ||
            b.x !== b._x ||
            b.y !== b._y ||
            b.angle !== b._angle ||
            b.scale_x !== b._scale_x ||
            b.scale_y !== b._scale_y) {
            b._calculateCoords();
        }
    }
    if (!aabb || aabbAABB(a, b)) {
        if (a_polygon && a._dirty_normals) {
            a._calculateNormals();
        }
        if (b_polygon && b._dirty_normals) {
            b._calculateNormals();
        }
        collision = (a_polygon && b_polygon ? polygonPolygon(a, b, result) :
            a_polygon ? polygonCircle(a, b, result, false) :
                b_polygon ? polygonCircle(b, a, result, true) :
                    circleCircle(a, b, result));
    }
    if (result) {
        result.collision = collision;
    }
    return collision;
}
;
function aabbAABB(a, b) {
    var a_polygon = a._polygon;
    var a_x = a_polygon ? 0 : a.x;
    var a_y = a_polygon ? 0 : a.y;
    var a_radius = a_polygon ? 0 : a.radius * a.scale;
    var a_min_x = a_polygon ? a._min_x : a_x - a_radius;
    var a_min_y = a_polygon ? a._min_y : a_y - a_radius;
    var a_max_x = a_polygon ? a._max_x : a_x + a_radius;
    var a_max_y = a_polygon ? a._max_y : a_y + a_radius;
    var b_polygon = b._polygon;
    var b_x = b_polygon ? 0 : b.x;
    var b_y = b_polygon ? 0 : b.y;
    var b_radius = b_polygon ? 0 : b.radius * b.scale;
    var b_min_x = b_polygon ? b._min_x : b_x - b_radius;
    var b_min_y = b_polygon ? b._min_y : b_y - b_radius;
    var b_max_x = b_polygon ? b._max_x : b_x + b_radius;
    var b_max_y = b_polygon ? b._max_y : b_y + b_radius;
    return a_min_x < b_max_x && a_min_y < b_max_y && a_max_x > b_min_x && a_max_y > b_min_y;
}
function polygonPolygon(a, b, result) {
    if (result === void 0) { result = null; }
    var a_count = a._coords.length;
    var b_count = b._coords.length;
    if (a_count === 2 && b_count === 2) {
        var a_coords_1 = a._coords;
        var b_coords_1 = b._coords;
        if (result) {
            result.overlap = 0;
        }
        return a_coords_1[0] === b_coords_1[0] && a_coords_1[1] === b_coords_1[1];
    }
    var a_coords = a._coords;
    var b_coords = b._coords;
    var a_normals = a._normals;
    var b_normals = b._normals;
    if (a_count > 2) {
        for (var ix = 0, iy = 1; ix < a_count; ix += 2, iy += 2) {
            if (separatingAxis(a_coords, b_coords, a_normals[ix], a_normals[iy], result)) {
                return false;
            }
        }
    }
    if (b_count > 2) {
        for (var ix = 0, iy = 1; ix < b_count; ix += 2, iy += 2) {
            if (separatingAxis(a_coords, b_coords, b_normals[ix], b_normals[iy], result)) {
                return false;
            }
        }
    }
    return true;
}
function polygonCircle(a, b, result, reverse) {
    if (result === void 0) { result = null; }
    if (reverse === void 0) { reverse = false; }
    var a_coords = a._coords;
    var a_edges = a._edges;
    var a_normals = a._normals;
    var b_x = b.x;
    var b_y = b.y;
    var b_radius = b.radius * b.scale;
    var b_radius2 = b_radius * 2;
    var radius_squared = b_radius * b_radius;
    var count = a_coords.length;
    var a_in_b = true;
    var b_in_a = true;
    var overlap = null;
    var overlap_x = 0;
    var overlap_y = 0;
    if (count === 2) {
        var coord_x = b_x - a_coords[0];
        var coord_y = b_y - a_coords[1];
        var length_squared = coord_x * coord_x + coord_y * coord_y;
        if (length_squared > radius_squared) {
            return false;
        }
        if (result) {
            var length_2 = Math.sqrt(length_squared);
            overlap = b_radius - length_2;
            overlap_x = coord_x / length_2;
            overlap_y = coord_y / length_2;
            b_in_a = false;
        }
    }
    else {
        for (var ix = 0, iy = 1; ix < count; ix += 2, iy += 2) {
            var coord_x = b_x - a_coords[ix];
            var coord_y = b_y - a_coords[iy];
            var edge_x = a_edges[ix];
            var edge_y = a_edges[iy];
            var dot = coord_x * edge_x + coord_y * edge_y;
            var region = dot < 0 ? -1 : dot > edge_x * edge_x + edge_y * edge_y ? 1 : 0;
            var tmp_overlapping = false;
            var tmp_overlap = 0;
            var tmp_overlap_x = 0;
            var tmp_overlap_y = 0;
            if (result && a_in_b && coord_x * coord_x + coord_y * coord_y > radius_squared) {
                a_in_b = false;
            }
            if (region) {
                var left = region === -1;
                var other_x = left ? (ix === 0 ? count - 2 : ix - 2) : (ix === count - 2 ? 0 : ix + 2);
                var other_y = other_x + 1;
                var coord2_x = b_x - a_coords[other_x];
                var coord2_y = b_y - a_coords[other_y];
                var edge2_x = a_edges[other_x];
                var edge2_y = a_edges[other_y];
                var dot2 = coord2_x * edge2_x + coord2_y * edge2_y;
                var region2 = dot2 < 0 ? -1 : dot2 > edge2_x * edge2_x + edge2_y * edge2_y ? 1 : 0;
                if (region2 === -region) {
                    var target_x = left ? coord_x : coord2_x;
                    var target_y = left ? coord_y : coord2_y;
                    var length_squared = target_x * target_x + target_y * target_y;
                    if (length_squared > radius_squared) {
                        return false;
                    }
                    if (result) {
                        var length_3 = Math.sqrt(length_squared);
                        tmp_overlapping = true;
                        tmp_overlap = b_radius - length_3;
                        tmp_overlap_x = target_x / length_3;
                        tmp_overlap_y = target_y / length_3;
                        b_in_a = false;
                    }
                }
            }
            else {
                var normal_x = a_normals[ix];
                var normal_y = a_normals[iy];
                var length_4 = coord_x * normal_x + coord_y * normal_y;
                var absolute_length = length_4 < 0 ? -length_4 : length_4;
                if (length_4 > 0 && absolute_length > b_radius) {
                    return false;
                }
                if (result) {
                    tmp_overlapping = true;
                    tmp_overlap = b_radius - length_4;
                    tmp_overlap_x = normal_x;
                    tmp_overlap_y = normal_y;
                    if (b_in_a && length_4 >= 0 || tmp_overlap < b_radius2) {
                        b_in_a = false;
                    }
                }
            }
            if (tmp_overlapping && (overlap === null || overlap > tmp_overlap)) {
                overlap = tmp_overlap;
                overlap_x = tmp_overlap_x;
                overlap_y = tmp_overlap_y;
            }
        }
    }
    if (result) {
        result.a_in_b = reverse ? b_in_a : a_in_b;
        result.b_in_a = reverse ? a_in_b : b_in_a;
        result.overlap = overlap;
        result.overlap_x = reverse ? -overlap_x : overlap_x;
        result.overlap_y = reverse ? -overlap_y : overlap_y;
    }
    return true;
}
function circleCircle(a, b, result) {
    if (result === void 0) { result = null; }
    var a_radius = a.radius * a.scale;
    var b_radius = b.radius * b.scale;
    var difference_x = b.x - a.x;
    var difference_y = b.y - a.y;
    var radius_sum = a_radius + b_radius;
    var length_squared = difference_x * difference_x + difference_y * difference_y;
    if (length_squared > radius_sum * radius_sum) {
        return false;
    }
    if (result) {
        var length_5 = Math.sqrt(length_squared);
        result.a_in_b = a_radius <= b_radius && length_5 <= b_radius - a_radius;
        result.b_in_a = b_radius <= a_radius && length_5 <= a_radius - b_radius;
        result.overlap = radius_sum - length_5;
        result.overlap_x = difference_x / length_5;
        result.overlap_y = difference_y / length_5;
    }
    return true;
}
function separatingAxis(a_coords, b_coords, x, y, result) {
    if (result === void 0) { result = null; }
    var a_count = a_coords.length;
    var b_count = b_coords.length;
    if (!a_count || !b_count) {
        return true;
    }
    var a_start = null;
    var a_end = null;
    var b_start = null;
    var b_end = null;
    for (var ix = 0, iy = 1; ix < a_count; ix += 2, iy += 2) {
        var dot = a_coords[ix] * x + a_coords[iy] * y;
        if (a_start === null || a_start > dot) {
            a_start = dot;
        }
        if (a_end === null || a_end < dot) {
            a_end = dot;
        }
    }
    for (var ix = 0, iy = 1; ix < b_count; ix += 2, iy += 2) {
        var dot = b_coords[ix] * x + b_coords[iy] * y;
        if (b_start === null || b_start > dot) {
            b_start = dot;
        }
        if (b_end === null || b_end < dot) {
            b_end = dot;
        }
    }
    if (a_start > b_end || a_end < b_start) {
        return true;
    }
    if (result) {
        var overlap = 0;
        if (a_start < b_start) {
            result.a_in_b = false;
            if (a_end < b_end) {
                overlap = a_end - b_start;
                result.b_in_a = false;
            }
            else {
                var option1 = a_end - b_start;
                var option2 = b_end - a_start;
                overlap = option1 < option2 ? option1 : -option2;
            }
        }
        else {
            result.b_in_a = false;
            if (a_end > b_end) {
                overlap = a_start - b_end;
                result.a_in_b = false;
            }
            else {
                var option1 = a_end - b_start;
                var option2 = b_end - a_start;
                overlap = option1 < option2 ? option1 : -option2;
            }
        }
        var current_overlap = result.overlap;
        var absolute_overlap = overlap < 0 ? -overlap : overlap;
        if (current_overlap === null || current_overlap > absolute_overlap) {
            var sign = overlap < 0 ? -1 : 1;
            result.overlap = absolute_overlap;
            result.overlap_x = x * sign;
            result.overlap_y = y * sign;
        }
    }
    return false;
}
var Keyboard = (function () {
    function Keyboard() {
        var _this = this;
        this.keys = {};
        this.keyboardMap = [
            "",
            "",
            "",
            "CANCEL",
            "",
            "",
            "HELP",
            "",
            "BACK_SPACE",
            "TAB",
            "",
            "",
            "CLEAR",
            "ENTER",
            "ENTER_SPECIAL",
            "",
            "SHIFT",
            "CONTROL",
            "ALT",
            "PAUSE",
            "CAPS_LOCK",
            "KANA",
            "EISU",
            "JUNJA",
            "FINAL",
            "HANJA",
            "",
            "ESCAPE",
            "CONVERT",
            "NONCONVERT",
            "ACCEPT",
            "MODECHANGE",
            "SPACE",
            "PAGE_UP",
            "PAGE_DOWN",
            "END",
            "HOME",
            "LEFT",
            "UP",
            "RIGHT",
            "DOWN",
            "SELECT",
            "PRINT",
            "EXECUTE",
            "PRINTSCREEN",
            "INSERT",
            "DELETE",
            "",
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "COLON",
            "SEMICOLON",
            "LESS_THAN",
            "EQUALS",
            "GREATER_THAN",
            "QUESTION_MARK",
            "AT",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
            "OS_KEY",
            "",
            "CONTEXT_MENU",
            "",
            "SLEEP",
            "NUMPAD0",
            "NUMPAD1",
            "NUMPAD2",
            "NUMPAD3",
            "NUMPAD4",
            "NUMPAD5",
            "NUMPAD6",
            "NUMPAD7",
            "NUMPAD8",
            "NUMPAD9",
            "MULTIPLY",
            "ADD",
            "SEPARATOR",
            "SUBTRACT",
            "DECIMAL",
            "DIVIDE",
            "F1",
            "F2",
            "F3",
            "F4",
            "F5",
            "F6",
            "F7",
            "F8",
            "F9",
            "F10",
            "F11",
            "F12",
            "F13",
            "F14",
            "F15",
            "F16",
            "F17",
            "F18",
            "F19",
            "F20",
            "F21",
            "F22",
            "F23",
            "F24",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "NUM_LOCK",
            "SCROLL_LOCK",
            "WIN_OEM_FJ_JISHO",
            "WIN_OEM_FJ_MASSHOU",
            "WIN_OEM_FJ_TOUROKU",
            "WIN_OEM_FJ_LOYA",
            "WIN_OEM_FJ_ROYA",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "CIRCUMFLEX",
            "EXCLAMATION",
            "DOUBLE_QUOTE",
            "HASH",
            "DOLLAR",
            "PERCENT",
            "AMPERSAND",
            "UNDERSCORE",
            "OPEN_PAREN",
            "CLOSE_PAREN",
            "ASTERISK",
            "PLUS",
            "PIPE",
            "HYPHEN_MINUS",
            "OPEN_CURLY_BRACKET",
            "CLOSE_CURLY_BRACKET",
            "TILDE",
            "",
            "",
            "",
            "",
            "VOLUME_MUTE",
            "VOLUME_DOWN",
            "VOLUME_UP",
            "",
            "",
            "SEMICOLON",
            "EQUALS",
            "COMMA",
            "MINUS",
            "PERIOD",
            "SLASH",
            "BACK_QUOTE",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "OPEN_BRACKET",
            "BACK_SLASH",
            "CLOSE_BRACKET",
            "QUOTE",
            "",
            "META",
            "ALTGR",
            "",
            "WIN_ICO_HELP",
            "WIN_ICO_00",
            "",
            "WIN_ICO_CLEAR",
            "",
            "",
            "WIN_OEM_RESET",
            "WIN_OEM_JUMP",
            "WIN_OEM_PA1",
            "WIN_OEM_PA2",
            "WIN_OEM_PA3",
            "WIN_OEM_WSCTRL",
            "WIN_OEM_CUSEL",
            "WIN_OEM_ATTN",
            "WIN_OEM_FINISH",
            "WIN_OEM_COPY",
            "WIN_OEM_AUTO",
            "WIN_OEM_ENLW",
            "WIN_OEM_BACKTAB",
            "ATTN",
            "CRSEL",
            "EXSEL",
            "EREOF",
            "PLAY",
            "ZOOM",
            "",
            "PA1",
            "WIN_OEM_CLEAR",
            ""
        ];
        document.addEventListener('keydown', function (event) {
            var char = _this.keyboardMap[event.keyCode];
            _this.keys[char] = true;
        });
        document.addEventListener('keyup', function (event) {
            var char = _this.keyboardMap[event.keyCode];
            delete _this.keys[char];
        });
    }
    Keyboard.prototype.keyPressed = function (char) {
        return this.keys[char.toUpperCase()] !== undefined;
    };
    Keyboard.prototype.keyDown = function (char, callback) {
        var _this = this;
        document.addEventListener('keydown', function (event) {
            var pressedChar = _this.keyboardMap[event.keyCode];
            if (char.toUpperCase() == pressedChar) {
                callback(event);
            }
        });
    };
    Keyboard.prototype.keyUp = function (char, callback) {
        var _this = this;
        document.addEventListener('keyup', function (event) {
            var pressedChar = _this.keyboardMap[event.keyCode];
            if (char.toUpperCase() == pressedChar) {
                callback(event);
            }
        });
    };
    return Keyboard;
}());
var Mouse = (function () {
    function Mouse() {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.isDown = false;
        document.addEventListener('mousedown', function () {
            _this.isDown = true;
        });
        document.addEventListener('mouseup', function () {
            _this.isDown = false;
        });
        document.addEventListener('mousemove', function (e) {
            _this.x = e.clientX;
            _this.y = e.clientY;
        });
        this.point = new Point(this.x, this.y);
    }
    Mouse.prototype.getPoint = function () {
        this.point.x = this.x;
        this.point.y = this.y;
        return this.point;
    };
    return Mouse;
}());
var Registry = (function () {
    function Registry() {
        this.data = {};
    }
    Registry.getInstance = function () {
        if (!this.instance) {
            this.instance = new Registry();
        }
        return this.instance;
    };
    Registry.prototype.set = function (name, value) {
        this.data[name] = value;
    };
    Registry.prototype.has = function (name) {
        return this.data[name] !== undefined;
    };
    Registry.prototype.get = function (name) {
        return this.data[name];
    };
    return Registry;
}());
var Styles = (function () {
    function Styles(canvas, width, height) {
        var _this = this;
        this.canvas = canvas;
        this.setEnvironmentStyles();
        this.setCanvasSize(width, height);
        window.addEventListener('resize', function () {
            _this.setCanvasSize(width, height);
        });
    }
    Styles.prototype.setEnvironmentStyles = function () {
        document.body.style.margin = '0';
        document.body.style.height = '100' + 'vh';
        document.body.style.padding = '0';
        document.body.style.overflow = 'hidden';
    };
    Styles.prototype.setCanvasSize = function (width, height) {
        this.canvas.width = width ? width : document.body.clientWidth;
        this.canvas.height = height ? height : document.body.clientHeight;
    };
    return Styles;
}());
//# sourceMappingURL=scrub.js.map