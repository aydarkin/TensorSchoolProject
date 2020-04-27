define(['js/components/Base/Model.js'], function(Model) {
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
                domain : data.domain || '',
                id : data.id || '',
                name : data.data.name || '',
                description : data.data.description  || '',
                photos : data.data.photos || [],
                avatar : (data.computed_data.photo_ref ? (data.domain || '') + data.computed_data.photo_ref : '/img/ui/empty_photo.png'),
                civilStatus : data.data.family_state  || '',
                city : data.data.city  || '',
                birthDay : new Date(data.data.birth_date) || '',
                education : data.data.education  || '',
                active : new Date(+new Date(data.computed_data.last_activity) - (new Date().getTimezoneOffset() * 60 * 1000))  || '',
                job : data.data.job  || '',
            });            
        }
        
        /**
         * Возвращает дату для подстановки в input
         * формат YYYY-mm-dd
         * @param {Date} date 
         */
        static renderInputDate(date) {
            return `${date.getFullYear()}-${date.getMonth() < 11 ? '0'+(date.getMonth()+1) : date.getMonth()+1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;
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
            if (date) {
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
            if(date){
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
            if(date){
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
            if(date){
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
         * Получить список фотографий
         * @param {Number} id 
         * @returns {Array}
         */
        async getPhotosAsync(id = this.id) {
            const responce = await fetch(this.domain + '/photo/list/' + id, { credentials: 'include'});
            if(responce.status >= 200 && responce.status < 300){
                const result = await responce.json();
                const photos = result.photos.map((photo) => { return this.domain + photo.photo_ref });
                return photos;
            }
            throw new Error('Сервер выдал ошибку:' + responce.status);
        }

        /**
         * Получить список сообщений от пользователя
         * @param {Number} id - id отправителя
         */
        async getMessagesAsync(id) {
            const responce = await fetch(this.domain + '/message/list/' + id, { credentials: 'include'});
            if(responce.status >= 200 && responce.status < 300){
                const result = await responce.json();
                result.messages.forEach(mes => {
                    mes.author = JSON.parse(mes.author.replace(new RegExp("'", 'g'), '"'));
                });
                result.messages = result.messages.reverse();
                return result;
            }
            throw new Error('Сервер выдал ошибку:' + responce.status);
        } 

        /**
         * Получить список друзей
         * @param {Number} page 
         * @param {Number} pageSize 
         */
        async getFriendsAsync(page = 0, pageSize = 30) {
            const params = new URLSearchParams({
                page : page,
                pageSize : pageSize,
            })

            const responce = await fetch(this.domain + '/user_link/list?' + params, { 
                credentials: 'include',
            });
            if(responce.status >= 200 && responce.status < 300){
                const result = await responce.json();
                //хочется Promise.map
                const friends = await Promise.all(result.messages.map(async (user) => {
                    const res = await this.getUser(user.user_id);
                    return res;
                }));
                
                return friends;
            }
            throw new Error('Сервер выдал ошибку:' + responce.status);
        }

        /**
         * Получить информацию о пользователе
         * @param {Number} id - id получаемого пользователя
         */
        async getUser(id) {
            const responce = await fetch(this.domain + '/user/read/' + id, {
                credentials: 'include'
            });
            return await responce.json();
        }
        
        /**
         * Получить информацию о пользователе в виде объекта PersonModel
         * @param {Number} id - id получаемого пользователя
         * @returns {PersonModel}
         */
        async getPerson(id) {
            const personData = await this.getUser(id);
            return factory.create(PersonModel, {
                ...personData,
                domain: this.domain,
            });
        }

        /**
         * Отправка сообщения другому пользователю
         * @param {Number} addresseeId - id адресата
         * @param {string} messageText - текст сообщения
         */
        async sendMessage(addresseeId, messageText) {
            const responce = await fetch(this.domain + '/message/create', {
                method : 'POST',
                credentials: 'include',
                body : new URLSearchParams({
                    author : this.id,
                    addressee : addresseeId,
                    message : messageText,
                }),
            });
            if(responce.status >= 200 && responce.status < 300){
                const message = await responce.json();
                message.author = JSON.parse(message.author.replace(new RegExp("'", 'g'), '"'));
                return message;
            }
        }

        /**
         * Выход пользователя из системы
         */
        async logout() {
            await fetch(this.domain + '/user/logout', { credentials : 'include' });
        }

        /**
         * Отправка обновленной информации о пользователе
         */
        async updateData() {
            await fetch(this.domain + '/user/update', { 
                method : 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                credentials : 'include',
                body : JSON.stringify({
                    name : this.name,
                    description : this.description,
                    birth_date : this.birthDay,
                    city : this.city,
                    family_state : this.civilStatus,
                    education : this.education,
                    job : this.job,
                }),
            });
        }

        /**
         * Обновляет аватар пользователя
         * @param {File} photo 
         */
        async uploadPhoto(photo) {
            await fetch(this.domain + '/user/upload_photo', { 
                method : 'POST',
                headers: {
                    'Content-Type' : 'image/png',
                },
                credentials : 'include',
                body : photo,
            });
        }
    }
    return PersonModel;
});