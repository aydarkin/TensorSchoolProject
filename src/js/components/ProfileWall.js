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
                person: this.options.person,
            })
        }

        render() {
            return `<div class="profile-wall"></div>`;
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
        }

        async loadPosts() {
            const messageData = await this.state.person.getMessagesAsync(this.state.person.id);

            const children = messageData.messages.map((message) => {
                const person = factory.create(PersonModel, message.author);
                return this.childrens.create(Post, {
                    person: person,
                    message : message.message,
                    //date : message.date
                });
            });

            children.forEach(child => {
                child.mount(this.getContainer());
            });
        }
    }
    return ProfileWall;
});