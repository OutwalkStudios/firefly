# Outwalk Firefly

![build](https://github.com/OutwalkStudios/firefly/workflows/build/badge.svg)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/OutwalkStudios/firefly/blob/main/LICENSE)
[![twitter](https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg)](https://twitter.com/OutwalkStudios)

Firefly is a modern scalable web framework for developing server side applications.
Firefly provides a clean and scalable architecture enabling you to quickly build your applications without worrying about the major design decisons of your codebase.

---

## Documentation

* [Getting Started](#getting-started)
* [API Documentation](https://github.com/OutwalkStudios/firefly/tree/main/packages/firefly#table-of-contents)
* [CLI Documentation](https://github.com/OutwalkStudios/firefly/tree/main/packages/firefly#cli-commands)

---

## Getting Started

### Create a new Project

You can create a new project by running the following command. This prompts for project choices then will generate your new project, install the required dependencies, and initialize a new git repository. More information about this command can be found in the [@outwalk/create-firefly](https://github.com/OutwalkStudios/firefly/tree/main/packages/create-firefly#outwalkcreate-firefly) package.

```
npm create @outwalk/firefly@latest
```

### Run the Application

Firefly provides commands to build and run your application for development and production.
You can start with the dev command which will build the project, watch for changes, and reload the node process whenever you make a change. Its worth noting that when utilizing a database, you will need to configure the database connection before running the application.

```
# navigate to the project folder
cd <app-name>

# launch the project in development mode
npm run dev
```

---

## Reporting Issues

If you are having trouble getting something to work with Firefly or run into any problems, you can create a new [issue](https://github.com/OutwalkStudios/firefly/issues).

---

## License

Firefly is licensed under the terms of the [**MIT**](https://github.com/OutwalkStudios/firefly/blob/main/LICENSE) license.