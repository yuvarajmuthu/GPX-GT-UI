export class Post {
	public id:number;
	public parent_Id: number;
	public entityId:string;
	public parentPostId:string;		
	public userId: string;
	public postText: string; 
	public postCategory:string;
	public imageUrl:string;
	public videoUrl:string;
	public districtId:string;
	public taggedEntityId:string[];
	public likedBy:string[];
	public likedByCurrentUser:boolean;
	public postType:string; // OBSOLETE
	public imageFile:File;
	public comments: any;
	public totalComments:number;

	constructor(

	){}
}	

interface PostJSON {
	id:string;
	userName: string;
	txtPost: string;
}