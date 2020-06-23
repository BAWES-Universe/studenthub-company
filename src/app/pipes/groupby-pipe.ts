import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'store_name'})
export class GroupByPipe implements PipeTransform {
  transform(value) : any {
    var groups = {};
    value.forEach(function(o) {
      var group = o.store_id;
    
      groups[group] = groups[group] ?
         groups[group] : { name: o.store_name, resources: [] };
      groups[group].resources.push(o);  
    });

    return Object.keys(groups).map(function (key) {return groups[key]});
  }
}
