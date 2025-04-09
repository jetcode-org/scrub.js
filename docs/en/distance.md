# Determining the Distance Between a Sprite and Another Object

## Method getDistanceTo()

Returns the distance in pixels between the current sprite and the specified object, using their global coordinates. Useful for determining the distance between objects, controlling enemy AI, and activating events at a distance.

```javascript
getDistanceTo(object: TransformableObject): number
```

### Parameters:
* `object` (`TransformableObject`) - The object to which the distance is measured. Can be:  -  A Sprite (`Sprite`)  -  An object with coordinates `{ x: number, y: number }`

### Return value:
- `number` — the straight-line distance in pixels between the centers of the objects.

### How does it work?
**Calculates the global coordinates** of the current sprite and the target object, taking into account nesting in parent elements.

### Usage Examples

#### Basic example:
```javascript
const player = new Sprite(stage);
const enemy = new Sprite(stage);
enemy.x = 100;
enemy.y = 100;

// Get the distance between the player and the enemy
const distance = player.getDistanceTo(enemy);
console.log(`Distance: ${distance}px`);
```

#### Using for enemy AI:
```javascript
enemy.forever(() => {
    const dist = enemy.getDistanceTo(player);

    if (dist  {
    const allEnemies = stage.getSprites().filter(s => s.hasTag('enemy'));

    allEnemies.forEach(enemy => {
        const dist = radar.getDistanceTo(enemy);
        if (dist < 300) {
            enemy.filter = 'brightness(1.5)'; // Highlight nearby enemies
        }
    });
});
```

### Features

#### Global Coordinates:

If objects are nested in parent sprites, the method automatically takes their transformations into account:

```javascript
const parent = new Sprite(stage);
parent.x = 50;

const child = new Sprite(stage);
child.setParent(parent);
child.x = 30; // Global X coordinate = 50 + 30 = 80

console.log(child.getDistanceTo({x: 0, y: 0})); // Will output 80
```

#### Does not consider shape and colliders:

The distance is measured between the **geometric centers** of the objects, even if they have a complex shape:

```javascript
// For precise collisions, use touchSprite()
if (sprite.touchSprite(other)) {
    // Handling the touch
}
```
