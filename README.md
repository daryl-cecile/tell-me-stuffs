# tell-me-stuffs

This project uses [Bun](https://bun.sh) as the package manager and runtime. Make sure you have it installed before running the commands below. You can alternatively use `npm` or `yarn` to run the commands; however, you will need to modify the code accordingly (Some Bun APIs are used throughout the project. e.g `Bun.file(..)`, `Bun.Glob(..)`, etc.)

To get started, make sure you have a `.env` file in the root directory with the following variables:

```sh
DATABASE_URL=postgres://librarian_user:librarian@localhost:5432/librarianvdb
```

(You can change the database URL to whatever you want, but make sure you have a database with the same name as the one in the URL)

Next up, make sure to add all markdown files you want to be searchable in the `kb` directory. We will use these files to generate embeddings for the search queries. The files can be nested in directories. You can put whole documentation repositories in here if you want. For example https://handbook.gitlab.com/

> [!IMPORTANT] Make sure you have ollama running on the same machine as this project. You will need to have the `llama3.2` and `mxbai-embed-large` models installed. You can do this by running the following commands:
> ```sh
> ollama install llama3.2
> ollama install mxbai-embed-large
> ```

Then, run the following commands:

```sh
bun install
bun db:up # This will spin up the docker container with the database
```

In another terminal, run the following commands:

```sh
bun db:migrate # This will create a migration for the database with the correct tables
bun db:apply # This will apply the migration to the database
```

After running these commands successfully, you can start playing around with the LLM by running the following:

```sh
bun start
```

On first run, this will attempt to load all the markdown (.md) files in the `kb` directory and store their embeddings in the database. This may take a while depending on the number of files in the directory. Subsequent runs will only load new files - if any exist.

