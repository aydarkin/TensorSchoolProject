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
                domain : this.options.domain,
                person : this.options.person,
                selectedUserId : this.options.selectedUserId,
                hasMoreMessages : false,
                backAddress : this.options.backAddress,
            });
        }

        getDefaultOptions() {
            return {
                selectedUserId : -1,
                hasMoreMessages : false,
                backAddress : '/',
            }
        }

        render() {
            return `
            <div class="content__block messages">
                    <a href="/" class="messages__back">< Назад</a>
                    <div class="messages__title">Сообщения</div>
                    <div class="messages__content">
                        <div class="messages__user-list"></div>
                        <div class="messages__chat">
                            <div class="messages__message-list"></div>
                            <form class="messages__form">
                                <textarea name="" id="" rows="1" class="messages__textarea"></textarea>
                                <button class="messages__send messages__send" disabled>Отпр.</button>
                            </form>
                        </div>
                    </div>
                    
                </div>`;
        }

        afterMount() {
            this.sendBtn = this.getContainer().querySelector('.messages__send');
            this.mountUsers();
            this.subscribeTo(this.sendBtn, 'click', this.clickSend.bind(this));

            this.input = this.getContainer().querySelector('.messages__textarea');
            this.subscribeTo(this.input, 'keydown', this.keyDown.bind(this));

            this.btnBack = this.getContainer().querySelector('.messages__back');
            this.subscribeTo(this.btnBack, 'click', this.clickBack.bind(this));
        }

        async mountUsers(page = 0, pageSize = 100) {
            const friends = await this.state.person.getFriendsAsync(page, pageSize);
            const children = friends.map((friend) => {
                const person = factory.create(PersonModel, { 
                    ...friend,
                    domain : this.state.domain,
                });
                return this.childrens.create(User, {
                    idPerson : person.id,
                    photo : person.avatar,
                    name : person.name,
                    domain : person.domain,
                    action : this.mountMessages.bind(this),
                });
            });

            const userList = this.getContainer().querySelector('.messages__user-list');
            children.forEach(child => {
                child.mount(userList);
            });
            if(this.state.selectedUserId && selectedUserId >= 0){
                this.sendBtn.disabled = false;
                mountMessages(this.state.selectedUserId);
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
                const person = factory.create(PersonModel, { 
                    ...message.author,
                    domain : this.state.domain,
                });
                return this.childrens.create(Message, {
                    idPerson : person.id,
                    photo :  person.avatar,
                    name :  person.name,
                    messageText : message.message,
                    //date : message.date
                });
            });

            const messageList = this.getContainer().querySelector('.messages__message-list');
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