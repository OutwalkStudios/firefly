import { logger } from "../../utils/logging";

/* this is an abstract class for creating databases for the Application interface */
export class Database {

    /* this method displays the database connection message only on the first load */
    displayConnectionMessage() {
        if (!process.env.FIREFLY_DISABLE_LOGGING) {
            logger.log("connecting to database...");
        }
    }
    
    connect() { 
        throw new Error("connect() is unimplemented.");
    }

    isConnected() {
        throw new Error("isConnected() is unimplemented.");
    }
}