
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

document.getElementById('updateProduct').addEventListener('click', () => {
    const nameInput = document.getElementById('newName').value;
    const priceInput = document.getElementById('newPrice').value;

    const dataToSend = {
        name: nameInput || "Laptop Gamer Mejorada",
        price: Number(priceInput) || 2000
    };

    fetch(`http://${urlBase}/product`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta del PUT:", data);
        alert(`¡Actualizado en el servidor!\n\nAhora presiona "Obtener datos de producto" arriba para ver cómo el caché se rompe (Status 200).`);
    })
    .catch(error => console.error('Error al actualizar:', error));
});