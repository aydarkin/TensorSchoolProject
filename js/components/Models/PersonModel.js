define(['js/components/Base/Model.js'], function(Model) {
    'use strict';
    class PersonModel extends Model {
        constructor(data) {
            super({
                id : '' && data.id,
                name : '' && data.data.name,
                description : '' && data.data.description,
                photos : [] && data.data.photos,
                avatar : '' && data.domain + data.computed_data.photo_ref,
                civilStatus : '' && data.data.family_state,
                city : '' && data.data.city,
                birthDay : null && new Date(data.data.birth_date),
                education : '' && data.data.education,
                active : null && new Date(data.computed_data.last_activity),
                job : '' && data.data.job,
            });
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
                const daysStr = ['', 'вчера'];

                if(now - date < 15 * 60 * 1000){
                    out = 'В сети';
                } else {
                    const dayText = daysStr[days] || this.renderDay(date);
                    const yearText = date.getFullYear() == now.getFullYear() ? '' : ` ${date.getFullYear()}`;
    
                    const zero = date.getMinutes() < 10 ? '0' : '';
                    const timeText = `${date.getHours()}:${zero}${date.getMinutes()}`;
    
                    out = `Был(а) в сети ${dayText}${yearText} в ${timeText}`;
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
            return renderAstrologicalSign(this.birthDay);
        }

        /**
         * Получает объект с данными о знаке зодиака
         * если получен null, то вернет пустую строку
         * @param {Date|null} date 
         */
        renderAstrologicalSign(date) {
            if(date){
                const astrologicalSigns = {
                    '♈' : 'Овен', 
                    '♉' : 'Телец',
                    '♊' : 'Близнецы',
                    '♋' : 'Рак',
                    '♌' : 'Лев',
                    '♍' : 'Дева', 
                    '♏' : 'Весы',
                    '⛎' : 'Скорпион',
                    '♐' : 'Стрелец',
                    '♑' : 'Козерог',
                    '♒' : 'Водолей',
                    '♓' : 'Рыбы',
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

    }
    return PersonModel;
});