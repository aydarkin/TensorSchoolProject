define([
    'js/components/Base/Component.js', 
], function(Component) {
    'use strict';
    class Auth extends Component{
        render() {
            return `
            <div class="content__block auth">
                <div class="auth__title">Авторизация</div>
                <form class="auth__content">
                    <label for="login" class="auth__label">Логин</label>
                    <input type="text" name="login" class="auth__login" required>
                    <label for="password" class="auth__label">Пароль</label>
                    <input type="password" name="password" class="auth__password" required>
                    <div class="auth__buttons">
                        <button class="auth__sign-in">Вход</button>
                        <button class="auth__sign-up">Регистрация</button>
                    </div>
                </form>
            </div>`;
        }

        afterMount() {
            this.signIn = this.getContainer().querySelector('.auth__sign-in');
            this.subscribeTo(this.signIn, 'click', this.authentication.bind(this));

            this.signUp = this.getContainer().querySelector('.auth__sign-up');
            this.subscribeTo(this.signUp, 'click', this.registration.bind(this));
        }

        authentication(event) {
            event.preventDefault();
            
            const form = factory.create(FormData, this.getContainer().querySelector('.auth__content'));
            fetch(this.options.domain + '/user/login', {
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

        registration() {
            event.preventDefault();
            
            const form = factory.create(FormData, this.getContainer().querySelector('.auth__content'));
            fetch(this.options.domain + '/user/create', {
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
                alert('Регистрация прошла успешно. Вход будет произведен автоматически');
                document.location.href = '/';
            });
        }

    }
    return Auth;
});