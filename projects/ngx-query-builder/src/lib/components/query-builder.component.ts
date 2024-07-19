import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { QueryOperatorDirective } from '../directives/query-operator.directive';
import { QueryFieldDirective } from '../directives/query-field.directive';
import { QueryEntityDirective } from '../directives/query-entity.directive';
import { QuerySwitchGroupDirective } from '../directives/query-switch-group.directive';
import { QueryButtonGroupDirective } from '../directives/query-button-group.directive';
import { QueryInputDirective } from '../directives/query-input.directive';
import { QueryRulesetAddRuleButtonDirective } from '../directives/query-ruleset-add-rule-button.directive';
import { QueryRulesetAddRulesetButtonDirective } from '../directives/query-ruleset-add-ruleset-button.directive';
import { QueryRulesetRemoveButtonDirective } from '../directives/query-ruleset-remove-button.directive';
import { QueryRuleRemoveButtonDirective } from '../directives/query-rule-remove-button.directive';
import { QueryEmptyWarningDirective } from '../directives/query-empty-warning.directive';
import { QueryArrowIconDirective } from '../directives/query-arrow-icon.directive';
import {
  ButtonGroupContext,
  Entity,
  Field,
  SwitchGroupContext,
  EntityContext,
  FieldContext,
  InputContext,
  LocalRuleMeta,
  OperatorContext,
  Option,
  QueryBuilderClassNames,
  QueryBuilderConfig,
  RuleRemoveButtonContext,
  ArrowIconContext,
  Rule,
  RuleSet,
  EmptyWarningContext, RulesetRemoveButtonContext, RulesetAddRulesetButtonContext, RulesetAddRuleButtonContext,
} from '../models/query-builder.interfaces';
import {
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  forwardRef,
  Input,
  OnChanges,
  QueryList,
  TemplateRef,
  ViewChild,
  ElementRef
} from '@angular/core';

export const CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => QueryBuilderComponent),
  multi: true
};

export const VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => QueryBuilderComponent),
  multi: true
};

@Component({
  selector: 'ngx-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.css'],
  providers: [CONTROL_VALUE_ACCESSOR, VALIDATOR]
})
export class QueryBuilderComponent implements OnChanges, ControlValueAccessor, Validator {
  public fields!: Field[];
  public entities!: Entity[];
  public defaultClassNames: QueryBuilderClassNames = {
    switchRow: 'q-switch-row',
    arrowIconButton: 'q-arrow-icon-button',
    arrowIcon: 'q-icon q-arrow-icon',
    removeIcon: 'q-icon q-remove-icon',
    addIcon: 'q-icon q-add-icon',
    button: 'q-button',
    buttonGroup: 'q-button-group',
    removeButton: 'q-remove-button',
    switchGroup: 'q-switch-group',
    switchLabel: 'q-switch-label',
    switchRadio: 'q-switch-radio',
    rightAlign: 'q-right-align',
    transition: 'q-transition',
    collapsed: 'q-collapsed',
    treeContainer: 'q-tree-container',
    tree: 'q-tree',
    row: 'q-row',
    connector: 'q-connector',
    rule: 'q-rule',
    ruleContent: 'q-rule-content',
    ruleActions: 'q-rule-actions',
    ruleSet: 'q-ruleset',
    invalidRuleSet: 'q-invalid-ruleset',
    emptyWarning: 'q-empty-warning',
    fieldControl: 'q-field-control',
    fieldControlSize: 'q-control-size',
    entityControl: 'q-entity-control',
    entityControlSize: 'q-control-size',
    operatorControl: 'q-operator-control',
    operatorControlSize: 'q-control-size',
    inputControl: 'q-input-control',
    inputControlSize: 'q-control-size'
  };
  public defaultOperatorMap: Record<string, string[]> = {
    string: ['=', '!=', 'contains', 'like'],
    number: ['=', '!=', '>', '>=', '<', '<='],
    time: ['=', '!=', '>', '>=', '<', '<='],
    date: ['=', '!=', '>', '>=', '<', '<='],
    category: ['=', '!=', 'in', 'not in'],
    boolean: ['=']
  };

