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
    // fetch(DOMAIN + 'user/current')
    // .then(responce => responce.json()) //ждем ответ сервера
    // .then(result => { //ждем обработку json
    //     const personFromServer = result;
    
    //     //временно, пока сервер не будет присылать коллекцию фото пользователя
    //     personFromServer.data.photos = [
    //         '/img/example/gallery/cat1.jpg',
    //         '/img/example/gallery/cat2.jpg',
    //         '/img/example/gallery/cat3.jpg',
    //         '/img/example/gallery/cat4.jpg',
    //     ];
    
    
    //     const page = factory.create(PersonPage, {
    //         person : personFromServer,
    //     });
    //     page.mount(document.body);
    
    //     document.title = `${personFromServer.data.name}`;
    // })
    // .catch(err => console.error(err));

    const page = factory.create(PersonPage, {
                person : {
                    "id": 9,
                    "data": {
                        "job": "одмен",
                        "city": "Уфа",
                        "name": "Олег Макет",
                        "education": "колледж информатики",
                        "birth_date": "1998-07-07",
                        "family_state": "есть сервак",
                        photos : [
                                    '/img/example/gallery/cat1.jpg',
                                    '/img/example/gallery/cat2.jpg',
                                    '/img/example/gallery/cat3.jpg',
                                    '/img/example/gallery/cat4.jpg',
                                ],
                    },
                    "computed_data": {
                        "last_activity": "2020-04-20T19:29:59.086598",
                        "photo_ref": "/img/example/gallery/cat1.jpg"
                    }
                },
            });
            page.mount(document.body);
        
            //document.title = `${personFromServer.data.name}`;
    
};

//роутинг на минималках
let path = document.defaultView.location.pathname;

//если проект запущен без сервера (открылся html файл)
//то путь равен имени файла
if(path.indexOf('file://')){
    path = path.split('/').pop();
}

//временно, авторизация
if(!document.cookie.match('sessionid=')){
    //данные авторизации
    const formData = new URLSearchParams({
        'login': 'anime',
        'password': 'anime'
    }); 

    fetch(DOMAIN + '/user/login', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded',
        },
        body: formData.toString()
    }).then(
        res => {
            if(res.status == 200){
                console.log('Авторизация прошла успешно');
                //Основная работа программы
                switch (path) {
                    case '/':
                    case '':
                    case 'index.html':
                        require(['js/components/Page/PersonPage.js'], showPersonPage);
                        break;
                
                    default:
                        break;
                }
            }  
        }
    ).catch(
        err => console.error('Ошибка авторизации: ', err)
    );
}

