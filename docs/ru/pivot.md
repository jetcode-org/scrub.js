# Центр вращения

## Метод setPivotOffset()

Позволяет изменить точку, вокруг которой происходит вращение и масштабирование спрайта.

```javascript
setPivotOffset(x: number = 0, y: number = 0): this
```

**Параметры:**

* `x` (`number`, необязательно, по умолчанию `0`) - смещение центра по оси X.
* `y` (`number`, необязательно, по умолчанию `0`) - смещение центра по оси Y.


### Как это работает?
- **По умолчанию** спрайт вращается вокруг своего геометрического центра.
- **Смещение** задается относительно исходного центра спрайта:
    - Положительный `x` — сдвиг вправо
    - Отрицательный `x` — сдвиг влево
    - Положительный `y` — сдвиг вниз
    - Отрицательный `y` — сдвиг вверх

### Примеры использования

#### Вращение вокруг края спрайта
```javascript
const windmill = new Sprite(stage);
windmill.setPivotOffset(-50, 0); // Центр смещен на 50px влево

windmill.forever(() => {
    windmill.direction += 2; // Вращение вокруг левого края
});
```

#### Орбитальное движение
```javascript
const planet = new Sprite(stage);
const star = new Sprite(stage);

planet.setPivotOffset(100, 0); // Центр смещен на 100px вправо
planet.setParent(star); // Планета становится дочерней к звезде

star.forever(() => {
    star.direction += 1; // Планета вращается вокруг звезды
});
```

#### Качающийся фонарь
```javascript
const lantern = new Sprite(stage);
lantern.setPivotOffset(0, -30); // Центр на 30px выше спрайта

lantern.forever(() => {
    lantern.direction = Math.sin(Date.now() / 300) * 30; // -30° до +30°
});
```

### Особенности

#### Влияние на дочерние объекты
```javascript
const car = new Sprite(stage);
const wheel = new Sprite(stage);

car.setPivotOffset(0, 20); // Смещение центра машины
car.addChild(wheel); // Колесо наследует трансформации родителя

// Колесо будет вращаться относительно нового центра машины
```

#### Взаимодействие с коллайдерами
Центр вращения **не влияет** на коллайдеры. Физические границы остаются прежними:
```javascript
sprite.setPivotOffset(50, 0);
sprite.setRectCollider('main', 100, 100); // Коллайдер остается центрированным
```

### Распространенные ошибки

#### Путаница с системой координат
```javascript
// Неправильно: смещение на 50px вниз
sprite.setPivotOffset(0, 50); 

// Правильно: для смещения вниз используйте положительный Y
// (Y увеличивается вниз в системе координат canvas)
```

#### Игнорирование родительских преобразований
```javascript
const parent = new Sprite(stage);
parent.x = 100;

const child = new Sprite(stage);
child.setParent(parent);
child.setPivotOffset(50, 0); // Смещение относительно родителя
```

---

> Полную информацию обо всех свойствах и методах геометрии спрайта можно найти в разделе [Игровой объект Sprite](sprite.md#геометрия).
