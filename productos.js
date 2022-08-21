
class Productos {
    constructor(opcion, table){
        this.knex = require("knex")(opcion)
        this.table = table
    }

    createTable() {
        if (this.knex.schema.hasTable(this.table)) {
            console.log('La tabla ya existe')
        } else {
            this.knex.schema.createTable(this.table, (table) => {
                if (this.table === 'productos') {
                    table.increments('id')
                    table.string('tittle')
                    table.string('descripcion')
                    table.number('price')
                    table.string('foto_url')
                } else {
                    table.increments('id')
                    table.string('nombre')
                    table.string('mensaje')
                }
            })
            .then (() => {
                console.log('Tabla creada')
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    create(product){
        const producto = { id: 0, ...product}
        return this.knex.insert(producto).into(this.table).then()
    }

    update(id, producto){
        return this.knex.from(this.table).where('id', id).update(producto)
    }

    getAll(){
        return this.knex.select('*').table(this.table)    
    }

    deleteById(id){
        return this.knex.from(this.table).where('id', id).del()
    }

}

module.exports = Productos
