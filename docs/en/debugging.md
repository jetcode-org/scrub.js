# Debugging and Performance

ScrubJS provides built-in tools for debugging and performance analysis, which help in game development and testing. However, in the final version of the game, it is recommended to disable debug features to reduce browser load.

---

## 1. Displaying Errors

During development, ScrubJS can display **errors and warnings**, including:

- Typos in methods and properties
- Attempts to access non-existent objects
- API violations

This is implemented through **proxy wrappers** that track object accesses and compare them with allowed properties. Such checks simplify debugging, especially in the early stages.

### Managing Error Display

When creating a game, you can enable or disable error output:

```javascript
const game = new Game(
    null, // width
    null, // height
    null, // canvasId
    true, // displayErrors — enabled
    'ru'  // message language
);
```

### Recommendation

In the production build, set `displayErrors = false` to remove debugging overhead and speed up execution.

---

## 2. Debugging Colliders

For visual debugging of collisions, ScrubJS allows **highlighting active colliders** of sprites and scenes.

### Example of enabling collision debugging:

```javascript
game.debugCollider = true;
game.debugColor = '#00FF0077'; // Debug border color (green with transparency)
```

After this, each sprite with an active collider will display its **collision boundary** over the graphics.

---

## 3. `debugMode` Property

The `debugMode` property controls the mode for displaying additional information about sprites (e.g., position, size, name, etc.).

### Possible values:

- `'none'` — debug mode is disabled
- `'hover'` — information appears when hovering over a sprite
- `'forever'` — information is always displayed

### Example:

```javascript
game.debugMode = 'hover'; // Display debug info on hover
```

Useful if you need to track the behavior of a specific object on the scene.

---

## 4. Improving Performance

To ensure the game runs smoothly even on weak devices, follow several recommendations:

### Avoid redundant calculations in `forever()`

```javascript
// Negative example:
sprite.forever(() => {
    sprite.drawCostume(...); // New costume every frame — expensive
});
```

```javascript
// Good practice:
if (!sprite.hasCostume('cached')) {
    sprite.drawCostume(...);
}
```

### Minimize the number of actively rendered sprites

Use `sprite.hidden = true` for objects off-screen to reduce GPU load.

### Use `pen()` for drawing backgrounds and trails

Instead of creating new objects every frame, draw static elements using `stage.pen()`.

### Disable debugging before publishing

```javascript
game.debugMode = 'none'
game.debugCollider = false;
game.displayErrors = false;
```
