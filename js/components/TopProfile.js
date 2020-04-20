define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class TopProfile extends Component{
        render({idPerson, name, photo}) {
            return `
                <div class="top-profile">
                    <div class="top-profile__name">${name}</div>
                    <img src="${photo}" alt="Маленькое фото" class="top-profile__img top-profile__img_round"/>
                    <nav class="top-profile__menu">⋮
                        ${''/* Тут будет меню выпадающее */}
                    </nav>
                </div>`;
        }

        getDefaultOptions() {
            return {
                photo: '/img/ui/empty_photo.png',
            }
        }
    }
    return TopProfile;
});