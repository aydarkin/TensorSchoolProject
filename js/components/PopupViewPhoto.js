define(['js/components/Base/Component.js'], function(Component) {
    'use strict';
    class PopupViewPhoto extends Component {
        constructor(options){
            super(options);
            this.setState({
                numPhoto: '0',
                photos: this.options.photos || [],
            });
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

        afterMount() {
            this._closeBtn = this.getContainer().querySelector('.popup__close');
            subscribeTo(this._closeBtn, 'click', this.close.bind(this));

            this._nextBtn = this.getContainer().querySelector('.popup__navigation_next');
            subscribeTo(this._nextBtn, 'click', this.nextPhoto.bind(this));

            this._prevBtn = this.getContainer().querySelector('.popup__navigation_back');
            subscribeTo(this._prevBtn, 'click', this.prevPhoto.bind(this));
        }

        close() {
            this.unmount();
        }

        nextPhoto(){
            setPhoto(this.state.numPhoto + 1);
        }

        prevPhoto(){
            setPhoto(this.state.numPhoto - 1);
        }

        setPhoto(position) {
            if(photos.length > 0) {
                this.setState({
                    numPhoto: (position % photos.length).toString(),
                });
            }
            this.update();
        }
    
    }
    return PopupViewPhoto;
});