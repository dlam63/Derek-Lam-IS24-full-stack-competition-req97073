const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const fs = require('fs');
const src = 'products.json';
let products = JSON.parse(fs.readFileSync(src));

let highestId = 0;
for (let i = 0; i < products.length; ++i) {
  if (products[i].productId > highestId) {
    highestId = products[i].productId;
  }
}

const editFields = ['productName', 'scrumMasterName', 'productOwnerName', 'Developers', 'methodology'];
const createFields = ['productName', 'scrumMasterName', 'productOwnerName', 'Developers', 'startDate', 'methodology'];

app.get('/api', (req, res) => {
  if (highestId) {
    res.send('Healthy');
  } else {
    res.status(503).send('Unhealthy');
  }
});

app.delete('/api/product/:productId', (req, res) => {
  res.status(202).send('maybe');
});

app.get('/api/product', (req, res) => {

  let qScrumMasterName = req.query['scrumMasterName'];
  let qDevelopers = req.query['Developers'];

  // BONUS User Story Four
  if (qScrumMasterName) {

    let results = [];
    qScrumMasterName = qScrumMasterName.toLowerCase();

    for (let i = 0; i < products.length; ++i) {
      if (products[i].scrumMasterName.toLowerCase() == qScrumMasterName) {
        results.push(products[i]);
      }
    }

    res.json(results);

  // BONUS User Story Five
  } else if (qDevelopers) {

    let results = [];
    qDevelopers = qDevelopers.toLowerCase();

    for (let i = 0; i < products.length; ++i) {
      for (let j = 0; j < products[i].Developers.length; ++j) {
        if (products[i].Developers[j].toLowerCase() == qDevelopers) {
          results.push(products[i]);
          break;
        }
      }
    }

    res.json(results);

  } else {

    //all products
    //user story one lisa
    res.json(products);

  }

});

app.get('/api/product/:productId', (req, res) => {
  let product = null;
  let id = req.params['productId'];

  for (let i = 0; i < products.length; ++i) {
    if (products[i]['productId'] == id) {
      product = products[i];
      break;
    }
  }

  if (product) {
    res.json(product);
  } else {
    res.status(404).send('id does not exist');
  }
});

//edit product user story one alan
app.put('/api/product/:productId', (req, res) => {
  let product = null;
  let id = req.params['productId'];

  for (let i = 0; i < products.length; ++i) {
    if (products[i]['productId'] == id) {
      product = products[i];
      break;
    }
  }

  if (product) {
    for (let i = 0; i < editFields.length; ++i) {
      if (!req.body[editFields[i]]) {
        res.status(400).send('check json');
        break;
      }
      product[editFields[i]] = req.body[editFields[i]];
    }

    // remove numerical keys, ensure array not object with keys
    product['Developers'] = Object.values(product['Developers']);

    fs.writeFileSync(src, JSON.stringify(products));
    res.json(product);
  } else {
    res.status(404).send('id does not exist');
  }
});

//add product user story two lisa
app.post('/api/product', (req, res) => {
  let product = {};

  for (let i = 0; i < createFields.length; ++i) {
    if (!req.body[createFields[i]]) {
        res.status(400).send('check json');
        break;
    }
    product[createFields[i]] = req.body[createFields[i]];
  }

  product['productId'] = ++highestId;

  // remove numerical keys, ensure array not object with keys
  product['Developers'] = Object.values(product['Developers']);

  products.push(product);
  fs.writeFileSync(src, JSON.stringify(products));
  res.json(product);
});

app.listen(port, () => {
  console.log('listen started for Derek Lam');
});