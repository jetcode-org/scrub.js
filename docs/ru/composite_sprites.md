# Составные спрайты

ScrubJS позволяет создавать **иерархии спрайтов**, в которых один спрайт может быть "родителем", а другие — "дочерними". Это удобно при построении сложных объектов: персонажей с анимацией, техники с вращающимися деталями и любых структур, состоящих из нескольких визуальных элементов.

## 1. Создание иерархии объектов

Вы можете соединять спрайты в составные группы с помощью методов `setParent()` или `addChild()`. Дочерние спрайты автоматически следуют за родительским — как по позиции, так и по повороту и масштабу.

### Базовый пример: робот

```javascript
const robot = new Sprite(stage);

const body = new Sprite(stage);
body.setParent(robot);

const head = new Sprite(stage);
body.setParent(body);

const armLeft = new Sprite(stage);
body.setParent(body);

const armRight = new Sprite(stage);
body.setParent(body);

// Равносильный вариант с addChild():
// robot.addChild(body);
// body.addChild(head);
// body.addChild(armLeft);
// body.addChild(armRight);

// Задание позиций относительно родителя
body.y = 0;
head.y = -30;
armLeft.x = -40;
armRight.x = 40;
```

## 2. Синхронизация преобразований

Дочерние спрайты **наследуют все трансформации** родителя: движение, поворот, масштаб, прозрачность и т. д.

### Согласованное движение и анимация

```javascript
robot.forever(() => {
    robot.x += 2; // Двигается весь робот вперёд

    // Вращение головы и "махание" рукой
    head.rotation += 1;
    armLeft.rotation = Math.sin(Date.now() / 300) * 30;
});
```

### Локальные и глобальные координаты

Если дочерний спрайт должен взаимодействовать с миром, можно использовать глобальные координаты:

```javascript
const gun = new Sprite(stage);
gun.setParent(robot);
gun.x = 20;
gun.y = -10;

gun.onClick(() => {
    const bullet = new Sprite(stage);
    bullet.addCostume('bullet.png');
    
    bullet.setPosition(gun.globalX, gun.globalY); // Начальная позиция
    bullet.direction = gun.parent.direction; // Направление родителя
    
    bullet.forever(() => bullet.move(5));
});
```

### Обнаружение касания составного объекта

Даже если объект состоит из нескольких дочерних спрайтов, вы можете проверить, **касается ли он другого спрайта**, используя `touchSprite()`. Метод работает **на любом уровне иерархии** — если касается хотя бы один из дочерних элементов, касание будет засчитано.

### Пример: робот касается врага

```javascript
const robot = new Sprite(stage);
const body = new Sprite(stage);
const armLeft = new Sprite(stage);
const armRight = new Sprite(stage);

robot.addChild(body);
body.addChild(armLeft);
body.addChild(armRight);

const enemy = new Sprite(stage);
enemy.setPosition(400, 200);
enemy.addCostume('enemy.png');

// Простейшее обнаружение касания:
stage.forever(() => {
    if (robot.touchSprite(enemy)) {
        console.log("Робот касается врага!");
    }
});
```

`touchSprite()` автоматически учитывает **всех потомков** — проверка будет работать, даже если только один из "рукавов" робота соприкоснётся с врагом.

## 3. Советы по работе с иерархией

- Используйте составные спрайты для персонажей, интерфейсов и транспорта.
- Родитель может быть **невидимым**, выполняя лишь роль "контейнера".
- При уничтожении родителя все дочерние спрайты уничтожаются автоматически.
- Поддерживается **многоуровневая иерархия** (вложенные группы).
