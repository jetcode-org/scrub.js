# Координаты, повороты, движения

Это руководство объясняет полный цикл работы с позиционированием, ориентацией и перемещением спрайтов в ScrubJS.

## Содержание
* [Система координат](#система-координат)
* [Границы спрайта](#границы-спрайта)
* [Повороты и направление](#повороты-и-направление)
* [Базовое перемещение](#базовое-перемещение)

---

## Система координат

### Базовые принципы
- Координаты `(x, y)` определяют **центр спрайта**.
- Ось X: увеличивается вправо
- Ось Y: увеличивается вниз\

Координаты можно изменять напрямую:

```javascript
sprite.x += 5; // движение вправо
sprite.y -= 3; // движение вверх
```

### Локальные vs Глобальные координаты

Для дочерних спрайтов различают глобальные и локальные координаты. Для спрайтов не имеющих родителей они равны.

```javascript
const parent = new Sprite(stage);
parent.x = 200;

const child = new Sprite(stage);
child.setParent(parent);
child.x = 50;

console.log(child.globalX); // 250 (200 + 50)
```

**Свойства:**
- `x`, `y` - локальные координаты
- `globalX`, `globalY` - глобальные координаты с учетом родителей

### Практические примеры

#### Центрирование спрайта:
```javascript
sprite.onReady(() => {
    sprite.x = stage.width/2 - sprite.width/2;
    sprite.y = stage.height/2 - sprite.height/2;
});
```

#### Групповое движение:
```javascript
const parent = new Sprite(stage);
const child = new Sprite(stage);
child.setParent(parent);

parent.forever(() => {
    parent.x += 2;
    // Дочерние спрайты двигаются вместе с родителем
});
```

#### Плавное перемещение:
```javascript
const targetX = 400;
sprite.forever(() => {
    sprite.x += (targetX - sprite.x) * 0.1; // Плавное приближение
});
```

---

## Границы спрайта

### Свойства границ
| Свойство   | Формула                          | Описание                 |
|------------|-----------------------------------|--------------------------|
| `rightX`   | `x + width/2 + colliderOffsetX`  | Правая граница           |
| `leftX`    | `x - width/2 + colliderOffsetX`  | Левая граница            |
| `topY`     | `y - height/2 + colliderOffsetY` | Верхняя граница          |
| `bottomY`  | `y + height/2 + colliderOffsetY` | Нижняя граница           |

### Примеры использования

#### Обработка краёв экрана
```javascript
// Удержание спрайта в пределах сцены
sprite.forever(() => {
    sprite.leftX = Math.max(sprite.leftX, 0);
    sprite.rightX = Math.min(sprite.rightX, stage.width);
    sprite.topY = Math.max(sprite.topY, 0);
    sprite.bottomY = Math.min(sprite.bottomY, stage.height);
});
```

#### Платформер: проверка земли
```javascript
const isGrounded = () => {
    return sprite.bottomY >= ground.topY - 1;
};
```

#### Используйте для выравнивания объектов:
```javascript
// Выравнивание по верху платформы
player.bottomY = platform.topY;
``` 

### Особенности:

- Учитывают активный коллайдер:

```javascript
sprite.setRectCollider('main', 100, 50, 20, 0);
console.log(sprite.rightX); // x + 50 + 20
```

- Для полигональных коллайдеров значения приблизительные
- Не зависят от визуального центра вращения (`pivotOffset`)

---

## Повороты и направление

### Свойство direction

Управление направлением спрайта осуществляется через свойство `direction`.

```javascript
// Плавное вращение
sprite.forever(() => {
    sprite.direction += 1.5; // 1.5° за кадр
});

// Резкий разворот
sprite.direction += 180;
```

**Особенности:**

* Углы указываются в градусах, по часовой стрелке.
* 0° — вверх, 90° — вправо, 180° — вниз, 270° — влево.
* Работает с дробными числами (например, move(1.5)).

### Метод `pointForward()`

Автоматический поворот к цели. Работает с любыми объектами, имеющими координаты `x` и `y`

```javascript
const target = new Sprite(stage); // или const target = {x: 300, y: 200};
target.x = 300;

sprite.forever(() => {
    sprite.pointForward(target);
    sprite.move(3); // Движение к цели
});
```

**Совет:** Для плавного поворота используйте линейную интерполяцию:
```javascript
const targetAngle = Math.atan2(target.y - sprite.y, target.x - sprite.x) * 180/Math.PI;
sprite.direction += (targetAngle - sprite.direction) * 0.1;
```

---

## Базовое перемещение

### Метод move()

Перемещает спрайт в текущем направлении.

```javascript
sprite.direction = 60; // Угол 60°
sprite.move(10); // 10 пикселей в направлении
```

Использует тригонометрию для расчета смещения, эквивалентный расчет 
```javascript
const radians = sprite.direction * Math.PI / 180;
sprite.x += Math.cos(radians) * 10;
sprite.y += Math.sin(radians) * 10;
```

### Пример: движение с отскоками

```javascript
sprite.forever(() => {
    sprite.move(5);
    sprite.bounceOnEdge();
});
```

---

> Полную информацию обо всех свойствах и методах геометрии спрайта можно найти в разделе [Игровой объект Sprite](sprite.md#геометрия).
