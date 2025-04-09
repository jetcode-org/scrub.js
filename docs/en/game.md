# Game Class

The `Game` class serves as the foundation for initializing and managing the game, including canvas creation and scene control.

## Constructor:

```javascript
new Game(width?: number, height?: number, canvasId?: string, displayErrors?: boolean, locale?: Locale);
```
Creates a game instance with the specified width and height.

**Parameters:**
* `width` (`number`, optional) — The game width. If not specified, the game width is set to the screen width.
* `height` (`number`, optional) — The game height. If not specified, the game height is set to the screen height.
* `canvasId` (`string`, optional) — The ID of the canvas element in HTML. If not specified, a canvas is created automatically.
* `displayErrors` (`boolean`, optional, default `true`) — Whether to display errors.
* `locale` (`number`, optional, default `ru`) — The language for displaying errors.

## Main Properties:

| Property          | Type      | Description                                                                                                       |
|-------------------|-----------|-------------------------------------------------------------------------------------------------------------------|
| `width`           | `number`  | Game (canvas) width                                                                                               |
| `height`          | `number`  | Game (canvas) height                                                                                              |
| `locale`          | `number`  | Error display language                                                                                            |
| `debugMode`       | `string`  | Debug information display mode: `none` (disabled), `hover` (on object hover), `forever` (always visible)          |
| `debugCollider`   | `boolean` | Whether to display colliders                                                                                      |
| `debugColor`      | `string`  | Debug information color                                                                                           |

