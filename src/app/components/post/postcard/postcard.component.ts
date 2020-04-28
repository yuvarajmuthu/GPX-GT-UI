import {Component, OnInit, Input, isDevMode, Output, EventEmitter, ViewEncapsulation, ElementRef} from '@angular/core';
//import { formatDate } from "@angular/common";
import { Router } from "@angular/router";
import {PostService} from '../../../services/post.service';
import {UserService} from '../../../services/user.service';
import {DatashareService} from '../../../services/datashare.service';
import {Post} from '../../../models/post';

import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-postcard',
    templateUrl: './postcard.component.html',
    styleUrls: ['./postcard.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class PostcardComponent implements OnInit {
    @Input() post: Post;
    @Input() idx: string;
    @Input() isComment : boolean;
    comment:Post = new Post();
    comments: Post[];
    txtPost: string = '';

    commentPost: boolean = false;
    devMode: boolean = true;
    savePost: boolean = false;
    commandModeEnable: boolean = false;
    hidePost: boolean = false;
    reportPost: boolean = false;
    liked: boolean = false;
    name: any = '';
    icon: any = '';
    stagingImage: any = null;
    public showCommentInput:boolean = false;
    public buttonName:any = 'Show';

    textComment:string;
    postFormData: FormData;
    isFileSizeError: boolean =false;

    profileSmImage: any = 'assets/images/avatar1.png';
    isImageLoading: boolean = false;
    postImage: any = 'assets/images/avatar1.png';
    isPostImageLoading: boolean = false;
    entityId: string;
    numbers: number[] = [];
    todayDate : Date = new Date();
    postText : any;

    items: any;
    mentionConfig:any;

    constructor(private postService: PostService,
                private dataShareService: DatashareService,
                private userService: UserService,
                private elementRef: ElementRef,
                private sanitizer: DomSanitizer,
                private router: Router) {
        for (let index = 0; index < 10000; index++) {
            this.numbers.push(index);
        }
        this.devMode = isDevMode();

        this.items =[];
        this.mentionConfig={items:this.items, labelKey:'username',mentionSelect: this.onMentionSelect, insertHTML:true, disableSearch: false};


        // var element = document.getElementById('user');
        // if(document.getElementById("user")){
        //     element.onclick = function() {
        //         console.log("test");
        //     }
        // }



    }

    onMentionSelect(item) {

        let btn:HTMLElement;
        btn = document.createElement("SPAN");   // Create a <button> element
        let inputDiv = document.getElementById("commentContent"); 
        let innertmlHtml = inputDiv.innerHTML;
        var n = innertmlHtml.indexOf("@");
        console.log(innertmlHtml);
        var length = innertmlHtml.length;
        var tmp = innertmlHtml.slice(0, n);
        btn.innerHTML = item.username+"&nbsp;";       
        inputDiv.innerHTML = tmp;
        btn.setAttribute('class', 'tagged-users');   
        btn.setAttribute('data-username', item.username);
        btn.setAttribute('data-entityType', item.type);

        var btn1 = document.createElement("SPAN");        // Insert text
        btn1.innerHTML = '&nbsp;';    
        inputDiv.appendChild(btn);
        inputDiv.appendChild(btn1);
        this.items = [];
        console.log(btn);
 //return btn;
      }


    ngOnInit(): void {
        //this.getUsers();
        ////Get entity image
        if (this.post.postType) {
            this.postText = this.sanitizer.bypassSecurityTrustHtml(this.post.postText);
           // this.post.postText = postText;
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

        this.resetForm();
    }

    
getUsers(e){

    var input;
    input = document.getElementById("commentContent");
    console.log(input.innerText);
    console.log(e);
    let textUser= input.innerText;
    if(textUser.indexOf("@") >= 0){
        let tmpPos = textUser.split("@");
        console.log(tmpPos);
      
        if(tmpPos[1].length >= 1){


    this.postService.getTagUsers()
    .subscribe((data:any) => {
        this.items = data;
        this.mentionConfig={items:this.items, labelKey:'username',mentionSelect: this.onMentionSelect, insertHTML:true, disableSearch: false};
    });
}}
}

    tagUsersRedirectTo(e){
        console.log(e.target.tagName);
        if(e.type == 'click' && e.target.tagName == 'SPAN'){
            let entityType = e.target.getAttribute("data-entityType");
            let routePath: string = '/'+entityType+'/';
            if(entityType == 'legislator')
                routePath= '/searchLegislator';
            else if(entityType == 'district')
                routePath= '/group';
    
            this.router.navigate([routePath]);
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

    deleteAttachedFile(e) {
        this.postFormData = new FormData();
        this.stagingImage = '';
    }

    onFileSelected(event) {
        if (event.target.files && event.target.files[0]) {
            let filesizeMB = event.target.files[0].size/1024/1024;
            let fileType = event.target.files[0].type;
            if(filesizeMB <= 2.0 && (fileType == 'image/gif' || fileType == 'image/jpeg' || fileType == 'image/jpg' || fileType == 'image/png')){
                this.isFileSizeError = false;
                let reader = new FileReader();
                this.postFormData.append('file', event.target.files[0]);
                reader.readAsDataURL(event.target.files[0]); // read file as data url
          
                reader.onload = (event) => { // called once readAsDataURL is completed
                  this.stagingImage = event.target['result'];                
            }
            }
            else{
                this.isFileSizeError = true;
            }
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
        this.savePost = false;
        this.hidePost = true;
        this.reportPost = false;
        this.name = val;
        this.icon = 'fa fa-eye-slash';
    }

    report(val) {
        this.savePost = false;
        this.hidePost = false;
        this.reportPost = true;
        this.name = val;
        this.icon = 'fa fa-exclamation-triangle';
    }

    resetForm() {
        this.txtPost = '';
        this.stagingImage = '';
        this.comment = {} as Post;
        this.postFormData = new FormData();
    }

    postEvent(): void {
        console.log("posting new message");
        this.commentPost = false;
    }

    getLoggedUsername():string{
        let loggedUser:string= '';



        if (this.dataShareService.getCurrentUser() && this.dataShareService.getCurrentUser().username) {
            loggedUser = this.dataShareService.getCurrentUser().username;
        }

        return loggedUser;

    }
    postComment() {
        let input = document.getElementById("commentContent");
        this.txtPost = input.innerHTML.replace(/"/g, "'");

        this.comment.entityId = this.dataShareService.getLoggedinUsername();
        this.comment.postText = this.txtPost; 

        console.log('Submitting Comment text ', this.txtPost);
        this.comment.parentPostId = this.post.id;
        this.postFormData.append('post', JSON.stringify(this.comment));
        this.postService.postComment(this.postFormData)
            .subscribe((data:any) => {
              this.resetForm();
              //this.newpost.emit(data);
            });
        


/*
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
             */
   }

   getComments(){
    this.comments = null; 
   }

   loadMoreComments(id: string) {
    this.postService.postComment(this.postFormData)
    .subscribe((data:any) => {
        console.log(data);
            this.post.comments.push(data);

    });
   }
/*
    comment(): void {
        this.commentPost = true;
        //child hideInput set to false
        console.log('this.commentPost ' + this.commentPost);
    }
*/
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
