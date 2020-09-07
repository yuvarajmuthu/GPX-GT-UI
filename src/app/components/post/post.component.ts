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

    ngOnInit(): void {
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
        if(!this.userId){
            this.userId = this.dataShareService.getLoggedinUsername();
        }
        if(!this.requestedBy){
            this.requestedBy = this.dataShareService.getLoggedinUsername();
        }

    }
    getSharedPost(postId:number): void {
        this.postService.getSharedPost(postId).subscribe((result) => {
            if(result){
                this.posts = result;
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
