import { FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { QueryBuilderClassNames, QueryBuilderConfig } from 'ngx-query-builder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  standalone: false
})
export class AppComponent implements OnInit {
  public queryCtrl: FormControl;
  public queryText: string = '';
  public queryTextState: 'valid' | 'invalid-json' | 'invalid-query' = 'valid';
  public queryTitle = '';

  public bootstrapClassNames: QueryBuilderClassNames = {
    removeIcon: 'fa fa-minus',
    addIcon: 'fa fa-plus',
    arrowIcon: 'fa fa-chevron-right px-2',
    button: 'btn',
    buttonGroup: 'btn-group',
    rightAlign: 'order-12 ml-auto',
    switchRow: 'd-flex px-2',
    switchGroup: 'd-flex align-items-center',
    switchRadio: 'custom-control-input',
    switchLabel: 'custom-control-label',
    switchControl: 'custom-control custom-radio custom-control-inline',
    row: 'row p-2 m-1',
    rule: 'border',
    ruleSet: 'border',
    invalidRuleSet: 'alert alert-danger',
    emptyWarning: 'text-danger mx-auto',
    operatorControl: 'form-control',
    operatorControlSize: 'col-auto pr-0',
    fieldControl: 'form-control',
    fieldControlSize: 'col-auto pr-0',
    entityControl: 'form-control',
    entityControlSize: 'col-auto pr-0',
    inputControl: 'form-control',
    inputControlSize: 'col-auto'
  };

  public query = {
    condition: 'and',
    rules: [
      {field: 'age', operator: '<='},
      {field: 'birthday', operator: '=', value: new Date()},
      {
        condition: 'or',
        rules: [
          {field: 'gender', operator: '='},
          {field: 'occupation', operator: 'in'},
          {field: 'school', operator: 'is null'},
          {field: 'notes', operator: '='}
        ]
      }
    ]
  };

  public entityConfig: QueryBuilderConfig = {
    entities: {
      physical: {name: 'Physical Attributes'},
      nonphysical: {name: 'Nonphysical Attributes'}
    },
    fields: {
      age: {name: 'Age', type: 'number', entity: 'physical'},
      gender: {
        name: 'Gender',
        entity: 'physical',
        type: 'category',
        options: [
          {name: 'Male', value: 'm'},
          {name: 'Female', value: 'f'}
        ]
      },
      name: {name: 'Name', type: 'string', entity: 'nonphysical'},
      notes: {name: 'Notes', type: 'textarea', operators: ['=', '!='], entity: 'nonphysical'},
      educated: {name: 'College Degree?', type: 'boolean', entity: 'nonphysical'},
      birthday: {name: 'Birthday', type: 'date', operators: ['=', '<=', '>'],
        defaultValue: (() => new Date()), entity: 'nonphysical'
      },
      school: {name: 'School', type: 'string', nullable: true, entity: 'nonphysical'},
      occupation: {
        name: 'Occupation',
        entity: 'nonphysical',
        type: 'category',
        options: [
          {name: 'Student', value: 'student'},
          {name: 'Teacher', value: 'teacher'},
          {name: 'Unemployed', value: 'unemployed'},
          {name: 'Scientist', value: 'scientist'}
        ]
      }
    }
  };

  public config: QueryBuilderConfig = {
    fields: {
      age: {name: 'Age', type: 'number'},
      gender: {
        name: 'Gender',
        type: 'category',
        options: [
          {name: 'Male', value: 'm'},
          {name: 'Female', value: 'f'}
        ]
      },
      name: {name: 'Name', type: 'string'},
      notes: {name: 'Notes', type: 'textarea', operators: ['=', '!=']},
      educated: {name: 'College Degree?', type: 'boolean'},
      birthday: {name: 'Birthday', type: 'date', operators: ['=', '<=', '>'],
        defaultValue: (() => new Date())
      },
      school: {name: 'School', type: 'string', nullable: true},
      occupation: {
        name: 'Occupation',
        type: 'category',
        options: [
          {name: 'Student', value: 'student'},
          {name: 'Teacher', value: 'teacher'},
          {name: 'Unemployed', value: 'unemployed'},
          {name: 'Scientist', value: 'scientist'}
        ]
      }
    }
  };

  public currentConfig!: QueryBuilderConfig;
  public allowRuleset: boolean = true;
  public allowCollapse: boolean = false;
  public allowNot: boolean = false;
  public persistValueOnFieldChange: boolean = false;

  constructor(
    private formBuilder: FormBuilder
  ) {
    this.queryCtrl = this.formBuilder.control(this.query);
    this.currentConfig = this.config;
    this.queryText = JSON.stringify(this.queryCtrl.value, null, 2);
    if (this.validateQuery(this.queryCtrl.value)) {
      this.queryTextState = 'valid';
      this.queryTitle = '';
    } else {
      this.queryTextState = 'invalid-query';
      this.queryTitle = 'Invalid query';
    }
  }

  ngOnInit(): void {
    this.queryCtrl.valueChanges.subscribe(value => {
      this.queryText = JSON.stringify(value, null, 2);
      if (this.validateQuery(value)) {
        this.queryTextState = 'valid';
        this.queryTitle = '';
      } else {
        this.queryTextState = 'invalid-query';
        this.queryTitle = 'Invalid query';
      }
    });
  }

