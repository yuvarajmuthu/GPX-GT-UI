import {Component, OnInit, Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {PostService} from '../../services/post.service';
import { Observable, Subject } from 'rxjs';
import {DatashareService} from '../../services/datashare.service';

import {Post} from '../../models/post';

//import {NewPostGPX} from './newPost';
//import {BannerGPXComponent} from './banner.component';
//import {PostCardGPX} from './postCard.component'; 

import {interval} from 'rxjs';

@Component({
    selector: 'app-post',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
    @Input() userId: string;
    @Input() requestedBy: string;
    @Input() disableNewPost: boolean = false;
    @Input() selfActivities: boolean = false;
    isShowAllPosts:boolean = false;
    
    posts: Post[] = [];
    postsByPage : Post[]=[];
    pageNumber: number = 1;

    parentPost:any;
    allPosts : Post[] = [];
    isPosts = true;
    postViewDetails=[];

    constructor(private route: ActivatedRoute,
        private postService: PostService,
        private dataShareService: DatashareService) {
    }

    topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        let postConent = document.getElementById("postContent");
        postConent.focus();
    }

    PostNewEvent(data:any) {
        this.posts.unshift(data);
    }
    postNewComment(data:any){
        console.log(data);
        this.posts[0].comments.unshift(data);

    }
    openNewPost(evt){
       console.log("post event");
       this.disableNewPost = !this.disableNewPost;
    }

    onPostScroll(e){
        if(!this.isShowAllPosts)
          return;
             
        const divViewHeight = e.target.offsetHeight;
        const divScrollHeight = e.target.scrollHeight;
        const scrollLocation = e.target.scrollTop;

        const buffer = 200;
        const limit = divScrollHeight - divViewHeight - buffer;
        if(scrollLocation>limit){
            console.log("test");
            //const tmppost = this.posts;
            this.pageNumber = this.pageNumber+1;
            this.getPost(String(this.pageNumber));
            //this.posts = this.posts.concat(tmppost)
        }
    }

     dfs(obj, targetId) {
        if (obj.id === targetId) {
          return obj
        }
        if (obj.comments) {
          for (let item of obj.comments) {
            let check = this.dfs(item, targetId)
            if (check) {
              return obj.comments
            }
          }
        }
        return null
      }




    backToParent(parentId){
        console.log(parentId);
        let backToParent=[];
        //  backToParent.push(this.allPosts.find(c=>c.parent_Id == parentId));
        //  console.log(backToParent);
        // if(!backToParent || backToParent.length == 0){
            let result = null
            console.log(typeof(backToParent));


            for (let obj of this.allPosts) {
            result = this.dfs(obj, parentId)
            if (result) {
                console.log(result);
                if(result.parent_Id == null){
                    this.parentPost = null;
                }
                else{
                    this.parentPost = null;
                    this.parentPost = obj;
                }
                console.log(typeof(result));
                if(result[0]){
                    for(let i=0; i<=result.length-1;i++){
                        console.log(result[i]);
                        backToParent.push(result[i]);
                    }
                }
                else{
                    backToParent.concat(result);
                }
                   
                break
            }
            }
        // }
        
        console.log(this.allPosts);
        console.log(backToParent);
        console.log(typeof(backToParent));
        if(backToParent && backToParent.length>0 && backToParent[0].parent_Id != null){
            // this.posts.length = 0;
           console.log("=========1");
            this.posts=backToParent;
        }
        else{
            console.log("=========2");
            let allPosts = this.allPosts
            this.posts = allPosts;
            console.log(this.posts);
        }

    }

    getMorePostdetails(evt:any, post:any, idx: number, isPost:boolean){
        console.log(evt.target.id);
        if(evt.target.id == 'comment'){
            return;
        }
        this.parentPost = null;
        this.parentPost = post;
        this.isPosts = isPost;
        let details:any;


        // if(post.parentPostId)
        //    details = {"type":"post", "index": idx };
        // else
        //    details = {"type":"comment", "index": idx };

        // this.postViewDetails.push(details);

        // this.posts.length = 0;
        let allpost = this.posts[idx].comments
        console.log(allpost);
        this.posts=allpost;

        // console.log(this.postViewDetails);
    }

    ngOnInit(): void {
        if(!this.userId){
            this.userId = this.dataShareService.getLoggedinUsername();
        }
        if(!this.requestedBy){
            this.requestedBy = this.dataShareService.getLoggedinUsername();
        }
        
        this.route
        .queryParams
        .subscribe(params => {
            if(params && params.postId){
                this.isShowAllPosts = false;
                this.getSharedPost(params.postId);
            }
            else{
                this.isShowAllPosts = true;
                this.getPost('0');
            }
        });
        //this.imageName = '../../images/'+this.party.profileImage;
        console.log('ngOnInit() post.component');

        /*
        interval(5000).subscribe(
          (val) => { this.getPost(entityId);
        });
        */


    }
    getSharedPost(postId:number): void {
        this.postService.getSharedPost(postId).subscribe((result) => {
            if(result){
                this.posts = result;
                this.allPosts=[];
                this.allPosts = result;
            }
        });
    }
    


    getPost(pageNumber:string): void {
        //let entityId: string;
        //entityId = this.dataShareService.getLoggedinUsername();
        
        console.log('Fetching Activities for ' + this.userId + ' , Pagenumber ' + pageNumber);

        var getPostRequest = {};
        getPostRequest['entityId'] = this.userId;//entityId;
        getPostRequest['requestedBy'] = this.requestedBy;
        getPostRequest['pageNumber'] = pageNumber;
        getPostRequest['selfActivities'] = this.selfActivities; 

        this.postService.getActivities(JSON.stringify(getPostRequest)).subscribe((result) => {
            if(result){
                this.postsByPage = result;
                this.posts = this.posts.concat(this.postsByPage);
                this.allPosts = [];
                this.allPosts = result;
            }
            //this.reloadPost(entity, entityType);
        });
    }

    reloadPost(entity: string, entityType: string): void {
        // Observable.timer(5000).first()
        // .subscribe(()=>this.getPost(entity, entityType));
    }

    /*
      comment():void{}

      likePost(post:Post):void{
        console.log('Liked the post ' + post.id);
        console.log('userid ' + this.dataShareService.getCurrentUserId());
        post.likedByCurrentUser = true;
      }
      */
}
