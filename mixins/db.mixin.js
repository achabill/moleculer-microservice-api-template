const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");

module.exports = function (collection, uri) {
    let db = {
        mixins: [DbService],
        collection: collection
    };

    if (process.env.NODE_ENV === "test") return db;

    if (!uri) {
        uri = "mongodb://localhost:27017/template";
    }
    db.adapter = new MongooseAdapter(uri, {
        useNewUrlParser: true
    });
    return db;
};
