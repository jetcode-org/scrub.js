# Core Game Objects

In ScrubJS, everything starts with three main entities: `Game`, `Stage`, and `Sprite`. They form the foundation of a project's architecture and are used in all games.

## Game Class

The `Game` class initializes the game. It handles canvas creation, stage management, and game startup.

[Learn more about the Game object](game.md)

## Stage Class

The `Stage` class represents a scene in the game—equivalent to a screen or level. It contains sprites, backgrounds, and manages their rendering.

[Learn more about Stages](stage.md)

## Sprite Class

The `Sprite` class represents a game object that can move, change appearance, and interact with other objects. Each sprite can have multiple costumes, sounds, and child elements.

[Learn more about the Sprite object](../en/sprite.md)

## Relationships Between Game, Stage, and Sprite

- `Game` manages all `Stage` instances.
- Each `Stage` contains multiple `Sprite` objects.
- Each `Sprite` knows its parent `Stage` and can access the `Game` through it.

## General Recommendations

The `Game`, `Stage`, and `Sprite` classes offer extensive customization for object behavior and appearance. However, some methods and properties become available only after full loading (`ready`). For example, you cannot select a costume or play a sound before loading completes.

Game loop methods (`forever`, `repeat`) only start working after the game is fully ready. A game is considered ready when all stages are completely loaded. A stage becomes ready when all images and sounds are loaded, including resources for all its sprites.
