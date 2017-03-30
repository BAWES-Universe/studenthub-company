import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash'
@Pipe({
    name: 'orderBy'
})
export class SortPipe implements PipeTransform {
    transform(array: Array<any>, args?: any): any {
        if (array != undefined) {
            array.sort((a: any, b: any) => {
                if (a[args].replace(/[-:]/g, '') < b[args].replace(/[-:]/g, '')) {
                    return 1;
                } else if (a[args].replace(/[-:]/g, '') > b[args].replace(/[-:]/g, '')) {
                    return -1;
                } else {
                    return 0;
                }
            });
            return array;
        }
    }
}

