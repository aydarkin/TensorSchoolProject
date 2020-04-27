define([
    'js/components/Base/Component.js', 
], function(Component) {
    'use strict';
    class Message extends Component{
        constructor(options) {
            super(options);
            this.setState({
                idPerson : this.options.idPerson,
                photo : this.options.photo,
                name : this.options.name,
                action : this.options.action,
                date : this.options.date,
                messageText : this.options.messageText,
                domain : this.options.domain,
            });
        }
        
        render({messageText, idPerson, name, photo, date}) {
            return `
            <div class="message">
                <a href="/user/${idPerson}" class="message__photo message__photo_round">
                    <img src="${photo}" alt="Фото" class="message__img"/>
                </a>
                <p class="message__author" title="${name}">${name}</p>
                <p class="message__date">${date}</p>
                <div class="message__content">
                    <p class="message__text">${messageText}</p>
                    <div class="thumbnails"></div>
                </div>
            </div>`;
        }
        
        getDefaultOptions() {
            return {
                date : '',
                title : '',
                actionText : '',
                action: () => { },
            }
        }

    }
    return Message;
});