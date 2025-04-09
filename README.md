# ScrubJS — HTML5 Game Library with a Focus on Ease of Learning

[Русская версия](docs/ru/overview.md)

The architecture and naming system are inspired by Scratch, a popular visual programming environment, making ScrubJS intuitive for beginner developers.

## Purpose

The library is designed to provide a simple and accessible way to learn the fundamentals of game development, such as:

* Game loop
* Sprite management
* Event handling
* Animation
* Collisions

## Advantages

* Multi-scene support
* Built-in collider system and touch detection
* Easy handling of sounds, costumes, and layers
* Debugging tools and collider visualization
* Error display with hints

## Quick Start:

```javascript
const game = new Game(800, 600);
const stage = new Stage();

const cat = new Sprite();
cat.addCostume("cat.png");

stage.forever(() => {
    cat.move(5);
    cat.bounceOnEdge();
});

game.run();
```

## Documentation:

### Architecture:

* [Core Game Objects](docs/en/main_objects.md)
* [Game Object](docs/en/game.md)
* [Stage](docs/en/stage.md)
* [Sprite Object](docs/en/sprite.md)
* [Game Loop](docs/en/game_loop.md)

### Examples & Practices:

* [Movement, rotation, coordinates](docs/en/movement.md)
* [Pivot point](docs/en/pivot.md)
* [Determining the distance between a sprite and another object](docs/en/distance.md )
* [Costumes and animation](docs/en/animations.md)
* [Layers](docs/en/layers.md)
* [Drawing capabilities](docs/en/drawing.md)
* [In-game sounds](docs/en/sounds.md)
* [Colliders, touches, and tags](docs/en/colliders.md)
* [Multi-scene games](docs/en/multi_scene.md)
* [Visual effects: opacity and CSS filters](docs/en/visual_effects.md)
* [Composite sprites](docs/en/composite_sprites.md)
* [Debugging and performance](docs/en/debugging.md)
