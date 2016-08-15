//HOLMES UPLOAD

//How im thinking the upload process should work.

//Method 1:
//So we have an api in node which allows us to save files to the node file location /rawfiles.
//Then a user passess that filename through the url, then we run a js func to translate it and return the urn
//then we pass it to the initialise function and return the view.

//Method 2:
//We have an api that we pass a file url to, and then we put that to our autodesk bucket in a func which returns the urn,
//we then get that urn and pass to our init func. We can do this in node by using the app.get and in the function request we create the file from the url we post.
//then we post it to our bucket in autodesk. and return the urn in the response. Call this in the init api method where the urn param is required.

//Lets do method 2!
