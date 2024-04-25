import { Database } from "./database";
import mongoose from "mongoose";

/* A driver to connect to a mongodb database using mongoose */
export class MongooseDriver extends Database {

    constructor(options = {}) {
        super();
        
        this.options = options;
        this.url = options.url ?? process.env.DATABASE_URL;
    }

    plugin(plugin) { mongoose.plugin(plugin) }

    async connect() {
        await mongoose.connect(this.url, this.options).catch((error) => { throw error; });
        mongoose.connection.on("error", (error) => { throw error; });
    }
}

/* a decorator to create a schema and return a model in mongoose */
export function Entity(options = {}) {
    return (target) => {
        /* remove the prototype chain, this enables extending Model */
        const entity = new Object();
        entity.constructor._props= target._props;

        /* update the schema with default property values */
        const props = Object.entries(entity).filter(([key, value]) => target._props[key] && value != undefined);
        props.forEach(([key, value]) => target._props[key] = { type: target._props[key], default: value });

        const schema = new mongoose.Schema(target._props, options);
        return new mongoose.model(target.name, schema.loadClass(target));
    };
}

/* a decorator to define schema properties on an entity */
export function Prop(type) {
    /* process the type to resolve references to other models */
    const processType = (type) => {
        if (type.name == "model") {
            return { type: mongoose.Types.ObjectId, ref: type.modelName }
        }

        if (Array.isArray(type) && type[0].name == "model") {
            return [{ type: mongoose.Types.ObjectId, ref: type[0].modelName }];
        }

        if (Object.getPrototypeOf(type) === Object.prototype) {
            for (let name of Object.getOwnPropertyNames(type)) {
                type[name] = processType(type[name]);
                if (name == "type") break;
            }
        }

        return type;
    };

    return (target, key) => {
        target.constructor._props = target.constructor._props ?? {};
        target.constructor._props[key] = processType(type);
    };
}