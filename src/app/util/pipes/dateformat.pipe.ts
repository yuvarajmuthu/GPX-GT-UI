import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
//import { PostService } from '../../services/post.service';

@Pipe({
    name: 'dateFormatPipe',
})
export class dateFormatPipe implements PipeTransform {
    /*
    timeZone:string;
    constructor(public postService: PostService) {
        var date = new Date();
        this.timeZone = this.postService.getLocalTimeZone(date);
        console.log('this.timeZone ', this.timeZone);
    }
*/
    transform(value: string) {
        var datePipe = new DatePipe("en-US");
        //value = (new Date(value + ' UTC')).toString();
        value = datePipe.transform(new Date(value + ' UTC'), 'yyyy-MM-dd HH:mm:ss');

        return value;
    }
}