# Определение расстояния между спрайтом и другим объектом

## Метод getDistanceTo()

Возвращает расстояние в пикселях между текущим спрайтом и указанным объектом, используя их глобальные координаты. Полезен для определения дистанции между объектами, управления ИИ врагов, активации событий на расстоянии.

```javascript
getDistanceTo(object: TransformableObject): number
```

### Параметры:
*  `object` (`TransformableObject`) -  Объект, до которого измеряется расстояние. Может быть: <br> • Спрайтом (`Sprite`) <br> • Объектом с координатами `{ x: number, y: number }` |

### Возвращаемое значение:
- `number` — расстояние в пикселях по прямой между центрами объектов.

### Как работает?
**Вычисляет глобальные координаты** текущего спрайта и целевого объекта, учитывая вложенность в родительские элементы.

### Примеры использования

#### Базовый пример:
```javascript
const player = new Sprite(stage);
const enemy = new Sprite(stage);
enemy.x = 100;
enemy.y = 100;

// Получить расстояние между игроком и врагом
const distance = player.getDistanceTo(enemy);
console.log(`Дистанция: ${distance}px`);
```

#### Использование для ИИ врага:
```javascript
enemy.forever(() => {
    const dist = enemy.getDistanceTo(player);
    
    if (dist < 200) {
        // Начать преследование
        enemy.pointForward(player);
        enemy.move(2);
    }
});
```

#### Пример: Радар для игрока
```javascript
const radar = new Sprite(stage);
radar.forever(() => {
    const allEnemies = stage.getSprites().filter(s => s.hasTag('enemy'));
    
    allEnemies.forEach(enemy => {
        const dist = radar.getDistanceTo(enemy);
        if (dist < 300) {
            enemy.filter = 'brightness(1.5)'; // Подсветить ближайших врагов
        }
    });
});
```

### Особенности

#### Глобальные координаты:  

Если объекты вложены в родительские спрайты, метод автоматически учитывает их трансформации:

```javascript
const parent = new Sprite(stage);
parent.x = 50;

const child = new Sprite(stage);
child.setParent(parent);
child.x = 30; // Глобальная X-координата = 50 + 30 = 80

console.log(child.getDistanceTo({x: 0, y: 0})); // Выведет 80
```

#### Не учитывает форму и коллайдеры:  

Расстояние измеряется между **геометрическими центрами** объектов, даже если они имеют сложную форму:

```javascript
// Для точных столкновений используйте touchSprite()
if (sprite.touchSprite(other)) {
    // Обработка касания
}
```
