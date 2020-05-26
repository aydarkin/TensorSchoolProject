define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class ProfileGallery extends Component{
        constructor(options){
            super(options);
            this.setState({
                person: this.options.person,
                photos: this.options.photos,
                openPhoto: this.options.openPhoto,
                openGallery: this.options.openGallery,
                isMyPage: this.options.isMyPage,
            });
        }

        getDefaultOptions() {
            return {
                photos: [],
                openPhoto: () => { },
                openGallery: () => { },
            };
        }
        
        render({photos}) {
            return `
            <div class="content__block profile-photos">
                <div class="profile-photos__title">Фотографии</div>
                <div class="profile-photos__content"><p class="profile-photos__empty">Возможно скоро тут появятся фото 😉</p></div>
            </div>`;
        }

        renderGalleryItem({photo}) {
            return `
            <a href="${photo}" class="profile-photos__photo">
                <img src="${photo}" alt="Фотография" class="profile-photos__img"/>
            </a>`;
        }

        async afterMount() {
            await this.loadPhotos();
            
            this._thumbs = this.getContainer().querySelectorAll('.profile-photos__photo');
        
            for (let index = 0; index < this._thumbs.length; index++) {
                const thumb = this._thumbs[index];
                this.subscribeTo(thumb, 'click', this.onPhotoClick.bind(this, index));      
            }  
            
            this.title = this.getContainer().querySelector('.profile-photos__title');
            this.subscribeTo(this.title, 'click', this.onTitleClick.bind(this));
        }

        async loadPhotos() {
            this.state.photos = await this.state.person.getPhotosAsync(this.state.person.id);
            const container = this.getContainer().querySelector('.profile-photos__content');
            if(this.state.photos.length > 0) {
                container.innerHTML = this.state.photos.slice(0, 4).map(photo => this.renderGalleryItem({photo})).join('\n');
            } 
            return this.state.photos;
        }

        onPhotoClick(index, event) {
            event.preventDefault();
            this.state.openPhoto({
                numPhoto: index, 
                photos: this.state.photos
            });
        }

        onTitleClick(event) {
            event.stopPropagation();
            this.state.openGallery({
                person: this.state.person,
                openPhoto: this.state.openPhoto,
                photos: this.state.photos,
                isMyPage: this.state.isMyPage,
                updatePhotos: this.loadPhotos.bind(this),
            });
        }
    }
    return ProfileGallery;
});