define(function () {
    'use strict';
    class DataModule {
        static domain = 'http://tensor-school.herokuapp.com';
        
        static async query(relativeURL, method, contentType, body) {
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
                return await response.json();
            }
            throw new Error('[DataModule]' + response.statusText);
        }

        static async getQuery(relativeURL, params) {
            let url = relativeURL;
            if(params) {
                url = `${relativeURL}?${new URLSearchParams(params)}`
            }
            return await this.query(url, 'GET')
        }

        static async postQuery(relativeURL, params, contentType = 'application/x-www-form-urlencoded') {
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
            return await this.query(relativeURL, 'POST',  contentType, body);
        }

        static async jsonQuery(relativeURL, params) {
            return await this.postQuery(relativeURL, params, 'application/json');
        }

        static async pngQuery(relativeURL, file) {
            return await this.postQuery(relativeURL, file, 'image/png');
        }
    }

    return DataModule;
})