export class Post {
	constructor(
		public id:string,
		public entityId:string,
		public parentPostId:string,		
		public userId: string,
		public postText: string, 
		public postCategory:string,
		public imageUrl:string,
		public videoUrl:string,
		public districtId:string,
		public likedBy:string[],
		public likedByCurrentUser:boolean,
		public postType:string, // OBSOLETE
		public imageFile:File
	){}
}	

interface PostJSON {
	id:string;
	userName: string;
	txtPost: string;
}