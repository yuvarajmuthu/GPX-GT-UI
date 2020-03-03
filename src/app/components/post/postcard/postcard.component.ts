import {Component, OnInit, Input, isDevMode} from '@angular/core';
//import { formatDate } from "@angular/common";
import {PostService} from '../../../services/post.service';
import {UserService} from '../../../services/user.service';
import {DatashareService} from '../../../services/datashare.service';
import {Post} from '../../../models/post';

@Component({
    selector: 'app-postcard',
    templateUrl: './postcard.component.html',
    styleUrls: ['./postcard.component.css']
})

export class PostcardComponent implements OnInit {
    @Input() post: Post;
    commentPost: boolean = false;
    devMode: boolean = true;
    savePost: boolean = false;
    hidePost: boolean = false;
    reportPost: boolean = false;
    liked: boolean = false;
    name: any = '';
    icon: any = '';

    profileSmImage: any = 'assets/images/avatar1.png';
    isImageLoading: boolean = false;
    postImage: any = 'assets/images/avatar1.png';
    isPostImageLoading: boolean = false;
    entityId: string;

    constructor(private postService: PostService,
                private dataShareService: DatashareService,
                private userService: UserService) {
        this.devMode = isDevMode();

    }

    ngOnInit(): void {
        ////Get entity image
        if (this.post.postType) {
            if (this.post.postType.indexOf('V') !== -1) {
                this.post['containsVideo'] = true;
            }
            if (this.post.postType.indexOf('I') !== -1) {
                this.post['containsImage'] = true;
                if (!this.devMode) {
                    this.getPostImage(this.post['relatedFiles'][0]);
                }
                //TODO
                //Get image
            }
            if (this.post.postType.indexOf('T') !== -1) {
                this.post['containsText'] = true;
            }
        }
        this.entityId = this.dataShareService.getLoggedinUsername();

        if (!this.devMode) {
            this.getProfileSmImage(this.entityId);
        }
    }

    save(val) {
        console.log(val);
        this.savePost = true;
        this.hidePost = false;
        this.reportPost = false;
        this.name = val;
        this.icon = 'fa fa-floppy-o';
    }

    like(event) {
        let check = event.target.classList.contains('post-active');
        if (check === true) {
            event.target.classList.remove('post-active');
            /*this.liked = false;
            this.savePost = false;
            this.hidePost = false;
            this.reportPost = false;*/
        } else {
            event.target.classList.add('post-active');
            /*this.liked = true;
            this.savePost = false;
            this.hidePost = false;
            this.reportPost = false;*/
        }
    }

    hide(val) {
        console.log(val);
        this.savePost = false;
        this.hidePost = true;
        this.reportPost = false;
        this.name = val;
        this.icon = 'fa fa-eye-slash';
    }

    report(val) {
        console.log(val);
        this.savePost = false;
        this.hidePost = false;
        this.reportPost = true;
        this.name = val;
        this.icon = 'fa fa-exclamation-triangle';
    }


    postEvent(): void {
        this.commentPost = false;
    }

    comment(): void {
        this.commentPost = true;
        //child hideInput set to false
        console.log('this.commentPost ' + this.commentPost);
    }

    likePost(): void {
        console.log('Liked the post ' + this.post.id);
        console.log('userid ' + this.dataShareService.getCurrentUserId());
        this.post.likedByCurrentUser = true;
        console.log('this.post.likedByCurrentUser ' + this.post.likedByCurrentUser);
    }

    loadMoreComments(id: string) {
        console.log('Loading More Post Comments for ', id);
        return false;
    }

    getProfileSmImage(userId: string) {
        this.isImageLoading = true;
        this.userService.getImage(userId).subscribe(data => {
            this.createImageFromBlob(data);
            this.isImageLoading = false;
        }, error => {
            this.isImageLoading = false;
            console.log(error);
        });
    }

    createImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            this.profileSmImage = reader.result;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    getPostImage(imageId: string) {
        this.isPostImageLoading = true;
        this.postService.getImage(imageId).subscribe(data => {
            this.createPostImageFromBlob(data);
            this.isPostImageLoading = false;
        }, error => {
            this.isPostImageLoading = false;
            console.log(error);
        });
    }

    createPostImageFromBlob(image: Blob) {
        let reader = new FileReader();
        reader.addEventListener('load', () => {
            this.postImage = reader.result;
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }
}
