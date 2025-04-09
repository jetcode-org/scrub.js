# Game Loop

The game loop in ScrubJS ensures continuous code execution, similar to the `forever` block in Scratch. It "animates" sprites and scenes by defining actions that execute every frame.

## Core Concept

Instead of directly using `requestAnimationFrame`, ScrubJS provides convenient methods `forever`, `repeat`, and `timeout` for managing the game loop.

```javascript
sprite.forever(() => {
    sprite.x += 1; // The sprite moves to the right every frame
});
```

This function will be automatically called on every screen update.

## Managing Game Loops

The `forever`, `repeat`, and `timeout` methods are available for both stages (`Stage`) and sprites (`Sprite`), enabling flexible logic configuration.

### Forever: Continuous Execution

`forever` runs a function continuously while the stage is active or the sprite exists. Ideal for persistent actions like movement, animation, or condition checks.

**Parameters:**

*   `callback`: Function to execute on each iteration.
*   `interval` (optional): Interval in milliseconds between executions. If omitted, the function runs every frame (as fast as possible).
*   `timeout` (optional): Delay in milliseconds before the *first* execution.
*   `finishCallback` (optional): Function called *after* the loop stops (e.g., when the sprite is deleted).

### Repeat: Fixed Iteration Loop

`repeat` runs a function a specified number of times. Suitable for repeated actions like animation sequences or effects.

**Parameters:**

*   `callback`: Function to execute on each iteration.
*   `repeat`: Number of repetitions.
*   `interval` (optional): Interval in milliseconds between iterations. If omitted, the function runs as fast as possible.
*   `timeout` (optional): Delay before the *first* execution.
*   `finishCallback` (optional): Function called after the loop completes.

### Timeout: Single Execution with Delay

`timeout` executes a function *once* after a specified delay. Useful for delayed actions like displaying messages or triggering effects after a pause.

**Parameters:**

*   `callback`: Function to execute after the delay.
*   `timeout`: Delay in milliseconds before execution.

### Where to Use:

*   **Stage:** For global game logic like background management, effects, or input handling.
*   **Sprite:** For sprite-specific logic like movement, animation, or interactions.

**Important Notes:**

*   All loops automatically stop when the scene changes. They resume upon returning to the scene.
*   Deleting a sprite stops all its active loops.

### Examples:

```javascript
stage.forever(() => {
    console.log("It runs continuously with a frequency of 100 ms, the first run after 2 seconds.");
}, 100, 2000);

stage.repeat(() => {
    console.log("It will run 10 times with a frequency of 200 ms. First launch in 1 second.");
}, 10, 200, 1000, () => {
    console.log("Will be executed at the end of the cycle.");
});

stage.timeout(() => {
    console.log("It will run once in 3 seconds.");
}, 3000);
```

## Context and Loop State Management

### Loop Context

Inside `forever`, `repeat`, and `timeout` functions, you can access:

*   `this`: The object the loop is bound to (stage or sprite).
*   `ScheduledState` (for `forever` and `repeat`): Object for loop control.

### ScheduledState: Internal and External Loop Control

`ScheduledState` is returned when creating `forever` and `repeat` loops, providing properties for loop management.

**Properties:**

*   `interval`: Interval between iterations in milliseconds.
*   `maxIterations`: Total iterations for `repeat` loops.
*   `currentIteration`: Current iteration for `repeat` loops.

### Loop Control Examples:


```javascript
// Stopping the loop
stage.forever((stage, state) => {
    return false;
});

// Loop acceleration
stage.forever((stage, state) => {
    state.interval -= 1;
});

// Passing parameters to the loop
const animationState = stage.forever((stage, state) => {
    player.nextCostume();
    
    if (state.control === 'fast') {
        state.interval = 100;
    }

    if (state.control === 'slow') {
        state.interval = 250;
    }

    if (state.control === 'stop') {
        return false;
    }
});

stage.forever(() => {
    if (game.keyPressed('d')) {
        animationState.control = 'fast';
    }
    
    if (game.keyPressed('a')) {
        animationState.control = 'slow';
    }
    
    if (game.keyPressed('space')) {
        animationState.control = 'stop';
    }
});
```

## Multiple Loops per Object

You can create multiple loops for a single object. They run independently, enabling complex behaviors.

```javascript
sprite.forever(() => {
    sprite.x += 1; // Move right
});

sprite.forever(() => {
    sprite.direction += 1; // Rotate
});
```

## Example: Basic Player Control

```javascript
stage.forever(() => {
    if (game.keyPressed('d')) {
        sprite.x += 5; // Move right on 'd' press
    }
    
    if (game.keyPressed('a')) {
        sprite.x -= 5; // Move left on 'a' press
    }
});
```

## Stopping All Object Loops

To forcibly stop all loops associated with an object (sprite or stage), use the `stop()` method:

```javascript
sprite.stop(); // Stop all sprite loops
```

## How It Works

All loops (`forever`, `repeat`, `timeout`) are registered in ScrubJS's timing system. Each game frame, the system invokes their callbacks. You don’t need to manage this manually—everything happens automatically.
