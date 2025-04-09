# Возможности рисования в ScrubJS

Этот раздел охватывает инструменты для создания графики "на лету", работы с холстом и визуальных эффектов. ScrubJS предоставляет простой и гибкий API для рисования с использованием встроенного контекста `CanvasRenderingContext2D`.

---

## 1. Динамические костюмы

### Метод `drawCostume()`

Позволяет создавать кастомные костюмы прямо в коде, используя Canvas API. Такой подход идеально подходит для генеративной графики, UI-элементов и эффектов.

```javascript
const sprite = new Sprite(stage);
sprite.drawCostume((context) => {
    context.fillStyle = '#FF5733';
    context.beginPath();
    context.arc(32, 32, 30, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = 'white';
    context.lineWidth = 3;
    context.stroke();
}, {
    width: 64,
    height: 64,
    name: 'custom_circle'
});
```

**Особенности:**
- `context` — это стандартный Canvas 2D контекст.
- `width` и `height` определяют размер холста костюма.
- Костюм можно переиспользовать, задавая `name`.
- Коллайдер автоматически рассчитывается по границам изображения, но можно переопределить вручную.

---

## 2. Перманентное рисование

Рисование может происходить не только в костюмах, но и напрямую на сцене или следом за спрайтом.

### Метод `pen()` для спрайтов

Позволяет рисовать следы, эффекты, анимации и сложные орнаменты, двигаясь по сцене.

```javascript
const brush = new Sprite(stage);
brush.pen((context, sprite) => {
    context.fillStyle = `hsl(${Date.now() % 360}, 70%, 50%)`;
    context.beginPath();
    context.arc(sprite.x, sprite.y, 10, 0, Math.PI * 2);
    context.fill();
});

brush.forever(() => {
    const mouse = game.getMousePoint();
    brush.x = mouse.x;
    brush.y = mouse.y;
});
```

### Рисование непосредственно на сцене

Подходит для создания эффектов, фонов, спецэффектов, интерфейсов и визуализаций.

```javascript
stage.pen((context, stage) => {
    // Градиентный фон
    const gradient = context.createLinearGradient(0, 0, stage.width, 0);
    gradient.addColorStop(0, '#1A2980');
    gradient.addColorStop(1, '#26D0CE');
    context.fillStyle = gradient;
    context.fillRect(0, 0, stage.width, stage.height);

    // Анимированные круги
    context.fillStyle = 'rgba(255, 255, 255, 0.1)';
    context.beginPath();
    context.arc(
        Math.sin(Date.now() / 1000) * 200 + 400,
        300,
        50,
        0,
        Math.PI * 2
    );
    context.fill();
});
```

---

## 3. Работа со штампами

### Статичные отпечатки спрайтов

`stamp()` — это метод, который оставляет изображение текущего костюма спрайта прямо на сцене.

```javascript
const stampSprite = new Sprite(stage);
stampSprite.addCostume('icon.png');

stampSprite.onClick(() => {
    stampSprite.stamp();         // Обычный отпечаток
    stampSprite.stamp(0, true);  // С поворотом
});
```

### Штампование изображений на сцене

Можно напрямую наносить любые изображения на сцену без использования спрайтов.

```javascript
const image = new Image();
image.src = 'particle.png';

stage.forever(() => {
    if (game.mouseDown()) {
        stage.stampImage(
            image,
            game.getMousePoint().x,
            game.getMousePoint().y,
            game.getRandom(0, 360) // случайный угол поворота
        );
    }
});
```

---

## 4. Распространенные ошибки

### Утечки памяти при динамическом рисовании

Если каждый кадр создавать новый костюм, память быстро расходуется:

```javascript
// Неправильно:
sprite.forever(() => {
    sprite.drawCostume(...); // Каждый кадр — новый объект
});

// Правильно:
if (!sprite.hasCostume('dynamic')) {
    sprite.drawCostume(...);
}
```

### Игнорирование системы слоёв

Если вы используете `stage.pen()` и не указываете слой, рисунок может перекрыть важные элементы.

```javascript
// Перекрытие спрайтов:
stage.pen((context) => {
    context.fillStyle = 'black';
    context.fillRect(0, 0, stage.width, stage.height);
}, 999); // Явно на самый верхний слой
```

### Некорректные координаты

Рисование может происходить в локальных или глобальных координатах. Важно различать:

```javascript
sprite.pen((context) => {
    context.fillRect(0, 0, 50, 50); // локально (относительно спрайта)
    
    context.fillRect(sprite.globalX, sprite.globalY, 50, 50); // глобально (на сцене)
});
```