  // For ControlValueAccessor interface
  public onChangeCallback!: () => void;
  public onTouchedCallback!: () => any;

  @Input() disabled!: boolean;
  @Input() level = 0;
  @Input() data: RuleSet = { condition: 'and', rules: [] };
  @Input() allowRuleset = true;
  @Input() allowCollapse = false;
  @Input() emptyMessage = 'A ruleset cannot be empty. Please add a rule or remove it all together.';
  @Input() classNames!: QueryBuilderClassNames;
  @Input() operatorMap!: Record<string, string[]>;
  @Input() parentValue!: RuleSet;
  @Input() config: QueryBuilderConfig = { fields: {} };
  @Input() parentArrowIconTemplate!: QueryArrowIconDirective;
  @Input() parentInputTemplates!: QueryList<QueryInputDirective>;
  @Input() parentOperatorTemplate!: QueryOperatorDirective;
  @Input() parentFieldTemplate!: QueryFieldDirective;
  @Input() parentEntityTemplate!: QueryEntityDirective;
  @Input() parentSwitchGroupTemplate!: QuerySwitchGroupDirective;
  @Input() parentButtonGroupTemplate!: QueryButtonGroupDirective;
  @Input() parentRulesetAddRuleButtonTemplate!: QueryRulesetAddRuleButtonDirective;
  @Input() parentRulesetAddRulesetButtonTemplate!: QueryRulesetAddRulesetButtonDirective;
  @Input() parentRulesetRemoveButtonTemplate!: QueryRulesetRemoveButtonDirective;
  @Input() parentRuleRemoveButtonTemplate!: QueryRuleRemoveButtonDirective;
  @Input() parentEmptyWarningTemplate!: QueryEmptyWarningDirective;
  @Input() parentChangeCallback!: () => void;
  @Input() parentTouchedCallback!: () => void;
  @Input() persistValueOnFieldChange = false;

  @ViewChild('treeContainer', {static: true}) treeContainer!: ElementRef;

  @ContentChild(QueryButtonGroupDirective) buttonGroupTemplate!: QueryButtonGroupDirective;
  @ContentChild(QuerySwitchGroupDirective) switchGroupTemplate!: QuerySwitchGroupDirective;
  @ContentChild(QueryFieldDirective) fieldTemplate!: QueryFieldDirective;
  @ContentChild(QueryEntityDirective) entityTemplate!: QueryEntityDirective;
  @ContentChild(QueryOperatorDirective) operatorTemplate!: QueryOperatorDirective;
  @ContentChild(QueryRulesetAddRuleButtonDirective) rulesetAddRuleButtonTemplate!: QueryRulesetAddRuleButtonDirective;
  @ContentChild(QueryRulesetAddRulesetButtonDirective) rulesetAddRulesetButtonTemplate!: QueryRulesetAddRulesetButtonDirective;
  @ContentChild(QueryRulesetRemoveButtonDirective) rulesetRemoveButtonTemplate!: QueryRulesetRemoveButtonDirective;
  @ContentChild(QueryRuleRemoveButtonDirective) ruleRemoveButtonTemplate!: QueryRuleRemoveButtonDirective;
  @ContentChild(QueryEmptyWarningDirective) emptyWarningTemplate!: QueryEmptyWarningDirective;
  @ContentChild(QueryArrowIconDirective) arrowIconTemplate!: QueryArrowIconDirective;
  @ContentChildren(QueryInputDirective) inputTemplates!: QueryList<QueryInputDirective>;

  private defaultTemplateTypes: string[] = [
    'string', 'number', 'time', 'date', 'category', 'boolean', 'multiselect'];
  private defaultPersistValueTypes: string[] = [
    'string', 'number', 'time', 'date', 'boolean'];
  private defaultEmptyList: any[] = [];
  private operatorsCache!: Record<string, string[]>;
  private inputContextCache = new Map<Rule, InputContext>();
  private operatorContextCache = new Map<Rule, OperatorContext>();
  private fieldContextCache = new Map<Rule, FieldContext>();
  private entityContextCache = new Map<Rule, EntityContext>();
  private rulesetAddRuleButtonContextCache = new Map<Rule, RulesetAddRuleButtonContext>();
  private rulesetAddRulesetButtonContextCache = new Map<Rule, RulesetAddRulesetButtonContext>();
  private rulesetRemoveButtonContextCache = new Map<Rule, RulesetRemoveButtonContext>();
  private ruleRemoveButtonContextCache = new Map<Rule, RuleRemoveButtonContext>();
  private buttonGroupContext!: ButtonGroupContext;

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  // ----------OnChanges Implementation----------

