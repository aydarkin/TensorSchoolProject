define(['js/components/Base/Model.js'], function(Model) {
    'use strict';
    class PersonModel extends Model {
        
        get activeString() {
            return this.renderTextDate(this.active || null);
        }
        
        /**
         * Возращает дату в текстовом виде по формату 'сегодня|вчера|позавчера в HH:MM' или 'DD.MM.YY в HH:MM'
         * 'неизвестно', если null
         * @param {Date|null} date - дата
         */
        renderTextDate(date) {
            let out = 'неизвестно';
            const now = new Date();
            const oneDay = 24 * 60 * 60 * 10000;
            const days = Math.floor((now - date) / oneDay);
            const daysStr = ['сегодня', 'вчера', 'позавчера'];
            if (date) {
                const timeText = `${date.getHours()}:${date.getMinutes()}`;
                out = `${daysStr[days] || date.toLocaleDateString()} в ${timeText}`;
            }
            return out;
        }

        get birthDayString() {
            return this.renderBirthDay(this.birthDay || null);
        }

        /** 
         * Получает текст даты рождения без года
         * Например: 12 апреля
         * @param {Date|null} date - дата
         */
        renderBirthDay(date) {
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

        /**
         * Получает полное количество лет
         * если даты рождения нет, то пустая строка
         */
        get fullYears(){
            if(this.birthDay){
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