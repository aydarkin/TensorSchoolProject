define([
    'js/components/Base/Component.js', 
    'js/components/User.js',
], function(Component, User) {
    'use strict';
    class PopupFriends extends Component{
        constructor(options) {
            super(options);
            this.setState({
                person: this.options.person,
                isMyPage: this.options.isMyPage,
            });
        }
        
        getDefaultOptions() {
            return {
                isMyPage: false,
            }
        }

        render() {
            return `
            <div class="popup popup_friends">
                <div class="popup__background"></div>
                <div class="popup__header">
                    <div class="popup__close"></div>
                </div>
                <div class="popup__content">
                    <div class="popup__title">Мои друзья</div>
                    <div class="friends">
                        <p class="popup__empty">Друзей пока нет, но не стоит отчаиваться 😉</p>
                    </div>
                </div>
            </div>`;
        }

        renderAction(person, type) {
            let actionText;
            if(type === 'incoming') {
                actionText = 'Принять запрос'
            }
            if(type === 'outgoing') {
                actionText = 'Отменить запрос'
            }
            return actionText ? `<div class="friends__action" data-type="${type}" data-id="${person.id}">${actionText}</div>` : '';
        }

        async mountFriends(page = 0, pageSize = 100) {
            const friends = this.getContainer().querySelector('.friends');
            const links = await this.state.person.getLinksAsync(page, pageSize);
            
            let elem, user;
            if(links.length > 0) {
                friends.innerHTML = '';
            }
            links.forEach((link) => {
                elem = document.createElement('div');
                elem.className = 'friends__elem';
                friends.insertAdjacentElement('beforeend', elem);
                
                user = this.childrens.create(User, {
                    person: link.person,
                    action: (id) => { document.location = `/user/${id}` },
                })
                user.mount(elem);
                elem.insertAdjacentHTML('beforeend', this.renderAction(link.person, link.type));
            });

            const actions = this.getContainer().querySelectorAll('.friends__action');
            actions.forEach((action) => {
                this.subscribeTo(action, 'click', this.actionClick.bind(this, action));
            })
        }

        async rejectFriend(id) {
            await this.state.person.deleteLink(id);
            this.update();
        }

        async acceptFriend(id) {
            await this.state.person.createLink(id);
            this.update();
        }

        actionClick(button, event) {
            
            switch (button.dataset.type) {
                case 'incoming':
                    this.acceptFriend(button.dataset.id);
                    break;
                case 'outgoing':
                    this.rejectFriend(button.dataset.id);
                    break;
            }
        }

        afterMount() {
            this._closeBtn = this.getContainer().querySelector('.popup__close');
            this.subscribeTo(this._closeBtn, 'click', this.close.bind(this));

            this.mountFriends();
        }

        close() {
            this.unmount();
        } 
    }
    return PopupFriends;
});