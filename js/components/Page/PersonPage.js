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
    'js/components/Models/PersonModel.js',
], function(Component, Header, Profile, ProfileGallery, ProfileWall, ProfilePhoto, 
            ProfileNavigator, ProfileMessages, Footer, PopupStack, PopupViewPhoto, PersonModel) {
    'use strict';
    /**
     * Страница пользователя
     */
    class PersonPage extends Component{
        //полученный объект персоны приводим к модели пользователя
        constructor(options) {
            super({
                ...options,  
                person : factory.create(PersonModel, {
                    ...options.person,
                    domain : options.domain,
                }),
            });
            document.title = `${options.person.name ?? document.title}`;
        }

        
        /**
         * Рендер компонента
         * @param {Object} options
         * @param {PersonModel} options.person
         */
        render({person}) {
            //сгенерированный id блока вставится в методе toString()
            const popupStack = this.childrens.create(PopupStack, {});
            return `
            <div class="wrapper">
                ${this.childrens.create(Header, {
                    title: person.activeString,
                    //action: () => { }, можно не передавать, т.к. есть значение по умолчанию
                    actionText: 'Редактировать',
                    idPerson : person.id,
                    name: person.name,
                    photo: person.avatar,
                })}
                <main class="content content_profile">
                    <div class="content__left">
                        ${this.childrens.create(Profile, { /* передаем класс и параметры, Composite сам создаст и вернет объект */
                            person : person,
                            domain : this.options.domain,
                        })}
                        ${this.childrens.create(ProfileGallery, {
                            idPerson : person.id,
                            photos : person.photos,
                            openPhoto : this.openPhoto.bind(this, popupStack, PopupViewPhoto),
                        })}
                        ${this.childrens.create(ProfileWall, {})}
                    </div>
                    <div class="content__right">
                        ${this.childrens.create(ProfilePhoto, {
                            idPerson : person.id,
                            photos: person.avatar,
                        })}
                        ${this.childrens.create(ProfileNavigator, {
                            idPerson : person.id,
                        })}
                        ${this.childrens.create(ProfileMessages, {})}                    
                    </div>
                </main>
                ${this.childrens.create(Footer, {})}
                ${popupStack}
            </div>`;
        }

        openPhoto(popupStack, popup, options) {
            popupStack.appendPopup(popup, options);
        }
    }
    return PersonPage;
});