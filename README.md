# QUESTR - Anonymous Q&A Application

<p align="center">
  <img src="https://i.imgur.com/KAhUMk0.png" alt="Logo" width="500" />
</p>

This repository contains the question microservice portion of the Questr Q&A application.

## QUESTR - All Repositories

- [Frontend](https://github.com/Neography7/questr-front)
- [API Gateway](https://github.com/Neography7/questr-gateway)
- [User Microservice](https://github.com/Neography7/questr-user-srvc)
- [Auth Microservice](https://github.com/Neography7/questr-auth-srvc)
- [Question Microservice](https://github.com/Neography7/questr-question-srvc)
- [GRPC Protos](https://github.com/Neography7/questr-proto)
- [Deployment](https://github.com/Neography7/questr-deployment)

## Description

The API Gateway operates as a GraphQL server, managing requests and effectively directing them to the Auth, User, and Question microservices. It acts as an intermediary, ensuring seamless communication between the frontend's GraphQL requests and the microservices through GRPC. Additionally, it efficiently delivers responses from the microservices to the frontend in the form of GraphQL responses.

For communication with the microservices, the API Gateway relies on the structures provided in the GRPC Proto Repository, ensuring standardized and efficient interactions.

Furthermore, it utilizes Socket.IO to enable real-time notifications for new questions, delivering instant notifications to users. Developed using Nest.js, the API Gateway orchestrates these operations, serving as a central point for managing and directing requests within the platform.

## Technologies

- **Nest.js:** Employed for developing the microservice architecture.
- **MongoDB:** Utilized for database storage.
- **TypeORM:** Used as an ORM for database interactions.
- **gRPC:** Used for communication between microservices.
- **i18next:** Used for internationalization (i18n) support.
- **class-validator:** Used for validation within Nest.js.
- **class-transformer:** Used for object transformation within Nest.js.
- **JWT:** Utilized for session authentication and token generation.

## Installing

Note: Please don't forget to use this service with api-gateway and question and auth microservices.

First setup the env file, provide microservice urls.

```env
NODE_ENV=production

AUTH_SERVICE=0.0.0.0:5001
USER_SERVICE=0.0.0.0:5002
QUESTION_SERVICE=0.0.0.0:5003
```

And then, install the packages.

```bash
# Install required packages
npm install
```

Lastly start the service. Api-Gateway graphql server will run on port 5000 and websocket/socket.io will run on 1000.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## License

This project is licensed under the [Beerware License](LICENSE).

If you find this project useful and we ever meet, you might consider buying me a beer in return.

## Contact

If you have any questions or feedback regarding the project, feel free to get in touch:

- Email: ilkerakyel97@gmail.com
- LinkedIn: [İlker Akyel](https://www.linkedin.com/in/ilker-akyel/)
- Website: [ilkerakyel.com](https://www.ilkerakyel.com)