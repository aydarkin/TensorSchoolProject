define([
    'js/components/Base/Component.js', 
    'js/components/Models/PersonModel.js',
    'js/components/Post.js'
], function(Component, PersonModel, Post) {
    'use strict';
    class ProfileWall extends Component{
        constructor(options) {
            super(options);
            this.setState({
                currentPerson: this.options.currentPerson,
                person: this.options.person,
                isSending: false,
                isMyPage: this.options.isMyPage,
            })
        }

        render() {
            return `<div class="profile-wall">
                        ${this.renderCreaterPost()}
                        <div class="profile-wall__posts"></div>
                    </div>`;
        }

        renderCreaterPost() {
            return `<div class="content__block post-create">
                        <form class="post-create__form">
                            <textarea class="post-create__text" name="text" id="" rows="2" placeholder="${this.state.isMyPage ? 'Что у вас нового?' : 'Напишите что-нибудь...'}"></textarea>
                            <button class="post-create__send">Опубликовать</button>
                        </form>
                    </div>`;
        }

        clearPosts() {
            for(const id in this.childrens.getAll()) {
                const child = this.childrens.get(id);
                if(child instanceof Post){
                    child.unmount();
                }
            }
        }

        afterMount() {
            this.clearPosts();
            this.loadPosts();

            this.sendBtn = this.getContainer().querySelector('.post-create__send');
            this.subscribeTo(this.sendBtn, 'click', this.clickSend.bind(this));

            this.input = this.getContainer().querySelector('.post-create__text');
            this.subscribeTo(this.input, 'keydown', this.keyDown.bind(this)); 
        }

        async createPost() {
            this.setState({ isSending: true });
            const message = await this.state.currentPerson.sendMessage(this.state.person.id, this.input.value);
            const post = this.childrens.create(Post, {
                isMyPost: true,
                idPost: message.id,
                person: this.state.currentPerson,
                message: message.message,
                images: [message.image],
                openPhoto: this.options.openPhoto,
            });
            this.input.value = '';
            const posts = this.getContainer().querySelector('.profile-wall__posts');
            post.mount(posts, 'afterbegin');
            this.setState({ isSending: false });
        }

        async clickSend(event) {
            event.preventDefault();
            if(!this.state.isSending && this.input.value.length > 0){
                await this.createPost();
            }  
        }

        async keyDown(event) {
            if(!this.state.isSending && event.ctrlKey && event.key == 'Enter'){
                await this.createPost();
            }
        }

        async loadPosts() {
            const messageData = await this.state.person.getMessagesAsync(this.state.person.id);

            const children = messageData.messages.map((message) => {
                const person = factory.create(PersonModel, message.author);
                return this.childrens.create(Post, {
                    isMyPost: person.id == this.state.currentPerson.id,
                    idPost: message.id,
                    person: person,
                    message: message.message,
                    images: [message.image],
                    openPhoto: this.options.openPhoto,
                });
            });

            const posts = this.getContainer().querySelector('.profile-wall__posts');
            children.forEach(child => {
                child.mount(posts);
            });


        }
    }
    return ProfileWall;
});