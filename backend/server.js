const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Etag', 'Last-Modified']
  };


app.use(cors(corsOptions));
app.use(express.json());

let product = {
    id: 1,
    name: "Laptop Gamer",
    price: 1500,
    lastUpdated: new Date("2026-02-26T10:00:00Z").toUTCString()
};

app.get('/data', (req, res) => {
    const data = {
        message: "Hola, este es la información en tu Caché :("
    };

    const etag = `"${Buffer.from(JSON.stringify(data)).toString('base64')}"`;
    console.log(`etag ${etag}`);
    
    if (req.headers['if-none-match'] === etag) {
        res.status(304).end();
    } else {
    
        res.setHeader('ETag', etag);
        res.json(data);
    }
});

app.get('/product', (req, res) => {
    const ifModifiedSince = req.headers['if-modified-since'];

    if (ifModifiedSince && new Date(ifModifiedSince) >= new Date(product.lastUpdated)) {
        console.log("Producto no modificado (Time-based)");
        return res.status(304).end();
    }

    console.log("Enviando producto (Primera vez o modificado)");
    res.setHeader('Last-Modified', product.lastUpdated);
    res.json(product);
});

app.put('/product', (req, res) => {
    const { name, price } = req.body;

    if (name) product.name = name;
    if (price) product.price = price;

    product.lastUpdated = new Date().toUTCString();

    console.log("Producto modificado en el servidor:", product);
    res.json({ message: "Producto actualizado correctamente", product });
});

    app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
