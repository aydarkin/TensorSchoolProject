define([
    'js/components/Base/Component.js',
    'js/components/Message.js',
    'js/components/User.js',
    'js/components/Models/PersonModel.js',
], function(Component, Message, User, PersonModel) {
    'use strict';
    class Messages extends Component {
        constructor(options) {
            super(options);
            this.setState({
                person : this.options.person,
                selectedUserId : this.options.selectedUserId,
                hasMoreMessages : false,
                backAddress : this.options.backAddress,
                mode: this.options.mode,
            });
        }

        getDefaultOptions() {
            return {
                selectedUserId : -1,
                hasMoreMessages : false,
                backAddress : '/',
                mode: 'friends',
            }
        }

        render() {
            return `
            <div class="content__block messages">
                    <a href="/" class="messages__back">< Назад</a>
                    <div class="messages__title">Сообщения</div>
                    <div class="messages__types">
                        <div class="messages__type messages__type_friends ${this.state.mode == 'friends' ? 'messages__type_selected' : ''}">Друзья</div>
                        <div class="messages__type messages__type_all ${this.state.mode == 'all' ? 'messages__type_selected' : ''}">Все пользователи</div>
                    </div>
                    <div class="messages__content">
                        <div class="messages__user-list"></div>
                        <div class="messages__chat">
                            <div class="messages__message-list">
                                <div class="messages__empty">Выберите собеседника</div>
                            </div>
                            <form class="messages__form">
                                <textarea name="" id="" rows="1" class="messages__textarea"></textarea>
                                <button class="messages__send messages__send" disabled>Отпр.</button>
                            </form>
                        </div>
                    </div>
                    
                </div>`;
        }

        afterMount() {
            this.friendBtn = this.getContainer().querySelector('.messages__type_friends');
            this.subscribeTo(this.friendBtn, 'click', () => this.setMode('friends'));

            this.allBtn = this.getContainer().querySelector('.messages__type_all');
            this.subscribeTo(this.allBtn, 'click', () => this.setMode('all'));

            this.sendBtn = this.getContainer().querySelector('.messages__send');
            this.mountUsers();
            this.subscribeTo(this.sendBtn, 'click', this.clickSend.bind(this));

            this.input = this.getContainer().querySelector('.messages__textarea');
            this.subscribeTo(this.input, 'keydown', this.keyDown.bind(this));

            this.btnBack = this.getContainer().querySelector('.messages__back');
            this.subscribeTo(this.btnBack, 'click', this.clickBack.bind(this));
        }

        setMode(mode) {
            this.setState({
                mode: mode,
                selectedUserId: -1,
            });
            this.update();
        }

        createUserComponent(person) {
            return this.childrens.create(User, {
                person: person,
                action : this.mountMessages.bind(this),
            })
        }

        async mountUsers(page = 0, pageSize = 100) {
            const children = [];

            if(this.state.mode == 'friends') {
                //получаем список связей
                const links = await this.state.person.getLinksAsync(page, pageSize);
                links.forEach((link) => {
                    children.push(this.createUserComponent(link.person));
                });
            }
            if(this.state.mode == 'all') {
                const all = await this.state.person.getAllUsers();
                all.forEach((person) => {
                    children.push(this.createUserComponent(person));
                })
            }
            
            const userList = this.getContainer().querySelector('.messages__user-list');
            children.forEach(child => {
                child.mount(userList);
            });

            if(this.state.selectedUserId && this.state.selectedUserId >= 0){
                this.sendBtn.disabled = false;
                this.mountMessages(this.state.selectedUserId);
            }
        }

        clearMessages() {
            for(const id in this.childrens.getAll()) {
                const child = this.childrens.get(id);
                if(child instanceof Message){
                    child.unmount();
                }
            }
        }

        async mountMessages(id) {
            this.sendBtn.disabled = false;
            this.setState({
                selectedUserId : id,
            });
            
            this.clearMessages();

            const messageData = await this.state.person.getMessagesAsync(id);
            const children = messageData.messages.map((message) => {
                const person = factory.create(PersonModel, message.author);
                return this.childrens.create(Message, {
                    idPerson : person.id,
                    photo :  person.avatar,
                    name :  person.name,
                    messageText : message.message,
                    //date : message.date
                });
            });

            const messageList = this.getContainer().querySelector('.messages__message-list');
            if(children.length > 0) {
                messageList.innerHTML = '';
            } else {
                messageList.innerHTML = '<div class="messages__empty">😉Это начало истории вашего общения...</div>';
            }
            children.forEach(child => {
                child.mount(messageList);
            });

            if(messageData.outcome.hasMore){
                const moreBtn = document.createElement('div');
                moreBtn.classList.add('messages__more');
                moreBtn.innerHTML = '↑ Загрузить еще ↑';
                messageList.insertAdjacentElement('beforeend', moreBtn);
            }
        }

        async sendMessage() {
            await this.state.person.sendMessage(this.state.selectedUserId, this.input.value);
        }

        async clickSend(event) {
            event.preventDefault();
            if(this.input.value.length > 0){
                this.sendBtn.disabled = true;
                await this.sendMessage();
                this.input.value = '';
                this.mountMessages(this.state.selectedUserId)
            }  
        }

        clickBack(event) {
            event.preventDefault();
            window.location.href = this.state.backAddress;
        }

        keyDown(event) {
            if(event.ctrlKey && event.key == 'Enter'){
                this.clickSend(event);
            }
        }

    }
    return Messages;
});