import { Database } from "./database";
import mongoose from "mongoose";

/* A driver to connect to a mongodb database using mongoose */
export class MongooseDriver extends Database {

    constructor(options = {}) {
        super();

        this.options = options;
        this.url = options.url ?? process.env.DATABASE_URL;
    }

    plugin(plugin) {
        if (plugin instanceof Promise) mongoose.plugin(async () => await plugin);
        else mongoose.plugin(plugin);
    }

    async connect() {
        if (!this.url) throw new Error("You must provide a url to MongooseDriver.");
        
        await mongoose.connect(this.url, this.options).catch((error) => { throw error; });
        mongoose.connection.on("error", (error) => { throw error; });
    }
}

/* a decorator to create a schema and return a model in mongoose */
export function Entity(options = {}) {
    return (target) => {
        /* remove the prototype chain, this enables extending Model */
        const entity = new Object();
        entity.constructor._props = target._props;

        /* update the schema with default property values */
        const props = Object.entries(entity).filter(([key, value]) => target._props[key] && value != undefined);
        props.forEach(([key, value]) => target._props[key] = { type: target._props[key], default: value });

        const schema = new mongoose.Schema(target._props, options);
        return new mongoose.model(target.name, schema.loadClass(target));
    };
}

/* a decorator to define schema properties on an entity */
export function Prop(type) {
    const isObject = (obj) => obj != undefined && Object.getPrototypeOf(obj) === Object.prototype;
    const isModel = (obj) => obj?.name == "model";

    /* process the type to resolve references to other models */
    const processType = (type) => {
        /* the type is a model */
        if (isModel(type)) {
            return { type: mongoose.Types.ObjectId, ref: type.modelName };
        }

        /* the type is an array */
        if (Array.isArray(type)) {

            /* the type is a nested model */
            if (isObject(type[0])) {
                type[0] = processType(type[0]);

                return type;
            }

            /* subtype is a model */
            if (isModel(type[0])) {
                return [{ type: mongoose.Types.ObjectId, ref: type[0].modelName }];
            }
        }

        /* the type is an object */
        if (isObject(type)) {

            /* subtype is an array */
            if (Array.isArray(type?.type)) {
                type.type = processType(type.type);

                return type;
            }

            /* subtype is a model */
            if (isModel(type?.type)) {
                type.ref = type.type.modelName;
                type.type = mongoose.Types.ObjectId;

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