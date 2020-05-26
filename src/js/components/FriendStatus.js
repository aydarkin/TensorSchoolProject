define(['js/components/Base/Component.js', 'js/components/Models/PersonModel.js'], function(Component, PersonModel) {
    'use strict';
    class FriendStatus extends Component{
        constructor(options) {
            super(options);
            this.setState({
                currentPerson: this.options.currentPerson,
                person: this.options.person,
            });
        }
        
        render({person}) {
            return `
            <div class="content__block friend-status">
                <div class="friend-status__info"></div>
                <div class="friend-status__action">Добавить в друзья</div>
            </div>`;
        }

        async afterMount() {
            let info = '';
            let actionText = 'Добавить в друзья';
            let action = this.createLink;

            const links = await this.state.currentPerson.getLinksAsync();
            for (let i = 0; i < links.length; i++) {
                if(links[i].person.id == this.state.person.id) {
                    switch (links[i].type) {
                        case 'friend':
                            info = 'Это ваш друг 😊';
                            actionText = 'Удалить из друзей';
                            action = this.deleteLink;
                            break;
                        case 'incoming':
                            info = 'Добавил вас в друзья ✌';
                            actionText = 'Принять запрос';
                            break;
                        case 'outgoing':
                            info = 'Вы предложили дружбу ✔';
                            actionText = 'Отменить запрос';
                            action = this.deleteLink;
                            break;
                    
                    }
                }
            }
            this.infoContainer = this.getContainer().querySelector('.friend-status__info');
            this.infoContainer.innerHTML = info;

            this.actionBtn = this.getContainer().querySelector('.friend-status__action');
            this.actionBtn.innerHTML = actionText;
            this.subscribeTo(this.actionBtn, 'click', action.bind(this));
        }
        
        async createLink(event) {
            await this.state.currentPerson.createLink(this.state.person.id);
            this.update();
        }

        async deleteLink(event) {
            await this.state.currentPerson.deleteLink(this.state.person.id);
            this.update();
        }


    }
    return FriendStatus;
});