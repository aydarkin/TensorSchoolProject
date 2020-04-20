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
    'js/components/Models/PersonModel.js',
], function(Component, Header, Profile, ProfileGallery, ProfileWall, ProfilePhoto, 
            ProfileNavigator, ProfileMessages, Footer, PopupStack, PersonModel) {
    'use strict';
    /**
     * Страница пользователя
     */
    class PersonPage extends Component{
        //полученный объект персоны приводим к модели пользователя
        constructor(options) {
            super({
                ...options,  
                person : factory.create(PersonModel, options.person),
            });
        }

        
        /**
         * Рендер компонента
         * @param {Object} options
         * @param {PersonModel} options.person
         */
        render({person}) {
            //сгенерированный id блока вставится в методе toString()
            return `
            <div class="wrapper">
                ${new Header({
                    title: person.activeString,
                    //action: () => { }, можно не передавать, т.к. есть значение по умолчанию
                    actionText: 'Редактировать',
                    idPerson : person.id,
                    name: person.name,
                    photo: person.avatar,
                })}
                <main class="content content_profile">
                    <div class="content__left">
                        ${this.childrens.create(Profile, person)/* передаем класс и параметры, Composite сам создаст и вернет объект */}
                        ${this.childrens.create(ProfileGallery, {
                            idPerson : person.id,
                            photos: person.photos,
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
                ${this.childrens.create(PopupStack, {})}
            </div>`;
        }
    }
    return PersonPage;
});