# Game with Multiple Scenes

ScrubJS supports creating games with multiple scenes (stages), such as a main menu, game level, victory screen, etc. Each scene can contain its own objects, logic, and interface. This section describes how to create, switch, and manage scenes within a single game process.

## Creating and Managing Scenes

### Basic Example

In this example, two scenes are created: **main menu** and **game scene**. A start button is located in the menu, and when clicked, it switches the game to the main game level.

```javascript
const game = new Game();
const menuStage = new Stage();
const gameStage = new Stage();

// Start button
const startButton = new Sprite(menuStage);
startButton.addCostume('start.png');

// Player
const player = new Sprite(gameStage);
player.addCostume('player.png');

// Transition to the game scene on button click
menuStage.forever(() => {
    if (startButton.touchMouse() && game.mouseDownOnce()) {
        game.run(gameStage);
    }
});

// Start the game with the menu
game.run(menuStage);
```
