# Pesta Sains Nasional 2020 API (PSN 2020 API)

## Description
Pesta Sains Nasional is a yearly event organized by FMIPA IPB. PSN 2020 API is an API for backend service of Pesta Sains Nasional 2020 Official Site.

## Developer
Developer team by codepanda.id  
[Visit codepanda.id website](https://codepanda.id "codepanda's official site")

## Version
This version v2.0.0 is the latest version and the production version.

## Set Up
1. Clone this repo  
    `git clone https://github.com/muhammad-fakhri/psn2020-backend.git`

2. Change directory to repo folder  
    `cd psn2020-backend/`

3. Install dependencies  
    `npm install`

4. Copy .env.copy to .env and set the values inside .env  
    `cp .env.copy .env && nano .env`  
   When you are done setting the values inside .env, close it.

5. Seed data to mongodb by using mongo-seeding-cli. You must first install mongo-seeding-cli using these command  
    `npm install -g mongo-seeding-cli`  
   then run the seed command  
    `seed -u 'mongodb://127.0.0.1:27017/mydb' --drop-database ./data-import`

6. Done