## Table of Contents
*   [Events](#events)
*   [Game Management](#game-management)
*   [Game Dimensions](#game-dimensions)
*   [Debugging](#debugging)
*   [Helper Methods](#helper-methods)
*   [Error Display](#error-display)
*   [Usage Examples](#usage-examples)
*   [General Recommendations](#general-recommendations)


## Events

This section describes methods for managing game-related events.

### Method onReady()

```javascript
onReady(callback: CallableFunction): void
```

Registers a callback function to be executed when the game is ready to start.

**Parameters:**

* `callback` (`CallableFunction`) - The function to execute after the game is prepared.

**Description:**

Adds the callback function to the list of functions to be called when the game is ready (i.e., when all necessary resources for all scenes are loaded).

**Example:**

```javascript
game.onReady(() => {
    console.log('The game is ready to start!');
    game.run();
});
```

## Game Management

This section describes methods for managing the game lifecycle, scenes, and general states.

### Method run()

```javascript
run(stage: Stage = null): void
```

Starts the game on the specified stage.

**Parameters:**

* `stage` (`Stage`, optional) - The stage to start. If not specified, the first stage from the game's stage list is used.

**Description:**

Starts the game on the specified stage. If no stage is provided, it attempts to use the first stage from the list. If the stage list is empty, an error is thrown. Stops the current active stage (if any) before starting.

**Example:**

```javascript
const stage = new Stage();
game.run(stage); // Start the game on a new stage
```

---

### Method stop()

```javascript
stop(): void
```

Stops the game.

**Description:**

Stops the current active stage (if running) and sets the `running` flag to `false`.

**Example:**

```javascript
game.stop(); // Stop the game
```

---

### Method isReady()

```javascript
isReady(): boolean
```

Returns whether the game is ready to start.

**Return Value:**

* (`boolean`) - `true` if the game is ready, `false` otherwise.

**Description:**

Checks if all scenes are loaded and the game is ready to start.

**Example:**

```javascript
if (game.isReady()) {
    game.run();
} else {
    console.log('The game is not ready yet.');
}
```

---

### Method getActiveStage()

```javascript
getActiveStage(): Stage | null
```

Returns the active game stage.

**Return Value:**

* (`Stage | null`) - The active stage or `null` if no stage is active.

**Description:**

Returns the current active game stage. Returns `null` if no stage is active.

**Example:**

```javascript
const activeStage = game.getActiveStage();
if (activeStage) {
    console.log('Active stage: ' + activeStage.name);
} else {
    console.log('No active stage.');
}
```

## Game Dimensions

This section describes properties defining various game parameters.

### Property width

```javascript
get width(): number
```

Returns the width of the game's canvas.

**Return Value:**

* (`number`) - Canvas width in pixels.

**Description:**

Returns the current width of the canvas where the game is rendered.

**Example:**

```javascript
const gameWidth = game.width;
console.log(`Game width: ${gameWidth}`);
```

---

### Property height

```javascript
get height(): number
```

Returns the height of the game's canvas.

**Return Value:**

* (`number`) - Canvas height in pixels.

**Description:**

Returns the current height of the canvas where the game is rendered.

**Example:**

```javascript
const gameHeight = game.height;
console.log(`Game height: ${gameHeight}`);
```

## Debugging

This section describes properties used for game debugging.

### Property debugMode

Sets the debug mode.

**Possible Values:**

* `'none'` - Debug mode disabled.
* `'hover'` - Debug mode activates on sprite hover.
* `'forever'` - Debug mode always active.

**Description:**

Controls the game's debug mode. Depending on the mode, additional sprite information may be displayed.

**Example:**

```javascript
game.debugMode = 'hover'; // Enable debug mode on hover
```

---

### Property debugCollider

Determines whether sprite colliders are displayed.

**Return Value:**

* (`boolean`) - `true` to display colliders, `false` otherwise.

**Description:**

Controls collider visibility in debug mode.

**Example:**

```javascript
game.debugCollider = true; // Display sprite colliders
```

---

### Property debugColor

Sets the color for debug information (e.g., colliders).

**Return Value:**

* (`string`) - A CSS color string (e.g., `'red'`, `'#FF0000'`, `'rgb(255, 0, 0)'`).

**Description:**

Sets the color used for debug information, such as collider boundaries.

**Example:**

```javascript
game.debugColor = 'blue'; // Set debug color to blue
```

## Helper Methods

This section describes helper methods providing utility functions for game interactions.

### Method keyPressed()

```javascript
keyPressed(char: string): boolean
```

Checks if a specified key is pressed.

**Parameters:**

* `char` (`string`) - Key character (e.g., "a", "space", "enter").

**Return Value:**

* (`boolean`) - `true` if the key is pressed, `false` otherwise.

**Description:**

Determines if the specified key is currently pressed.

**Example:**

```javascript
if (game.keyPressed('a')) {
    console.log('Key A is pressed!');
}
```

---

### Method keyDown()

```javascript
keyDown(char: string, callback: CallableFunction): void
```

Registers a callback to execute when a key is pressed.

**Parameters:**

* `char` (`string`) - Key character (e.g., "a", "space", "enter").
* `callback` (`CallableFunction`) - Function to execute on key press.

**Description:**

Adds a callback function to be invoked every time the specified key is pressed.

**Example:**

```javascript
game.keyDown('space', () => {
    console.log('Space key pressed!');
});
```

---

### Method keyUp()

```javascript
keyUp(char: string, callback: CallableFunction): void
```

Registers a callback to execute when a key is released.

**Parameters:**

* `char` (`string`) - Key character (e.g., "a", "space", "enter").
* `callback` (`CallableFunction`) - Function to execute on key release.

**Description:**

Adds a callback function to be invoked every time the specified key is released.

**Example:**

```javascript
game.keyUp('a', () => {
    console.log('Key A released!');
});
```

---

### Method mouseDown()

```javascript
mouseDown(): boolean
```

Checks if the mouse button is pressed.

**Return Value:**

* (`boolean`) - `true` if the mouse button is pressed, `false` otherwise.

**Description:**

Determines if the mouse button is currently pressed on the active stage.

**Example:**

```javascript
if (game.mouseDown()) {
    console.log('Mouse button is pressed!');
}
```

---

### Method mouseDownOnce()

```javascript
mouseDownOnce(): boolean
```

Checks if the mouse button was clicked once.

**Return Value:**

* (`boolean`) - `true` if the mouse button was clicked once, `false` otherwise.

**Description:**

Determines if the mouse button was pressed and immediately released. Resets the button state to prevent repeated triggers.

**Example:**

```javascript
if (game.mouseDownOnce()) {
    console.log('Mouse button was clicked once!');
}
```

---

### Method getMousePoint()

```javascript
getMousePoint(): PointCollider
```

Returns an object representing the mouse position.

**Return Value:**

* (`PointCollider`) - Object containing mouse coordinates.

**Description:**

Returns a `PointCollider` object with the mouse coordinates on the active stage.

**Example:**

```javascript
const mousePoint = game.getMousePoint();
console.log(`Mouse coordinates: X=${mousePoint.x}, Y=${mousePoint.y}`);
```

---

### Method getRandom()

```javascript
getRandom(min: number, max: number): number
```

Returns a random integer within a specified range.

**Parameters:**

* `min` (`number`) - Minimum range value.
* `max` (`number`) - Maximum range value.

**Return Value:**

* (`number`) - Random integer between `min` and `max` (inclusive).

**Description:**

Generates a random integer within the specified range.

**Example:**

```javascript
const randomNumber = game.getRandom(1, 10);
console.log(`Random number: ${randomNumber}`);
```

---

### Method isInsideGame()

```javascript
isInsideGame(x: number, y: number): boolean
```

Checks if specified coordinates are inside the game field.

**Parameters:**

* `x` (`number`) - X-coordinate.
* `y` (`number`) - Y-coordinate.

**Return Value:**

* (`boolean`) - `true` if coordinates are inside the game field, `false` otherwise.

**Description:**

Determines if the specified coordinates are within the game field boundaries defined by the game's width and height.

**Example:**

```javascript
const isInside = game.isInsideGame(100, 150);
console.log(`Coordinates inside the game field: ${isInside}`);
```

## Error Display

Error display is particularly useful during project development. The algorithm can suggest correct method names even with typos. However, this adds overhead as proxy objects are used to validate correctness.

When preparing for release, it is recommended to disable error display to improve performance.

## Usage Examples

### Game Initialization:

```javascript
// Fullscreen game with error display
const game = new Game();

// 480x320 pixel game with error display
const game = new Game(480, 320);

// Release version: 480x320 pixel game without error display
const game = new Game(480, 320, null, false);
```

### Starting and Stopping the Game:

```javascript
// Start the game with the first added stage
game.run();

// Start the game with a specific stage
game.run(gameStage);

// Stop after 10 seconds
setTimeout(() => {
    game.stop();
}, 10000);
```

### Enabling Debug Mode:

```javascript
const game = new Game();
game.debugMode = 'forever';     // Always show debug info
game.debugCollider = true;      // Display colliders
game.debugColor = 'black';      // Set debug color to black
```

### Working with Keys and Mouse:

```javascript
game.keyDown('space', () => {
    console.log('Space key pressed');
});

game.keyUp('space', () => {
    console.log('Space key released');
});

stage.forever(() => {
    if (game.keyPressed('w')) {
        console.log('Key W is pressed!');
    }
    
    if (game.mouseDownOnce()) {
        console.log('Mouse clicked!');
    }

    console.log('Mouse coordinates: ' + game.getMousePoint());
});

console.log('Random number between 1 and 10: ' + game.getRandom(1, 10));
```

### Readiness Event:

```javascript
game.onReady(() => {
    console.log('Game is ready!');
});
```

## General Recommendations

Note: The `run()` method should be called at the end of the program, after creating and configuring scenes and sprites. Only then should the game be started.
