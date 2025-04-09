# Sprite Class

The `Sprite` class represents a dynamic game element capable of moving, changing appearance, and interacting with other objects. Each sprite can include multiple costumes, sounds, and child elements.

## Constructor:

```javascript
new Sprite(stage?: Stage, layer?: number);
```

Creates a sprite instance.

**Parameters:**

* `stage` (`Stage`, optional) — The stage to which the sprite belongs. If not specified, the last added stage is used.
* `layer` (`number`, optional, defaults to `0`) — Rendering layer (higher values render the sprite on top).

## Main Properties:

| Property        | Type                     | Description                                                                              |
|-----------------|--------------------------|------------------------------------------------------------------------------------------|
| `id`            | `Symbol`, read-only      | Unique sprite identifier.                                                                |
| `name`          | `string`                 | Sprite name (default: "No name").                                                        |
| `x`             | `number`                 | X-axis position.                                                                         |
| `y`             | `number`                 | Y-axis position.                                                                         |
| `rightX`        | `number`                 | Right boundary coordinate.                                                               |
| `leftX`         | `number`                 | Left boundary coordinate.                                                                |
| `topY`          | `number`                 | Top boundary coordinate.                                                                 |
| `bottomY`       | `number`                 | Bottom boundary coordinate.                                                              |
| `width`         | `number`, read-only      | Sprite width.                                                                            |
| `height`        | `number`, read-only      | Sprite height.                                                                           |
| `direction`     | `number`                 | Rotation direction in degrees (0 — up, 90 — right, 180 — down, 270 — left).             |
| `size`          | `number`                 | Size percentage (100 — original size).                                                   |
| `costumeIndex`  | `number`, read-only      | Index of the current costume.                                                            |
| `hidden`        | `boolean`                | Visibility state (`true` — hidden, `false` — visible).                                   |
| `opacity`       | `number`                 | Opacity level (0 to 1).                                                                  |
| `layer`         | `number`                 | Rendering layer. Sprites on higher layers overlap those on lower layers.                 |
| `rotateStyle`   | `string`                 | Rotation display style: `'normal'`, `'leftRight'`, `'none'`.                             |
| `overlapX`      | `number`, read-only      | X-axis overlap amount during collision.                                                  |
| `overlapY`      | `number`, read-only      | Y-axis overlap amount during collision.                                                  |
| `otherSprite`   | `Sprite`, read-only      | The other sprite involved in the collision.                                              |
| `collider`      | `Collider`, read-only    | Returns the currently active collider.                                                   |
| `tags`          | `string[]`, read-only    | Array of all tags assigned to the sprite.                                                |

