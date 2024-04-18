import mongoose from "mongoose";

/* A driver to connect to a mongodb database using mongoose */
export class MongooseDriver {

    constructor(options = {}) {
        this.url = options.url ?? process.env.DATABASE_URL;
    }

    async connect() {
        await mongoose.connect(this.url);
    }

    use(plugin) {
        mongoose.plugin(plugin);
    }
}

/* a decorator to create a schema and return a model in mongoose */
export function Entity(options = {}) {
    return (target) => {
        /* update the schema with default property values */
        const props = Object.entries(new target()).filter(([key, value]) => target._meta.props[key] && value != undefined);
        props.forEach(([key, value]) => target._meta.props[key] = { type: target._meta.props[key], default: value });

        const schema = new mongoose.Schema(target._meta.props, options);
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
        target.constructor._meta = target.constructor._meta ?? { props: {} };
        target.constructor._meta.props[key] = processType(type);
    };
}