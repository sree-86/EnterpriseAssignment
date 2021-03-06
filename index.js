var SERVER_NAME = 'product-api'
var PORT = process.env.PORT || 8080;
var HOST = '127.0.0.1';

//various counters
var getC = 0;
var postC = 0;
var delC = 0;
var restify = require('restify')


  // Get a persistence engine for the products
  , productsSave = require('save')('products')

  // Create the restify server
  , server = restify.createServer({ name: SERVER_NAME})

  server.listen(PORT, function () {
  console.log('Server %s listening at %s', server.name, server.url)
  console.log('Resources:')
  console.log(' /products')
  console.log(' /products/:id')  
})

server
  // Allow the use of POST
  .use(restify.fullResponse())

  // Maps req.body to req.params so there is no switching between them
  .use(restify.bodyParser())

// Get all products in the system
server.get('/products', function (req, res, next) {

  //Output log
  console.log('Get request received')

  // Increment counter
  getC++;
  showgetC(); //get function
  // Find every entity within the given collection
  
    // Send the product if no issues
    productsSave.find({}, function (error, products) { 
      if (products == '') {
      // Return all of the products in the system
      res.send(404, "No Products found. Please use 'POST' to send data")
    } else {
    // Send 404 header if the product doesn't exist
    res.send(products)
  }
})
  
})



// Create a new product
server.post('/products', function (req, res, next) {

  //Output log
  console.log('Post request received')

  //Increment counter
  postC++;
  showpostC(); //post function

  // Make sure name is defined
  if (req.params.name === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('name must be supplied'))
  }
  if (req.params.price === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('price must be supplied'))
  }
  if (req.params.quantity === undefined ) {
    // If there are any errors, pass them to next in the correct format
    return next(new restify.InvalidArgumentError('quantity must be supplied'))
  }
  var newProduct = { //create the product
		name: req.params.name, 
    price: req.params.price,
    quantity: req.params.quantity
	}

  // Create the product using the persistence engine
  productsSave.create( newProduct, function (error, product) {

    // If there are any errors, pass them to next in the correct format
    if (error) return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)))

    // Send the product if no issues
    res.send(201, product)
  })
})

server.del('/products', function(req, res, next) {

  //Output log
  console.log('Delete all request received')

  //Increment Counter
  delC++;
  showdelC();
  productsSave.deleteMany({}, function(error) {
    //send 200 ok response
    res.send(200, "All products have been deleted. Thank you for deleting") // message
  })

})

function showgetC(){
  console.log("Count for get request is:" + getC); //show the counter value for get
}

function showpostC(){
  console.log("Count for post request is:" + postC); //show the counter value for post
}

function showdelC(){
  console.log("Count for delete request is:" + delC); //show the counter value for delete
}
