import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtersearch',
    pure: false
})
export class FilterSearchPipe implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!items || !filter) {
            return items;
        }
        let itemsForReturn;
        let returnValues = [];
        if (filter != "all") {
            for (const item of items) {
                if (item.key == "file") {
                    for (const value of item.value) {
                        if (value.contentType == filter) {
                            returnValues.push(value);
                        }
                    }
                }
            }
            return itemsForReturn = [{ "key": "file", "value": returnValues }];;
        } else {
            return items;
        }

        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        // return items["file"].value.filter(item => item.contentType.indexOf(filter) !== -1);
    }
}