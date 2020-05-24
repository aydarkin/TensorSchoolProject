/**
 * Абстрактная фабрика
 */
class AbstractFactory {
    create(component, options) {
        return new component(options || {});
    }
}

const factory = new AbstractFactory()

const showPersonPage = function(PersonPage, PersonModel) {
    PersonModel.getCurrent()
    .then((person) => {
        const page = factory.create(PersonPage, {
            person: person,
            isMyPage: true,
        });
        page.mount(document.body);
    })
    .catch(() => {
        //переходим на страницу авторизации
        document.location.href = '/auth';
    })    
};

const showAnothePersonPage = function(PersonPage, PersonModel) {
    const id = document.location.pathname.split('/').pop();
    let current;
    PersonModel.getCurrent()
    .then((result) => {
        current = result;
        return PersonModel.getPerson(id)
    })
    .then((person) => {
        const page = factory.create(PersonPage, {
            person : person,
            currentPerson : current,
        });
        page.mount(document.body);
    })   
}

const showAuthPage = function(AuthPage) {
    const page = factory.create(AuthPage, {});
    page.mount(document.body);
}

const showMessagesPage = function(MessagesPage, PersonModel) {
    PersonModel.getCurrent()
    .then((person) => {
        const page = factory.create(MessagesPage, {
            person : person,
        });
        page.mount(document.body);
    })
    .catch(() => {
        //переходим на страницу авторизации
        document.location.href = '/auth';
    })
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
        require(['js/components/Page/PersonPage.js','js/components/Models/PersonModel.js'], showPersonPage);
        break;
    case path == 'auth':
    case path == 'auth.html':
        require(['js/components/Page/AuthPage.js'], showAuthPage);
        break;
    case path == 'im':
    case path == 'im.html':
        require(['js/components/Page/MessagesPage.js','js/components/Models/PersonModel.js'], showMessagesPage);
        break;
    case document.location.pathname.search('user/') > -1:
        require(['js/components/Page/PersonPage.js','js/components/Models/PersonModel.js'], showAnothePersonPage);
        break;
    default:
        document.location = '/'
        break;
}


