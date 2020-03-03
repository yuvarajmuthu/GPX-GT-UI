import {Component, OnInit, Input} from '@angular/core';

import {PostService} from '../../services/post.service';
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

    constructor(private postService: PostService, private dataShareService: DatashareService) {
        //console.log('constructor() post.component');
    }

    ngOnInit(): void {
        //this.imageName = '../../images/'+this.party.profileImage;
        console.log('ngOnInit() post.component');
        let entityId: string;
        if (this.type == 'group' && this.groupId) {

            entityId = this.groupId;
        } else if (this.type == 'user') {
            entityId = this.dataShareService.getLoggedinUsername();
        } else {
            entityId = this.dataShareService.getLoggedinUsername();
        }

        console.log('Activities for ' + entityId);
        /*
        interval(5000).subscribe(
          (val) => { this.getPost(entityId);
        });
        */
        this.getPost(entityId);

    }


    getPost(entityId: string): void {
        var getPostRequest = {};
        getPostRequest['entityId'] = entityId;
        //getPostRequest["entityType"] = entityType;

        this.postService.getActivities(JSON.stringify(getPostRequest)).subscribe((result) => {
            this.posts = result;
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
