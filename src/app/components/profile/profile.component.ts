import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserAccountService } from 'src/app/services/user-account/user-account.service';
import { Post } from '../../services/post/post-status';
import { PostService } from '@spiffing/services/post/post.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

    public username: string;
    public screenName: string;
    public posts: Post[];

    public loadingPosts = true;

    private postStream: Subscription;

    constructor(private user: UserAccountService, private post: PostService, private route: ActivatedRoute) {
        this.postStream = post.postEventStream.subscribe(() => this.refreshPosts());
    }

    public ngOnDestroy(): void {
        this.postStream.unsubscribe();
    }

    public ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.username = params.username;
            console.log(params);
            this.refreshPosts();
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

}
