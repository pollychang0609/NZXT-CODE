/* tslint:disable */
/* eslint-disable */
/* istanbul ignore file */

import { Controller, ValidateParam, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
import { AuthController } from './../controller/auth/authController';


// --------------------
// add file upload middleware
// --------------------
import express, { Request, Response, Router } from 'express'
// import multer from 'multer'


// Data Model template
const models: TsoaRoute.Models = {
    "Result": {
        "dataType": "refObject",
        "properties": {
            "api_success": {"dataType":"boolean","required":true},
            "message": {"dataType":"string"},
            "isWarning": {"dataType":"boolean"},
            "data": {"dataType":"any"},
            "extra": {"dataType":"any"},
            "action": {"dataType":"string"},
            "url": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    
    "LoginRequest": {
        "dataType": "refObject",
        "properties": {
            "account": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    
};
const validationService = new ValidationService(models);


export function RegisterRoutes(router: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
        router.post('/api/v1/auth/login',
            async (context: any, response: any, next: any) => {
            const args = {
                    body: {"in":"body","name":"body","required":true,"ref":"LoginRequest"},
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
              console.error(error)
              context.status = error.status;
            //   context.throw(error.status, JSON.stringify({ fields: error.fields }));
              response.status(error.status).json(error.fields).end();
            }

            const controller = new AuthController();

            const promise = controller.login.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, response, next);
        });
        
        router.post('/api/v1/auth/logout',
            async (context: any, response: any, next: any) => {
            const args = {
            };

            let validatedArgs: any[] = [];
            try {
              validatedArgs = getValidatedArgs(args, context);
            } catch (error) {
              console.error(error)
              context.status = error.status;
            //   context.throw(error.status, JSON.stringify({ fields: error.fields }));
              response.status(error.status).json(error.fields).end();
            }

            const controller = new AuthController();

            const promise = controller.logout.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, response, next);
        });
        


  function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
    return Promise.resolve(promise)
        .then((data: any) => {
            let statusCode;
            if (controllerObj instanceof Controller) {
                const controller = controllerObj as Controller
                const headers = controller.getHeaders();
                Object.keys(headers).forEach((name: string) => {
                    response.set(name, headers[name]);
                });

                statusCode = controller.getStatus();
            }

            if (data || data === false) { // === false allows boolean result
                response.status(statusCode || 200).json(data);
            } else {
                response.status(statusCode || 204).end();
            }
        })
        .catch((error: any) => next(error));
    }

    

    function getValidatedArgs(args: any, request: any): any[] {
        const errorFields: FieldErrors = {};
        const values = Object.keys(args).map(function(key) {
            const name = args[key].name;
            // DEBUG ONLY
            // console.info(args[key].name + ': key=' + JSON.stringify(args[key]))
            // console.info(`query=${JSON.stringify(request.query)}`)
            // console.info(`params=${JSON.stringify(request.params)}`)
            // console.info(`header=${JSON.stringify(request.header)}`)
            // console.info(`body=${JSON.stringify(request.body)}`)
            switch (args[key].in) {
            case 'request':
                return request;
            case 'query':
                return ValidateParam(args[key], request.query[name], models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'path':
                return ValidateParam(args[key], request.params[name], models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'header':
                return ValidateParam(args[key], request.header(name), models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'body':
                return ValidateParam(args[key], request.body, models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            case 'body-prop':
                return ValidateParam(args[key], request.body[name], models, name, errorFields, undefined, {"noImplicitAdditionalProperties":"throw-on-extras"});
            }
        });

        if (Object.keys(errorFields).length > 0) {
            console.info(`errorFields=${JSON.stringify(errorFields)}`)
            console.info(`query=${JSON.stringify(request.query)}`)
            console.info(`params=${JSON.stringify(request.params)}`)
            console.info(`header=${JSON.stringify(request.header)}`)
            console.info(`body=${JSON.stringify(request.body)}`)
            throw new ValidateError(errorFields, '');
        }
        return values;
    }

    
}