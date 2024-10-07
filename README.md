# README #

This is a **Dragondelve Gacha** backend, a personal project of mine that aims to amuse my TRPG players
by allowing them to roll for characters in a small web application. 
This is the backend part written in NestJS + TypeORM. It was written with mongoDB and express originally.
If you want to see the express / mongoDB version you may want to checkout the v1.0 branch which holds the
original source code for thj gacha project.

### What is this repository for? ###

* Backend code of the **Dragondelve Gacha** project
* Current Version is: 0.1.0
* 
### How do I get set up? ###

In order to run this application set up a postgres database, copy the .env file from .env.example and set
- DB_HOST to your local database host *127.0.0.1* usually
- DB_PORT to your local database port *5432* is default
- DB_USERNAME to your local database username usually *postgres*
- DB_PASSWORD to the password for your database user
- DB_NAME to the testing database name (will be wiped so be careful)
- JWT_SECRET to any funny string of characters you can come up with, it's just used for JWT token's signature
- NODE_ENV to development
- EXPOSE_SWAGGER to true or false depending on whether you want swagger or not.

Then run *npm i* then you should be able to start it using *npm run start:dev* or *npm run start:debug* for debug.

### Contribution guidelines ###

* Code must have no linting errors to be accepted
* All code must contain sensible documentation in English using JSDocs
* All new endpoints must be documented using swagger in English.
* Don't pad
* When making a pull request write a short summary of the intended changes
* Before opening a pull request make sure your working branch isn't behind dev.
* Changes made upstream have higher priority than changes downstream
* Only commit code made during your work at PlanetFibers or code with permissive licenses
* If you're editing a file with a LICENSE copyright please update it accordingly with license rules

### Who do I talk to? ###

* FitzHastings on github.com.
