

## Environment Requirement :
- Node >= v16.x 


## Client :
- Change the values of the following parameters in `client\config\config.js`.
    * BAS_CLIENT_ID  
    * BAS_APP_ID

- run `client\index.html`.



## Server :
- Change the values of following parameters in `.env` :-
    * BAS_CLIENT_ID = 
    * BAS_CLIENT_SECERT=
    * BAS_BASE_URL=
    * BAS_APP_ID=
    * BAS_MKEY=

    use the data provided by BASGATE 
- Run the api using the command:
    `nodemon .\server\api\server.js`