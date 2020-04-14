import {Component, OnInit, Input, isDevMode, Output, EventEmitter} from '@angular/core';
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
    @Input() comments : boolean;

    commentPost: boolean = false;
    devMode: boolean = true;
    savePost: boolean = false;
    commandModeEnable: boolean = false;
    hidePost: boolean = false;
    reportPost: boolean = false;
    liked: boolean = false;
    name: any = '';
    icon: any = '';
    public showCommentInput:boolean = false;
    public buttonName:any = 'Show';

    textComment:string;
    postFormData: FormData;


    profileSmImage: any = 'assets/images/avatar1.png';
    isImageLoading: boolean = false;
    postImage: any = 'assets/images/avatar1.png';
    isPostImageLoading: boolean = false;
    entityId: string;
    numbers: number[] = [];
    todayDate : Date = new Date();

    constructor(private postService: PostService,
                private dataShareService: DatashareService,
                private userService: UserService) {
        for (let index = 0; index < 10000; index++) {
            this.numbers.push(index);
        }
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

    like(event:any) {
        let entityId = this.dataShareService.getLoggedinUsername();
        if(this.post.likedBy.indexOf(entityId) == -1){
            let check = event.target.classList.contains('post-active');
            this.postService.postLike(entityId)
            .subscribe((data:any) => {
                event.target.classList.add('post-active');
                this.post.likedBy.push(entityId);
            });
        }
        
    }

    toggleCommentInput() {
        this.showCommentInput = !this.showCommentInput;

        // CHANGE THE NAME OF THE BUTTON.
        if(this.showCommentInput)
            this.buttonName = "Hide";
        else
            this.buttonName = "Show";
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
        console.log("posting new message");
        this.commentPost = false;
    }


    postComment() {
      
        // this.post.entityId = this.dataShareService.getLoggedinUsername();
        // this.post.postText = this.textComment;
        // this.postFormData = new FormData();
      //  this.postFormData.append('post', JSON.stringify(this.post));
      console.log(this.post);

         this.postService.postComment()
             .subscribe((data:any) => {
                 console.log(data);
                 this.toggleCommentInput();
                 if(this.post.comments){
                    this.post.comments.unshift(data);
                 }
                 else{
                     console.log("else")
                     this.post.comments = [];
                     this.post.comments.push(data);
                 }

             });
   }

   loadMoreComments(id: string) {
    this.postService.postComment()
    .subscribe((data:any) => {
        console.log(data);
            this.post.comments.push(data);

    });
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
