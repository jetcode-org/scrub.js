# Визуальные эффекты: прозрачность и CSS-фильтры в ScrubJS

Этот раздел объясняет, как работать с прозрачностью и CSS-фильтрами для создания сложных визуальных эффектов.

## 1. Управление прозрачностью

### Базовое использование свойства `opacity`
```javascript
const ghost = new Sprite(stage);
ghost.opacity = 0.5; // 50% прозрачности
```

### Плавное исчезновение объекта
```javascript
ghost.forever(() => {
    ghost.opacity -= 0.01;
    
    if(ghost.opacity <= 0) {
        ghost.delete();
    }
});
```

### Мигание при получении урона
```javascript
stage.forever(() => {
    if (player.touchSprite(emeny)) {
        emeny.delete();

        player.repeat((sprite, state) => {
            sprite.opacity = state.currentIteration % 2 ? 0.3 : 1;
        }, 6, 100); // 6 миганий с интервалом 100ms
    }
});
```

## 2. Работа с CSS-фильтрами

### Основные типы фильтров
```javascript
// Размытие
sprite.filter = 'blur(5px)';

// Чёрно-белый режим
sprite.filter = 'grayscale(100%)';

// Смещение цвета
sprite.filter = 'hue-rotate(90deg)';

// Тень
sprite.filter = 'drop-shadow(5px 5px 5px rgba(0,0,0,0.5))';
```

### Динамические эффекты
```javascript
// Плавное изменение цвета
sprite.forever(() => {
    sprite.filter = `hue-rotate(${Date.now() % 360}deg)`;
});

// Эффект "дыхания" с размытием
sprite.forever(() => {
    const blur = Math.abs(Math.sin(Date.now()/500)) * 10;
    sprite.filter = `blur(${blur}px)`;
});
```

## 3. Комбинирование фильтров

### Множественные эффекты
```javascript
boss.filter = `
    drop-shadow(0 0 10px #FF0000)
    contrast(150%)
    brightness(0.8)
`;
```

### Анимированный эффект ауры
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

## 4. Специфические эффекты

### Эффект "заморозки"
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

### Эффект телепортации
```javascript
sprite.repeat((s, state) => {
    s.opacity = Math.random();
    s.filter = `hue-rotate(${Math.random() * 360}deg)`;
}, 20, 50, 0, () => {
    s.filter = 'none';
});
```

## 5. Распространённые ошибки

### Неправильный синтаксис фильтров
```javascript
// Неправильно:
sprite.filter = 'blur 5px'; 

// Правильно:
sprite.filter = 'blur(5px)';
```

### Конфликтующие фильтры
```javascript
// Непредсказуемый результат:
sprite.filter = 'brightness(2)';
sprite.filter = 'grayscale(100%)'; // Перезаписывает предыдущий

// Правильно комбинировать:
sprite.filter = 'brightness(2) grayscale(100%)';
```

### Игнорирование порядка фильтров
```javascript
// Разный результат:
sprite.filter = 'blur(5px) grayscale(100%)'; 
sprite.filter = 'grayscale(100%) blur(5px)';
```
