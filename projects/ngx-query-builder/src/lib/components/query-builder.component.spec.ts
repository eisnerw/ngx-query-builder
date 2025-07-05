import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, } from '@angular/forms';
import { QueryBuilderComponent } from './query-builder.component';

describe('QueryBuilderComponent', () => {
  let component: QueryBuilderComponent;
  let fixture: ComponentFixture<QueryBuilderComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [ CommonModule, FormsModule ],
      declarations: [ QueryBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('updates when input data changes', () => {
    const initial = { condition: 'and', rules: [{ field: 'age', operator: '=' }] } as any;
    component.value = initial;
    const updated = { condition: 'and', rules: [] } as any;
    component.data = updated;
    component.ngOnChanges({ data: { previousValue: initial, currentValue: updated, firstChange: false, isFirstChange: () => false } } as any);
    expect(component.value.rules.length).toBe(0);
  });
});
