import { Directive, TemplateRef } from '@angular/core';

@Directive({selector: '[queryRuleRemoveButton]'})
export class QueryRuleRemoveButtonDirective {
  constructor(public template: TemplateRef<any>) {}
}
