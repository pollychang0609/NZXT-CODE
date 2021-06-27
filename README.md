# About this project

This is poc for NZXT and it's only include backend api.
The front-end part, [click here](https://github.com/pollychang0609/nzxt-ui)

## Requirement

Write a web app using the Python flask framework, which contains a static web page, and a back-end function. Then write 3 different types of test for it, including unit tests, web API tests (HTTP request tests), and user interface tests. Requirements as below.

### Front-end static page:

* [X] A static web page for users to enter a user name, password, and a button to log in.

* [X] Sends an HTTP web request when the login button is pressed.

* [X] Display login success or failure message after getting a response from the back-end.

* [X] Write it in HTML.

### Back-end service:

* [X] Gets requests from the front-end and verify if the credentials match or not.

* [X] Response the match or not result to front-end.

* [X] ~~Write it with python and the flask framework.~~ Replace by jest.

### Unit test:

* [X] Test the function that verifies if the credentials match with different test cases.

* [X] ~~Write it using python unittest or pytest.~~ Replace by jest.

### API test:

* [X] Test back-end service to see if it responses correctly.

* [] Write it using cucumberjs framework, with any of the HTTP client modules supported, the language should be Typescript (or Javascript).

### UI test:

* [X] End to end tests to see if the whole feature works.

* [X] End to end tests to see if the whole feature works.
Write it using webdriverIO with cucumberjs framework, the language used to write test steps and page objects should be Typescript (or Javascript).


Note: Feel free to change the Python parts to any of the framework you prefer, as long as it meets the requirements!


## Framework 
- [tsoa](https://github.com/lukeautry/tsoa)
  
  generate router and swagger document


- [supertest](https://www.npmjs.com/package/supertest)

    Restful API testing

- [jest](https://jestjs.io/)

    Testing

## Library

* [aes-js](https://www.npmjs.com/package/aes-js)

    A pure JavaScript implementation of the AES block cipher algorithm and all common modes of operation (CBC, CFB, CTR, ECB and OFB)

* [passport](https://www.npmjs.com/package/passport)

    Passport is Express-compatible authentication middleware for Node.js.

* [passport strategy](https://www.npmjs.com/package//passport-local)

    Passport strategy for authenticating with a username and password.

* [express-session](https://github.com/expressjs/session)
    
    session

* [cors](https://www.npmjs.com/package/cors)

    CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.

## Database

* [mongo](https://hub.docker.com/_/mongo)

     - docker image

        ```shell
        docker pull mongo
        ```

    - docker-compose.yml 
        ```yml
        version: '3'
        services:
            database:
                image: mongo
                container_name: mongo-latest 
                ports:
                    - "27017:27017"

        ```
     - docker-compose command
        ```shell
        docker-compose up        // start 
        docker-compose down      // stop
        ```
## Run



## Reference

- [CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)