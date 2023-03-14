export class ValidateField {
    isValid: boolean;
    helperText?: string;

    constructor(helperText?: string) {
        this.helperText = helperText;
        this.isValid = helperText ? false : true;
    }
}
