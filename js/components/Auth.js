define([
    'js/components/Base/Component.js', 
    'js/components/Models/PersonModel.js'
], function(Component, PersonModel) {
    'use strict';
    class Auth extends Component{
        constructor(options) {
            super(options);
            this.setState({
                mode : this.options.mode,
                domain : this.options.domain,
            });
        }

        getDefaultOptions() {
            return {
                mode : 'sign-in',
            }
        }

        render() {
            switch(this.state.mode) {
                case 'sign-up':
                    return this.renderRegistration();
                    
                case 'sign-in':
                default:
                    return this.renderAuthentication();                   
            }
        }

        renderAuthentication() {
            return `
            <div class="content__block auth">
                <div class="auth__title">Авторизация</div>
                <form class="auth__content">
                    <label for="login" class="auth__label">Логин</label>
                    <input type="text" name="login" class="auth__login" required>
                    <label for="password" class="auth__label">Пароль</label>
                    <input type="password" name="password" class="auth__password" required>
                    <div class="auth__buttons">
                        <button class="auth__sign">Вход</button>
                        <span class="auth__mode">Регистрация</span>
                    </div>
                </form>
            </div>`;
        }

        renderRegistration() {
            return `
            <div class="content__block auth">
                <div class="auth__title">Регистрация</div>
                <form class="auth__content auth__content_registration">
                    <label for="login" class="auth__label">Логин</label>
                    <input type="text" name="login" class="auth__login" required>
                    <label for="password" class="auth__label">Пароль</label>
                    <input type="password" name="password" class="auth__password" required>
                    <label for="name" class="auth__label">Имя</label>
                    <input type="text" name="name" class="auth__name" required>
                    <div class="auth__buttons">
                        <button class="auth__sign">Регистрация</button>
                        <span class="auth__mode">Вход</span>
                    </div>
                </form>
            </div>
            `;   
        }

        changeMode() {
            switch(this.state.mode) {
                case 'sign-up':
                    this.setState({
                        mode : 'sign-in',
                    });
                    break;
                    
                case 'sign-in':
                default:
                    this.setState({
                        mode : 'sign-up',
                    });
                    break;                      
            }
            this.update();
        }

        afterMount() {
            this.signIn = this.getContainer().querySelector('.auth__sign');
            this.subscribeTo(this.signIn, 'click', this.submit.bind(this));

            this.modeBtn = this.getContainer().querySelector('.auth__mode');
            this.subscribeTo(this.modeBtn, 'click', this.changeMode.bind(this));
        }

        submit() {
            event.preventDefault();
            switch(this.state.mode) {
                case 'sign-up':
                    this.registration();
                    break;
                    
                case 'sign-in':
                default:
                    this.authentication();
                    break;                      
            }
        }

        authentication() {            
            const form = factory.create(FormData, this.getContainer().querySelector('.auth__content'));
            fetch(this.state.domain + '/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    login : form.get('login'),
                    password : form.get('password'),
                }),
                credentials : 'include'
            }).then(() => {
                document.location.href = '/';
            });
            
        }

        async registration() {            
            const form = factory.create(FormData, this.getContainer().querySelector('.auth__content'));
            try {
                const responce = await fetch(this.state.domain + '/user/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        login : form.get('login'),
                        password : form.get('password'),
                    }),
                    credentials : 'include'
                });
                const result = await responce.json();
                const person = factory.create(PersonModel, {
                    ...result,
                    domain : this.state.domain,
                });
                const nameInput = this.getContainer().querySelector('.auth__name');
                person.name = nameInput.value;
                await person.updateData();
                alert('Регистрация прошла успешно. Вход будет произведен автоматически');
                document.location.href = '/';
            } catch (error) {
                alert('Произошла ошибка. Попробуйте войти вручную. Если не получилось, то зарегистрируйтесь заново')
            }
            
        }

    }
    return Auth;
});