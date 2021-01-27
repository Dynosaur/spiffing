import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'spiff/app/api/interface';

@Component({
    selector: 'spiff-rate-counter',
    templateUrl: './rate-counter.component.html',
    styleUrls: ['./rate-counter.component.scss']
})
export class RateCounterComponent implements OnInit {
    @Input() post: Post;
    @Input() liked = false;
    @Input() disliked = false;
    @Output() like = new EventEmitter<Post>();
    @Output() dislike = new EventEmitter<Post>();

    ngOnInit(): void {
        if (this.post === undefined || this.post === null) throw new Error('RateCounterComponent: post was not provided');
    }
}
