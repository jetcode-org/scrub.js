# Drawing Capabilities in ScrubJS

This section covers tools for creating graphics "on the fly", working with the canvas, and visual effects. ScrubJS provides a simple and flexible API for drawing using the built-in `CanvasRenderingContext2D` context.

---

## 1. Dynamic Costumes

### Method `drawCostume()`

Allows creating custom costumes directly in the code using the Canvas API. This approach is ideal for generative graphics, UI elements, and effects.

```javascript
const sprite = new Sprite(stage);
sprite.drawCostume((context) => {
    context.fillStyle = '#FF5733';
    context.beginPath();
    context.arc(32, 32, 30, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = 'white';
    context.lineWidth = 3;
    context.stroke();
}, {
    width: 64,
    height: 64,
    name: 'custom_circle'
});
```

**Features:**
- `context` is the standard Canvas 2D context.
- `width` and `height` define the size of the costume canvas.
- The costume can be reused by setting `name`.
- The collider is automatically calculated based on the image boundaries but can be overridden manually.

---

## 2. Permanent Drawing

Drawing can occur not only in costumes but also directly on the stage or following a sprite.

### Method `pen()` for Sprites

Allows drawing trails, effects, animations, and complex ornaments while moving across the stage.

```javascript
const brush = new Sprite(stage);
brush.pen((context, sprite) => {
    context.fillStyle = `hsl(${Date.now() % 360}, 70%, 50%)`;
    context.beginPath();
    context.arc(sprite.x, sprite.y, 10, 0, Math.PI * 2);
    context.fill();
});

brush.forever(() => {
    const mouse = game.getMousePoint();
    brush.x = mouse.x;
    brush.y = mouse.y;
});
```

### Drawing Directly on the Stage

Suitable for creating effects, backgrounds, special effects, interfaces, and visualizations.

```javascript
stage.pen((context, stage) => {
    // Gradient background
    const gradient = context.createLinearGradient(0, 0, stage.width, 0);
    gradient.addColorStop(0, '#1A2980');
    gradient.addColorStop(1, '#26D0CE');
    context.fillStyle = gradient;
    context.fillRect(0, 0, stage.width, stage.height);

    // Animated circles
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.beginPath();
    context.arc(
        Math.sin(Date.now() / 1000) * 200 + 400,
        300,
        50,
        0,
        Math.PI * 2
    );
    context.fill();
});
```

---

## 3. Working with Stamps

### Static Impressions of Sprites

The `stamp()` method leaves an image of the current costume of the sprite directly on the stage.

```javascript
const stampSprite = new Sprite(stage);
stampSprite.addCostume('icon.png');

stampSprite.onClick(() => {
    stampSprite.stamp();         // Normal stamp
    stampSprite.stamp(0, true);  // With rotation
});
```

### Stamping Images on the Stage

You can directly apply any images to the stage without using sprites.

```javascript
const image = new Image();
image.src = 'particle.png';

stage.forever(() => {
    if (game.mouseDown()) {
        stage.stampImage(
            image,
            game.getMousePoint().x,
            game.getMousePoint().y,
            game.getRandom(0, 360) // random rotation angle
        );
    }
});
```

---

## 4. Common Mistakes

### Memory Leaks with Dynamic Drawing

If you create a new costume every frame, memory is quickly consumed:

```javascript
// Incorrect:
sprite.forever(() => {
    sprite.drawCostume(...); // A new object every frame
});

// Correct:
if (!sprite.hasCostume('dynamic')) {
    sprite.drawCostume(...);
}
```

### Ignoring the Layer System

If you use `stage.pen()` and do not specify a layer, the drawing may overlap important elements.

```javascript
// Overlapping sprites:
stage.pen((context) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, stage.width, stage.height);
}, 999); // Explicitly on the topmost layer
```

### Incorrect Coordinates

Drawing can occur in local or global coordinates. It is important to distinguish:

```javascript
sprite.pen((context) => {
    context.fillRect(0, 0, 50, 50); // locally (relative to the sprite)
    
    context.fillRect(sprite.globalX, sprite.globalY, 50, 50); // globally (on the stage)
});
```
