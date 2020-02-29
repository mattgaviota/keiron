# Ticket App

This app was made with Lumen, React and Mysql

## Instructions

In order to test this app you need Docker, Docker compose and npm. Then you must
execute these instructions in a terminal.

1. git clone https://github.com/mattgaviota/keiron.git
2. cd keiron
3. docker-compose up -d
4. docker-compose exec --user=$UID back bash
5. composer install
6. cp .env.example .env
7. php artisan migrate --seed
8. exit
9. cd ticket-app
10. cp .env.development.local.example .env.development.local
11. npm install
12. npm start

Then you can visit http://localhost:3000. The defaults users / pass are:

* admin@tickets.test / 123456
* usuario@tickets.test / 1234

## Considerations

The port for the API is the 8080, if you don't have that port available, you can
change it in the docker-compose.yml file and then update the .env.development.local
inside ticket-app to update the base url for the API.

The admin user can create, edit, delete and assign tickets for the users.
The users can ask for more tickets and see what tickets are assigned to them.
