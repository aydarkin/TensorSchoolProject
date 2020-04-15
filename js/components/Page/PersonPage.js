define([
    '/components/Base/Component.js', 
    '/components/Header.js',
    '/components/Profile.js',
    '/components/ProfileGallery.js',
    '/components/ProfileWall.js',
    '/components/ProfilePhoto.js',
    '/components/ProfileNavigator.js',
    '/components/ProfileMessages.js',
    '/components/Footer.js',
    '/components/Models/PersonModel.js',
], function(Component, Header, Profile, ProfileGallery, ProfileWall, ProfilePhoto, 
            ProfileNavigator, ProfileMessages, Footer, PersonModel) {
    'use strict';
    /**
     * Страница пользователя
     */
    class PersonPage extends Component{
        //сгенерированный id блока вставится в методе toString()
        render({person}) {
            return `
            <div class="wrapper">
                ${new Header({
                    title: 'В сети',
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
            </div>`;
        }

        beforeMount() {
            this.setState({
                person : new PersonModel(this.options.person),
            });
        }
    }
    return PersonPage;
});