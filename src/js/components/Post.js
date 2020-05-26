define(['js/components/Base/Component.js', 'js/components/Models/PersonModel.js'], function(Component, PersonModel) {
    'use strict';
    class Post extends Component {
        constructor(options) {
            super(options);
            this.setState({
                person: this.options.person,
                message: this.options.message,
                images: this.options.images,
                openPhoto: this.options.openPhoto,
            });
        }

        getDefaultOptions() {
            return {
                images: [],
                openPhoto: () => { },
            };
        }

        render() {
            return `<div class="content__block post">
                        <div class="post__header">
                            <a href="/user/${this.state.person.id}" class="post__image">
                                <img src="${this.state.person.avatar}" alt="" class="post__img">
                            </a>
                            <div class="post__header-info">
                                <a href="/user/${this.state.person.id}" class="post__author">${this.state.person.name || 'Неизвестный отправитель'}</a>
                                <p class="post__date"></p>
                            </div>
                            <img class="post__delete" src="/img/ui/garbage.png" alt="Удалить">
                        </div>
                        <div class="post__content">
                            <p class="post__text">${this.state.message || 'Пустое сообщение'}</p>
                            <div class="thumbnails">
                                ${this.state.images.length > 0 ? this.renderThumbs(this.state.images) : ''}
                            </div>
                        </div>
                        <div class="post__footer"></div>
                    </div>`;
        }

        renderThumbs(images) {
            return images.reduce((html, image) => {
                switch (image) {
                    case 'undefined':
                    case 'null':
                    case '':
                    case null:
                    case undefined:
                        return html;
                    default:
                        return html += `<a href="${image}" target="_blank" class="thumbnails__thumb">
                            <img src="${image}" alt="Картинка" class="thumbnails__thumb-img">
                        </a>`
                }   
            }, '');
        }

        afterMount() {
            this._thumbs = this.getContainer().querySelectorAll('.thumbnails__thumb');
        
            for (let index = 0; index < this._thumbs.length; index++) {
                const thumb = this._thumbs[index];
                this.subscribeTo(thumb, 'click', this.onPhotoClick.bind(this, index));      
            }
        }

        onPhotoClick(index, event) {
            event.preventDefault();
            this.state.openPhoto({
                numPhoto: index, 
                photos: this.state.images
            });
        }
    }

    return Post;
});