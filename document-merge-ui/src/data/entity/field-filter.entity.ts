import { v1 as uuid } from 'uuid';

export class FieldFilter {
    id: string;
    fieldName: string;
    logicOperator: LOGIC_OPERATORS;
    operator: FIELD_FILTER_OPERATORS;
    value: string;

    constructor() {
        this.id = uuid();
        this.logicOperator = LOGIC_OPERATORS.AND;
    }
}

export enum FIELD_FILTER_OPERATORS {
    BEFORE = 'before',
    AFTER = 'after',
    EQUAL = 'equal',
    NOT_EQUAL = 'not_equal',
    CONTAINS = 'contains',
    STARTS_WITH = 'startsWith',
    ENDS_WITH = 'endsWith',
    IS_EMPTY = 'isEmpty',
    IS_NOT_EMPTY = 'isNotEmpty',
}

export enum LOGIC_OPERATORS {
    AND = 'and',
    OR = 'or',
}
