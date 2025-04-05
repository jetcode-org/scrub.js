class ErrorMessages {
    static readonly SCRIPT_ERROR = 'script_error';
    static readonly MISTAKE_METHOD = 'mistake_method';
    static readonly MISTAKE_METHOD_WITH_CLOSEST = 'mistake_method_with_closest';
    static readonly NEED_STAGE_BEFORE_RUN_GAME = 'need_stage_before_run_game';
    static readonly NEED_CREATE_STAGE_BEFORE_SPRITE = 'need_create_stage_before_sprite';
    static readonly COSTUME_NOT_LOADED = 'costume_not_loaded';
    static readonly BACKGROUND_NOT_LOADED = 'background_not_loaded';
    static readonly CLONED_NOT_READY = 'cloned_not_ready';
    static readonly SOUND_INDEX_NOT_FOUND = 'sound_index_not_found';
    static readonly SOUND_NAME_NOT_FOUND = 'sound_name_not_found';
    static readonly SOUND_USE_NOT_READY = 'sound_use_not_ready';
    static readonly COSTUME_INDEX_NOT_FOUND = 'costume_index_not_found';
    static readonly COSTUME_NAME_NOT_FOUND = 'costume_name_not_found';
    static readonly COSTUME_SWITCH_NOT_READY = 'costume_switch_not_ready';
    static readonly STAMP_NOT_READY = 'stamp_not_ready';
    static readonly STAMP_COSTUME_NOT_FOUND = 'stamp_costume_not_found';
    static readonly COLLIDER_NAME_NOT_FOUND = 'collider_name_not_found';

    static readonly messages = {
        script_error: {
            'ru': 'Произошла ошибка, ознакомьтесь с подробной информацией в консоли.',
            'en': 'An error has occurred, take a look at the details in the console.'
        },
        mistake_method: {
            'ru': '${className}: Метод или свойство "${prop}" не найдено',
            'en': '${className}: Method "${prop}" not found'
        },
        mistake_method_with_closest: {
            'ru': '${className}: Метод или свойство "${prop}" не найдено. Возможно вы имели ввиду: ${closestString}?',
            'en': '${className}: Method "${prop}" not found. Did you mean: ${closestString}?'
        },
        need_stage_before_run_game: {
            'ru': 'Вам нужно создать экземпляр Stage перед запуском игры.',
            'en': 'You need create Stage instance before run game.'
        },
        need_create_stage_before_sprite: {
            'ru': 'Вам нужно создать экземпляр класса Stage перед экземпляром класса Sprite.',
            'en': 'You need create Stage instance before Sprite instance.'
        },
        costume_not_loaded: {
            'ru': 'Изображение для костюма "${costumePath}" не было загружено. Проверьте правильность пути.',
            'en': 'Costume image "${costumePath}" was not loaded. Check that the path is correct.'
        },
        background_not_loaded: {
            'ru': 'Изображение для фона "${backgroundPath}" не было загружено. Проверьте правильность пути.',
            'en': 'Background image "${backgroundPath}" was not loaded. Check that the path is correct.'
        },
        cloned_not_ready: {
            'ru': 'Спрайт не может быть клонирован, потому что он еще не готов. Попробуйте использовать метод sprite.onReady()',
            'en': 'Sprite cannot be cloned because one is not ready. Try using the sprite.onReady() method.'
        },
        sound_index_not_found: {
            'ru': 'Звук с индексом "${soundIndex}" не найден.',
            'en': 'Sound with index "${soundIndex}" not found.'
        },
        sound_name_not_found: {
            'ru': 'Звук с именем "${soundName}" не найден.',
            'en': 'Sound with name "${soundName}" not found.'
        },
        sound_use_not_ready: {
            'ru': 'Спрайт не может использовать звуки, потому что спрайт еще не готов. Попробуйте использовать метод sprite.onReady().',
            'en': 'Sprite cannot use sounds because sprite is not ready. Try using the sprite.onReady() method.'
        },
        costume_index_not_found: {
            'ru': 'Костюм с индексом "${costumeIndex}" не найден.',
            'en': 'Costume with index "${costumeIndex}" not found.'
        },
        costume_name_not_found: {
            'ru': 'Костюм с именем "${costumeName}" не найден.',
            'en': 'Costume with name "${costumeName}" not found.'
        },
        costume_switch_not_ready: {
            'ru': 'Спрайт не может изменить костюм, потому что спрайт еще не готов. Попробуйте использовать метод sprite.onReady().',
            'en': 'Sprite cannot change a costume because sprite is not ready. Try using the sprite.onReady() method.'
        },
        stamp_not_ready: {
            'ru': 'Спрайт не может создать штамп, потому что он еще не готов. Попробуйте использовать метод sprite.onReady()',
            'en': 'Sprite cannot create a stamp because sprite is not ready. Try using the sprite.onReady() method.'
        },
        stamp_costume_not_found: {
            'ru': 'Штам не может быть создан, так как костюм с индексом "${costumeIndex}" не найден.',
            'en': 'The stamp cannot be created because the costume with the index "${costumeIndex}" has not been found.'
        },
        collider_name_not_found: {
            'ru': 'Коллайдер с именем "${colliderName}" не найден.',
            'en': 'Collider with name "${colliderName}" not found.'
        },
    }

    static getMessage(messageId: string, locale: string, variables: {} | null = null): string {
        if (!ErrorMessages.messages[messageId]) {
            throw new Error('Message is not defined.');
        }

        if (!ErrorMessages.messages[messageId][locale]) {
            throw new Error('Message for this locale is not defined.');
        }

        let message = ErrorMessages.messages[messageId][locale];

        if (variables) {
            message = ErrorMessages.replaceVariables(message, variables);
        }

        return message;
    }

    private static replaceVariables(message: string, variables: {}): string {
        return message.replace(/\${([^}]+)}/g, (match, key) => {
            return variables[key] !== undefined ? variables[key] : '';
        });
    }
}
