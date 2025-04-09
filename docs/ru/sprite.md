# Класс Sprite

Класс `Sprite` представляет собой динамический игровой элемент, способный перемещаться, менять внешний вид и взаимодействовать с другими объектами. Каждый спрайт может включать несколько костюмов, звуков и дочерних элементов.

## Конструктор:

```javascript
new Sprite(stage?: Stage, layer?: number);
```

Создаёт экземпляр спрайта.

**Параметры:**
* `stage` (`Stage`, необязательно) — сцена, к которой принадлежит спрайт. Если не указано, используется последняя добавленная сцена.
* `layer` (`number`, необязательно, по умолчанию `0`) — слой отрисовки (чем больше значение, тем выше на экране расположен спрайт).

## Основные свойства:

| Свойство       | Тип                       | Описание                                                                              |
|----------------|---------------------------|---------------------------------------------------------------------------------------|
| `id`           | `Symbol`, только чтение   | Уникальный идентификатор спрайта.                                                     |
| `name`         | `string`                  | Имя спрайта (по умолчанию — "No name").                                               |
| `x`            | `number`                  | Положение спрайта по оси X.                                                           |
| `y`            | `number`                  | Положение спрайта по оси Y.                                                           |
| `rightX`       | `number`                  | Координата правой границы спрайта.                                                    |
| `leftX`        | `number`                  | Координата левой границы спрайта.                                                     |
| `topY`         | `number`                  | Координата верхней границы спрайта.                                                   |
| `bottomY`      | `number`                  | Координата нижней границы спрайта.                                                    |
| `width`        | `number`, только чтение   | Ширина спрайта.                                                                       |
| `height`       | `number`, только чтение   | Высота спрайта.                                                                       |
| `direction`    | `number`                  | Направление спрайта в градусах (0 — вверх, 90 — вправо, 180 — вниз, 270 — влево).     |
| `size`         | `number`                  | Размер спрайта в процентах (100 — исходный размер).                                   |
| `costumeIndex` | `number`, только чтение   | Индекс текущего костюма спрайта.                                                      |
| `hidden`       | `boolean`                 | Определяет, видим ли спрайт (`true` — скрыт, `false` — отображается).                 |
| `opacity`      | `number`                  | Прозрачность спрайта (от 0 до 1).                                                     |
| `layer`        | `number`                  | Слой отрисовки спрайта. Спрайты на более высоких слоях перекрывают спрайты на нижних. |
| `rotateStyle`  | `string`                  | Способ отображения поворота, варианты: `'normal'`, `'leftRight'`, `'none'`.           |
| `overlapX`     | `number`, только чтение   | Степень перекрытия по оси X при столкновении.                                         |
| `overlapY`     | `number`, только чтение   | Степень перекрытия по оси Y при столкновении.                                         |
| `otherSprite`  | `Sprite`, только чтение   | Объект другого спрайта, с которым произошло касание.                                  |
| `collider`     | `Collider`, только чтение | Возвращает текущий активный коллайдер.                                                |
| `tags`         | `string[]`, только чтение | Возвращает массив всех тегов спрайта.                                                 |

