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
 