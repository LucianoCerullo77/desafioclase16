const { options } = require("../data/knexDB");
const knex = require("knex")(options);

class Messages {
  constructor(fileName) {
    this.fileName = "./data/" + fileName + ".txt";
  }
  async getAll() {
    try {
      const content = await knex.from("messages").select("*");
      return content;
    } catch (error) {
      console.log(error);
    }
  }
  async save(obj) {
    try {
      let content = await knex.from("messages").select("*");

      const data = JSON.parse(JSON.stringify(content));
      const time = timestamp();
      let message = {};
      if (data.length > 0) {
        message = { ...obj, id: data[data.length - 1].id + 1, timestamp: time };
        await knex("messages").insert(message);
      } else {
        message = { ...obj, id: 1, timestamp: time };
        await knex("messages").insert(message);
      }

      return message;
    } catch (error) {
      console.log(error);
    }
  }
}

function timestamp() {
  let date = new Date();
  let dateStr =
    "(" +
    ("00" + (date.getMonth() + 1)).slice(-2) +
    "/" +
    ("00" + date.getDate()).slice(-2) +
    "/" +
    date.getFullYear() +
    " - " +
    ("00" + date.getHours()).slice(-2) +
    ":" +
    ("00" + date.getMinutes()).slice(-2) +
    ":" +
    ("00" + date.getSeconds()).slice(-2) +
    ")";

  return dateStr;
}

const messages = new Messages("messages");

module.exports = { messages };