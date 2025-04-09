# Stage Class

The `Stage` class corresponds to a separate scene or level in the game. It manages sprites, backgrounds, sounds, and game loops.

**Important:** an instance of the `Game` class must be created before creating a `Stage` object; otherwise, an error will be thrown.

## Constructor:

```javascript
new Stage();
```

Creates a new stage.

---

## Main Properties:

| Property          | Type                     | Description                                             |
|-------------------|-------------------------|---------------------------------------------------------|
| `width`           | `number`, read-only     | Stage (canvas) width                                    |
| `height`          | `number`, read-only     | Stage (canvas) height                                   |
| `running`         | `boolean`, read-only    | Indicates if the stage is running                       |
| `isReady`         | `boolean`, read-only    | Indicates if all stage and sprite resources are loaded  |
| `backgroundColor` | `string`                | Stage background color (e.g., `#00FF00` or `lightblue`) |

---

## Table of Contents
*   [Events](#events)
*   [States](#states)
*   [Backgrounds](#backgrounds)
*   [Sounds](#sounds)
*   [Sprite Management](#sprite-management)
*   [Drawing and Stamps](#drawing-and-stamps)
*   [Loops and Schedulers](#loops-and-schedulers)
*   [Usage Examples](#usage-examples)
*   [General Recommendations](#general-recommendations)

## Events

This section describes methods for managing events related to the stage.

### Method onStart()

```javascript
onStart(onStartCallback: CallableFunction): void
```

Registers a callback function to execute when the stage starts.

**Parameters:**

* `onStartCallback` (`CallableFunction`) - The function to execute when the stage starts.

**Description:**

Adds the callback function to the list of functions to be called when the stage starts.

**Example:**

```javascript
const stage = new Stage();
stage.onStart(() => {
    console.log('Stage started!');
});
```

---

### Method onReady()

```javascript
onReady(callback: CallableFunction): void
```

Registers a callback function to execute when the stage is ready for use.

**Parameters:**

* `callback` (`CallableFunction`) - The function to execute after the stage is prepared.

**Description:**

Adds the callback function to the list of functions to be called when the stage is ready (i.e., when all necessary resources, such as backgrounds and sounds, are loaded).

**Example:**

```javascript
const stage = new Stage();
stage.addBackground('images/background.jpg');

stage.onReady(() => {
    console.log('Stage is ready!');
});
```

## States

This section describes properties reflecting the current state of the stage.

### running Property

```javascript
get running(): boolean
```

Returns whether the stage is running.

**Return Value:**

* (`boolean`) - `true` if the stage is running, `false` otherwise.

**Description:**

Indicates if the stage is in a running state.

**Example:**

```javascript
const stage = new Stage();
console.log(`Stage running: ${stage.running}`);
```

---

### stopped Property

Returns whether the stage is stopped.

**Return Value:**

* (`boolean`) - `true` if the stage is stopped, `false` otherwise.

**Description:**

Indicates if the stage is in a stopped state.

**Example:**

```javascript
const stage = new Stage();
console.log(`Stage stopped: ${stage.stopped}`);
```

---

### Method isReady()

```javascript
isReady(): boolean
```

Returns whether the stage is ready for use.

**Return Value:**

* (`boolean`) - `true` if the stage is ready, `false` otherwise.

**Description:**

Checks if all necessary resources (sprites, backgrounds) are loaded and the stage is ready to start.

**Example:**

```javascript
const stage = new Stage();
stage.addBackground('images/background.jpg');

stage.onReady(() => {
    console.log(`Stage ready: ${stage.isReady()}`);
});
```

### Dimensions

This section describes properties defining the stage dimensions.

### Property width

Returns the stage width.

**Return Value:**

* (`number`) - Stage width in pixels.

**Description:**

Returns the current width of the canvas used by the stage.

**Example:**

```javascript
const stage = new Stage();
console.log(`Stage width: ${stage.width}`);
```

---

### Property height

Returns the stage height.

**Return Value:**

* (`number`) - Stage height in pixels.

**Description:**

Returns the current height of the canvas used by the stage.

**Example:**

```javascript
const stage = new Stage();
console.log(`Stage height: ${stage.height}`);
```

## Backgrounds

This section covers methods for managing stage background images. You can set background colors, draw backgrounds using the canvas API, add images as backgrounds, and switch between them.

### Property backgroundColor

Sets the stage background color.

**Parameters:**

*   `color` (*string*) - CSS color (e.g., `'red'`, `'#FF0000'`, `'rgb(255, 0, 0)'`).

**Description:**

Creates a stage background with the specified color.

**Example:**

```javascript
const stage = new Stage();
stage.backgroundColor = 'blue'; // Create a blue background
```

---

### Method drawBackground()

```javascript
drawBackground(callback: DrawingCallbackFunction): this
```

Draws the stage background using the canvas API.

**Parameters:**

*   `callback` (*DrawingCallbackFunction*) - A drawing function that accepts the canvas context and stage object.

**Return Value:**

*   (`this`) - Returns the current stage.

**Description:**

Creates a stage background using a callback function for custom drawing operations.

**Example:**

```javascript
const stage = new Stage();
stage.drawBackground((context, stage) => {
    context.fillStyle = 'green';
    context.fillRect(0, 0, stage.width, stage.height);
}); // Draws a green background
```

---

### Method addBackground()

```javascript
addBackground(backgroundPath: string): this
```

Adds an image as a stage background.

**Parameters:**

*   `backgroundPath` (*string*) - Path to the background image.

**Return Value:**

*   (`this`) - Returns the current stage.

**Description:**

Loads an image and adds it to the list of available stage backgrounds. Throws an error if the image fails to load.

**Example:**

```javascript
const stage = new Stage();
stage.addBackground('images/background.jpg'); // Add an image as a background
```

---

### Method switchBackground()

```javascript
switchBackground(backgroundIndex: number): void
```

Switches the current background to the specified index.

**Parameters:**

*   `backgroundIndex` (*number*) - Index of the background in the available list.

**Description:**

Sets the current stage background to the one at the specified index. Does nothing if the index is invalid.

**Example:**

```javascript
const stage = new Stage();
stage.addBackground('images/background1.jpg');
stage.addBackground('images/background2.jpg');

stage.switchBackground(1); // Switch to the second background
```

---

### Method nextBackground()

```javascript
nextBackground(): void
```

Switches to the next background in the available list.

**Description:**

Sets the next background from the available list. If the end is reached, switches to the first background.

**Example:**

```javascript
const stage = new Stage();
stage.addBackground('images/background1.jpg');
stage.addBackground('images/background2.jpg');

stage.nextBackground(); // Switch to the next background
```

## Sounds

This section describes methods for managing sound files on the stage. You can add, remove, play, and pause sounds.

### Method addSound()

```javascript
addSound(soundPath: string, name: string = null): this
```

Adds a sound file to the stage.

**Parameters:**

*   `soundPath` (`string`) - Path to the sound file.
*   `name` (`string`, optional) - Sound name. Auto-generated if not specified.

**Return Value:**

*   (`this`) - Current stage.

**Description:**

Loads a sound file and adds it to the stage's sound list. Automatically generates a "No name" name if unspecified.

**Example:**

```javascript
stage.addSound('sounds/explosion.mp3', 'explosion');
```

---

### Method removeSound()

```javascript
removeSound(soundIndex: number = 0): this
```

Removes a sound by index.

**Parameters:**

*   `soundIndex` (`number`, default `0`) - Index of the sound to remove.

**Return Value:**

*   (`this`) - Current stage.

**Description:**

Removes the sound at the specified index. Throws an error for invalid indices.

**Example:**

```javascript
stage.removeSound(1); // Remove the second sound
```

---

### Method removeSoundByName()

```javascript
removeSoundByName(soundName: string): this
```

Removes a sound by name.

**Parameters:**

*   `soundName` (`string`) - Name of the sound to remove.

**Return Value:**

*   (`this`) - Current stage.

**Description:**

Searches for a sound by name and removes it. Throws an error if the sound is not found.

**Example:**

```javascript
stage.removeSoundByName('explosion');
```

---

### Method playSound()

```javascript
playSound(soundIndex: number = 0, volume: number = null, currentTime: number = null): void
```

Plays a sound by index.

**Parameters:**

*   `soundIndex` (`number`, default `0`) - Sound index.
*   `volume` (`number`, optional) - Volume (0-1).
*   `currentTime` (`number`, optional) - Playback start time (in seconds).

**Description:**

Starts playback of the specified sound. Supports setting volume and playback position.

**Example:**

```javascript
stage.playSound(0, 0.5, 2.5); // Play the first sound at 50% volume starting at 2.5 seconds
```

---

### Method pauseSound()

```javascript
pauseSound(soundIndex: number = 0): void
```

Pauses sound playback.

**Parameters:**

*   `soundIndex` (`number`, default `0`) - Sound index.

**Description:**

Stops playback of the specified sound. Throws an error for invalid indices.

**Example:**

```javascript
stage.pauseSound(0); // Pause the first sound
```

---

### Method playSoundByName()

```javascript
playSoundByName(soundName: string, volume: number = null, currentTime: number = null): void
```

Plays a sound by name.

**Parameters:**

*   `soundName` (`string`) - Sound name.
*   `volume` (`number`, optional) - Volume (0-1).
*   `currentTime` (`number`, optional) - Playback start time (in seconds).

**Description:**

Searches for a sound by name and starts playback. Throws an error if the sound is not found.

**Example:**

```javascript
stage.playSoundByName('explosion', 0.8);
```

---

### Method pauseSoundByName()

```javascript
pauseSoundByName(soundName: string): void
```

Pauses a sound by name.

**Parameters:**

*   `soundName` (`string`) - Sound name.

**Description:**

Searches for a sound by name and stops playback. Throws an error if the sound is not found.

**Example:**

```javascript
stage.pauseSoundByName('background_music');
```

## Sprite Management

This section describes methods for managing sprites on the stage.

### Method addSprite()

```javascript
addSprite(sprite: Sprite): this
```

Adds a sprite to the stage. **This method is automatically called when creating a sprite via `new Sprite(stage)` and does not require manual invocation.**

**Parameters:**

* `sprite` (`Sprite`) - Sprite to add.

**Return Value:**

* (`this`) - Returns the current stage.

**Description:**

Adds the specified sprite to the corresponding stage layer. Manual invocation is unnecessary as it is triggered automatically during sprite creation.

**Example:**

```javascript
// Sprite is automatically added to the stage
const sprite = new Sprite(stage);
```

---

### Method removeSprite()

```javascript
removeSprite(sprite: Sprite, layer: number): this
```

Removes a sprite from the specified stage layer.

**Parameters:**

* `sprite` (`Sprite`) - Sprite to remove.
* `layer` (`number`) - Layer number to remove the sprite from.

**Return Value:**

* (`this`) - Returns the current stage.

**Description:**

Removes the specified sprite from the given layer. If the layer becomes empty after removal, it is also deleted. Updates loaded and added sprite counters.

**Example:**

```javascript
const sprite = new Sprite(stage);
stage.removeSprite(sprite, sprite.layer);
```

---

### Method getSprites()

```javascript
getSprites(): Sprite[]
```

Returns an array of all sprites on the stage.

**Return Value:**

* (`Sprite[]`) - Array of all sprites on the stage.

**Description:**

Collects all sprites from all stage layers into a single array and returns it.

**Example:**

```javascript
const allSprites = stage.getSprites();
console.log(`Total sprites on stage: ${allSprites.length}`);
```

## Drawing and Stamps

This section describes methods for creating stamps and visual effects on the stage.

### Method stampImage()

```javascript
stampImage(stampImage: HTMLCanvasElement | HTMLImageElement, x: number, y: number, direction = 0): void
```

Stamps an image onto the stage background.

**Parameters:**

*   `stampImage` (`HTMLCanvasElement | HTMLImageElement`) - Image to stamp.
*   `x` (`number`) - X-coordinate of the stamp center.
*   `y` (`number`) - Y-coordinate of the stamp center.
*   `direction` (`number`, optional, default `0`) - Stamp rotation angle in degrees.

**Description:**

Creates a static stamp of the specified image on the stage background.

**Example:**

```javascript
const image = new Image();
image.src = 'images/player.png';

image.addEventListener('load', () => {
    stage.stampImage(image, 100, 100, 45); // Stamp the image onto the stage
});
```

---

### Method pen()

```javascript
pen(callback: DrawingCallbackFunction, layer = 0): void
```

Adds a drawing function for the specified stage layer.

**Parameters:**

*   `callback` (`DrawingCallbackFunction`) - Function to draw on the canvas.
*   `layer` (`number`, optional, default `0`) - Layer to draw on.

**Description:**

Allows adding custom drawings to the specified stage layer. The `callback` function is called every frame, enabling dynamic visual effects.

**Example:**

```javascript
stage.pen((context, stage) => {
    context.fillStyle = 'red';
    context.fillRect(0, 0, 50, 50);
});

// Dynamic drawing
stage.pen((context, stage) => {
    context.fillStyle = 'blue';
    context.beginPath();
    context.arc(25, 25, 20, 0, 2 * Math.PI);
    context.fill();
});
```

## Loops and Schedulers

This section describes methods for scheduling function execution with delays or intervals, enabling animations, timers, and other dynamic effects on the stage.

---

### Method timeout()

```javascript
timeout(callback: ScheduledCallbackFunction, timeout: number): void
```

Executes a function once after a specified delay on the stage.

**Parameters:**

* `callback` (`ScheduledCallbackFunction`) - Function to execute.
* `timeout` (`number`) - Delay before execution (in milliseconds).

**Description:**

Schedules function execution after the specified delay. Equivalent to using `repeat` with `repeat: 1`. The function is executed in the stage context.

**Example:**

```javascript
stage.timeout(() => {
    console.log('Executed after delay on the stage!');
}, 2000); // Executes after 2 seconds
```

---

### Method repeat()

```javascript
repeat(callback: ScheduledCallbackFunction, repeat: number, interval: number = null, timeout: number = null, finishCallback?: ScheduledCallbackFunction): ScheduledState
```

Executes a function a specified number of times with a given interval on the stage.

**Parameters:**

* `callback` (`ScheduledCallbackFunction`) - Function to execute.
* `repeat` (`number`) - Number of repetitions.
* `interval` (`number`, optional, default `null`) - Interval between executions (in milliseconds). If `null`, the function runs as fast as possible.
* `timeout` (`number`, optional, default `null`) - Maximum execution time (in milliseconds). Execution stops if this time is exceeded.
* `finishCallback` (`ScheduledCallbackFunction`, optional) - Function to execute after all repetitions.

**Return Value:**

* (`ScheduledState`) - Scheduling state object.

**Description:**

Schedules function execution `repeat` times with `interval`. Supports `timeout` for time limits and `finishCallback` for completion. The function is executed in the stage context.

**Example:**

```javascript
stage.repeat((stage, state) => {
    console.log('Executed ' + state.currentIteration + ' times on the stage');
}, 5, 1000); // Executes 5 times with 1-second intervals
```

---

### Method forever()

```javascript
forever(callback: ScheduledCallbackFunction, interval: number = null, timeout: number = null, finishCallback?: ScheduledCallbackFunction): ScheduledState
```

Executes a function indefinitely with a specified interval on the stage.

**Parameters:**

* `callback` (`ScheduledCallbackFunction`) - Function to execute.
* `interval` (`number`, optional, default `null`) - Interval between executions (in milliseconds). If `null`, the function runs as fast as possible.
* `timeout` (`number`, optional, default `null`) - Maximum execution time (in milliseconds). Execution stops if this time is exceeded.
* `finishCallback` (`ScheduledCallbackFunction`, optional) - Function to execute after stopping.

**Return Value:**

* (`ScheduledState`) - Scheduling state object.

**Description:**

Schedules indefinite function execution with `interval`. Supports `timeout` for time limits and `finishCallback` for post-stop actions. The function is executed in the stage context.

**Example:**

```javascript
stage.forever(() => {
    console.log('Continuously executing on the stage!');
}, 500); // Executes every 500 ms
```

## Usage Examples

### Creating a Stage:

```javascript
const game = new Game();
const stage = new Stage();
stage.backgroundColor = 'lightblue';
```

### Managing Backgrounds:

```javascript
stage.addBackground("path/to/bg.jpg");      // Add background image
stage.switchBackground(0);                  // Switch background by index
stage.nextBackground();                     // Switch to next background
```

### Drawing Backgrounds:

```javascript
stage.drawBackground((context, stage) => {
    // Draw sky
    context.fillStyle = 'lightblue';
    context.fillRect(0, 0, stage.width, stage.height);
    
    // Draw sun
    context.fillStyle = 'yellow';
    context.beginPath();
    context.arc(stage.width / 2, 100, 50, 0, Math.PI * 2);
    context.fill();

    // Draw mountains
    context.fillStyle = 'gray';
    context.beginPath();
    context.moveTo(0, stage.height);
    context.lineTo(stage.width / 2, stage.height - 200);
    context.lineTo(stage.width, stage.height);
    context.fill();

    // Draw trees
    context.fillStyle = 'green';
    context.fillRect(100, stage.height - 150, 50, 100);
    context.fillRect(300, stage.height - 120, 50, 100);
    context.fillRect(500, stage.height - 150, 50, 100);

    // Draw grass
    context.fillStyle = 'lightgreen';
    context.fillRect(0, stage.height - 50, stage.width, 50);
});
```

### Sounds:

```javascript
stage.addSound("audio.mp3", "music");       // Add sound file
stage.playSoundByName("music");             // Play sound
stage.pauseSoundByName("music");            // Pause sound
stage.removeSoundByName("music");           // Remove sound
```

### Stamps:

```javascript
const image = new Image();
image.src = 'stamp.png';
stage.stampImage(image, 100, 50, 90);   // Stamp image onto background
```

### Events:

```javascript
stage.onReady(() => {
    console.log("Stage is ready");
});

stage.onStart(() => {
    console.log("Stage started");
});
```

## General Recommendations

To ensure all resources and objects are loaded and initialized, use the `onReady` method.
