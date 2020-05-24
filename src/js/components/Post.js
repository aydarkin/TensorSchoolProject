define(['js/components/Base/Component.js', 'js/components/Models/PersonModel.js'], function(Component, PersonModel) {
    'use strict';
    class Post extends Component {
        constructor(options) {
            super(options);
            this.setState({
                person: this.options.person,
                message: this.options.message,
                image: this.options.image,
            });
        }

        render() {
            return `<div class="content__block post">
                        <div class="post__header">
                            <a href="/user/${this.state.person.id}" class="post__image">
                                <img src="${this.state.person.avatar}" alt="" class="post__img">
                            </a>
                            <div class="post__header-info">
                                <a class="post__author">${this.state.person.name || 'Неизвестный отправитель'}</a>
                                <p class="post__date"></p>
                            </div>
                            <img class="post__delete" src="/img/ui/garbage.png" alt="Удалить">
                        </div>
                        <div class="post__content">
                            <p class="post__text">${this.state.message || 'Пустое сообщение'}</p>
                            <div class="thumbnails">
                                ${this.state.image ? this.renderThumb(image) : ''}
                            </div>
                        </div>
                        <div class="post__footer"></div>
                    </div>`;
        }

        renderThumb(image) {
            return `<a href="${image}" target="_blank" class="thumbnails__thumb">
                        <img src="${image}" alt="Картинка" class="thumbnails__thumb-img">
                    </a>`;
        }
    }

    return Post;
});