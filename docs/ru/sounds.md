# Звуки в игре

Этот раздел описывает, как добавлять, воспроизводить и управлять звуками и музыкой в ScrubJS. Библиотека предоставляет простой интерфейс для работы со звуковыми эффектами.

## 1. Базовое управление звуками

### Добавление и воспроизведение

Для начала нужно загрузить звук и назначить ему имя, по которому его можно воспроизводить:

```javascript
const player = new Sprite(stage);
player.addSound('jump.wav', 'jump');

stage.forever(() => {
    if (game.keyPressed('space')) {
        player.playSoundByName('jump');   
    }
});
```

### Использование индексов звука

Вы можете добавить звук без указания имени, в этом случае, для воспроизведения, необходимо будет использовать его индекс:

```javascript
const player = new Sprite(stage);
player.addSound('jump.wav');
player.playSound(0);
```

### Динамическая громкость

Громкость звука может зависеть, например, от расстояния до игрока:

```javascript
const enemy = new Sprite(stage);
enemy.forever(() => {
    const distance = player.getDistanceTo(enemy);
    const volume = Math.max(0, 1 - distance / 500);
    enemy.sounds.get('alert').volume = volume;
});
```

### Звуки на сцене

Все те же возможности работы со звуками поддерживает и объект сцены (Stage).

Пример воспроизведения звука сценой с заданной громкостью и начальной позицией (в секундах):

```javascript
const stage = new Stage();
stage.addSound('background.mp3', 'bg_music');
stage.playSoundByName('bg_music', 0.3, 5.0); // Громкость 30%, начало с 5-й секунды
```

---

> Полную информацию о свойствах и методах управления звукам спрайта можно найти в разделе [Игровой объект Sprite](sprite.md#звуки).
