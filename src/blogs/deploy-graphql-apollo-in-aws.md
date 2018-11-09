---
title: Deploy graphql apollo server at aws
description: Introduce how to deploy apollo server at aws use EC2 instance.
tags: Nodejs, English, Deploy
image: https://cdn.stocksnap.io/img-thumbs/960w/SHPHVPLC7T.jpg
---
# Deploy graphql apollo server at aws.

This my blog [GEORGE FANG](http://fangkaihang.com) Apollo Server 2 use graphql query language, and deploy by ec2 instance at aws using nginx and postgres. FYI, the client side repository is [graphql-blog client aws s3](https://github.com/Azrealy/graphql-blog-client-aws-s3)

## Features

* Node.js with Express and Apollo Server 2
  * cursor-based Pagination
* PostgreSQL or Sqlite Database with Sequelize
  * entities: users
* Authentication
  * powered by JWT and local storage
  * Sign Up, Sign In, Sign Out
* Authorization
  * protected endpoint (e.g. verify valid session)
  * protected resolvers (e.g. e.g. session-based, role-based)
  * protected routes (e.g. session-based, role-based)
* performance optimizations
  * example of using Facebook's dataloader
* E2E testing

## Todo

* ~~Improve client side rendering speed. (Build index.html or use server rendering.)~~
* Improve the safety level for postgres database.
* ~~Separate the production, develop and test environment.~~
* Add a publish or editing status fields for post model.
* ~~Refactor client file system.~~
* Improve usability of the CMS post table CRUD post interaction.
* ~~Make node.js proxy for connecting server and client.~~

**Most Important TODO:** Create server and client TESTS!!

# Deploy at aws EC2.

## Set up an EC2 instance

Make sure you have aws account, then in your `Console Home Page` chick the `EC2` link at `Services` dropdown. Chick the `Launch Instance` button. Configuration your EC2 instance by the following steps.

1. **Choose an Amazon Machine Image (AMI)**, choice the `free tier eligible` labeled instance which will no charge bill in the first year of newer at AWS, here I use `Ubuntu Server 16.04 LTS(HVM), SSD Volume Type` as my virtual machine.

2. **Choose an Instance Type** Leave it at `General purpose t2.micro free tier eligible`. And then chick the buttion of `Next: Configure Instance Details`.

3. **Configure Instance Details** Use the default setting, chick `Next Add Storage` button.

3. **Add Storage** Use the default setting, chick `Next Add Tags`

4. **Add Tags** If you have launched many instance, this will help your to identify you virtual machine usage. Here you named as `my-blog-key` and `my-blog-value`.

5. **Configure Security Group** Choice thr radio button labeled `create a new security group` and you can give a name and description. Add the HTTP and HTTPs type by default Protocol and Port Range. Chick `Review and Launch`.

6. **Review Instance Launch** Chick the `Launch` button then you will see a window popup. Choice the `Create a new key pair` and type in a name or use the exist key pair for launch thi instance. Just make sure you have the key pair correctly at your localhost.

## Set up ssh connection

On your local machine, go to your root directory, store the `key.pem` file to the directory of `~/.ssh/`.

Run `chmod -R 400 ~/.ssh/key.pem` for change your key pair mode.

Then run
```bash
$ ssh -i ~/.ssh/key.pem ubuntu@<your-amazion-ec2-public-dns>
```
connect to your aws virtual machine.

## Connect to Github

Run `$ ssh-keygen -t rsa -b 4096 -C "your-email""` to create an ssh key. The terminal may prompt you to enter a file name in which to save the key and dome passphrases. You can just continue to hit the enter button to save your key in the default file, and without passphrase.

Get you ssh key use the `$ cat ~/<path to you key>/id_rsa.pub`. And copy the string within, then go to github your account setting page. Redirect to `SSH and GPG keys` page, chick `New SSH key` button and paste your copied string.

Then you can `git clone` your repository in EC2 like this.
```bash
$ git clone git@git-to-this-repository
```

## Install Node.js and node modules

For using this repository to create server your need to install nodejs and npm through run the commands.
```bash
$ sudo apt-get update
$ sudo apt-get install nodejs
$ sudo apt install nodejs-legacy
$ sudo apt-get install build-essential
$ sudo apt-get install npm
```
Then go through the following part to install this server.

## Install and configure PostgreSQL

Run the following command to create ad DB user.
```
$ sudo apt-get install postgresql postgresql-contrib
$ sudo -i -u postgres
$ psql
$ create role ubuntu;
$ alter role ubuntu with superuser;
$ alter role ubuntu with createdb;
$ alter role ubuntu with login;
$ alter role ubuntu with password '<db password>';
$ \q
$ exit
$ sudo vim /etc/postgresql/10/main/pg_hba.conf

(In pg_hba.conf, find the rows labeled IPv4 and IPv6, and change 'md5' to 'password')

$ sudo systemctl restart postgresql
$ createdb <db name>
```
For check the database worked you can use `psql <db name>` to access you database. Fill out the `.env` by the setting the variables <db name>, <db password> from create db. After the editing, use `sequelizeDB.js` file to make sure you can access to db and it set up correctly.

#### Config .env file

```javascript
// Set TEST_DATABASE for handling the test and develop environment 
// And in develop environment you sqlite3 as database.
TEST_DATABASE=sqlite:/tmp/sqlite-db.db

or

// At production model need set the DB, DB user, DB password for postgres.
DATABASE=<db name>
DATABASE_USER=ubuntu
DATABASE_PASSWORD=<db password>

// SECRET is required at all environment. 
SECRET=<JWT secret>

// PORT define the port you server listen to. Default 8000.
PORT=<server port>
```

The `SECRET` is just a random string for your authentication. Keep all these information secure by adding the *.env* file to your *.gitignore* file. No third-party should have access to this information.

#### Start Server

* `touch .env`
* `npm install`
* `npm start`
* run `npm run usercli` following the prompt to create user which can access to CMS page.
* run `npm run filecli` choice the directory where include the markdown files your want post to your blog.
* visit `http://localhost:<server post>/graphql` access graphql playground.

## Install and configure Nginx.

Run the following command to install nginx.
```bash
$ sudo apt-get install nginx
$ sudo ufw default deny incoming
$ sudo ufw default allow outgoing
$ sudo ufw allow ssh
$ sudo ufw allow 'Nginx HTTP'
$ sudo ufw enable
$ sudo ufw status (should say active)
$ systemctl status nginx
$ sudo vim /etc/nginx/sites-available/default 
$ sudo nginx -t
```
fix the `/etc/nginx/sites-available/default` file like following.
```
location / {
  proxy_pass http://localhost:<server port>;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection 'upgrade';
  proxy_set_header Host $host;
  proxy_cache_bypass $http_upgrade;
}
```
Then you can access `http://<amazon-dns>/graphql` to see graphql playground.

#### Testing

* adjust `test-server` npm script with `TEST_DATABASE` environment variable in package.json to match your testing database name
  * to match it from package.json: `createdb mytestdatabase` with psql
* one terminal: npm run test-server
* second terminal: npm run test

