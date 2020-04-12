import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GpxFileuploadComponent} from '../../gpx-uicomponents/gpx-fileupload/gpx-fileupload.component';
import {PostService} from '../../../services/post.service';
import {DatashareService} from '../../../services/datashare.service';
import {Post} from '../../../models/post';

@Component({
    selector: 'app-newpost',
    templateUrl: './newpost.component.html',
    styleUrls: ['./newpost.component.css']
})
export class NewpostComponent implements OnInit {

    form: FormGroup;

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

    onFileSelected(event) {
        console.log('file object ', event);
        let reader = new FileReader();
        if (event.target.files && event.target.files[0]) {
            this.postFormData.append('file', event.target.files[0]);
            reader.readAsDataURL(event.target.files[0]);
            reader.onload = (event) => {
                this.stagingImage = event.target['result'];
            };
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

submitPost() {
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
