# Coordinates, Rotations, Movements

This guide explains the full cycle of working with positioning, orientation, and moving sprites in ScrubJS.

## Contents
* [Coordinate System](#coordinate-system)
* [Sprite Boundaries](#sprite-boundaries)
* [Rotations and Direction](#rotations-and-direction)
* [Basic Movement](#basic-movement)

---

## Coordinate System

### Basic Principles
- The coordinates `(x, y)` define the **center of the sprite**.
- The X-axis: increases to the right
- The Y-axis: increases downwards

Coordinates can be modified directly:

```javascript
sprite.x += 5; // movement to the right
sprite.y -= 3; // movement upwards
```

### Local vs Global Coordinates

For child sprites, global and local coordinates differ. For sprites without parents, they are equal.

```javascript
const parent = new Sprite(stage);
parent.x = 200;

const child = new Sprite(stage);
child.setParent(parent);
child.x = 50;

console.log(child.globalX); // 250 (200 + 50)
```

**Properties:**
- `x`, `y` - local coordinates
- `globalX`, `globalY` - global coordinates considering parents

### Practical Examples

#### Centering a Sprite:
```javascript
sprite.onReady(() => {
    sprite.x = stage.width/2 - sprite.width/2;
    sprite.y = stage.height/2 - sprite.height/2;
});
```

#### Group Movement:
```javascript
const parent = new Sprite(stage);
const child = new Sprite(stage);
child.setParent(parent);

parent.forever(() => {
    parent.x += 2;
    // Child sprites move with the parent
});
```

#### Smooth Movement:
```javascript
const targetX = 400;
sprite.forever(() => {
    sprite.x += (targetX - sprite.x) * 0.1; // Smooth approach
});
```

---

## Sprite Boundaries

### Boundary Properties
| Property   | Formula                          | Description                 |
|------------|-----------------------------------|-----------------------------|
| `rightX`   | `x + width/2 + colliderOffsetX`  | Right boundary             |
| `leftX`    | `x - width/2 + colliderOffsetX`  | Left boundary               |
| `topY`     | `y - height/2 + colliderOffsetY` | Top boundary                |
| `bottomY`  | `y + height/2 + colliderOffsetY` | Bottom boundary             |

### Usage Examples

#### Handling Screen Edges
```javascript
// Keeping the sprite within the stage bounds
sprite.forever(() => {
    sprite.leftX = Math.max(sprite.leftX, 0);
    sprite.rightX = Math.min(sprite.rightX, stage.width);
    sprite.topY = Math.max(sprite.topY, 0);
    sprite.bottomY = Math.min(sprite.bottomY, stage.height);
});
```

#### Platformer: Ground Check
```javascript
const isGrounded = () => {
    return sprite.bottomY >= ground.topY - 1;
};
```

#### Alignment:
```javascript
// Aligning with the top of a platform
player.bottomY = platform.topY;
```

### Features:

- Consider the active collider:

```javascript
sprite.setRectCollider('main', 100, 50, 20, 0);
console.log(sprite.rightX); // x + 50 + 20
```

- For polygonal colliders, values are approximate
- Do not depend on the visual pivot (`pivotOffset`)

---

## Rotations and Direction

### Direction Property

Sprite direction is controlled through the `direction` property.

```javascript
// Smooth rotation
sprite.forever(() => {
    sprite.direction += 1.5; // 1.5° per frame
});

// Sharp turn
sprite.direction += 180;
```

**Features:**

* Angles are specified in degrees, clockwise.
* 0° — up, 90° — right, 180° — down, 270° — left.
* Works with fractional numbers (e.g., move(1.5)).

### `pointForward()` Method

Automatic rotation towards a target. Works with any object having `x` and `y` coordinates.

```javascript
const target = new Sprite(stage); // or const target = {x: 300, y: 200};
target.x = 300;

sprite.forever(() => {
    sprite.pointForward(target);
    sprite.move(3); // Move towards the target
});
```

**Tip:** For smooth rotation, use linear interpolation:
```javascript
const targetAngle = Math.atan2(target.y - sprite.y, target.x - sprite.x) * 180/Math.PI;
sprite.direction += (targetAngle - sprite.direction) * 0.1;
```

---

## Basic Movement

### `move()` Method

Moves the sprite in its current direction.

```javascript
sprite.direction = 60; // Angle of 60°
sprite.move(10); // 10 pixels in that direction
```

Uses trigonometry to calculate displacement, equivalent to:
```javascript
const radians = sprite.direction * Math.PI / 180;
sprite.x += Math.cos(radians) * 10;
sprite.y += Math.sin(radians) * 10;
```

### Example: Movement with Bounces

```javascript
sprite.forever(() => {
    sprite.move(5);
    sprite.bounceOnEdge();
});
```

---

> Full information about all sprite geometry properties and methods can be found in the [Sprite Object](sprite.md#geometry) section.
