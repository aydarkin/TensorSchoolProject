define([
    'js/components/Base/Component.js', 
], function(Component) {
    'use strict';
    class User extends Component{
        constructor(options) {
            super(options);
            this.setState({
                domain : this.options.domain,
                idPerson : this.options.idPerson,
                photo : this.options.photo,
                name : this.options.name,
                action : this.options.action,
            });
        }
        
        render({idPerson, name, photo}) {
            return `
            <div class="user">
                <a href="/user/${idPerson}" class="user__photo">
                    <img src="${photo}" alt="Фото" class="user__img">
                </a>
                <div class="user__name" title="${name}">${name}</div>
            </div>`;
        }

        afterMount() {
            this.subscribeTo(this.getContainer(), 'click', this.state.action.bind(null, this.state.idPerson));
        }
        
        getDefaultOptions() {
            return {
                domain : '',
                name : '',
                photo : '/img/ui/empty_photo.png',
                action: () => { },
            }
        }
    }
    return User;
});