  ngOnChanges() {
    const config = this.config;
    const type = typeof config;
    if (type === 'object') {
      this.fields = Object.keys(config.fields).map((value) => {
        const field = config.fields[value];
        field.value = field.value || value;
        return field;
      });
      if (config.entities) {
        this.entities = Object.keys(config.entities).map((value) => {
          // @ts-ignore
          const entity = config.entities[value];
          entity.value = entity.value || value;
          return entity;
        });
      } else {
        this.entities = [];
      }
      this.operatorsCache = {};
    } else {
      throw new Error(`Expected 'config' must be a valid object, got ${type} instead.`);
    }
  }

  // ----------Validator Implementation----------

  validate(): ValidationErrors | null {
    const errors: Record<string, any> = {};
    // @ts-ignore
    const ruleErrorStore = [];
    let hasErrors = false;

    if (!this.config.allowEmptyRulesets && this.checkEmptyRuleInRuleset(this.data)) {
      // @ts-ignore
      errors.empty = 'Empty rulesets are not allowed.';
      hasErrors = true;
    }

    // @ts-ignore
    this.validateRulesInRuleset(this.data, ruleErrorStore);

    if (ruleErrorStore.length) {
      // @ts-ignore
      errors.rules = ruleErrorStore;
      hasErrors = true;
    }
    return hasErrors ? errors : null;
  }

  // ----------ControlValueAccessor Implementation----------

  @Input()
  get value(): RuleSet {
    return this.data;
  }
  set value(value: RuleSet) {
    // When component is initialized without a formControl, null is passed to value
    this.data = value || { condition: 'and', rules: [] };
    this.handleDataChange();
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = () => fn(this.data);
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = () => fn(this.data);
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.changeDetectorRef.detectChanges();
  }

  // ----------END----------

  getDisabledState = (): boolean => {
    return this.disabled;
  }

  // @ts-ignore
  findTemplateForRule(rule: Rule): TemplateRef<any> {
    // @ts-ignore
    const type = this.getInputType(rule.field, rule.operator);
    if (type) {
      const queryInput = this.findQueryInput(type);
      if (queryInput) {
        return queryInput.template;
      } else {
        if (this.defaultTemplateTypes.indexOf(type) === -1) {
          console.warn(`Could not find template for field with type: ${type}`);
        }
        // @ts-ignore
        return null;
      }
    }
  }

  findQueryInput(type: string): QueryInputDirective {
    const templates = this.parentInputTemplates || this.inputTemplates;
    // @ts-ignore
    return (templates||[]).find((item) => item.queryInputType === type);
  }

  getOperators(field: string): string[] {
    if (this.operatorsCache[field]) {
      return this.operatorsCache[field];
    }
    let operators = this.defaultEmptyList;
    const fieldObject = this.config.fields[field];

    if (this.config.getOperators) {
      return this.config.getOperators(field, fieldObject);
    }

    const type = fieldObject.type;

    if (fieldObject && fieldObject.operators) {
      operators = fieldObject.operators;
    } else if (type) {
      operators = (this.operatorMap && this.operatorMap[type]) || this.defaultOperatorMap[type] || this.defaultEmptyList;
      if (operators.length === 0) {
        console.warn(
          `No operators found for field '${field}' with type ${fieldObject.type}. ` +
          `Please define an 'operators' property on the field or use the 'operatorMap' binding to fix this.`);
      }
      if (fieldObject.nullable) {
        operators = operators.concat(['is null', 'is not null']);
      }
    } else {
      console.warn(`No 'type' property found on field: '${field}'`);
    }

    // Cache reference to array object, so it won't be computed next time and trigger a rerender.
    this.operatorsCache[field] = operators;
    return operators;
  }

