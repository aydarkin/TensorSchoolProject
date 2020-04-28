define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class PopupStack extends Component {
        render() {
            return `<div class="stack-popup"></div>`;
        }
        
        /**
         * Очистка всех модальных окон
         */
        clear() {
            this.unmountChildren();
        }
        
        /**
         * 
         * @param {Component} component - модальное окно (popup)
         * @param {Object} options 
         */
        appendPopup(component, options) {
            this.appendChildren(component, options);
        }
    }
    return PopupStack;
});