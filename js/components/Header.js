define([
    'js/components/Base/Component.js', 
    'js/components/TopProfile.js',
], function(Component, TopProfile) {
    'use strict';
    class Header extends Component{
        render({title, actionText, idPerson, name, photo}) {
            return `
            <header class="header">
                <div class="header__content">
                    <div class="header__title">${title}</div>
                    <div class="header__action">${actionText}</div>
                    ${this.childrens.create(TopProfile, {
                        idPerson : idPerson, 
                        name : name,  
                        photo : photo, 
                    })}
                </div>
            </header>`;
        }

        afterMount() {
            this.subscribeTo(this.getContainer().querySelector('.header__action'), 'click', this.options.action.bind(this));
        }
        
        getDefaultOptions() {
            return {
                action: () => { },
            }
        }
    }
    return Header;
});