## Содержание
*   [События](#события)
*   [Составные спрайты](#составные-спрайты)
*   [Коллайдеры](#коллайдеры)
*   [Теги](#теги)
*   [Костюмы](#костюмы)
*   [Звуки](#звуки)
*   [Визуальные функции](#визуальные-функции)
*   [Визуальные свойства](#визуальные-свойства)
*   [Движения](#движения)
*   [Геометрия](#геометрия)
*   [Касания](#касания)
*   [Циклы и планировщики](#циклы-и-планировщики)
*   [Клонирование и управление жизненным циклом спрайта](#клонирование-и-управление-жизненным-циклом-спрайта)
*   [Примеры использования](#примеры-использования)
*   [Общие рекомендации](#общие-рекомендации)

## События

Этот раздел описывает методы для управления событиями, связанными со спрайтом.

### Метод onReady()

```javascript
onReady(callback: CallableFunction): void
```

Регистрирует функцию обратного вызова, которая будет выполнена, когда спрайт будет готов к использованию.

**Параметры:**

*   `callback` (*CallableFunction*) - Функция, которая будет выполнена после подготовки спрайта.

**Описание:**

Добавляет функцию обратного вызова в список функций, которые будут вызваны, когда спрайт будет готов к использованию (т.е. когда загружены все необходимые ресурсы, такие как костюмы и звуки).

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

sprite.onReady(() => {
    console.log('Спрайт готов к использованию!');
    sprite.x = 100; // Установить положение спрайта
});
```

## Составные спрайты:

В этом разделе описывается, как создавать иерархию спрайтов, где один спрайт может быть родителем для других. Дочерние спрайты наследуют свойства родительского спрайта, такие как положение и теги, что позволяет создавать сложные объекты из нескольких простых.

### Метод setParent()

```javascript
setParent(parent: Sprite): this
```

Устанавливает родительский спрайт для данного спрайта.

**Параметры:**
* `parent` (`Sprite`) - родительский спрайт.

**Возвращаемое значение:**
* (`this`) - возвращает текущий спрайт.

**Описание:**

Устанавливает указанный спрайт как родительский для текущего спрайта, добавляя текущий спрайт в список дочерних элементов родительского спрайта.

**Пример использования:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);

childSprite.setParent(parentSprite);
```
---

### Метод addChild()

```javascript
addChild(child: Sprite): this
```

Добавляет дочерний спрайт к текущему спрайту.

**Параметры:**
* `child` (`Sprite`) - дочерний спрайт.

**Возвращаемое значение:**
* (`this`) - возвращает текущий спрайт.

**Описание:**

Добавляет указанный спрайт в список дочерних элементов текущего спрайта. При этом дочернему спрайту устанавливается текущий спрайт как родительский, сбрасываются координаты, направление, переносятся теги родителя.

**Пример использования:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);

parentSprite.addChild(childSprite);
```

---

### Метод removeChild()

```javascript
removeChild(child: Sprite): this
```

Удаляет дочерний спрайт из текущего спрайта.

**Параметры:**
* `child` (`Sprite`) - дочерний спрайт.

**Возвращаемое значение:**
* (`this`) - возвращает текущий спрайт.

**Описание:**

Удаляет указанный спрайт из списка дочерних элементов текущего спрайта, обнуляет ссылку на родителя и удаляет теги родителя у потомка.

**Пример использования:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);

parentSprite.addChild(childSprite);
parentSprite.removeChild(childSprite);
```
---

### Метод getChildren()

```javascript
getChildren(): Sprite[]
```

Возвращает список дочерних спрайтов текущего спрайта.

**Возвращаемое значение:**
* (`Sprite[]`) - массив дочерних спрайтов.

**Описание:**

Возвращает массив всех спрайтов, которые являются дочерними по отношению к текущему спрайту.

**Пример использования:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);
const childSprite2 = new Sprite(stage);

parentSprite.addChild(childSprite);
parentSprite.addChild(childSprite2);

parentSprite.getChildren(); // Вернет массив спрайтов [childSprite, childSprite2]
```

---

### Метод getMainSprite()

```javascript
getMainSprite(): Sprite
```

Возвращает основной (корневой) спрайт в иерархии спрайтов.

**Возвращаемое значение:**
* (`Sprite`) - основной спрайт.

**Описание:**

Если текущий спрайт имеет родительский спрайт, метод рекурсивно вызывает себя для родительского спрайта, пока не найдет корневой спрайт (тот, у которого нет родителя). Если текущий спрайт является корневым, он возвращает самого себя.

**Пример использования:**

```javascript
const parentSprite = new Sprite(stage);
const childSprite = new Sprite(stage);
const subChildSprite = new Sprite(stage);

childSprite.setParent(parentSprite);
subChildSprite.setParent(childSprite);

const mainSprite = subChildSprite.getMainSprite(); // Вернет parentSprite
```

## Коллайдеры

Этот раздел посвящен обнаружению столкновений между спрайтами. Система коллизий позволяет определять, когда спрайты касаются друг друга, что необходимо для реализации взаимодействия между объектами в игре. 

Вы можете использовать различные формы коллайдеров (прямоугольники, многоугольники, круги) и настраивать их параметры.

### Метод setRectCollider()

```javascript
setRectCollider(colliderName: string, width: number, height: number, offsetX: number = 0, offsetY: number = 0): this
```

Устанавливает прямоугольный коллайдер.

**Параметры:**

* `colliderName` (`string`) - имя коллайдера.
* `width` (`number`) - ширина коллайдера.
* `height` (`number`) - высота коллайдера.
* `offsetX` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси X.
* `offsetY` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси Y.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Создаёт и устанавливает прямоугольный коллайдер с заданными размерами и смещением.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 64); // Прямоугольник 32 на 64px
```

---

### Метод setPolygonCollider()

```javascript
setPolygonCollider(colliderName: string, points: [number, number][] = [], offsetX: number = 0, offsetY: number = 0): this
```

Устанавливает полигональный коллайдер.

**Параметры:**

* `colliderName` (`string`) - имя коллайдера.
* `points` (`[number, number][]`) - массив точек, определяющих полигон.
* `offsetX` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси X.
* `offsetY` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси Y.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Создаёт и устанавливает полигональный коллайдер на основе заданных точек и смещения.

**Пример использования:**

```javascript
const points = [
    [-16, -16],
    [16, -16],
    [16, 16],
    [-16, 16]
];

const sprite = new Sprite(stage);
sprite.setPolygonCollider('polygon', points);
```

---

### Метод setCircleCollider()

```javascript
setCircleCollider(colliderName: string, radius: number, offsetX: number = 0, offsetY: number = 0): this
```

Устанавливает круглый коллайдер.

**Параметры:**

* `colliderName` (`string`) - имя коллайдера.
* `radius` (`number`) - радиус коллайдера.
* `offsetX` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси X.
* `offsetY` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси Y.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Создаёт и устанавливает круглый коллайдер с заданным радиусом и смещением.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setCircleCollider('circle', 16); // Радиус коллайдера 16px, ширина и высота спрайта 32px
```

---

### Метод setCostumeCollider()

```javascript
setCostumeCollider(colliderName: string, costumeIndex: number = 0, offsetX: number = 0, offsetY: number = 0): this
```

Устанавливает коллайдер на основе костюма.

**Параметры:**

* `colliderName` (`string`) - имя коллайдера.
* `costumeIndex` (`number`, необязательно, по умолчанию `0`) - индекс костюма.
* `offsetX` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси X.
* `offsetY` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси Y.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Устанавливает прямоугольный коллайдер, соответствующий размерам указанного костюма.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('path/to/costume.png');

// Важно убедиться, что костюм загружен, т.к. загрузка ассетов происходит асинхронно
sprite.onReady(() => {
    sprite.setCostumeCollider('circle', 0);    
});
```

---

### Метод setCollider()

```javascript
setCollider(colliderName: string, collider: Collider, offsetX: number = 0, offsetY: number = 0): this
```

Устанавливает новый коллайдер для спрайта.

**Параметры:**

* `colliderName` (`string`) - имя коллайдера.
* `collider` (`Collider`) - объект коллайдера.
* `offsetX` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси X.
* `offsetY` (`number`, необязательно, по умолчанию `0`) - смещение коллайдера по оси Y.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Устанавливает указанный коллайдер для спрайта с заданным именем и смещением. Если коллайдер с таким именем уже существует, он удаляется из системы коллизий перед установкой нового.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);

// Круг
const collider = CircleCollider(sprite.x, sprite.y, 16, sprite.size);
sprite.setCollider('custom', collider);    

// Точка
const collider = PointCollider(sprite.x, sprite.y);
sprite.setCollider('point', collider);
```

---

### Метод removeCollider()

```javascript
removeCollider(colliderName?: string): this
```

Удаляет коллайдер.

**Параметры:**

* `colliderName` (`string`, необязательно) - имя коллайдера для удаления. Если не указано, удаляются все коллайдеры.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Удаляет указанный коллайдер или все коллайдеры, если имя не указано.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);

// Удаляем все коллайдеры. В этом случае коллайдер из костюма автоматически не будет создан
sprite.removeCollider();

// Удаляем коллайдер конкретный коллайдер
sprite.setRectCollider('rect', 32, 32);
sprite.removeCollider('rect');
````

---

### Метод getCollider()

```javascript
getCollider(colliderName: string): Collider
```

Возвращает коллайдер по имени.

**Параметры:**

* `colliderName` (`string`) - имя коллайдера.

**Возвращаемое значение:**

* (`Collider`) - Объект коллайдера.

**Описание:**

Возвращает коллайдер с указанным именем. Если коллайдер не найден, генерируется ошибка.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('rect', 32, 32);

sprite.getCollider('rect'); // Вернет коллайдер и именем 'rect'
sprite.getCollider('alien'); // Вернет null
```

---

### Метод hasCollider()

```javascript
hasCollider(colliderName: string): boolean
```

Проверяет наличие коллайдера.

**Параметры:**

* `colliderName` (`string`) - имя коллайдера.

**Возвращаемое значение:**

* (`boolean`) - `true`, если коллайдер существует, `false` - в противном случае.

**Описание:**

Проверяет, существует ли коллайдер с указанным именем.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('rect', 32, 32);

sprite.hasCollider('rect'); // Вернет true
sprite.hasCollider('alien'); // Вернет false
```

---

### Метод switchCollider()

```javascript
switchCollider(colliderName: string): this
```

Переключает активный коллайдер на указанный.

**Параметры:**

* `colliderName` (`string`) - имя коллайдера, который нужно активировать.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Если указанный коллайдер существует, он становится активным, и предыдущий коллайдер удаляется из системы коллизий. Если коллайдер с таким именем не найден, генерируется ошибка.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('rect', 32, 32);
sprite.setCircleCollider('circle', 16);

// Переключаем на круглый коллайдер
sprite.switchCollider('circle');
```

### Коллайдер по умолчанию

Если коллайдер не был определен для спрайта вручную, то автоматически будет создан прямоугольный коллайдер с именем `main` из первого добавленного костюма.

Если коллайдер для спрайта не нужен, то используйте метод `removeCollider()`. В этом случае коллайдер не будет создаваться автоматически.

**Пример использования:**

```javascript
// Коллайдер будет создан из костюма
const sprite = new Sprite(stage);
sprite.addCostume('path/to/sprite.png');

sprite.onReady(() => {
    sprite.getCollider('main'); // Вернет прямоугольный коллайдер из костюма  
});

// Спрайт без коллайдера
const withoutColliderSprite = new Sprite(stage);
sprite.addCostume('path/to/sprite.png');
withoutColliderSprite.removeCollider();

withoutColliderSprite.onReady(() => {
    sprite.getCollider('main'); // Вернет null  
});

// Коллайдер автоматически создаваться не будет
const sprite = new Sprite(stage);
sprite.setCircleCollider('circle', 20);

sprite.onReady(() => {
    sprite.getCollider('main'); // Вернет null    
    sprite.getCollider('circle'); // Вернет коллайдер 'circle' 
});
```

## Теги

Теги используются для определения касаний между спрайтами и группировки объектов. Каждый спрайт может иметь несколько тегов, которые наследуются его дочерними спрайтами.

### Метод addTag()

```javascript
addTag(tagName: string): this
```

Добавляет тег к спрайту и всем его дочерним элементам.

**Параметры:**

* `tagName` (`string`) - имя тега.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Если тег отсутствует у спрайта, он добавляется в список. Тег также автоматически применяется ко всем дочерним спрайтам.

**Пример использования:**

```javascript
const player = new Sprite(stage);
const enemy = new Sprite(stage);
enemy.addTag('enemy');

player.forever(() => {
    if (player.touchTag('enemy')) {
        console.log('Игрок коснулся врага!');
    }
});
```

---

### Метод removeTag()

```javascript
removeTag(tagName: string): this
```

Удаляет тег у спрайта и всех его дочерних элементов.

**Параметры:**

* `tagName` (`string`) - имя тега.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Удаляет указанный тег из списка текущего спрайта и его потомков. Если тег не найден, метод не выполняет действий.

**Пример использования:**

```javascript
const powerUp = new Sprite(stage);
powerUp.addTag('bonus');

// Удаляем тег через 5 секунд
setTimeout(() => {
    powerUp.removeTag('bonus');
}, 5000);
```

---

### Метод hasTag()

```javascript
hasTag(tagName: string): boolean
```

Проверяет наличие тега у спрайта.

**Параметры:**

* `tagName` (`string`) - имя тега.

**Возвращаемое значение:**

* (`boolean`) - `true`, если тег существует, `false` - в противном случае.

**Описание:**

Проверяет указанный тег у текущего спрайта.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addTag('interactive');

if (sprite.hasTag('interactive')) { 
    console.log('Спрайт взаимодействует с пользователем');
}

// Наследование тегов дочерними спрайтами:
const parent = new Sprite(stage);
const child = new Sprite(stage);

parent.addChild(child);
parent.addTag('group');

console.log(child.hasTag('group')); // Вернет: true
```

## Костюмы

Этот раздел посвящен управлению внешним видом спрайта. Костюмы - это изображения, которые спрайт может отображать. Вы можете загружать костюмы из файлов, создавать их динамически с помощью canvas API, переключаться между ними, а также настраивать их внешний вид с помощью различных опций.

### Тип данных CostumeOptions

```javascript

type CostumeOptions = {
    name?: string,
    rotate?: number,
    flipX?: boolean,
    flipY?: boolean,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    alphaColor?: string | { r: number; g: number; b: number };
    alphaTolerance?: number;
    crop?: number,
    cropTop?: number,
    cropRight?: number,
    cropBottom?: number,
    cropLeft?: number
};
```

*   `name` (`string`, необязательно): Имя костюма.
*   `rotate` (`number`, необязательно): Угол поворота костюма в градусах.
*   `flipX` (`boolean`, необязательно): Отразить ли костюм по горизонтали.
*   `flipY` (`boolean`, необязательно): Отразить ли костюм по вертикали.
*   `x` (`number`, необязательно): Координата X для вырезки части изображения.
*   `y` (`number`, необязательно): Координата Y для вырезки части изображения.
*   `width` (`number`, необязательно): Ширина для вырезки части изображения.
*   `height` (`number`, необязательно): Высота для вырезки части изображения.
*   `alphaColor` (*string | { r: number; g: number; b: number }*, необязательно): Цвет, который будет сделан прозрачным. Может быть строкой (например, `'#FF0000'`) или объектом RGB (например, `{ r: 255, g: 0, b: 0 }`).
*   `alphaTolerance` (`number`, необязательно): Допуск для прозрачности альфа-канала.
*   `crop` (`number`, необязательно): Обрезает костюм со всех сторон на указанное количество пикселей.
*   `cropTop` (`number`, необязательно): Обрезает костюм сверху на указанное количество пикселей.
*   `cropRight` (`number`, необязательно): Обрезает костюм справа на указанное количество пикселей.
*   `cropBottom` (`number`, необязательно): Обрезает костюм снизу на указанное количество пикселей.
*   `cropLeft` (`number`, необязательно): Обрезает костюм слева на указанное количество пикселей.

---

### Тип данных GridCostumeOptions

```javascript
type GridCostumeOptions = {
    cols: number,
    rows: number,
    limit?: number,
    offset?: number,
    name?: string,
    rotate?: number,
    flipX?: boolean,
    flipY?: boolean,
    imageX?: number,
    imageY?: number,
    width?: number,
    height?: number,
    alphaColor?: string | { r: number; g: number; b: number };
    alphaTolerance?: number;
    crop?: number,
    cropTop?: number,
    cropRight?: number,
    cropBottom?: number,
    cropLeft?: number
};
```

*   `cols` (`number`): Количество столбцов в сетке костюмов.
*   `rows` (`number`): Количество строк в сетке костюмов.
*   `limit` (`number`, необязательно): Максимальное количество костюмов для загрузки из сетки.
*   `offset` (`number`, необязательно): Количество костюмов, которые нужно пропустить в сетке.
*   `name` (`string`, необязательно): Префикс для имен костюмов.
*   `rotate` (`number`, необязательно): Угол поворота каждого костюма в сетке.
*   `flipX` (`boolean`, необязательно): Отразить ли каждый костюм по горизонтали.
*   `flipY` (`boolean`, необязательно): Отразить ли каждый костюм по вертикали.
*   `imageX` (`number`, необязательно): Координата X для вырезки части изображения.
*   `imageY` (`number`, необязательно): Координата Y для вырезки части изображения.
*   `width` (`number`, необязательно): Ширина для вырезки части изображения.
*   `height` (`number`, необязательно): Высота для вырезки части изображения.
*   `alphaColor` (*string | { r: number; g: number; b: number }*, необязательно): Цвет, который будет сделан прозрачным. Может быть строкой (например, `'#FF0000'`) или объектом RGB (например, `{ r: 255, g: 0, b: 0 }`).
*   `alphaTolerance` (`number`, необязательно): Допуск для прозрачности альфа-канала.
*    `crop` (`number`, необязательно): Обрезает костюм со всех сторон на указанное количество пикселей.
*   `cropTop` (`number`, необязательно): Обрезает костюм сверху на указанное количество пикселей.
*   `cropRight` (`number`, необязательно): Обрезает костюм справа на указанное количество пикселей.
*   `cropBottom` (`number`, необязательно): Обрезает костюм снизу на указанное количество пикселей.
*   `cropLeft` (`number`, необязательно): Обрезает костюм слева на указанное количество пикселей.

---

### Метод addCostume()

```javascript
addCostume(costumePath: string, options?: CostumeOptions): this
```

Добавляет костюм из файла.

**Параметры:**

*   `costumePath` (`string`) - путь к файлу костюма.
*   `options` (`CostumeOptions`, необязательно) - параметры костюма.

**Возвращаемое значение:**

*   (`this`) - возвращает текущий спрайт.

**Описание:**

Создает новый костюм, загружает изображение по указанному пути и применяет дополнительные параметры (поворот, отражение, прозрачность и т.д.).

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

// С указанием имени и поворота
sprite.addCostume('images/player.png', { name: 'idle', rotate: 90 });

// С указанием прозрачного цвета
sprite.addCostume('images/player.png', { alphaColor: '\#FFFFFF' });
```

---

### Метод addCostumeGrid()

```javascript
addCostumeGrid(costumePath: string, options: GridCostumeOptions): this
```

Добавляет набор костюмов из файла на основе сетки.

**Параметры:**

*   `costumePath` (`string`) - путь к файлу костюма, содержащему сетку изображений.
*   `options` (`GridCostumeOptions`) - параметры сетки.

**Возвращаемое значение:**

*   (`this`) - возвращает текущий спрайт.

**Описание:**

Разрезает изображение на отдельные костюмы, используя параметры сетки (количество строк, столбцов, смещение и т.д.) и добавляет их к спрайту.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);

// Загрузка сетки 4x4
sprite.addCostumeGrid('images/tileset.png', { cols: 4, rows: 4 });

// Загрузка сетки с ограничением по количеству костюмов и пропуском нескольких первых
sprite.addCostumeGrid('images/tileset.png', { cols: 4, rows: 4, limit: 8, offset: 2 });
```

---

### Метод drawCostume()

```javascript
drawCostume(callback: DrawingCallbackFunction, options?: CostumeOptions): this
```

Создает костюм с помощью функции рисования.

**Параметры:**

*   `callback` (*DrawingCallbackFunction*) - функция, которая рисует костюм на canvas.
*   `options` (`CostumeOptions`, необязательно) - параметры костюма.

**Возвращаемое значение:**

*   (`this`) - возвращает текущий спрайт.

**Описание:**

Позволяет создавать костюмы динамически, используя canvas API.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.drawCostume((context, sprite) => {
    context.fillStyle = 'red';
    context.fillRect(0, 0, 50, 50);
}, { width: 50, height: 50 });

// Динамическое создание костюма с именем
sprite.drawCostume((context, sprite) => {
    context.fillStyle = 'blue';
    context.arc(25, 25, 20, 0, 2 * Math.PI);
    context.fill();
}, { width: 50, height: 50, name: 'circle' });
```

---

### Метод removeCostume()

```javascript
removeCostume(costumeIndex: number): this
```

Удаляет костюм по индексу.

**Параметры:**

*   `costumeIndex` (`number`) - индекс костюма для удаления.

**Возвращаемое значение:**

*   (`this`) - возвращает текущий спрайт.

**Описание:**

Удаляет костюм из списка костюмов спрайта. Если удаленный костюм был текущим, устанавливает другой костюм.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');

sprite.onReady(() => {
    sprite.removeCostume(0); // Удаляем первый костюм    
});
```

---

### Метод switchCostume()

```javascript
switchCostume(costumeIndex: number): this
```

Переключает костюм по индексу.

**Параметры:**

*   `costumeIndex` (`number`) - индекс костюма.

**Возвращаемое значение:**

*   (`this`) - возвращает текущий спрайт.

**Описание:**

Устанавливает текущий костюм спрайта на костюм с указанным индексом.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');

sprite.onReady(() => {
    sprite.switchCostume(1); // Переключаемся на второй костюм
});
```

---

### Метод switchCostumeByName()

```javascript
switchCostumeByName(costumeName: string): this
```

Переключает костюм по имени.

**Параметры:**

*   `costumeName` (`string`) - имя костюма.

**Возвращаемое значение:**

*   (`this`) - возвращает текущий спрайт.

**Описание:**

Устанавливает текущий костюм спрайта на костюм с указанным именем.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png', { name: 'idle' });
sprite.addCostume('images/player2.png', { name: 'walk' });

sprite.onReady(() => {
    sprite.switchCostumeByName('walk'); // Переключаемся на костюм с именем "walk"
});
```

---

### Метод nextCostume()

```javascript
nextCostume(minCostume = 0, maxCostume?: number): number
```

Переключает на следующий костюм в пределах диапазона.

**Параметры:**

*   `minCostume` (`number`, необязательно, по умолчанию `0`) - минимальный индекс костюма в диапазоне.
*   `maxCostume` (`number`, необязательно) - максимальный индекс костюма в диапазоне.

**Возвращаемое значение:**

*   (`number`) - индекс переключенного костюма.

**Описание:**

Переключает костюм на следующий по порядку, циклически переходя к началу диапазона, если достигнут конец.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');
sprite.addCostume('images/player3.png');

sprite.onReady(() => {
    sprite.nextCostume(); // Переключаемся на следующий костюм
});
```

---

### Метод prevCostume()

```javascript
prevCostume(minCostume = 0, maxCostume?: number): number
```

Переключает на предыдущий костюм в пределах диапазона.

**Параметры:**

*   `minCostume` (`number`, необязательно, по умолчанию `0`) - минимальный индекс костюма в диапазоне.
*   `maxCostume` (`number`, необязательно) - максимальный индекс костюма в диапазоне.

**Возвращаемое значение:**

*   (`number`) - индекс переключенного костюма.

**Описание:**

Переключает костюм на предыдущий по порядку, циклически переходя к концу диапазона, если достигнуто начало.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');
sprite.addCostume('images/player3.png');

sprite.onReady(() => {
    sprite.prevCostume(); // Переключаемся на предыдущий костюм
});
```

---

### Метод getCostume()

```javascript
getCostume(): Costume
```

Возвращает текущий костюм.

**Возвращаемое значение:**

*   (`Costume`) - текущий костюм.

**Описание:**

Возвращает объект текущего костюма спрайта.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

sprite.onReady(() => {
    const currentCostume = sprite.getCostume();
});
```

---

### Метод getCostumeName()

```javascript
getCostumeName(): string
```

Возвращает имя текущего костюма.

**Возвращаемое значение:**

*   (`string`) - имя текущего костюма.

**Описание:**

Возвращает имя текущего костюма спрайта.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png', { name: 'idle' });

sprite.onReady(() => {
    const costumeName = sprite.getCostumeName(); // Вернет "idle"
});
```

---

### Метод getCostumeIndex()

```javascript
getCostumeIndex(): number
```

Возвращает индекс текущего костюма.

**Возвращаемое значение:**

*   (`number`) - индекс текущего костюма.

**Описание:**

Возвращает индекс текущего костюма спрайта.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player1.png');
sprite.addCostume('images/player2.png');
sprite.switchCostume(1);

sprite.onReady(() => {
    const costumeIndex = sprite.getCostumeIndex(); // Вернет 1
});
```

## Звуки

Этот раздел описывает методы для добавления, удаления, воспроизведения и приостановки звуков, связанных со спрайтом.

### Метод addSound()

```javascript
addSound(soundPath: string, name?: string): this
```

Добавляет звуковой файл к спрайту.

**Параметры:**

*   `soundPath` (`string`) - Путь к звуковому файлу.
*   `name` (`string`, необязательно) - Имя звука. Если не указано, используется имя по умолчанию.

**Возвращаемое значение:**

*   (`this`) - возвращает текущий спрайт.

**Описание:**

Загружает звуковой файл и добавляет его в список звуков спрайта.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/explosion.mp3');

// Добавление звука с указанием имени
sprite.addSound('sounds/jump.wav', 'jumpSound');
```

---

### Метод removeSound()

```javascript
removeSound(soundIndex = 0): this
```

Удаляет звуковой файл по индексу.

**Параметры:**

*   `soundIndex` (`number`, необязательно, по умолчанию `0`) - Индекс звука для удаления.

**Возвращаемое значение:**

*   (`this`) - возвращает текущий спрайт.

**Описание:**

Удаляет звуковой файл из списка звуков спрайта по указанному индексу.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/explosion.mp3');

sprite.onReady(() => {
    sprite.removeSound(0); // Удаляем первый звук
});
```

---

### Метод removeSoundByName()

```javascript
removeSoundByName(soundName: string): this
```

Удаляет звуковой файл по имени.

**Параметры:**

*   `soundName` (`string`) - Имя звука для удаления.

**Возвращаемое значение:**

*   (`this`) - возвращает текущий спрайт.

**Описание:**

Удаляет звуковой файл из списка звуков спрайта по указанному имени.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/jump.wav', 'jumpSound');

sprite.onReady(() => {
    sprite.removeSoundByName('jumpSound'); // Удаляем звук с именем "jumpSound"
});

```

---

### Метод playSound()

```javascript
playSound(soundIndex = 0, volume?: number, currentTime?: number): void
```

Воспроизводит звуковой файл.

**Параметры:**

*   `soundIndex` (`number`, необязательно, по умолчанию `0`) - Индекс звука для воспроизведения.
*   `volume` (`number`, необязательно) - Громкость звука (от 0 до 1).
*   `currentTime` (`number`, необязательно) - Время начала воспроизведения (в секундах).

**Описание:**

Воспроизводит звуковой файл из списка звуков спрайта по указанному индексу.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/explosion.mp3');

sprite.onReady(() => {
    sprite.playSound(); // Воспроизводим первый звук

    // Воспроизводим звук с громкостью 0.5
    sprite.playSound(0, 0.5);

    // Воспроизводим звук с началом воспроизведения с 2 секунд
    sprite.playSound(0, 1, 2);
});
```

---

### Метод pauseSound()

```javascript
pauseSound(soundIndex: number): void
```

Приостанавливает воспроизведение звукового файла.

**Параметры:**

*   `soundIndex` (`number`) - Индекс звука для приостановки.

**Описание:**

Приостанавливает воспроизведение звукового файла из списка звуков спрайта по указанному индексу.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/music.mp3');

sprite.onReady(() => {
    sprite.playSound();

    // Приостанавливаем воспроизведение через 5 секунд
    setTimeout(() => {
        sprite.pauseSound(0);
    }, 5000);
});
```

---

### Метод playSoundByName()

```javascript
playSoundByName(soundName: string, volume?: number, currentTime?: number): void
```

Воспроизводит звуковой файл по имени.

**Параметры:**

*   `soundName` (`string`) - Имя звука для воспроизведения.
*   `volume` (`number`, необязательно) - Громкость звука (от 0 до 1).
*   `currentTime` (`number`, необязательно) - Время начала воспроизведения (в секундах).

**Описание:**

Воспроизводит звуковой файл из списка звуков спрайта по указанному имени.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/jump.wav', 'jumpSound');

sprite.onReady(() => {
    sprite.playSoundByName('jumpSound'); // Воспроизводим звук с именем "jumpSound"

    // Воспроизводим звук с именем и громкостью
    sprite.playSoundByName('jumpSound', 0.7);
});
```

---

### Метод pauseSoundByName()

```javascript
pauseSoundByName(soundName: string): void
```

Приостанавливает воспроизведение звукового файла по имени.

**Параметры:**

*   `soundName` (`string`) - Имя звука для приостановки.

**Описание:**

Приостанавливает воспроизведение звукового файла из списка звуков спрайта по указанному имени.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addSound('sounds/music.mp3', 'bgMusic');

sprite.onReady(() => {
    sprite.playSoundByName('bgMusic');

    // Приостанавливаем воспроизведение через 5 секунд
    setTimeout(() => {
        sprite.pauseSoundByName('bgMusic');
    }, 5000);
});
```

## Визуальные функции

Этот раздел посвящен методам, которые позволяют создавать визуальные эффекты и отпечатки на сцене.

### Тип DrawingCallbackFunction

```javascript
type DrawingCallbackFunction = (context: CanvasRenderingContext2D, object: Stage | Sprite) => void;
```

Этот тип представляет собой функцию обратного вызова, используемую для рисования на canvas. Она вызывается для каждого кадра и позволяет создавать динамические визуальные эффекты.

**Параметры:**

*   `context` (*CanvasRenderingContext2D*) - контекст рисования canvas, предоставляющий методы для рисования.
*   `object` (`Stage | Sprite`) - объект, для которого вызывается функция. Может быть либо сцена (`Stage`), либо спрайт (`Sprite`).

**Описание:**

Функция `DrawingCallbackFunction` позволяет использовать возможности canvas API для создания пользовательских рисунков. Она может быть использована для добавления динамических эффектов к спрайтам или сцене.

---

### Метод stamp()

```javascript
stamp(costumeIndex?: number, withRotation: boolean = true): void
```

Создает отпечаток текущего костюма на сцене.

**Параметры:**

* `costumeIndex` (`number`, необязательно) - индекс костюма для отпечатка. Если не указан, используется текущий костюм.
* `withRotation` (`boolean`, необязательно, по умолчанию `true`) - учитывать ли поворот спрайта при создании отпечатка.

**Описание:**

Создает статический отпечаток текущего костюма на сцене, сохраняя его положение и поворот (если указано). Если спрайт еще не готов или костюм не найден, генерируется ошибка.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

sprite.onReady(() =&gt; {
    sprite.stamp(); // Создаем отпечаток текущего костюма

    // Создаем отпечаток с учетом поворота
    sprite.direction = 45;
    sprite.stamp();

    // Создаем отпечаток другого костюма без учета поворота
    sprite.addCostume('images/player2.png');
    sprite.stamp(1, false);
});
```

---

### Метод pen()

```javascript
pen(callback: DrawingCallbackFunction): void
```

Добавляет функцию рисования для спрайта.

**Параметры:**

* `callback` (*DrawingCallbackFunction*) - функция, которая будет рисовать на canvas.

**Описание:**

Позволяет добавлять пользовательские рисунки к спрайту. Функция `callback` вызывается для каждого кадра, позволяя создавать динамические визуальные эффекты.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);

sprite.pen((context, sprite) => {
    context.fillStyle = 'red';
    context.fillRect(sprite.x, sprite.y, 50, 50);
});
```

## Визуальные свойства

Этот раздел посвящен настройке визуальных свойств спрайта, таких как прозрачность, фильтры, стиль поворота, слой отрисовки и видимость.

### Свойство opacity

Управляет прозрачностью спрайта.

**Параметры:**

* `value` (*number | null*) - прозрачность от 0 до 1 или `null`, чтобы сбросить настройку.

**Описание:**

Устанавливает прозрачность спрайта. Если значение равно `null`, прозрачность сбрасывается до значения по умолчанию.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.opacity = 0.5; // Установить прозрачность 50%
sprite.opacity = null; // Сбросить прозрачность до значения по умолчанию
```

---

### Свойство filter

Применяет фильтр к спрайту.

**Параметры:**

* `value` (*string | null*) - строка с фильтром CSS или `null`, чтобы сбросить фильтр.

**Описание:**

Устанавливает фильтр CSS для спрайта. Если значение равно `null`, фильтр сбрасывается.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.filter = 'grayscale(100%)'; // Применить фильтр "черно-белый"
sprite.filter = null; // Сбросить фильтр
```

---

### Свойство rotateStyle

Управляет стилем поворота спрайта.

**Параметры:**

* `value` (`string`) - стиль поворота, например `'normal'`, `'leftRight'`, `'none'`.

**Описание:**

Устанавливает стиль поворота спрайта и его дочерних элементов. Это влияет на то, как спрайт будет отображаться при изменении направления.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.rotateStyle = 'leftRight'; // Установить поворот только влево и вправо
```

---

### Свойство layer

Управляет слоем отрисовки спрайта.

**Параметры:**

* `newLayer` (`number`) - новый слой для спрайта.

**Описание:**

Устанавливает слой отрисовки спрайта и его дочерних элементов. Спрайты на более высоких слоях перекрывают спрайты на нижних.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.layer = 5; // Установить спрайт на 5-й слой
```

---

### Свойство hidden

Управляет видимостью спрайта.

**Параметры:**

* `value` (`boolean`) - `true`, чтобы скрыть спрайт, `false`, чтобы отобразить.

**Описание:**

Устанавливает видимость спрайта и его дочерних элементов.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.hidden = true; // Скрыть спрайт
sprite.hidden = false; // Отобразить спрайт
```

## Движения

Этот раздел посвящен методам, которые позволяют управлять движением спрайта, включая перемещение, поворот и отскок от краев сцены.

### Метод move()

```javascript
move(steps: number): void
```

Перемещает спрайт на заданное количество шагов в текущем направлении.

**Параметры:**

* `steps` (`number`) - количество шагов для перемещения.

**Описание:**

Изменяет положение спрайта в соответствии с его текущим направлением, используя тригонометрические функции для расчета смещения по осям X и Y.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.direction = 45; // Установить направление 45 градусов
sprite.move(10); // Переместить спрайт на 10 шагов вперед
```

---

### Метод pointForward()

```javascript
pointForward(object: TransformableObject): void
```

Поворачивает спрайт в сторону указанного объекта.

**Параметры:**

* `object` (*TransformableObject*) - объект, в сторону которого нужно повернуть спрайт.

**Описание:**

Изменяет направление спрайта так, чтобы он был обращен к указанному объекту. Использует глобальные координаты объекта, если они доступны.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
const target = new Sprite(stage);
target.x = 100;
target.y = 100;

sprite.pointForward(target); // Повернуть спрайт в сторону target
```

---

### Метод getDistanceTo()

```javascript
getDistanceTo(object: TransformableObject): number
```

Возвращает расстояние до указанного объекта.

**Параметры:**

* `object` (*TransformableObject*) - объект, до которого нужно измерить расстояние.

**Возвращаемое значение:**

*   (`number`) - расстояние до указанного объекта в пикселях.

**Описание:**

Рассчитывает расстояние между спрайтом и указанным объектом, используя их глобальные координаты, если доступны.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
const target = new Sprite(stage);
target.x = 100;
target.y = 100;

const distance = sprite.getDistanceTo(target); // Получить расстояние до target
console.log(distance);
```

---

### Метод bounceOnEdge()

```javascript
bounceOnEdge(): void
```

Отскакивает спрайт от краев сцены.

**Описание:**

Если спрайт касается края сцены, меняет направление движения на противоположное, чтобы отскочить от края.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.forever(() => {
    sprite.move(2); // Двигаться вперед

    sprite.bounceOnEdge(); // Отскакивать от краев
});
```

## Геометрия

Этот раздел посвящен свойствам и методам, которые управляют положением, размерами и поворотами спрайта, а также смещением его центра.

### Свойство x

Управляет координатой X спрайта.

**Параметры:**

* `value` (`number`) - новая координата X.

**Описание:**

Устанавливает координату X спрайта. При изменении координаты обновляются позиции дочерних элементов и коллайдеров.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.x = 100; // Установить координату X в 100
```

---

### Свойство y

Управляет координатой Y спрайта.

**Параметры:**

* `value` (`number`) - новая координата Y.

**Описание:**

Устанавливает координату Y спрайта. При изменении координаты обновляются позиции дочерних элементов и коллайдеров.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.y = 100; // Установить координату Y в 100
```

---

### Свойство globalX

Возвращает глобальную координату X спрайта.

**Описание:**

Если спрайт имеет родительский спрайт, возвращает глобальную координату X, учитывая положение родителя. В противном случае возвращает локальную координату X.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
const parent = new Sprite(stage);

parent.x = 100;
sprite.setParent(parent);
sprite.x = 50;

console.log(sprite.globalX); // Выводит 150
```

---

### Свойство globalY

Возвращает глобальную координату Y спрайта.

**Описание:**

Если спрайт имеет родительский спрайт, возвращает глобальную координату Y, учитывая положение родителя. В противном случае возвращает локальную координату Y.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
const parent = new Sprite(stage);

parent.y = 100;
sprite.setParent(parent);
sprite.y = 50;

console.log(sprite.globalY); // Выводит 150
```

---

### Свойство rightX

Возвращает координату правой границы спрайта.

**Описание:**

Рассчитывает координату правой границы спрайта, учитывая его ширину и смещение коллайдера.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.x = 100;
sprite.width = 50;

console.log(sprite.rightX); // Выводит 125
```

---

### Свойство leftX

Возвращает координату левой границы спрайта.

**Описание:**

Рассчитывает координату левой границы спрайта, учитывая его ширину и смещение коллайдера.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.x = 100;
sprite.width = 50;

console.log(sprite.leftX); // Выводит 75
```

---

### Свойство topY

Возвращает координату верхней границы спрайта.

**Описание:**

Рассчитывает координату верхней границы спрайта, учитывая его высоту и смещение коллайдера.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.y = 100;
sprite.height = 50;

console.log(sprite.topY); // Выводит 75
```

---

### Свойство bottomY

Возвращает координату нижней границы спрайта.

**Описание:**

Рассчитывает координату нижней границы спрайта, учитывая его высоту и смещение коллайдера.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.y = 100;
sprite.height = 50;

console.log(sprite.bottomY); // Выводит 125
```

---

### Свойство width

Возвращает ширину спрайта.

**Описание:**

Если спрайт использует полигональный коллайдер, ширина рассчитывается с учетом поворота. В противном случае возвращает исходную ширину.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.width = 50;

console.log(sprite.width); // Выводит ширину спрайта
```

---

### Свойство height

Возвращает высоту спрайта.

**Описание:**

Если спрайт использует полигональный коллайдер, высота рассчитывается с учетом поворота. В противном случае возвращает исходную высоту.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.height = 50;

console.log(sprite.height); // Выводит высоту спрайта
```

---

### Свойство sourceWidth

Возвращает исходную ширину спрайта.

**Описание:**

Возвращает ширину спрайта без учета поворотов.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.width = 50;
sprite.direction = 45;

console.log(sprite.sourceWidth); // Выводит исходную ширину 50
```

---

### Свойство sourceHeight

Возвращает исходную высоту спрайта.

**Описание:**

Возвращает высоту спрайта без учета поворотов.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.height = 50;
sprite.direction = 45;

console.log(sprite.sourceHeight); // Выводит исходную высоту 50
```

---

### Свойство size

Управляет размером спрайта.

**Параметры:**

* `value` (`number`) - новый размер в процентах от исходного.

**Описание:**

Устанавливает размер спрайта, масштабируя его исходные размеры. При изменении размера обновляются размеры дочерних элементов и коллайдеров.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.size = 50; // Установить размер 50% от исходного
```

---

### Свойство direction

Управляет направлением спрайта.

**Параметры:**

* `direction` (`number`) - направление в градусах (0 — вверх, 90 — вправо, 180 — вниз, 270 — влево).

**Описание:**

Устанавливает направление спрайта, нормализуя его в диапазоне от 0 до 360 градусов. При изменении направления обновляются углы коллайдеров.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.direction = 45; // Установить направление 45 градусов
```

---

### Свойство globalDirection

Управляет глобальным направлением спрайта.

**Параметры:**

* `value` (`number`) - глобальное направление в градусах.

**Описание:**

Устанавливает глобальное направление спрайта, учитывая направление родительского спрайта.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
const parent = new Sprite(stage);

parent.direction = 90;
sprite.setParent(parent);
sprite.globalDirection = 45; // Установить глобальное направление 45 градусов
```

---

### Свойство globalAngleRadians

Возвращает глобальный угол спрайта в радианах.

**Описание:**

Преобразует глобальное направление спрайта из градусов в радианы.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.direction = 45;

console.log(sprite.globalAngleRadians); // Выводит угол в радианах
```

---

### Свойство pivotOffsetX

```javascript
set pivotOffsetX(value: number): void
get pivotOffsetX(): number
```

Управляет смещением центра по оси X.

**Параметры:**

* `value` (`number`) - новое смещение центра по оси X.

**Описание:**

Устанавливает смещение центра спрайта по оси X, обновляя его положение.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.pivotOffsetX = 10; // Установить смещение центра по оси X на 10
```

---

### Свойство pivotOffsetY

```javascript
set pivotOffsetY(value: number): void
get pivotOffsetY(): number
```

Управляет смещением центра по оси Y.

**Параметры:**

* `value` (`number`) - новое смещение центра по оси Y.

**Описание:**

Устанавливает смещение центра спрайта по оси Y, обновляя его положение.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.pivotOffsetY = 10; // Установить смещение центра по оси Y на 10
```

---

### Метод setPivotOffset()

```javascript
setPivotOffset(x: number = 0, y: number = 0): this
```

Устанавливает смещение центра спрайта.

**Параметры:**

* `x` (`number`, необязательно, по умолчанию `0`) - смещение центра по оси X.
* `y` (`number`, необязательно, по умолчанию `0`) - смещение центра по оси Y.

**Возвращаемое значение:**

* (`this`) - возвращает текущий спрайт.

**Описание:**

Устанавливает смещение центра спрайта, влияя на его поворот и позиционирование.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setPivotOffset(10, 10); // Установить смещение центра на (10, 10)
```

## Касания

Этот раздел посвящен методам, которые позволяют определять, касается ли спрайт других спрайтов, мыши, края сцены или объектов с определенными тегами.

### Метод touchSprite()

```javascript
touchSprite(sprite: Sprite, checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт другого спрайта.

**Параметры:**

* `sprite` (`Sprite`) - спрайт, с которым выполняется проверка касания.
* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайты касаются, `false` - в противном случае.

**Описание:**

Проверяет, пересекаются ли коллайдеры двух спрайтов. Если `checkChildren` равно `true`, также проверяется касание с дочерними элементами указанного спрайта.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;

if (sprite1.touchSprite(sprite2)) {
    console.log('Спрайты касаются друг друга!');
}
```

---

### Метод touchSprites()

```javascript
touchSprites(sprites: Sprite[], checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт одного из нескольких спрайтов.

**Параметры:**

* `sprites` (*Sprite[]*) - массив спрайтов, с которыми выполняется проверка касания.
* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайтов.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается хотя бы одного из указанных спрайтов, `false` - в противном случае.

**Описание:**

Перебирает массив спрайтов и проверяет, касается ли текущий спрайт какого-либо из них.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;

const sprite3 = new Sprite(stage);
sprite3.setRectCollider('main', 32, 32);
sprite3.x = 100;

const sprites = [sprite2, sprite3];

if (sprite1.touchSprites(sprites)) {
    console.log('Спрайт касается одного из спрайтов в массиве!');
}
```

---

### Метод touchMouse()

```javascript
touchMouse(checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт курсора мыши.

**Параметры:**

* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается курсора мыши, `false` - в противном случае.

**Описание:**

Проверяет, находится ли курсор мыши внутри коллайдера спрайта.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);

if (sprite.touchMouse()) {
    console.log('Курсор мыши находится над спрайтом!');
}
```

---

### Метод touchPoint()

```javascript
touchMousePoint(point: PointCollider, checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт указанной точки (например, координаты мыши).

**Параметры:**

* `point` (*PointCollider*) - объект, представляющий точку для проверки касания.
* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается указанной точки, `false` - в противном случае.

**Описание:**

Проверяет, находится ли указанная точка внутри коллайдера спрайта.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);

const point = new PointCollider(50, 50);

if (sprite.touchPoint(point)) {
    console.log('Точка находится внутри спрайта!');
}
```

---

### Метод touchEdge()

```javascript
touchEdge(checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт края сцены.

**Параметры:**

* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается края сцены, `false` - в противном случае.

**Описание:**

Проверяет, выходит ли какая-либо из границ спрайта за пределы сцены.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.x = -10;

if (sprite.touchEdge()) {
    console.log('Спрайт касается края сцены!');
}
```

---

### Метод touchTopEdge()

```javascript
touchTopEdge(checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт верхнего края сцены.

**Параметры:**

* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается верхнего края сцены, `false` - в противном случае.

**Описание:**

Проверяет, выходит ли верхняя граница спрайта за пределы сцены.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.y = -10;

if (sprite.touchTopEdge()) {
    console.log('Спрайт касается верхнего края сцены!');
}
```

---

### Метод touchBottomEdge()

```javascript
touchBottomEdge(checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт нижнего края сцены.

**Параметры:**

* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается нижнего края сцены, `false` - в противном случае.

**Описание:**

Проверяет, выходит ли нижняя граница спрайта за пределы сцены.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.y = stage.height + 10;

if (sprite.touchBottomEdge()) {
    console.log('Спрайт касается нижнего края сцены!');
}
```

---

### Метод touchLeftEdge()

```javascript
touchLeftEdge(checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт левого края сцены.

**Параметры:**

* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается левого края сцены, `false` - в противном случае.

**Описание:**

Проверяет, выходит ли левая граница спрайта за пределы сцены.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.x = -10;

if (sprite.touchLeftEdge()) {
    console.log('Спрайт касается левого края сцены!');
}
```

---

### Метод touchRightEdge()

```javascript
touchRightEdge(checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт правого края сцены.

**Параметры:**

* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается правого края сцены, `false` - в противном случае.

**Описание:**

Проверяет, выходит ли правая граница спрайта за пределы сцены.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.setRectCollider('main', 32, 32);
sprite.x = stage.width + 10;

if (sprite.touchRightEdge()) {
    console.log('Спрайт касается правого края сцены!');
}
```

---

### Метод touchTag()

```javascript
touchTag(tagName: string, checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт объекта с указанным тегом.

**Параметры:**

* `tagName` (`string`) - тег для поиска объектов.
* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается объекта с указанным тегом, `false` - в противном случае.

**Описание:**

Проверяет, пересекается ли коллайдер спрайта с коллайдерами других спрайтов, имеющих указанный тег.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;
sprite2.addTag('enemy');

if (sprite1.touchTag('enemy')) {
    console.log('Спрайт касается врага!');
}
```

---

### Метод touchTagAll()

```javascript
touchTagAll(tagName: string, checkChildren: boolean = true): Sprite[] | false
```

Проверяет, касается ли спрайт всех объектов с указанным тегом, и возвращает массив этих объектов.

**Параметры:**

* `tagName` (`string`) - тег для поиска объектов.
* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (*Sprite[] | false*) - Массив спрайтов, касающихся объектов с указанным тегом, или `false`, если ни один объект не касается спрайта.

**Описание:**

Проверяет, пересекается ли коллайдер спрайта с коллайдерами других спрайтов, имеющих указанный тег.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;
sprite2.addTag('enemy');

const sprite3 = new Sprite(stage);
sprite3.setRectCollider('main', 32, 32);
sprite3.x = 100;
sprite3.addTag('enemy');

const enemies = sprite1.touchTagAll('enemy');

if (enemies) {
    console.log('Спрайт касается врагов!');
    console.log(enemies);
}
```

---

### Метод touchAnySprite()

```javascript
touchAnySprite(checkChildren: boolean = true): boolean
```

Проверяет, касается ли спрайт какого-либо другого спрайта.

**Параметры:**

* `checkChildren` (`boolean`, необязательно, по умолчанию `true`) - проверять ли касание с дочерними элементами спрайта.

**Возвращаемое значение:**

* (`boolean`) - `true`, если спрайт касается какого-либо другого спрайта, `false` - в противном случае.

**Описание:**

Проверяет, пересекается ли коллайдер спрайта с коллайдерами других спрайтов на сцене.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 50;

if (sprite1.touchAnySprite()) {
    console.log('Спрайт касается другого спрайта!');
}
```

---

### Свойство overlap

Возвращает величину перекрытия при касании.

**Возвращаемое значение:**

* (`number`) - величина перекрытия.

**Описание:**

Возвращает величину перекрытия между коллайдерами при касании. Если касания нет, возвращает 0.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 10;

if (sprite1.touchSprite(sprite2)) {
    console.log('Величина перекрытия: ' + sprite1.overlap);
}
```

---

### Свойство overlapX

Возвращает величину перекрытия по оси X при касании.

**Возвращаемое значение:**

* (`number`) - величина перекрытия по оси X.

**Описание:**

Возвращает величину перекрытия между коллайдерами по оси X при касании. Если касания нет, возвращает 0.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 10;

if (sprite1.touchSprite(sprite2)) {
    console.log('Величина перекрытия по оси X: ' + sprite1.overlapX);
}
```

---

### Свойство overlapY

Возвращает величину перекрытия по оси Y при касании.

**Возвращаемое значение:**

* (`number`) - величина перекрытия по оси Y.

**Описание:**

Возвращает величину перекрытия между коллайдерами по оси Y при касании. Если касания нет, возвращает 0.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.y = 10;

if (sprite1.touchSprite(sprite2)) {
    console.log('Величина перекрытия по оси Y: ' + sprite1.overlapY);
}
```

---

### Свойство otherSprite

Возвращает спрайт, с которым произошло касание.

**Возвращаемое значение:**

* (*Sprite | null*) - спрайт, с которым произошло касание, или `null`, если касания не было.

**Описание:**

Возвращает объект спрайта, с которым произошло касание.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 10;

if (sprite1.touchSprite(sprite2)) {
    const otherSprite = sprite1.otherSprite;
    console.log('Касание произошло с спрайтом: ' + otherSprite.name);
}
```

---

### Свойство otherMainSprite

Возвращает основной (корневой) спрайт, с которым произошло касание.

**Возвращаемое значение:**

* (*Sprite | null*) - основной спрайт, с которым произошло касание, или `null`, если касания не было.

**Описание:**

Возвращает объект основного спрайта, с которым произошло касание.

**Пример использования:**

```javascript
const sprite1 = new Sprite(stage);
sprite1.setRectCollider('main', 32, 32);

const sprite2 = new Sprite(stage);
sprite2.setRectCollider('main', 32, 32);
sprite2.x = 10;

if (sprite1.touchSprite(sprite2)) {
    const otherMainSprite = sprite1.otherMainSprite;
    console.log('Касание произошло с основным спрайтом: ' + otherMainSprite.name);
}
```

## Циклы и планировщики

Этот раздел описывает методы для планирования выполнения функций с задержкой или с определенным интервалом, что позволяет создавать анимации, таймеры и другие динамические эффекты.

### Тип ScheduledCallbackFunction

```javascript
type ScheduledCallbackFunction = (context: Stage | Sprite, state: ScheduledState) => boolean | void;
```

Тип для функций, которые будут вызываться планировщиком.

**Параметры:**

*   `context` (`Stage | Sprite`) - сцена или спрайт, для которого запланировано выполнение.
*   `state` (`ScheduledState`) - объект состояния, содержащий информацию о планировании.

**Возвращаемое значение:**

*   (*boolean | void*) - если функция возвращает `false`, планировщик будет остановлен.

### Класс ScheduledState

```javascript
class ScheduledState {
    interval: number;
    maxIterations?: number;
    currentIteration?: number;
}
```

Класс, представляющий состояние запланированного выполнения.

**Свойства:**

*   `interval` (`number`) - интервал между вызовами функции (в миллисекундах).
*   `maxIterations` (`number`, необязательно) - максимальное количество итераций для повтора. Если не указано, повторение будет выполняться бесконечно.
*   `currentIteration` (`number`, необязательно) - текущая итерация.

---

### Метод timeout()

```javascript
timeout(callback: ScheduledCallbackFunction, timeout: number): void
```

Выполняет функцию один раз после указанной задержки.

**Параметры:**

*   `callback` (`ScheduledCallbackFunction`) - функция для выполнения.
*   `timeout` (`number`) - задержка перед выполнением (в миллисекундах).

**Описание:**

Планирует выполнение функции после указанной задержки. Это эквивалентно использованию `repeat` с `repeat: 1`.

**Пример использования:**

```javascript

const sprite = new Sprite(stage);
sprite.timeout(() => {
    console.log('Выполнилось после задержки!');
}, 2000); // Выполнится через 2 секунды

```

---

### Метод repeat()

```javascript
repeat(callback: ScheduledCallbackFunction, repeat: number, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState
```

Выполняет функцию указанное количество раз с заданным интервалом.

**Параметры:**

*   `callback` (`ScheduledCallbackFunction`) - функция для выполнения.
*   `repeat` (`number`) - количество повторений.
*   `interval` (`number`, необязательно) - интервал между выполнениями (в миллисекундах). Если не указано, функция будет выполняться максимально быстро.
*   `timeout` (`number`, необязательно) - максимальное время выполнения (в миллисекундах). Если указано, выполнение будет остановлено по истечении этого времени.
*   `finishCallback` (`ScheduledCallbackFunction`, необязательно) - функция, которая будет вызвана после завершения всех повторений.

**Возвращаемое значение:**

*   (`ScheduledState`) - объект состояния, содержащий информацию о планировании.

**Описание:**

Планирует выполнение функции `repeat` раз с интервалом `interval`. Можно указать `timeout` для ограничения времени выполнения и `finishCallback` для вызова по завершении.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.repeat((sprite, state) => {
    console.log('Выполнилось ' + state.currentIteration + ' раз');
}, 5, 1000); // Выполнится 5 раз с интервалом 1 секунда

```

---

### Метод forever()

```javascript
forever(callback: ScheduledCallbackFunction, interval?: number, timeout?: number, finishCallback?: ScheduledCallbackFunction): ScheduledState
```

Выполняет функцию бесконечно с заданным интервалом.

**Параметры:**

*   `callback` (`ScheduledCallbackFunction`) - функция для выполнения.
*   `interval` (`number`, необязательно) - интервал между выполнениями (в миллисекундах). Если не указано, функция будет выполняться максимально быстро.
*   `timeout` (`number`, необязательно) - максимальное время выполнения (в миллисекундах). Если указано, выполнение будет остановлено по истечении этого времени.
*   `finishCallback` (`ScheduledCallbackFunction`, необязательно) - функция, которая будет вызвана после остановки выполнения.

**Возвращаемое значение:**

*   (`ScheduledState`) - объект состояния, содержащий информацию о планировании.

**Описание:**

Планирует выполнение функции бесконечно с интервалом `interval`. Можно указать `timeout` для ограничения времени выполнения и `finishCallback` для вызова по остановке.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
    sprite.forever(() => {
    console.log('Выполняется постоянно!');
}, 500); // Выполняется каждые полсекунды
```

## Клонирование и управление жизненным циклом спрайта

Этот раздел описывает методы для управления жизненным циклом спрайта, включая запуск, остановку, клонирование и удаление.

### Метод run()

```javascript
run(): void
```

Запускает спрайт.

**Описание:**

Запускает спрайт после остановки, позволяя ему выполнять запланированные действия и реагировать на события.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.stop(); // Остановить спрайт
sprite.run(); // Запустить спрайт
```

---

### Метод stop()

```javascript
stop(): void
```

Останавливает спрайт.

**Описание:**

Останавливает выполнение запланированных действий и блокируя реакцию на события.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.stop(); // Остановить спрайт
```

---

### Метод createClone()

```javascript
createClone(stage?: Stage): Sprite
```

Создает копию спрайта.

**Параметры:**

*   `stage` (`Stage`, необязательно) - сцена, на которой будет создан клон. Если не указано, используется текущая сцена.

**Возвращаемое значение:**

*   (`Sprite`) - новый спрайт, являющийся копией исходного.

**Описание:**

Создает новый спрайт, копируя все свойства и данные исходного спрайта. Если спрайт не готов к клонированию, генерируется ошибка.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.addCostume('images/player.png');

sprite.onReady(() => {
    const clone = sprite.createClone(); // Создать копию спрайта
    clone.x = 100; // Изменить положение клона
});
```

---

### Метод delete()

```javascript
delete(): void
```

Удаляет спрайт.

**Описание:**

Удаляет спрайт со сцены, очищает все связанные ресурсы, удаляет коллайдер и дочерние элементы.

**Пример использования:**

```javascript
const sprite = new Sprite(stage);
sprite.delete(); // Удалить спрайт
```

## Примеры использования

```javascript
// Создание спрайта
const sprite = new Sprite(stage);
sprite.name = 'Игрок';

// Добавление костюма
sprite.addCostume('path/to/player.png');
sprite.addCostume('path/to/player2.png');

// Установка начальной позиции
sprite.x = 100;
sprite.y = 150;

// Установка размера
sprite.size = 50; // 50% от исходного размера

// Добавление тега
sprite.addTag('player');

// Создание прямоугольного коллайдера
sprite.setRectCollider('main', 32, 32);

// Обработка события onReady
sprite.onReady(() => {
    sprite.switchCostume(1);
    console.log('Спрайт готов к использованию!');
});

// Создание цикла для движения
sprite.forever(() => {
    sprite.move(2); // Двигаемся вперед на 2 шага
    sprite.nextCostume(); // Смена костюмов

    if (sprite.touchEdge()) {
        console.log('Косание края');
    }

    if (sprite.touchTag('emeny')) {
        console.log('Косание спрайта с тегом emeny');
    }
});

// Установка родительского спрайта
const childSprite = new Sprite(stage);
childSprite.setParent(sprite);
```

## Общие рекомендации

Когда нужно гарантировать, что все ресурсы и объекты будут загружены и инициализированы используйте метод `onReady`.