  getFields(entity: string): Field[] {
    if (this.entities && entity) {
      return this.fields.filter((field) => {
        return field && field.entity === entity;
      });
    } else {
      return this.fields;
    }
  }

  getInputType(field: string, operator: string): string {
    if (this.config.getInputType) {
      return this.config.getInputType(field, operator);
    }

    if (!this.config.fields[field]) {
      throw new Error(`No configuration for field '${field}' could be found! Please add it to config.fields.`);
    }

    const type = this.config.fields[field].type;
    switch (operator) {
      case 'is null':
      case 'is not null':
        // @ts-ignore
        return null;  // No displayed component
      case 'in':
      case 'not in':
        return type === 'category' || type === 'boolean' ? 'multiselect' : type;
      default:
        return type;
    }
  }

  getOptions(field: string): Option[] {
    if (this.config.getOptions) {
      return this.config.getOptions(field);
    }
    return this.config.fields[field].options || this.defaultEmptyList;
  }

  // @ts-ignore
  getClassNames(...args): string {
    const clsLookup = this.classNames ? this.classNames : this.defaultClassNames;
    // @ts-ignore
    const classNames = args.map((id) => clsLookup[id] || this.defaultClassNames[id]).filter((c) => !!c);
    // @ts-ignore
    return classNames.length ? classNames.join(' ') : null;
  }

  getDefaultField(entity: Entity): Field {
    if (!entity) {
      // @ts-ignore
      return null;
    } else if (entity.defaultField !== undefined) {
      return this.getDefaultValue(entity.defaultField);
    } else {
      const entityFields = this.fields.filter((field) => {
        return field && field.entity === entity.value;
      });
      if (entityFields && entityFields.length) {
        return entityFields[0];
      } else {
        console.warn(`No fields found for entity '${entity.name}'. ` +
          `A 'defaultOperator' is also not specified on the field config. Operator value will default to null.`);
        // @ts-ignore
        return null;
      }
    }
  }

  getDefaultOperator(field: Field): string {
    if (field && field.defaultOperator !== undefined) {
      return this.getDefaultValue(field.defaultOperator);
    } else {
      // @ts-ignore
      const operators = field ? this.getOperators(field.value) : [];
      if (operators && operators.length) {
        return operators[0];
      } else {
        console.warn(`No operators found for field '${field?.value}'. ` +
          `A 'defaultOperator' is also not specified on the field config. Operator value will default to null.`);
        // @ts-ignore
        return null;
      }
    }
  }

