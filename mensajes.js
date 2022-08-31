const knex = require('knex')

class Mensajes{
    constructor(config, table){
        this.knex = knex(config)
        this.table = table
        this.save()
    }

    async createTable(config){
        const knex = this.knex
        const tableName = this.table
        const table = await knex.raw(`CREATE TABLE IF NOT EXISTS ${tableName}`)
        return table
    }

    async insertMessage(mensaje){
        const message = mensaje
        return await this.knex.insert(message).into(this.table).then()
    }

    async listMessage(){
        return await this.knex.select('*').table(this.table)  
    }

    async getContent() {
        let content;
        await this.createTable();
        await this.knex.from(this.table).select("*")
        .then(rows => {
            content = rows
        })
        .catch(err => {
            console.log(err);
        });
        return content;
    }

    async save(data) {
        try {
            await this.getContent(data);
        }
        catch (error) {
            console.log("No se pudo agregar el objeto al archivo.");
            return null;
        }
    }

}

module.exports = Mensajes;
