define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class TopProfile extends Component{
        constructor(options) {
            super(options);
            this.setState({
                photo : this.options.photo,
                closeAction : this.options.closeAction,
                isMenuOpened : false,
            });
        }

        render({idPerson, name, photo}) {
            return `
                <div class="top-profile">
                    <div class="top-profile__header">
                        <div class="top-profile__name">${name}</div>
                        <img src="${photo}" alt="" class="top-profile__img top-profile__img_round"/>
                        <div class="top-profile__menu">⋮</div>
                    </div>
                    <nav class="top-profile__menu-list ${this.state.isMenuOpened ? '' : 'top-profile__menu-list_hide'}"> 
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
                photo: '/img/ui/empty_photo.png',
                closeAction : () => {
                    event.preventDefault(); 
                    event.stopPropagation();
                    console.warn('Действие выхода не назначено')
                }
            }
        }
    }
    return TopProfile;
});