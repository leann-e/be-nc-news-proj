# NC-News

## Summary

This Northcoders News API is a solo backend project for the Northcoders Bootcamp which utilises endpoints to retrieve data.

It is written in JavaScript, with a backend that utilites Node.js, Express and PostgreSQL. Full TDD is included, which can be tested with Jest.

## Hosted

The hosted version of this project is available [here](https://nc-news-leanne.herokuapp.com/api).

## API

A full list of the available endpoints is available [here](https://nc-news-leanne.herokuapp.com/api).

## Cloning the Repo

1. Fork and clone this repo.

2. Run `npm install` to install all the required dependencies.

3. Create two new environment variable files using .env.\*, but replace the wildcard (\*) with test and development. Within these two files, add:

```
PGDATABASE=database_name
```

Replace "database_name" with `nc_news` and `nc_news_test` in the correct file.
Do not add ; to the end.

4. Run `npm run setup-dbs`. This creates two databases: one for development and one for testing.

5. Run `npm run seed` to seed the development database.

6. Run `npm run prepare` to set-up husky.

7. Run `npm test` to run the entire test suite, **or** run `npm test <file_path>` to run a specific testing file.

8. Run `npm run seed:prod` for Heroku deployment.

## Versions

This project was completed using Node.js v18.3.0 and Postgres v14.5.
