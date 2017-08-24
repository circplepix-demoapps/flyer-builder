import { trigger, state, animate, style, transition, keyframes } from '@angular/core';

//slide from the right animation
export const slideFromRight =
   trigger('routerTransition', [
      transition(':enter', [
         style({ transform: 'translateX(100%)' }),
         animate('0.3s ease-in-out', style({ transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
         style({ transform: 'translateX(0%)' }),
         animate('0.3s ease-in-out', style({ transform: 'translateX(-100%)' }))
      ])
   ]);

//grow animate container
export const growAnimateContainer =
   trigger('growAnimate', [
      transition('* => *', animate(200, keyframes([
         style({ 'opacity': '0', 'transform': 'scale(0)' }),
         style({ 'opacity': '0', 'transform': 'scale(.1)' }),
         style({ 'opacity': '0.5', 'transform': 'scale(.4)' }),
         style({ 'opacity': '1', 'transform': 'scale(.6)' }),
         style({ 'opacity': '1', 'transform': 'scale(.7)' }),
         style({ 'opacity': '1', 'transform': 'scale(.8)' }),
         style({ 'opacity': '1', 'transform': 'scale(.9)' }),
         style({ 'opacity': '1', 'transform': 'scale(1)' })
      ])))
   ])
