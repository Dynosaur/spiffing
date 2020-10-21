import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAccountService } from 'src/app/services/user-account/user-account.service';
import { Post } from '../../../services/post/post-status';
import { PostService } from '@spiffing/services/post/post.service';
import { Subscription } from 'rxjs';
import { ApiEndpointService } from '@spiffing/api/services/endpoint/api-endpoint.service';
import { DialogService } from '../../../services/dialog';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

    username: string;
    screenName: string;
    createdTimestamp: number;
    posts: Post[];

    loadingPosts = true;

    postStream: Subscription;

    constructor(private user: UserAccountService,
                private post: PostService,
                private route: ActivatedRoute,
                private api: ApiEndpointService,
                public dialog: DialogService) {
        this.postStream = post.postEventStream.subscribe(() => this.refreshPosts());
    }

    public ngOnDestroy(): void {
        this.postStream.unsubscribe();
    }

    public ngOnInit(): void {
        this.route.params.subscribe(async params => {
            this.username = params.username;
            this.refreshPosts();
            const userDataReq = await this.api.getUser(this.username);
            switch (userDataReq.status) {
                case 'OK':
                    this.screenName = userDataReq.data.screenName;
                    this.createdTimestamp = userDataReq.data.created;
                    break;
                case 'NO_RESULTS':
                    throw new Error('Unexpected NO_RESULTS status from API.');
            }
        });
    }

    public async refreshPosts(): Promise<void> {
        this.posts = await this.getPosts();
    }

    /*
        TODO: Fix that if (response.count) to just take the response.posts (Requires reworking PostService)
    */
    public async getPosts(): Promise<Post[]> {
        this.loadingPosts = true;
        const response = await this.post.getPostsByUser(this.username);
        this.loadingPosts = false;
        if (response.count) {
            return response.posts;
        } else {
            return [];
        }

    }

    clickPost(id: string): void {
        console.log(id);
    }

}
