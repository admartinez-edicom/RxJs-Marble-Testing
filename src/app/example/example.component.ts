import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/core/data/data.service';
import { Item } from 'src/app/core/model/item.model';
import { delayedSearch } from 'src/app/core/operators/operators';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {

  searchControl = new FormControl<string>('', { nonNullable: true });

  filteredList$: Observable<Item[] | undefined>;

  constructor(private dataService: DataService) {
    this.filteredList$ = this.searchControl.valueChanges.pipe(
      delayedSearch(this.searchControl.value, (search) => this.dataService.filter(search))
    );
  }

}
