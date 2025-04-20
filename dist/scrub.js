var Camera = (function () {
    function Camera(stage) {
        this._direction = 0;
        this._zoom = 1;
        this.stage = stage;
        this._x = this.stage.width / 2;
        this._y = this.stage.height / 2;
        this.updateRenderRadius();
        this.changes = new CameraChanges();
    }
    Object.defineProperty(Camera.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (value) {
            var direction = value % 360;
            direction = direction < 0 ? direction + 360 : direction;
            this.changes.direction = direction - this._direction;
            this._direction = direction;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "angleDirection", {
        get: function () {
            return this._direction * Math.PI / 180;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "width", {
        get: function () {
            return this.stage.width / this._zoom;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "height", {
        get: function () {
            return this.stage.height / this._zoom;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this.changes.x = value - this._x;
            this._x = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this.changes.y = value - this._y;
            this._y = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "startCornerX", {
        get: function () {
            return this._x - this.stage.width / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "startCornerY", {
        get: function () {
            return this._y - this.stage.height / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "renderRadius", {
        get: function () {
            return this._renderRadius;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Camera.prototype, "zoom", {
        get: function () {
            return this._zoom;
        },
        set: function (value) {
            var newZoom = value < 0.1 ? 0.1 : value;
            this.changes.zoom = newZoom / this._zoom;
            this._zoom = newZoom;
            this.updateRenderRadius();
        },
        enumerable: false,
        configurable: true
    });
    Camera.prototype.updateRenderRadius = function () {
        this._renderRadius = Math.hypot(this.width, this.height) / 2;
    };
    return Camera;
}());
var CameraChanges = (function () {
    function CameraChanges() {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.direction = 0;
    }
    CameraChanges.prototype.reset = function () {
        this.x = 0;
        this.y = 0;
        this.zoom = 1;
        this.direction = 0;
    };
    return CameraChanges;
}());
var Costume = (function () {
    function Costume() {
        this.ready = false;
    }
    Object.defineProperty(Costume.prototype, "width", {
        get: function () {
            if (this.image instanceof HTMLCanvasElement) {
                return this.image.width;
            }
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Costume.prototype, "height", {
        get: function () {
            if (this.image instanceof HTMLCanvasElement) {
                return this.image.height;
            }
            return 0;
        },
        enumerable: false,
        configurable: true
    });
    return Costume;
}());
var EventEmitter = (function () {
    function EventEmitter() {
        this.callbacksMap = new Map();
        this.eventTarget = new EventTarget();
    }
    EventEmitter.prototype.once = function (name, type, callback) {
        var _this = this;
        if (this.callbacksMap.get(name)) {
            return false;
        }
        var wrapper = function (event) {
            if (typeof callback === 'function') {
                callback(event);
            }
            else {
                callback.handleEvent(event);
            }
            _this.eventTarget.removeEventListener(type, wrapper);
            _this.remove(name);
        };
        this.eventTarget.addEventListener(type, wrapper);
        this.callbacksMap.set(name, { type: type, callback: wrapper });
        return true;
    };
    EventEmitter.prototype.on = function (name, type, callback) {
        if (this.callbacksMap.get(name)) {
            return false;
        }
        this.eventTarget.addEventListener(type, callback);
        this.callbacksMap.set(name, { type: type, callback: callback });
        return true;
    };
    EventEmitter.prototype.emit = function (type, detail) {
        this.eventTarget.dispatchEvent(new CustomEvent(type, { detail: detail }));
    };
    EventEmitter.prototype.remove = function (name) {
        var item = this.callbacksMap.get(name);
        if (!item) {
            return false;
        }
        this.eventTarget.removeEventListener(item.type, item.callback);
        this.callbacksMap.delete(name);
        return true;
    };
    EventEmitter.prototype.removeByType = function (type) {
        var _this = this;
        this.callbacksMap.forEach(function (item, itemName) {
            if (type === item.type) {
                _this.eventTarget.removeEventListener(item.type, item.callback);
                _this.callbacksMap.delete(itemName);
            }
        });
    };
    EventEmitter.prototype.clearAll = function () {
        var _this = this;
        this.callbacksMap.forEach(function (item) {
            _this.eventTarget.removeEventListener(item.type, item.callback);
        });
        this.callbacksMap.clear();
    };
    return EventEmitter;
}());
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var Game = (function () {
    function Game(width, height, canvasId, displayErrors, locale) {
        if (width === void 0) { width = null; }
        if (height === void 0) { height = null; }
        if (canvasId === void 0) { canvasId = null; }
        if (displayErrors === void 0) { displayErrors = true; }
        if (locale === void 0) { locale = 'ru'; }
        this.debugMode = 'none';
        this.debugCollider = false;
        this.debugColor = 'red';
        this.stages = [];
        this.activeStage = null;
        this.styles = null;
        this.loadedStages = 0;
        this.onReadyCallbacks = [];
        this.onUserInteractedCallbacks = [];
        this.onReadyPending = true;
        this.running = false;
        this.pendingRun = false;
        this.reportedError = false;
        this._displayErrors = true;
        this._locale = 'ru';
        this._userInteracted = false;
        this._displayErrors = displayErrors;
        this._locale = locale;
        this.validatorFactory = new ValidatorFactory(this);
        var game = this;
        if (this.displayErrors) {
            game = this.validatorFactory.createValidator(this, 'Game');
        }
        window.onerror = function () {
            game.reportError(ErrorMessages.getMessage(ErrorMessages.SCRIPT_ERROR, game._locale));
        };
        game.id = Symbol();
        game.eventEmitter = new EventEmitter();
        game.keyboard = new Keyboard();
        if (canvasId) {
            var element = document.getElementById(canvasId);
            if (element instanceof HTMLCanvasElement) {
                game.canvas = element;
            }
        }
        else {
            game.canvas = document.createElement('canvas');
            document.body.appendChild(game.canvas);
        }
        game.canvas.width = width;
        game.canvas.height = height;
        game.styles = new Styles(game.canvas, width, height);
        game.mouse = new Mouse(game);
        game.context = game.canvas.getContext('2d');
        Registry.getInstance().set('game', game);
        game.addListeners();
        return game;
    }
    Game.prototype.addStage = function (stage) {
        this.stages.push(stage);
        return this;
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
        var e_1, _a;
        if (stage === void 0) { stage = null; }
        if (!stage && this.stages.length) {
            stage = this.stages[0];
        }
        if (!stage) {
            this.throwError(ErrorMessages.NEED_STAGE_BEFORE_RUN_GAME);
        }
        if (!this.running) {
            try {
                for (var _b = __values(this.stages), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var inStage = _c.value;
                    inStage.ready();
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (this.activeStage && this.activeStage.running) {
            this.activeStage.stop();
        }
        this.running = false;
        this.pendingRun = true;
        this.activeStage = stage;
        this.tryDoRun();
    };
    Game.prototype.isReady = function () {
        return this.loadedStages == this.stages.length;
    };
    Game.prototype.onReady = function (callback) {
        this.onReadyCallbacks.push(callback);
    };
    Game.prototype.onUserInteracted = function (callback) {
        this.onUserInteractedCallbacks.push(callback);
    };
    Game.prototype.stop = function () {
        if (this.activeStage && this.activeStage.running) {
            this.activeStage.stop();
        }
        this.running = false;
    };
    Object.defineProperty(Game.prototype, "displayErrors", {
        get: function () {
            return this._displayErrors;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "locale", {
        get: function () {
            return this._locale;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "width", {
        get: function () {
            return this.canvas.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "height", {
        get: function () {
            return this.canvas.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Game.prototype, "userInteracted", {
        get: function () {
            return this._userInteracted;
        },
        enumerable: false,
        configurable: true
    });
    Game.prototype.isInsideGame = function (x, y) {
        return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
    };
    Game.prototype.correctMouseX = function (mouseX) {
        return mouseX - this.styles.canvasRect.left;
    };
    Game.prototype.correctMouseY = function (mouseY) {
        return mouseY - this.styles.canvasRect.top;
    };
    Game.prototype.keyPressed = function (char) {
        var e_2, _a;
        if (Array.isArray(char)) {
            try {
                for (var char_1 = __values(char), char_1_1 = char_1.next(); !char_1_1.done; char_1_1 = char_1.next()) {
                    var oneChar = char_1_1.value;
                    var pressed = this.keyboard.keyPressed(oneChar);
                    if (pressed) {
                        return true;
                    }
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (char_1_1 && !char_1_1.done && (_a = char_1.return)) _a.call(char_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
            return false;
        }
        return this.keyboard.keyPressed(char);
    };
    Game.prototype.keyDown = function (char, callback) {
        this.keyboard.keyDown(char, callback);
    };
    Game.prototype.keyUp = function (char, callback) {
        this.keyboard.keyUp(char, callback);
    };
    Game.prototype.mouseDown = function () {
        return this.mouse.isMouseDown(this.activeStage);
    };
    Game.prototype.mouseDownOnce = function () {
        var isMouseDown = this.mouse.isMouseDown(this.activeStage);
        this.mouse.clearMouseDown();
        return isMouseDown;
    };
    Game.prototype.getMousePoint = function () {
        return this.mouse.getPoint();
    };
    Game.prototype.getRandom = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    Game.prototype.throwError = function (messageId, variables, reportError) {
        if (variables === void 0) { variables = null; }
        if (reportError === void 0) { reportError = true; }
        var message = ErrorMessages.getMessage(messageId, this.locale, variables);
        this.throwErrorRaw(message, reportError);
    };
    Game.prototype.throwErrorRaw = function (message, reportError) {
        if (reportError === void 0) { reportError = true; }
        if (reportError) {
            this.reportError(message);
        }
        throw new Error(message);
    };
    Game.prototype.reportError = function (message) {
        if (this._displayErrors && !this.reportedError) {
            alert(message);
            this.reportedError = true;
        }
    };
    Game.prototype.addListeners = function () {
        var _this = this;
        this.eventEmitter.on(Game.STAGE_READY_EVENT, Game.STAGE_READY_EVENT, function (event) {
            _this.loadedStages++;
            _this.tryDoOnReady();
        });
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {
                if (_this.activeStage && _this.activeStage.running) {
                    _this.activeStage.stop();
                }
            }
            else {
                if (_this.activeStage && _this.activeStage.stopped) {
                    _this.activeStage.run();
                }
            }
        });
        this.userInteractionPromise = new Promise(function (resolve) {
            document.addEventListener('click', resolve, { once: true });
            document.addEventListener('keydown', function (event) {
                var excludedKeys = ['Control', 'Shift', 'CapsLock', 'NumLock', 'Alt', 'Meta'];
                if (!excludedKeys.includes(event.key)) {
                    resolve(true);
                }
            }, { once: true });
        });
    };
    Game.prototype.tryDoOnReady = function () {
        var e_3, _a;
        var _this = this;
        if (this.isReady() && this.onReadyPending) {
            this.onReadyPending = false;
            if (this.onReadyCallbacks.length) {
                try {
                    for (var _b = __values(this.onReadyCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var callback = _c.value;
                        callback();
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                this.onReadyCallbacks = [];
            }
            this.userInteractionPromise.then(function () {
                _this._userInteracted = true;
                _this.onUserInteractedCallbacks.filter(function (callback) {
                    callback(_this);
                    return false;
                });
            });
            this.tryDoRun();
        }
    };
    Game.prototype.tryDoRun = function () {
        if (this.pendingRun && !this.running && this.isReady()) {
            this.running = true;
            this.pendingRun = false;
            this.activeStage.run();
        }
    };
    Game.STAGE_READY_EVENT = 'scrubjs.stage.ready';
    Game.STAGE_BACKGROUND_READY_EVENT = 'scrubjs.stage.background_ready';
    Game.SPRITE_READY_EVENT = 'scrubjs.sprite.ready';
    return Game;
}());
var KeyboardMap = (function () {
    function KeyboardMap() {
    }
    KeyboardMap.getChar = function (keyCode) {
        return KeyboardMap.map[keyCode];
    };
    KeyboardMap.map = [
        '',
        '',
        '',
        'CANCEL',
        '',
        '',
        'HELP',
        '',
        'BACK_SPACE',
        'TAB',
        '',
        '',
        'CLEAR',
        'ENTER',
        'ENTER_SPECIAL',
        '',
        'SHIFT',
        'CONTROL',
        'ALT',
        'PAUSE',
        'CAPS_LOCK',
        'KANA',
        'EISU',
        'JUNJA',
        'FINAL',
        'HANJA',
        '',
        'ESCAPE',
        'CONVERT',
        'NONCONVERT',
        'ACCEPT',
        'MODECHANGE',
        'SPACE',
        'PAGE_UP',
        'PAGE_DOWN',
        'END',
        'HOME',
        'LEFT',
        'UP',
        'RIGHT',
        'DOWN',
        'SELECT',
        'PRINT',
        'EXECUTE',
        'PRINTSCREEN',
        'INSERT',
        'DELETE',
        '',
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'COLON',
        'SEMICOLON',
        'LESS_THAN',
        'EQUALS',
        'GREATER_THAN',
        'QUESTION_MARK',
        'AT',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        'OS_KEY',
        '',
        'CONTEXT_MENU',
        '',
        'SLEEP',
        'NUMPAD0',
        'NUMPAD1',
        'NUMPAD2',
        'NUMPAD3',
        'NUMPAD4',
        'NUMPAD5',
        'NUMPAD6',
        'NUMPAD7',
        'NUMPAD8',
        'NUMPAD9',
        'MULTIPLY',
        'ADD',
        'SEPARATOR',
        'SUBTRACT',
        'DECIMAL',
        'DIVIDE',
        'F1',
        'F2',
        'F3',
        'F4',
        'F5',
        'F6',
        'F7',
        'F8',
        'F9',
        'F10',
        'F11',
        'F12',
        'F13',
        'F14',
        'F15',
        'F16',
        'F17',
        'F18',
        'F19',
        'F20',
        'F21',
        'F22',
        'F23',
        'F24',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'NUM_LOCK',
        'SCROLL_LOCK',
        'WIN_OEM_FJ_JISHO',
        'WIN_OEM_FJ_MASSHOU',
        'WIN_OEM_FJ_TOUROKU',
        'WIN_OEM_FJ_LOYA',
        'WIN_OEM_FJ_ROYA',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'CIRCUMFLEX',
        'EXCLAMATION',
        'DOUBLE_QUOTE',
        'HASH',
        'DOLLAR',
        'PERCENT',
        'AMPERSAND',
        'UNDERSCORE',
        'OPEN_PAREN',
        'CLOSE_PAREN',
        'ASTERISK',
        'PLUS',
        'PIPE',
        'HYPHEN_MINUS',
        'OPEN_CURLY_BRACKET',
        'CLOSE_CURLY_BRACKET',
        'TILDE',
        '',
        '',
        '',
        '',
        'VOLUME_MUTE',
        'VOLUME_DOWN',
        'VOLUME_UP',
        '',
        '',
        'SEMICOLON',
        'EQUALS',
        'COMMA',
        'MINUS',
        'PERIOD',
        'SLASH',
        'BACK_QUOTE',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        'OPEN_BRACKET',
        'BACK_SLASH',
        'CLOSE_BRACKET',
        'QUOTE',
        '',
        'META',
        'ALTGR',
        '',
        'WIN_ICO_HELP',
        'WIN_ICO_00',
        '',
        'WIN_ICO_CLEAR',
        '',
        '',
        'WIN_OEM_RESET',
        'WIN_OEM_JUMP',
        'WIN_OEM_PA1',
        'WIN_OEM_PA2',
        'WIN_OEM_PA3',
        'WIN_OEM_WSCTRL',
        'WIN_OEM_CUSEL',
        'WIN_OEM_ATTN',
        'WIN_OEM_FINISH',
        'WIN_OEM_COPY',
        'WIN_OEM_AUTO',
        'WIN_OEM_ENLW',
        'WIN_OEM_BACKTAB',
        'ATTN',
        'CRSEL',
        'EXSEL',
        'EREOF',
        'PLAY',
        'ZOOM',
        '',
        'PA1',
        'WIN_OEM_CLEAR',
        ''
    ];
    return KeyboardMap;
}());
var MultiplayerControl = (function () {
    function MultiplayerControl(player, game, connection, isMe) {
        var _this = this;
        this.trackedKeys = [];
        this.receiveDataConnections = [];
        this.userKeydownCallbacks = new Map();
        this.systemLockedChars = {};
        this.userLockedChars = {};
        this.systemMouseLocked = false;
        this.userMouseLocked = false;
        this.game = game;
        this.connection = connection;
        if (isMe) {
            this.defineListeners();
        }
        var keydownConnection = connection.connect(JetcodeSocket.RECEIVE_DATA, function (dataJson, parameters) {
            var data = JSON.parse(dataJson);
            var char = data['char'];
            if (!parameters.SendTime || parameters.Keydown != 'true' || parameters.MemberId != player.id || !_this.trackedKeys.includes(char)) {
                return;
            }
            if (_this.userKeydownCallbacks.has(char)) {
                var callback_1 = _this.userKeydownCallbacks.get(char)[0];
                var block_1 = function (isBlock, chars, mouse) {
                    var e_4, _a;
                    if (chars === void 0) { chars = [char]; }
                    if (mouse === void 0) { mouse = false; }
                    if (mouse) {
                        _this.userMouseLocked = isBlock;
                    }
                    try {
                        for (var chars_1 = __values(chars), chars_1_1 = chars_1.next(); !chars_1_1.done; chars_1_1 = chars_1.next()) {
                            var char_2 = chars_1_1.value;
                            _this.userLockedChars[char_2.toUpperCase()] = isBlock;
                        }
                    }
                    catch (e_4_1) { e_4 = { error: e_4_1 }; }
                    finally {
                        try {
                            if (chars_1_1 && !chars_1_1.done && (_a = chars_1.return)) _a.call(chars_1);
                        }
                        finally { if (e_4) throw e_4.error; }
                    }
                };
                var attempts_1 = 0;
                var handler_1 = function () {
                    if (_this.userLockedChars[char] !== true || attempts_1 > 999) {
                        var syncData = data['sync'];
                        if (syncData) {
                            game.syncObjects(syncData, _this.game.calcDeltaTime(parameters.SendTime));
                        }
                        callback_1(player, block_1);
                    }
                    else {
                        attempts_1++;
                        setTimeout(handler_1, 50);
                    }
                };
                handler_1();
            }
            _this.systemLockedChars[char] = false;
        });
        this.receiveDataConnections.push(keydownConnection);
        var mousedownConnection = connection.connect(JetcodeSocket.RECEIVE_DATA, function (dataJson, parameters) {
            if (!parameters.SendTime || parameters.Mousedown != 'true' || parameters.MemberId != player.id) {
                return;
            }
            if (_this.userMousedownCallback) {
                var callback_2 = _this.userMousedownCallback[0];
                var data = JSON.parse(dataJson);
                var mouseX_1 = data['mouseX'];
                var mouseY_1 = data['mouseY'];
                var syncData_1 = data['sync'];
                var block_2 = function (isBlock, chars, mouse) {
                    var e_5, _a;
                    if (chars === void 0) { chars = []; }
                    if (mouse === void 0) { mouse = true; }
                    if (mouse) {
                        _this.userMouseLocked = isBlock;
                    }
                    try {
                        for (var chars_2 = __values(chars), chars_2_1 = chars_2.next(); !chars_2_1.done; chars_2_1 = chars_2.next()) {
                            var char = chars_2_1.value;
                            _this.userLockedChars[char.toUpperCase()] = isBlock;
                        }
                    }
                    catch (e_5_1) { e_5 = { error: e_5_1 }; }
                    finally {
                        try {
                            if (chars_2_1 && !chars_2_1.done && (_a = chars_2.return)) _a.call(chars_2);
                        }
                        finally { if (e_5) throw e_5.error; }
                    }
                };
                var attempts_2 = 0;
                var handler_2 = function () {
                    if (_this.userMouseLocked !== true || attempts_2 > 999) {
                        if (syncData_1) {
                            game.syncObjects(syncData_1, _this.game.calcDeltaTime(parameters.SendTime));
                        }
                        var mousePoint = new PointCollider(mouseX_1, mouseY_1);
                        callback_2(mousePoint, player, block_2);
                    }
                    else {
                        attempts_2++;
                        setTimeout(handler_2, 50);
                    }
                };
                handler_2();
            }
            _this.systemMouseLocked = false;
        });
        this.receiveDataConnections.push(mousedownConnection);
    }
    MultiplayerControl.prototype.defineListeners = function () {
        var _this = this;
        this.keydownCallback = function (event) {
            var char = KeyboardMap.getChar(event.keyCode);
            if (!_this.userKeydownCallbacks.has(char) ||
                _this.systemLockedChars[char] === true ||
                _this.userLockedChars[char] === true ||
                !_this.trackedKeys.includes(char)) {
                return;
            }
            _this.systemLockedChars[char] = true;
            var syncPackName = _this.userKeydownCallbacks.get(char)[1];
            var syncData = _this.userKeydownCallbacks.get(char)[2];
            var syncDataPacked = _this.game.packSyncData(syncPackName, syncData);
            _this.connection.sendData(JSON.stringify({
                'char': char,
                'sync': syncDataPacked
            }), {
                Keydown: 'true'
            });
        };
        this.mousedownCallback = function (event) {
            if (!_this.userMousedownCallback || _this.systemMouseLocked || _this.userMouseLocked) {
                return;
            }
            var mouseX = _this.game.correctMouseX(event.clientX);
            var mouseY = _this.game.correctMouseY(event.clientY);
            if (!_this.game.isInsideGame(mouseX, mouseY)) {
                return;
            }
            _this.systemMouseLocked = true;
            var syncPackName = _this.userMousedownCallback[1];
            var syncData = _this.userMousedownCallback[2];
            var syncDataPacked = _this.game.packSyncData(syncPackName, syncData);
            _this.connection.sendData(JSON.stringify({
                'mouseX': mouseX,
                'mouseY': mouseY,
                'sync': syncDataPacked
            }), {
                Mousedown: 'true'
            });
        };
        document.addEventListener('keydown', this.keydownCallback);
        document.addEventListener('mousedown', this.mousedownCallback);
    };
    MultiplayerControl.prototype.stop = function () {
        var e_6, _a;
        if (this.keydownCallback) {
            document.removeEventListener('keydown', this.keydownCallback);
        }
        try {
            for (var _b = __values(this.receiveDataConnections), _c = _b.next(); !_c.done; _c = _b.next()) {
                var connection = _c.value;
                this.connection.disconnect(JetcodeSocket.RECEIVE_DATA, connection);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_6) throw e_6.error; }
        }
    };
    MultiplayerControl.prototype.keyDown = function (char, callback, syncPackName, syncData) {
        if (syncData === void 0) { syncData = []; }
        char = char.toUpperCase();
        if (!this.trackedKeys.includes(char)) {
            this.trackedKeys.push(char);
        }
        this.userKeydownCallbacks.set(char, [callback, syncPackName, syncData]);
    };
    MultiplayerControl.prototype.removeKeyDownHandler = function (char) {
        char = char.toUpperCase();
        this.userKeydownCallbacks.delete(char);
    };
    MultiplayerControl.prototype.mouseDown = function (callback, syncPackName, syncData) {
        if (syncData === void 0) { syncData = []; }
        this.userMousedownCallback = [callback, syncPackName, syncData];
    };
    MultiplayerControl.prototype.removeMouseDownHandler = function () {
        this.userMousedownCallback = null;
    };
    return MultiplayerControl;
}());
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Sprite = (function () {
    function Sprite(stage, layer, costumePaths) {
        var e_7, _a;
        if (layer === void 0) { layer = 0; }
        if (costumePaths === void 0) { costumePaths = []; }
        this.name = 'No name';
        this.game = null;
        this.stage = null;
        this._parentSprite = null;
        this._collidedSprite = null;
        this._original = null;
        this.costumeIndex = null;
        this.costume = null;
        this.costumes = [];
        this.costumeNames = [];
        this.sounds = [];
        this.soundNames = [];
        this.currentColliderName = null;
        this.colliders = new Map;
        this.phrase = null;
        this.phraseLiveTime = null;
        this._x = 0;
        this._y = 0;
        this._pivotOffsetX = 0;
        this._pivotOffsetY = 0;
        this._width = 0;
        this._height = 0;
        this._defaultColliderNone = false;
        this._direction = 0;
        this._size = 100;
        this._centerDistance = 0;
        this._centerAngle = 0;
        this._rotateStyle = 'normal';
        this._hidden = false;
        this._opacity = null;
        this._filter = null;
        this._deleted = false;
        this._stopped = true;
        this.pendingCostumeGrids = 0;
        this.pendingCostumes = 0;
        this.pendingSounds = 0;
        this._children = [];
        this.onReadyCallbacks = [];
        this.onReadyPending = true;
        this.scheduledCallbacks = [];
        this.tempScheduledCallbacks = [];
        this._drawings = [];
        this._tags = [];
        if (!Registry.getInstance().has('game')) {
            throw new Error('You need create Game instance before Stage instance.');
        }
        this.game = Registry.getInstance().get('game');
        var sprite = this;
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
        try {
            for (var costumePaths_1 = __values(costumePaths), costumePaths_1_1 = costumePaths_1.next(); !costumePaths_1_1.done; costumePaths_1_1 = costumePaths_1.next()) {
                var costumePath = costumePaths_1_1.value;
                sprite.addCostume(costumePath);
            }
        }
        catch (e_7_1) { e_7 = { error: e_7_1 }; }
        finally {
            try {
                if (costumePaths_1_1 && !costumePaths_1_1.done && (_a = costumePaths_1.return)) _a.call(costumePaths_1);
            }
            finally { if (e_7) throw e_7.error; }
        }
        sprite.scheduledCallbackExecutor = new ScheduledCallbackExecutor(sprite);
        sprite.stage.addSprite(sprite);
        sprite.init();
        return sprite;
    }
    Sprite.prototype.init = function () { };
    Sprite.prototype.onReady = function (callback) {
        this.onReadyCallbacks.push(callback);
    };
    Sprite.prototype.isReady = function () {
        return this.pendingCostumes === 0 && this.pendingCostumeGrids === 0 && this.pendingSounds === 0;
    };
    Object.defineProperty(Sprite.prototype, "deleted", {
        get: function () {
            return this._deleted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "stopped", {
        get: function () {
            return this._stopped;
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.setParent = function (parent) {
        parent.addChild(this);
        return this;
    };
    Sprite.prototype.addChild = function (child) {
        var e_8, _a;
        if (!this._children.includes(child)) {
            this._children.push(child);
            child.parent = this;
            child.layer = this.layer;
            child.x = 0;
            child.y = 0;
            child.direction = 0;
            try {
                for (var _b = __values(this.tags), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tag = _c.value;
                    child.addTag(tag);
                }
            }
            catch (e_8_1) { e_8 = { error: e_8_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_8) throw e_8.error; }
            }
        }
        child.parent = this;
        return this;
    };
    Sprite.prototype.removeChild = function (child) {
        var e_9, _a;
        var foundChildIndex = this._children.indexOf(child);
        if (foundChildIndex > -1) {
            var child_1 = this._children[foundChildIndex];
            child_1.parent = null;
            try {
                for (var _b = __values(this.tags), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var tag = _c.value;
                    child_1.removeTag(tag);
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_9) throw e_9.error; }
            }
            this._children.splice(foundChildIndex, 1);
        }
        return this;
    };
    Sprite.prototype.getChildren = function () {
        return this._children;
    };
    Object.defineProperty(Sprite.prototype, "parent", {
        get: function () {
            return this._parentSprite;
        },
        set: function (newParent) {
            this._parentSprite = newParent;
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.getMainSprite = function () {
        if (this._parentSprite) {
            return this._parentSprite.getMainSprite();
        }
        return this;
    };
    Sprite.prototype.switchCollider = function (colliderName) {
        if (!this.colliders.has(colliderName)) {
            this.game.throwError(ErrorMessages.COLLIDER_NAME_NOT_FOUND, { colliderName: colliderName });
        }
        if (this.currentColliderName === colliderName) {
            return this;
        }
        var prevCollider = this.collider;
        if (prevCollider) {
            this.stage.collisionSystem.remove(prevCollider);
        }
        this.currentColliderName = colliderName;
        var newCollider = this.collider;
        this.stage.collisionSystem.insert(newCollider);
        this._width = newCollider.width;
        this._height = newCollider.height;
        return this;
    };
    Sprite.prototype.setCollider = function (colliderName, collider, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        collider.parentSprite = this;
        collider.offset_x = offsetX;
        collider.offset_y = offsetY;
        if (this.currentColliderName === colliderName && this.colliders.has(colliderName)) {
            var prevCollider = this.colliders.get(colliderName);
            this.stage.collisionSystem.remove(prevCollider);
            this.currentColliderName = null;
        }
        this.colliders.set(colliderName, collider);
        this.updateColliderPosition(collider);
        if (this.isReady() && !this.collider) {
            this.switchCollider(colliderName);
        }
        return this;
    };
    Sprite.prototype.setRectCollider = function (colliderName, width, height, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        var angle = 0;
        if (this._rotateStyle != 'leftRight') {
            angle = this.globalAngleRadians;
        }
        var collider = new PolygonCollider(this.x, this.y, [
            [(width / 2) * -1, (height / 2) * -1],
            [width / 2, (height / 2) * -1],
            [width / 2, height / 2],
            [(width / 2) * -1, height / 2]
        ], angle, this.size / 100, this.size / 100);
        collider.width = width;
        collider.height = height;
        this.setCollider(colliderName, collider, offsetX, offsetY);
        return this;
    };
    Sprite.prototype.setPolygonCollider = function (colliderName, points, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        var angleRadians = 0;
        if (this._rotateStyle != 'leftRight') {
            angleRadians = this.globalAngleRadians;
        }
        var centroid = this.calculateCentroid(points);
        var centeredPoints = points.map(function (point) { return [
            point[0] - centroid.x,
            point[1] - centroid.y
        ]; });
        var collider = new PolygonCollider(this.x, this.y, centeredPoints, angleRadians, this.size / 100, this.size / 100);
        var _a = this.calculatePolygonSize(centeredPoints), width = _a.width, height = _a.height;
        collider.width = width;
        collider.height = height;
        this.setCollider(colliderName, collider, offsetX, offsetY);
        return this;
    };
    Sprite.prototype.setCircleCollider = function (colliderName, radius, offsetX, offsetY) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        var collider = new CircleCollider(this.x, this.y, radius, this.size / 100);
        collider.width = radius * 2;
        collider.height = radius * 2;
        this.setCollider(colliderName, collider, offsetX, offsetY);
        return this;
    };
    Sprite.prototype.setCostumeCollider = function (colliderName, costumeIndex, offsetX, offsetY) {
        if (costumeIndex === void 0) { costumeIndex = 0; }
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (this.costumes[costumeIndex] === undefined) {
            this.game.throwError(ErrorMessages.COSTUME_INDEX_NOT_FOUND, { costumeIndex: costumeIndex });
        }
        var costume = this.costumes[costumeIndex];
        this.setRectCollider(colliderName, costume.width, costume.height, offsetX, offsetY);
        return this;
    };
    Sprite.prototype.removeCollider = function (colliderName) {
        if (colliderName) {
            this.removeColliderByName(colliderName);
        }
        else {
            var collider = this.collider;
            if (collider) {
                this.stage.collisionSystem.remove(collider);
            }
            this.colliders.clear();
            this.currentColliderName = null;
            this.defaultColliderNone = true;
        }
        return this;
    };
    Sprite.prototype.removeColliderByName = function (colliderName) {
        var collider = this.getCollider(colliderName);
        this.colliders.delete(colliderName);
        if (this.colliders.size === 0) {
            this.defaultColliderNone = true;
        }
        if (colliderName === this.currentColliderName) {
            this.stage.collisionSystem.remove(collider);
            if (this.colliders.size) {
                var nextColliderName = this.colliders.keys().next().value;
                this.switchCollider(nextColliderName);
            }
        }
        return this;
    };
    Sprite.prototype.getCollider = function (colliderName) {
        if (!this.colliders.has(colliderName)) {
            this.game.throwError(ErrorMessages.COLLIDER_NAME_NOT_FOUND, { colliderName: colliderName });
        }
        return this.colliders.get(colliderName);
    };
    Sprite.prototype.hasCollider = function (colliderName) {
        return this.colliders.has(colliderName);
    };
    Object.defineProperty(Sprite.prototype, "collider", {
        get: function () {
            if (this.currentColliderName && this.colliders.has(this.currentColliderName)) {
                return this.colliders.get(this.currentColliderName);
            }
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "collidedSprite", {
        get: function () {
            return this._collidedSprite;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "defaultColliderNone", {
        get: function () {
            return this._defaultColliderNone;
        },
        set: function (colliderNone) {
            this._defaultColliderNone = colliderNone;
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.getColliders = function () {
        return this.colliders.entries();
    };
    Sprite.prototype.cloneCollider = function (sprite) {
        var e_10, _a;
        var colliders = sprite.getColliders();
        try {
            for (var colliders_1 = __values(colliders), colliders_1_1 = colliders_1.next(); !colliders_1_1.done; colliders_1_1 = colliders_1.next()) {
                var _b = __read(colliders_1_1.value, 2), colliderName = _b[0], sourceCollider = _b[1];
                if (sourceCollider instanceof CircleCollider) {
                    this.setCircleCollider(colliderName, sourceCollider.radius, sourceCollider.offset_x, sourceCollider.offset_y);
                }
                if (sourceCollider instanceof PolygonCollider) {
                    this.setPolygonCollider(colliderName, sourceCollider.points, sourceCollider.offset_x, sourceCollider.offset_y);
                }
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (colliders_1_1 && !colliders_1_1.done && (_a = colliders_1.return)) _a.call(colliders_1);
            }
            finally { if (e_10) throw e_10.error; }
        }
    };
    Sprite.prototype.calculateCentroid = function (points) {
        var e_11, _a;
        var xSum = 0;
        var ySum = 0;
        try {
            for (var points_1 = __values(points), points_1_1 = points_1.next(); !points_1_1.done; points_1_1 = points_1.next()) {
                var point = points_1_1.value;
                xSum += point[0];
                ySum += point[1];
            }
        }
        catch (e_11_1) { e_11 = { error: e_11_1 }; }
        finally {
            try {
                if (points_1_1 && !points_1_1.done && (_a = points_1.return)) _a.call(points_1);
            }
            finally { if (e_11) throw e_11.error; }
        }
        var x = xSum / points.length;
        var y = ySum / points.length;
        return { x: x, y: y };
    };
    Sprite.prototype.calculatePolygonSize = function (points) {
        var e_12, _a;
        var minX = points[0][0];
        var minY = points[0][1];
        var maxX = points[0][0];
        var maxY = points[0][1];
        try {
            for (var points_2 = __values(points), points_2_1 = points_2.next(); !points_2_1.done; points_2_1 = points_2.next()) {
                var vertex = points_2_1.value;
                if (vertex[0] < minX)
                    minX = vertex[0];
                if (vertex[0] > maxX)
                    maxX = vertex[0];
                if (vertex[1] < minY)
                    minY = vertex[1];
                if (vertex[1] > maxY)
                    maxY = vertex[1];
            }
        }
        catch (e_12_1) { e_12 = { error: e_12_1 }; }
        finally {
            try {
                if (points_2_1 && !points_2_1.done && (_a = points_2.return)) _a.call(points_2);
            }
            finally { if (e_12) throw e_12.error; }
        }
        var width = maxX - minX;
        var height = maxY - minY;
        return { width: width, height: height };
    };
    Sprite.prototype.updateColliderPosition = function (collider) {
        collider.x = this.imageCenterX + collider.center_offset_x * this.size / 100;
        collider.y = this.imageCenterY + collider.center_offset_y * this.size / 100;
    };
    Sprite.prototype.updateColliderAngle = function () {
        var collider = this.collider;
        if (collider instanceof PolygonCollider) {
            if (this._rotateStyle == 'leftRight') {
                collider.angle = 0;
            }
            else {
                collider.angle = this.globalAngleRadians;
            }
        }
        if (collider) {
            this.updateColliderPosition(collider);
        }
    };
    Sprite.prototype.updateColliderSize = function (collider) {
        if (collider instanceof PolygonCollider) {
            collider.scale_x = this.size / 100;
            collider.scale_y = this.size / 100;
        }
        else if (collider instanceof CircleCollider) {
            collider.scale = this.size / 100;
        }
    };
    Sprite.prototype.addTag = function (tagName) {
        var e_13, _a;
        if (!this.hasTag(tagName)) {
            this._tags.push(tagName);
        }
        try {
            for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.addTag(tagName);
            }
        }
        catch (e_13_1) { e_13 = { error: e_13_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_13) throw e_13.error; }
        }
        return this;
    };
    Sprite.prototype.removeTag = function (tagName) {
        var e_14, _a;
        var foundIndex = this._tags.indexOf(tagName);
        if (foundIndex > -1) {
            this._tags.splice(foundIndex, 1);
        }
        try {
            for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.addTag(tagName);
            }
        }
        catch (e_14_1) { e_14 = { error: e_14_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_14) throw e_14.error; }
        }
        return this;
    };
    Sprite.prototype.hasTag = function (tagName) {
        return this._tags.includes(tagName);
    };
    Object.defineProperty(Sprite.prototype, "tags", {
        get: function () {
            return this._tags;
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.addCostume = function (costumePath, options) {
        var _this = this;
        var _a;
        var costume = new Costume();
        var costumeIndex = this.costumes.length;
        var costumeName = ((_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : 'Costume') + '-' + costumeIndex;
        this.costumes.push(costume);
        this.costumeNames.push(costumeName);
        this.pendingCostumes++;
        var image = new Image();
        image.src = costumePath;
        if (options === null || options === void 0 ? void 0 : options.alphaColor) {
            image.crossOrigin = 'anonymous';
        }
        var onLoadImage = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            if (_this.deleted) {
                return;
            }
            var transformedImage = _this.transformImage(image, (_a = options === null || options === void 0 ? void 0 : options.rotate) !== null && _a !== void 0 ? _a : 0, (_b = options === null || options === void 0 ? void 0 : options.flipX) !== null && _b !== void 0 ? _b : false, (_c = options === null || options === void 0 ? void 0 : options.flipY) !== null && _c !== void 0 ? _c : false, (_d = options === null || options === void 0 ? void 0 : options.x) !== null && _d !== void 0 ? _d : 0, (_e = options === null || options === void 0 ? void 0 : options.y) !== null && _e !== void 0 ? _e : 0, (_f = options === null || options === void 0 ? void 0 : options.width) !== null && _f !== void 0 ? _f : image.naturalWidth, (_g = options === null || options === void 0 ? void 0 : options.height) !== null && _g !== void 0 ? _g : image.naturalHeight, (_h = options === null || options === void 0 ? void 0 : options.alphaColor) !== null && _h !== void 0 ? _h : null, (_j = options === null || options === void 0 ? void 0 : options.alphaTolerance) !== null && _j !== void 0 ? _j : 0, (_k = options === null || options === void 0 ? void 0 : options.crop) !== null && _k !== void 0 ? _k : 0, (_l = options === null || options === void 0 ? void 0 : options.cropTop) !== null && _l !== void 0 ? _l : null, (_m = options === null || options === void 0 ? void 0 : options.cropRight) !== null && _m !== void 0 ? _m : null, (_o = options === null || options === void 0 ? void 0 : options.cropBottom) !== null && _o !== void 0 ? _o : null, (_p = options === null || options === void 0 ? void 0 : options.cropLeft) !== null && _p !== void 0 ? _p : null);
            costume.image = transformedImage;
            costume.ready = true;
            _this.pendingCostumes--;
            _this.tryDoOnReady();
            image.removeEventListener('load', onLoadImage);
        };
        image.addEventListener('load', onLoadImage);
        image.addEventListener('error', function () {
            _this.game.throwError(ErrorMessages.COSTUME_NOT_LOADED, { costumePath: costumePath });
        });
        return this;
    };
    Sprite.prototype.addCostumeGrid = function (costumePath, options) {
        var _this = this;
        var _a;
        var image = new Image();
        image.src = costumePath;
        var costumeName = (_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : 'Costume';
        this.pendingCostumeGrids++;
        var onLoadImage = function () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            image.naturalWidth;
            image.naturalHeight;
            var cols = options.cols;
            var rows = options.rows;
            var limit = options.limit;
            var offset = options.offset;
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
                        _this.costumes.push(costume);
                        _this.costumeNames.push(costumeName + '-' + costumeIndex);
                        var transformedImage = _this.transformImage(image, (_a = options === null || options === void 0 ? void 0 : options.rotate) !== null && _a !== void 0 ? _a : 0, (_b = options === null || options === void 0 ? void 0 : options.flipX) !== null && _b !== void 0 ? _b : false, (_c = options === null || options === void 0 ? void 0 : options.flipY) !== null && _c !== void 0 ? _c : false, x + ((_d = options === null || options === void 0 ? void 0 : options.x) !== null && _d !== void 0 ? _d : 0), y + ((_e = options === null || options === void 0 ? void 0 : options.y) !== null && _e !== void 0 ? _e : 0), ((_f = options === null || options === void 0 ? void 0 : options.width) !== null && _f !== void 0 ? _f : chunkWidth), ((_g = options === null || options === void 0 ? void 0 : options.height) !== null && _g !== void 0 ? _g : chunkHeight), (_h = options === null || options === void 0 ? void 0 : options.alphaColor) !== null && _h !== void 0 ? _h : null, (_j = options === null || options === void 0 ? void 0 : options.alphaTolerance) !== null && _j !== void 0 ? _j : 0, (_k = options === null || options === void 0 ? void 0 : options.crop) !== null && _k !== void 0 ? _k : 0, (_l = options === null || options === void 0 ? void 0 : options.cropTop) !== null && _l !== void 0 ? _l : null, (_m = options === null || options === void 0 ? void 0 : options.cropRight) !== null && _m !== void 0 ? _m : null, (_o = options === null || options === void 0 ? void 0 : options.cropBottom) !== null && _o !== void 0 ? _o : null, (_p = options === null || options === void 0 ? void 0 : options.cropLeft) !== null && _p !== void 0 ? _p : null);
                        costume.image = transformedImage;
                        costume.ready = true;
                        costumeIndex++;
                    }
                    x += chunkWidth;
                }
                x = 0;
                y += chunkHeight;
            }
            _this.pendingCostumeGrids--;
            _this.tryDoOnReady();
            image.removeEventListener('load', onLoadImage);
        };
        image.addEventListener('load', onLoadImage);
        return this;
    };
    Sprite.prototype.drawCostume = function (callback, options) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
        var image = document.createElement('canvas');
        var context = image.getContext('2d');
        image.width = (_a = options === null || options === void 0 ? void 0 : options.width) !== null && _a !== void 0 ? _a : 100;
        image.height = (_b = options === null || options === void 0 ? void 0 : options.height) !== null && _b !== void 0 ? _b : 100;
        this.pendingCostumes++;
        callback(context, this);
        var costumeIndex = this.costumes.length;
        var costumeName = ((_c = options === null || options === void 0 ? void 0 : options.name) !== null && _c !== void 0 ? _c : 'Costume') + '-' + costumeIndex;
        var needTransform = Object.values(options || {}).some(function (value) { return !!value; });
        if (needTransform) {
            image = this.transformImage(image, (_d = options === null || options === void 0 ? void 0 : options.rotate) !== null && _d !== void 0 ? _d : 0, (_e = options === null || options === void 0 ? void 0 : options.flipX) !== null && _e !== void 0 ? _e : false, (_f = options === null || options === void 0 ? void 0 : options.flipY) !== null && _f !== void 0 ? _f : false, (_g = options === null || options === void 0 ? void 0 : options.x) !== null && _g !== void 0 ? _g : 0, (_h = options === null || options === void 0 ? void 0 : options.y) !== null && _h !== void 0 ? _h : 0, (_j = options === null || options === void 0 ? void 0 : options.width) !== null && _j !== void 0 ? _j : image.width, (_k = options === null || options === void 0 ? void 0 : options.height) !== null && _k !== void 0 ? _k : image.height, (_l = options === null || options === void 0 ? void 0 : options.alphaColor) !== null && _l !== void 0 ? _l : null, (_m = options === null || options === void 0 ? void 0 : options.alphaTolerance) !== null && _m !== void 0 ? _m : 0, (_o = options === null || options === void 0 ? void 0 : options.crop) !== null && _o !== void 0 ? _o : 0, (_p = options === null || options === void 0 ? void 0 : options.cropTop) !== null && _p !== void 0 ? _p : null, (_q = options === null || options === void 0 ? void 0 : options.cropRight) !== null && _q !== void 0 ? _q : null, (_r = options === null || options === void 0 ? void 0 : options.cropBottom) !== null && _r !== void 0 ? _r : null, (_s = options === null || options === void 0 ? void 0 : options.cropLeft) !== null && _s !== void 0 ? _s : null);
        }
        var costume = new Costume();
        costume.image = image;
        costume.ready = true;
        this.costumes.push(costume);
        this.costumeNames.push(costumeName + '-' + costumeIndex);
        this.pendingCostumes--;
        return this;
    };
    Sprite.prototype.removeCostume = function (costumeIndex) {
        if (this.costumes[costumeIndex] === undefined) {
            this.game.throwError(ErrorMessages.COSTUME_INDEX_NOT_FOUND, { costumeIndex: costumeIndex });
        }
        this.costumes.splice(costumeIndex, 1);
        this.costumeNames.splice(costumeIndex, 1);
        if (this.costumeIndex === costumeIndex) {
            this.costumeIndex = null;
            if (this.costumes.length > 0) {
                this.nextCostume();
            }
            else {
                this.costume = null;
            }
        }
        return this;
    };
    Sprite.prototype.switchCostume = function (costumeIndex) {
        if (this.deleted) {
            return;
        }
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.COSTUME_SWITCH_NOT_READY);
        }
        var costume = this.costumes[costumeIndex];
        if (costume instanceof Costume && costume.ready) {
            this.costumeIndex = costumeIndex;
            this.costume = costume;
        }
        return this;
    };
    Sprite.prototype.switchCostumeByName = function (costumeName) {
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.COSTUME_SWITCH_NOT_READY);
        }
        var costumeIndex = this.costumeNames.indexOf(costumeName);
        if (costumeIndex > -1) {
            this.switchCostume(costumeIndex);
        }
        else {
            this.game.throwError(ErrorMessages.COSTUME_NAME_NOT_FOUND, { costumeName: costumeName });
        }
        return this;
    };
    Sprite.prototype.nextCostume = function (minCostume, maxCostume) {
        if (minCostume === void 0) { minCostume = 0; }
        if (this.deleted) {
            return;
        }
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.COSTUME_SWITCH_NOT_READY);
        }
        var maxCostumeIndex = this.costumes.length - 1;
        minCostume = Math.min(maxCostumeIndex, Math.max(0, minCostume));
        maxCostume = Math.min(maxCostumeIndex, Math.max(0, maxCostume !== null && maxCostume !== void 0 ? maxCostume : maxCostumeIndex));
        var nextCostumeIndex = this.costumeIndex + 1;
        if (nextCostumeIndex > maxCostume || nextCostumeIndex < minCostume) {
            nextCostumeIndex = minCostume;
        }
        if (nextCostumeIndex !== this.costumeIndex) {
            this.switchCostume(nextCostumeIndex);
        }
        return nextCostumeIndex;
    };
    Sprite.prototype.prevCostume = function (minCostume, maxCostume) {
        if (minCostume === void 0) { minCostume = 0; }
        if (this.deleted) {
            return;
        }
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.COSTUME_SWITCH_NOT_READY);
        }
        var maxCostumeIndex = this.costumes.length - 1;
        minCostume = Math.min(maxCostumeIndex, Math.max(0, minCostume));
        maxCostume = Math.min(maxCostumeIndex, Math.max(0, maxCostume !== null && maxCostume !== void 0 ? maxCostume : maxCostumeIndex));
        var prevCostumeIndex = this.costumeIndex - 1;
        if (prevCostumeIndex < minCostume || prevCostumeIndex > maxCostume) {
            prevCostumeIndex = maxCostume;
        }
        if (prevCostumeIndex !== this.costumeIndex) {
            this.switchCostume(prevCostumeIndex);
        }
        return prevCostumeIndex;
    };
    Sprite.prototype.getCostume = function () {
        return this.costume;
    };
    Sprite.prototype.getCostumeName = function () {
        if (this.costumeIndex === null) {
            return 'No costume';
        }
        return this.costumeNames[this.costumeIndex];
    };
    Sprite.prototype.getCostumeIndex = function () {
        return this.costumeIndex;
    };
    Sprite.prototype.transformImage = function (srcImage, rotate, flipX, flipY, imageX, imageY, imageWidth, imageHeight, imageAlphaColor, imageAlphaTolerance, crop, cropTop, cropRight, cropBottom, cropLeft) {
        if (flipX === void 0) { flipX = false; }
        if (flipY === void 0) { flipY = false; }
        if (imageX === void 0) { imageX = 0; }
        if (imageY === void 0) { imageY = 0; }
        if (imageWidth === void 0) { imageWidth = null; }
        if (imageHeight === void 0) { imageHeight = null; }
        if (imageAlphaColor === void 0) { imageAlphaColor = null; }
        if (imageAlphaTolerance === void 0) { imageAlphaTolerance = 0; }
        if (crop === void 0) { crop = 0; }
        if (cropTop === void 0) { cropTop = null; }
        if (cropRight === void 0) { cropRight = null; }
        if (cropBottom === void 0) { cropBottom = null; }
        if (cropLeft === void 0) { cropLeft = null; }
        cropTop = cropTop !== null && cropTop !== void 0 ? cropTop : crop;
        cropRight = cropRight !== null && cropRight !== void 0 ? cropRight : crop;
        cropBottom = cropBottom !== null && cropBottom !== void 0 ? cropBottom : crop;
        cropLeft = cropLeft !== null && cropLeft !== void 0 ? cropLeft : crop;
        imageX += cropRight;
        imageWidth -= cropRight;
        imageWidth -= cropLeft;
        imageY += cropTop;
        imageHeight -= cropTop;
        imageHeight -= cropBottom;
        var imageCanvas = document.createElement('canvas');
        var context = imageCanvas.getContext('2d');
        var radians = rotate * Math.PI / 180;
        var canvasWidth = imageWidth !== null && imageWidth !== void 0 ? imageWidth : (srcImage instanceof HTMLImageElement ? srcImage.naturalWidth : srcImage.width);
        var canvasHeight = imageHeight !== null && imageHeight !== void 0 ? imageHeight : (srcImage instanceof HTMLImageElement ? srcImage.naturalHeight : srcImage.height);
        if (rotate) {
            var absCos = Math.abs(Math.cos(radians));
            var absSin = Math.abs(Math.sin(radians));
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
        var offsetX = -imageWidth / 2;
        var offsetY = -imageHeight / 2;
        context.drawImage(srcImage, imageX, imageY, imageWidth, imageHeight, offsetX, offsetY, imageWidth, imageHeight);
        if (imageAlphaColor) {
            imageCanvas = this.setAlpha(imageCanvas, imageAlphaColor, imageAlphaTolerance !== null && imageAlphaTolerance !== void 0 ? imageAlphaTolerance : 0);
        }
        return imageCanvas;
    };
    Sprite.prototype.setAlpha = function (image, targetColor, tolerance) {
        if (tolerance === void 0) { tolerance = 0; }
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Canvas context is not available');
        }
        canvas.width = image.width;
        canvas.height = image.height;
        var imageData = image.getContext('2d').getImageData(0, 0, image.width, image.height);
        var data = imageData.data;
        var targetRGB;
        if (typeof targetColor === 'string') {
            targetRGB = this.hexToRgb(targetColor);
            if (!targetRGB) {
                throw new Error("Invalid HEX color: ".concat(targetColor));
            }
        }
        else {
            targetRGB = targetColor;
        }
        for (var i = 0; i < data.length; i += 4) {
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];
            if (Math.abs(r - targetRGB.r) <= tolerance &&
                Math.abs(g - targetRGB.g) <= tolerance &&
                Math.abs(b - targetRGB.b) <= tolerance) {
                data[i + 3] = 0;
            }
        }
        context.putImageData(imageData, 0, 0);
        return canvas;
    };
    Sprite.prototype.hexToRgb = function (hex) {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex.split('').map(function (char) { return char + char; }).join('');
        }
        if (hex.length !== 6) {
            return null;
        }
        var bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255,
        };
    };
    Sprite.prototype.cloneCostume = function (costume, name) {
        this.costumes.push(costume);
        this.costumeNames.push(name);
    };
    Sprite.prototype.addSound = function (soundPath, soundName) {
        var _this = this;
        if (this.soundNames.includes(soundName)) {
            this.game.throwError(ErrorMessages.SOUND_NAME_ALREADY_EXISTS, { soundName: soundName });
        }
        var sound = new Audio();
        sound.src = soundPath;
        this.sounds.push(sound);
        this.soundNames.push(soundName);
        this.pendingSounds++;
        sound.load();
        var onLoadSound = function () {
            _this.pendingSounds--;
            _this.tryDoOnReady();
            sound.removeEventListener('loadedmetadata', onLoadSound);
        };
        sound.addEventListener('loadedmetadata', onLoadSound);
        return this;
    };
    Sprite.prototype.removeSound = function (soundName) {
        var soundIndex = this.soundNames.indexOf(soundName);
        if (soundIndex < 0) {
            this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, { soundName: soundName });
        }
        this.sounds.splice(soundIndex, 1);
        return this;
    };
    Sprite.prototype.playSound = function (soundName, options) {
        if (options === void 0) { options = {}; }
        var sound = this.getSound(soundName);
        this.doPlaySound(sound, options);
    };
    Sprite.prototype.startSound = function (soundName, options) {
        if (options === void 0) { options = {}; }
        var sound = this.cloneSound(soundName);
        this.doPlaySound(sound, options);
        return sound;
    };
    Sprite.prototype.pauseSound = function (soundName) {
        var sound = this.getSound(soundName);
        sound.pause();
    };
    Sprite.prototype.getSound = function (soundName) {
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.SOUND_USE_NOT_READY);
        }
        var soundIndex = this.soundNames.indexOf(soundName);
        if (soundIndex < 0) {
            this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, { soundName: soundName });
        }
        var sound = this.sounds[soundIndex];
        if (!(sound instanceof Audio)) {
            this.game.throwError(ErrorMessages.SOUND_INDEX_NOT_FOUND, { soundIndex: soundIndex });
        }
        return sound;
    };
    Sprite.prototype.cloneSound = function (soundName) {
        var originSound = this.getSound(soundName);
        return new Audio(originSound.src);
    };
    Sprite.prototype.doPlaySound = function (sound, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (options.volume !== undefined) {
            sound.volume = options.volume;
        }
        if (options.currentTime !== undefined) {
            sound.currentTime = options.currentTime;
        }
        if (options.loop !== undefined) {
            sound.loop = options.loop;
        }
        var playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(function (error) {
                if (error.name === "NotAllowedError") {
                    _this.game.throwError(ErrorMessages.SOUND_NOT_ALLOWED_ERROR, {}, false);
                }
                else {
                    console.error("Audio playback error:", error);
                }
            });
        }
    };
    Sprite.prototype.stamp = function (costumeIndex, withRotation) {
        if (withRotation === void 0) { withRotation = true; }
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.STAMP_NOT_READY);
        }
        costumeIndex = costumeIndex !== null && costumeIndex !== void 0 ? costumeIndex : this.costumeIndex;
        if (!this.costumes[costumeIndex]) {
            this.game.throwError(ErrorMessages.STAMP_COSTUME_NOT_FOUND, { costumeIndex: costumeIndex });
        }
        var costume = this.costumes[costumeIndex];
        if (!(costume.image instanceof HTMLCanvasElement)) {
            this.game.throwErrorRaw('The image inside the costume was not found.');
        }
        var direction = 0;
        if (withRotation && this._rotateStyle === 'normal') {
            direction = this.direction;
        }
        this.stage.stampImage(costume.image, this.x, this.y, direction);
    };
    Sprite.prototype.pen = function (callback) {
        this._drawings.push(callback);
    };
    Object.defineProperty(Sprite.prototype, "drawings", {
        get: function () {
            return this._drawings;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "opacity", {
        get: function () {
            return this._opacity;
        },
        set: function (value) {
            if (value === null) {
                this._opacity = null;
            }
            else {
                this._opacity = Math.min(1, Math.max(0, value));
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "filter", {
        get: function () {
            return this._filter;
        },
        set: function (value) {
            this._filter = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "rotateStyle", {
        get: function () {
            return this._rotateStyle;
        },
        set: function (value) {
            var e_15, _a;
            this._rotateStyle = value;
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.rotateStyle = value;
                }
            }
            catch (e_15_1) { e_15 = { error: e_15_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_15) throw e_15.error; }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "layer", {
        get: function () {
            return this._layer;
        },
        set: function (newLayer) {
            var e_16, _a;
            this.stage.changeSpriteLayer(this, this._layer, newLayer);
            this._layer = newLayer;
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.layer = child.layer + this._layer;
                }
            }
            catch (e_16_1) { e_16 = { error: e_16_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_16) throw e_16.error; }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "hidden", {
        get: function () {
            return this._hidden;
        },
        set: function (value) {
            var e_17, _a;
            this._hidden = value;
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.hidden = value;
                }
            }
            catch (e_17_1) { e_17 = { error: e_17_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_17) throw e_17.error; }
            }
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.say = function (text, time) {
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
    Sprite.prototype.move = function (steps) {
        var angleRadians = this.globalAngleRadians;
        this.x += (steps * Math.sin(angleRadians));
        this.y -= (steps * Math.cos(angleRadians));
    };
    Sprite.prototype.pointForward = function (object) {
        var globalX = object.globalX ? object.globalX : object.x;
        var globalY = object.globalY ? object.globalY : object.y;
        this.globalDirection = (Math.atan2(this.globalY - globalY, this.globalX - globalX) / Math.PI * 180) - 90;
    };
    Sprite.prototype.getDistanceTo = function (object) {
        var globalX = object.globalX ? object.globalX : object.x;
        var globalY = object.globalY ? object.globalY : object.y;
        return Math.sqrt((Math.abs(this.globalX - globalX)) + (Math.abs(this.globalY - globalY)));
    };
    Sprite.prototype.bounceOnEdge = function () {
        if (this.touchTopEdge() || this.touchBottomEdge()) {
            this.direction = 180 - this.direction;
        }
        if (this.touchLeftEdge() || this.touchRightEdge()) {
            this.direction *= -1;
        }
    };
    Object.defineProperty(Sprite.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            var e_18, _a;
            this._x = value;
            if (this._children.length) {
                this.updateCenterParams();
            }
            var collider = this.collider;
            if (collider) {
                this.updateColliderPosition(collider);
            }
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.collider) {
                        child.updateColliderPosition(child.collider);
                    }
                }
            }
            catch (e_18_1) { e_18 = { error: e_18_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_18) throw e_18.error; }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            var e_19, _a;
            this._y = value;
            if (this._children.length) {
                this.updateCenterParams();
            }
            var collider = this.collider;
            if (collider) {
                this.updateColliderPosition(collider);
            }
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.collider) {
                        child.updateColliderPosition(child.collider);
                    }
                }
            }
            catch (e_19_1) { e_19 = { error: e_19_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_19) throw e_19.error; }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "globalX", {
        get: function () {
            if (this._parentSprite) {
                if (this._rotateStyle === 'leftRight' || this._rotateStyle === 'none') {
                    return this._parentSprite.imageCenterX + this._x * this.size / 100;
                }
                return this._parentSprite.imageCenterX + this.distanceToParent * Math.cos(this.angleToParent - this._parentSprite.globalAngleRadians) * this.size / 100;
            }
            return this._x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "globalY", {
        get: function () {
            if (this._parentSprite) {
                if (this._rotateStyle === 'leftRight' || this._rotateStyle === 'none') {
                    return this._parentSprite.imageCenterY + this._y;
                }
                return this._parentSprite.imageCenterY - this.distanceToParent * Math.sin(this.angleToParent - this._parentSprite.globalAngleRadians) * this.size / 100;
            }
            return this._y;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "imageCenterX", {
        get: function () {
            if (this._rotateStyle === 'leftRight' || this._rotateStyle === 'none') {
                var leftRightMultiplier = this._direction > 180 && this._rotateStyle === 'leftRight' ? -1 : 1;
                return this.globalX - this._pivotOffsetX * leftRightMultiplier * this.size / 100;
            }
            return this.globalX + Math.cos(this._centerAngle - this.globalAngleRadians) * this._centerDistance * this.size / 100;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "imageCenterY", {
        get: function () {
            if (this._rotateStyle === 'leftRight' || this._rotateStyle === 'none') {
                return this.globalY - this._pivotOffsetY * this.size / 100;
            }
            return this.globalY - Math.sin(this._centerAngle - this.globalAngleRadians) * this._centerDistance * this.size / 100;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "realX", {
        get: function () {
            return this.x - this.width / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "realY", {
        get: function () {
            return this.y - this.height / 2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "rightX", {
        get: function () {
            var collider = this.collider;
            var offset = collider ? collider.center_offset_x * this.size / 100 : 0;
            return this.imageCenterX + this.width / 2 + offset;
        },
        set: function (x) {
            var collider = this.collider;
            var offset = collider ? collider.center_offset_x * this.size / 100 : 0;
            this.x = x - this.width / 2 - offset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "leftX", {
        get: function () {
            var collider = this.collider;
            var offset = collider ? collider.center_offset_x * this.size / 100 : 0;
            return this.imageCenterX - this.width / 2 + offset;
        },
        set: function (x) {
            var collider = this.collider;
            var offset = collider ? collider.center_offset_x * this.size / 100 : 0;
            this.x = x + this.width / 2 + offset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "topY", {
        get: function () {
            var collider = this.collider;
            var offset = collider ? collider.center_offset_y * this.size / 100 : 0;
            return this.imageCenterY - this.height / 2 + offset;
        },
        set: function (y) {
            var collider = this.collider;
            var offset = collider ? collider.center_offset_y * this.size / 100 : 0;
            this.y = y + this.height / 2 + offset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "bottomY", {
        get: function () {
            var collider = this.collider;
            var offset = collider ? collider.center_offset_y * this.size / 100 : 0;
            return this.imageCenterY + this.height / 2 + offset;
        },
        set: function (y) {
            var collider = this.collider;
            var offset = collider ? collider.center_offset_y * this.size / 100 : 0;
            this.y = y - this.height / 2 - offset;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "width", {
        get: function () {
            if (this.collider instanceof PolygonCollider) {
                var angleRadians = this.globalAngleRadians;
                return Math.abs(this.sourceWidth * Math.cos(angleRadians)) + Math.abs(this.sourceHeight * Math.sin(angleRadians));
            }
            return this.sourceWidth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "height", {
        get: function () {
            if (this.collider instanceof PolygonCollider) {
                var angleRadians = this.globalAngleRadians;
                return Math.abs(this.sourceWidth * Math.sin(angleRadians)) + Math.abs(this.sourceHeight * Math.cos(angleRadians));
            }
            return this.sourceHeight;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "sourceWidth", {
        get: function () {
            return this._width * this.size / 100;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "sourceHeight", {
        get: function () {
            return this._height * this.size / 100;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "size", {
        get: function () {
            return this._size;
        },
        set: function (value) {
            var e_20, _a;
            this._size = value;
            var collider = this.collider;
            if (collider) {
                this.updateColliderSize(collider);
            }
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.size = value;
                }
            }
            catch (e_20_1) { e_20 = { error: e_20_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_20) throw e_20.error; }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "direction", {
        get: function () {
            return this._direction;
        },
        set: function (direction) {
            var e_21, _a;
            if ((direction * 0) !== 0) {
                return;
            }
            direction = direction % 360;
            if (direction < 0) {
                direction += 360;
            }
            this._direction = (direction > 360) ? direction - 360 : direction;
            this.updateColliderAngle();
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    child.updateColliderAngle();
                }
            }
            catch (e_21_1) { e_21 = { error: e_21_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_21) throw e_21.error; }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "globalDirection", {
        get: function () {
            return this._parentSprite ? this._parentSprite.direction + this.direction : this.direction;
        },
        set: function (value) {
            this.direction = this._parentSprite ? value - this._parentSprite.direction : value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "globalAngleRadians", {
        get: function () {
            return this.globalDirection * Math.PI / 180;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "angleToParent", {
        get: function () {
            return -Math.atan2(this.y, this.x);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "distanceToParent", {
        get: function () {
            return Math.hypot(this.x, this.y);
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.setPivotOffset = function (x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.pivotOffsetX = x;
        this.pivotOffsetY = y;
        return this;
    };
    Object.defineProperty(Sprite.prototype, "pivotOffsetX", {
        get: function () {
            return this._pivotOffsetX;
        },
        set: function (value) {
            var prevX = this.x;
            this._pivotOffsetX = value;
            this.updateCenterParams();
            this.x = prevX;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "pivotOffsetY", {
        get: function () {
            return this._pivotOffsetY;
        },
        set: function (value) {
            var prevY = this.y;
            this._pivotOffsetY = value;
            this.updateCenterParams();
            this.y = prevY;
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.updateCenterParams = function () {
        this._centerDistance = Math.hypot(this._pivotOffsetX, this._pivotOffsetY);
        this._centerAngle = -Math.atan2(-this._pivotOffsetY, -this._pivotOffsetX);
    };
    Sprite.prototype.touchSprite = function (sprite, checkChildren) {
        var e_22, _a, e_23, _b, e_24, _c;
        if (checkChildren === void 0) { checkChildren = true; }
        this._collidedSprite = null;
        if (sprite.hidden ||
            this.hidden ||
            sprite.stopped ||
            this.stopped ||
            sprite.deleted ||
            this.deleted) {
            return false;
        }
        var collider = this.collider;
        var otherCollider = sprite.collider;
        var isTouch = collider && otherCollider && collider.collides(otherCollider, this.collisionResult);
        if (isTouch) {
            return true;
        }
        if (collider) {
            try {
                for (var _d = __values(sprite.getChildren()), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var otherChild = _e.value;
                    if (this.touchSprite(otherChild, false)) {
                        return true;
                    }
                }
            }
            catch (e_22_1) { e_22 = { error: e_22_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
                }
                finally { if (e_22) throw e_22.error; }
            }
        }
        if (!checkChildren) {
            return false;
        }
        try {
            for (var _f = __values(this._children), _g = _f.next(); !_g.done; _g = _f.next()) {
                var child = _g.value;
                if (otherCollider && child.touchSprite(sprite)) {
                    this._collidedSprite = child;
                    return true;
                }
                try {
                    for (var _h = (e_24 = void 0, __values(sprite.getChildren())), _j = _h.next(); !_j.done; _j = _h.next()) {
                        var otherChild = _j.value;
                        if (child.touchSprite(otherChild)) {
                            this._collidedSprite = child;
                            return true;
                        }
                    }
                }
                catch (e_24_1) { e_24 = { error: e_24_1 }; }
                finally {
                    try {
                        if (_j && !_j.done && (_c = _h.return)) _c.call(_h);
                    }
                    finally { if (e_24) throw e_24.error; }
                }
            }
        }
        catch (e_23_1) { e_23 = { error: e_23_1 }; }
        finally {
            try {
                if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
            }
            finally { if (e_23) throw e_23.error; }
        }
        return false;
    };
    Sprite.prototype.touchSprites = function (sprites, checkChildren) {
        var e_25, _a;
        if (checkChildren === void 0) { checkChildren = true; }
        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }
        try {
            for (var sprites_1 = __values(sprites), sprites_1_1 = sprites_1.next(); !sprites_1_1.done; sprites_1_1 = sprites_1.next()) {
                var sprite = sprites_1_1.value;
                if (this.touchSprite(sprite, checkChildren)) {
                    return true;
                }
            }
        }
        catch (e_25_1) { e_25 = { error: e_25_1 }; }
        finally {
            try {
                if (sprites_1_1 && !sprites_1_1.done && (_a = sprites_1.return)) _a.call(sprites_1);
            }
            finally { if (e_25) throw e_25.error; }
        }
        return false;
    };
    Sprite.prototype.touchMouse = function (checkChildren) {
        if (checkChildren === void 0) { checkChildren = true; }
        return this.touchPoint(this.game.getMousePoint(), checkChildren);
    };
    Sprite.prototype.touchPoint = function (point, checkChildren) {
        var e_26, _a;
        if (checkChildren === void 0) { checkChildren = true; }
        this._collidedSprite = null;
        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }
        var collider = this.collider;
        var isTouch = collider && collider.collides(point, this.collisionResult);
        if (isTouch) {
            return true;
        }
        if (checkChildren) {
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.touchPoint(child.game.getMousePoint())) {
                        this._collidedSprite = child.otherSprite;
                        return true;
                    }
                }
            }
            catch (e_26_1) { e_26 = { error: e_26_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_26) throw e_26.error; }
            }
        }
        return false;
    };
    Sprite.prototype.touchEdge = function (checkChildren) {
        var e_27, _a;
        if (checkChildren === void 0) { checkChildren = true; }
        var result = this.getPureCollisionResult();
        this._collidedSprite = null;
        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }
        if (this.collider) {
            var gameWidth = this.game.width;
            var gameHeight = this.game.height;
            if (this.topY < 0) {
                result.collision = true;
                result.overlap = -this.topY;
                result.overlap_y = -1;
                return true;
            }
            if (this.bottomY > gameHeight) {
                result.collision = true;
                result.overlap = this.bottomY - gameHeight;
                result.overlap_y = 1;
                return true;
            }
            if (this.leftX < 0) {
                result.collision = true;
                result.overlap = -this.leftX;
                result.overlap_x = -1;
                return true;
            }
            if (this.rightX > gameWidth) {
                result.collision = true;
                result.overlap = this.rightX - gameWidth;
                result.overlap_x = 1;
                return true;
            }
        }
        if (checkChildren) {
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.touchEdge()) {
                        this._collidedSprite = child;
                        return true;
                    }
                }
            }
            catch (e_27_1) { e_27 = { error: e_27_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_27) throw e_27.error; }
            }
        }
        return false;
    };
    Sprite.prototype.touchTopEdge = function (checkChildren) {
        var e_28, _a;
        if (checkChildren === void 0) { checkChildren = true; }
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
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.touchTopEdge()) {
                        this._collidedSprite = child;
                        return true;
                    }
                }
            }
            catch (e_28_1) { e_28 = { error: e_28_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_28) throw e_28.error; }
            }
        }
        return false;
    };
    Sprite.prototype.touchBottomEdge = function (checkChildren) {
        var e_29, _a;
        if (checkChildren === void 0) { checkChildren = true; }
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
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.touchBottomEdge()) {
                        this._collidedSprite = child;
                        return true;
                    }
                }
            }
            catch (e_29_1) { e_29 = { error: e_29_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_29) throw e_29.error; }
            }
        }
        return false;
    };
    Sprite.prototype.touchLeftEdge = function (checkChildren) {
        var e_30, _a;
        if (checkChildren === void 0) { checkChildren = true; }
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
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.touchLeftEdge()) {
                        this._collidedSprite = child;
                        return true;
                    }
                }
            }
            catch (e_30_1) { e_30 = { error: e_30_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_30) throw e_30.error; }
            }
        }
        return false;
    };
    Sprite.prototype.touchRightEdge = function (checkChildren) {
        var e_31, _a;
        if (checkChildren === void 0) { checkChildren = true; }
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
            try {
                for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var child = _c.value;
                    if (child.touchRightEdge()) {
                        this._collidedSprite = child;
                        return true;
                    }
                }
            }
            catch (e_31_1) { e_31 = { error: e_31_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_31) throw e_31.error; }
            }
        }
        return false;
    };
    Sprite.prototype.touchTag = function (tagName, checkChildren) {
        var e_32, _a, e_33, _b;
        if (checkChildren === void 0) { checkChildren = true; }
        this.clearCollisionResult();
        this._collidedSprite = null;
        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }
        var collider = this.collider;
        if (collider) {
            var potentialsColliders = collider.potentials();
            if (!potentialsColliders.length) {
                return false;
            }
            try {
                for (var potentialsColliders_1 = __values(potentialsColliders), potentialsColliders_1_1 = potentialsColliders_1.next(); !potentialsColliders_1_1.done; potentialsColliders_1_1 = potentialsColliders_1.next()) {
                    var potentialCollider = potentialsColliders_1_1.value;
                    var potentialSprite = potentialCollider.parentSprite;
                    if (potentialSprite && potentialSprite.hasTag(tagName)) {
                        if (!potentialSprite.hidden &&
                            !potentialSprite.stopped &&
                            !potentialSprite.deleted &&
                            collider.collides(potentialCollider, this.collisionResult)) {
                            return true;
                        }
                    }
                }
            }
            catch (e_32_1) { e_32 = { error: e_32_1 }; }
            finally {
                try {
                    if (potentialsColliders_1_1 && !potentialsColliders_1_1.done && (_a = potentialsColliders_1.return)) _a.call(potentialsColliders_1);
                }
                finally { if (e_32) throw e_32.error; }
            }
        }
        if (checkChildren) {
            try {
                for (var _c = __values(this._children), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var child = _d.value;
                    if (child.touchTag(tagName)) {
                        this._collidedSprite = child;
                        return true;
                    }
                }
            }
            catch (e_33_1) { e_33 = { error: e_33_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_33) throw e_33.error; }
            }
        }
        return false;
    };
    Sprite.prototype.touchTagAll = function (tagName, checkChildren) {
        var e_34, _a, e_35, _b, e_36, _c;
        if (checkChildren === void 0) { checkChildren = true; }
        this.clearCollisionResult();
        this._collidedSprite = null;
        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }
        var collidedSprites = [];
        var collider = this.collider;
        if (collider) {
            var potentialsColliders = collider.potentials();
            if (!potentialsColliders.length) {
                return false;
            }
            try {
                for (var potentialsColliders_2 = __values(potentialsColliders), potentialsColliders_2_1 = potentialsColliders_2.next(); !potentialsColliders_2_1.done; potentialsColliders_2_1 = potentialsColliders_2.next()) {
                    var potentialCollider = potentialsColliders_2_1.value;
                    var potentialSprite = potentialCollider.parentSprite;
                    if (potentialSprite && potentialSprite.hasTag(tagName)) {
                        if (!potentialSprite.hidden &&
                            !potentialSprite.stopped &&
                            !potentialSprite.deleted &&
                            potentialSprite.collider &&
                            collider.collides(potentialCollider, this.collisionResult)) {
                            collidedSprites.push(potentialSprite);
                        }
                    }
                }
            }
            catch (e_34_1) { e_34 = { error: e_34_1 }; }
            finally {
                try {
                    if (potentialsColliders_2_1 && !potentialsColliders_2_1.done && (_a = potentialsColliders_2.return)) _a.call(potentialsColliders_2);
                }
                finally { if (e_34) throw e_34.error; }
            }
        }
        if (checkChildren) {
            try {
                for (var _d = __values(this._children), _e = _d.next(); !_e.done; _e = _d.next()) {
                    var child = _e.value;
                    var collision = child.touchTagAll(tagName);
                    if (collision && !collision.length) {
                        try {
                            for (var collision_1 = (e_36 = void 0, __values(collision)), collision_1_1 = collision_1.next(); !collision_1_1.done; collision_1_1 = collision_1.next()) {
                                var sprite = collision_1_1.value;
                                collidedSprites.push(sprite);
                            }
                        }
                        catch (e_36_1) { e_36 = { error: e_36_1 }; }
                        finally {
                            try {
                                if (collision_1_1 && !collision_1_1.done && (_c = collision_1.return)) _c.call(collision_1);
                            }
                            finally { if (e_36) throw e_36.error; }
                        }
                    }
                }
            }
            catch (e_35_1) { e_35 = { error: e_35_1 }; }
            finally {
                try {
                    if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
                }
                finally { if (e_35) throw e_35.error; }
            }
        }
        if (collidedSprites.length) {
            return collidedSprites;
        }
        return false;
    };
    Sprite.prototype.touchAnySprite = function (checkChildren) {
        var e_37, _a, e_38, _b;
        if (checkChildren === void 0) { checkChildren = true; }
        this.clearCollisionResult();
        this._collidedSprite = null;
        if (this.hidden || this.stopped || this.deleted) {
            return false;
        }
        var collider = this.collider;
        if (collider) {
            var potentialsColliders = collider.potentials();
            if (!potentialsColliders.length) {
                return false;
            }
            try {
                for (var potentialsColliders_3 = __values(potentialsColliders), potentialsColliders_3_1 = potentialsColliders_3.next(); !potentialsColliders_3_1.done; potentialsColliders_3_1 = potentialsColliders_3.next()) {
                    var potentialCollider = potentialsColliders_3_1.value;
                    var potentialSprite = potentialCollider.parentSprite;
                    if (!potentialSprite.hidden &&
                        !potentialSprite.stopped &&
                        !potentialSprite.deleted &&
                        collider.collides(potentialCollider, this.collisionResult)) {
                        return true;
                    }
                }
            }
            catch (e_37_1) { e_37 = { error: e_37_1 }; }
            finally {
                try {
                    if (potentialsColliders_3_1 && !potentialsColliders_3_1.done && (_a = potentialsColliders_3.return)) _a.call(potentialsColliders_3);
                }
                finally { if (e_37) throw e_37.error; }
            }
        }
        if (checkChildren) {
            try {
                for (var _c = __values(this._children), _d = _c.next(); !_d.done; _d = _c.next()) {
                    var child = _d.value;
                    if (child.touchAnySprite()) {
                        this._collidedSprite = child;
                        return true;
                    }
                }
            }
            catch (e_38_1) { e_38 = { error: e_38_1 }; }
            finally {
                try {
                    if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
                }
                finally { if (e_38) throw e_38.error; }
            }
        }
        return false;
    };
    Object.defineProperty(Sprite.prototype, "overlap", {
        get: function () {
            if (this._collidedSprite) {
                return this._collidedSprite.overlap;
            }
            if (!this.collisionResult.collision) {
                return 0;
            }
            return this.collisionResult.overlap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "overlapX", {
        get: function () {
            if (this._collidedSprite) {
                return this._collidedSprite.overlapX;
            }
            if (!this.collisionResult.collision) {
                return 0;
            }
            return this.collisionResult.overlap_x * this.collisionResult.overlap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "overlapY", {
        get: function () {
            if (this._collidedSprite) {
                return this._collidedSprite.overlapY;
            }
            if (!this.collisionResult.collision) {
                return 0;
            }
            return this.collisionResult.overlap_y * this.collisionResult.overlap;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "otherSprite", {
        get: function () {
            if (!this.collisionResult.collision) {
                return null;
            }
            return this.collisionResult.b.parentSprite;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sprite.prototype, "otherMainSprite", {
        get: function () {
            if (!this.collisionResult.collision) {
                return null;
            }
            return this.collisionResult.b.parentSprite.getMainSprite();
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.clearCollisionResult = function () {
        this.collisionResult.collision = false;
        this.collisionResult.a = null;
        this.collisionResult.b = null;
        this.collisionResult.a_in_b = false;
        this.collisionResult.b_in_a = false;
        this.collisionResult.overlap = 0;
        this.collisionResult.overlap_x = 0;
        this.collisionResult.overlap_y = 0;
    };
    Sprite.prototype.getPureCollisionResult = function () {
        this.clearCollisionResult();
        return this.collisionResult;
    };
    Sprite.prototype.timeout = function (callback, timeout) {
        this.repeat(callback, 1, null, timeout, undefined);
    };
    Sprite.prototype.repeat = function (callback, repeat, interval, timeout, finishCallback) {
        var state = new ScheduledState(interval, repeat, 0);
        if (timeout) {
            timeout = Date.now() + timeout;
        }
        this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));
        return state;
    };
    Sprite.prototype.forever = function (callback, interval, timeout, finishCallback) {
        var state = new ScheduledState(interval);
        if (timeout) {
            timeout = Date.now() + timeout;
        }
        this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));
        return state;
    };
    Sprite.prototype.update = function (diffTime) {
        if (this.deleted) {
            return;
        }
        if (this.tempScheduledCallbacks.length) {
            this.scheduledCallbacks = this.scheduledCallbacks.concat(this.tempScheduledCallbacks);
            this.tempScheduledCallbacks = [];
        }
        this.scheduledCallbacks = this.scheduledCallbacks.filter(this.scheduledCallbackExecutor.execute(Date.now(), diffTime));
    };
    Sprite.prototype.run = function () {
        this._stopped = false;
    };
    Sprite.prototype.stop = function () {
        this._stopped = true;
    };
    Sprite.prototype.ready = function () {
        this.tryDoOnReady();
    };
    Object.defineProperty(Sprite.prototype, "original", {
        get: function () {
            return this._original;
        },
        enumerable: false,
        configurable: true
    });
    Sprite.prototype.setOriginal = function (original) {
        this._original = original;
    };
    Sprite.prototype.createClone = function (stage) {
        var _a, e_39, _b, e_40, _c;
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.CLONED_NOT_READY);
        }
        if (!stage) {
            stage = this.stage;
        }
        var clone = new Sprite(stage, this.layer);
        clone.setOriginal(this);
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
        (_a = clone._tags).push.apply(_a, __spreadArray([], __read(this.tags), false));
        clone.defaultColliderNone = this.defaultColliderNone;
        for (var i = 0; i < this.costumes.length; i++) {
            clone.cloneCostume(this.costumes[i], this.costumeNames[i]);
        }
        clone.switchCostume(this.costumeIndex);
        try {
            for (var _d = __values(this.sounds.entries()), _e = _d.next(); !_e.done; _e = _d.next()) {
                var _f = __read(_e.value, 2), soundIndex = _f[0], sound = _f[1];
                clone.sounds.push(sound);
                clone.soundNames.push(this.soundNames[soundIndex]);
            }
        }
        catch (e_39_1) { e_39 = { error: e_39_1 }; }
        finally {
            try {
                if (_e && !_e.done && (_b = _d.return)) _b.call(_d);
            }
            finally { if (e_39) throw e_39.error; }
        }
        clone.currentColliderName = null;
        clone.cloneCollider(this);
        if (this.currentColliderName) {
            clone.switchCollider(this.currentColliderName);
        }
        try {
            for (var _g = __values(this._children), _h = _g.next(); !_h.done; _h = _g.next()) {
                var child = _h.value;
                var childClone = child.createClone();
                clone.addChild(childClone);
                childClone.x = child.x;
                childClone.y = child.y;
                childClone.direction = child.direction;
            }
        }
        catch (e_40_1) { e_40 = { error: e_40_1 }; }
        finally {
            try {
                if (_h && !_h.done && (_c = _g.return)) _c.call(_g);
            }
            finally { if (e_40) throw e_40.error; }
        }
        clone.ready();
        return clone;
    };
    Sprite.prototype.delete = function () {
        var e_41, _a;
        if (this.deleted) {
            return;
        }
        this.stage.removeSprite(this, this.layer);
        this.eventEmitter.clearAll();
        this.removeCollider();
        this.scheduledCallbackExecutor = null;
        try {
            for (var _b = __values(this._children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                child.delete();
            }
        }
        catch (e_41_1) { e_41 = { error: e_41_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_41) throw e_41.error; }
        }
        var props = Object.keys(this);
        for (var i = 0; i < props.length; i++) {
            delete this[props[i]];
        }
        this.costumes = [];
        this.costumeNames = [];
        this.sounds = [];
        this.soundNames = [];
        this.onReadyCallbacks = [];
        this.tempScheduledCallbacks = [];
        this.scheduledCallbacks = [];
        this._children = [];
        this._deleted = true;
    };
    Sprite.prototype.deleteClones = function () {
        var _this = this;
        var spritesToDelete = this.stage.getSprites().filter(function (sprite) { return sprite.original === _this; });
        spritesToDelete.forEach(function (sprite) { return sprite.delete(); });
    };
    Sprite.prototype.tryDoOnReady = function () {
        var e_42, _a;
        if (this.onReadyPending && this.isReady()) {
            this.onReadyPending = false;
            if (this.costumes.length && this.costume === null) {
                this.switchCostume(0);
            }
            if (!this.defaultColliderNone && this.colliders.size === 0 && this.costumes.length) {
                var colliderName = 'main';
                this.setCostumeCollider(colliderName, 0);
                this.switchCollider(colliderName);
                this.updateColliderPosition(this.collider);
                this.updateColliderSize(this.collider);
            }
            if (!this.collider && this.colliders.size) {
                var colliderName = this.colliders.keys().next().value;
                this.switchCollider(colliderName);
                this.updateColliderPosition(this.collider);
                this.updateColliderSize(this.collider);
            }
            if (this.onReadyCallbacks.length) {
                try {
                    for (var _b = __values(this.onReadyCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var callback = _c.value;
                        callback();
                    }
                }
                catch (e_42_1) { e_42 = { error: e_42_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_42) throw e_42.error; }
                }
                this.onReadyCallbacks = [];
            }
            this.stage.eventEmitter.emit(Game.SPRITE_READY_EVENT, {
                sprite: this,
                stageId: this.stage.id
            });
        }
    };
    return Sprite;
}());
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var MultiplayerGame = (function (_super) {
    __extends(MultiplayerGame, _super);
    function MultiplayerGame(socketUrl, gameToken, width, height, canvasId, displayErrors, locale, lobbyId, autoSyncGame, multiplayerOptions) {
        if (canvasId === void 0) { canvasId = null; }
        if (displayErrors === void 0) { displayErrors = true; }
        if (locale === void 0) { locale = 'ru'; }
        if (lobbyId === void 0) { lobbyId = 0; }
        if (autoSyncGame === void 0) { autoSyncGame = 0; }
        if (multiplayerOptions === void 0) { multiplayerOptions = {}; }
        var _this = _super.call(this, width, height, canvasId, displayErrors, locale) || this;
        _this.autoSyncGameTimeout = 0;
        _this.players = [];
        _this.sharedObjects = [];
        _this.autoSyncGameTimeout = autoSyncGame;
        _this.initializeConnection(socketUrl, gameToken, lobbyId, multiplayerOptions);
        return _this;
    }
    MultiplayerGame.prototype.send = function (userData, parameters, syncPackName, syncData) {
        if (parameters === void 0) { parameters = {}; }
        if (syncData === void 0) { syncData = []; }
        if (!this.connection) {
            throw new Error('Connection to the server is not established.');
        }
        var data = {
            'data': userData,
            'sync': this.packSyncData(syncPackName, syncData)
        };
        this.connection.sendData(JSON.stringify(data), parameters);
    };
    MultiplayerGame.prototype.sync = function (syncPackName, syncData, parameters) {
        if (syncData === void 0) { syncData = []; }
        if (parameters === void 0) { parameters = {}; }
        if (!syncData.length) {
            return;
        }
        parameters.SyncGame = 'true';
        var data = this.packSyncData(syncPackName, syncData);
        this.sendData(JSON.stringify(data), parameters);
    };
    MultiplayerGame.prototype.syncGame = function () {
        var syncObjects = this.getSyncObjects();
        var syncData = this.packSyncData('game', syncObjects);
        this.sendData(JSON.stringify(syncData), {
            SyncGame: 'true'
        });
    };
    MultiplayerGame.prototype.onConnection = function (callback) {
        this.onConnectionCallback = callback;
    };
    MultiplayerGame.prototype.removeConnectionHandler = function (callback) {
        this.onConnectionCallback = null;
    };
    MultiplayerGame.prototype.onReceive = function (callback) {
        this.onReceiveCallback = callback;
    };
    MultiplayerGame.prototype.removeReceiveHandler = function (callback) {
        this.onReceiveCallback = null;
    };
    MultiplayerGame.prototype.onMemberJoined = function (callback) {
        this.onMemberJoinedCallback = callback;
    };
    MultiplayerGame.prototype.removeMemberJoinedHandler = function (callback) {
        this.onMemberJoinedCallback = null;
    };
    MultiplayerGame.prototype.onMemberLeft = function (callback) {
        this.onMemberLeftCallback = callback;
    };
    MultiplayerGame.prototype.removeMemberLeftHandler = function (callback) {
        this.onMemberLeftCallback = null;
    };
    MultiplayerGame.prototype.onGameStarted = function (callback) {
        this.onGameStartedCallback = callback;
    };
    MultiplayerGame.prototype.removeGameStartedHandler = function (callback) {
        this.onGameStartedCallback = null;
    };
    MultiplayerGame.prototype.onGameStopped = function (callback) {
        this.onGameStoppedCallback = callback;
    };
    MultiplayerGame.prototype.removeGameStoppedHandler = function (callback) {
        this.onGameStoppedCallback = null;
    };
    MultiplayerGame.prototype.onMultiplayerError = function (callback) {
        this.onMultiplayerErrorCallback = callback;
    };
    MultiplayerGame.prototype.removeMultiplayerErrorHandler = function (callback) {
        this.onMultiplayerErrorCallback = null;
    };
    MultiplayerGame.prototype.run = function () {
        _super.prototype.run.call(this);
        if (this.isHost && this.autoSyncGameTimeout) {
            this.autoSyncGame(this.autoSyncGameTimeout);
        }
    };
    MultiplayerGame.prototype.stop = function () {
        var e_43, _a;
        _super.prototype.stop.call(this);
        try {
            for (var _b = __values(this.players), _c = _b.next(); !_c.done; _c = _b.next()) {
                var player = _c.value;
                player.delete();
            }
        }
        catch (e_43_1) { e_43 = { error: e_43_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_43) throw e_43.error; }
        }
        this.players = [];
    };
    MultiplayerGame.prototype.getPlayers = function () {
        return this.players;
    };
    MultiplayerGame.prototype.addSharedObject = function (sharedObject) {
        this.sharedObjects.push(sharedObject);
    };
    MultiplayerGame.prototype.removeSharedObject = function (sharedObject) {
        var index = this.sharedObjects.indexOf(sharedObject);
        if (index > -1) {
            this.sharedObjects.splice(index, 1);
        }
    };
    MultiplayerGame.prototype.getSharedObjects = function () {
        return this.sharedObjects;
    };
    MultiplayerGame.prototype.getMultiplayerSprites = function () {
        if (!this.getActiveStage()) {
            return [];
        }
        return this.getActiveStage().getSprites().filter(function (sprite) {
            return sprite instanceof MultiplayerSprite;
        });
    };
    MultiplayerGame.prototype.getSyncObjects = function () {
        var multiplayerSprites = this.getMultiplayerSprites();
        var players = this.getPlayers();
        var sharedObjects = this.getSharedObjects();
        return __spreadArray(__spreadArray(__spreadArray([], __read(multiplayerSprites), false), __read(players), false), __read(sharedObjects), false);
    };
    MultiplayerGame.prototype.syncObjects = function (syncData, deltaTime) {
        var e_44, _a, e_45, _b;
        var gameAllSyncObjects = this.getSyncObjects();
        try {
            for (var _c = __values(Object.entries(syncData)), _d = _c.next(); !_d.done; _d = _c.next()) {
                var _e = __read(_d.value, 2), syncPackName = _e[0], syncObjectsData = _e[1];
                try {
                    for (var gameAllSyncObjects_1 = (e_45 = void 0, __values(gameAllSyncObjects)), gameAllSyncObjects_1_1 = gameAllSyncObjects_1.next(); !gameAllSyncObjects_1_1.done; gameAllSyncObjects_1_1 = gameAllSyncObjects_1.next()) {
                        var syncObject = gameAllSyncObjects_1_1.value;
                        if (syncObjectsData[syncObject.getMultiplayerName()]) {
                            var syncPackData = syncObjectsData[syncObject.getMultiplayerName()];
                            syncObject.setSyncData(syncPackName, syncPackData, deltaTime);
                        }
                    }
                }
                catch (e_45_1) { e_45 = { error: e_45_1 }; }
                finally {
                    try {
                        if (gameAllSyncObjects_1_1 && !gameAllSyncObjects_1_1.done && (_b = gameAllSyncObjects_1.return)) _b.call(gameAllSyncObjects_1);
                    }
                    finally { if (e_45) throw e_45.error; }
                }
            }
        }
        catch (e_44_1) { e_44 = { error: e_44_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_44) throw e_44.error; }
        }
    };
    MultiplayerGame.prototype.packSyncData = function (packName, syncObjects) {
        var e_46, _a;
        var syncObjectsData = {};
        try {
            for (var syncObjects_1 = __values(syncObjects), syncObjects_1_1 = syncObjects_1.next(); !syncObjects_1_1.done; syncObjects_1_1 = syncObjects_1.next()) {
                var syncObject = syncObjects_1_1.value;
                syncObjectsData[syncObject.getMultiplayerName()] = syncObject.getSyncData();
                syncObjectsData[syncObject.getMultiplayerName()]['syncId'] = syncObject.increaseSyncId();
            }
        }
        catch (e_46_1) { e_46 = { error: e_46_1 }; }
        finally {
            try {
                if (syncObjects_1_1 && !syncObjects_1_1.done && (_a = syncObjects_1.return)) _a.call(syncObjects_1);
            }
            finally { if (e_46) throw e_46.error; }
        }
        var result = {};
        result[packName] = syncObjectsData;
        return result;
    };
    MultiplayerGame.prototype.sendData = function (data, parameters) {
        if (parameters === void 0) { parameters = {}; }
        if (!this.connection) {
            throw new Error('Connection to the server is not established.');
        }
        this.connection.sendData(data, parameters);
    };
    MultiplayerGame.prototype.calcDeltaTime = function (sendTime) {
        return Date.now() - sendTime - this.connection.deltaTime;
    };
    MultiplayerGame.prototype.extrapolate = function (callback, deltaTime, timeout) {
        var times = Math.round((deltaTime / timeout) * 0.75);
        for (var i = 0; i < times; i++) {
            callback();
        }
    };
    MultiplayerGame.prototype.initializeConnection = function (socketUrl_1, gameToken_1, lobbyId_1) {
        return __awaiter(this, arguments, void 0, function (socketUrl, gameToken, lobbyId, multiplayerOptions) {
            var socket, _a, error_1;
            var _this = this;
            if (multiplayerOptions === void 0) { multiplayerOptions = {}; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        socket = new JetcodeSocket(socketUrl);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4, socket.connect(gameToken, lobbyId, multiplayerOptions)];
                    case 2:
                        _a.connection = _b.sent();
                        if (this.onConnectionCallback) {
                            this.onConnectionCallback(this.connection);
                        }
                        this.connection.connect(JetcodeSocket.RECEIVE_DATA, function (data, parameters, isMe) {
                            if (!data || !_this.running || !parameters.SendTime) {
                                return;
                            }
                            if (parameters.SyncGame === 'true') {
                                var syncObjectsData = JSON.parse(data);
                                _this.syncObjects(syncObjectsData, _this.calcDeltaTime(parameters.SendTime));
                            }
                            else if (parameters.Keydown !== 'true' && parameters.Mousedown !== 'true' && _this.onReceiveCallback) {
                                data = JSON.parse(data);
                                var userData = data['userData'];
                                var syncSpritesData = data['sync'];
                                _this.syncObjects(syncSpritesData, _this.calcDeltaTime(parameters.SendTime));
                                _this.onReceiveCallback(userData, parameters, isMe);
                            }
                        });
                        this.connection.connect(JetcodeSocket.MEMBER_JOINED, function (parameters, isMe) {
                            if (_this.onMemberJoinedCallback) {
                                _this.onMemberJoinedCallback(parameters, isMe);
                            }
                        });
                        this.connection.connect(JetcodeSocket.MEMBER_LEFT, function (parameters, isMe) {
                            if (_this.onMemberLeftCallback) {
                                _this.onMemberLeftCallback(parameters, isMe);
                            }
                        });
                        this.connection.connect(JetcodeSocket.GAME_STARTED, function (parameters) {
                            var _a, _b;
                            var hostId = parameters.HostId;
                            var playerIds = (_b = (_a = parameters.Members) === null || _a === void 0 ? void 0 : _a.split(',')) !== null && _b !== void 0 ? _b : [];
                            _this.players = playerIds.map(function (playerId) {
                                return new Player(playerId, playerId === _this.connection.memberId, _this);
                            });
                            _this.isHost = hostId === _this.connection.memberId;
                            if (_this.onGameStartedCallback) {
                                _this.onGameStartedCallback(_this.players, parameters);
                            }
                        });
                        this.connection.connect(JetcodeSocket.GAME_STOPPED, function (parameters) {
                            if (_this.onGameStoppedCallback) {
                                _this.onGameStoppedCallback(parameters);
                            }
                        });
                        this.connection.connect(JetcodeSocket.ERROR, function (parameters) {
                            if (_this.onMultiplayerError) {
                                _this.onMultiplayerError(parameters);
                            }
                        });
                        return [3, 4];
                    case 3:
                        error_1 = _b.sent();
                        console.error(error_1);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    MultiplayerGame.prototype.autoSyncGame = function (timeout) {
        var _this = this;
        var hander = function () {
            _this.syncGame();
        };
        setInterval(hander, timeout);
    };
    return MultiplayerGame;
}(Game));
var MultiplayerSprite = (function (_super) {
    __extends(MultiplayerSprite, _super);
    function MultiplayerSprite(multiplayerName, stage, layer, costumePaths) {
        if (stage === void 0) { stage = null; }
        if (layer === void 0) { layer = 1; }
        if (costumePaths === void 0) { costumePaths = []; }
        var _this = _super.call(this, stage, layer, costumePaths) || this;
        _this.multiplayerName = 'sprite_' + multiplayerName;
        _this.syncId = 1;
        _this.reservedProps = Object.keys(_this);
        _this.reservedProps.push('body');
        _this.reservedProps.push('reservedProps');
        return _this;
    }
    MultiplayerSprite.prototype.generateUniqueId = function () {
        return Math.random().toString(36).slice(2) + '-' + Math.random().toString(36).slice(2);
    };
    MultiplayerSprite.prototype.getCustomerProperties = function () {
        var e_47, _a;
        var data = {};
        try {
            for (var _b = __values(Object.keys(this)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (this.reservedProps.includes(key)) {
                    continue;
                }
                data[key] = this[key];
            }
        }
        catch (e_47_1) { e_47 = { error: e_47_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_47) throw e_47.error; }
        }
        return data;
    };
    MultiplayerSprite.prototype.getMultiplayerName = function () {
        return this.multiplayerName;
    };
    MultiplayerSprite.prototype.getSyncId = function () {
        return this.syncId;
    };
    MultiplayerSprite.prototype.increaseSyncId = function () {
        this.syncId++;
        return this.syncId;
    };
    MultiplayerSprite.prototype.getSyncData = function () {
        return Object.assign({}, this.getCustomerProperties(), {
            size: this.size,
            rotateStyle: this.rotateStyle,
            costumeIndex: this.costumeIndex,
            deleted: this._deleted,
            x: this.x,
            y: this.y,
            direction: this.direction,
            hidden: this.hidden,
            stopped: this.stopped,
        });
    };
    MultiplayerSprite.prototype.setSyncData = function (packName, data, deltaTime) {
        var oldData = {};
        for (var key in data) {
            if (data.hasOwnProperty(key) && !this.reservedProps.includes(key)) {
                oldData[key] = this[key];
                this[key] = data[key];
            }
        }
        if (this.syncCallback) {
            this.syncCallback(this, packName, data, oldData, deltaTime);
        }
    };
    MultiplayerSprite.prototype.onSync = function (callback) {
        this.syncCallback = callback;
    };
    MultiplayerSprite.prototype.removeSyncHandler = function () {
        this.syncCallback = null;
    };
    MultiplayerSprite.prototype.only = function () {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        return new OrphanSharedData(this, properties);
    };
    return MultiplayerSprite;
}(Sprite));
var OrphanSharedData = (function () {
    function OrphanSharedData(parent, properties) {
        this.parent = parent;
        this.properties = properties;
    }
    OrphanSharedData.prototype.getMultiplayerName = function () {
        return this.parent.getMultiplayerName();
    };
    OrphanSharedData.prototype.getSyncId = function () {
        return this.parent.getSyncId();
    };
    OrphanSharedData.prototype.increaseSyncId = function () {
        return this.parent.increaseSyncId();
    };
    OrphanSharedData.prototype.getSyncData = function () {
        var e_48, _a;
        var syncData = {};
        try {
            for (var _b = __values(this.properties), _c = _b.next(); !_c.done; _c = _b.next()) {
                var property = _c.value;
                if (this.parent[property]) {
                    syncData[property] = this.parent[property];
                }
            }
        }
        catch (e_48_1) { e_48 = { error: e_48_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_48) throw e_48.error; }
        }
        return syncData;
    };
    OrphanSharedData.prototype.setSyncData = function (packName, data, deltaTime) {
        this.parent.setSyncData(packName, data, deltaTime);
    };
    OrphanSharedData.prototype.onSync = function (callback) {
        throw new Error('Not implemented.');
    };
    OrphanSharedData.prototype.removeSyncHandler = function () {
        throw new Error('Not implemented.');
    };
    OrphanSharedData.prototype.only = function () {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        throw new Error('Not implemented.');
    };
    return OrphanSharedData;
}());
var Player = (function () {
    function Player(id, isMe, game) {
        this.deleted = false;
        this.id = id;
        this._isMe = isMe;
        this.game = game;
        this.multiplayerName = 'player_' + id;
        this.syncId = 1;
        this.control = new MultiplayerControl(this, this.game, game.connection, isMe);
        this.reservedProps = Object.keys(this);
        this.reservedProps.push('reservedProps');
    }
    Player.prototype.keyDown = function (char, callback, syncPackName, syncData) {
        if (syncData === void 0) { syncData = []; }
        this.control.keyDown(char, callback, syncPackName, syncData);
    };
    Player.prototype.removeKeyDownHandler = function (char) {
        this.control.removeKeyDownHandler(char);
    };
    Player.prototype.mouseDown = function (callback, syncPackName, syncData) {
        if (syncData === void 0) { syncData = []; }
        this.control.mouseDown(callback, syncPackName, syncData);
    };
    Player.prototype.removeMouseDownHandler = function () {
        this.control.removeMouseDownHandler();
    };
    Player.prototype.isMe = function () {
        return this._isMe;
    };
    Player.prototype.delete = function () {
        if (this.deleted) {
            return;
        }
        this.control.stop();
        var props = Object.keys(this);
        for (var i = 0; i < props.length; i++) {
            delete this[props[i]];
        }
        this.deleted = true;
    };
    Player.prototype.repeat = function (i, callback, timeout, finishCallback) {
        var _this = this;
        if (this.deleted) {
            finishCallback();
            return;
        }
        if (i < 1) {
            finishCallback();
            return;
        }
        var result = callback(this);
        if (result === false) {
            finishCallback();
            return;
        }
        if (result > 0) {
            timeout = result;
        }
        i--;
        if (i < 1) {
            finishCallback();
            return;
        }
        setTimeout(function () {
            requestAnimationFrame(function () { return _this.repeat(i, callback, timeout, finishCallback); });
        }, timeout);
    };
    Player.prototype.forever = function (callback, timeout) {
        var _this = this;
        if (timeout === void 0) { timeout = null; }
        if (this.deleted) {
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
    Player.prototype.timeout = function (callback, timeout) {
        var _this = this;
        setTimeout(function () {
            if (_this.deleted) {
                return;
            }
            requestAnimationFrame(function () { return callback(_this); });
        }, timeout);
    };
    Player.prototype.getMultiplayerName = function () {
        return this.multiplayerName;
    };
    Player.prototype.getSyncId = function () {
        return this.syncId;
    };
    Player.prototype.increaseSyncId = function () {
        this.syncId++;
        return this.syncId;
    };
    Player.prototype.getSyncData = function () {
        var e_49, _a;
        var data = {};
        try {
            for (var _b = __values(Object.keys(this)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                if (this.reservedProps.includes(key)) {
                    continue;
                }
                data[key] = this[key];
            }
        }
        catch (e_49_1) { e_49 = { error: e_49_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_49) throw e_49.error; }
        }
        return data;
    };
    Player.prototype.setSyncData = function (packName, data, deltaTime) {
        var oldData = {};
        for (var key in data) {
            if (data.hasOwnProperty(key) && !this.reservedProps.includes(key)) {
                oldData[key] = this[key];
                this[key] = data[key];
            }
        }
        if (this.syncCallback) {
            this.syncCallback(this, packName, data, oldData, deltaTime);
        }
    };
    Player.prototype.onSync = function (callback) {
        this.syncCallback = callback;
    };
    Player.prototype.removeSyncHandler = function () {
        this.syncCallback = null;
    };
    Player.prototype.only = function () {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        return new OrphanSharedData(this, properties);
    };
    return Player;
}());
var ScheduledCallbackExecutor = (function () {
    function ScheduledCallbackExecutor(context) {
        this.context = context;
    }
    ScheduledCallbackExecutor.prototype.execute = function (now, diffTime) {
        var _this = this;
        return function (item) {
            var state = item.state;
            if (_this.context instanceof Sprite) {
                if (_this.context.deleted) {
                    return false;
                }
                if (_this.context.stopped) {
                    return true;
                }
            }
            if (item.timeout && diffTime) {
                item.timeout += diffTime;
            }
            if (!item.timeout || item.timeout <= now) {
                var result = item.callback.bind(_this.context)(_this.context, state);
                if (state.maxIterations) {
                    state.currentIteration++;
                }
                var isFinished = result === false ||
                    (item.timeout && !state.interval && !state.maxIterations) ||
                    (state.maxIterations && state.currentIteration >= state.maxIterations);
                if (isFinished) {
                    if (item.finishCallback) {
                        item.finishCallback(_this.context, state);
                    }
                    return false;
                }
                if (state.interval) {
                    item.timeout = now + state.interval;
                }
            }
            return true;
        };
    };
    return ScheduledCallbackExecutor;
}());
var ScheduledCallbackItem = (function () {
    function ScheduledCallbackItem(callback, state, timeout, finishCallback) {
        this.callback = callback;
        this.state = state;
        this.timeout = timeout;
        this.finishCallback = finishCallback;
    }
    return ScheduledCallbackItem;
}());
var ScheduledState = (function () {
    function ScheduledState(interval, maxIterations, currentIteration) {
        this.interval = interval;
        this.maxIterations = maxIterations;
        this.currentIteration = currentIteration;
    }
    return ScheduledState;
}());
var SharedData = (function () {
    function SharedData(multiplayerName) {
        this.multiplayerName = 'data_' + multiplayerName;
        this.syncId = 1;
        if (!Registry.getInstance().has('game')) {
            throw new Error('You need create Game instance before Sprite instance.');
        }
        var game = Registry.getInstance().get('game');
        game.addSharedObject(this);
    }
    SharedData.prototype.generateUniqueId = function () {
        return Math.random().toString(36).slice(2) + '-' + Math.random().toString(36).slice(2);
    };
    SharedData.prototype.getMultiplayerName = function () {
        return this.multiplayerName;
    };
    SharedData.prototype.getSyncId = function () {
        return this.syncId;
    };
    SharedData.prototype.increaseSyncId = function () {
        this.syncId++;
        return this.syncId;
    };
    SharedData.prototype.getSyncData = function () {
        var e_50, _a;
        var data = {};
        try {
            for (var _b = __values(Object.keys(this)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var key = _c.value;
                data[key] = this[key];
            }
        }
        catch (e_50_1) { e_50 = { error: e_50_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_50) throw e_50.error; }
        }
        return data;
    };
    SharedData.prototype.setSyncData = function (packName, data, deltaTime) {
        var oldData = {};
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                oldData[key] = this[key];
                this[key] = data[key];
            }
        }
        if (this.syncCallback) {
            this.syncCallback(this, packName, data, oldData, deltaTime);
        }
    };
    SharedData.prototype.onSync = function (callback) {
        this.syncCallback = callback;
    };
    SharedData.prototype.removeSyncHandler = function () {
        this.syncCallback = null;
    };
    SharedData.prototype.only = function () {
        var properties = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            properties[_i] = arguments[_i];
        }
        return new OrphanSharedData(this, properties);
    };
    return SharedData;
}());
var Stage = (function () {
    function Stage(background) {
        if (background === void 0) { background = null; }
        this.background = null;
        this.backgroundIndex = null;
        this.backgrounds = [];
        this.sprites = new Map();
        this.drawings = new Map();
        this.sounds = [];
        this.soundNames = [];
        this.addedSprites = 0;
        this.loadedSprites = 0;
        this.pendingBackgrounds = 0;
        this.pendingSounds = 0;
        this.pendingRun = false;
        this.onReadyPending = true;
        this.onReadyCallbacks = [];
        this.onStartCallbacks = [];
        this.scheduledCallbacks = [];
        this.tempScheduledCallbacks = [];
        this._stopped = true;
        this._running = false;
        this.stoppedTime = null;
        this.diffTime = null;
        if (!Registry.getInstance().has('game')) {
            throw new Error('You need create Game instance before Stage instance.');
        }
        this.game = Registry.getInstance().get('game');
        var stage = this;
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
    Stage.prototype.init = function () { };
    Stage.prototype.onStart = function (onStartCallback) {
        this.onStartCallbacks.push(onStartCallback);
    };
    Stage.prototype.onReady = function (callback) {
        this.onReadyCallbacks.push(callback);
    };
    Object.defineProperty(Stage.prototype, "running", {
        get: function () {
            return this._running;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "stopped", {
        get: function () {
            return this._stopped;
        },
        enumerable: false,
        configurable: true
    });
    Stage.prototype.isReady = function () {
        return this.addedSprites == this.loadedSprites && this.pendingBackgrounds === 0;
    };
    Object.defineProperty(Stage.prototype, "width", {
        get: function () {
            return this.canvas.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "height", {
        get: function () {
            return this.canvas.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Stage.prototype, "backgroundColor", {
        set: function (color) {
            this.drawBackground(function (context, stage) {
                context.fillStyle = color;
                context.fillRect(0, 0, stage.width, stage.height);
            });
        },
        enumerable: false,
        configurable: true
    });
    Stage.prototype.drawBackground = function (callback) {
        var backgroundCanvas = document.createElement('canvas');
        var context = backgroundCanvas.getContext('2d');
        backgroundCanvas.width = this.width;
        backgroundCanvas.height = this.height;
        this.pendingBackgrounds++;
        callback(context, this);
        this.backgrounds.push(backgroundCanvas);
        this.pendingBackgrounds--;
        return this;
    };
    Stage.prototype.addBackground = function (backgroundPath) {
        var _this = this;
        var backgroundImage = new Image();
        backgroundImage.src = backgroundPath;
        this.pendingBackgrounds++;
        var onLoad = function () {
            var backgroundCanvas = document.createElement('canvas');
            var context = backgroundCanvas.getContext('2d');
            backgroundCanvas.width = _this.width;
            backgroundCanvas.height = _this.height;
            context.drawImage(backgroundImage, 0, 0, _this.width, _this.height);
            _this.backgrounds.push(backgroundCanvas);
            _this.pendingBackgrounds--;
            _this.tryDoOnReady();
            _this.tryDoRun();
            backgroundImage.removeEventListener('load', onLoad);
        };
        backgroundImage.addEventListener('load', onLoad);
        backgroundImage.addEventListener('error', function () {
            _this.game.throwError(ErrorMessages.BACKGROUND_NOT_LOADED, { backgroundPath: backgroundPath });
        });
        return this;
    };
    Stage.prototype.switchBackground = function (backgroundIndex) {
        this.backgroundIndex = backgroundIndex;
        var background = this.backgrounds[backgroundIndex];
        if (background) {
            this.background = background;
        }
    };
    Stage.prototype.nextBackground = function () {
        var nextBackgroundIndex = this.backgroundIndex + 1;
        if (nextBackgroundIndex > this.backgrounds.length - 1) {
            nextBackgroundIndex = 0;
        }
        if (nextBackgroundIndex !== this.backgroundIndex) {
            this.switchBackground(nextBackgroundIndex);
        }
    };
    Stage.prototype.addSound = function (soundPath, soundName) {
        var _this = this;
        if (this.soundNames.includes(soundName)) {
            this.game.throwError(ErrorMessages.SOUND_NAME_ALREADY_EXISTS, { soundName: soundName });
        }
        var sound = new Audio();
        sound.src = soundPath;
        this.sounds.push(sound);
        this.soundNames.push(soundName);
        this.pendingSounds++;
        sound.load();
        var onLoadSound = function () {
            _this.pendingSounds--;
            _this.tryDoOnReady();
            sound.removeEventListener('loadedmetadata', onLoadSound);
        };
        sound.addEventListener('loadedmetadata', onLoadSound);
        return this;
    };
    Stage.prototype.removeSound = function (soundName) {
        var soundIndex = this.soundNames.indexOf(soundName);
        if (soundIndex < 0) {
            this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, { soundName: soundName });
        }
        this.sounds.splice(soundIndex, 1);
        return this;
    };
    Stage.prototype.playSound = function (soundName, options) {
        if (options === void 0) { options = {}; }
        var sound = this.getSound(soundName);
        this.doPlaySound(sound, options);
    };
    Stage.prototype.startSound = function (soundName, options) {
        if (options === void 0) { options = {}; }
        var sound = this.cloneSound(soundName);
        this.doPlaySound(sound, options);
        return sound;
    };
    Stage.prototype.pauseSound = function (soundName) {
        var sound = this.getSound(soundName);
        sound.pause();
    };
    Stage.prototype.getSound = function (soundName) {
        if (!this.isReady()) {
            this.game.throwError(ErrorMessages.SOUND_USE_NOT_READY);
        }
        var soundIndex = this.soundNames.indexOf(soundName);
        if (soundIndex < 0) {
            this.game.throwError(ErrorMessages.SOUND_NAME_NOT_FOUND, { soundName: soundName });
        }
        var sound = this.sounds[soundIndex];
        if (!(sound instanceof Audio)) {
            this.game.throwError(ErrorMessages.SOUND_INDEX_NOT_FOUND, { soundIndex: soundIndex });
        }
        return sound;
    };
    Stage.prototype.cloneSound = function (soundName) {
        var originSound = this.getSound(soundName);
        return new Audio(originSound.src);
    };
    Stage.prototype.doPlaySound = function (sound, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        if (options.volume !== undefined) {
            sound.volume = options.volume;
        }
        if (options.currentTime !== undefined) {
            sound.currentTime = options.currentTime;
        }
        if (options.loop !== undefined) {
            sound.loop = options.loop;
        }
        var playPromise = sound.play();
        if (playPromise !== undefined) {
            playPromise.catch(function (error) {
                if (error.name === "NotAllowedError") {
                    _this.game.throwError(ErrorMessages.SOUND_NOT_ALLOWED_ERROR, {}, false);
                }
                else {
                    console.error("Audio playback error:", error);
                }
            });
        }
    };
    Stage.prototype.addSprite = function (sprite) {
        var layerSprites;
        if (this.sprites.has(sprite.layer)) {
            layerSprites = this.sprites.get(sprite.layer);
        }
        else {
            layerSprites = [];
            this.sprites.set(sprite.layer, layerSprites);
        }
        layerSprites.push(sprite);
        this.addedSprites++;
        return this;
    };
    Stage.prototype.removeSprite = function (sprite, layer) {
        if (!this.sprites.has(layer)) {
            this.game.throwErrorRaw('The layer "' + layer + '" not defined in the stage.');
        }
        var layerSprites = this.sprites.get(layer);
        layerSprites.splice(layerSprites.indexOf(sprite), 1);
        if (!layerSprites.length) {
            this.sprites.delete(layer);
        }
        if (sprite.deleted || sprite.isReady()) {
            this.loadedSprites--;
        }
        this.addedSprites--;
        return this;
    };
    Stage.prototype.getSprites = function () {
        return Array.from(this.sprites.values()).reduce(function (accumulator, currentValue) { return accumulator.concat(currentValue); }, []);
    };
    Stage.prototype.changeSpriteLayer = function (sprite, fromLayer, toLayer) {
        if (!this.sprites.has(fromLayer)) {
            this.game.throwErrorRaw('The layer "' + fromLayer + '" not defined in the stage.');
        }
        var fromLayerSprites = this.sprites.get(fromLayer);
        fromLayerSprites.splice(fromLayerSprites.indexOf(sprite), 1);
        if (!fromLayerSprites.length) {
            this.sprites.delete(fromLayer);
        }
        var toLayerSprites = [];
        if (this.sprites.has(toLayer)) {
            toLayerSprites = this.sprites.get(toLayer);
        }
        else {
            this.sprites.set(toLayer, toLayerSprites);
        }
        toLayerSprites.push(sprite);
    };
    Stage.prototype.drawSprite = function (sprite) {
        var costume = sprite.getCostume();
        var image = costume.image;
        var dstX = sprite.imageCenterX - sprite.sourceWidth / 2;
        var dstY = sprite.imageCenterY - sprite.sourceHeight / 2;
        var dstWidth = sprite.sourceWidth;
        var dstHeight = sprite.sourceHeight;
        var direction = sprite.globalDirection;
        var rotateStyle = sprite.rotateStyle;
        var colliderOffsetX = (sprite.sourceWidth - costume.width * sprite.size / 100) / 2;
        var colliderOffsetY = (sprite.sourceHeight - costume.height * sprite.size / 100) / 2;
        var needSave = (rotateStyle === 'normal' && direction !== 0) ||
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
            this.context.drawImage(image, 0, 0, costume.width, costume.height, -dstX - dstWidth + colliderOffsetX, dstY + colliderOffsetY, costume.width * sprite.size / 100, costume.height * sprite.size / 100);
        }
        else {
            this.context.drawImage(image, 0, 0, costume.width, costume.height, dstX + colliderOffsetX, dstY + colliderOffsetY, costume.width * sprite.size / 100, costume.height * sprite.size / 100);
        }
        if (needSave) {
            this.context.restore();
        }
    };
    Stage.prototype.stampImage = function (stampImage, x, y, direction) {
        if (direction === void 0) { direction = 0; }
        if (this.background instanceof HTMLCanvasElement) {
            var backgroundCanvas = document.createElement('canvas');
            var context = backgroundCanvas.getContext('2d');
            backgroundCanvas.width = this.width;
            backgroundCanvas.height = this.height;
            context.drawImage(this.background, 0, 0, this.width, this.height);
            var stampWidth = stampImage instanceof HTMLImageElement ? stampImage.naturalWidth : stampImage.width;
            var stampHeight = stampImage instanceof HTMLImageElement ? stampImage.naturalHeight : stampImage.height;
            var stampDstX = x - stampWidth / 2;
            var stampDstY = y - stampHeight / 2;
            if (direction !== 0) {
                var angleRadians = direction * Math.PI / 180;
                context.translate(stampDstX + stampWidth / 2, stampDstY + stampHeight / 2);
                context.rotate(angleRadians);
                context.translate(-stampDstX - stampWidth / 2, -stampDstY - stampHeight / 2);
            }
            context.drawImage(stampImage, stampDstX, stampDstY, stampWidth, stampHeight);
            this.background = backgroundCanvas;
            this.backgrounds[this.backgroundIndex] = this.background;
        }
    };
    Stage.prototype.pen = function (callback, layer) {
        if (layer === void 0) { layer = 0; }
        var layerDrawings;
        if (this.drawings.has(layer)) {
            layerDrawings = this.drawings.get(layer);
        }
        else {
            layerDrawings = [];
            this.drawings.set(layer, layerDrawings);
        }
        layerDrawings.push(callback);
    };
    Stage.prototype.timeout = function (callback, timeout) {
        this.repeat(callback, 1, null, timeout, undefined);
    };
    Stage.prototype.repeat = function (callback, repeat, interval, timeout, finishCallback) {
        if (interval === void 0) { interval = null; }
        if (timeout === void 0) { timeout = null; }
        var state = new ScheduledState(interval, repeat, 0);
        if (timeout) {
            timeout = Date.now() + timeout;
        }
        this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));
        return state;
    };
    Stage.prototype.forever = function (callback, interval, timeout, finishCallback) {
        if (interval === void 0) { interval = null; }
        if (timeout === void 0) { timeout = null; }
        var state = new ScheduledState(interval);
        if (timeout) {
            timeout = Date.now() + timeout;
        }
        this.tempScheduledCallbacks.push(new ScheduledCallbackItem(callback, state, timeout, finishCallback));
        return state;
    };
    Stage.prototype.render = function () {
        var e_51, _a, e_52, _b, e_53, _c;
        var _this = this;
        this.update();
        this.collisionSystem.update();
        this.context.clearRect(this.camera.startCornerX, this.camera.startCornerY, this.width, this.height);
        if (this.background) {
            this.context.drawImage(this.background, 0, 0, this.width, this.height);
        }
        var layers = Array.from(this.sprites.keys()).concat(Array.from(this.drawings.keys()));
        layers = layers.filter(function (item, pos) { return layers.indexOf(item) === pos; });
        layers = layers.sort(function (a, b) { return a - b; });
        try {
            for (var layers_1 = __values(layers), layers_1_1 = layers_1.next(); !layers_1_1.done; layers_1_1 = layers_1.next()) {
                var layer = layers_1_1.value;
                if (this.drawings.has(layer)) {
                    var layerDrawings = this.drawings.get(layer);
                    try {
                        for (var layerDrawings_1 = (e_52 = void 0, __values(layerDrawings)), layerDrawings_1_1 = layerDrawings_1.next(); !layerDrawings_1_1.done; layerDrawings_1_1 = layerDrawings_1.next()) {
                            var drawing = layerDrawings_1_1.value;
                            drawing(this.context, this);
                        }
                    }
                    catch (e_52_1) { e_52 = { error: e_52_1 }; }
                    finally {
                        try {
                            if (layerDrawings_1_1 && !layerDrawings_1_1.done && (_b = layerDrawings_1.return)) _b.call(layerDrawings_1);
                        }
                        finally { if (e_52) throw e_52.error; }
                    }
                }
                if (this.sprites.has(layer)) {
                    var layerSprites = this.sprites.get(layer);
                    var _loop_1 = function (sprite) {
                        var e_54, _d;
                        if (sprite.hidden) {
                            return "continue";
                        }
                        var distance = Math.hypot(sprite.imageCenterX - this_1.camera.x, sprite.imageCenterY - this_1.camera.y);
                        var spriteRadius = Math.hypot(sprite.sourceWidth, sprite.sourceHeight) / 2 * this_1.camera.zoom;
                        if (distance > this_1.camera.renderRadius + spriteRadius) {
                            return "continue";
                        }
                        if (this_1.game.debugMode !== 'none') {
                            var fn = function () {
                                var x = sprite.imageCenterX - (_this.context.measureText(sprite.name).width / 2);
                                var y = sprite.imageCenterY + sprite.height + 20;
                                _this.context.fillStyle = _this.game.debugColor;
                                _this.context.font = '16px Arial';
                                _this.context.fillText(sprite.name, x, y);
                                y += 20;
                                _this.context.font = '14px Arial';
                                _this.context.fillText('x: ' + sprite.x, x, y);
                                y += 20;
                                _this.context.fillText('y: ' + sprite.y, x, y);
                                y += 20;
                                _this.context.fillText('direction: ' + sprite.direction, x, y);
                                y += 20;
                                _this.context.fillText('costume: ' + sprite.getCostumeName(), x, y);
                                y += 20;
                                _this.context.fillText('xOffset: ' + sprite.pivotOffsetX, x, y);
                                y += 20;
                                _this.context.fillText('yOffset: ' + sprite.pivotOffsetY, x, y);
                                _this.context.beginPath();
                                _this.context.moveTo(sprite.globalX - 2, sprite.globalY);
                                _this.context.lineTo(sprite.globalX + 2, sprite.globalY);
                                _this.context.moveTo(sprite.globalX, sprite.globalY - 2);
                                _this.context.lineTo(sprite.globalX, sprite.globalY + 2);
                                _this.context.stroke();
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
                        if (sprite.getCostume()) {
                            this_1.drawSprite(sprite);
                        }
                        try {
                            for (var _e = (e_54 = void 0, __values(sprite.drawings)), _f = _e.next(); !_f.done; _f = _e.next()) {
                                var drawing = _f.value;
                                drawing(this_1.context, sprite);
                            }
                        }
                        catch (e_54_1) { e_54 = { error: e_54_1 }; }
                        finally {
                            try {
                                if (_f && !_f.done && (_d = _e.return)) _d.call(_e);
                            }
                            finally { if (e_54) throw e_54.error; }
                        }
                    };
                    var this_1 = this;
                    try {
                        for (var layerSprites_1 = (e_53 = void 0, __values(layerSprites)), layerSprites_1_1 = layerSprites_1.next(); !layerSprites_1_1.done; layerSprites_1_1 = layerSprites_1.next()) {
                            var sprite = layerSprites_1_1.value;
                            _loop_1(sprite);
                        }
                    }
                    catch (e_53_1) { e_53 = { error: e_53_1 }; }
                    finally {
                        try {
                            if (layerSprites_1_1 && !layerSprites_1_1.done && (_c = layerSprites_1.return)) _c.call(layerSprites_1);
                        }
                        finally { if (e_53) throw e_53.error; }
                    }
                }
            }
        }
        catch (e_51_1) { e_51 = { error: e_51_1 }; }
        finally {
            try {
                if (layers_1_1 && !layers_1_1.done && (_a = layers_1.return)) _a.call(layers_1);
            }
            finally { if (e_51) throw e_51.error; }
        }
        if (this.game.debugCollider) {
            this.context.strokeStyle = this.game.debugColor;
            this.context.beginPath();
            this.collisionSystem.draw(this.context);
            this.context.stroke();
        }
        this.context.translate(-this.camera.changes.x, -this.camera.changes.y);
        var centerPointX = this.width / 2 + this.camera.startCornerX;
        var centerPointY = this.height / 2 + this.camera.startCornerY;
        this.context.translate(centerPointX, centerPointY);
        this.context.scale(this.camera.changes.zoom, this.camera.changes.zoom);
        this.context.translate(-centerPointX, -centerPointY);
        this.camera.changes.reset();
    };
    Stage.prototype.update = function () {
        var _this = this;
        if (this.tempScheduledCallbacks.length) {
            this.scheduledCallbacks = this.scheduledCallbacks.concat(this.tempScheduledCallbacks);
            this.tempScheduledCallbacks = [];
        }
        this.scheduledCallbacks = this.scheduledCallbacks.filter(this.scheduledCallbackExecutor.execute(Date.now(), this.diffTime));
        this.sprites.forEach(function (layerSprites, layer) {
            var e_55, _a;
            try {
                for (var layerSprites_2 = __values(layerSprites), layerSprites_2_1 = layerSprites_2.next(); !layerSprites_2_1.done; layerSprites_2_1 = layerSprites_2.next()) {
                    var sprite = layerSprites_2_1.value;
                    if (sprite.deleted) {
                        _this.removeSprite(sprite, layer);
                        return;
                    }
                    sprite.update(_this.diffTime);
                }
            }
            catch (e_55_1) { e_55 = { error: e_55_1 }; }
            finally {
                try {
                    if (layerSprites_2_1 && !layerSprites_2_1.done && (_a = layerSprites_2.return)) _a.call(layerSprites_2);
                }
                finally { if (e_55) throw e_55.error; }
            }
        });
        this.diffTime = 0;
    };
    Stage.prototype.run = function () {
        var e_56, _a, e_57, _b;
        if (!this._stopped) {
            return;
        }
        this._stopped = false;
        try {
            for (var _c = __values(this.sprites.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var layerSprites = _d.value;
                try {
                    for (var layerSprites_3 = (e_57 = void 0, __values(layerSprites)), layerSprites_3_1 = layerSprites_3.next(); !layerSprites_3_1.done; layerSprites_3_1 = layerSprites_3.next()) {
                        var sprite = layerSprites_3_1.value;
                        sprite.run();
                    }
                }
                catch (e_57_1) { e_57 = { error: e_57_1 }; }
                finally {
                    try {
                        if (layerSprites_3_1 && !layerSprites_3_1.done && (_b = layerSprites_3.return)) _b.call(layerSprites_3);
                    }
                    finally { if (e_57) throw e_57.error; }
                }
            }
        }
        catch (e_56_1) { e_56 = { error: e_56_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_56) throw e_56.error; }
        }
        this.pendingRun = true;
        this.tryDoRun();
    };
    Stage.prototype.ready = function () {
        var e_58, _a, e_59, _b;
        this.tryDoOnReady();
        this.tryDoRun();
        try {
            for (var _c = __values(this.sprites.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var layerSprites = _d.value;
                try {
                    for (var layerSprites_4 = (e_59 = void 0, __values(layerSprites)), layerSprites_4_1 = layerSprites_4.next(); !layerSprites_4_1.done; layerSprites_4_1 = layerSprites_4.next()) {
                        var sprite = layerSprites_4_1.value;
                        sprite.ready();
                    }
                }
                catch (e_59_1) { e_59 = { error: e_59_1 }; }
                finally {
                    try {
                        if (layerSprites_4_1 && !layerSprites_4_1.done && (_b = layerSprites_4.return)) _b.call(layerSprites_4);
                    }
                    finally { if (e_59) throw e_59.error; }
                }
            }
        }
        catch (e_58_1) { e_58 = { error: e_58_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_58) throw e_58.error; }
        }
    };
    Stage.prototype.stop = function () {
        var e_60, _a, e_61, _b;
        if (this._stopped) {
            return;
        }
        this._running = false;
        this._stopped = true;
        try {
            for (var _c = __values(this.sprites.values()), _d = _c.next(); !_d.done; _d = _c.next()) {
                var layerSprites = _d.value;
                try {
                    for (var layerSprites_5 = (e_61 = void 0, __values(layerSprites)), layerSprites_5_1 = layerSprites_5.next(); !layerSprites_5_1.done; layerSprites_5_1 = layerSprites_5.next()) {
                        var sprite = layerSprites_5_1.value;
                        sprite.stop();
                    }
                }
                catch (e_61_1) { e_61 = { error: e_61_1 }; }
                finally {
                    try {
                        if (layerSprites_5_1 && !layerSprites_5_1.done && (_b = layerSprites_5.return)) _b.call(layerSprites_5);
                    }
                    finally { if (e_61) throw e_61.error; }
                }
            }
        }
        catch (e_60_1) { e_60 = { error: e_60_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_60) throw e_60.error; }
        }
        this.stoppedTime = Date.now();
    };
    Stage.prototype.tryDoOnReady = function () {
        var e_62, _a;
        if (this.onReadyPending && this.isReady()) {
            this.onReadyPending = false;
            if (this.backgrounds.length && this.backgroundIndex === null) {
                this.switchBackground(0);
            }
            if (this.onReadyCallbacks.length) {
                try {
                    for (var _b = __values(this.onReadyCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var callback = _c.value;
                        callback();
                    }
                }
                catch (e_62_1) { e_62 = { error: e_62_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_62) throw e_62.error; }
                }
                this.onReadyCallbacks = [];
            }
            this.game.eventEmitter.emit(Game.STAGE_READY_EVENT, {
                stage: this
            });
        }
    };
    Stage.prototype.doOnStart = function () {
        var e_63, _a;
        var _loop_2 = function (callback) {
            setTimeout(function () {
                callback();
            });
        };
        try {
            for (var _b = __values(this.onStartCallbacks), _c = _b.next(); !_c.done; _c = _b.next()) {
                var callback = _c.value;
                _loop_2(callback);
            }
        }
        catch (e_63_1) { e_63 = { error: e_63_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_63) throw e_63.error; }
        }
    };
    Stage.prototype.tryDoRun = function () {
        var _this = this;
        if (this.pendingRun && !this._running && this.isReady()) {
            this._running = true;
            this.pendingRun = false;
            this.doOnStart();
            this.diffTime = Date.now() - this.stoppedTime;
            setTimeout(function () {
                var stoppedTime = _this.stoppedTime;
                var loop = function () {
                    if (_this._stopped || stoppedTime !== _this.stoppedTime) {
                        return;
                    }
                    _this.render();
                    requestAnimationFrame(loop);
                };
                loop();
            });
        }
    };
    Stage.prototype.addListeners = function () {
        var _this = this;
        this.eventEmitter.on(Game.SPRITE_READY_EVENT, Game.SPRITE_READY_EVENT, function (event) {
            if (_this.id == event.detail.stageId) {
                _this.loadedSprites++;
                _this.tryDoOnReady();
                _this.tryDoRun();
            }
        });
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
            var depth = 0;
            while (depth++ < BVH.MAX_DEPTH) {
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
        if (!parent) {
            console.error('The parent is not defined in the collision system.');
            return;
        }
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
            var depth = 0;
            while (branch && depth++ < BVH.MAX_DEPTH) {
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
        var depth = 0;
        while (current && depth++ < BVH.MAX_DEPTH) {
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
    BVH.MAX_DEPTH = 10000;
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
var Collider = (function () {
    function Collider(x, y, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (padding === void 0) { padding = 5; }
        this._offset_x = 0;
        this._offset_y = 0;
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
        this._parent_sprite = null;
        this._center_distance = 0;
        this._center_angle = 0;
        this.x = x;
        this.y = y;
        this.padding = padding;
        this._bvh_padding = padding;
    }
    Collider.prototype.collides = function (target, result, aabb) {
        if (result === void 0) { result = null; }
        if (aabb === void 0) { aabb = true; }
        return SAT(this, target, result, aabb);
    };
    Collider.prototype.potentials = function () {
        var bvh = this._bvh;
        if (bvh === null) {
            throw new Error('Body does not belong to a collision system');
        }
        return bvh.potentials(this);
    };
    Collider.prototype.remove = function () {
        var bvh = this._bvh;
        if (bvh) {
            bvh.remove(this, false);
        }
    };
    Object.defineProperty(Collider.prototype, "parentSprite", {
        get: function () {
            return this._parent_sprite;
        },
        set: function (value) {
            this._parent_sprite = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Collider.prototype, "offset_x", {
        get: function () {
            return -this._offset_x;
        },
        set: function (value) {
            this._offset_x = -value;
            this.updateCenterParams();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Collider.prototype, "offset_y", {
        get: function () {
            return -this._offset_y;
        },
        set: function (value) {
            this._offset_y = -value;
            this.updateCenterParams();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Collider.prototype, "center_offset_x", {
        get: function () {
            if (this._parent_sprite.rotateStyle === 'leftRight' || this._parent_sprite.rotateStyle === 'none') {
                var leftRightMultiplier = this._parent_sprite._direction > 180 && this._parent_sprite.rotateStyle === 'leftRight' ? -1 : 1;
                return this._offset_x * leftRightMultiplier;
            }
            return this._center_distance * Math.cos(this._center_angle - this._parent_sprite.globalAngleRadians);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Collider.prototype, "center_offset_y", {
        get: function () {
            if (this._parent_sprite.rotateStyle === 'leftRight' || this._parent_sprite.rotateStyle === 'none') {
                return -this._offset_y;
            }
            return -this._center_distance * Math.sin(this._center_angle - this._parent_sprite.globalAngleRadians);
        },
        enumerable: false,
        configurable: true
    });
    Collider.prototype.createResult = function () {
        return new CollisionResult();
    };
    Collider.prototype.updateCenterParams = function () {
        this._center_distance = Math.hypot(this._offset_x, this._offset_y);
        this._center_angle = -Math.atan2(-this._offset_y, -this._offset_x);
    };
    Collider.createResult = function () {
        return new CollisionResult();
    };
    return Collider;
}());
var CircleCollider = (function (_super) {
    __extends(CircleCollider, _super);
    function CircleCollider(x, y, radius, scale, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (radius === void 0) { radius = 0; }
        if (scale === void 0) { scale = 1; }
        if (padding === void 0) { padding = 5; }
        var _this = _super.call(this, x, y, padding) || this;
        _this.radius = radius;
        _this.scale = scale;
        return _this;
    }
    CircleCollider.prototype.draw = function (context) {
        var x = this.x;
        var y = this.y;
        var radius = this.radius * this.scale;
        context.moveTo(x + radius, y);
        context.arc(x, y, radius, 0, Math.PI * 2);
    };
    return CircleCollider;
}(Collider));
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
        var body = new CircleCollider(x, y, radius, scale, padding);
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
        var body = new PolygonCollider(x, y, points, angle, scale_x, scale_y, padding);
        this._bvh.insert(body);
        return body;
    };
    CollisionSystem.prototype.createPoint = function (x, y, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (padding === void 0) { padding = 0; }
        var body = new PointCollider(x, y, padding);
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
        var e_64, _a;
        var bodies = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bodies[_i] = arguments[_i];
        }
        try {
            for (var bodies_1 = __values(bodies), bodies_1_1 = bodies_1.next(); !bodies_1_1.done; bodies_1_1 = bodies_1.next()) {
                var body = bodies_1_1.value;
                this._bvh.insert(body, false);
            }
        }
        catch (e_64_1) { e_64 = { error: e_64_1 }; }
        finally {
            try {
                if (bodies_1_1 && !bodies_1_1.done && (_a = bodies_1.return)) _a.call(bodies_1);
            }
            finally { if (e_64) throw e_64.error; }
        }
        return this;
    };
    CollisionSystem.prototype.remove = function () {
        var e_65, _a;
        var bodies = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            bodies[_i] = arguments[_i];
        }
        try {
            for (var bodies_2 = __values(bodies), bodies_2_1 = bodies_2.next(); !bodies_2_1.done; bodies_2_1 = bodies_2.next()) {
                var body = bodies_2_1.value;
                this._bvh.remove(body, false);
            }
        }
        catch (e_65_1) { e_65 = { error: e_65_1 }; }
        finally {
            try {
                if (bodies_2_1 && !bodies_2_1.done && (_a = bodies_2.return)) _a.call(bodies_2);
            }
            finally { if (e_65) throw e_65.error; }
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
var PolygonCollider = (function (_super) {
    __extends(PolygonCollider, _super);
    function PolygonCollider(x, y, points, angle, scale_x, scale_y, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (points === void 0) { points = []; }
        if (angle === void 0) { angle = 0; }
        if (scale_x === void 0) { scale_x = 1; }
        if (scale_y === void 0) { scale_y = 1; }
        if (padding === void 0) { padding = 5; }
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
        _this._origin_points = null;
        _this.angle = angle;
        _this.scale_x = scale_x;
        _this.scale_y = scale_y;
        _this._polygon = true;
        _this._x = x;
        _this._y = y;
        _this._angle = angle;
        _this._scale_x = scale_x;
        _this._scale_y = scale_y;
        _this._origin_points = points;
        PolygonCollider.prototype.setPoints.call(_this, points);
        return _this;
    }
    PolygonCollider.prototype.draw = function (context) {
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
    PolygonCollider.prototype.setPoints = function (new_points) {
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
    PolygonCollider.prototype._calculateCoords = function () {
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
    PolygonCollider.prototype._calculateNormals = function () {
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
    Object.defineProperty(PolygonCollider.prototype, "points", {
        get: function () {
            return this._origin_points;
        },
        enumerable: false,
        configurable: true
    });
    return PolygonCollider;
}(Collider));
var PointCollider = (function (_super) {
    __extends(PointCollider, _super);
    function PointCollider(x, y, padding) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (padding === void 0) { padding = 5; }
        var _this = _super.call(this, x, y, [[0, 0]], 0, 1, 1, padding) || this;
        _this._point = true;
        return _this;
    }
    return PointCollider;
}(PolygonCollider));
PointCollider.prototype.setPoints = undefined;
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
        result.collidedSprite = null;
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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var JetcodeSocket = (function () {
    function JetcodeSocket(socketUrl) {
        if (socketUrl === void 0) { socketUrl = 'ws://localhost:17500'; }
        this.socketUrl = socketUrl;
        this.socket = null;
        this.defaultParameters = {
            'LobbyAutoCreate': true,
            'MaxMembers': 2,
            'MinMembers': 2,
            'StartGameWithMembers': 2
        };
    }
    JetcodeSocket.prototype.connect = function (gameToken, lobbyId, inParameters) {
        var _this = this;
        if (lobbyId === void 0) { lobbyId = null; }
        if (inParameters === void 0) { inParameters = {}; }
        var parameters = __assign(__assign({}, this.defaultParameters), inParameters);
        return new Promise(function (resolve, reject) {
            _this.socket = new WebSocket(_this.socketUrl);
            _this.socket.onopen = function () {
                var connection = new JetcodeSocketConnection(_this.socket, gameToken, lobbyId);
                connection.joinLobby(gameToken, lobbyId, parameters)
                    .then(function () {
                    resolve(connection);
                })
                    .catch(reject);
            };
            _this.socket.onerror = function (error) {
                reject(error);
            };
        });
    };
    JetcodeSocket.JOIN_LOBBY = 'JOIN_LOBBY';
    JetcodeSocket.LEAVE_LOBBY = 'LEAVE_LOBBY';
    JetcodeSocket.SEND_DATA = 'SEND_DATA';
    JetcodeSocket.JOINED = 'JOINED';
    JetcodeSocket.RECEIVE_DATA = 'RECEIVE_DATA';
    JetcodeSocket.MEMBER_JOINED = 'MEMBER_JOINED';
    JetcodeSocket.MEMBER_LEFT = 'MEMBER_LEFT';
    JetcodeSocket.GAME_STARTED = 'GAME_STARTED';
    JetcodeSocket.GAME_STOPPED = 'GAME_STOPPED';
    JetcodeSocket.ERROR = 'ERROR';
    return JetcodeSocket;
}());
var JetcodeSocketConnection = (function () {
    function JetcodeSocketConnection(socket, gameToken, lobbyId) {
        if (lobbyId === void 0) { lobbyId = 0; }
        this.connectActions = [
            JetcodeSocket.JOINED,
            JetcodeSocket.RECEIVE_DATA,
            JetcodeSocket.MEMBER_JOINED,
            JetcodeSocket.MEMBER_LEFT,
            JetcodeSocket.GAME_STARTED,
            JetcodeSocket.GAME_STOPPED,
            JetcodeSocket.ERROR
        ];
        this.socket = socket;
        this.lobbyId = lobbyId;
        this.memberId = null;
        this.connects = {};
        this._listenSocket();
    }
    JetcodeSocketConnection.prototype._listenSocket = function () {
        var _this = this;
        this.socket.onmessage = function (event) {
            var _a = __read(_this._parse(event.data), 3), action = _a[0], parameters = _a[1], value = _a[2];
            if (action === JetcodeSocket.RECEIVE_DATA) {
                _this.emit(JetcodeSocket.RECEIVE_DATA, [value, parameters, (parameters === null || parameters === void 0 ? void 0 : parameters.MemberId) === _this.memberId]);
            }
            else if (action === JetcodeSocket.MEMBER_JOINED) {
                _this.emit(JetcodeSocket.MEMBER_JOINED, [parameters, (parameters === null || parameters === void 0 ? void 0 : parameters.MemberId) === _this.memberId]);
            }
            else if (action === JetcodeSocket.MEMBER_LEFT) {
                _this.emit(JetcodeSocket.MEMBER_LEFT, [parameters, (parameters === null || parameters === void 0 ? void 0 : parameters.MemberId) === _this.memberId]);
            }
            else if (_this.connects[action]) {
                _this.emit(action, [parameters]);
            }
        };
    };
    JetcodeSocketConnection.prototype.emit = function (action, args) {
        if (this.connects[action]) {
            this.connects[action].forEach(function (callback) {
                callback.apply(void 0, __spreadArray([], __read(args), false));
            });
        }
    };
    JetcodeSocketConnection.prototype.connect = function (action, callback) {
        if (!this.connectActions.includes(action)) {
            throw new Error('This actions is not defined.');
        }
        if (!this.connects[action]) {
            this.connects[action] = [];
        }
        this.connects[action].push(callback);
        return callback;
    };
    JetcodeSocketConnection.prototype.disconnect = function (action, callback) {
        if (!this.connectActions.includes(action)) {
            throw new Error('This action is not defined.');
        }
        if (!this.connects[action]) {
            return;
        }
        this.connects[action] = this.connects[action].filter(function (cb) { return cb !== callback; });
    };
    JetcodeSocketConnection.prototype.sendData = function (value, parameters) {
        var e_66, _a;
        if (parameters === void 0) { parameters = {}; }
        if (!this.lobbyId) {
            throw new Error('You are not in the lobby!');
        }
        var request = "".concat(JetcodeSocket.SEND_DATA, "\n");
        try {
            for (var _b = __values(Object.entries(parameters)), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), key = _d[0], value_1 = _d[1];
                request += key + '=' + value_1 + '\n';
            }
        }
        catch (e_66_1) { e_66 = { error: e_66_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_66) throw e_66.error; }
        }
        request += "SendTime=".concat(Date.now(), "\n");
        request += '\n' + value;
        this.socket.send(request);
    };
    JetcodeSocketConnection.prototype.joinLobby = function (gameToken, lobbyId, parameters) {
        var _this = this;
        if (parameters === void 0) { parameters = {}; }
        return new Promise(function (resolve, reject) {
            var e_67, _a;
            if (!lobbyId) {
                lobbyId = 0;
            }
            var request = "".concat(JetcodeSocket.JOIN_LOBBY, "\n");
            request += "GameToken=".concat(gameToken, "\n");
            request += "LobbyId=".concat(lobbyId, "\n");
            try {
                for (var _b = __values(Object.entries(parameters)), _c = _b.next(); !_c.done; _c = _b.next()) {
                    var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                    request += "".concat(key, "=").concat(value, "\n");
                }
            }
            catch (e_67_1) { e_67 = { error: e_67_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                }
                finally { if (e_67) throw e_67.error; }
            }
            _this.socket.send(request);
            _this.connect(JetcodeSocket.JOINED, function (responseParams) {
                if (responseParams.LobbyId && responseParams.MemberId && responseParams.CurrentTime) {
                    _this.lobbyId = responseParams.LobbyId;
                    _this.memberId = responseParams.MemberId;
                    var currentTimeMs = Date.now();
                    _this.deltaTime = currentTimeMs - Number(responseParams.CurrentTime);
                    resolve(_this.lobbyId);
                }
                else {
                    reject(new Error('Couldn\'t join the lobby'));
                }
            });
        });
    };
    JetcodeSocketConnection.prototype.leaveLobby = function () {
        if (!this.lobbyId) {
            return;
        }
        var request = "".concat(JetcodeSocket.LEAVE_LOBBY, "\nLobbyId=").concat(this.lobbyId, "\n");
        this.socket.send(request);
        this.lobbyId = null;
    };
    JetcodeSocketConnection.prototype._parse = function (data) {
        var parsable = data.split('\n');
        var action = parsable[0];
        var value = '';
        var parameters = [];
        var nextIs = 'parameters';
        for (var i = 1; i < parsable.length; i++) {
            var line = parsable[i];
            if (line === '' && nextIs === 'parameters') {
                nextIs = 'value';
            }
            else if (nextIs === 'parameters') {
                var splitted = line.split('=');
                var parameter = splitted[0];
                parameters[parameter] = splitted.length > 1 ? splitted[1] : null;
            }
            else if (nextIs === 'value') {
                value = value + line + '\n';
            }
        }
        if (value) {
            value = value.slice(0, -1);
        }
        return [action, parameters, value];
    };
    return JetcodeSocketConnection;
}());
var ErrorMessages = (function () {
    function ErrorMessages() {
    }
    ErrorMessages.getMessage = function (messageId, locale, variables) {
        if (variables === void 0) { variables = null; }
        if (!ErrorMessages.messages[messageId]) {
            throw new Error('Message is not defined.');
        }
        if (!ErrorMessages.messages[messageId][locale]) {
            throw new Error('Message for this locale is not defined.');
        }
        var message = ErrorMessages.messages[messageId][locale];
        if (variables) {
            message = ErrorMessages.replaceVariables(message, variables);
        }
        return message;
    };
    ErrorMessages.replaceVariables = function (message, variables) {
        return message.replace(/\${([^}]+)}/g, function (match, key) {
            return variables[key] !== undefined ? variables[key] : '';
        });
    };
    ErrorMessages.SCRIPT_ERROR = 'script_error';
    ErrorMessages.MISTAKE_METHOD = 'mistake_method';
    ErrorMessages.MISTAKE_METHOD_WITH_CLOSEST = 'mistake_method_with_closest';
    ErrorMessages.NEED_STAGE_BEFORE_RUN_GAME = 'need_stage_before_run_game';
    ErrorMessages.NEED_CREATE_STAGE_BEFORE_SPRITE = 'need_create_stage_before_sprite';
    ErrorMessages.COSTUME_NOT_LOADED = 'costume_not_loaded';
    ErrorMessages.BACKGROUND_NOT_LOADED = 'background_not_loaded';
    ErrorMessages.CLONED_NOT_READY = 'cloned_not_ready';
    ErrorMessages.SOUND_INDEX_NOT_FOUND = 'sound_index_not_found';
    ErrorMessages.SOUND_NAME_NOT_FOUND = 'sound_name_not_found';
    ErrorMessages.SOUND_NAME_ALREADY_EXISTS = 'sound_name_already_exists';
    ErrorMessages.SOUND_NOT_ALLOWED_ERROR = 'sound_not_allowed_error';
    ErrorMessages.SOUND_USE_NOT_READY = 'sound_use_not_ready';
    ErrorMessages.COSTUME_INDEX_NOT_FOUND = 'costume_index_not_found';
    ErrorMessages.COSTUME_NAME_NOT_FOUND = 'costume_name_not_found';
    ErrorMessages.COSTUME_SWITCH_NOT_READY = 'costume_switch_not_ready';
    ErrorMessages.STAMP_NOT_READY = 'stamp_not_ready';
    ErrorMessages.STAMP_COSTUME_NOT_FOUND = 'stamp_costume_not_found';
    ErrorMessages.COLLIDER_NAME_NOT_FOUND = 'collider_name_not_found';
    ErrorMessages.messages = {
        script_error: {
            'ru': 'Произошла ошибка, ознакомьтесь с подробной информацией в консоли.',
            'en': 'An error has occurred, take a look at the details in the console.'
        },
        mistake_method: {
            'ru': '${className}: Метод или свойство "${prop}" не найдено',
            'en': '${className}: Method "${prop}" not found'
        },
        mistake_method_with_closest: {
            'ru': '${className}: Метод или свойство "${prop}" не найдено. Возможно вы имели ввиду: ${closestString}?',
            'en': '${className}: Method "${prop}" not found. Did you mean: ${closestString}?'
        },
        need_stage_before_run_game: {
            'ru': 'Вам нужно создать экземпляр Stage перед запуском игры.',
            'en': 'You need create Stage instance before run game.'
        },
        need_create_stage_before_sprite: {
            'ru': 'Вам нужно создать экземпляр класса Stage перед экземпляром класса Sprite.',
            'en': 'You need create Stage instance before Sprite instance.'
        },
        costume_not_loaded: {
            'ru': 'Изображение для костюма "${costumePath}" не было загружено. Проверьте правильность пути.',
            'en': 'Costume image "${costumePath}" was not loaded. Check that the path is correct.'
        },
        background_not_loaded: {
            'ru': 'Изображение для фона "${backgroundPath}" не было загружено. Проверьте правильность пути.',
            'en': 'Background image "${backgroundPath}" was not loaded. Check that the path is correct.'
        },
        cloned_not_ready: {
            'ru': 'Спрайт не может быть клонирован, потому что он еще не готов. Попробуйте использовать метод sprite.onReady()',
            'en': 'Sprite cannot be cloned because one is not ready. Try using the sprite.onReady() method.'
        },
        sound_index_not_found: {
            'ru': 'Звук с индексом "${soundIndex}" не найден.',
            'en': 'Sound with index "${soundIndex}" not found.'
        },
        sound_name_not_found: {
            'ru': 'Звук с именем "${soundName}" не найден.',
            'en': 'Sound with name "${soundName}" not found.'
        },
        sound_name_already_exists: {
            'ru': 'Звук с именем "${soundName}" уже добавлен.',
            'en': 'Sound with name "${soundName}" already exists.'
        },
        sound_use_not_ready: {
            'ru': 'Спрайт не может использовать звуки, потому что спрайт еще не готов. Попробуйте использовать метод sprite.onReady().',
            'en': 'Sprite cannot use sounds because sprite is not ready. Try using the sprite.onReady() method.'
        },
        sound_not_allowed_error: {
            'ru': 'Воспроизведение звука заблокировано. Пользователь должен сначала взаимодействовать с игрой. Воспользуйтесь методом Game.onUserInteracted()',
            'en': 'Audio playback is blocked. The user must first interact with the game. Use the Game.onUserInteracted() method.'
        },
        costume_index_not_found: {
            'ru': 'Костюм с индексом "${costumeIndex}" не найден.',
            'en': 'Costume with index "${costumeIndex}" not found.'
        },
        costume_name_not_found: {
            'ru': 'Костюм с именем "${costumeName}" не найден.',
            'en': 'Costume with name "${costumeName}" not found.'
        },
        costume_switch_not_ready: {
            'ru': 'Спрайт не может изменить костюм, потому что спрайт еще не готов. Попробуйте использовать метод sprite.onReady().',
            'en': 'Sprite cannot change a costume because sprite is not ready. Try using the sprite.onReady() method.'
        },
        stamp_not_ready: {
            'ru': 'Спрайт не может создать штамп, потому что он еще не готов. Попробуйте использовать метод sprite.onReady()',
            'en': 'Sprite cannot create a stamp because sprite is not ready. Try using the sprite.onReady() method.'
        },
        stamp_costume_not_found: {
            'ru': 'Штам не может быть создан, так как костюм с индексом "${costumeIndex}" не найден.',
            'en': 'The stamp cannot be created because the costume with the index "${costumeIndex}" has not been found.'
        },
        collider_name_not_found: {
            'ru': 'Коллайдер с именем "${colliderName}" не найден.',
            'en': 'Collider with name "${colliderName}" not found.'
        },
    };
    return ErrorMessages;
}());
var Keyboard = (function () {
    function Keyboard() {
        var _this = this;
        this.keys = {};
        document.addEventListener('keydown', function (event) {
            var char = KeyboardMap.getChar(event.keyCode);
            _this.keys[char] = true;
        });
        document.addEventListener('keyup', function (event) {
            var char = KeyboardMap.getChar(event.keyCode);
            delete _this.keys[char];
        });
    }
    Keyboard.prototype.keyPressed = function (char) {
        return this.keys[char.toUpperCase()] !== undefined;
    };
    Keyboard.prototype.keyDown = function (char, callback) {
        document.addEventListener('keydown', function (event) {
            var pressedChar = KeyboardMap.getChar(event.keyCode);
            if (char.toUpperCase() == pressedChar) {
                callback(event);
            }
        });
    };
    Keyboard.prototype.keyUp = function (char, callback) {
        document.addEventListener('keyup', function (event) {
            var pressedChar = KeyboardMap.getChar(event.keyCode);
            if (char.toUpperCase() == pressedChar) {
                callback(event);
            }
        });
    };
    return Keyboard;
}());
var Mouse = (function () {
    function Mouse(game) {
        var _this = this;
        this.x = 0;
        this.y = 0;
        this.isDown = false;
        document.addEventListener('mousedown', function () {
            _this.isDown = true;
            _this.lastStage = game.getActiveStage();
        });
        document.addEventListener('mouseup', function () {
            _this.isDown = false;
        });
        document.addEventListener('mousemove', function (e) {
            _this.x = game.correctMouseX(e.clientX);
            _this.y = game.correctMouseY(e.clientY);
        });
        this.point = new PointCollider(this.x, this.y);
    }
    Mouse.prototype.getPoint = function () {
        this.point.x = this.x;
        this.point.y = this.y;
        return this.point;
    };
    Mouse.prototype.isMouseDown = function (stage) {
        return this.isDown && stage === this.lastStage;
    };
    Mouse.prototype.clearMouseDown = function () {
        this.isDown = false;
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
        this.canvasRect = canvas.getBoundingClientRect();
        window.addEventListener('resize', function () {
            _this.setCanvasSize(width, height);
            _this.canvasRect = canvas.getBoundingClientRect();
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
var ValidatorFactory = (function () {
    function ValidatorFactory(game) {
        this.game = game;
    }
    ValidatorFactory.prototype.createValidator = function (target, className) {
        var game = this.game;
        return new Proxy(target, {
            get: function (obj, prop) {
                if (prop in obj) {
                    return obj[prop];
                }
                if (typeof prop === 'symbol' || prop.startsWith('_')) {
                    return undefined;
                }
                var methods = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
                    .filter(function (m) { return m !== 'constructor'; });
                var closest = ValidatorFactory.findClosestMethods(prop.toString(), methods);
                if (closest.length) {
                    var closestString = closest.join(', ');
                    game.throwError(ErrorMessages.MISTAKE_METHOD_WITH_CLOSEST, { className: className, prop: prop, closestString: closestString });
                }
                else {
                    game.throwError(ErrorMessages.MISTAKE_METHOD, { className: className, prop: prop });
                }
            }
        });
    };
    ValidatorFactory.findClosestMethods = function (input, methods, maxDistance) {
        if (maxDistance === void 0) { maxDistance = 2; }
        return methods
            .map(function (method) { return ({
            name: method,
            distance: ValidatorFactory.levenshteinDistance(input.toLowerCase(), method.toLowerCase())
        }); })
            .filter(function (_a) {
            var distance = _a.distance;
            return distance <= maxDistance;
        })
            .sort(function (a, b) { return a.distance - b.distance; })
            .map(function (_a) {
            var name = _a.name;
            return name;
        })
            .slice(0, 3);
    };
    ValidatorFactory.levenshteinDistance = function (a, b) {
        var matrix = Array(a.length + 1)
            .fill(null)
            .map(function () { return Array(b.length + 1).fill(0); });
        for (var i = 0; i <= a.length; i++)
            matrix[i][0] = i;
        for (var j = 0; j <= b.length; j++)
            matrix[0][j] = j;
        for (var i = 1; i <= a.length; i++) {
            for (var j = 1; j <= b.length; j++) {
                var cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
            }
        }
        return matrix[a.length][b.length];
    };
    return ValidatorFactory;
}());
//# sourceMappingURL=scrub.js.map