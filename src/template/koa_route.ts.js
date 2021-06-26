/* tslint:disable */
/* eslint-disable */
/* istanbul ignore file */

{{#if canImportByAlias}}
import { Controller, ValidateParam, ValidationService, FieldErrors, ValidateError, TsoaRoute } from 'tsoa';
{{else}}
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute } from from '../../../src';
{{/if}}
{{#if iocModule}}
import { iocContainer } from '{{iocModule}}';
{{/if}}
{{#each controllers}}
import { {{name}} } from '{{modulePath}}';
{{/each}}
{{#if authenticationModule}}
import { koaAuthentication } from '{{authenticationModule}}';
{{/if}}


// --------------------
// add file upload middleware
// --------------------
import express, { Request, Response, Router } from 'express'
// import multer from 'multer'


// Data Model template
const models: TsoaRoute.Models = {
    {{#each models}}
    "{{@key}}": {
        {{#if enums}}
        "dataType": "refEnum",
        "enums": {{{json enums}}},
        {{/if}}
        {{#if type}}
        "dataType" : {{json this.dataType}},
        "type" :   {{json this.type}},
        {{/if}}
        {{#if properties}}
        "dataType": "refObject",
        "properties": {
            {{#each properties}}
            "{{@key}}": {{{json this}}},
            {{/each}}
        },
        "additionalProperties": {{{json additionalProperties}}},
        {{/if}}
    },
    
    {{/each}}
};
const validationService = new ValidationService(models);


export function RegisterRoutes(router: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################
    {{#each controllers}}
    {{#each actions}}
        router.{{method}}('{{fullPath}}',
            {{#if security.length}}
            authenticateMiddleware({{json security}}),
            {{/if}}
            async (context: any, response: any, next: any) => {
            const args = {
                {{#each parameters}}
                    {{@key}}: {{{json this}}},
                {{/each}}
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

            {{#if ../../iocModule}}
            const controller: any = iocContainer.get<{{../name}}>({{../name}});
            if (typeof controller['setStatus'] === 'function') {
                controller.setStatus(undefined);
            }
            {{else}}
            const controller = new {{../name}}();
            {{/if}}

            const promise = controller.{{name}}.apply(controller, validatedArgs as any);
            return promiseHandler(controller, promise, response, next);
        });
        
    {{/each}}
    {{/each}}


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
                return ValidateParam(args[key], request.query[name], models, name, errorFields, undefined, {{{json minimalSwaggerConfig}}});
            case 'path':
                return ValidateParam(args[key], request.params[name], models, name, errorFields, undefined, {{{json minimalSwaggerConfig}}});
            case 'header':
                return ValidateParam(args[key], request.header(name), models, name, errorFields, undefined, {{{json minimalSwaggerConfig}}});
            case 'body':
                return ValidateParam(args[key], request.body, models, name, errorFields, undefined, {{{json minimalSwaggerConfig}}});
            case 'body-prop':
                return ValidateParam(args[key], request.body[name], models, name, errorFields, undefined, {{{json minimalSwaggerConfig}}});
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