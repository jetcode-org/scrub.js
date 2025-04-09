# Sounds in the Game

This section describes how to add, play, and manage sounds and music in ScrubJS. The library provides a simple interface for working with sound effects.

## 1. Basic Sound Management

### Adding and Playing

To start, you need to load a sound and assign it a name by which it can be played:

```javascript
const player = new Sprite(stage);
player.addSound('jump.wav', 'jump');

stage.forever(() => {
    if (game.keyPressed('space')) {
        player.playSoundByName('jump');   
    }
});
```

### Using Sound Indices

You can add a sound without specifying a name; in this case, you will need to use its index to play it:

```javascript
const player = new Sprite(stage);
player.addSound('jump.wav');
player.playSound(0);
```

### Dynamic Volume

The volume of a sound can depend, for example, on the distance to the player:

```javascript
const enemy = new Sprite(stage);
enemy.forever(() => {
    const distance = player.getDistanceTo(enemy);
    const volume = Math.max(0, 1 - distance / 500);
    enemy.sounds.get('alert').volume = volume;
});
```

### Sounds on the Stage

The stage object also supports the same sound management capabilities.

Example of playing a sound by the stage with specified volume and starting position (in seconds):

```javascript
const stage = new Stage();
stage.addSound('background.mp3', 'bg_music');
stage.playSoundByName('bg_music', 0.3, 5.0); // Volume at 30%, starting from the 5th second
```

---

> Full information about the properties and methods for managing sprite sounds can be found in the [Sprite Game Object](sprite.md#sounds) section.

