import { Database } from "./database";
import mongoose from "mongoose";

/* An object to connect to a mongodb database using mongoose */
export class MongooseDatabase extends Database {

    constructor(options = {}) {
        super();

        this.options = options;
        this.url = options.url ?? process.env.DATABASE_URL;
    }

    async plugin(plugin) {
        mongoose.plugin((plugin instanceof Promise) ? (await plugin).default : plugin);
    }

    async connect() {
        if (!this.url) throw new Error("You must provide a url to MongooseDatabase.");

        await mongoose.connect(this.url, this.options).catch((error) => { throw error; });
        mongoose.connection.on("error", (error) => { throw error; });
    }

    static get connection() {
        return mongoose.connection;
    }
}

/* create a mongoose entity */
export function Entity(options) {
    return (target) => {
        /* remove the prototype chain, this enables extending Model or Schema */
        const type = Object.getPrototypeOf(target.prototype).constructor.name;
        Object.setPrototypeOf(target, Object.prototype);

        /* update the schema with default property values */
        const props = Object.entries(target).filter(([key, value]) => target._props[key] && value != undefined);
        props.forEach(([key, value]) => target._props[key] = { type: target._props[key], default: value });

        const schema = new mongoose.Schema(target._props, options);

        /* apply indexes to the schema before compiling the model */
        (target._indexes ?? []).forEach((index) => schema.index(...index));

        /* apply plugins to the schema before compiling the model */
        (target._plugins ?? []).forEach((plugin) => schema.plugin(plugin));

        if (!["Schema", "Model"].includes(type)) {
            throw new Error(`${target.name} must extend either Schema or Model.`);
        }

        return (type == "Schema") ? schema.loadClass(target) : new mongoose.model(target.name, schema.loadClass(target));
    };
}

/* a decorator to define an index on the database */
export function Index(...index) {
    return (target) => {
        target._indexes = target._indexes ?? [];
        target._indexes.push(index);
    };
}

/* a decorator to apply a plugin to the schema */
export function Plugin(plugin) {
    return (target) => {
        target._plugins = target._plugins ?? [];
        target._plugins.push(plugin);
    };
}

/* a decorator to define schema properties on an entity */
export function Prop(type) {
    const isObject = (obj) => obj != undefined && Object.getPrototypeOf(obj) === Object.prototype;
    const isEntity = (obj) => obj?.name == "model";
    const isNested = (obj) => obj?.name == "Schema";

    /* process the type to resolve references to other models */
    const processType = (type) => {
        /* the type is an entity */
        if (isEntity(type)) {
            return { type: mongoose.Types.ObjectId, ref: type.modelName };
        }

        /* the type is a nested entity */
        if (isNested(type)) return type;

        /* the type is an array */
        if (Array.isArray(type)) {

            /* the type is a nested model */
            if (isObject(type[0])) {
                type[0] = processType(type[0]);

                return type;
            }

            /* subtype is an entity */
            if (isEntity(type[0])) {
                return [{ type: mongoose.Types.ObjectId, ref: type[0].modelName }];
            }

            /* subtype is a nested entity */
            if (isNested(type[0])) return type[0];
        }

        /* the type is an object */
        if (isObject(type)) {

            /* subtype is an array */
            if (Array.isArray(type?.type)) {
                type.type = processType(type.type);

                return type;
            }

            /* subtype is an entity */
            if (isEntity(type?.type)) {
                type.ref = type.type.modelName;
                type.type = mongoose.Types.ObjectId;

                return type;
            }

            /* the type is a nested entity */
            if (isNested(type?.type)) {
                type.type = type;

                return type;
            }

            /* search the remaining properties and process them */
            for (let name of Object.getOwnPropertyNames(type)) {
                type[name] = processType(type[name]);
            }
        }

        return type;
    };

    return (target, key) => {
        target.constructor._props = target.constructor._props ?? {};
        target.constructor._props[key] = processType(type);
    };
}