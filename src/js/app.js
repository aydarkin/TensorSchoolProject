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
    fetch(DOMAIN + '/user/current', { credentials: 'include'})
    .then(
        responce => {
            if(responce.status == 401){
                //переходим на страницу авторизации
                document.location.href = '/auth.html';
            }
           
            return responce.json();
        }
    ) 
    .then(result => {    
        const page = factory.create(PersonPage, {
            person: result,
            domain: DOMAIN,
            currentId: result.id,
            isMyPage: true,
        });
        page.mount(document.body);

    })
    .catch((err) => {
        console.log(err);
    });    
};

const showAnothePersonPage = function(PersonPage) {
    let currentId;
    fetch(DOMAIN + '/user/current', { credentials: 'include'})
    .then(
        responce => {
            if(responce.status == 401){
                //переходим на страницу авторизации
                document.location.href = '/auth.html';
            }
            return responce.json();
        }
    )
    .then(result => {
        currentId = result.id;
        const id = document.location.pathname.split('/').pop();
        return fetch(DOMAIN + '/user/read/' + id, { credentials: 'include'})
    })
    .then(result => result.json())
    .then(result => {  
        const page = factory.create(PersonPage, {
            person : result,
            domain : DOMAIN,
            currentId : result.id,
        });
        page.mount(document.body);

    })
    .catch((err) => {
        console.log(err);
    });    
}

const showAuthPage = function(AuthPage) {
    const page = factory.create(AuthPage, {
        domain : DOMAIN,
    });
    page.mount(document.body);
}

const showMessagesPage = function(MessagesPage) {
    fetch(DOMAIN + '/user/current', { credentials: 'include'})
    .then(
        responce => {
            if(responce.status == 401){
                //переходим на страницу авторизации
                document.location.href = '/auth.html';
            }         
            return responce.json();
        }
    ) 
    .then(result => {
        const page = factory.create(MessagesPage, {
            person : result,
            domain : DOMAIN,
        });
        page.mount(document.body);

    })
    .catch((err) => {
        console.log(err);
    });    
}

//роутинг на минималках
let path = document.defaultView.location.pathname;

//если проект запущен без сервера (открылся html файл)
//то путь равен имени файла
if(path.indexOf('file://')){
    path = path.split('/').pop();
}


switch (true) {
    case path == '/':
    case path == '':
    case path == 'index.html':
        require(['js/components/Page/PersonPage.js'], showPersonPage);
        break;
    case path == 'auth.html':
    case path == 'auth':
        require(['js/components/Page/AuthPage.js'], showAuthPage);
        break;
    case path == 'im.html':
    case path == 'im':
        require(['js/components/Page/MessagesPage.js'], showMessagesPage);
        break;
    case document.location.pathname.search('user/') > -1:
        require(['js/components/Page/PersonPage.js'], showAnothePersonPage);
        break;
    default:
        document.location = '/'
        break;
}


