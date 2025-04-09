# Layer Management

Each sprite in ScrubJS can be drawn on a specific layer. Layers allow precise control over the order in which objects are displayed on the screen: what is in the foreground and what is in the background. This is especially important for creating a scene with a background, characters, effects, and UI elements.

## How the Layer System Works

Each sprite can be assigned a numerical priority through the `.layer` property. The **higher the value**, the **higher** it will be in the rendering hierarchy.

```javascript
const background = new Sprite(stage);
const player = new Sprite(stage);
const effects = new Sprite(stage);

background.layer = 0; // The farthest background
player.layer = 1;     // The main character
effects.layer = 2;    // Visual effects on top of the player
```

By default, all sprites have `layer = 0`, so it is recommended to explicitly set the order when creating a scene.

## Dynamic Layer Changes

Layers can be changed at any time, for example, to create the effect of "jumping to the foreground" or "appearing a pop-up window".

### Example: Player jumps higher — layer increases

```javascript
player.forever(() => {
    if (player.y < 200) {
        player.layer = 3; // Raise to the foreground
    } else {
        player.layer = 1; // Return to the normal level
    }
});
```

This is especially useful for simulating depth in 2D — for example, when a character can "go behind" an object.

## Important Notes

- When changing `.layer`, you do not need to recreate the sprite — the changes take effect immediately.
- If multiple sprites are on the same layer, the order in which they are created determines the order in which they are drawn.
- `stage.render()` automatically sorts sprites by `layer` before drawing each frame.

## Summary

| Layer Value | Purpose                     |
|-------------|-----------------------------|
| 0           | Background, decorations     |
| 1–2         | Players, enemies            |
| 3–4         | Foreground objects          |
| 5–9         | Visual effects, flashes     |
| 10+         | Interface, menu             |

