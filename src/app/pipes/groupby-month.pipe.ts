import { Pipe, PipeTransform } from '@angular/core';
import { format, parseISO } from 'date-fns';

@Pipe({
  name: 'groupByMonth'
})
export class GroupByMonthPipe implements PipeTransform {

  transform(value, attribute): any {
    const groups = {};

    value.forEach(o => {

      const group = format(parseISO(o[attribute]), 'MMMM, yyyy'); 

      groups[group] = groups[group] ?
         groups[group] : { 
          name: group, 
          resources: [] 
        };
        
      groups[group].resources.push(o);
    });

    return Object.keys(groups).map(key => groups[key]);
  }
}
