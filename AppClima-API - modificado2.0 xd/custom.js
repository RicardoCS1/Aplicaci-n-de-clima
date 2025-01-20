const form = document.querySelector('.get-weather');
const result = document.querySelector('.result');
const countrySelect = document.querySelector('#country');
const citySelect = document.querySelector('#city');
const body = document.querySelector('body');

const citiesByCountry = {
    AR: ["Buenos Aires", "Córdoba", "Rosario"],
    CO: ["Bogotá", "Medellín", "Cali"],
    CR: ["San José", "Alajuela", "Cartago"],
    ES: ["Madrid", "Barcelona", "Valencia"],
    US: ["Nueva York", "Los Ángeles", "Chicago"],
    MX: ["Ciudad de México", "Guadalajara", "Monterrey"],
    PE: ["Lima", "Arequipa", "Cusco"],
    BR: ["Río de Janeiro", "São Paulo", "Brasilia"],
    CL: ["Santiago", "Valparaíso", "Concepción"],
    JP: ["Tokio", "Osaka", "Kioto"],
    IN: ["Delhi", "Mumbai", "Kolkata"], // Added India
    IT: ["Roma", "Milán", "Florencia"], // Added Italy
    FR: ["París", "Marsella", "Lyon"], // Added France
    DE: ["Berlín", "Múnich", "Hamburgo"], // Added Germany
};

const backgrounds = {
    AR: "url('./images/argentina.jpg')",
    CO: "url('./images/colombia.jpg')",
    CR: "url('./images/costarica.jpg')",
    ES: "url('./images/espana.jpg')",
    US: "url('./images/usa.jpg')",
    MX: "url('./images/mexico.jpg')",
    PE: "url('./images/peru.jpg')",
    BR: "url('./images/brasil.jpg')",
    CL: "url('./images/chile.jpg')",
    JP: "url('./images/japon.jpg')",
    IN: "url('./images/india.jpg')", // Added India background
    IT: "url('./images/italia.jpg')", // Added Italy background
    FR: "url('./images/francia.jpg')", // Added France background
    DE: "url('./images/alemania.jpg')", // Added Germany background
};

// Actualizar ciudades según el país seleccionado
countrySelect.addEventListener('change', () => {
    const country = countrySelect.value;
    citySelect.innerHTML = '<option disabled selected value="">Seleccione la ciudad</option>';

    if (citiesByCountry[country]) {
        citiesByCountry[country].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }

    // Cambiar fondo según el país
    body.style.backgroundImage = backgrounds[country] || "none";
    body.style.backgroundSize = "cover";
    body.style.backgroundPosition = "center";
});

// Manejar el envío del formulario
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const country = countrySelect.value;
    const city = citySelect.value;

    if (!country || !city) {
        showError('Ambos campos son obligatorios');
        return;
    }

    callAPI(city, country);
});

function callAPI(city, country) {
    const apiId = '2aaa7f34d6197255fafbd720fe24e24a';  // Updated API Key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiId}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                showError('Ciudad no encontrada. Verifique la información.');
                return;
            }
            clearHTML();
            showWeather(data);
        })
        .catch(() => {
            showError('Hubo un error al conectar con el servidor');
        });
}

function showWeather(data) {
    const { name, main: { temp, temp_min, temp_max }, weather: [details] } = data;

    const degrees = kelvinToCelsius(temp);
    const min = kelvinToCelsius(temp_min);
    const max = kelvinToCelsius(temp_max);

    const content = `
        <h5>Clima en ${name}</h5>
        <img src="https://openweathermap.org/img/wn/${details.icon}@2x.png" alt="weather-icon">
        <h2>${degrees}°C</h2>
        <p>Máx: ${max}°C</p>
        <p>Mín: ${min}°C</p>
    `;
    result.innerHTML = content;
}

function kelvinToCelsius(temp) {
    return (temp - 273.15).toFixed(1);
}

function clearHTML() {
    result.innerHTML = '';
}

function showError(message) {
    const alert = document.createElement('p');
    alert.textContent = message;
    alert.className = 'alert-message';
    form.appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
}

// Get the user's current location
document.getElementById('get-location').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showLocation, showErrorPosition);
    } else {
        alert('La geolocalización no es soportada por este navegador.');
    }
});

function showLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const apiId = '2aaa7f34d6197255fafbd720fe24e24a';

    // Usar OpenWeather directamente para obtener el clima
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiId}`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                const { name: city, sys: { country } } = data;
                const { temp, temp_min, temp_max } = data.main;

                const degrees = kelvinToCelsius(temp);
                const min = kelvinToCelsius(temp_min);
                const max = kelvinToCelsius(temp_max);

                const result = `
                    <h5>Clima en ${city}, ${country}</h5>
                    <h2>${degrees}°C</h2>
                    <p>Máx: ${max}°C</p>
                    <p>Mín: ${min}°C</p>
                `;
                document.querySelector('.result').innerHTML = result;
            } else {
                showError('No se pudo obtener el clima para esta ubicación.');
            }
        })
        .catch(() => {
            showError('Hubo un error al conectar con el servidor.');
        });
}

function showErrorPosition(error) {
    let errorMessage = 'Error desconocido';

    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = "Usuario denegó la solicitud de geolocalización.";
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = "Ubicación no disponible.";
            break;
        case error.TIMEOUT:
            errorMessage = "La solicitud de geolocalización ha caducado.";
            break;
    }
    showError(errorMessage);
}

function kelvinToCelsius(temp) {
    return (temp - 273.15).toFixed(1);
}

function showError(message) {
    const alert = document.createElement('p');
    alert.textContent = message;
    alert.className = 'alert-message';
    document.querySelector('form').appendChild(alert);

    setTimeout(() => alert.remove(), 3000);
}