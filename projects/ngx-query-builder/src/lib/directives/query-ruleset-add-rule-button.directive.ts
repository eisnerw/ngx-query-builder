import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[queryRulesetAddRuleButton]'})
export class QueryRulesetAddRuleButtonDirective {
  constructor(public template: TemplateRef<any>) {}
}
