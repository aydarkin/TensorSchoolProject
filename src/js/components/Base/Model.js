define(function() {
    'use strict';
    /**
     * Базовая модель
     */
    class Model {
        constructor(data) {
            for (let key in data) {
                this[key] = data[key];
            }
        }
    }
    return Model;
});