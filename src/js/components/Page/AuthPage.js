define([
    'js/components/Base/Component.js', 
    'js/components/Auth.js',
], function(Component, Auth) {
    'use strict';
    class AuthPage extends Component {
        constructor(options) {
            super(options);
            document.title = 'Вход';
        }

        render() {
            return `
            <div class="wrapper">
                <main class="content content_auth">
                    ${this.childrens.create(Auth, {})}
                </main>
            </div>`;
        }

    }
    return AuthPage;
});