import { Post } from 'spiff/app/api/interface/data-types';
import { Title } from '@angular/platform-browser';
import { PostService } from 'spiff/app/services/post.service';
import { Subscription } from 'rxjs';
import { DialogService } from 'spiff/app/services/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { ApiEndpointService } from 'spiff/app/api/services/api-endpoint.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'spiff-view-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
    id: string;
    posts: Post[];
    username: string;
    screenname: string;
    loadingPosts = true;
    postStream: Subscription;
    createdTimestamp: number;

    constructor(private title: Title,
                private post: PostService,
                public dialog: DialogService,
                private route: ActivatedRoute,
                private api: ApiEndpointService) {
        this.postStream = post.postEventStream.subscribe(() => this.refreshPosts());
    }

    ngOnDestroy(): void {
        this.postStream.unsubscribe();
    }

    ngOnInit(): void {
        this.route.params.subscribe(async params => {
            this.username = params.username;
            const userRequest = await this.api.getUser(this.username);
            if (userRequest.ok) {
                this.id = userRequest.user._id;
                this.screenname = userRequest.user.screenname;
                this.createdTimestamp = userRequest.user.created;
                this.refreshPosts();
                this.title.setTitle(`user ${this.username}`);
            } else {
                console.error('idk man');
            }
        });
    }

    async refreshPosts(): Promise<void> {
        const posts = await this.getPosts();
        this.posts = posts.sort((a, b) => {
            if (a.date < b.date) {
                return 1;
            } else if (b.date < a.date) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    async getPosts(): Promise<Post[]> {
        this.loadingPosts = true;
        const response = await this.post.getPostsByUserId(this.id);
        this.loadingPosts = false;
        return response;
    }

}
