/**
 * Абстрактная фабрика
 */
class AbstractFactory {
    create(component, options) {
        return new component(options || {});
    }
}

const factory = new AbstractFactory()

const DOMAIN = 'http://tensor-school.herokuapp.com';

const showPersonPage = function(PersonPage) {
    //получаем данные с сервера
    
    fetch(DOMAIN + '/user/current', { credentials: 'include'})
    .then(responce => responce.json()) //ждем ответ сервера
    .then(result => { //ждем обработку json
        const personFromServer = result;
    
        //временно, пока сервер не будет присылать коллекцию фото пользователя
        personFromServer.data.photos = [
            '/img/example/gallery/cat1.jpg',
            '/img/example/gallery/cat2.jpg',
            '/img/example/gallery/cat3.jpg',
            '/img/example/gallery/cat4.jpg',
        ];
    
    
        const page = factory.create(PersonPage, {
            person : { 
                ...personFromServer,
            },
            domain : DOMAIN,
        });
        page.mount(document.body);

    })
    .catch(err => console.error(err));    
};

const showAuthPage = function(AuthPage) {
    const page = factory.create(AuthPage, {
        domain : DOMAIN,
    });
    page.mount(document.body);
}

//роутинг на минималках
let path = document.defaultView.location.pathname;

//если проект запущен без сервера (открылся html файл)
//то путь равен имени файла
if(path.indexOf('file://')){
    path = path.split('/').pop();
}


switch (path) {
    case '/':
    case '':
    case 'index.html':
        require(['js/components/Page/PersonPage.js'], showPersonPage);
        break;
    case 'auth.html':
    case 'auth':
        require(['js/components/Page/AuthPage.js'], showAuthPage);
        break;
    default:
        break;
}

