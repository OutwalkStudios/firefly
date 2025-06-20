# @outwalk/firefly

A modern scalable web framework.

![Actions](https://github.com/OutwalkStudios/firefly/workflows/build/badge.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/OutwalkStudios/firefly/blob/main/LICENSE)
[![Follow Us](https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg)](https://twitter.com/OutwalkStudios)

---

## Installation

You can install @outwalk/firefly using npm:

```
npm install @outwalk/firefly
```

---

 Table of Contents
-----------------
- [Application](#application)
- [Building Controllers](#building-controllers)
- [Building Services](#building-services)
- [Async Constructors](#async-constructors)
- [Dependency Injection](#dependency-injection)
- [Error Handling](#error-handling)
- [Event Driven Architecture](#event-driven-architecture)
- [Platform (Express)](#express-platform)
- [Database (Mongoose)](#mongoose-database)
- [Custom Integrations](#custom-integrations)
- [CLI Commands](#cli-commands)

---

## Application

Your Firefly application starts with the `Application` interface. This object takes in `platform` and `database` options, loads the application based on the file based routing and decorators, and sends the data to the chosen platform to be converted into functioning http routes. The the application's `listen()` method accepts a port and defaults to 8080. This method is what starts the Firefly application.

When you start a new Firefly project, your index.js should look something like this:

```js
import { Application } from "@outwalk/firefly";
import { ExpressPlatform } from "@outwalk/firefly/express";
import { MongooseDatabase } from "@outwalk/firefly/mongoose";

/* setup the platform and global middleware */
const platform = new ExpressPlatform();

/* setup the database and global plugins */
const database = new MongooseDatabase();

/* start the application */
new Application({ platform, database }).listen();
```
---

## Building Controllers

Controllers are classes marked with the `@Controller()` decorator. They are used to define your routes and handle incoming http requests. Controllers use file based routing. This means the route url will be the path relative to the `src` directory. For example creating a controller inside `src/tasks` will result in a route being created at `/tasks`. The actual name of the controller file does not matter as long as it ends with `.controller.js`. Optionally you can change the route of the controller by passing it to the `@Controller()` decorator. Its important to note that this only replaced the immediate route fragment, in the tasks example this would replace the `/tasks` in `src/tasks`.

Each route can be defined using an http method decorator, Firefly provides a decorator for all http methods such as `@Get()` and `@Post()`. If you want to do something more advanced, there is also the `@Http()` decorator that accepts a method and route argument. All standard http decorators accepts a route argument that defaults to `/`.

Route methods recieve the platforms request and response objects as arguments. Additionally You can return responses
directly from the route method. The returned value will be serialized and sent as the response.

Controllers are only detected by Firefly when naming your files ending with `.controller.js`. Ex: `tasks.controller.js`.

**Example:**
```js
import { Controller, Get } from "@outwalk/firefly";

@Controller()
export class TaskController {

    tasks = ["task 1", "task 2", "task 3"];

    @Get()
    getTasks() {
        return this.tasks;
    }

    @Get("/:id")
    getTaskById(req, res) {
        return this.tasks.find((task) => task == req.params.id);
    }
}
```

### Middleware

Controllers also have support for middleware via the `@Middleware()` decorator. This decorator can be applied to the entire controller or to specific routes.
Any values passed into the decorator are associated with the appropriate routes and the underlying platform handles connecting them.

In the following example we apply the `cors` middleware to both the entire controller and to the `getTasks` route method.

**Example:**
```js
import { Controller, Middleware, Get } from "@outwalk/firefly";
import cors from "cors";

@Controller()
@Middleware(cors())
export class TaskController {

    tasks = ["task 1", "task 2", "task 3"];

    @Get()
    @Middleware(cors())
    getTasks() {
        return this.tasks;
    }

    @Get("/:id")
    getTaskById(req, res) {
        return this.tasks.find((task) => task == req.params.id);
    }
}
```

---

## Building Services

Services are classes marked with the `@Injectable()` decorator that are used to write business logic and interact with a database. Services are automatically available to controllers and other services through [dependency injection](#dependency-injection).

Services are only detected by Firefly when naming your files ending with `.service.js`. Ex: `tasks.service.js`.

**Example:**
```js
import { Injectable } from "@outwalk/firefly";

@Injectable()
export class TaskService {

    tasks = ["task 1", "task 2", "task 3"];

    async getTasks() {
        return this.tasks;
    }

    async getTaskById(id) {
        return this.tasks.find((task) => task == id);
    }
}
```

---

## Async Constructors

Firefly heavily relies on classes for its API, you can use the normal class constructor but this does not support async functionlity. As an alternative for both controllers and services, you can import the `@Init()` decorator and decorate a class method with it. This method will become an async constructor and get called during construction time of the controller or service.

```js
import { Controller, Init } from "@outwalk/firefly";
import { Task } from "./task.entity";

@Controller()
export class TaskController {

    @Init()
    async init() {
        await Task.create({ name: "task 1" }).exec();
    }
}
```


---

## Dependency Injection

Dependency injection is a a technique that allows objects to define their dependencies through instance properties and have them provided through the framework rather than constructing them itself. This works great for creating services to share business logic or share object values across different parts of the application.

In Firefly you can define an object that can be injected using the `@Injectable()` decorator as outlined in the [Building Services](#building-services) section. In order to inject a dependency we can use the `@Inject()` decorator inside a controller or service. The Inject decorator requires the property name to be the camlCase version of the service class name, otherwise the service can be imported and passed as an argument to the Inject decorator.

In the following example we will utilze the service created in the previous section, and update the controller from the [Building Controllers](#building-controllers) section to use dependency injection.

**Example:**
```js
import { Controller, Inject, Get } from "@outwalk/firefly";

@Controller()
export class TaskController {

    @Inject() taskService;

    @Get()
    getTasks() {
        return this.taskService.getTasks();
    }

    @Get("/:id")
    getTaskById(req, res) {
        return this.taskService.getTaskById(req.params.id);
    }
}
```

You can also resolve an injection outside the normal lifecycle. This can be done with the `Application.resolveInjection` method.

**Example:**
```js
const taskService = Application.resolveInjectable(TaskService)
```

---

## Error Handling

Firefly has built-in error handling, you can throw an error from anywhere in the lifecycle and it will automatically catch it and respond with a 500 status code by default. Optionally you can use our provided error objects for throwing specific errors. Error objects are provided for all 4xx and 5xx status codes, and you can use `HttpError` to specify your own status code.

In this example we update the service created in the [Building Services](#building-services) section to throw a 404 error when a task is not found.

**Example:**
```js
import { Injectable } from "@outwalk/firefly";
import { NotFound } from "@outwalk/firefly/errors";

@Injectable()
export class TaskService {

    tasks = ["task 1", "task 2", "task 3"];

    async getTasks() {
        if (this.tasks.length == 0) {
            throw new NotFound("There are no tasks.");
        }

        return this.tasks;
    }

    async getTaskById(id) {
        if (!this.tasks.includes(id)) {
            throw new NotFound("The requested task was not found.");
        }

        return this.tasks.find((task) => task == req.params.id);
    }
}
```

---

## Event Driven Architecture

Firefly supports utilizing an event driven architecture by utilizing the `EventEmitter` injectable. Firefly also provides an optional `@EventListener` and `@Event` decorator to define your event handlers in files ending with `.events.js`.

You can emit an event and pass any data you would like as the second function argument using the `EventEmitter.emit` method. Additionally in places where the `@Event` decorator is not a viable solution, you can use the `EventEmitter.on` method to define a event listener.

**Example:**
```js
import { Inject } from "@outwalk/firefly";
import { EventListener, EventEmitter, Event } from "@outwalk/firefly/events";

@EventListener()
export class TaskEvents {

    @Inject() eventEmitter;

    constructor() {
        this.eventEmitter.on("task.created", (task) => {
            console.log("Task Created: " + task.name);
        });
    }

    createTask() {
        this.eventEmitter.emit("task.created", { id: 1, name: "Task 1" });
    }

    @Event("task.created")
    onTaskCreated(task) {
        console.log("Task Created: " + task.name);
    }
}
```

---

## Express Platform

Firefly is platform agnostic. The controller decorators provide metadata to the class which is handled by the application interface,
out of the box, Firefly provides a platform binding for express, enabling integration with the entire express ecosystem.

Firefly also extends the Express Request object by adding a `rawBody` property to it, which is useful for webhook signature validation. When using typescript you can access the request typing for this by importing `RawBodyRequest` from `@outwalk/firefly/express`.

**Example:**
```js
import { Application } from "@outwalk/firefly";
import { ExpressPlatform } from "@outwalk/firefly/express";
import cors from "cors";

/* setup the platform and global middleware */
const platform = new ExpressPlatform();
platform.use(cors());

/* start the application */
new Application({ platform }).listen();
```

---

## Mongoose Database

Firefly is database agnostic. Out of the box, Firefly provides a database object for MongoDB with Mongoose.
When utilizing a database, you must configure the database connection before running the application. The MongooseDatabase object provides automatic detection of the `DATABASE_URL` environment variable, this is the suggested method of connecting but you can also pass a url option to the MongooseDatabase constructor.

**Example:**
```js
import { Application } from "@outwalk/firefly";
import { ExpressPlatform } from "@outwalk/firefly/express";
import { MongooseDatabase } from "@outwalk/firefly/mongoose";

/* setup the platform and global middleware */
const platform = new ExpressPlatform();

/* setup the database and global plugins */
const database = new MongooseDatabase();
database.plugin(import("mongoose-autopopulate"));

/* start the application */
new Application({ platform, database }).listen();
```

Firefly also provides additional helper decorators such as `@Entity()` and `@Prop()`. In order for the entity decorator to properly understand how to compile your entity, you must extend either `Model` or `Schema` which are the direct mongoose objects with modified types. For defining virtual properties, Firefly provides the `@Virtual()` decorator which can be used in place of the `@Prop()` decorator.

**Example:**
```js
import { Entity, Model, Prop } from "@outwalk/firefly/mongoose";

@Entity()
export class Task extends Model {

    @Prop(String) name;

    @Prop(Boolean) isDone;
}
```

In cases where you have a complex prop with nested properties, you may want to use a Subdocument. Firefly supports this via the `@Entity()` decorator, this allows you to create a class that supports all the same features as a normal entity, but rather than extend `Model` and be in its own collection, you can extend `Schema` and nest it inside another entity. this works similar to a entity reference but does not require populating it.

**Example:**
```js
import { Entity, Schema, Model, Prop } from "@outwalk/firefly/mongoose";

@Entity()
export class Price extends Schema {

    @Prop(String) currency;

    @Prop(Number) amount;
}

@Entity()
export class Product extends Model {

    @Prop(String) name;

    @Prop(Price) price;
}
```

Mongoose plugins are supported via `@Plugin()` decoraotr. These plugins will only apply to the current entity. Its worth noting that these plugins are required to be static imports because the Entity decorator is unable to resolve dynamic imports before the model is compiled.

**Example:**
```js
import { Entity, Plugin } from "@outwalk/firefly/mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

@Entity()
@Plugin(mongooseAutoPopulate)
```

Firefly also provides support for defining an index on the Mongoose schema. This can be done via the `@Index()` decorator.

**Example:**
```js
import { Entity, Index } from "@outwalk/firefly/mongoose";

@Entity()
@Index({ name: "text" }, { weights: { name: 10 } })
```

In more complex cases you may want to extend from another entity. For example, this enables the ability to have an array typed with a super class that all sub classes can be stored in.
In mongoose you can do this using the `Model.discriminator` function. This can still be done with the entity decorator, however you can also just extend the parent model like any other class.

**Example:**
```js
import { Entity, Model, Prop } from "@outwalk/firefly/mongoose";

@Entity()
export class Animal extends Model { ... }

@Entity()
export class Dog extends Animal { ... }

@Entity()
export class Person extends Model {

    @Prop([Animal]) pets;
}

const person = await Person.findOne(...).exec();
person.pets.push(new Dog());
```

---

## Custom Integrations

Firefly provides `Platform` and `Database` classes to create your own integrations for use with the Firefly framework. Instances of these objects can be passed into the Application interface. The Database interface provides a `displayConnectionMessage()` method to only display the connection message on the first load.

**Platform Example:**
```js
import { Platform } from "@outwalk/firefly";

class CustomPlatform extends Platform {
    
    loadController(route, middleware, routes) {}

    loadErrorHandler() {}

    listen(port) {}
}
```

**Database Example:**
```js
import { Database } from "@outwalk/firefly";

class CustomDatabase extends Database {
    
    async connect() {
        super.displayConnectionMessage();
    }

    isConnected() { 
        return false
    }
}
```

---

## CLI Commands

Firefly provides a set of commands that power the build process and launching of the application. The build and start command both accept a `--dev` option which will run it in dev mode.

```
# build the application
firefly build

# lint the application's source code
firefly lint

# start the application
firefly start

# log the firefly version
firefly --version

# log the help menu
firefly --help
```

---

## Reporting Issues

If you are having trouble getting something to work with Firefly or run into any problems, you can create a new [issue](https://github.com/OutwalkStudios/firefly/issues).

---

## License

Firefly is licensed under the terms of the [**MIT**](https://github.com/OutwalkStudios/firefly/blob/main/LICENSE) license.
