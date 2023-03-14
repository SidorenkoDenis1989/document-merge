export class ILMConfiguration {
    id: number;
    host: string;
    port: number;
    label: string;

    constructor({ id, host, port, label }: ILMConfiguration) {
        this.id = id;
        this.host = host;
        this.port = port;
        this.label = label;
    }
}
