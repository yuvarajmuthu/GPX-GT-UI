import {Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GpxFileuploadComponent} from '../../gpx-uicomponents/gpx-fileupload/gpx-fileupload.component';
import {PostService} from '../../../services/post.service';
import {DatashareService} from '../../../services/datashare.service';
import {Post} from '../../../models/post';


@Component({
  selector: 'app-commentform',
  templateUrl: './commentform.component.html',
  styleUrls: ['./commentform.component.css']
})
export class CommentformComponent implements OnInit {

  @ViewChild('input') el: ElementRef;
  @Input() selfActivities:boolean;
  form: FormGroup;
 // items: string[] = ["Noah", "Liam", "Mason", "Jacob"];
  items: any;
  mentionConfig:any;
  nxtNode:any;
  oldChildNodes: any;
  deletedNodePos:number;
  
    
  stagingImage: any = null;
  isvideoSelected : boolean = false;
  public isFileStagingAreaCollapsed: boolean = false;
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

  toggled: boolean = false;
  message: string = '';


  constructor(    public dialogRef: MatDialogRef<CommentformComponent>,
    private postService: PostService,
                private dataShareService: DatashareService
    ) {
      this.items =[];
      this.mentionConfig={items:this.items, labelKey:'username',mentionSelect: this.onMentionSelect, insertHTML:true, disableSearch: false};

     }




  getCaretPosition() {
    let editableDiv = document.getElementById("replyContent");
    var caretPos = 0,
    sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      this.oldChildNodes = editableDiv.childNodes;
      if (sel.rangeCount) {
          let ranges = [];
          for(let i = 0; i < sel.rangeCount; i++) {
              ranges[i] = sel.getRangeAt(i);
              console.log(ranges[i].endContainer.parentNode);
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
  
  handleSelection(event) {
    let inputDiv = document.getElementById("replyContent"); 
    let innertmlHtml = inputDiv.innerHTML+event.char;
    inputDiv.innerHTML = innertmlHtml;
  }
  
  onMentionSelect(item) {
        let editableDiv = document.getElementById("replyContent");
        var caretPos = 0,
          sel, range;
        if (window.getSelection) {
          sel = window.getSelection();
          console.log(sel);
          if (sel.rangeCount) {
              let ranges = [];
   
                  let btn:HTMLElement;
                  btn = document.createElement("SPAN");   // Create a <button> element
                  let inputDiv = document.getElementById("replyContent"); 
                  let innertmlHtml = inputDiv.innerHTML;
                  var n = innertmlHtml.indexOf("@");
  
                    var length = innertmlHtml.length;
                    var patt = new RegExp("/\s@\w*/i");
                    innertmlHtml = innertmlHtml.replace('&nbsp;', ' ');
                    var tmp = innertmlHtml.replace(/\s@\w*/i, ' ');
                    // btn.innerHTML = item.firstName+" "+item.lastName;
                    btn.innerHTML = item.full_name;  
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
      var el = document.getElementById("replyContent");
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
  
  
  onNoClick(){
    this.dialogRef.close();
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
  
      deleteVideoFile(e) {
        this.postFormData = new FormData();
        //document.querySelector("video").src = '';
        this.isvideoSelected = false;
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
      if(e.keyCode == 8 && e.key == "Backspace") {
          let caretPos = this.getCaretPosition();
          var tmpinput = document.getElementById("replyContent");
          let test = tmpinput.innerText;
          var range = window.getSelection().rangeCount;
          var startNode = tmpinput.firstChild;
         // if(tmpinput === range.commonAncestorContainer && range.endOffset === 0) {
          var lastReadOnlyChild = document.querySelector('span[readonly]');
          //tmpinput.removeChild(lastReadOnlyChild);
         // }
      }
  
      var input;
      input = document.getElementById("replyContent");
      let textUser= input.innerText;
      if(textUser.indexOf("@") >= 0){
          let tmpPos = textUser.split("@");
          if(tmpPos[1].length >= 1){
            this.postService.getTagUsers(tmpPos[1])
            .subscribe((data:any) => {
                this.items = data;
                this.mentionConfig={items:this.items, labelKey:'full_name',mentionSelect: this.onMentionSelect, insertHTML:true, disableSearch: false};
            });
         }
      }
  }
  
  
  submitPost() {
      //this.makePostContent();
      this.post.entityId = this.dataShareService.getLoggedinUsername();
      let input = document.getElementById("replyContent");
      if(this.selfActivities){
        let tmpBtn:HTMLElement;
        tmpBtn = document.createElement("SPAN"); 
  
        tmpBtn.innerHTML = this.post.entityId;       
        // inputDiv.innerHTML = tmp;
        tmpBtn.setAttribute('class', 'tagged-users');   
        tmpBtn.setAttribute('data-username', this.post.entityId);
         //tmpBtn.setAttribute('data-entityType', item.userType);
         tmpBtn.setAttribute('readonly', 'true');
         tmpBtn.setAttribute('contenteditable', 'false');
         tmpBtn.setAttribute('value', this.post.entityId);
  
         var tmpBtn1 = document.createElement("SPAN");        // Insert text
         tmpBtn1.innerHTML = '&nbsp;';
        // input.innerHTML = tmp;   
        // innertmlHtml = input.innerHTML;
        input.insertBefore(tmpBtn1, input.childNodes[0] || null);
        input.insertBefore(tmpBtn, input.childNodes[0] || null);
        console.log(input.innerHTML);
  
      }
  
  
     
      console.log(input.innerHTML);
      this.txtPost = input.innerHTML.replace(/"/g, "'");
      console.log(this.txtPost);
      this.post.postText = this.txtPost;
      
      let postText= input.innerText;
      console.log(postText);
      if(postText.indexOf("@") >= 0){
        this.post.taggedEntityId = [];
        let taggedEntitiesRaw = postText.substring(postText.indexOf("@")).split("@");
        //this.post.taggedEntityId = postText.match(/\@+/g);
  
        for (let i = 0; i < taggedEntitiesRaw.length; i++) {
          if(taggedEntitiesRaw[i].trim().length > 0)
            this.post.taggedEntityId.push(taggedEntitiesRaw[i].split(" ")[0].trim());
        }
      }
  
      if (this.parentPost != null) {
          this.post.parentPostId = String(this.parentPost.id);
      }
      this.postFormData.append('post', JSON.stringify(this.post));
      this.postService.postComment(this.postFormData)
          .subscribe((data:any) => {
            this.resetForm();
            this.newpost.emit(data);
          });
      }



}
