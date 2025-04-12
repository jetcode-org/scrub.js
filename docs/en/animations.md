# Costumes and Animation

Costumes are visual representations of a sprite that can be switched to create the effect of animation. ScrubJS provides flexible tools for loading, configuring, and managing costumes, including support for images, sprite sheets (grids), dynamic drawing, and working with transparency and cropping.

## Adding a Single Costume with Settings

The `addCostume()` method allows you to load an image and set display parameters.

### Simple Example:
```javascript
sprite.addCostume('images/player_idle.png');
```

### Adding with Name and Rotation:
```javascript
sprite.addCostume('images/player_idle.png', {
    name: 'idle',
    rotate: 90
});
```
Here, the sprite will be rotated by 90° when displayed.

### Cropping a Part of the Image:
```javascript
sprite.addCostume('images/player_sheet.png', {
    name: 'head',
    x: 32,
    y: 0,
    width: 32,
    height: 32
});
```
This will allow you to take only a fragment of the image (32×32 pixels), starting from the coordinate (32, 0).

### Flipping Horizontally:
```javascript
sprite.addCostume('images/player_sheet.png', {
    flipX: true
});
```
This will flip the image horizontally.

### Flipping Vertically:
```javascript
sprite.addCostume('images/player_sheet.png', {
    flipY: true
});
```
This will flip the image vertically.

### Transparency by Color:
```javascript
sprite.addCostume('images/enemy.png', {
    alphaColor: '#FF00FF', // The background color that will become transparent
    alphaTolerance: 15     // Tolerance (how close the color should be to also become transparent)
});
```
Convenient for removing background colors, such as magenta (#FF00FF).

### Cropping the Costume:
```javascript
sprite.addCostume('images/player.png', {
    crop: 10
});
```
Removes 10 pixels from each side of the image.

### Cropping the Costume, More Precise Configuration:
```javascript
sprite.addCostume('images/player.png', {
    cropTop: 5,
    cropRight: 10,
    cropBottom: 5,
    cropLeft: 10
});
```
Removes 5 pixels from the top and bottom, and 10 from the left and right.

---

## Loading Costumes from a Grid (Sprite Sheet)

If you have an image with multiple frames, for example, 4×4:

```javascript
sprite.addCostumeGrid('images/player_walk.png', {
    cols: 4,
    rows: 4,
    name: 'walk'
});
```

This will create 16 costumes with the names `walk0`, `walk1`, ..., `walk15`.

### With a Limit on the Number of Frames:
```javascript
sprite.addCostumeGrid('images/player_walk.png', {
    cols: 4,
    rows: 4,
    limit: 6
});
```
Only the first 6 frames will be added.

### Skipping Frames (offset):
```javascript
sprite.addCostumeGrid('images/player_walk.png', {
    cols: 4,
    rows: 4,
    offset: 4,
    limit: 4
});
```
We skip the first 4 frames and add the next 4.

---

## Creating a Costume with Code

You can draw costumes manually:

```javascript
sprite.drawCostume((ctx) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 50, 50);
}, { width: 50, height: 50, name: 'red-square' });
```

Use when you need a simple visual without loading images.

### Example with a Circle:
```javascript
sprite.drawCostume((ctx) => {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(25, 25, 20, 0, 2 * Math.PI);
    ctx.fill();
}, { width: 50, height: 50, name: 'blue-circle' });
```

---

## Managing Costumes

### Switching by Index:
```javascript
sprite.switchCostume(1);
```

### Switching by Name:
```javascript
sprite.switchCostumeByName('walk3');
```

### Next Costume (Convenient for Animation):
```javascript
sprite.nextCostume(); // next in the list
```

Specifying a range:
```javascript
sprite.nextCostume(4, 7); // loop between 4 and 7 indices
```

### Previous Costume, Specifying a Range:
```javascript
sprite.prevCostume(4, 7); // loop between 7 and 4 indices
```

### Removing a Costume:
```javascript
sprite.removeCostume(0); // remove the first costume
```

---

## Sprite Animation Example from Grid

```javascript
const sprite = new Sprite(stage);
sprite.addCostumeGrid('images/player_run.png', {
    cols: 6,
    rows: 1,
    name: 'run'
});

sprite.forever(() => {
    sprite.nextCostume();
}, 100); // every 100 ms
```

---

## Tips

- Naming (`name`) is important for easily switching between costumes.
- Use `addCostumeGrid` to load animations from sprite sheets.
- Parameters `alphaColor` and `alphaTolerance` are especially useful when removing backgrounds from PNG/JPG.
- Dynamic costumes (`drawCostume`) allow you to create unique images on the fly.

---

> Full information about the sprite's costume properties and methods can be found in the [Sprite Game Object](sprite.md#costumess) section.
