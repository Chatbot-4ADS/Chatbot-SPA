import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
    transition('AboutPage => ChatbotPage', [
        style({
            position: 'relative',
            overflow: 'hidden'
        }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            })
        ]),
        query(':enter', [
            style({ left: '100%' })
        ]),
        query(':leave', animateChild()),
        group([
            query(':leave', [
                animate('400ms ease-out', style({ left: '100%' }))
            ]),
            query(':enter', [
                animate('400ms ease-out', style({ left: '0%' }))
            ])
        ]),
        query(':enter', animateChild()),
    ]),
    transition('ChatbotPage => AboutPage', [
        style({
            position: 'relative',
            overflow: 'hidden'
        }),
        query(':enter, :leave', [
            style({
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden'
            })
        ]),
        query(':enter', [
            style({ left: '-100%' })
        ]),
        query(':leave', animateChild()),
        group([
            query(':leave', [
                animate('400ms ease-out', style({ left: '100%' }))
            ]),
            query(':enter', [
                animate('400ms ease-out', style({ left: '0%' }))
            ])
        ]),
        query(':enter', animateChild()),
    ])
]);
