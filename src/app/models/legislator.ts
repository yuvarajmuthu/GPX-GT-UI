export class Legislator {
    //public first_name: string;
    //public committees: Array<JSON>;
/*
constructor(
public bioguide_id: string,
public birthday:Date,
public chamber: string,
public contact_form: string,
public crp_id: string,
public district:number,
public facebook_id: string,
public fax: string,
public fec_ids:string[],
first_name,
public gender: string,
public govtrack_id: string,
public icpsr_id:number,
public in_office:boolean,
public last_name: string,
public leadership_role: string,
public middle_name: string,
public name_suffix: string,
public nickname: string,
public oc_email: string,
public ocd_id: string,
public office: string,
public party: string,
public phone: string,
public state: string,
public state_name: string,
public term_end:Date,
public term_start:Date,
public thomas_id: string,
public title: string,
public twitter_id: string,
public votesmart_id: string,
public website: string,
public youtube_id: string,
public bioguideImageUrl,
committees
){}
*/
constructor(

public last_name: string,
public updated_at: Date,
//public +notice: string,
public sources: string[],
public full_name: string,
public old_roles:{ },
public id: string,
public first_name: string,
public middle_name: string,
public district: string,
public state: string,
public boundary_id: string,
public email: string,
public all_ids: string[],
public leg_id: string,
public party: string,
public active: boolean,
public transparencydata_id: string,
public photo_url: string,
public roles: string[],
public url: string,
public created_at: Date,
public chamber: string,
public offices: string[],
public suffixes: string

/*
public bioguide_id: string,
public birthday:Date,
public chamber: string,
public contact_form: string,
public crp_id: string,
public district:number,
public facebook_id: string,
public fax: string,
public fec_ids:string[],
first_name,
public gender: string,
public govtrack_id: string,
public icpsr_id:number,
public in_office:boolean,
public last_name: string,
public leadership_role: string,
public middle_name: string,
public name_suffix: string,
public nickname: string,
public oc_email: string,
public ocd_id: string,
public office: string,
public party: string,
public phone: string,
public state: string,
public state_name: string,
public term_end:Date,
public term_start:Date,
public thomas_id: string,
public title: string,
public twitter_id: string,
public votesmart_id: string,
public website: string,
public youtube_id: string,
public bioguideImageUrl,
committees
*/
){}


public getFirstName():string{
return this.first_name;
}

getLastName():string{
return this.last_name;
}
}