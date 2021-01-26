import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'spiff-rate-counter',
    templateUrl: './rate-counter.component.html',
    styleUrls: ['./rate-counter.component.scss']
})
export class RateCounterComponent implements OnInit {
    @Input() likes = 0;
    @Input() dislikes = 0;
    @Input() liked = false;
    @Input() disliked = false;
    @Input() onLike: () => void;
    @Input() onDislike: () => void;

    ngOnInit(): void {
        if (this.onLike === undefined || this.onLike === null) throw new Error('RateCounterComponent: onLike handler was not provided');
        if (this.onDislike === undefined || this.onDislike === null) throw new Error('RateCounterComponent: onDislike handler was not provided');
    }
}