## Table of Contents
*   [Events](#events)
*   [Composite Sprites](#composite-sprites)
*   [Colliders](#colliders)
*   [Tags](#tags)
*   [Costumes](#costumes)
*   [Sounds](#sounds)
*   [Visual Functions](#visual-functions)
*   [Visual Properties](#visual-properties)
*   [Movements](#movements)
*   [Geometry](#geometry)
*   [Collision Detection](#collision-detection)
*   [Loops and Schedulers](#loops-and-schedulers)
*   [Cloning and Sprite Lifecycle Management](#cloning-and-sprite-lifecycle-management)
*   [Usage Examples](#usage-examples)
*   [General Recommendations](#general-recommendations)

## Events

This section describes methods for managing events related to the sprite.

### Method onReady()

```javascript
onReady(callback: CallableFunction): void
```

Registers a callback function to be executed when the sprite is ready.

**Parameters:**

*   `callback` (*CallableFunction*) - Function to execute after the sprite is prepared.

**Description:**

Adds the callback function to the list of functions that will be called when the sprite is ready (i.e., when all required resources like costumes and sounds are loaded).

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

sprite.onReady(() => {
    console.log('The sprite is ready to use!');
    sprite.x = 100; // Set the sprite position
});
```

## Composite Sprites

This section describes how to create a hierarchy of sprites where one sprite can act as a parent to others. Child sprites inherit properties from the parent, such as position and tags, enabling the creation of complex objects from simpler ones.

### Method setParent()

```javascript
setParent(parent: Sprite): this
```

Sets a parent sprite for the current sprite.

**Parameters:**

* `parent` (`Sprite`) - Parent sprite.

**Returns:**

* (`this`) - Returns the current sprite.

**Description:**

Sets the specified sprite as the parent, adding the current sprite to the parent's list of children.

**Example:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);

childSprite.setParent(parentSprite);
```
---

### Method addChild()

```javascript
addChild(child: Sprite): this
```

Adds a child sprite to the current sprite.

**Parameters:**

* `child` (`Sprite`) - Child sprite.

**Returns:**

* (`this`) - Returns the current sprite.

**Description:**

Adds the specified sprite to the list of children. The child sprite's coordinates and direction are reset, and parent tags are transferred.

**Example:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);

parentSprite.addChild(childSprite);
```

---

### Method removeChild()

```javascript
removeChild(child: Sprite): this
```

Removes a child sprite from the current sprite.

**Parameters:**

* `child` (`Sprite`) - Child sprite.

**Returns:**

* (`this`) - Returns the current sprite.

**Description:**

Removes the specified sprite from the list of children, resets its parent reference, and removes inherited tags.

**Example:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);

parentSprite.addChild(childSprite);
parentSprite.removeChild(childSprite);
```
---

### Method getChildren()

```javascript
getChildren(): Sprite[]
```

Returns the list of child sprites.

**Returns:**

* (`Sprite[]`) - Array of child sprites.

**Description:**

Returns an array of all sprites that are children of the current sprite.

**Example:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);
const childSprite2 = new Sprite(stage);

parentSprite.addChild(childSprite);
parentSprite.addChild(childSprite2);

parentSprite.getChildren(); // Returns an array of sprites [childSprite, childSprite2]
```

---

### Method getMainSprite()

```javascript
getMainSprite(): Sprite
```

Returns the root sprite in the hierarchy.

**Returns:**
* (`Sprite`) - Root sprite.

**Description:**
Recursively finds the topmost parent sprite. If the current sprite has no parent, it returns itself.

**Example:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);
const subChildSprite = new Sprite(stage);

childSprite.setParent(parentSprite);
subChildSprite.setParent(childSprite);

const mainSprite = subChildSprite.getMainSprite(); // Returns parentSprite
```

## Colliders

This section covers collision detection between sprites. The collision system allows detecting when sprites touch, which is essential for implementing interactions in the game.

### Method setRectCollider()

```javascript
setRectCollider(colliderName: string, width: number, height: number, offsetX: number = 0, offsetY: number = 0): this
```

Sets a rectangular collider.

**Parameters:**
* `colliderName` (`string`) - Collider name.
* `width` (`number`) - Collider width.
* `height` (`number`) - Collider height.
* `offsetX` (`number`, optional, defaults to `0`) - X-axis offset.
* `offsetY` (`number`, optional, defaults to `0`) - Y-axis offset.

**Returns:**
* (`this`) - Returns the current sprite.

**Description:**
Creates and sets a rectangular collider with the specified dimensions and offset.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 64); // 32x64px rectangle
```

---

### Method setPolygonCollider()

```javascript
setPolygonCollider(colliderName: string, points: [number, number][], offsetX: number = 0, offsetY: number = 0): this
```

Sets a polygonal collider.

**Parameters:**

* `colliderName` (`string`) - Collider name.
* `points` (`[number, number][]`) - Array of points defining the polygon.
* `offsetX` (`number`, optional, defaults to `0`) - X-axis offset.
* `offsetY` (`number`, optional, defaults to `0`) - Y-axis offset.

**Returns:**

* (`this`) - Returns the current sprite.

**Description:**

Creates and sets a polygonal collider based on the specified points and offset.

**Example:**

```javascript
const points = [
    [-16, -16],
    [16, -16],
    [16, 16],
    [-16, 16]
];

const sprite = new Sprite(stage);
sprite.setPolygonCollider('polygon', points);
```

---

### Method setCircleCollider()

```javascript
setCircleCollider(colliderName: string, radius: number, offsetX: number = 0, offsetY: number = 0): this
```

Sets a circular collider.

**Parameters:**
* `colliderName` (`string`) - Collider name.
* `radius` (`number`) - Collider radius.
* `offsetX` (`number`, optional, defaults to `0`) - X-axis offset.
* `offsetY` (`number`, optional, defaults to `0`) - Y-axis offset.

**Returns:**
* (`this`) - Returns the current sprite.

**Description:**
Creates and sets a circular collider with the specified radius and offset.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setCircleCollider('circle', 16); // 16px radius collider
```

---

### Method setCostumeCollider()

```javascript
setCostumeCollider(colliderName: string, costumeIndex: number = 0, offsetX: number = 0, offsetY: number = 0): this
```

Sets a collider based on a costume.

**Parameters:**
* `colliderName` (`string`) - Collider name.
* `costumeIndex` (`number`, optional, defaults to `0`) - Costume index.
* `offsetX` (`number`, optional, defaults to `0`) - X-axis offset.
* `offsetY` (`number`, optional, defaults to `0`) - Y-axis offset.

**Returns:**
* (`this`) - Returns the current sprite.

**Description:**
Sets a rectangular collider matching the dimensions of the specified costume.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('path/to/costume.png');

// Ensure the costume is loaded first
sprite.onReady(() => {
    sprite.setCostumeCollider('main', 0);    
});
```

---

### Method setCollider()

```javascript
setCollider(colliderName: string, collider: Collider, offsetX: number = 0, offsetY: number = 0): this
```

Sets a custom collider.

**Parameters:**
* `colliderName` (`string`) - Collider name.
* `collider` (`Collider`) - Collider object.
* `offsetX` (`number`, optional, defaults to `0`) - X-axis offset.
* `offsetY` (`number`, optional, defaults to `0`) - Y-axis offset.

**Returns:**
* (`this`) - Returns the current sprite.

**Description:**
Sets the specified collider with the given name and offset. If a collider with the same name exists, it is replaced.

**Example:**

```javascript
const sprite = new Sprite(stage);

// Circle collider
const collider = CircleCollider(sprite.x, sprite.y, 16, sprite.size);
sprite.setCollider('custom', collider);    

// Point collider
const collider = PointCollider(sprite.x, sprite.y);
sprite.setCollider('point', collider);
```

---

### Method removeCollider()

```javascript
removeCollider(colliderName?: string): this
```

Removes a collider.

**Parameters:**
* `colliderName` (`string`, optional) - Name of the collider to remove. If omitted, removes all colliders.

**Returns:**
* (`this`) - Returns the current sprite.

**Description:**
Removes the specified collider or all colliders if no name is provided.

**Example:**

```javascript
const sprite = new Sprite(stage);

// Remove all colliders
sprite.removeCollider();

// Remove a specific collider
sprite.setRectCollider('rect', 32, 32);
sprite.removeCollider('rect');
````

---

### Method getCollider()

```javascript
getCollider(colliderName: string): Collider
```

Returns a collider by name.

**Parameters:**
* `colliderName` (`string`) - Collider name.

**Returns:**
* (`Collider`) - Collider object.

**Description:**
Returns the collider with the specified name. Throws an error if not found.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('rect', 32, 32);

sprite.getCollider('rect'); // Returns the 'rect' collider
sprite.getCollider('alien'); // Returns null
```

---

### Method hasCollider()

```javascript
hasCollider(colliderName: string): boolean
```

Checks if a collider exists.

**Parameters:**
* `colliderName` (`string`) - Collider name.

**Returns:**
* (`boolean`) - `true` if the collider exists, `false` otherwise.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('rect', 32, 32);

sprite.hasCollider('rect'); // Returns true
sprite.hasCollider('alien'); // Returns false
```

---

### Method switchCollider()

```javascript
switchCollider(colliderName: string): this
```

Switches the active collider.

**Parameters:**
* `colliderName` (`string`) - Name of the collider to activate.

**Returns:**
* (`this`) - Returns the current sprite.

**Description:**
Activates the specified collider and removes the previous one from the collision system.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('rect', 32, 32);
sprite.setCircleCollider('circle', 16);

sprite.switchCollider('circle'); // Activate the circle collider
```

### Default Collider

If no collider is manually defined, a rectangular collider named `main` is automatically created from the first added costume. Use `removeCollider()` to disable automatic collider creation.

**Example:**

```javascript
// Collider created from costume
const sprite = new Sprite(stage);
sprite.addCostume('path/to/sprite.png');

sprite.onReady(() => {
    sprite.getCollider('main'); // Returns the costume-based collider  
});

// Sprite without collider
const withoutColliderSprite = new Sprite(stage);
sprite.addCostume('path/to/sprite.png');
withoutColliderSprite.removeCollider();

withoutColliderSprite.onReady(() => {
    sprite.getCollider('main'); // Returns null  
});

// Manual collider prevents auto-creation
const sprite = new Sprite(stage);
sprite.setCircleCollider('circle', 20);

sprite.onReady(() => {
    sprite.getCollider('main'); // Returns null    
    sprite.getCollider('circle'); // Returns 'circle' collider 
});
```

## Tags

Tags are used to detect collisions between sprites and group objects. Each sprite can have multiple tags, which are inherited by its children.

### Method addTag()

```javascript
addTag(tagName: string): this
```

Adds a tag to the sprite and its children.

**Parameters:**
* `tagName` (`string`) - Tag name.

**Returns:**
* (`this`) - Returns the current sprite.

**Description:**
Adds the tag if it does not already exist. The tag is automatically applied to all child sprites.

**Example:**

```javascript
const player = new Sprite(stage);
const enemy = new Sprite(stage);
enemy.addTag('enemy');

player.forever(() => {
    if (player.touchTag('enemy')) {
        console.log('The player has touched the enemy!');
    }
});
```

---

### Method removeTag()

```javascript
removeTag(tagName: string): this
```

Removes a tag from the sprite and its children.

**Parameters:**
* `tagName` (`string`) - Tag name.

**Returns:**
* (`this`) - Returns the current sprite.

**Description:**
Removes the specified tag from the sprite and its descendants. Does nothing if the tag is not found.

**Example:**

```javascript
const powerUp = new Sprite(stage);
powerUp.addTag('bonus');

setTimeout(() => {
    powerUp.removeTag('bonus');
}, 5000);
```

---

### Method hasTag()

```javascript
hasTag(tagName: string): boolean
```

Checks if the sprite has a tag.

**Parameters:**
* `tagName` (`string`) - Tag name.

**Returns:**
* (`boolean`) - `true` if the tag exists, `false` otherwise.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addTag('interactive');

if (sprite.hasTag('interactive')) { 
    console.log('The sprite interacts with the user');
}

// Tag inheritance example:
const parent = new Sprite(stage);
const child = new Sprite(stage);

parent.addChild(child);
parent.addTag('group');

console.log(child.hasTag('group')); // Returns: true
```

## Costumes

This section covers managing the sprite's appearance. Costumes are images that a sprite can display. You can load costumes from files, create them dynamically using the canvas API, switch between them, and customize their appearance using various options.

### CostumeOptions Type

```javascript
type CostumeOptions = {
    name?: string,
    rotate?: number,
    flipX?: boolean,
    flipY?: boolean,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    alphaColor?: string | { r: number; g: number; b: number };
    alphaTolerance?: number;
    crop?: number,
    cropTop?: number,
    cropRight?: number,
    cropBottom?: number,
    cropLeft?: number
};
```

*   `name` (`string`, optional): Costume name.
*   `rotate` (`number`, optional): Rotation angle in degrees.
*   `flipX` (`boolean`, optional): Flip the costume horizontally.
*   `flipY` (`boolean`, optional): Flip the costume vertically.
*   `x` (`number`, optional): X-coordinate for cropping part of the image.
*   `y` (`number`, optional): Y-coordinate for cropping part of the image.
*   `width` (`number`, optional): Width for cropping part of the image.
*   `height` (`number`, optional): Height for cropping part of the image.
*   `alphaColor` (*string | { r: number; g: number; b: number }*, optional): Color to make transparent (e.g., `'#FF0000'` or `{ r: 255, g: 0, b: 0 }`).
*   `alphaTolerance` (`number`, optional): Alpha channel transparency tolerance.
*   `crop` (`number`, optional): Crop the costume equally on all sides by specified pixels.
*   `cropTop` (`number`, optional): Crop the costume from the top by specified pixels.
*   `cropRight` (`number`, optional): Crop the costume from the right by specified pixels.
*   `cropBottom` (`number`, optional): Crop the costume from the bottom by specified pixels.
*   `cropLeft` (`number`, optional): Crop the costume from the left by specified pixels.

---

### GridCostumeOptions Type

```javascript
type GridCostumeOptions = {
    cols: number,
    rows: number,
    limit?: number,
    offset?: number,
    name?: string,
    rotate?: number,
    flipX?: boolean,
    flipY?: boolean,
    imageX?: number,
    imageY?: number,
    width?: number,
    height?: number,
    alphaColor?: string | { r: number; g: number; b: number };
    alphaTolerance?: number;
    crop?: number,
    cropTop?: number,
    cropRight?: number,
    cropBottom?: number,
    cropLeft?: number
};
```

*   `cols` (`number`): Number of columns in the costume grid.
*   `rows` (`number`): Number of rows in the costume grid.
*   `limit` (`number`, optional): Maximum number of costumes to load from the grid.
*   `offset` (`number`, optional): Number of costumes to skip in the grid.
*   `name` (`string`, optional): Prefix for costume names.
*   `rotate` (`number`, optional): Rotation angle for each costume in the grid.
*   `flipX` (`boolean`, optional): Flip each costume horizontally.
*   `flipY` (`boolean`, optional): Flip each costume vertically.
*   `imageX` (`number`, optional): X-coordinate for cropping part of the image.
*   `imageY` (`number`, optional): Y-coordinate for cropping part of the image.
*   `width` (`number`, optional): Width for cropping part of the image.
*   `height` (`number`, optional): Height for cropping part of the image.
*   `alphaColor` (*string | { r: number; g: number; b: number }*, optional): Color to make transparent (e.g., `'#FF0000'` or `{ r: 255, g: 0, b: 0 }`).
*   `alphaTolerance` (`number`, optional): Alpha channel transparency tolerance.
*   `crop` (`number`, optional): Crop the costume equally on all sides by specified pixels.
*   `cropTop` (`number`, optional): Crop the costume from the top by specified pixels.
*   `cropRight` (`number`, optional): Crop the costume from the right by specified pixels.
*   `cropBottom` (`number`, optional): Crop the costume from the bottom by specified pixels.
*   `cropLeft` (`number`, optional): Crop the costume from the left by specified pixels.

---

### Method addCostume()

```javascript
addCostume(costumePath: string, options?: CostumeOptions): this
```

Adds a costume from a file.

**Parameters:**
*   `costumePath` (`string`) - Path to the costume file.
*   `options` (`CostumeOptions`, optional) - Costume parameters.

**Returns:**
*   (`this`) - Returns the current sprite.

**Description:**
Creates a new costume, loads the image from the specified path, and applies additional parameters (rotation, flipping, transparency, etc.).

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

// With name and rotation specified
sprite.addCostume('images/player.png', { name: 'idle', rotate: 90 });

// With transparent color specified
sprite.addCostume('images/player.png', { alphaColor: '\#FFFFFF' });
```

---

### Method addCostumeGrid()

```javascript
addCostumeGrid(costumePath: string, options: GridCostumeOptions): this
```

Adds multiple costumes from a grid-based image file.

**Parameters:**
*   `costumePath` (`string`) - Path to the grid image file.
*   `options` (`GridCostumeOptions`) - Grid parameters.

**Returns:**
*   (`this`) - Returns the current sprite.

**Description:**
Splits the image into separate costumes using grid parameters (rows, columns, offset, etc.) and adds them to the sprite.

**Example:**

```javascript
const sprite = new Sprite(stage);

// Load a 4x4 grid
sprite.addCostumeGrid('images/tileset.png', { cols: 4, rows: 4 });

// Load a grid with a limit and offset
sprite.addCostumeGrid('images/tileset.png', { cols: 4, rows: 4, limit: 8, offset: 2 });
```

---

### Method drawCostume()

```javascript
drawCostume(callback: DrawingCallbackFunction, options?: CostumeOptions): this
```

Creates a costume using a drawing function.

**Parameters:**
*   `callback` (*DrawingCallbackFunction*) - Function that draws the costume on a canvas.
*   `options` (`CostumeOptions`, optional) - Costume parameters.

**Returns:**
*   (`this`) - Returns the current sprite.

**Description:**
Allows dynamic creation of costumes using the canvas API.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.drawCostume((context, sprite) => {
    context.fillStyle = 'red';
    context.fillRect(0, 0, 50, 50);
}, { width: 50, height: 50 });

// Create a named costume dynamically
sprite.drawCostume((context, sprite) => {
    context.fillStyle = 'blue';
    context.arc(25, 25, 20, 0, 2 * Math.PI);
    context.fill();
}, { width: 50, height: 50, name: 'circle' });
```

---

### Method removeCostume()

```javascript
removeCostume(costumeIndex: number): this
```

Removes a costume by index.

**Parameters:**
*   `costumeIndex` (`number`) - Index of the costume to remove.

**Returns:**
*   (`this`) - Returns the current sprite.

**Description:**
Removes the costume from the sprite's costume list. If the removed costume was active, another costume is set.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');

sprite.onReady(() => {
    sprite.removeCostume(0); // Remove the first costume    
});
```

---

### Method switchCostume()

```javascript
switchCostume(costumeIndex: number): this
```

Switches to a costume by index.

**Parameters:**
*   `costumeIndex` (`number`) - Costume index.

**Returns:**
*   (`this`) - Returns the current sprite.

**Description:**
Sets the sprite's current costume to the one with the specified index.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');

sprite.onReady(() => {
    sprite.switchCostume(1); // Switch to the second costume
});
```

---

### Method switchCostumeByName()

```javascript
switchCostumeByName(costumeName: string): this
```

Switches to a costume by name.

**Parameters:**
*   `costumeName` (`string`) - Costume name.

**Returns:**
*   (`this`) - Returns the current sprite.

**Description:**
Sets the sprite's current costume to the one with the specified name.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png', { name: 'idle' });
sprite.addCostume('images/player2.png', { name: 'walk' });

sprite.onReady(() => {
    sprite.switchCostumeByName('walk'); // Switch to the "walk" costume
});
```

---

### Method nextCostume()

```javascript
nextCostume(minCostume = 0, maxCostume?: number): number
```

Switches to the next costume within a range.

**Parameters:**
*   `minCostume` (`number`, optional, defaults to `0`) - Minimum index in the range.
*   `maxCostume` (`number`, optional) - Maximum index in the range.

**Returns:**
*   (`number`) - Index of the new costume.

**Description:**
Switches to the next costume in sequence, wrapping to the start of the range if the end is reached.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');
sprite.addCostume('images/player3.png');

sprite.onReady(() => {
    sprite.nextCostume(); // Switch to the next costume
});
```

---

### Method prevCostume()

```javascript
prevCostume(minCostume = 0, maxCostume?: number): number
```

Switches to the previous costume within a range.

**Parameters:**
*   `minCostume` (`number`, optional, defaults to `0`) - Minimum index in the range.
*   `maxCostume` (`number`, optional) - Maximum index in the range.

**Returns:**
*   (`number`) - Index of the new costume.

**Description:**
Switches to the previous costume in sequence, wrapping to the end of the range if the start is reached.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');
sprite.addCostume('images/player3.png');

sprite.onReady(() => {
    sprite.prevCostume(); // Switch to the previous costume
});
```

---

### Method getCostume()

```javascript
getCostume(): Costume
```

Returns the current costume.

**Returns:**
*   (`Costume`) - Current costume object.

**Description:**
Returns the sprite's current costume.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

sprite.onReady(() => {
    const currentCostume = sprite.getCostume();
});
```

---

### Method getCostumeName()

```javascript
getCostumeName(): string
```

Returns the current costume's name.

**Returns:**
*   (`string`) - Current costume name.

**Description:**
Returns the name of the sprite's current costume.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png', { name: 'idle' });

sprite.onReady(() => {
    const costumeName = sprite.getCostumeName(); // Returns "idle"
});
```

---

### Method getCostumeIndex()

```javascript
getCostumeIndex(): number
```

Returns the current costume's index.

**Returns:**
*   (`number`) - Current costume index.

**Description:**
Returns the index of the sprite's current costume.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');
sprite.switchCostume(1);

sprite.onReady(() => {
    const costumeIndex = sprite.getCostumeIndex(); // Returns 1
});
```

## Sounds

This section describes methods for adding, removing, playing, and pausing sounds associated with the sprite.

### Method addSound()

```javascript
addSound(soundPath: string, name?: string): this
```

Adds a sound file to the sprite.

**Parameters:**
*   `soundPath` (`string`) - Path to the sound file.
*   `name` (`string`, optional) - Sound name. If not specified, a default name is used.

**Returns:**
*   (`this`) - Returns the current sprite.

**Description:**
Loads a sound file and adds it to the sprite's sound list.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/explosion.mp3');

// Add sound with a custom name
sprite.addSound('sounds/jump.wav', 'jumpSound');
```

---

### Method removeSound()

```javascript
removeSound(soundIndex = 0): this
```

Removes a sound file by index.

**Parameters:**
*   `soundIndex` (`number`, optional, defaults to `0`) - Index of the sound to remove.

**Returns:**
*   (`this`) - Returns the current sprite.

**Description:**
Removes a sound file from the sprite's sound list by index.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/explosion.mp3');

sprite.onReady(() => {
    sprite.removeSound(0); // Remove the first sound
});
```

---

### Method removeSoundByName()

```javascript
removeSoundByName(soundName: string): this
```

Removes a sound file by name.

**Parameters:**
*   `soundName` (`string`) - Name of the sound to remove.

**Returns:**
*   (`this`) - Returns the current sprite.

**Description:**
Removes a sound file from the sprite's sound list by name.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/jump.wav', 'jumpSound');

sprite.onReady(() => {
    sprite.removeSoundByName('jumpSound'); // Remove sound named "jumpSound"
});
```

---

### Method playSound()

```javascript
playSound(soundIndex = 0, volume?: number, currentTime?: number): void
```

Plays a sound file.

**Parameters:**
*   `soundIndex` (`number`, optional, defaults to `0`) - Index of the sound to play.
*   `volume` (`number`, optional) - Sound volume (0 to 1).
*   `currentTime` (`number`, optional) - Playback start time (in seconds).

**Description:**
Plays a sound file from the sprite's sound list by index.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/explosion.mp3');

sprite.onReady(() => {
    sprite.playSound(); // Play the first sound

    // Play sound with 50% volume
    sprite.playSound(0, 0.5);

    // Play sound starting at 2 seconds
    sprite.playSound(0, 1, 2);
});
```

---

### Method pauseSound()

```javascript
pauseSound(soundIndex: number): void
```

Pauses sound playback.

**Parameters:**
*   `soundIndex` (`number`) - Index of the sound to pause.

**Description:**
Pauses playback of a sound file from the sprite's sound list by index.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/music.mp3');

sprite.onReady(() => {
    sprite.playSound();

    // Pause playback after 5 seconds
    setTimeout(() => {
        sprite.pauseSound(0);
    }, 5000);
});
```

---

### Method playSoundByName()

```javascript
playSoundByName(soundName: string, volume?: number, currentTime?: number): void
```

Plays a sound file by name.

**Parameters:**
*   `soundName` (`string`) - Name of the sound to play.
*   `volume` (`number`, optional) - Sound volume (0 to 1).
*   `currentTime` (`number`, optional) - Playback start time (in seconds).

**Description:**
Plays a sound file from the sprite's sound list by name.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/jump.wav', 'jumpSound');

sprite.onReady(() => {
    sprite.playSoundByName('jumpSound'); // Play sound named "jumpSound"

    // Play sound with 70% volume
    sprite.playSoundByName('jumpSound', 0.7);
});
```

---

### Method pauseSoundByName()

```javascript
pauseSoundByName(soundName: string): void
```

Pauses sound playback by name.

**Parameters:**
*   `soundName` (`string`) - Name of the sound to pause.

**Description:**
Pauses playback of a sound file from the sprite's sound list by name.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/music.mp3', 'bgMusic');

sprite.onReady(() => {
    sprite.playSoundByName('bgMusic');

    // Pause playback after 5 seconds
    setTimeout(() => {
        sprite.pauseSoundByName('bgMusic');
    }, 5000);
});
```

## Visual Functions

This section covers methods for creating visual effects and stamps on the stage.

### DrawingCallbackFunction Type

```javascript
type DrawingCallbackFunction = (context: CanvasRenderingContext2D, object: Stage | Sprite) => void;
```

Represents a callback function used for drawing on the canvas. It is called every frame to create dynamic visual effects.

**Parameters:**
*   `context` (*CanvasRenderingContext2D*) - Canvas drawing context providing drawing methods.
*   `object` (`Stage | Sprite`) - Target object (either a Stage or Sprite).

**Description:**
The `DrawingCallbackFunction` allows using canvas API capabilities to create custom drawings. Can be used to add dynamic effects to sprites or the stage.

---

### Method stamp()

```javascript
stamp(costumeIndex?: number, withRotation: boolean = true): void
```

Creates a stamp of the current costume on the stage.

**Parameters:**
* `costumeIndex` (`number`, optional) - Costume index to stamp. Uses current costume if not specified.
* `withRotation` (`boolean`, optional, defaults to `true`) - Whether to apply sprite rotation to the stamp.

**Description:**
Creates a static stamp of the current costume on the stage, preserving its position and rotation (if enabled). Throws an error if the sprite isn't ready or the costume is missing.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

sprite.onReady(() => {
    sprite.stamp(); // Stamp current costume

    // Stamp with rotation
    sprite.direction = 45;
    sprite.stamp();

    // Stamp another costume without rotation
    sprite.addCostume('images/player2.png');
    sprite.stamp(1, false);
});
```

---

### Method pen()

```javascript
pen(callback: DrawingCallbackFunction): void
```

Adds a drawing function to the sprite.

**Parameters:**
* `callback` (*DrawingCallbackFunction*) - Drawing function.

**Description:**
Allows adding custom drawings to the sprite. The `callback` is called every frame for dynamic effects.

**Example:**

```javascript
const sprite = new Sprite(stage);

sprite.pen((context, sprite) => {
    context.fillStyle = 'red';
    context.fillRect(sprite.x, sprite.y, 50, 50);
});
```

## Visual Properties

This section covers visual properties like opacity, filters, rotation style, layer, and visibility.

### Property opacity

Controls sprite transparency.

**Parameters:**
* `value` (*number | null*) - Opacity value (0 to 1) or `null` to reset.

**Description:**
Sets sprite transparency. `null` resets to default value.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.opacity = 0.5; // Set 50% opacity
sprite.opacity = null; // Reset to default
```

---

### Property filter

Applies CSS filters to the sprite.

**Parameters:**
* `value` (*string | null*) - CSS filter string or `null` to reset.

**Description:**
Applies CSS filters. `null` removes existing filters.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.filter = 'grayscale(100%)'; // Apply grayscale filter
sprite.filter = null; // Remove filter
```

---

### Property rotateStyle

Controls rotation style.

**Parameters:**
* `value` (`string`) - Rotation style: `'normal'`, `'leftRight'`, `'none'`.

**Description:**
Sets rotation style for the sprite and its children, affecting how rotation is displayed.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.rotateStyle = 'leftRight'; // Allow left/right flipping only
```

---

### Property layer

Controls rendering layer.

**Parameters:**
* `newLayer` (`number`) - New layer value.

**Description:**
Sets rendering layer for the sprite and its children. Higher layers appear on top.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.layer = 5; // Set to layer 5
```

---

### Property hidden

Controls sprite visibility.

**Parameters:**
* `value` (`boolean`) - `true` hides the sprite, `false` shows it.

**Description:**
Sets visibility for the sprite and its children.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.hidden = true; // Hide sprite
sprite.hidden = false; // Show sprite
```

## Movements

This section covers methods for controlling sprite movement, including positioning, rotation, and bouncing off stage edges.

### Method move()

```javascript
move(steps: number): void
```

Moves the sprite by a specified number of steps in its current direction.

**Parameters:**
* `steps` (`number`) - Number of steps to move.

**Description:**
Updates the sprite's position based on its current direction using trigonometric calculations for X/Y axis offsets.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.direction = 45; // Set direction to 45 degrees
sprite.move(10); // Move sprite 10 steps forward
```

---

### Method pointForward()

```javascript
pointForward(object: TransformableObject): void
```

Rotates the sprite to face a specified object.

**Parameters:**
* `object` (*TransformableObject*) - Target object to face.

**Description:**
Adjusts the sprite's direction to point toward the target object's global coordinates.

**Example:**

```javascript
const sprite = new Sprite(stage);
const target = new Sprite(stage);
target.x = 100;
target.y = 100;

sprite.pointForward(target); // Rotate sprite toward target
```

---

### Method getDistanceTo()

```javascript
getDistanceTo(object: TransformableObject): number
```

Returns distance to a specified object.

**Parameters:**
* `object` (*TransformableObject*) - Target object.

**Returns:**
*   (`number`) - Distance in pixels.

**Description:**
Calculates Euclidean distance between the sprite and target using global coordinates.

**Example:**

```javascript
const sprite = new Sprite(stage);
const target = new Sprite(stage);
target.x = 100;
target.y = 100;

const distance = sprite.getDistanceTo(target);
console.log(distance); // Output: 141.421...
```

---

### Method bounceOnEdge()

```javascript
bounceOnEdge(): void
```

Makes sprite bounce off stage edges.

**Description:**
Reverses movement direction when sprite touches stage boundaries.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.forever(() => {
    sprite.move(2); // Continuous movement
    sprite.bounceOnEdge(); // Bounce at edges
});
```

## Geometry

This section covers properties and methods for managing sprite position, size, rotation, and pivot offset.

### Property x

Controls X coordinate.

**Parameters:**
* `value` (`number`) - New X position.

**Description:**
Sets X coordinate and updates child positions/colliders.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.x = 100; // Set X to 100
```

---

### Property y

Controls Y coordinate.

**Parameters:**
* `value` (`number`) - New Y position.

**Description:**
Sets Y coordinate and updates child positions/colliders.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.y = 100; // Set Y to 100
```

---

### Property globalX

Returns global X coordinate.

**Description:**
Calculates X position relative to stage, considering parent hierarchy.

**Example:**

```javascript
const parent = new Sprite(stage);
const child = new Sprite(stage);
parent.x = 100;
child.setParent(parent);
child.x = 50;

console.log(child.globalX); // Output: 150
```

---

### Property globalY

Returns global Y coordinate.

**Description:**
Calculates Y position relative to stage, considering parent hierarchy.

**Example:**

```javascript
const parent = new Sprite(stage);
const child = new Sprite(stage);
parent.y = 100;
child.setParent(parent);
child.y = 50;

console.log(child.globalY); // Output: 150
```

---

### Property rightX

Returns right boundary coordinate.

**Description:**
Calculates right edge position considering width and collider offset.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.x = 100;
sprite.width = 50;

console.log(sprite.rightX); // Output: 125
```

---

### Property leftX

Returns left boundary coordinate.

**Description:**
Calculates left edge position considering width and collider offset.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.x = 100;
sprite.width = 50;

console.log(sprite.leftX); // Output: 75
```

---

### Property topY

Returns top boundary coordinate.

**Description:**
Calculates top edge position considering height and collider offset.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.y = 100;
sprite.height = 50;

console.log(sprite.topY); // Output: 75
```

---

### Property bottomY

Returns bottom boundary coordinate.

**Description:**
Calculates bottom edge position considering height and collider offset.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.y = 100;
sprite.height = 50;

console.log(sprite.bottomY); // Output: 125
```

---

### Property width

Returns current width.

**Description:**
For polygonal colliders: calculates rotated width. Otherwise returns base width.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.width = 50;
console.log(sprite.width); // Output: 50
```

---

### Property height

Returns current height.

**Description:**
For polygonal colliders: calculates rotated height. Otherwise returns base height.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.height = 50;
console.log(sprite.height); // Output: 50
```

---

### Property sourceWidth

Returns original width.

**Description:**
Ignores rotation effects on dimensions.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.width = 50;
sprite.direction = 45;
console.log(sprite.sourceWidth); // Output: 50
```

---

### Property sourceHeight

Returns original height.

**Description:**
Ignores rotation effects on dimensions.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.height = 50;
sprite.direction = 45;
console.log(sprite.sourceHeight); // Output: 50
```

---

### Property size

Controls sprite scale.

**Parameters:**
* `value` (`number`) - Size percentage relative to original.

**Description:**
Scales sprite and updates children/colliders.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.size = 50; // Set to 50% scale
```

---

### Property direction

Controls rotation angle.

**Parameters:**
* `direction` (`number`) - Degrees (0=up, 90=right, 180=down, 270=left).

**Description:**
Sets rotation angle normalized to 0-360 degrees.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.direction = 45; // 45 degree rotation
```

---

### Property globalDirection

Controls global rotation.

**Parameters:**
* `value` (`number`) - Global rotation in degrees.

**Description:**
Sets rotation considering parent's rotation.

**Example:**

```javascript
const parent = new Sprite(stage);
const child = new Sprite(stage);
parent.direction = 90;
child.setParent(parent);
child.globalDirection = 45; // Absolute rotation
```

---

### Property globalAngleRadians

Returns global rotation in radians.

**Description:**
Converts global direction from degrees to radians.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.direction = 180;
console.log(sprite.globalAngleRadians); // Output: Math.PI
```

---

### Property pivotOffsetX

```javascript
set pivotOffsetX(value: number): void
get pivotOffsetX(): number
```

Controls X-axis pivot offset.

**Parameters:**
* `value` (`number`) - New X pivot offset.

**Description:**
Sets rotation/positioning center offset on X-axis.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.pivotOffsetX = 10; // Shift pivot 10px right
```

---

### Property pivotOffsetY

```javascript
set pivotOffsetY(value: number): void
get pivotOffsetY(): number
```

Controls Y-axis pivot offset.

**Parameters:**
* `value` (`number`) - New Y pivot offset.

**Description:**
Sets rotation/positioning center offset on Y-axis.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.pivotOffsetY = 10; // Shift pivot 10px down
```

---

### Method setPivotOffset()

```javascript
setPivotOffset(x: number = 0, y: number = 0): this
```

Sets pivot point offset.

**Parameters:**
* `x` (`number`, default `0`) - X offset.
* `y` (`number`, default `0`) - Y offset.

**Returns:**
* (`this`) - Current sprite.

**Description:**
Defines custom rotation/positioning center.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setPivotOffset(10, 10); // Set pivot to (10,10)
```

## Collision Detection

This section covers methods that allow detecting whether a sprite is touching other sprites, the mouse, the edge of the scene, or objects with specific tags.

### Method touchSprite()

```javascript
touchSprite(sprite: Sprite, checkChildren: boolean = true): boolean
```

Checks if the sprite is touching another sprite.

**Parameters:**

* `sprite` (`Sprite`) - The sprite to check for collision with.
* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprites are touching, `false` otherwise.

**Description:**

Checks if the colliders of the two sprites intersect. If `checkChildren` is `true`, collision with the children of the specified sprite is also checked.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;

if (sprite1.touchSprite(sprite2)) {
    console.log('The sprites are touching each other!');
}
```

---

### Method touchSprites()

```javascript
touchSprites(sprites: Sprite[], checkChildren: boolean = true): boolean
```

Checks if the sprite is touching any of the specified sprites.

**Parameters:**

* `sprites` (*Sprite[]*) - An array of sprites to check for collision with.
* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the children of the sprites.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching at least one of the specified sprites, `false` otherwise.

**Description:**

Iterates through the array of sprites and checks if the current sprite is touching any of them.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;

const sprite3 = new Sprite(stage);
sprite3.setRectCollider('main', 32, 32);
sprite3.x = 100;

const sprites = [sprite2, sprite3];

if (sprite1.touchSprites(sprites)) {
    console.log('A sprite touches one of the sprites in the array!');
}
```

---

### Method touchMouse()

```javascript
touchMouse(checkChildren: boolean = true): boolean
```

Checks if the sprite is touching the mouse cursor.

**Parameters:**

* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching the mouse cursor, `false` otherwise.

**Description:**

Checks if the mouse cursor is inside the sprite's collider.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);

if (sprite.touchMouse()) {
    console.log('The mouse cursor is above the sprite!');
}
```

---

### Method touchPoint()

```javascript
touchMousePoint(point: PointCollider, checkChildren: boolean = true): boolean
```

Checks if the sprite is touching a specified point (e.g., mouse coordinates).

**Parameters:**

* `point` (*PointCollider*) - The point to check for collision.
* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching the point, `false` otherwise.

**Description:**

Checks if the specified point is inside the sprite's collider.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);

const point = new PointCollider(50, 50);

if (sprite.touchPoint(point)) {
    console.log('The point is inside the sprite!');
}
```

---

### Method touchEdge()

```javascript
touchEdge(checkChildren: boolean = true): boolean
```

Checks if the sprite is touching the edge of the scene.

**Parameters:**

* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching the scene edge, `false` otherwise.

**Description:**

Checks if any part of the sprite's boundaries exceeds the scene's edges.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.x = -10;

if (sprite.touchEdge()) {
    console.log('The sprite touches the edge of the stage!');
}
```

---

### Method touchTopEdge()

```javascript
touchTopEdge(checkChildren: boolean = true): boolean
```

Checks if the sprite is touching the top edge of the scene.

**Parameters:**

* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching the top edge, `false` otherwise.

**Description:**

Checks if the sprite's upper boundary exceeds the scene's top edge.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.y = -10;

if (sprite.touchTopEdge()) {
    console.log('The sprite is touching the top edge of the stage!');
}
```

---

### Method touchBottomEdge()

```javascript
touchBottomEdge(checkChildren: boolean = true): boolean
```

Checks if the sprite is touching the bottom edge of the scene.

**Parameters:**

* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching the bottom edge, `false` otherwise.

**Description:**

Checks if the sprite's lower boundary exceeds the scene's bottom edge.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.y = stage.height + 10;

if (sprite.touchBottomEdge()) {
    console.log('The sprite is touching the bottom edge of the stage!');
}
```

---

### Method touchLeftEdge()

```javascript
touchLeftEdge(checkChildren: boolean = true): boolean
```

Checks if the sprite is touching the left edge of the scene.

**Parameters:**

* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching the left edge, `false` otherwise.

**Description:**

Checks if the sprite's left boundary exceeds the scene's left edge.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.x = -10;

if (sprite.touchLeftEdge()) {
    console.log('The sprite is touching the left edge of the stage!');
}
```

---

### Method touchRightEdge()

```javascript
touchRightEdge(checkChildren: boolean = true): boolean
```

Checks if the sprite is touching the right edge of the scene.

**Parameters:**

* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching the right edge, `false` otherwise.

**Description:**

Checks if the sprite's right boundary exceeds the scene's right edge.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.x = stage.width + 10;

if (sprite.touchRightEdge()) {
    console.log('The sprite is touching the right edge of the stage!');
}
```

---

### Method touchTag()

```javascript
touchTag(tagName: string, checkChildren: boolean = true): boolean
```

Checks if the sprite is touching an object with the specified tag.

**Parameters:**

* `tagName` (`string`) - The tag to search for.
* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching an object with the tag, `false` otherwise.

**Description:**

Checks if the sprite's collider intersects with colliders of other sprites that have the specified tag.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;
sprite2.addTag('enemy');

if (sprite1.touchTag('enemy')) {
    console.log('The sprite touches the enemy!');
}
```

---

### Method touchTagAll()

```javascript
touchTagAll(tagName: string, checkChildren: boolean = true): Sprite[] | false
```

Checks if the sprite is touching all objects with the specified tag and returns an array of those objects.

**Parameters:**

* `tagName` (`string`) - The tag to search for.
* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (*Sprite[] | false*) - An array of sprites touching the specified tag, or `false` if none.

**Description:**

Checks if the sprite's collider intersects with colliders of other sprites that have the specified tag.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;
sprite2.addTag('enemy');

const sprite3 = new Sprite(stage);
sprite3.setRectCollider('main', 32, 32);
sprite3.x = 100;
sprite3.addTag('enemy');

const enemies = sprite1.touchTagAll('enemy');

if (enemies) {
    console.log('The sprite touches the enemies!');
    console.log(enemies);
}
```

---

### Method touchAnySprite()

```javascript
touchAnySprite(checkChildren: boolean = true): boolean
```

Checks if the sprite is touching any other sprite.

**Parameters:**

* `checkChildren` (`boolean`, optional, default `true`) - Whether to check collision with the sprite's children.

**Return Value:**

* (`boolean`) - `true` if the sprite is touching any other sprite, `false` otherwise.

**Description:**

Checks if the sprite's collider intersects with colliders of any other sprites on the scene.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;

if (sprite1.touchAnySprite()) {
    console.log('A sprite touches another sprite!');
}
```

---

### Property overlap

Returns the overlap amount during a collision.

**Return Value:**

* (`number`) - The overlap amount.

**Description:**

Returns the overlap between colliders during a collision. Returns `0` if no collision.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 10;

if (sprite1.touchSprite(sprite2)) {
    console.log('The amount of overlap: ' + sprite1.overlap);
}
```

---

### Property overlapX

Returns the overlap amount along the X-axis during a collision.

**Return Value:**

* (`number`) - The X-axis overlap amount.

**Description:**

Returns the overlap between colliders along the X-axis during a collision. Returns `0` if no collision.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 10;

if (sprite1.touchSprite(sprite2)) {
    console.log('The amount of overlap on the X-axis: ' + sprite1.overlapX);
}
```

---

### Property overlapY

Returns the overlap amount along the Y-axis during a collision.

**Return Value:**

* (`number`) - The Y-axis overlap amount.

**Description:**

Returns the overlap between colliders along the Y-axis during a collision. Returns `0` if no collision.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.y = 10;

if (sprite1.touchSprite(sprite2)) {
    console.log('The amount of overlap on the Y axis: ' + sprite1.overlapY);
}
```

---

### Property otherSprite

Returns the sprite involved in the collision.

**Return Value:**

* (*Sprite | null*) - The collided sprite, or `null` if no collision.

**Description:**

Returns the sprite object that collided with the current sprite.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 10;

if (sprite1.touchSprite(sprite2)) {
    const otherSprite = sprite1.otherSprite;
    console.log('The touch happened to the sprite: ' + otherSprite.name);
}
```

---

### Property otherMainSprite

Returns the main (root) sprite involved in the collision.

**Return Value:**

* (*Sprite | null*) - The main collided sprite, or `null` if no collision.

**Description:**

Returns the main sprite object that collided with the current sprite.

**Example:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 10;

if (sprite1.touchSprite(sprite2)) {
    const otherMainSprite = sprite1.otherMainSprite;
    console.log('The touch occurred with the main sprite: ' + otherMainSprite.name);
}
```

## Loops and Schedulers

This section describes methods for scheduling function execution with delays or intervals, allowing the creation of animations, timers, and other dynamic effects.

### ScheduledCallbackFunction Type

```javascript
type ScheduledCallbackFunction = (context: Stage | Sprite, state: ScheduledState) => boolean | void;
```

Type for functions to be called by the scheduler.

**Parameters:**

*   `context` (`Stage | Sprite`) - the stage or sprite for which execution is scheduled.
*   `state` (`ScheduledState`) - state object containing scheduling information.

**Return Value:**

*   (*boolean | void*) - if the function returns `false`, the scheduler will stop.

### ScheduledState Class

```javascript
class ScheduledState {
    interval: number;
    maxIterations?: number;
    currentIteration?: number;
}
```

Class representing the state of scheduled execution.

**Properties:**

*   `interval` (`number`) - interval between function calls (in milliseconds).
*   `maxIterations` (`number`, optional) - maximum number of repetitions. If not specified, repetition continues infinitely.
*   `currentIteration` (`number`, optional) - current iteration.

---

### Method timeout()

```javascript
timeout(callback: ScheduledCallbackFunction, timeout: number): void
```

Executes a function once after a specified delay.

**Parameters:**

*   `callback` (`ScheduledCallbackFunction`) - function to execute.
*   `timeout` (`number`) - delay before execution (in milliseconds).

**Description:**

Schedules function execution after the specified delay. Equivalent to using `repeat` with `repeat: 1`.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.timeout(() => {
    console.log('Executed after delay!');
}, 2000); // Executes after 2 seconds
```

---

### Method repeat()

```javascript
repeat(callback: ScheduledCallbackFunction, repeat: number, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState
```

Executes a function a specified number of times at given intervals.

**Parameters:**

*   `callback` (`ScheduledCallbackFunction`) - function to execute.
*   `repeat` (`number`) - number of repetitions.
*   `interval` (`number`, optional) - interval between executions (in milliseconds). If omitted, the function runs as fast as possible.
*   `timeout` (`number`, optional) - maximum execution time (in milliseconds). If specified, execution stops after this time.
*   `finishCallback` (`ScheduledCallbackFunction`, optional) - function to call after all repetitions complete.

**Return Value:**

*   (`ScheduledState`) - state object containing scheduling information.

**Description:**

Schedules function execution `repeat` times with `interval` between calls. Use `timeout` to limit execution time and `finishCallback` for post-completion actions.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.repeat((sprite, state) => {
    console.log('Executed ' + state.currentIteration + ' times');
}, 5, 1000); // Executes 5 times with 1-second intervals
```

---

### Method forever()

```javascript
forever(callback: ScheduledCallbackFunction, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState
```

Executes a function infinitely at specified intervals.

**Parameters:**

*   `callback` (`ScheduledCallbackFunction`) - function to execute.
*   `interval` (`number`, optional) - interval between executions (in milliseconds). If omitted, the function runs as fast as possible.
*   `timeout` (`number`, optional) - maximum execution time (in milliseconds). If specified, execution stops after this time.
*   `finishCallback` (`ScheduledCallbackFunction`, optional) - function to call after execution stops.

**Return Value:**

*   (`ScheduledState`) - state object containing scheduling information.

**Description:**

Schedules infinite function execution with `interval` between calls. Use `timeout` to limit execution time and `finishCallback` for post-termination actions.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.forever(() => {
    console.log('Executing continuously!');
}, 500); // Executes every half-second
```

## Cloning and Sprite Lifecycle Management

This section describes methods for managing sprite lifecycle, including starting, stopping, cloning, and deletion.

### Method run()

```javascript
run(): void
```

Starts the sprite.

**Description:**

Resumes the sprite after stopping, allowing it to execute scheduled actions and respond to events.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.stop(); // Stop the sprite
sprite.run(); // Start the sprite
```

---

### Method stop()

```javascript
stop(): void
```

Stops the sprite.

**Description:**

Halts scheduled actions and blocks event responses.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.stop(); // Stop the sprite
```

---

### Method createClone()

```javascript
createClone(stage?: Stage): Sprite
```

Creates a copy of the sprite.

**Parameters:**

*   `stage` (`Stage`, optional) - stage to create the clone on. Uses the current stage if omitted.

**Return Value:**

*   (`Sprite`) - new sprite as a copy of the original.

**Description:**

Creates a new sprite by copying all properties and data from the original. Throws an error if the sprite isn't ready for cloning.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

sprite.onReady(() => {
    const clone = sprite.createClone(); // Create a clone
    clone.x = 100; // Modify clone's position
});
```

---

### Method delete()

```javascript
delete(): void
```

Deletes the sprite.

**Description:**

Removes the sprite from the stage, clears all associated resources, and deletes colliders and child elements.

**Example:**

```javascript
const sprite = new Sprite(stage);
sprite.delete(); // Delete the sprite
```

## Usage Examples

```javascript
// Create a sprite
const sprite = new Sprite(stage);
sprite.name = 'Player';

// Add costumes
sprite.addCostume('path/to/player.png');
sprite.addCostume('path/to/player2.png');

// Set initial position
sprite.x = 100;
sprite.y = 150;

// Set size
sprite.size = 50; // 50% of original size

// Add a tag
sprite.addTag('player');

// Create a rectangular collider
sprite.setRectCollider('main', 32, 32);

// Handle onReady event
sprite.onReady(() => {
    sprite.switchCostume(1);
    console.log('Sprite is ready!');
});

// Create movement loop
sprite.forever(() => {
    sprite.move(2); // Move forward 2 steps
    sprite.nextCostume(); // Switch costumes

    if (sprite.touchEdge()) {
        console.log('Touching edge');
    }

    if (sprite.touchTag('enemy')) {
        console.log('Touching sprite with enemy tag');
    }
});

// Set parent sprite
const childSprite = new Sprite(stage);
childSprite.setParent(sprite);
```

## General Recommendations

When you need to ensure all resources and objects are loaded and initialized, use the `onReady` method.
