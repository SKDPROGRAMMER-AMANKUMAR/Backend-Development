# chai aur backend series

This is a video series on backend with javascript

- [Model link(data modeling)](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

## Difference b/w Dependenies and devDependencies

### Dependencies
 These packages are essential for the app to run in production.
 ````javascript
 npm install <package-name> --save
# In recent npm versions, the `--save` is implicit.
 ````
 Example:- 
 ````javascript
 "dependencies": {
  "express": "^4.18.2"
}
 ````

 ### DevDependencies 
 The DevDependencies are the  dependencies that we just use in  devlopment time , and didn't take to deployement (Only Development time)

 ````javascript
 npm install <package-name> --save-dev
 ````
 Example:-
 ````javascript
 "devDependencies": {
  "eslint": "^8.50.0"
}
 ````
 
 ## Link of all about API with Express.js 👇👇
  [Express API Request(req) and Response(res)](https://expressjs.com/en/5x/api)
  >>Most of the time you'll only be on Request and Response ['https://expressjs.com/en/5x/api.html']
>> You've to only use app.use() in case of CORS , middlewares and configuration 

## Read about this server status codes (important)

[Server Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

## Why and where  to use middlewares and how to use it 

[Excalidraw link for Middlewares](https://excalidraw.com/#json=Hwn2oD7pCo_NZYK9cLm2V,a_vjPx4-r1FJu3idK6z7UA)