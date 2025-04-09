# Игра с несколькими сценами

ScrubJS поддерживает создание игр с несколькими сценами (stages), такими как главное меню, уровень игры, экран победы и т. д. Каждая сцена может содержать свои объекты, логику и интерфейс. В этом разделе описано, как создавать, переключать и управлять сценами в рамках одного игрового процесса.

## Создание и управление сценами

### Базовый пример

В этом примере создаются две сцены: **главное меню** и **игровая сцена**. Кнопка запуска находится в меню и при нажатии переключает игру на основной игровой уровень.

```javascript
const game = new Game();
const menuStage = new Stage();
const gameStage = new Stage();

// Кнопка старта
const startButton = new Sprite(menuStage);
startButton.addCostume('start.png');

// Игрок
const player = new Sprite(gameStage);
player.addCostume('player.png');

// Переход к игровой сцене по нажатию
menuStage.forever(() => {
    if (startButton.touchMouse() && game.mouseDownOnce()) {
        game.run(gameStage);
    }
});

// Запуск игры с меню
game.run(menuStage);
```
