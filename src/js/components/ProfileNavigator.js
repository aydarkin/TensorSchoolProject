define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class ProfileNavigator extends Component{
        constructor(options) {
            super(options);
            this.setState({
                gallery: this.options.gallery,
                openFriends: this.options.openFriends,
            });
        }

        getDefaultOptions() {
            return {
                photos: [],
            };
        }

        render() {
            return `
            <nav class="content__block profile-navigation">
                <a href="/im.html" class="profile-navigation__item">
                    <img src="/img/ui/messages.png" alt="Сообщения" class="profile-navigation__img profile-navigation__img_round">
                    <p class="profile-navigation__item-name">Сообщения</p>
                </a>
                <a href="" class="profile-navigation__item">
                    <img src="/img/ui/int.png" alt="Интересное" class="profile-navigation__img profile-navigation__img_round">
                    <p class="profile-navigation__item-name">Интересное</p>
                </a>
                <a href="" class="profile-navigation__item">
                    <img src="/img/ui/friends.png" alt="Товарищи" class="profile-navigation__img profile-navigation__img_round">
                    <p class="profile-navigation__item-name">Товарищи</p>
                </a>
                <a href="" class="profile-navigation__item">
                    <img src="/img/ui/video.png" alt="Видеотека" class="profile-navigation__img profile-navigation__img_round">
                    <p class="profile-navigation__item-name">Видеотека</p>
                </a>
                <a href="" class="profile-navigation__item">
                    <img src="/img/ui/photo.png" alt="Фото" class="profile-navigation__img profile-navigation__img_round">
                    <p class="profile-navigation__item-name">Фото</p>
                </a>
                <a href="" class="profile-navigation__item">
                    <img src="/img/ui/music.png" alt="Музыка" class="profile-navigation__img profile-navigation__img_round">
                    <p class="profile-navigation__item-name">Музыка</p>
                </a>
            </nav>`;
        }

        afterMount() {
            const buttons = this.getContainer().querySelectorAll('.profile-navigation__item');
            buttons.forEach(btn => {
                if(btn.lastElementChild.textContent == "Фото") {
                    this.galleryBtn = btn;
                    this.subscribeTo(this.galleryBtn, 'click', this.photoClick.bind(this));
                }
                if(btn.lastElementChild.textContent == "Сообщения") {
                    this.messageBtn = btn;
                    this.subscribeTo(this.messageBtn, 'click', this.messageClick.bind(this));
                }
                if(btn.lastElementChild.textContent == "Товарищи") {
                    this.friendsBtn = btn;
                    this.subscribeTo(this.friendsBtn, 'click', this.friendsClick.bind(this));
                }

            });
            
        }

        photoClick(event) {
            event.preventDefault();
            this.state.gallery.onTitleClick(event);
        }

        messageClick(event) {
            //event.preventDefault();
            //this.state.gallery.onTitleClick(event);
        }

        friendsClick(event) {
            event.preventDefault();
            this.state.openFriends();
        }
    }
    return ProfileNavigator;
});