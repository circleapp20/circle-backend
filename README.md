# Circle

This is the circle backend project built by Amo Timothy Kofi. Circle is a platform where students and organizations can request services such as errands, deliveries and many others. This repository contains the code for the backend services for circle such as registrations, messaging and many others. Contributors to this project must follow the laid out code of conduct.

This project is built with Typescript, therefore it's highly recommended for contributors to understand the basics of Typescript in order to contribute well to the development of the service. The project is broken into 2 sections. The web and the backend api. Each of these sections have been explained in details in the README files in the src folder.

## Development

Circle was developed using node version 12.18.0 and yarn version 1.22.4. Install this version of node and yarn using either nvm or downloading the specific versions from the website.

You need to have Google Cloud account and a firebase account. These can be easily accessed if you have a gmail account. Circle makes use of nodemailer to send its own mail to various clients.

The nodemailer makes use of Google OAuth2 to send emails to clients. Check [here]() to setup nodemailer with Google OAuth2

SMS messages are handled by MNotify, which you need to have an account and a senderId. After creating the account, you need to get the api key in order to send message.

Notice that there is a .env.example file. Here contains an example of the private credentials that Circle uses.

After creating all the accounts and accessing the various keys, just make a copy of the .env.example file then rename it to .env and place the keys in here corresponding with the appropriate service provider.

It's preferred that you use yarn for the development of Circle, though you can use npm but the package-lock.json file should not be committed, this could cause issues with the node packages.

After, setting up the project with the credentials, run the following command below. this will ensure that your database is correctly setup and build the necessary files for next js.

```bash
yarn dev
```

## Deployment

Circle uses heroku auto deploy CI with github in order to deploy the server. The branch for deployment of circle is the master branch.

When deploying the server, all tests are run before deploy using github actions. The configuration can be found [here](.github/workflows/node.js.yml).

Should a test fail, the deployment is cancelled, therefore it's critical that all tests must be written correctly and passes successfully.

To test the build for circle, run the command below. This will build the web application, as well as the server itself

```bash
yarn build
```
