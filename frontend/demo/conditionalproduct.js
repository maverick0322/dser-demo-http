
const urlBase = "localhost:3000";

document.getElementById('fetchProduct').addEventListener('click', () => {
    const lastModified = localStorage.getItem('productLastModified');
    
    const headers = {};
    if (lastModified) {
        headers['If-Modified-Since'] = lastModified;
    }

    fetch(`http://${urlBase}/product`, {
        method: 'GET',
        headers: headers
    })
    .then(response => {
        if (response.status === 304) {
            console.log('El producto no ha cambiado desde: ' + lastModified);
            alert("Caché: El producto sigue siendo el mismo.");
            return null; 
        } else {
            const newLastModified = response.headers.get('Last-Modified');
            if (newLastModified) {
                localStorage.setItem('productLastModified', newLastModified);
            }
            return response.json();
        }
    })
    .then(data => {
        if (data) {
            const container = document.getElementById('productContainer');
            container.innerHTML = `
                <h3>${data.name}</h3>
                <p>Precio: $${data.price}</p>
                <small>Última actualización: ${localStorage.getItem('productLastModified')}</small>
            `;
        }
    })
    .catch(error => console.error('Error:', error));
});