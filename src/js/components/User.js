define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class User extends Component{
        constructor(options) {
            super(options);
            this.setState({
                person: this.options.person,
                action : this.options.action,
            });
        }
        
        render() {
            return `
            <div class="user">
                <a href="/user/${this.state.person.id}" class="user__photo">
                    <img src="${this.state.person.avatar}" alt="Фото" class="user__img">
                </a>
                <div class="user__name" title="${this.state.person.name}">${this.state.person.name}</div>
            </div>`;
        }

        afterMount() {
            this.subscribeTo(this.getContainer(), 'click', this.state.action.bind(null, this.state.person.id));
        }
        
        getDefaultOptions() {
            return {
                action: () => { },
            }
        }
    }
    return User;
});