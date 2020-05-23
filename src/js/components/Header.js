define([
    'js/components/Base/Component.js', 
    'js/components/TopProfile.js',
], function(Component, TopProfile) {
    'use strict';
    class Header extends Component{
        constructor(options) {
            super(options);
            this.setState({
                title: this.options.title,
                actionText: this.options.actionText,
                action: this.options.action,
                closeAction: this.options.closeAction,
                isMyPage: this.options.isMyPage,
                mode:  this.options.mode,
            });
        }
        
        render({idPerson, name, photo, closeAction}) {
            return `
            <header class="header">
                <div class="header__content">
                    <div class="header__title">${this.state.title}</div>
                    <div class="header__action">${this.state.actionText}</div>
                    ${this.childrens.create(TopProfile, {
                        idPerson : idPerson, 
                        name : name,  
                        photo : photo, 
                        closeAction : closeAction,
                    })}
                </div>
            </header>`;
        }

        afterMount() {
            this.subscribeTo(this.getContainer().querySelector('.header__action'), 'click', this.actionDispatcher.bind(this));
        }
        
        async actionDispatcher(event) {
            if(this.state.isMyPage && this.state.mode == 'profile') {
                const result = await this.state.action();
                switch (result) {
                    case 'view':
                        this.setState({
                            actionText: 'Редактировать',
                        });
                        this.update();
                        break;
                    case 'edit':
                        this.setState({
                            actionText: 'Сохранить',
                        });
                        this.update();
                        break;
                }
            }
        }

        getDefaultOptions() {
            return {
                title : '',
                actionText: '',
                isMyPage: false,
                action: () => { },
                mode: '',
            }
        }
    }
    return Header;
});