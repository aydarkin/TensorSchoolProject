define(function () {
    'use strict';
    class DataModule {
        static domain = 'https://tensor-school.herokuapp.com';
        
        static async query(relativeURL, method, contentType, body, waitResult = true) {
            let params = {
                method: method,
                credentials: 'include',
            };
            if (contentType) {
                params = {
                    ...params,
                    headers: {
                        'Content-Type': contentType,
                    }
                }
            }
            if(body) {
                params = {...params, body: body }
            }

            const response = await fetch(this.domain + relativeURL, params);
            if(response.status >= 200 && response.status < 300) {
                if(waitResult) {
                    return await response.json();
                }
                return;
            }
            throw new Error('[DataModule]' + response.statusText);
        }

        static async getQuery(relativeURL, params, waitResult = true) {
            let url = relativeURL;
            if(params) {
                url = `${relativeURL}?${new URLSearchParams(params)}`
            }
            return await this.query(url, 'GET', waitResult)
        }

        static async postQuery(relativeURL, params, contentType = 'application/x-www-form-urlencoded', waitResult = true) {
            let body;
            switch (contentType) {
                case 'application/x-www-form-urlencoded':
                    body = new URLSearchParams(params).toString();
                    break;           
                case 'application/json':
                case 'application/json;charset=utf-8': 
                    body = JSON.stringify(params);  
                    break;
                default:
                    body = params;
                    break;
            }
            return await this.query(relativeURL, 'POST',  contentType, body, waitResult);
        }

        static async jsonQuery(relativeURL, params, waitResult = true) {
            return await this.postQuery(relativeURL, params, 'application/json', waitResult);
        }

        static async pngQuery(relativeURL, file, waitResult = true) {
            return await this.postQuery(relativeURL, file, 'image/png', waitResult);
        }
    }

    return DataModule;
})