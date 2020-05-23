define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class ProfilePhoto extends Component{
        constructor(options){
            super(options);
            this.setState({
                person: this.options.person,
                isMyPage: this.options.isMyPage,
                openPhoto: this.options.openPhoto,
            });
        }

        render(){
            return `
            <div class="content__block profile-photo">
                <a a href="${this.state.person.avatar}" target="_blank" class="profile-photo__photo">
                    <img src="${this.state.person.avatar}" alt="Фото пользователя" class="profile-photo__img">
                </a>
                ${this.state.isMyPage ? this.renderAvatarLoader() : ''}
            </div>`
        }

        renderAvatarLoader() {
            return `
            <form class="profile-photo__loader">
                <label class="profile-photo__label-file">Сменить аватар
                    <input type="file" name="photo-file" class="profile-photo__photo-file" accept="image/png">
                </label>
            </form>`;
        }

        afterMount() {
            this._avatar = this.getContainer().querySelector('.profile-photo__photo');
            this.subscribeTo(this._avatar, 'click', this.onPhotoClick.bind(this)); 
            
            this._uploadBtn = this.getContainer().querySelector('.profile-photo__photo-file');
            if(this._uploadBtn) {
                this.subscribeTo(this._uploadBtn, 'change', this.uploadPhoto.bind(this));
            }           
        }

        async uploadPhoto(event) {
            event.stopPropagation();
            const form = new FormData(this.getContainer().querySelector('.profile-photo__loader'));
            const file = form.get('photo-file');
            await this.state.person.uploadPhoto(file);
            this.update();
        }

        onPhotoClick(event) {
            event.preventDefault();
            this.state.openPhoto({
                numPhoto: 0, 
                photos: [this.state.person.avatar]
            });
        }

    }
    return ProfilePhoto;
});