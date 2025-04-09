# Collisions and Tags in ScrubJS: Comprehensive Guide

This guide covers the system for handling interactions between objects through colliders, working with collisions, and grouping objects using tags.

**Important:** If a collider is not added manually, it will be created automatically from the first added costume.

If you need a sprite without a collider, remove it explicitly:
```javascript
sprite.removeCollider();
```

## 1. Types of Colliders

Colliders define the interaction zone of a sprite. There are four main types:

### Rectangular Collider
```javascript
const platform = new Sprite(stage);
platform.setRectCollider('main', 100, 30, 0, -15); 
// Width 100px, height 30px, offset 15px upwards
```

### Circular Collider
```javascript
const ball = new Sprite(stage);
ball.setCircleCollider('hitbox', 25); 
// Radius 25px, collider name 'hitbox'
```

### Polygonal Collider
```javascript
const triangle = new Sprite(stage);
triangle.setPolygonCollider('main', [
    [0, 0],    // Top left
    [50, 100], // Bottom
    [100, 0]   // Top right
]);
```

### Automatic Generation
```javascript
const character = new Sprite(stage);
character.addCostume('hero.png'); 
// A rectangular collider with the name 'main' will be created automatically from the first added costume
```

### Disabling Collider Creation

```javascript
const character = new Sprite(stage);
character.addCostume('hero.png'); 
character.removeCollider(); 
// This will disable the automatic creation of a collider from the costume 
```

> Detailed information about the properties and methods for managing sprite colliders can be found in the [Sprite Game Object](sprite.md#colliders) section.

---

## 2. Checking Collisions

### Basic Methods

**Collision with another sprite:**
```javascript
if (player.touchSprite(enemy)) {
    player.damage();
}
```

**Collision with a group of objects:**
```javascript
const hazards = [spikes, fire, poison];
if (player.touchSprites(hazards)) {
    player.respawn();
}
```

**Interaction with the mouse:**
```javascript
button.forever(() => {
    if (button.touchMouse()) {
        button.scale = 1.1;
        if (game.mouseDownOnce()) {
            startGame();
        }
    }
});
```

### Checking Stage Edges

```javascript
// General edge check
if (bullet.touchEdge()) {
    bullet.destroy();
}

// Specific directions
if (player.touchBottomEdge()) {
    player.jump();
}
```

### Working with Coordinates

```javascript
const clickPoint = new PointCollider(game.mouseX, game.mouseY);
if (map.touchPoint(clickPoint)) {
    showTooltip();
}
```

### Optimizing Checks
```javascript
// Check only the main collider
if (bullet.touchSprite(target, false)) {
    // checkChildren = false
}
```

> Detailed information about the properties and methods for checking sprite collisions can be found in the [Sprite Game Object](sprite.md#collisions) section.

---

## 3. Tag System

Tags allow grouping objects and checking collisions by categories.

### Basic Usage

**Adding a tag:**
```javascript
enemy.addTag('danger');
powerUp.addTag('bonus');
```

**Checking a group:**
```javascript
player.forever(() => {
    if (player.touchTag('danger')) {
        player.health -= 10;
    }
    
    const bonuses = player.touchTagAll('bonus');
    if (bonuses) {
        bonuses.forEach(item => {
            item.collect();
        });
    }
});
```

### Inheriting Tags

Child objects inherit tags from their parent:
```javascript
const car = new Sprite(stage);
car.addTag('vehicle');

const wheel = new Sprite(stage);
wheel.setParent(car);

console.log(wheel.hasTag('vehicle')); // true
```

### Dynamic Tag Management
```javascript
stage.forever(() => {
    if (player.touchTag('key')) {
        player.otherSprite.delete();
        door.removeTag('locked');
    }
    
    if (player.touchTag('locked')) {
        console.log('The door is locked!');
    }
});
```

> Detailed information about the properties and methods for managing sprite tags can be found in the [Sprite Game Object](sprite.md#tags) section.

---

## 4. Working with Overlaps

The `overlap` properties help implement realistic collision physics.

**Example of handling a collision:**
```javascript
if (player.touchSprite(wall)) {
    // Position correction
    player.x -= player.overlapX;
    player.y -= player.overlapY;
    
    // Visual feedback
    player.tint = '#FF0000';
    setTimeout(() => player.tint = '#FFFFFF', 100);
}
```

---

## 5. Debugging Colliders

**Visualization:**
```javascript
// For the entire stage
game.debugCollider = true;
game.debugColor = '#00FF0077'; // RGBA
```

**Logging:**
```javascript
player.forever(() => {
    if (player.touchAnySprite()) {
        console.log('Collided with:', player.otherSprite.name);
        console.log('Depth:', player.overlap);
    }
});
```

---

## 6. Best Practices

1. Remove colliders where not needed:
```javascript
const drop = new Sprite();
drop.removeCollider();
```

2. Disable checking child elements where not needed:
```javascript
touchTag('group', false)
```

3. Use composite sprites for different colliders:
   - Physics (`body`)
   - Interaction zones (`sensor`)
   - Attack (`attack`)

4. Group objects using tags:
   - `enemy`, `player`, `terrain`
   - `coin`, `gem`
