define(function() {
    'use strict';
    /**
     * Объект действия
     */
    class Action {
        execute(meta) {
            throw new Error('Необходима реализация');
        }
    }
    return Action;
});