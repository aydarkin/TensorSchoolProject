/**
 * Абстрактная фабрика
 */
class AbstractFactory {
    create(component, options) {
        return new component(options || {});
    }
}

const factory = new AbstractFactory()

const showPersonPage = function(PersonPage) {
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

    const page = factory.create(PersonPage, {
        person : personFromDataBase,
    });
    page.mount(document.body);

    document.head.title = `${personFromDataBase.name} ${personFromDataBase.familyName}`;
};

//роутинг на минималках
let path = document.defaultView.location.pathname;

//если проект запущен без сервера (открылся html файл)
//то путь равен имени файла
if(path.indexOf('file://')){
    path = path.split('/').pop();
}

switch (path) {
    case '/':
    case 'index.html':
        require(['/components/Page/PersonPage.js'], showPersonPage);
        break;

    default:
        break;
}
