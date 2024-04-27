import { Application } from "@outwalk/firefly";
import { ExpressPlatform } from "@outwalk/firefly/express";
import { MongooseDriver } from "@outwalk/firefly/mongoose";

/* setup the platform and global middleware */
const platform = new ExpressPlatform();

/* setup the database and global plugins */
const database = new MongooseDriver();

/* start the application */
new Application({ platform, database }).listen();
