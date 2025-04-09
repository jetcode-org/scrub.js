# Костюмы и анимация

Костюмы — это визуальные образы спрайта, которые могут переключаться, создавая эффект анимации. ScrubJS предоставляет гибкие инструменты для загрузки, настройки и управления костюмами, включая поддержку изображений, спрайт-листов (сеток), динамического рисования и работы с прозрачностью и обрезкой.

## Добавление одного костюма с настройками

Метод `addCostume()` позволяет загрузить изображение и задать параметры отображения.

### Простой пример:
```javascript
sprite.addCostume('images/player_idle.png');
```

### Добавление с именем и поворотом:
```javascript
sprite.addCostume('images/player_idle.png', {
    name: 'idle',
    rotate: 90
});
```
Здесь спрайт будет повёрнут на 90° при отображении.

### Вырезка части изображения:
```javascript
sprite.addCostume('images/player_sheet.png', {
    name: 'head',
    x: 32, 
    y: 0,
    width: 32, 
    height: 32
});
```
Это позволит взять только фрагмент изображения (32×32 пикселя), начиная с координаты (32, 0).

### Отражение по горизонтали:
```javascript
sprite.addCostume('images/player_sheet.png', {
    flipX: true
});
```
Это позволит отразить изображение по вертикали.

### Отражение по горизонтали:
```javascript
sprite.addCostume('images/player_sheet.png', {
    flipY: true
});
```
Это позволит отразить изображение по вертикали.

### Прозрачность по цвету:
```javascript
sprite.addCostume('images/enemy.png', {
    alphaColor: '#FF00FF', // Цвет фона, который станет прозрачным
    alphaTolerance: 15     // Допуск (насколько близкий цвет тоже станет прозрачным)
});
```
Удобно для удаления фонового цвета, например, пурпурного (#FF00FF).

### Обрезка костюма:
```javascript
sprite.addCostume('images/player.png', {
    crop: 10
});
```
Удалит по 10 пикселей с каждой стороны изображения.

### Обрезка костюма, более точная настройка:
```javascript
sprite.addCostume('images/player.png', {
    cropTop: 5,
    cropRight: 10,
    cropBottom: 5,
    cropLeft: 10
});
```
Удалит сверху и снизу по 5 пикселей, слева и справа по 10.

---

## Загрузка костюмов из сетки (спрайт-листа)

Если у вас есть изображение с множеством кадров, например, 4×4:

```javascript
sprite.addCostumeGrid('images/player_walk.png', {
    cols: 4,
    rows: 4,
    name: 'walk'
});
```

Это создаст 16 костюмов с именами `walk0`, `walk1`, ..., `walk15`.

### С ограничением количества кадров:
```javascript
sprite.addCostumeGrid('images/player_walk.png', {
    cols: 4,
    rows: 4,
    limit: 6
});
```
Только первые 6 кадров будут добавлены.

### Пропуск кадров (offset):
```javascript
sprite.addCostumeGrid('images/player_walk.png', {
    cols: 4,
    rows: 4,
    offset: 4,
    limit: 4
});
```
Пропускаем первые 4 кадра и добавляем следующие 4.

---

## Создание костюма с помощью кода

Можно рисовать костюмы вручную:

```javascript
sprite.drawCostume((ctx) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 50, 50);
}, { width: 50, height: 50, name: 'red-square' });
```

Используйте, когда нужен простой визуал без загрузки изображений.

### Пример с кругом:
```javascript
sprite.drawCostume((ctx) => {
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(25, 25, 20, 0, 2 * Math.PI);
    ctx.fill();
}, { width: 50, height: 50, name: 'blue-circle' });
```

---

## Управление костюмами

### Переключение по индексу:
```javascript
sprite.switchCostume(1);
```

### Переключение по имени:
```javascript
sprite.switchCostumeByName('walk3');
```

### Следующий костюм (удобно для анимации):
```javascript
sprite.nextCostume(); // следующий в списке
```

С указанием диапазона:
```javascript
sprite.nextCostume(4, 7); // цикл между 4 и 7 индексами
```

### Предыдущий костюм, с указанием диапазона:
```javascript
sprite.prevCostume(4, 7); // цикл между 7 и 4 индексами
```

### Удаление костюма:
```javascript
sprite.removeCostume(0); // удаляем первый костюм
```

---

## Пример анимации из сетки

```javascript
const sprite = new Sprite(stage);
sprite.addCostumeGrid('images/player_run.png', {
    cols: 6,
    rows: 1,
    name: 'run'
});

let frame = 0;
sprite.forever(() => {
    sprite.nextCostume();
}, 100); // каждые 100 мс
```

---

## Советы

- Именование `name` важно для удобства переключения между костюмами.
- Используйте `addCostumeGrid` для загрузки анимаций из спрайт-листов.
- Параметры `alphaColor` и `alphaTolerance` особенно полезны при удалении фонов у PNG/JPG.
- Динамические костюмы (`drawCostume`) позволяют создать уникальные образы на лету.

---

> Полную информацию о свойствах и методах управления костюмами спрайта можно найти в разделе [Игровой объект Sprite](sprite.md#костюмы).
