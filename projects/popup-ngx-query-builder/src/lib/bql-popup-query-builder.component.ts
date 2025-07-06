import { Component, Input, Output, EventEmitter } from '@angular/core';
import { QueryBuilderConfig, RuleSet } from '@kerwin612/ngx-query-builder';

@Component({
  selector: 'popup-bql-query-builder',
  templateUrl: './bql-popup-query-builder.component.html',
  styleUrls: ['./bql-popup-query-builder.component.css']
})
export class BqlPopupQueryBuilderComponent {
  @Input() queryText = '';
  @Output() queryTextChange = new EventEmitter<string>();
  @Input() placeholder = 'Enter query';
  @Input() config: QueryBuilderConfig = {fields: {}};

  showBuilder = false;
  editing = false;

  currentQuery: RuleSet = {condition: 'and', rules: []};

  openBuilder(): void {
    this.currentQuery = this.bqlToQuery(this.queryText);
    this.showBuilder = true;
  }

  closeBuilder(apply: boolean): void {
    if (apply) {
      this.queryText = this.queryToBql(this.currentQuery);
      this.queryTextChange.emit(this.queryText);
    }
    this.showBuilder = false;
  }

  private bqlToQuery(bql: string): RuleSet {
    // TODO: replace with real bql to query conversion
    return { condition: 'and', rules: [] };
  }

  private queryToBql(query: RuleSet): string {
    // TODO: replace with real query to bql conversion
    return this.queryText;
  }
}
