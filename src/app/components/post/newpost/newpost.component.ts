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
      onMentionSelect(item) {
        // return '#' + selection.label;
        return `@${item.username}`;
      }
      


    stagingImage: any = null;
    public isFileStagingAreaCollapsed: boolean = true;
    public: boolean = false;
    friends: boolean = false;
    onlyMe: boolean = false;
    name: any = [];
    icon: any = [];
    @Output() postEvent: EventEmitter<any> = new EventEmitter();
    @Output() newpost: EventEmitter<any> = new EventEmitter();

    @Input() parentPost: Post;
    post: Post;
    postFormData: FormData;

    txtPost: string = '';
    hideInput: boolean = false;

    constructor(private postService: PostService,
                private dataShareService: DatashareService,
                private changeDetector: ChangeDetectorRef
    ) {
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
        this.post = {} as Post;
        this.postFormData = new FormData();
    }

    deleteAttachedFile(e) {
        this.postFormData = new FormData();
        this.stagingImage = '';
    }

    onFileSelected(event) {
        console.log('file object ', event);
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
      
            reader.readAsDataURL(event.target.files[0]); // read file as data url
      
            reader.onload = (event) => { // called once readAsDataURL is completed
              this.stagingImage = event.target['result'];
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

makePostContent() {
    let withatAll = this.txtPost.replace(/(\r\n|\n|\r)/gm, "").split(" ");
    let replaceSpecial = [];
    for (var val of withatAll) {
        if(val.indexOf('@') >= 0){
            let tmp = val.split(/[,;?.\-_]/);
            for (var val1 of tmp) {
                if(val1.indexOf('@') >= 0)
                replaceSpecial.push(val1);
            }
            
        }

    }
    console.log(this.txtPost);
    let content = this.txtPost.replace(/\n/g, '<br>');
    //content = content.replace('\r', '<br>');
    console.log(content);
    let replaceDone=[];
    for (var tmpreplace of replaceSpecial) {
        if(replaceDone.indexOf(tmpreplace) == -1){
            var tmpVal= tmpreplace.split('@');
            console.log(tmpVal[1]);
            for(var i=0; i < this.items.length; i++) {
                console.log(this.items[i].username);
                if(this.items[i].username == tmpVal[1]) {
                    console.log("=======inside");
                    var tmphtml ="<span class='tag-users' data-username='"+this.items[i].username+"' data-entityType='"+this.items[i].type+"'>"+tmpreplace+'</span>';
                    content=content.replace(tmpreplace, tmphtml);
                    replaceDone.push(tmpreplace);
                }
            }
            // var tmphtml ="<span class='user'>"+tmpreplace+'</span>';
            // content=content.replace(tmpreplace, tmphtml);
            // replaceDone.push(tmpreplace);
        }

    }

    console.log(content);
  //  .filter(t => t != "" && this.items.findIndex(u => u.name == t.trim()) > -1).map(name => this.items.find(s => s.name == name.trim()).id)

//console.log(ids);

}


getUsers(){
    this.postService.getTagUsers()
    .subscribe((data:any) => {
        this.items = data;
        this.mentionConfig={items:this.items, labelKey:'username',mentionSelect: this.onMentionSelect, insertHTML:false};

    });
}


submitPost() {
    this.makePostContent();
    this.post.entityId = this.dataShareService.getLoggedinUsername();
    this.post.postText = this.txtPost;
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
