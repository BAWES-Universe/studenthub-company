import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'store_name'})
export class GroupByPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    var groups = {};
    value.forEach(function(o) {
      var group = o.store_name;
    
      groups[group] = groups[group] ?
         groups[group] : { name: group, resources: [] };
      groups[group].resources.push(o);  
    });

    return Object.keys(groups).map(function (key) {return groups[key]});
  }
}