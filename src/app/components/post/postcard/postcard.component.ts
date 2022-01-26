import {Component, OnInit, Input, isDevMode, Output, EventEmitter, ViewEncapsulation, ElementRef} from '@angular/core';
import { Router } from "@angular/router";
import {PostService} from '../../../services/post.service';
import {UserService} from '../../../services/user.service';
import {DatashareService} from '../../../services/datashare.service';
import {Post} from '../../../models/post';
import { Observable, of, from, throwError} from 'rxjs';

import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import 'rxjs/Rx';

import {DomSanitizer} from "@angular/platform-browser";
import { tagUser } from 'src/app/models/tagusers';
export interface AutoCompleteModel {
    value: any;
    display: string;
 }
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
    @Input() selfActivities:boolean;
    comment:Post = new Post();
    comments: Post[]=[];
    txtPost: string = '';
    nxtNode:any;
    oldChildNodes: any;
    deletedNodePos:number;
    isvideoSelected : boolean = false;



    shareUsers:any = [];
    selectedUsers:any=[];
    
    public requestAutocompleteItems = (text: any): Observable<any> => {
           return Observable.of(this.selectedUsers);
      };

    commentPost: boolean = false;
    devMode: boolean = false;
    savePost: boolean = false;
    commandModeEnable: boolean = false;
    hidePost: boolean = false;
    reportPost: boolean = false;
    liked: boolean = false;
    likeButtonCss:string = "col card-link post-footer-btn text-center";
    loadMore:boolean = false;
    likedCount:number = 0;
    commentsCount:number = 0;
    pageNumber:number = 0;
    name: any = '';
    icon: any = '';
    stagingImage: any = null;
    public showCommentInput:boolean = false;
    //public buttonName:any = 'Show';

    textComment:string;
    postFormData: FormData;
    isFileSizeError: boolean =false;

    profileSmImage: any = 'assets/images/temp/user-avatar.jpg';//'assets/images/avatar1.png';
    isImageLoading: boolean = false;
    postImage: any = 'assets/images/user-banner2.jpg';//'assets/images/avatar1.png';
    isPostImageLoading: boolean = false;
    entityId: string;
    numbers: number[] = [];
    todayDate : Date = new Date();
    postText : any;

    items: any;
    mentionConfig:any;
    isActive:boolean = false;

    constructor(private postService: PostService,
                private dataShareService: DatashareService,
                private userService: UserService,
                private elementRef: ElementRef,
                private sanitizer: DomSanitizer,
                private http:HttpClient,
                private router: Router) {
        for (let index = 0; index < 10000; index++) {
            this.numbers.push(index);
        }
        this.devMode = isDevMode();
         const that =this;
        this.items =[];
        this.mentionConfig={items:this.items, labelKey:'username',mentionSelect: this.onMentionSelect, insertHTML:true, disableSearch: false};

    }


    getCaretPosition() {
        let editableDiv = document.getElementById("commentContent");
      var caretPos = 0,
        sel, range;
      if (window.getSelection) {
        sel = window.getSelection();
        this.oldChildNodes = editableDiv.childNodes;
        if (sel.rangeCount) {
            let ranges = [];
            for(let i = 0; i < sel.rangeCount; i++) {
                ranges[i] = sel.getRangeAt(i);
                this.nxtNode = ranges[i].endContainer.parentNode;
             //   editableDiv.removeChild(ranges[i].endContainer.parentNode);
               }
               for(let j = 0; j <= this.oldChildNodes.length; j++) {
                 //console.log(this.oldChildNodes[j]);
                 if(this.oldChildNodes[j] == this.nxtNode){
                   this.deletedNodePos = j
                   editableDiv.removeChild(this.nxtNode);
                 }
               }
          range = sel.getRangeAt(0);
          if (range.commonAncestorContainer.parentNode == editableDiv) {
            caretPos = range.endOffset;
          }
        }
      }
      // else if (document.selection && document.selection.createRange) {
      //   range = document.selection.createRange();
      //   if (range.parentElement() == editableDiv) {
      //     var tempEl = document.createElement("span");
      //     editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      //     var tempRange = range.duplicate();
      //     tempRange.moveToElementText(tempEl);
      //     tempRange.setEndPoint("EndToEnd", range);
      //     caretPos = tempRange.text.length;
      //   }
      // }
      return caretPos;
    }

    onMentionSelect(item) {
        let editableDiv = document.getElementById("commentContent");
        var caretPos = 0,
          sel, range;
        if (window.getSelection) {
          sel = window.getSelection();
          console.log(sel);
          if (sel.rangeCount) {
              let ranges = [];
   
                  let btn:HTMLElement;
                  btn = document.createElement("SPAN");   // Create a <button> element
                  let inputDiv = document.getElementById("commentContent"); 
                  let innertmlHtml = inputDiv.innerHTML;
                  var n = innertmlHtml.indexOf("@");
  
                    var length = innertmlHtml.length;
                    var patt = new RegExp("/\s@\w*/i");
                    innertmlHtml = innertmlHtml.replace('&nbsp;', ' ');
                    var tmp = innertmlHtml.replace(/\s@\w*/i, ' ');
                    btn.innerHTML = item.firstName+" "+item.lastName;       
                   // inputDiv.innerHTML = tmp;
                    btn.setAttribute('class', 'tagged-users');   
                    btn.setAttribute('data-username', item.username);
                    btn.setAttribute('data-entityType', item.userType);
                    btn.setAttribute('readonly', 'true');
                    btn.setAttribute('contenteditable', 'false');
                    btn.setAttribute('value', item.firstName+" "+item.lastName);
               //   }
  
  
  
          
                  var btn1 = document.createElement("SPAN");        // Insert text
                  btn1.innerHTML = '&nbsp;';
                  inputDiv.innerHTML = tmp;   
                  innertmlHtml = inputDiv.innerHTML;
                  inputDiv.appendChild(btn);
                  innertmlHtml = inputDiv.innerHTML;
                  inputDiv.appendChild(btn1);
                  this.items = [];
  
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editableDiv) {
              caretPos = range.endOffset;
            }
          }
        }
      var el = document.getElementById("commentContent");
      console.log(el);
      var range1 = document.createRange();
      var sel1 = window.getSelection();
      console.log(el.childNodes.length);
      var tmpLength = Number(el.childNodes.length-1);
      range1.setStart(el.childNodes[tmpLength], 1);
      range1.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range1);
      el.focus();
  }
  
    
    // onMentionSelect(item) {
    //       let editableDiv = document.getElementById("commentContent");
    //       var caretPos = 0,
    //         sel, range;
    //       if (window.getSelection) {
    //         sel = window.getSelection();
    //         console.log(sel);
    //         if (sel.rangeCount) {
    //             let ranges = [];
    //                 let btn:HTMLElement;
    //                 btn = document.createElement("SPAN");   // Create a <button> element
    //                 let inputDiv = document.getElementById("commentContent"); 
    //                 let innertmlHtml = inputDiv.innerHTML;
    //                 var n = innertmlHtml.indexOf("@");
    //                 console.log(innertmlHtml);
    //                 var length = innertmlHtml.length;
    //                 var tmp = innertmlHtml.slice(0, n);
    //                 btn.innerHTML = item.firstName+" "+item.lastName+"&nbsp;";       
    //                 inputDiv.innerHTML = tmp;
    //                 btn.setAttribute('class', 'tagged-users');   
    //                 btn.setAttribute('data-username', item.username);
    //                 btn.setAttribute('data-entityType', item.userType);
    //                 btn.setAttribute('readonly', 'true');
            
    //                 var btn1 = document.createElement("SPAN");        // Insert text
    //                 btn1.innerHTML = '&nbsp;';    
    //                 inputDiv.appendChild(btn);
    //                 inputDiv.appendChild(btn1);
    //                 this.items = [];
    //                 console.log(btn);
    
    //             //   }
    //           range = sel.getRangeAt(0);
    //           if (range.commonAncestorContainer.parentNode == editableDiv) {
    //             caretPos = range.endOffset;
    //           }
    //         }
    //       }
      
    //     var el = document.getElementById("commentContent");
    //     var range1 = document.createRange();
    //     var sel1 = window.getSelection();
    //     var tmpLength = Number(el.childNodes.length-1);
    //     range1.setStart(el.childNodes[tmpLength], 1);
    //     range1.collapse(true);
    //     sel.removeAllRanges();
    //     sel.addRange(range1);
    //     el.focus();
    // }
    


    ngOnInit(): void {
        this.entityId = this.dataShareService.getLoggedinUsername();

        if (this.post && this.post.postType) {
            this.postText = this.sanitizer.bypassSecurityTrustHtml(this.post.postText);
            if (this.post.postType.indexOf('V') !== -1) {
                this.post['containsVideo'] = true;
            }

            //Get image
            if (this.post.postType.indexOf('I') !== -1) {
                this.post['containsImage'] = true;
                if (!this.devMode && this.post['relatedFiles']) {
                    this.getPostImage(this.post['relatedFiles'][0]);
                }

            }
            if (this.post.postType.indexOf('T') !== -1) {
                this.post['containsText'] = true;
            }
        }

        //Get posted entity image
        if (!this.devMode && this.post.entityId) {
            this.getProfileSmImage(this.post.entityId);
        }

        //LIKE count
        if(this.post.likedBy){
            this.likedCount = this.post.likedBy.length
        }

        //check if logged in user LIKED the Post
        if(this.entityId && this.post.likedBy && this.post.likedBy.indexOf(this.entityId) != -1){
            this.liked = true;    
            this.likeButtonCss = "col card-link post-footer-btn text-center post-active";
        }
        
        //COMMENT count
        this.getCommentsCount();
        
        this.resetForm();
    }

    
    getUsers(e){
        if(e.keyCode == 8 && e.key == "Backspace") {
            let caretPos = this.getCaretPosition();
            var tmpinput = document.getElementById("commentContent");
            let test = tmpinput.innerText;
            var range = window.getSelection().rangeCount;
            var startNode = tmpinput.firstChild;
           // if(tmpinput === range.commonAncestorContainer && range.endOffset === 0) {
            var lastReadOnlyChild = document.querySelector('span[readonly]');
            //tmpinput.removeChild(lastReadOnlyChild);
           // }
        }
    
        var input;
        input = document.getElementById("commentContent");
        let textUser= input.innerText;
        if(textUser.indexOf("@") >= 0){
            let tmpPos = textUser.split("@");
            if(tmpPos[1].length >= 1){
              this.postService.getTagUsers(tmpPos[1])
              .subscribe((data:any) => {
                  this.items = data;
                  this.mentionConfig={items:this.items, labelKey:'username',mentionSelect: this.onMentionSelect, insertHTML:true, disableSearch: false};
              });
           }
        }
    }
    searchShareUser(event){
        this.postService.getTagUsers(event.target.value)
        .subscribe((data:any) => {
                this.selectedUsers = data;
        });
    }

    shareToUsers(){
      console.log(this.shareUsers)
    }   
    
 
    tagUsersRedirectTo(e){
        console.log(e.target.tagName);
        if(e.type == 'click' && e.target.tagName == 'SPAN'){
            let entityType = e.target.getAttribute("data-entityType");
            let routePath: string = '/'+entityType+'/';
            if(entityType == 'legislator')
                routePath= '/searchLegislator';
            else if(entityType == 'district')
                //routePath= '/group';
    
            this.router.navigate([routePath]);
        }

    }

    handleSelection(event) {
        let inputDiv = document.getElementById("commentContent"); 
        let innertmlHtml = inputDiv.innerHTML+event.char;
        inputDiv.innerHTML = innertmlHtml;
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
        
        if(!this.liked){    
            let entityId = this.dataShareService.getLoggedinUsername();
            this.postService.postLike(this.post.id, entityId)
            .subscribe((data:any) => {

                //let postResponse = data;
                this.liked = data['liked'];
                this.likeButtonCss = "col card-link post-footer-btn text-center post-active";
                if(data['likedBy']){
                    this.likedCount = data['likedBy'].length
                }    

            });
        }
        
//        this.likeButtonCss = "col card-link post-footer-btn text-center post-active";
        


    }

    onClick() {
        this.isActive = !this.isActive;
      }  

    deleteAttachedFile(e) {
        this.postFormData = new FormData();
        this.stagingImage = '';
    }
    deleteVideoFile(e) {
        this.postFormData = new FormData();
        //document.querySelector("video").src = '';
        this.isvideoSelected = false;
      }

    onvideoSelected(event) {
        console.log(event.target.files);
        //  if (event.target.files && event.target.files[0]) {
              let filesizeMB = event.target.files[0].size/1024/1024;
              let fileType = event.target.files[0].type;
              //if(filesizeMB <= 2.0 && (fileType == 'image/gif' || fileType == 'image/jpeg' || fileType == 'image/jpg' || fileType == 'image/png')){
                  this.isFileSizeError = false;
                  let reader = new FileReader();
                  this.postFormData.append('videofile', event.target.files[0]);
                  reader.readAsDataURL(event.target.files[0]); // read file as data url
                  this.isvideoSelected = true;
                  let blobURL = URL.createObjectURL(event.target.files[0]);
                  reader.onload = (event) => { // called once readAsDataURL is completed
                  //  this.isvideoSelected = true;
                    document.querySelector("video").src = blobURL;              
              }
              // }
              // else{
              //     this.isFileSizeError = true;
              //     this.isvideoSelected = false;
              // }
           // }
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

    //SHOW and LOAD/HIDE Comments
    toggleCommentInput() {
        this.showCommentInput = !this.showCommentInput;

        // CHANGE THE NAME OF THE BUTTON.
        if(this.showCommentInput){
            //this.buttonName = "Hide";
            this.getComments(this.post.id, this.pageNumber);
        }
        //else
            //this.buttonName = "Show";
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

    //Used to Submit both Post and Comment
    postComment() {
        let input = document.getElementById("commentContent");
        this.txtPost = input.innerHTML.replace(/"/g, "'");

        this.comment.entityId = this.dataShareService.getLoggedinUsername();
        this.comment.postText = this.txtPost; 

        this.comment.parentPostId = this.post.id;
        console.log('Submitting Comment ', this.comment, JSON.stringify(this.comment));

        if(!this.postFormData){
            this.postFormData = new FormData();
        }

        this.postFormData.append('post', JSON.stringify(this.comment));
        this.postService.postComment(this.postFormData)
            .subscribe((data:any) => {
              console.log('Response from Post ', data);
              this.resetForm();
            });
}

getComments(postId:string, pageNumber:number): void {
    //let entityId: string;
    //entityId = this.dataShareService.getLoggedinUsername();

    //console.log('Activities for ' + entityId);

    var getPostRequest = {};
    getPostRequest['postId'] = postId;
    getPostRequest['pageNumber'] = pageNumber;

    
    this.postService.getPostComments(JSON.stringify(getPostRequest))
    .subscribe((result) => {
        if(pageNumber == 0){
            this.comments = result;
        }else{
            this.comments = this.comments.concat(result);
        }

        this.managePagination();
    });
}

loadMoreComments() {
    this.pageNumber++;
    this.getComments(this.post.id, this.pageNumber);
}

managePagination(){
    if(this.commentsCount > this.comments.length){
        this.loadMore = true;
    }else{
        this.loadMore = false;
    }

}

getCommentsCount() {
    this.postService.getCommentsCount(this.post.id)
    .subscribe((data:any) => {
        this.commentsCount = data;
        console.log("Comments count for " + this.post.id + ": " + data);

    });
}


    //OBSOLETE
   //not used for now, post.likedBy.length is being used
   getLikedCount() {
    this.postService.getLikedCount(this.post.id)
    .subscribe((data:any) => {
        this.likedCount = data;
        console.log(data);

    });
   }


//not used
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
