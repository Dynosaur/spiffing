import { Component } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { PostService } from '@spiffing/services/post/post.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-create-post-dialog',
    templateUrl: './create-post-dialog.component.html',
    styleUrls: ['./create-post-dialog.component.scss']
})
export class CreatePostDialogComponent {

    public postTitle = new FormControl('', [Validators.required]);
    public postContent = new FormControl('', [Validators.required]);

    public errorMessage: string;
    public isPosting: boolean;

    constructor(private dialog: MatDialogRef<CreatePostDialogComponent>, private post: PostService) { }

    public async createPost(): Promise<void> {
        this.errorMessage = null;

        this.isPosting = true;
        const res = await this.post.createPost(this.postTitle.value, this.postContent.value);
        this.isPosting = false;
        if (res.success) {
            this.dialog.close();
        } else {
            this.errorMessage = res.message;
        }
    }

}
