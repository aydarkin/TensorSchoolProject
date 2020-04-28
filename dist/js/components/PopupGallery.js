define([
    'js/components/Base/Component.js', 
], function(Component) {
    'use strict';
    class PopupGallery extends Component{
        constructor(options) {
            super(options);
            this.setState({
                person: this.options.person,
                photos: this.options.photos,
                openPhoto: this.options.openPhoto,
                isMyPage: this.options.isMyPage,
                updatePhotos: this.options.updatePhotos,
            });
        }
        
        getDefaultOptions() {
            return {
                isMyPage: false,
            }
        }

        render() {
            return `
            <div class="popup popup_gallery">
                <div class="popup__background "></div>
                <div class="popup__header">
                    <div class="popup__close"></div>
                </div>
                <div class="popup__content">
                    <div class="popup__title">Фотографии</div>
                    ${this.state.isMyPage ? this.renderPhotoLoader() : ''}
                    <div class="popup__photos">
                        ${this.state.photos.map(photo => this.renderPhoto(photo)).join('\n')}
                    </div>
                </div>
            </div>`;
        }

        renderPhotoLoader() {
            return `
            <form class="popup__photo-loader">
                <label class="popup__label-file">Загрузить фото
                    <input type="file" name="photo-file" class="popup__photo-file" accept="image/png">
                </label>
            </form>`;
        }

        //по хорошему вынести в отдельный компонент бы
        renderPhoto(photo) {
            return `
            <a href="${photo}" target="_blank" class="popup__image">
                <div class="popup__delete-photo">x</div>
                <img src="${photo}" alt="Фото" class="popup__img" />
            </a>`;
        }

        afterMount() {
            this._closeBtn = this.getContainer().querySelector('.popup__close');
            this.subscribeTo(this._closeBtn, 'click', this.close.bind(this));

            this._thumbs = this.getContainer().querySelectorAll('.popup__image');
        
            for (let index = 0; index < this._thumbs.length; index++) {
                const thumb = this._thumbs[index];
                this.subscribeTo(thumb, 'click', this.onPhotoClick.bind(this, index)); 
                
                const deleteBtn = thumb.querySelector('.popup__delete-photo');
                const id = thumb.querySelector('.popup__img').src.split('/').pop();
                this.subscribeTo(deleteBtn, 'click', this.deletePhoto.bind(this, id)); 
            }

            this._uploadBtn = this.getContainer().querySelector('.popup__photo-file');
            if(this._uploadBtn) {
                this.subscribeTo(this._uploadBtn, 'change', this.uploadPhoto.bind(this));
            } 
        }
        
        onPhotoClick(index, event) {
            event.preventDefault();
            this.state.openPhoto({
                numPhoto: index, 
                photos: this.state.photos,
            });
        }

        async deletePhoto(id, event) {
            event.preventDefault();
            event.stopPropagation();
            await this.state.person.deletePhoto(id);;
            this.update();
        }


        close() {
            this.unmount();
        }

        async uploadPhoto(event) {
            event.stopPropagation();
            const form = new FormData(this.getContainer().querySelector('.popup__photo-loader'));
            const file = form.get('photo-file');
            await this.state.person.addPhoto(file);
            this.update();
        }

        async update() {
            this.setState({
                photos: await this.state.updatePhotos(),
            });
            super.update();
        }   

        getDefaultOptions() {
            return {
                photos: [],
                openPhoto: () => {},
                updatePhotos: () => {},
            };
        }
    }
    return PopupGallery;
});