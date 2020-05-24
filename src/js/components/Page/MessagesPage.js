define([
    'js/components/Base/Component.js',
    'js/components/Header.js',  
    'js/components/Messages.js',
    'js/components/Models/PersonModel.js',
], function(Component, Header, Messages, PersonModel) {
    'use strict';
    class MessagesPage extends Component {
        constructor(options) {
            super(options);
            this.setState({
                selectedUserId : this.options.selectedUserId,
                person : this.options.person,
                backAddress : this.options.backAddress,
            });
            document.title = 'Сообщения';
        }

        getDefaultOptions() {
            return {
                selectedUserId : 0,
                backAddress : '/',
            };
        }

        render({person}) {
            return `
            <div class="wrapper">
                ${this.childrens.create(Header, {
                    person: person,
                    closeAction : person.logout.bind(person),
                })}
                <main class="content content_messages">
                    ${this.childrens.create(Messages, {
                        person : this.state.person,
                        selectedUserId : this.state.selectedUserId,
                        backAddress : this.state.backAddress,
                    })}
                </main>
            </div>`;
        }

    }
    return MessagesPage;
});