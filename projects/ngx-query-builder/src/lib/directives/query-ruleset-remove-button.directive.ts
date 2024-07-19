import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[queryRulesetRemoveButton]'})
export class QueryRulesetRemoveButtonDirective {
  constructor(public template: TemplateRef<any>) {}
}
