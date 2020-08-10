export class User {
    id: number;
    googleId: string;//GOOGLE-id
    username: string; //email/phone
    password: string;
    userType: string;
    status: string;
    full_name: string;
    firstName: string;
    lastName: string;
    displayName: string;//GOOGLE-name
    photoUrl: string;//GOOGLE
    profileAvatarImgFileId: string;
    profileBannerImgFileId: string;
    settings: string;
    circleUsersInfo: string;
    members: string;
    emailId: string;//GOOGLE-email
    phone: string;
    address: string;
    token?: string;//GOOGLE-idToken
    authToken:string;//GOOGLE
    provider:string;//GOOGLE
}