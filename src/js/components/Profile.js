define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class Profile extends Component{
        constructor(options) {
            super(options);
            this.setState({
                person: this.options.person,
                isMyPage: this.options.isMyPage,
                mode: this.options.mode, 
                isFull: this.options.isFull,
            });
        }
        
        getDefaultOptions() {
            return {
                isMyPage: false,
                mode: 'view',
                isFull: false, 
            }
        } 
        
        render() {
            switch (this.state.mode) {
                case 'view':
                    return this.renderView(this.state.person);
                case 'edit':
                    return this.renderEdit(this.state.person);
            
                default:
                    break;
            }
        }

        renderView(person) {
            return `
            <div class="content__block profile">
                <p class="profile__title profile__title_nowrap">${person.name}</p>                        
                <div class="profile__info profile__info_short">
                    <p class="profile__description">${person.status}</p>
                    <p class="profile__label">День рождения</p>
                    <p class="profile__value">${person.birthDayString}, ${person.fullYears} годиков ${person.astrologicalSign.sign}</p>
                    <p class="profile__label">Город</p>
                    <p class="profile__value">${person.city}</p>
                    <p class="profile__label">Семейное положение</p>
                    <p class="profile__value">${person.civilStatus}</p>
                </div>
                <div class="profile__more">${this.state.isFull ? 'Скрыть' : 'Показать'} подробности</div>
                <div class="profile__info profile__info_full ${this.state.isFull ? '' : 'profile__info_hide'}">
                    <p class="profile__label">Образование</p>
                    <p class="profile__value">${person.education}</p>
                    <p class="profile__label">Место работы</p>
                    <p class="profile__value">${person.job}</p>
                </div>
            </div>
            `;
        }

        renderEdit(person) {
            return `
            <form class="content__block profile">
                <p class="profile__title profile__title_nowrap">${person.name}</p>                        
                <div class="profile__info profile__info_short profile__info_editable">
                    <textarea name="status" id="" rows="1" class="profile__description profile__description_input">${person.status}</textarea>
                    <label for="value1" class="profile__label profile__label_input">День рождения</label>
                    <input type="date" name="birth-day" id="value1" class="profile__value profile__value_input" value="${person.birthDayInputDate}">
                    <label for="value2" class="profile__label profile__label_input">Город</label>
                    <input type="text" name="city" id="value2" class="profile__value profile__value_input" value="${person.city}">
                    <label for="value3" class="profile__label profile__label_input">Семейное положение</label>
                    <input type="text" name="civil-status" id="value3" class="profile__value profile__value_input" value="${person.civilStatus}">
                </div>
                <div class="profile__more">${this.state.isFull ? 'Скрыть' : 'Показать'} подробности</div>
                <div class="profile__info profile__info_full ${this.state.isFull ? '' : 'profile__info_hide'}">
                    <label for="value4" class="profile__label profile__label_input">Образование</label>
                    <input type="text" name="education" id="value4" class="profile__value profile__value_input" value="${person.education}">
                    <label for="value5" class="profile__label profile__label_input">Место работы</label>
                    <input type="text" name="job" id="value5" class="profile__value profile__value_input" value="${person.job}">
                </div>
            </form>`;
        }

        afterMount() {
            this._hideBtn = this.getContainer().querySelector('.profile__more');
            this.subscribeTo(this._hideBtn, 'click', this.expand.bind(this));
        }

        expand(event) {
            event.stopPropagation();
            this.setState({
                isFull: !this.state.isFull,
            });
            this.update();
        }

        async changeMode(withSaving = false) {
            let newMode = this.state.mode;
            if(this.state.mode == 'view') {
                newMode = 'edit';
            } else if(this.state.mode == 'edit') {
                //если не обновил информацию не менять режим
                if(withSaving) {
                    if(await this.updatePersonData()) {
                        newMode = 'view';
                    }
                } else {
                    newMode = 'view';
                }
            }
            
            this.setState({
                mode: newMode,
            });
            this.update();
            return newMode;
        }

        async updatePersonData() {
            if(this.state.mode == 'edit') {
                const form = new FormData(this.getContainer());
                const person = this.state.person;

                person.status = form.get('status');
                person.birthDay = new Date(form.get('birth-day'));
                person.city = form.get('city');
                person.civilStatus = form.get('civil-status');
                if(this.state.isFull) {
                    person.education = form.get('education');
                    person.job = form.get('job');
                }
                await person.updateData();
                return true;
            }
            return false;
        }
    }
    return Profile;
});