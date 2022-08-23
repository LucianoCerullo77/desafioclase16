
class Productos {
    constructor(opcion, table){
        this.knex = require("knex")(opcion)
        this.table = table
        this.createTable();
    }

    async createTable() {
        try {
            if ( await this.knex.schema.hasTable(this.table)) {
                console.log('La tabla ya existe')
            } else {
                await this.knex.schema.createTable(this.table, (table) => {
                    if (this.table === 'productos') {
                        table.increments('id')
                        table.string('tittle')
                        table.string('descripcion')
                        table.integer('price')
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
        catch(err) {
            console.log(err)
        }
    }

    async insertData(data){

        try {
            await this.createTable()
            const producto = { id: 0, ...data}
            return  await this.knex.insert(producto)
            .insert(this.table)
            .then(() => {
                console.log("Producto insertado");
            })
        }
        catch(err) {
            console.log(err);
        }
    }

    async update(id, producto){
        return await this.knex.from(this.table).where('id', id).update(producto)
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

    async getAll(){
        let content;
        try {
            content = await this.getContent
        }
        catch (err){
            console.log(err);
        }
        return content   
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


    async deleteById(id){
        return await this.knex.from(this.table).where('id', id).del()
    }

}

module.exports = Productos
