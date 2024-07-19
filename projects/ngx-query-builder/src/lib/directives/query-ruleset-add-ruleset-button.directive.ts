import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[queryRulesetAddRulesetButton]'})
export class QueryRulesetAddRulesetButtonDirective {
  constructor(public template: TemplateRef<any>) {}
}
