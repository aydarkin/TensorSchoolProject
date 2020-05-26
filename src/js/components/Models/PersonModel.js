define(['js/components/Base/Model.js', 'js/components/Base/DataModule.js'], function(Model, DataModule) {
    'use strict';
    class PersonModel extends Model {
        constructor(data) {
            if(!data){
                data = {};
            };
            if(!data.data){
                data.data = {};
            };
            if(!data.computed_data) {
                data.computed_data = {};
            }
            super({
                id : data.id || '',
                name : data.data.name || data.data.first_name || data.data.firstName || '',
                status : data.data.status  || data.data.about_self || '',
                photos : data.data.photos || [],
                civilStatus : data.data.family_state  || '',
                city : data.data.city  || '',
                birthDay : new Date(data.data.birth_date || data.data.bdate) || '',
                education : data.data.education  || '',
                active : new Date(+new Date(data.computed_data.last_activity) - (new Date().getTimezoneOffset() * 60 * 1000))  || '',
                job : data.data.job  || '',
            }); 
            this.setAvatar(data.computed_data.photo_ref)   
        }
        
        /**
         * Устанавливает аватар
         * Решает проблему кэшированого аватара после обновления аватара 
         * @param {string} relativeURL
         */
        setAvatar(relativeURL) {
            const random = Math.trunc(Math.random() * 100000);
            this.avatar = relativeURL ? `${ DataModule.domain}${relativeURL}?${random}` : '/img/ui/empty_photo.png';
        }

        /**
         * Возвращает дату для подстановки в input
         * формат YYYY-mm-dd
         * @param {Date} date 
         */
        static renderInputDate(date) {
            if(date && date.toString() != "Invalid Date") {
                return `${date.getFullYear()}-${date.getMonth() < 11 ? '0'+(date.getMonth()+1) : date.getMonth()+1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
            } else {
                return '';
            }
        }

        get birthDayInputDate() {
            return PersonModel.renderInputDate(this.birthDay);
        }

        get activeString() {
            return this.renderTextDate(this.active || null);
        }
        
        /**
         * Возращает дату в текстовом виде по формату ''|Вчера в HH:MM или 'DD.MM.YYYY в HH:MM'
         * 'Неизвестно', если null
         * 'В сети'
         * @param {Date|null} date - дата
         */
        renderTextDate(date) {
            let out = 'неизвестно';
            if (date && date.toString() != "Invalid Date") {
                const now = new Date();
                const oneDay = 24 * 60 * 60 * 1000;
                const days = Math.floor((+now - date) / oneDay);
                const daysStr = ['', 'вчера '];

                if(now - date < 15 * 60 * 1000){
                    out = 'В сети';
                } else {
                    const dayText = daysStr[days] ?? this.renderDay(date);
                    const yearText = date.getFullYear() == now.getFullYear() ? '' : ` ${date.getFullYear()} `;
                    
                    const zeroHour = date.getHours() < 10 ? '0' : '';
                    const zeroMinute = date.getMinutes() < 10 ? '0' : '';
                    const timeText = `${zeroHour}${date.getHours()}:${zeroMinute}${date.getMinutes()}`;
    
                    out = `Был(а) в сети ${dayText}${yearText}в ${timeText}`;
                }    
            }
            return out;
        }

        get birthDayString() {
            return this.renderDay(this.birthDay || null);
        }

        /** 
         * Получает текст даты без года
         * Например: 12 апреля
         * @param {Date|null} date - дата
         */
        renderDay(date) {
            let textBirthday = 'скрыто';
            if(date && date.toString() != "Invalid Date"){
                const months = [
                    'января',
                    'февраля',
                    'марта',
                    'апреля',
                    'мая',
                    'июня',
                    'июля',
                    'августа',
                    'сентября',
                    'октября',
                    'ноября',
                    'декабря',
                ];
                textBirthday = `${date.getDate()} ${months[date.getMonth()]}`;
            }
            return textBirthday;
        }

        get fullYears(){
            return this.renderFullYears(this.birthDay);
        }

        /**
         * Получает полное количество лет
         * если даты рождения нет, то пустая строка
         */
        renderFullYears(date) {
            if(date && date.toString() != "Invalid Date"){
                const now = new Date();
                let years = now.getFullYear() - date.getFullYear();
                if(now.getMonth() < date.getMonth()
                    || (now.getMonth() === date.getMonth() && now.getDate() < date.getDate())){
                    years--;
                }
                return years.toString();
            }
            return '';
        }

        get astrologicalSign() {
            return this.renderAstrologicalSign(this.birthDay);
        }

        /**
         * Получает объект с данными о знаке зодиака
         * если получен null, то вернет пустую строку
         * @param {Date|null} date 
         */
        renderAstrologicalSign(date) {
            if(date && date.toString() != "Invalid Date"){
                const astrologicalSigns = {
                    '♈' : 'овен', 
                    '♉' : 'телец',
                    '♊' : 'близнецы',
                    '♋' : 'рак',
                    '♌' : 'лев',
                    '♍' : 'дева', 
                    '♏' : 'весы',
                    '⛎' : 'скорпион',
                    '♐' : 'стрелец',
                    '♑' : 'козерог',
                    '♒' : 'водолей',
                    '♓' : 'рыбы',
                };
                //в формате ММДД, М - месяц, Д - день
                const code = (date.getMonth() + 1) * 100 + date.getDate();
                let sign;
                switch (true) { 
                    case (code >= 321 && code <= 420): { sign = '♈'; break; }
                    case (code >= 421 && code <= 521): { sign = '♉'; break; }
                    case (code >= 522 && code <= 621): { sign = '♊'; break; }
                    case (code >= 622 && code <= 722): { sign = '♋'; break; }
                    case (code >= 723 && code <= 821): { sign = '♌'; break; }
                    case (code >= 822 && code <= 923): { sign = '♍'; break; }
                    case (code >= 924 && code <= 1023): { sign = '♏'; break; }
                    case (code >= 1024 && code <= 1122): { sign = '⛎'; break; }
                    case (code >= 1123 && code <= 1222): { sign = '♐'; break; }
                    case (code >= 1223 || code <= 120): { sign = '♑'; break; }
                    case (code >= 121 && code <= 219): { sign = '♒'; break; }
                    case (code >= 220 && code <= 320): { sign = '♓'; break; }
                }

                return {
                    sign: sign,
                    name: astrologicalSigns[sign],
                }
            }
            return '';
        }

        /**
         * Получение списка фотографий
         * @param {Number} id 
         * @returns {Array}
         */
        async getPhotosAsync(id = this.id) {
            const result = await DataModule.getQuery('/photo/list/' + id);
            const photos = result.photos.map((photo) => { return DataModule.domain + photo.path });
            return photos;
        }

        /**
         * Получение списка сообщений от пользователя
         * @param {Number} id - id отправителя
         */
        async getMessagesAsync(id) {
            const result = await DataModule.getQuery('/message/list/' + id);

            result.messages.forEach(mes => {
                mes.author = JSON.parse(mes.author.replace(new RegExp("'", 'g'), '"').replace('None', 'null'));
            });

            result.messages = result.messages.reverse();
            return result;
        } 

        /**
         * Получение списка связей
         * @param {Number} page 
         * @param {Number} pageSize 
         */
        async getLinksAsync(page = 0, pageSize = 100) {
            const result = await DataModule.getQuery('/user_link/list', {
                page : page,
                pageSize : pageSize,
            });
            
            const from = new Set();
            const to = new Set();
            result.user_links.forEach((user) => {
                if(user.user_from != this.id) {
                    from.add(user.user_from);
                }
                if(user.user_to != this.id) {
                    to.add(user.user_to);
                }   
            });

            const intersection = [...from].filter((id) => to.has(id));
            const onlyFrom = [...from].filter((id) => !to.has(id));
            const onlyTo = [...to].filter((id) => !from.has(id));

            const links = [];

            //эвент-луп прости меня
            await Promise.all([
                Promise.all(intersection.map(async (id) => {
                    return links.push({
                        person: await PersonModel.getPerson(id),
                        type: 'friend',
                    });
                })),
                Promise.all(onlyFrom.map(async (id) => {
                    return links.push({
                        person: await PersonModel.getPerson(id),
                        type: 'incoming',
                    });
                })),
                Promise.all(onlyTo.map(async (id) => {
                    return links.push({
                        person: await PersonModel.getPerson(id),
                        type: 'outgoing',
                    });
                }))
            ])
            
            return links;
        }

        /**
         * Создание связей с другим пользователем
         * @param {number} id 
         * @param {string} type 
         */
        async createLink(id, type = 'friend') {
            await DataModule.postQuery('/user_link/create', {
                user: id,
                link_type: type,
            });
        }

        /**
         * Удаление связи с другим пользователем
         * @param {number} id 
         */
        async deleteLink(id) {
            await DataModule.postQuery('/user_link/delete', {
                user: id
            }, 'application/x-www-form-urlencoded', false);
        }

        /**
         * Получение информации о пользователе
         * @param {Number} id - id получаемого пользователя
         */
        static async getUser(id) {
            return await DataModule.getQuery('/user/read/' + id);
        }
        
        /**
         * Получение информации о пользователе в виде объекта PersonModel
         * @param {Number} id - id получаемого пользователя
         * @returns {PersonModel}
         */
        static async getPerson(id) {
            const personData = await PersonModel.getUser(id);
            return factory.create(PersonModel, personData);
        }

        /**
         * Отправка сообщения другому пользователю
         * @param {Number} addresseeId - id адресата
         * @param {string} messageText - текст сообщения
         */
        async sendMessage(addresseeId, messageText) {
            const message = await DataModule.postQuery('/message/create', {
                author: this.id,
                addressee: addresseeId,
                message: messageText,
            });
            message.author = JSON.parse(message.author.replace(new RegExp("'", 'g'), '"'));
            return message;
        }

        /**
         * Удаление сообщения (своего)
         * @param {number} id 
         */
        async deleteMessage(id) {
            await DataModule.postQuery('/message/delete', {
                message_id: id
            }, 'application/x-www-form-urlencoded', false);
        }

        /**
         * Выход пользователя из системы
         */
        async logout() {
            await DataModule.getQuery('/user/logout');
        }

        /**
         * Отправка обновленной информации о пользователе
         */
        async updateData() {
            await DataModule.jsonQuery('/user/update', {
                name : this.name,
                status : this.status,
                birth_date : this.birthDay,
                city : this.city,
                family_state : this.civilStatus,
                education : this.education,
                job : this.job,
            });
        }

        /**
         * Обновление аватара пользователя
         * @param {File} photo 
         * @returns {string} - URL обновленного аватара
         */
        async uploadPhoto(photo) {
            const person = await DataModule.pngQuery('/user/upload_photo', photo);
            this.setAvatar(person.computed_data.photo_ref);
            return this.avatar;
        }

        /**
         * Добавление фото пользователя
         * @param {File} photo 
         */
        async addPhoto(photo) {
            await DataModule.pngQuery('/photo/upload', photo);
        }

        /**
         * Удаление фото пользователя
         * @param {File} photo 
         */
        async deletePhoto(id) {
            await DataModule.postQuery('/photo/delete', {
                photo_id : id,
            });
        }

        /**
         * Получить авторизованного пользователя
         */
        static async getCurrent() {
            const data = await DataModule.getQuery('/user/current');
            return factory.create(PersonModel, data);
        }

        /**
         * Зарегистрировать пользователя
         * @param {string} login 
         * @param {string} password 
         * @param {string} name 
         */
        static async registration(login, password, name) {
            const result = await DataModule.postQuery('/user/create', {
                login : login,
                password : password,
            });

            const person = factory.create(PersonModel, result);
            person.name = name;
            await person.updateData();

            return person;
        }

        /**
         * Аутентификация
         * @param {string} login 
         * @param {string} password 
         */
        static async login(login, password) {
            const result = await DataModule.postQuery('/user/login', {
                login : login,
                password : password,
            });

            return factory.create(PersonModel, result);
        }

        /**
         * Получить список всех персон, с которыми можно вести диалог
         */
        async getAllUsers() {
            const result = await DataModule.getQuery('/message/addressee_list');

            return result.messages.map((user) => factory.create(PersonModel, user));
        }
    }
    return PersonModel;
});