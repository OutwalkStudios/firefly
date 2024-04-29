# @outwalk/create-firefly

A scaffolding tool for creating Firefly projects.

![Actions](https://github.com/OutwalkStudios/firefly/workflows/build/badge.svg)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/OutwalkStudios/firefly/blob/main/LICENSE)
[![Follow Us](https://img.shields.io/badge/follow-on%20twitter-4AA1EC.svg)](https://twitter.com/OutwalkStudios)

---

## Usage

Create a Firefly project by running the following command and then follow the prompts.

```
npm create @outwalk/firefly
```

You can also specify settings via command line options.

```
npm create @outwalk/firefly my-app --language typescript
```

### Command Line Options.

The first argument passed to the command will be used as the project name/directory, Other settings can be configured using the following command line options:

```
# Specify the language
-l, --language

# Specify the platform
-p, --platform

# Specify the database
-d, --database

# Prevnt automatic dependency installation
--skip-install

# Prevent initilizing a new git repository
--skip-git

# Ignore any warnings (dangerous)
--force
```
---

## Reporting Issues

If you are having trouble getting something to work with Firefly or run into any problems, you can create a new [issue](https://github.com/OutwalkStudios/firefly/issues).

---

## License

Firefly is licensed under the terms of the [**MIT**](https://github.com/OutwalkStudios/firefly/blob/main/LICENSE) license.