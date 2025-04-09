# Pivot Point

## Method setPivotOffset()

Allows you to change the point around which the sprite rotates and scales.

```javascript
setPivotOffset(x: number = 0, y: number = 0): this
```

**Parameters:**

* `x` (`number`, optional, default `0`) - offset of the center along the X-axis.
* `y` (`number`, optional, default `0`) - offset of the center along the Y-axis.

### How does it work?
- **By default,** the sprite rotates around its geometric center.
- **The offset** is specified relative to the original center of the sprite:
  - Positive `x` — shift to the right
  - Negative `x` — shift to the left
  - Positive `y` — shift downwards
  - Negative `y` — shift upwards

### Usage Examples

#### Rotation around the edge of the sprite
```javascript
const windmill = new Sprite(stage);
windmill.setPivotOffset(-50, 0); // The center is shifted 50px to the left

windmill.forever(() => {
    windmill.direction += 2; // Rotation around the left edge
});
```

#### Orbital motion
```javascript
const planet = new Sprite(stage);
const star = new Sprite(stage);

planet.setPivotOffset(100, 0); // The center is shifted 100px to the right
planet.setParent(star); // The planet becomes a child of the star

star.forever(() => {
    star.direction += 1; // The planet rotates around the star
});
```

#### Swinging lantern
```javascript
const lantern = new Sprite(stage);
lantern.setPivotOffset(0, -30); // The center is 30px above the sprite

lantern.forever(() => {
    lantern.direction = Math.sin(Date.now() / 300) * 30; // -30° to +30°
});
```

### Features

#### Impact on child objects
```javascript
const car = new Sprite(stage);
const wheel = new Sprite(stage);

car.setPivotOffset(0, 20); // Shift the center of the car
car.addChild(wheel); // The wheel inherits the transformations of the parent

// The wheel will rotate relative to the new center of the car
```

#### Interaction with colliders
The pivot point **does not affect** colliders. The physical boundaries remain the same:
```javascript
sprite.setPivotOffset(50, 0);
sprite.setRectCollider('main', 100, 100); // The collider remains centered
```

### Common mistakes

#### Confusion with the coordinate system
```javascript
// Incorrect: offset by 50px down
sprite.setPivotOffset(0, 50);

// Correct: to shift down, use positive Y
// (Y increases downwards in the canvas coordinate system)
```

#### Ignoring parent transformations
```javascript
const parent = new Sprite(stage);
parent.x = 100;

const child = new Sprite(stage);
child.setParent(parent);
child.setPivotOffset(50, 0); // Offset relative to the parent
```

---

> Full information about all sprite geometry properties and methods can be found in the [Sprite Object](sprite.md#geometry) section.

