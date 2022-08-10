const knex = require('knex')

class Productos {
    constructor(config, table){
        this.knex = knex(config)
        this.table = table
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

export default Productos