  updateQuery(text: string): void {
    try {
      const val = JSON.parse(text.trim());
      if (this.validateQuery(val)) {
        this.queryCtrl.setValue(val);
        this.queryTextState = 'valid';
        this.queryTitle = '';
      } else {
        this.queryTextState = 'invalid-query';
        this.queryTitle = 'Invalid query';
      }
    } catch {
      this.queryTextState = 'invalid-json';
      this.queryTitle = 'Invalid JSON';
      // ignore invalid JSON
    }
  }

  private validateQuery(value: any): boolean {
    return this.validateRuleset(value);
  }

  private validateRuleset(ruleset: any): boolean {
    if (!ruleset || typeof ruleset !== 'object' || Array.isArray(ruleset)) {
      return false;
    }
    const keys = Object.keys(ruleset);
    if (keys.some(k => !['condition', 'rules', 'not'].includes(k))) {
      return false;
    }
    if (!('condition' in ruleset) || !('rules' in ruleset)) {
      return false;
    }
    if (ruleset.condition !== 'and' && ruleset.condition !== 'or') {
      return false;
    }
    if ('not' in ruleset && typeof ruleset.not !== 'boolean') {
      return false;
    }
    if (!Array.isArray(ruleset.rules)) {
      return false;
    }
    if (ruleset.rules.length === 0) {
      return false;
    }
    return ruleset.rules.every((r: any) => {
      if (r && typeof r === 'object' && 'rules' in r) {
        return this.validateRuleset(r);
      } else {
        return this.validateRule(r);
      }
    });
  }

  private validateRule(rule: any): boolean {
    if (!rule || typeof rule !== 'object' || Array.isArray(rule)) {
      return false;
    }
    const keys = Object.keys(rule);
    if (keys.some(k => !['field', 'operator', 'value', 'entity'].includes(k))) {
      return false;
    }
    if (!('field' in rule) || !('operator' in rule)) {
      return false;
    }
    const requiresValue = rule.operator !== 'is null' && rule.operator !== 'is not null';
    if (requiresValue && !('value' in rule)) {
      return false;
    }

    const fieldConf = this.currentConfig.fields[rule.field];
    if (!fieldConf) {
      return false;
    }

    const ops = this.getOperatorsForField(rule.field, fieldConf);
    if (!ops.includes(rule.operator)) {
      return false;
    }

    if (requiresValue) {
      const val = rule.value;
      switch (fieldConf.type) {
        case 'string':
        case 'textarea':
          if (typeof val !== 'string') {
            return false;
          }
          break;
        case 'number':
          if (typeof val !== 'number' || isNaN(val)) {
            return false;
          }
          break;
        case 'time':
          if (typeof val !== 'string' || !/^\d{2}:\d{2}(:\d{2})?$/.test(val)) {
            return false;
          }
          break;
        case 'date':
          if (!(val instanceof Date) && (typeof val !== 'string' || isNaN(Date.parse(val)))) {
            return false;
          }
          break;
        case 'category':
          if (rule.operator === 'in' || rule.operator === 'not in') {
            if (!Array.isArray(val) || val.length === 0) {
              return false;
            }
            if (
              fieldConf.options &&
              val.some((v: any) => !fieldConf.options!.some(o => o.value === v))
            ) {
              return false;
            }
          } else {
            if (!fieldConf.options || !fieldConf.options.some(o => o.value === val)) {
              return false;
            }
          }
          break;
        case 'boolean':
          if (val !== true && val !== false) {
            return false;
          }
          break;
        case 'multiselect':
          if (!Array.isArray(val)) {
            return false;
          }
          if (fieldConf.options && val.some((v: any) => !fieldConf.options!.some(o => o.value === v))) {
            return false;
          }
          break;
      }
    }

    if ('entity' in rule && this.currentConfig.entities && !this.currentConfig.entities[rule.entity]) {
      return false;
    }

    return true;
  }

  private getOperatorsForField(fieldName: string, field: any): string[] {
    if (this.currentConfig.getOperators) {
      return this.currentConfig.getOperators(fieldName, field);
    }
    let ops: string[] = [];
    if (field.operators) {
      ops = field.operators.slice();
    } else {
      const map: Record<string, string[]> = {
        string: ['=', '!=', 'contains', 'like'],
        number: ['=', '!=', '>', '>=', '<', '<='],
        time: ['=', '!=', '>', '>=', '<', '<='],
        date: ['=', '!=', '>', '>=', '<', '<='],
        category: ['=', '!=', 'in', 'not in'],
        boolean: ['='],
        multiselect: ['in', 'not in']
      };
      ops = map[field.type] || [];
    }
    if (field.nullable) {
      ops = ops.concat(['is null', 'is not null']);
    }
    return ops;
  }

  switchModes(event: Event) {
    this.currentConfig = (<HTMLInputElement>event.target).checked ? this.entityConfig : this.config;
  }

  changeDisabled(event: Event) {
    (<HTMLInputElement>event.target).checked ? this.queryCtrl.disable() : this.queryCtrl.enable();
  }

  changeRulesLimit(event: Event) {
    this.currentConfig = {...this.currentConfig, rulesLimit: parseInt((<HTMLInputElement>event.target).value, 10)} as QueryBuilderConfig;
  }

  changeLevelLimit(event: Event) {
    this.currentConfig = {...this.currentConfig, levelLimit: parseInt((<HTMLInputElement>event.target).value, 10)} as QueryBuilderConfig;
  }
}
