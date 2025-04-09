# Composite Sprites

ScrubJS allows creating **sprite hierarchies** where one sprite can be a "parent" and others can be "children". This is useful for building complex objects: characters with animations, machinery with rotating parts, and any structures consisting of multiple visual elements.

## 1. Creating Object Hierarchies

You can connect sprites into composite groups using the `setParent()` or `addChild()` methods. Child sprites automatically follow the parent — both in position and in rotation and scale.

### Basic Example: Robot

```javascript
const robot = new Sprite(stage);

const body = new Sprite(stage);
body.setParent(robot);

const head = new Sprite(stage);
head.setParent(body);

const armLeft = new Sprite(stage);
armLeft.setParent(body);

const armRight = new Sprite(stage);
armRight.setParent(body);

// Equivalent variant using addChild():
// robot.addChild(body);
// body.addChild(head);
// body.addChild(armLeft);
// body.addChild(armRight);

// Setting positions relative to the parent
body.y = 0;
head.y = -30;
armLeft.x = -40;
armRight.x = 40;
```

## 2. Synchronizing Transformations

Child sprites **inherit all transformations** of the parent: movement, rotation, scale, transparency, etc.

### Coordinated Movement and Animation

```javascript
robot.forever(() => {
    robot.x += 2; // The entire robot moves forward

    // Head rotation and arm waving
    head.rotation += 1;
    armLeft.rotation = Math.sin(Date.now() / 300) * 30;
});
```

### Local and Global Coordinates

If a child sprite needs to interact with the world, you can use global coordinates:

```javascript
const gun = new Sprite(stage);
gun.setParent(robot);
gun.x = 20;
gun.y = -10;

gun.onClick(() => {
    const bullet = new Sprite(stage);
    bullet.addCostume('bullet.png');
    
    bullet.setPosition(gun.globalX, gun.globalY); // Initial position
    bullet.direction = gun.parent.direction; // Parent's direction
    
    bullet.forever(() => bullet.move(5));
});
```

### Detecting Touch of a Composite Object

Even if an object consists of multiple child sprites, you can check if **it touches another sprite** using `touchSprite()`. The method works **at any level of the hierarchy** — if at least one child touches, the touch will be counted.

### Example: Robot Touches Enemy

```javascript
const robot = new Sprite(stage);
const body = new Sprite(stage);
const armLeft = new Sprite(stage);
const armRight = new Sprite(stage);

robot.addChild(body);
body.addChild(armLeft);
body.addChild(armRight);

const enemy = new Sprite(stage);
enemy.setPosition(400, 200);
enemy.addCostume('enemy.png');

// Simple touch detection:
stage.forever(() => {
    if (robot.touchSprite(enemy)) {
        console.log("Robot touches the enemy!");
    }
});
```

`touchSprite()` automatically considers **all descendants** — the check will work even if only one of the robot's arms touches the enemy.

## 3. Tips for Working with Hierarchies

- Use composite sprites for characters, interfaces, and vehicles.
- The parent can be **invisible**, serving only as a "container".
- When a parent is destroyed, all child sprites are automatically destroyed.
- **Multi-level hierarchies** (nested groups) are supported.
