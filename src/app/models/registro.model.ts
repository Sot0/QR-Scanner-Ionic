export class Registro {

    public format: string;
    public text: string;
    public type: string;
    public icon: string;
    public createdDate: Date;

    constructor( format: string, text: string) {
        this.format = format;
        this.text = text;
        this.createdDate =  new Date();
        this.getType();
    }

    private getType() {
        const inicioTexto = this.text.substring(0, 4);
        switch(inicioTexto) {
            case 'http':
                this.type = 'http'
                this.icon = 'globe';
                break;
            case 'geo:':
                this.type = 'geo'
                this.icon = 'location';
                break;
            default: 
                this.type = 'No reconocido'
                this.icon = 'create';
                break;
        }
    }

}