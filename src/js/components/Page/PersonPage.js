define([
    'js/components/Base/Component.js', 
    'js/components/Header.js',
    'js/components/Profile.js',
    'js/components/ProfileGallery.js',
    'js/components/ProfileWall.js',
    'js/components/ProfilePhoto.js',
    'js/components/ProfileNavigator.js',
    'js/components/ProfileMessages.js',
    'js/components/Footer.js',
    'js/components/PopupStack.js',
    'js/components/PopupViewPhoto.js',
    'js/components/PopupGallery.js',
    'js/components/PopupFriends.js',
    'js/components/FriendStatus.js',
    'js/components/Models/PersonModel.js',
], function(Component, Header, Profile, ProfileGallery, ProfileWall, ProfilePhoto, 
            ProfileNavigator, ProfileMessages, Footer, PopupStack, PopupViewPhoto, 
            PopupGallery, PopupFriends, FriendStatus, PersonModel) {
    'use strict';
    /**
     * Страница пользователя
     */
    class PersonPage extends Component{
        //полученный объект персоны приводим к модели пользователя
        constructor(options) {
            super(options);
            const current = this.options.currentPerson ? this.options.currentPerson : this.options.person;
            this.setState({
                currentPerson: current,
                person: this.options.person,
                isMyPage : this.options.isMyPage,
            });
            document.title = `${this.state.person.name ?? document.title}`;
        }

        getDefaultOptions() {
            return {
                isMyPage : false,
            };
        }
        
        /**
         * Рендер компонента
         * @param {Object} options
         * @param {PersonModel} options.person
         */
        render() {
            const person = this.state.person;
            const popupStack = this.childrens.create(PopupStack, {});
            const profileGallery = this.childrens.create(ProfileGallery, {
                person: person,
                openPhoto: this.openPopup.bind(this, popupStack, PopupViewPhoto),
                openGallery: this.openPopup.bind(this, popupStack, PopupGallery),
                isMyPage: this.state.isMyPage,
            });
            const profile = this.childrens.create(Profile, {
                person : person,
                domain : this.options.domain,
            });
            return `
            <div class="wrapper">
                ${this.childrens.create(Header, {
                    person: this.state.currentPerson,
                    title: person.activeString,
                    action: profile.changeMode.bind(profile, true),
                    actionText: 'Редактировать',
                    mode: 'profile',
                    isMyPage: this.state.isMyPage,
                })}
                <main class="content content_profile">
                    <div class="content__left">
                        ${profile}
                        ${profileGallery}
                        ${this.childrens.create(ProfileWall, {
                            currentPerson: this.state.currentPerson,
                            person: person,
                            openPhoto: this.openPopup.bind(this, popupStack, PopupViewPhoto),
                            isMyPage: this.state.isMyPage,
                        })}
                    </div>
                    <div class="content__right">
                        ${this.childrens.create(ProfilePhoto, {
                            person: person,
                            openPhoto: this.openPopup.bind(this, popupStack, PopupViewPhoto),
                            isMyPage: this.state.isMyPage,
                        })}
                        ${!this.state.isMyPage ? this.childrens.create(FriendStatus, {
                            currentPerson: this.state.currentPerson,
                            person: person,
                        }) : ''}
                        ${this.childrens.create(ProfileNavigator, {
                            idPerson: person.id,
                            gallery: profileGallery,
                            openFriends: this.openPopup.bind(this, popupStack, PopupFriends, {
                                person: this.state.currentPerson,
                                isMyPage: this.state.isMyPage,
                            }),
                        })}
                        ${this.childrens.create(ProfileMessages, {})}                    
                    </div>
                </main>
                ${this.childrens.create(Footer, {})}
                ${popupStack}
            </div>`;
        }

        openPopup(popupStack, popup, options) {
            popupStack.appendPopup(popup, options);
        }
        
    }
    return PersonPage;
});