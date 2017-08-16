import { Component, trigger, transition, style, animate, keyframes } from '@angular/core';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
   animations: [    
    trigger('fadeIn', [
      transition(':enter', [
        style({
          transition: 'opacity ease-in-out',
          opacity: 0
        }),
        animate('300ms 300ms', style({
          transition: 'opacity ease-in-out',
          opacity: 1
        }))
      ])
    ]),
    trigger('bounceInLeft', [
      transition(':enter', [
        style({
            'animation-timing-function': 'cubic-bezier(0.215, 0.610, 0.355, 1.000)',
            transition: 'opacity ease-in-out',
            transform: 'translate3d(-3000px, 0, 0)',
            opacity: 0
          }),
          animate('600ms', keyframes([
            style({opacity: 1, transform: 'translate3d(25px, 0, 0)', offset: 0.6}),
            style({transform: 'translate3d(-10px, 0, 0)', offset: 0.75}),
            style({transform: 'translate3d(5px, 0, 0)', offset: 0.9}),
            style({transform: 'none', offset: 1.0})
          ]))
      ])
    ]),
    trigger('lightSpeedIn', [
      transition(':enter', [
        style({
          transform: 'translate3d(100%, 0, 0) skewX(-30deg)',
          opacity: 0
        }),
        animate('600ms', keyframes([
          style({transform: 'skewX(20deg)', opacity: 1, offset: 0.6}),
          style({transform: 'skewX(-5deg)', offset: 0.8}),
          style({transform: 'none', offset: 1.0})
        ]))
      ]),
    ]),
    trigger('flip', [
      transition(':enter', [
        style({
          transform: 'perspective(400px) rotate3d(0, 1, 0, -360deg)',
          'animation-timing-function': 'ease-out'
        }),
        animate('800ms 1000ms', keyframes([
          style({transform: 'perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -190deg)',
                 'animation-timing-function': 'ease-out', offset: 0.4}),
          style({transform: 'perspective(400px) translate3d(0, 0, 150px) rotate3d(0, 1, 0, -170deg)',
                 'animation-timing-function': 'ease-out', offset: 0.5}),
          style({transform: 'perspective(400px) scale3d(.95, .95, .95)',
                 'animation-timing-function': 'ease-out', offset: 0.8}),
          style({transform: 'perspective(400px)', offset: 1.0})
        ]))
      ]),
    ]),
    trigger('rubberBand', [
      transition(':enter', [
        style({
          transform: 'scale3d(1, 1, 1)'
        }),
        animate('800ms 400ms', keyframes([
          style({transform: 'scale3d(1.25, 0.75, 1)', offset: 0.3}),
          style({transform: 'scale3d(0.75, 1.25, 1)', offset: 0.4}),
          style({transform: 'scale3d(1.15, 0.85, 1)', offset: 0.5}),
          style({transform: 'scale3d(.95, 1.05, 1)', offset: 0.65}),
          style({transform: 'scale3d(1.05, .95, 1)', offset: 0.75}),
          style({transform: 'scale3d(1, 1, 1)', offset: 1.0})
        ]))
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({
          transform: 'translate3d(25%, 0, 0)',
          opacity: 0
        }),
        animate('600ms 1200ms', style({
          transform: 'translate3d(0, 0, 0)',
          opacity: 1
        }))
      ]),
    ])
  ]
})
export class HomePage {
  /**
   * @description used to animate ion-content once view enters
   * 
   * @private
   * @type {boolean}
   * @memberof HomePage
   */
  private viewDidEnterAnimate: boolean = false;

  /**
   * @description used to animate elements within ion-content
   * 
   * @private
   * @type {boolean}
   * @memberof HomePage
   */
  private canAnimate: boolean = false;
  
  public goLinkedin() {
    window.location.href = 'http://www.linkedin.com/in/satully';
  }

  public goTwitter() {
    window.location.href = 'http://www.twitter.com/sarah_tullyyy';
  }

  public goGithub() {
    window.location.href = 'http://www.github.com/sarahtully';
  }

  ionViewDidEnter() {
    /** view did enter so we can now animate */
    this.viewDidEnterAnimate = true;
  }
  
  ionViewDidLoad() {
    this.canAnimate = false;

    setTimeout(() => {
      this.canAnimate = true;
    }, 3000);
  }

  constructor() {
    
  }
}
