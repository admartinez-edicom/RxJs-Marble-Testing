import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';
import { Item } from '../model/item.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data: Item[] = [
    {
      id: 1,
      name: 'Apple'
    },
    {
      id: 2,
      name: 'Orange'
    },
    {
      id: 3,
      name: 'Banana'
    },
    {
      id: 4,
      name: 'Peach'
    },
    {
      id: 5,
      name: 'Grapes'
    },
    {
      id: 6,
      name: 'Watermelon'
    },
    {
      id: 7,
      name: 'Strawberry'
    },
    {
      id: 8,
      name: 'Cononut'
    },
    {
      id: 9,
      name: 'Pineapple'
    },
    {
      id: 10,
      name: 'Tangerine'
    }
  ]

  filter(q: string): Observable<Item[]> {
    console.log('Send request')
    const filteredData = this.data.filter((item) => item.name.toLowerCase().indexOf(q.toLowerCase()) > -1);
    return of(filteredData).pipe(delay(2000));
  }
}