  addRule(parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    parent = parent || this.data;
    if (this.config.addRule) {
      this.config.addRule(parent);
    } else {
      const field = this.fields[0];
      parent.rules = parent.rules.concat([{
        // @ts-ignore
        field: field.value,
        operator: this.getDefaultOperator(field),
        value: this.getDefaultValue(field.defaultValue),
        entity: field.entity
      }]);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  removeRule(rule: Rule, parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    parent = parent || this.data;
    if (this.config.removeRule) {
      this.config.removeRule(rule, parent);
    } else {
      parent.rules = parent.rules.filter((r) => r !== rule);
    }
    this.inputContextCache.delete(rule);
    this.operatorContextCache.delete(rule);
    this.fieldContextCache.delete(rule);
    this.entityContextCache.delete(rule);
    this.ruleRemoveButtonContextCache.delete(rule);

    this.handleTouched();
    this.handleDataChange();
  }

  addRuleSet(parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    parent = parent || this.data;
    if (this.config.addRuleSet) {
      this.config.addRuleSet(parent);
    } else {
      parent.rules = parent.rules.concat([{ condition: 'and', rules: [] }]);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  removeRuleSet(ruleset?: RuleSet, parent?: RuleSet): void {
    if (this.disabled) {
      return;
    }

    ruleset = ruleset || this.data;
    parent = parent || this.parentValue;
    if (this.config.removeRuleSet) {
      this.config.removeRuleSet(ruleset, parent);
    } else {
      parent.rules = parent.rules.filter((r) => r !== ruleset);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  transitionEnd(): void {
    this.treeContainer.nativeElement.style.maxHeight = null;
  }

  toggleCollapse(): void {
    this.computedTreeContainerHeight();
    setTimeout(() => {
      this.data.collapsed = !this.data.collapsed;
    }, 100);
  }

  computedTreeContainerHeight(): void {
    const nativeElement: HTMLElement = this.treeContainer.nativeElement;
    if (nativeElement && nativeElement.firstElementChild) {
      nativeElement.style.maxHeight = (nativeElement.firstElementChild.clientHeight + 8) + 'px';
    }
  }

  changeCondition(value: string): void {
    if (this.disabled) {
      return;
    }

    this.data.condition = value;
    this.handleTouched();
    this.handleDataChange();
  }

  changeOperator(rule: Rule): void {
    if (this.disabled) {
      return;
    }

    if (this.config.coerceValueForOperator) {
      // @ts-ignore
      rule.value = this.config.coerceValueForOperator(rule.operator, rule.value, rule);
    } else {
      // @ts-ignore
      rule.value = this.coerceValueForOperator(rule.operator, rule.value, rule);
    }

    this.handleTouched();
    this.handleDataChange();
  }

  coerceValueForOperator(operator: string, value: any, rule: Rule): any {
    const inputType: string = this.getInputType(rule.field, operator);
    if (inputType === 'multiselect' && !Array.isArray(value)) {
      return [value];
    }
    return value;
  }

  changeInput(): void {
    if (this.disabled) {
      return;
    }

    this.handleTouched();
    this.handleDataChange();
  }

  changeField(fieldValue: string, rule: Rule): void {
    if (this.disabled) {
      return;
    }

    const inputContext = this.inputContextCache.get(rule);
    const currentField = inputContext && inputContext.field;

    const nextField: Field = this.config.fields[fieldValue];

    const nextValue = this.calculateFieldChangeValue(
      // @ts-ignore
      currentField, nextField, rule.value);

    if (nextValue !== undefined) {
      rule.value = nextValue;
    } else {
      delete rule.value;
    }

    rule.operator = this.getDefaultOperator(nextField);

    // Create new context objects so templates will automatically update
    this.inputContextCache.delete(rule);
    this.operatorContextCache.delete(rule);
    this.fieldContextCache.delete(rule);
    this.entityContextCache.delete(rule);
    this.getInputContext(rule);
    this.getFieldContext(rule);
    this.getOperatorContext(rule);
    this.getEntityContext(rule);

    this.handleTouched();
    this.handleDataChange();
  }

  changeEntity(entityValue: string, rule: Rule, index: number, data: RuleSet): void {
    if (this.disabled) {
      return;
    }
    let i = index;
    let rs = data;
    // @ts-ignore
    const entity: Entity = this.entities.find((e) => e.value === entityValue);
    const defaultField: Field = this.getDefaultField(entity);
    if (!rs) {
      rs = this.data;
      i = rs.rules.findIndex((x) => x === rule);
    }
    // @ts-ignore
    rule.field = defaultField.value;
    rs.rules[i] = rule;
    if (defaultField) {
      // @ts-ignore
      this.changeField(defaultField.value, rule);
    } else {
      this.handleTouched();
      this.handleDataChange();
    }
  }

  getDefaultValue(defaultValue: any): any {
    switch (typeof defaultValue) {
      case 'function':
        return defaultValue();
      default:
        return defaultValue;
    }
  }

  getOperatorTemplate(): TemplateRef<any> {
    const t = this.parentOperatorTemplate || this.operatorTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getFieldTemplate(): TemplateRef<any> {
    const t = this.parentFieldTemplate || this.fieldTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getEntityTemplate(): TemplateRef<any> {
    const t = this.parentEntityTemplate || this.entityTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getArrowIconTemplate(): TemplateRef<any> {
    const t = this.parentArrowIconTemplate || this.arrowIconTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getButtonGroupTemplate(): TemplateRef<any> {
    const t = this.parentButtonGroupTemplate || this.buttonGroupTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getSwitchGroupTemplate(): TemplateRef<any> {
    const t = this.parentSwitchGroupTemplate || this.switchGroupTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getRulesetAddRuleButtonTemplate(): TemplateRef<any> {
    const t = this.parentRulesetAddRuleButtonTemplate || this.rulesetAddRuleButtonTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getRulesetAddRulesetButtonTemplate(): TemplateRef<any> {
    const t = this.parentRulesetAddRulesetButtonTemplate || this.rulesetAddRulesetButtonTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getRulesetRemoveButtonTemplate(): TemplateRef<any> {
    const t = this.parentRulesetRemoveButtonTemplate || this.rulesetRemoveButtonTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getRuleRemoveButtonTemplate(): TemplateRef<any> {
    const t = this.parentRuleRemoveButtonTemplate || this.ruleRemoveButtonTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getEmptyWarningTemplate(): TemplateRef<any> {
    const t = this.parentEmptyWarningTemplate || this.emptyWarningTemplate;
    // @ts-ignore
    return t ? t.template : null;
  }

  getQueryItemClassName(local: LocalRuleMeta): string {
    let cls = this.getClassNames('row', 'connector', 'transition');
    cls += ' ' + this.getClassNames(local.ruleset ? 'ruleSet' : 'rule');
    if (local.invalid) {
      cls += ' ' + this.getClassNames('invalidRuleSet');
    }
    return cls;
  }

  getButtonGroupContext(): ButtonGroupContext {
    if (!this.buttonGroupContext) {
      this.buttonGroupContext = {
        parentValue: this.parentValue,
        addRule: this.addRule.bind(this),
        // @ts-ignore
        addRuleSet: this.allowRuleset && this.addRuleSet.bind(this),
        // @ts-ignore
        removeRuleSet: this.allowRuleset && this.parentValue && this.removeRuleSet.bind(this),
        getDisabledState: this.getDisabledState,
        $implicit: this.data
      };
    }
    return this.buttonGroupContext;
  }

  getRulesetAddRuleButtonContext(rule: Rule): RulesetAddRuleButtonContext {
    if (!this.rulesetAddRuleButtonContextCache.has(rule)) {
      this.rulesetAddRuleButtonContextCache.set(rule, {
        addRule: this.addRule.bind(this),
        getDisabledState: this.getDisabledState,
        $implicit: rule
      });
    }
    // @ts-ignore
    return this.rulesetAddRuleButtonContextCache.get(rule);
  }

  getRulesetAddRulesetButtonContext(rule: Rule): RulesetAddRulesetButtonContext {
    if (!this.rulesetAddRulesetButtonContextCache.has(rule)) {
      this.rulesetAddRulesetButtonContextCache.set(rule, {
        addRuleSet: this.addRuleSet.bind(this),
        getDisabledState: this.getDisabledState,
        $implicit: rule
      });
    }
    // @ts-ignore
    return this.rulesetAddRulesetButtonContextCache.get(rule);
  }

  getRulesetRemoveButtonContext(rule: Rule): RulesetRemoveButtonContext {
    if (!this.rulesetRemoveButtonContextCache.has(rule)) {
      this.rulesetRemoveButtonContextCache.set(rule, {
        removeRuleSet: this.removeRuleSet.bind(this),
        getDisabledState: this.getDisabledState,
        $implicit: rule
      });
    }
    // @ts-ignore
    return this.rulesetRemoveButtonContextCache.get(rule);
  }

  getRuleRemoveButtonContext(rule: Rule): RuleRemoveButtonContext {
    if (!this.ruleRemoveButtonContextCache.has(rule)) {
      this.ruleRemoveButtonContextCache.set(rule, {
        removeRule: this.removeRule.bind(this),
        getDisabledState: this.getDisabledState,
        $implicit: rule
      });
    }
    // @ts-ignore
    return this.ruleRemoveButtonContextCache.get(rule);
  }

  getFieldContext(rule: Rule): FieldContext {
    if (!this.fieldContextCache.has(rule)) {
      this.fieldContextCache.set(rule, {
        onChange: this.changeField.bind(this),
        getFields: this.getFields.bind(this),
        getDisabledState: this.getDisabledState,
        fields: this.fields,
        $implicit: rule
      });
    }
    // @ts-ignore
    return this.fieldContextCache.get(rule);
  }

  getEntityContext(rule: Rule): EntityContext {
    if (!this.entityContextCache.has(rule)) {
      this.entityContextCache.set(rule, {
        // @ts-ignore
        onChange: this.changeEntity.bind(this),
        getDisabledState: this.getDisabledState,
        entities: this.entities,
        $implicit: rule
      });
    }
    // @ts-ignore
    return this.entityContextCache.get(rule);
  }

  getSwitchGroupContext(): SwitchGroupContext {
    return {
      onChange: this.changeCondition.bind(this),
      getDisabledState: this.getDisabledState,
      $implicit: this.data
    };
  }

  getArrowIconContext(): ArrowIconContext {
    return {
      getDisabledState: this.getDisabledState,
      $implicit: this.data
    };
  }

  getEmptyWarningContext(): EmptyWarningContext {
    return {
      getDisabledState: this.getDisabledState,
      message: this.emptyMessage,
      $implicit: this.data
    };
  }

  getOperatorContext(rule: Rule): OperatorContext {
    if (!this.operatorContextCache.has(rule)) {
      this.operatorContextCache.set(rule, {
        // @ts-ignore
        onChange: this.changeOperator.bind(this),
        getDisabledState: this.getDisabledState,
        operators: this.getOperators(rule.field),
        $implicit: rule
      });
    }
    // @ts-ignore
    return this.operatorContextCache.get(rule);
  }

  getInputContext(rule: Rule): InputContext {
    if (!this.inputContextCache.has(rule)) {
      this.inputContextCache.set(rule, {
        onChange: this.changeInput.bind(this),
        getDisabledState: this.getDisabledState,
        options: this.getOptions(rule.field),
        field: this.config.fields[rule.field],
        $implicit: rule
      });
    }
    // @ts-ignore
    return this.inputContextCache.get(rule);
  }

  isRule(rule: Rule | RuleSet): rule is Rule {
    return !(rule as RuleSet).rules;
  }

  isRuleset(rule: Rule | RuleSet): rule is RuleSet {
    return !!(rule as RuleSet).rules;
  }

  isEmptyRuleset(rule: any): boolean {
    return rule.rules && rule.rules.length === 0;
  }

  private calculateFieldChangeValue(
    currentField: Field,
    nextField: Field,
    currentValue: any
  ): any {

    if (this.config.calculateFieldChangeValue != null) {
      return this.config.calculateFieldChangeValue(
        currentField, nextField, currentValue);
    }

    const canKeepValue = () => {
      if (currentField == null || nextField == null) {
        return false;
      }
      return currentField.type === nextField.type
        && this.defaultPersistValueTypes.indexOf(currentField.type) !== -1;
    };

    if (this.persistValueOnFieldChange && canKeepValue()) {
      return currentValue;
    }

    if (nextField && nextField.defaultValue !== undefined) {
      return this.getDefaultValue(nextField.defaultValue);
    }

    return undefined;
  }

  private checkEmptyRuleInRuleset(ruleset: RuleSet): boolean {
    if (!ruleset || !ruleset.rules || ruleset.rules.length === 0) {
      return true;
    } else {
      // @ts-ignore
      return ruleset.rules.some((item: RuleSet) => {
        if (item.rules) {
          return this.checkEmptyRuleInRuleset(item);
        } else {
          return false;
        }
      });
    }
  }

  private validateRulesInRuleset(ruleset: RuleSet, errorStore: any[]) {
    if (ruleset && ruleset.rules && ruleset.rules.length > 0) {
      ruleset.rules.forEach((item) => {
        if ((item as RuleSet).rules) {
          return this.validateRulesInRuleset(item as RuleSet, errorStore);
        } else if ((item as Rule).field) {
          const field = this.config.fields[(item as Rule).field];
          // @ts-ignore
          if (field && field.validator && field.validator.apply) {
            const error = field.validator(item as Rule, ruleset);
            if (error != null) {
              errorStore.push(error);
            }
          }
        }
      });
    }
  }

  private handleDataChange(): void {
    this.changeDetectorRef.markForCheck();
    if (this.onChangeCallback) {
      this.onChangeCallback();
    }
    if (this.parentChangeCallback) {
      this.parentChangeCallback();
    }
  }

  private handleTouched(): void {
    if (this.onTouchedCallback) {
      this.onTouchedCallback();
    }
    if (this.parentTouchedCallback) {
      this.parentTouchedCallback();
    }
  }

}
