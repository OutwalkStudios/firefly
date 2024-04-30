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
- [Building Controllers](#building-controllers)
- [Building Services](#building-services)
- [Dependency Injection](#dependency-injection)
- [Error Handling](#error-handling)
- [Platform (Express)](#express-platform)
- [Database (Mongoose)](#mongoose-database)
- [Custom Integrations](#custom-integrations)
- [CLI Commands](#cli-commands)

---

## Building Controllers

Controllers are classes marked with the `@Controller()` decorator that are used to define your routes and handle incoming http requests. Controllers use file based routing by default, this means the route url will be the path relative to the `src` directory. For example creating `src/tasks/tasks.controller.js` will result in a route being created at `/tasks`. You can opt-out of file based routing by passing the route to the controller decorator.

Each route can be defined using an http method decorator, Firefly provides a decorator for all http methods. If you want to do something more advanced, there is also the `@Http()` decorator that accepts a method and route argument. All standard http decorators accepts a route argument that defaults to `/`.

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
        return this.tasks.find((task) => task == req.params.id);
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

## Express Platform

Firefly is platform agnostic. The controller decorators provide metadata to the class which is handled by the application interface,
out of the box, Firefly provides a platform binding for express, enabling integration with the entire express ecosystem.

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

Firefly is database agnostic. Out of the box, Firefly provides a database driver for MongoDB with Mongoose.

**Example:**
```js
import { Application } from "@outwalk/firefly";
import { ExpressPlatform } from "@outwalk/firefly/express";
import { MongooseDriver } from "@outwalk/firefly/mongoose";

/* setup the platform and global middleware */
const platform = new ExpressPlatform();

/* setup the database and global plugins */
const database = new MongooseDriver();
database.plugin(import("mongoose-autopopulate"));

/* start the application */
new Application({ platform, database }).listen();
```

Firefly also provides additional helper decorators such as `@Entity()` and `@Prop()`. Its worth noting that when using TypeScript you must extend `Model` from mongoose to get the proper types. This is not required in JavaScript but is still recommended.

**Example:**
```js
import { Entity, Prop } from "@outwalk/firefly/mongoose";
import { Model } from "mongoose";

@Entity()
export class Task extends Model {

    @Prop(String) name;

    @Prop(Boolean) isDone;
}
```

Mongoose plugins are supported via the `plugins` array option provided by the entity decorator. These plugins will only apply to the current entity. Its worth noting that schema plugins are required to be static imports because the Entity decorator is unable to resolve dynamic imports before the model is compiled.

**Example:**
```js
import { Entity } from "@outwalk/firefly/mongoose";
import mongooseAutoPopulate from "mongoose-autopopulate";

@Entity({ plugins: [mongooseAutoPopulate] })
```
---

## Custom Integrations

Firefly provides `Platform` and `Database` classes to create your own integrations for use with the Firefly framework. Instances of these objects can be passed into the Application interface.

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
    
    async connect() {}
}
```

---

## CLI Commands

Firefly provides a set of commands that power the build process and launching of the application. The build and start command both accept a `--dev` option which will run it in dev mode.

```
# build the application
firefly build

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
