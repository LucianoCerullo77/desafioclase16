const knex = require('knex')

class Mensajes{
    constructor(config, table){
        this.knex = knex(config)
        this.table = table
    }

    insertMessage(mensaje){
        const message = mensaje
        return this.knex.insert(message).into(this.table).then()
    }

    listMessage(){
        return this.knex.select('*').table(this.table)  
    }

}

module.exports = Mensajes;