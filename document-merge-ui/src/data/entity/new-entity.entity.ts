import { v1 as uuid } from 'uuid';

export class NewEntity {
    id: string;
    isNew: boolean;

    constructor() {
        this.id = uuid();
        this.isNew = true;
    }

    public static create<T>(object: T): T & NewEntity {
        return { ...object, ...new NewEntity() };
    }

    public static isNew<T>(object: T): boolean {
        return !!object['isNew'];
    }

    public static from<T>(object: T & NewEntity): T {
        const copyObject = { ...object };
        delete copyObject.id;
        delete copyObject.isNew;
        return copyObject;
    }
}
