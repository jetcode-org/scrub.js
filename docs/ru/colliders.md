# Коллайдеры, касания и теги

В этом руководстве рассмотрим систему обработки взаимодействий между объектами через коллайдеры, работу с касаниями и группировку объектов с помощью тегов.

**Важно:** если коллайдер не был добавлен вручную, то он будет создан автоматически из первого добавленного костюма. 

Если вам нужен спрайт без коллайдера удалите его явно: 
```javascript
sprite.removeCollider();
```

## 1. Типы коллайдеров

Коллайдеры определяют зону взаимодействия спрайта. Доступно 4 основных типа:

### Прямоугольный коллайдер
```javascript
const platform = new Sprite(stage);
platform.setRectCollider('main', 100, 30, 0, -15); 
// Ширина 100px, высота 30px, смещение на 15px вверх
```

### Круглый коллайдер
```javascript
const ball = new Sprite(stage);
ball.setCircleCollider('hitbox', 25); 
// Радиус 25px, имя коллайдера 'hitbox'
```

### Полигональный коллайдер
```javascript
const triangle = new Sprite(stage);
triangle.setPolygonCollider('main', [
    [0, 0],    // Левый верх
    [50, 100], // Низ
    [100, 0]   // Правый верх
]);
```

### Автоматическая генерация
```javascript
const character = new Sprite(stage);
character.addCostume('hero.png'); 
// Будет создан прямоугольный коллайдер с именем main автоматически из первого добавленного костюма
```

### Отключение создания коллайдера

```javascript
const character = new Sprite(stage);
character.addCostume('hero.png'); 
character.removeCollider(); 
// Это отключит автоматическое содание коллайдера из костюма 
```

> Подробную информацию о свойствах и методах управления коллайдерам спрайта можно найти в разделе [Игровой объект Sprite](sprite.md#коллайдеры).

---

## 2. Проверка касаний

### Основные методы

**Касание другого спрайта:**
```javascript
if (player.touchSprite(enemy)) {
    player.damage();
}
```

**Касание группы объектов:**
```javascript
const hazards = [spikes, fire, poison];
if (player.touchSprites(hazards)) {
    player.respawn();
}
```

**Взаимодействие с мышью:**
```javascript
button.forever(() => {
    if (button.touchMouse()) {
        button.scale = 1.1;
        if (game.mouseDownOnce()) {
            startGame();
        }
    }
});
```

### Проверка границ сцены

```javascript
// Общая проверка краев
if (bullet.touchEdge()) {
    bullet.destroy();
}

// Конкретные направления
if (player.touchBottomEdge()) {
    player.jump();
}
```

### Работа с координатами

```javascript
const clickPoint = new PointCollider(game.mouseX, game.mouseY);
if (map.touchPoint(clickPoint)) {
    showTooltip();
}
```

### Оптимизация проверок
```javascript
// Проверка только по главному коллайдеру
if (bullet.touchSprite(target, false)) {
    // checkChildren = false
}
```

> Подробную информацию о свойствах и методах проверке касаний спрайта можно найти в разделе [Игровой объект Sprite](sprite.md#касания).

---

## 3. Система тегов

Теги позволяют группировать объекты и проверять касания по категориям.

### Базовое использование

**Добавление тега:**
```javascript
enemy.addTag('danger');
powerUp.addTag('bonus');
```

**Проверка группы:**
```javascript
player.forever(() => {
    if (player.touchTag('danger')) {
        player.health -= 10;
    }
    
    const bonuses = player.touchTagAll('bonus');
    if (bonuses) {
        bonuses.forEach(item => {
           player.money += 10;
           item.delete();
        });
    }
});
```

### Наследование тегов

Дочерние объекты наследуют теги родителя:
```javascript
const car = new Sprite(stage);
car.addTag('vehicle');

const wheel = new Sprite(stage);
wheel.setParent(car);

console.log(wheel.hasTag('vehicle')); // true
```

### Динамическое управление тегами
```javascript
stage.forever(() => {
    if (player.touchTag('key')) {
        player.otherSprite.delete();
        door.removeTag('locked');
    }
    
    if (player.touchTag('locked')) {
        console.log('Дверь заперта!');
    }
});
```

> Подробную информацию о свойствах и методах управления тегам спрайта можно найти в разделе [Игровой объект Sprite](sprite.md#теги).

---

## 4. Работа с перекрытиями

Свойства `overlap` помогают реализовать реалистичную физику столкновений.

**Пример обработки столкновения:**
```javascript
if (player.touchSprite(wall)) {
    // Коррекция позиции
    player.x -= player.overlapX;
    player.y -= player.overlapY;
    
    // Визуальная обратная связь
    player.tint = '#FF0000';
    setTimeout(() => player.tint = '#FFFFFF', 100);
}
```

---

## 5. Отладка коллайдеров

**Визуализация:**
```javascript
// Для всей сцены
game.debugCollider = true;
game.debugColor = '#00FF0077'; // RGBA
```

**Логирование:**
```javascript
player.forever(() => {
    if (player.touchAnySprite()) {
        console.log('Столкнулся с:', player.otherSprite.name);
        console.log('Глубина:', player.overlap);
    }
});
```

---

## 6. Лучшие практики

1. Удаляйте коллайдеры там где они не нужны:
```javascript
const drop = new Sprite();
drop.removeCollider();
```

2. Отключайте проверку дочерних элементов где не нужно:
```javascript
touchTag('group', false)
```

3. Используйте составные спрайты для разных коллайдеров:
    - Физики (`body`)
    - Зон взаимодействия (`sensor`)
    - Атак (`attack`)

4. Группируйте объекты через теги:
    - `enemy`, `player`, `terrain`
    - `coin`, `gem`


