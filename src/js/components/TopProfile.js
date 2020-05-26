define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class TopProfile extends Component{
        constructor(options) {
            super(options);
            this.setState({
                person: this.options.person,
                closeAction : this.options.closeAction,
                openMyPage: this.options.openMyPage,
                isMenuOpened : false,
            });
        }

        render() {
            return `
                <div class="top-profile">
                    <div class="top-profile__header">
                        <div class="top-profile__name">${this.state.person.name}</div>
                        <img src="${this.state.person.avatar}" alt="" class="top-profile__img top-profile__img_round"/>
                        <div class="top-profile__menu">⋮</div>
                    </div>
                    <nav class="top-profile__menu-list ${this.state.isMenuOpened ? '' : 'top-profile__menu-list_hide'}"> 
                        ${this.renderItem('Моя страница')}
                        ${this.renderItem('Выход')}
                    </nav>                        
                </div>`;
        }

        renderItem(text) {
            return `<a href="#" class="top-profile__item">${text}</a>`
        }

        afterMount() {
            const header = this.getContainer().querySelector('.top-profile__header');
            this.subscribeTo(header, 'click', this.expand.bind(this));

            this.subscribeTo(document, 'click', this.closeMenu.bind(this));

            //временный костыль, надо делать отдельным компонентом
            //первая кнопка выпадающего меню - кнопка перехода на свою страницу
            this.myPageBtn = this.getContainer().querySelector('.top-profile__menu-list').firstElementChild;
            this.subscribeTo(this.myPageBtn, 'click', this.state.openMyPage);
            //последняя кнопка выпадающего меню - кнопка выход
            this.logoutBtn = this.getContainer().querySelector('.top-profile__menu-list').lastElementChild;
            this.subscribeTo(this.logoutBtn, 'click', this.state.closeAction);
        }

        expand(event) {
            if(this.state.isMenuOpened) {
                this.closeMenu(event);
            } else {
                this.openMenu(event);
            }
        }

        openMenu(event) {
            event.stopPropagation();
            this.setState({
                isMenuOpened : true,
            });
            this.update();
        }

        closeMenu(event) {
            event.stopPropagation();
            this.setState({
                isMenuOpened : false,
            });
            this.update();
        }

        getDefaultOptions() {
            return {
                closeAction: () => {
                    event.preventDefault(); 
                    event.stopPropagation();
                    console.warn('Действие выхода не назначено')
                },
                openMyPage: () => {
                    event.preventDefault(); 
                    event.stopPropagation();
                    document.location = '/';
                }
            }
        }
    }
    return TopProfile;
});