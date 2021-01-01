import { Component } from '@angular/core';
import { PostService } from 'spiff/app/services/post.service';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'spiff-create-post-dialog',
    templateUrl: './create-post-dialog.component.html',
    styleUrls: ['./create-post-dialog.component.scss']
})
export class CreatePostDialogComponent {
    public isPosting: boolean;
    public errorMessage: string;
    public postTitle = new FormControl('', [Validators.required]);
    public postContent = new FormControl('', [Validators.required]);

    constructor(private dialog: MatDialogRef<CreatePostDialogComponent>, private post: PostService) { }

    public async createPost(): Promise<void> {
        this.errorMessage = null;
        this.isPosting = true;
        const createPostResult = await this.post.createPost(this.postTitle.value, this.postContent.value);
        this.isPosting = false;
        if (createPostResult) {
            this.errorMessage = createPostResult;
        } else {
            this.dialog.close();
        }
    }

}
