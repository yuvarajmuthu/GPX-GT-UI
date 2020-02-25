export class Connection {
    sourceEntityId:string;
    sourceEntityType:string; //USER, LEGISLATOR, PARTY, DISTRICT
    targetEntityId:string;
    targetEntityType:string;//USER, LEGISLATOR, PARTY, DISTRICT
    status:string; //REQUESTED, CONNECTED, REJECTED, DEACTIVATED, FOLLOWING, UNFOLLOWED
}