export class User {
    id: number;
    googleId: string;//GOOGLE-id
    username: string; //email/phone
    password: string;
    firstName: string;
    lastName: string;
    displayName: string;//GOOGLE-name
    photoUrl: string;//GOOGLE
    emailId: string;//GOOGLE-email
    phone: string;
    address: string;
    token?: string;//GOOGLE-idToken
    authToken:string;//GOOGLE
    provider:string;//GOOGLE
}