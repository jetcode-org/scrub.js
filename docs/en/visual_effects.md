# Visual Effects: Transparency and CSS Filters in ScrubJS

This section explains how to work with transparency and CSS filters to create complex visual effects.

## 1. Managing Transparency

### Basic Use of the `opacity` Property
```javascript
const ghost = new Sprite(stage);
ghost.opacity = 0.5; // 50% transparency
```

### Smooth Disappearance of an Object
```javascript
ghost.forever(() => {
    ghost.opacity -= 0.01;
    
    if(ghost.opacity  {
    if (player.touchSprite(enemy)) {
        enemy.delete();

        player.repeat((sprite, state) => {
            sprite.opacity = state.currentIteration % 2 ? 0.3 : 1;
        }, 6, 100); // 6 blinks with a 100ms interval
    }
});
```

## 2. Working with CSS Filters

### Basic Filter Types
```javascript
// Blur
sprite.filter = 'blur(5px)';

// Black and white mode
sprite.filter = 'grayscale(100%)';

// Color shift
sprite.filter = 'hue-rotate(90deg)';

// Shadow
sprite.filter = 'drop-shadow(5px 5px 5px rgba(0,0,0,0.5))';
```

### Dynamic Effects
```javascript
// Smooth color change
sprite.forever(() => {
    sprite.filter = `hue-rotate(${Date.now() % 360}deg)`;
});

// "Breathing" effect with blur
sprite.forever(() => {
    const blur = Math.abs(Math.sin(Date.now()/500)) * 10;
    sprite.filter = `blur(${blur}px)`;
});
```

## 3. Combining Filters

### Multiple Effects
```javascript
boss.filter = `
    drop-shadow(0 0 10px #FF0000)
    contrast(150%)
    brightness(0.8)
`;
```

### Animated Aura Effect
```javascript
let auraPhase = 0;
boss.forever(() => {
    auraPhase += 0.1;
    const glowSize = Math.sin(auraPhase) * 5 + 10;
    boss.filter = `
        drop-shadow(0 0 ${glowSize}px rgba(255, 0, 0, 0.7))
        brightness(${1 + Math.abs(Math.sin(auraPhase)) * 0.3})
    `;
});
```

## 4. Specific Effects

### Freeze Effect
```javascript
const freezeEffect = () => {
    sprite.filter = `
        grayscale(80%)
        blur(2px)
        contrast(120%)
    `;
    sprite.opacity = 0.8;
};
```

### Teleportation Effect
```javascript
sprite.repeat((s, state) => {
    s.opacity = Math.random();
    s.filter = `hue-rotate(${Math.random() * 360}deg)`;
}, 20, 50, 0, () => {
    s.filter = 'none';
});
```

## 5. Common Mistakes

### Incorrect Filter Syntax
```javascript
// Incorrect:
sprite.filter = 'blur 5px'; 

// Correct:
sprite.filter = 'blur(5px)';
```

### Conflicting Filters
```javascript
// Unpredictable result:
sprite.filter = 'brightness(2)';
sprite.filter = 'grayscale(100%)'; // Overwrites the previous

// Correctly combine:
sprite.filter = 'brightness(2) grayscale(100%)';
```

### Ignoring Filter Order
```javascript
// Different result:
sprite.filter = 'blur(5px) grayscale(100%)'; 
sprite.filter = 'grayscale(100%) blur(5px)';
```
