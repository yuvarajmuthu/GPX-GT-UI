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
    nxtNode:any;
    oldChildNodes: any;
    deletedNodePos:number;
    
      


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

        // var child = document.querySelector('.tagged-users');
        // if(child && child != null){
        //     child.addEventListener('keyup', function(){
        //         console.log("Child clicked");
        //       });
        // }


    }


getCaretPosition() {
    let editableDiv = document.getElementById("postContent");
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

onMentionSelect(item) {
      let editableDiv = document.getElementById("postContent");
      var caretPos = 0,
        sel, range;
      if (window.getSelection) {
        sel = window.getSelection();
        console.log(sel);
        if (sel.rangeCount) {
            let ranges = [];
            // for(let i = 0; i < sel.rangeCount; i++) {
            //     ranges[i] = sel.getRangeAt(i);
            //     console.log(ranges[i].endContainer.parentNode);
            //    // editableDiv.removeChild(ranges[i].endContainer.parentNode);
            //    if(ranges[i].endContainer.parentNode == "SPAN"){
            //        console.log("span deleted");
            //    }


                let btn:HTMLElement;
                btn = document.createElement("SPAN");   // Create a <button> element
                let inputDiv = document.getElementById("postContent"); 
                let innertmlHtml = inputDiv.innerHTML;
                var n = innertmlHtml.indexOf("@");
                console.log(innertmlHtml);
                var length = innertmlHtml.length;
                var tmp = innertmlHtml.slice(0, n);
                btn.innerHTML = item.firstName+" "+item.lastName+"&nbsp;";       
                inputDiv.innerHTML = tmp;
                btn.setAttribute('class', 'tagged-users');   
                btn.setAttribute('data-username', item.username);
                btn.setAttribute('data-entityType', item.userType);
                btn.setAttribute('readonly', 'true');
        
                var btn1 = document.createElement("SPAN");        // Insert text
                btn1.innerHTML = '&nbsp;';    
                inputDiv.appendChild(btn);
                inputDiv.appendChild(btn1);
                this.items = [];
                console.log(btn);

            //   }
          range = sel.getRangeAt(0);
          if (range.commonAncestorContainer.parentNode == editableDiv) {
            caretPos = range.endOffset;
          }
        }
      }
  
      // let btn:HTMLElement;
      // btn = document.createElement("SPAN");   // Create a <button> element
      // let inputDiv = document.getElementById("postContent"); 
      // let innertmlHtml = inputDiv.innerHTML;
      // var n = innertmlHtml.indexOf("@");
      // console.log(innertmlHtml);
      // var length = innertmlHtml.length;
      // var tmp = innertmlHtml.slice(0, n);
      // btn.innerHTML = item.username+"&nbsp;";       
      // inputDiv.innerHTML = tmp;
      // btn.setAttribute('class', 'tagged-users');   
      // btn.setAttribute('data-username', item.username);
      // btn.setAttribute('data-entityType', item.type);
      // btn.setAttribute('readonly', 'true');

      // var btn1 = document.createElement("SPAN");        // Insert text
      // btn1.innerHTML = '&nbsp;';    
      // inputDiv.appendChild(btn);
      // inputDiv.appendChild(btn1);
      // this.items = [];
      // console.log(btn);


      // var sel, range;
      // if (window.getSelection) {
      //     // IE9 and non-IE
      //     sel = window.getSelection();
      //     if (sel.getRangeAt && sel.rangeCount) {
      //         range = sel.getRangeAt(0);
      //         range.deleteContents();
  
      //         // Range.createContextualFragment() would be useful here but is
      //         // non-standard and not supported in all browsers (IE9, for one)
      //         var el = document.createElement("div");
      //         var tagUser =  `<span class='tagged-users'>${item.username}</span><span>,&nbsp;</span>`;
      //         el.innerHTML = tagUser;
      //         var frag = document.createDocumentFragment(), node, lastNode;
      //         console.log(frag);
              
      //         console.log(el.firstChild)
      //         while ( (node = el.firstChild) ) {
      //             console.log(node);
      //             lastNode = frag.appendChild(node);
      //         }
      //         range.insertNode(frag);
      //         console.log(lastNode);
      //         // Preserve the selection
      //         if (lastNode) {
      //             range = range.cloneRange();
      //             range.setStartAfter(lastNode);
      //             range.collapse(true);
      //             sel.removeAllRanges();
      //             sel.addRange(range);
      //         }
      //     }
      // }
      // } else if (document.selection && document.selection.type != "Control") {
      //     // IE < 9
      //     document.selection.createRange().pasteHTML(html);
      // }
  // }


    //  return btn;
    var el = document.getElementById("postContent");
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
        var tmpinput = document.getElementById("postContent");
        let test = tmpinput.innerText;
        var range = window.getSelection().rangeCount;
        var startNode = tmpinput.firstChild;
       // if(tmpinput === range.commonAncestorContainer && range.endOffset === 0) {
        var lastReadOnlyChild = document.querySelector('span[readonly]');
        //tmpinput.removeChild(lastReadOnlyChild);
       // }
    }

    var input;
    input = document.getElementById("postContent");
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


submitPost() {
    //this.makePostContent();
    this.post.entityId = this.dataShareService.getLoggedinUsername();
    let input = document.getElementById("postContent");
    console.log(input.innerHTML);
    this.txtPost = input.innerHTML.replace(/"/g, "'");
    console.log(this.txtPost);
    this.post.postText = this.txtPost;
    
    let postText= input.innerText;
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
        this.post.parentPostId = this.parentPost.id;
    }
    this.postFormData.append('post', JSON.stringify(this.post));
    this.postService.postComment(this.postFormData)
        .subscribe((data:any) => {
          this.resetForm();
          this.newpost.emit(data);
        });
    }
}
