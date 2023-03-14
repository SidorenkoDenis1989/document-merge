export class DisplayError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DisplayError';
    }
}
