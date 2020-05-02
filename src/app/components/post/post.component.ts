import {Component, OnInit, Input} from '@angular/core';

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
    @Input() groupId: string;
    @Input() userId: string;
    @Input() type: string;
    @Input() disableNewPost: boolean = false;
    
    posts: Post[] = [];
    postsByPage : Post[]=[];
    pageNumber: number = 1;

    constructor(private postService: PostService, private dataShareService: DatashareService) {
    }

    PostNewEvent(data:any) {
        this.posts.unshift(data);
    }
    postNewComment(data:any){
        console.log(data);
        this.posts[0].comments.unshift(data);

    }

    onPostScroll(e){
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
        //this.imageName = '../../images/'+this.party.profileImage;
        console.log('ngOnInit() post.component');

        /*
        interval(5000).subscribe(
          (val) => { this.getPost(entityId);
        });
        */
        this.getPost('0');

    }


    getPost(pageNumber:string): void {
        let entityId: string;
        entityId = this.dataShareService.getLoggedinUsername();
        
        console.log('Activities for ' + entityId);

        var getPostRequest = {};
        getPostRequest['entityId'] = entityId;
        getPostRequest['pageNumber'] = pageNumber;
        //getPostRequest["entityType"] = entityType;

        this.postService.getActivities(JSON.stringify(getPostRequest)).subscribe((result) => {
            this.postsByPage = result;
            this.posts = this.posts.concat(this.postsByPage);
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
