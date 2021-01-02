import { Post } from 'spiff/app/api/interface';
import { Component, OnInit } from '@angular/core';
import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';

@Component({
    selector: 'spiff-view-post-dialog',
    templateUrl: './view-post-dialog.component.html',
    styleUrls: ['./view-post-dialog.component.scss']
})
export class ViewPostDialogComponent implements OnInit {
    post: Post;
    postId: string;

    constructor(private api: ApiEndpointService) { }

    async ngOnInit(): Promise<void> {
        const postRequest = await this.api.getPost(this.postId);
        if (postRequest.ok) this.post = postRequest.post;
        else throw new Error('idk error');
    }

}
