define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class PopupViewPhoto extends Component {
        constructor(options){
            super(options);
            this.setState({
                numPhoto: this.options.numPhoto,
                photos: this.options.photos,
            });
        }
        
        getDefaultOptions() {
            return {
                numPhoto: '0',
                photos: [],
            };
        }

        render({photos}) {
            return `
                <div class="popup popup_view-photo">
                <div class="popup__background popup__background_left">
                    <div class="popup__navigation popup__navigation_back"><</div>
                </div>
                <div class="popup__background popup__background_right">
                    <div class="popup__navigation popup__navigation_next">></div>
                </div>
                <div class="popup__header">
                    <div class="popup__close"></div>
                </div>
                <div class="popup__content">
                    <a href="${photos[this.state.numPhoto] || ''}" target="_blank" class="popup__image">
                        <img src="${photos[this.state.numPhoto] || ''}" alt="Фотография" class="popup__img" />
                    </a>
                </div>
                <div class="popup__footer"></div>
            </div>`;
        }

        setSize() {
            const content = this.getContainer().querySelector('.popup__content');
            const img = this.getContainer().querySelector('.popup__img');

            //спасибо замыканиям за такие костыли :)
            const onLoad = () => {
                content.style.width = img.offsetWidth + 'px';
                content.style.height = img.offsetHeight + 'px';
                img.removeEventListener('onload', onLoad);
            }
            img.addEventListener('onload', onLoad)          
        }

        afterMount() {
            this._closeBtn = this.getContainer().querySelector('.popup__close');
            this.subscribeTo(this._closeBtn, 'click', this.close.bind(this));

            this._nextBtn = this.getContainer().querySelector('.popup__background_right');
            this.subscribeTo(this._nextBtn, 'click', this.nextPhoto.bind(this));

            this._prevBtn = this.getContainer().querySelector('.popup__background_left');
            this.subscribeTo(this._prevBtn, 'click', this.prevPhoto.bind(this));

            this.setSize();
        }

        close() {
            this.unmount();
        }

        nextPhoto(){
            this.setPhoto(+this.state.numPhoto + 1);
        }

        prevPhoto(){
            this.setPhoto(+this.state.numPhoto - 1);
        }

        setPhoto(position) {
            if(this.state.photos.length > 0) {
                if(position < 0){
                    position = this.state.photos.length - 1;
                }
                this.setState({
                    numPhoto: (+position % this.state.photos.length).toString(),
                });
            }
            this.update();
            this.setSize();
        }
    
    }
    return PopupViewPhoto;
});