import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestScheduler } from 'rxjs/testing';
import { ExampleComponent } from './example.component';

describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  const testScheduler = new TestScheduler((actual, expected) => {
    // Se conecta con jasmine
    expect(actual).toEqual(expected);
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExampleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
