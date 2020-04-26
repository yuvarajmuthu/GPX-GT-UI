import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GpxFileuploadComponent} from '../../gpx-uicomponents/gpx-fileupload/gpx-fileupload.component';
import {PostService} from '../../../services/post.service';
import {DatashareService} from '../../../services/datashare.service';
import {Post} from '../../../models/post';
//import { userInfo } from 'os';

@Component({
    selector: 'app-newpost',
    templateUrl: './newpost.component.html',
    styleUrls: ['./newpost.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class NewpostComponent implements OnInit {
    @ViewChild('input') el: ElementRef;
    form: FormGroup;
   // items: string[] = ["Noah", "Liam", "Mason", "Jacob"];
    items: any;
    mentionConfig:any;
    
      


    stagingImage: any = null;
    public isFileStagingAreaCollapsed: boolean = true;
    public: boolean = false;
    friends: boolean = false;
    onlyMe: boolean = false;
    name: any = [];
    icon: any = [];
    isFileSizeError : boolean = false;
    @Output() postEvent: EventEmitter<any> = new EventEmitter();
    @Output() newpost: EventEmitter<any> = new EventEmitter();

    @Input() parentPost: Post;
    post: Post;
    postFormData: FormData;

    txtPost: string = '';
    hideInput: boolean = false;
    cusrorX: any;
    cusrorY: any;

    constructor(private postService: PostService,
                private dataShareService: DatashareService,
                private changeDetector: ChangeDetectorRef
    ) {
        this.items =[];
        this.mentionConfig={items:this.items, labelKey:'username',mentionSelect: this.onMentionSelect, insertHTML:true, disableSearch: false};

    }



    onMentionSelect(item) {

        let btn:HTMLElement;
        btn = document.createElement("SPAN");   // Create a <button> element
        let inputDiv = document.getElementById("postContent"); 
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


     Public(val) {
        console.log(val);
        this.public = true;
        this.friends = false;
        this.onlyMe = false;
        this.name = 'Public';
        this.icon = 'fa fa-globe';
    }

    Friends(val) {
        console.log(val);
        this.public = false;
        this.friends = true;
        this.onlyMe = false;
        this.name = val;
        this.icon = 'fa fa-users';
    }

    OnlyMe(val) {
        console.log(val);
        this.public = false;
        this.friends = false;
        this.onlyMe = true;
        this.name = val;
        this.icon = 'fa fa-user';
    }

    ngOnInit() {
        this.resetForm();
        this.name = 'Public';
        this.icon = 'fa fa-globe';
    }

    resetForm() {
        this.txtPost = '';
        this.stagingImage = '';
        this.post = {} as Post;
        this.postFormData = new FormData();
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

    doTextareaValueChange(ev) {
        try {
            this.txtPost = ev.target.value;
        } catch (e) {
            console.info('could not set textarea-value');
        }
    }

//     submitPost() {
//         this.post.entityId = this.dataShareService.getLoggedinUsername();
//         this.post.postText = this.txtPost;
//         if (this.parentPost != null) {
//             console.log('parent post ' + this.parentPost.postText + ', post id ' + this.parentPost.id);
//             this.post.parentPostId = this.parentPost.id;
//         }
//         this.postFormData.append('post', JSON.stringify(this.post));
//         this.postService.postComment(this.postFormData)
//             .subscribe((result) => {
//                 console.log('post message response ' + result);
//                 this.resetForm();
//                 if (this.parentPost != null) {
//                     this.postEvent.emit(null);
//                     this.hideInput = true;
//                 } else {
//                     this.txtPost = '';
//                     this.stagingImage = null;
//                 }
//             });
//     }
// }


getUsers(e){

    var input;
    input = document.getElementById("postContent");
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


submitPost() {
    //this.makePostContent();
    this.post.entityId = this.dataShareService.getLoggedinUsername();
    this.post.postText = this.txtPost;
    let input = document.getElementById("postContent");
    console.log(input.innerHTML);
    this.txtPost = input.innerHTML.replace(/"/g, "'");
    console.log(this.txtPost);
    if (this.parentPost != null) {
        this.post.parentPostId = this.parentPost.id;
    }
    this.postFormData.append('post', JSON.stringify(this.post));
    this.postService.postNewPost(this.postFormData)
        .subscribe((data:any) => {
          this.resetForm();
          this.newpost.emit(data);
        });
    }
}
