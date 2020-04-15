const showPersonPage = require(['/components/Page/PersonPage.js'], function(PersonPage) {
    const personFromDataBase = {
        name : 'Олег',
        familyName : 'Иванов',
        description : 'волк волку волк',
        photos : [
            '/img/example/gallery/cat1.jpg',
            '/img/example/gallery/cat2.jpg',
            '/img/example/gallery/cat3.jpg',
            '/img/example/gallery/cat4.jpg',
        ],
        avatar : '/img/example/user_photo.png',
        civilStatus : 'в поиске',
        city : 'Уфа',
        birthDay : '1998-12-17',
        education : 'УГАТУ 2022',
        active : '2020-03-31T21:24:00',
        job : 'Студия "Эксплорер 5 - 0"',
        id : '1822',
    };

    const page = new PersonPage({
        person : personFromDataBase,
    });
    page.mount(document.body);

    document.head.title = `${personFromDataBase.name} ${personFromDataBase.familyName}`;
});

//роутинг на минималках
const path = document.defaultView.location.pathname;
switch (path) {
    case '/':
        showPersonPage();
        break;

    default:
        break;
}
