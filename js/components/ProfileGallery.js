define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class ProfileGallery extends Component{
        constructor(options){
            super(options);
            this.setState({
                idPerson : this.options.idPerson,
                photos: this.options.photos,
                openPhoto: this.options.openPhoto,
            });
        }

        getDefaultOptions() {
            return {
                photos: [],
                openPhoto: () => {},
            };
        }
        
        render({photos}) {
            return `
            <div class="content__block profile-photos">
                ${photos.slice(0, 5).map(photo => this.renderGalleryItem({photo})).join('\n')}
            </div>`;
        }

        renderGalleryItem({photo}) {
            return `
            <a href="${photo}" class="profile-photos__photo">
                <img src="${photo}" alt="Фотография" class="profile-photos__img"/>
            </a>`;
        }

        afterMount() {
            this._thumbs = this.getContainer().querySelectorAll('.profile-photos__photo');
            
            for (let index = 0; index < this._thumbs.length; index++) {
                const thumb = this._thumbs[index];
                this.subscribeTo(thumb, 'click', this.onClick.bind(this, index));      
            }            
        }

        onClick(index, event) {
            event.preventDefault();
            this.state.openPhoto({
                numPhoto : index, 
                photos : this.state.photos
            });
        }
    }
    return ProfileGallery;
});