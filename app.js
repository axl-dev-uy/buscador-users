// we check if we have data in localStorage, if not we fetch it from the API
const data = existsLocally() ? JSON.parse(localStorage.getItem('userData')) : getUserData();
const span = document.getElementsByClassName("close")[0];
const modal = document.getElementById('myModal');

span.onclick = function () {
    modal.style.display = "none";
}

//#TAREA 2: Obtener y Mostrar los Datos
// get data from API and store it in localStorage
async function getUserData() {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await res.json();
    localStorage.setItem('userData', JSON.stringify(data));
    return data;
}

// js checks if there is data in localStorage
function existsLocally() {
    return localStorage.getItem('userData') !== null;
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function loadModal(user) {
    let item = document.createElement('li');

    document.getElementById('modal-content').innerHTML = `
    <p><span class="label">👤 Name:</span> ${user.name}</p>
    <p><span class="label">📧 Email:</span> ${user.email}</p>
    <p><span class="label">🔑 Username:</span> ${user.username}</p>
    <p><span class="label">📞 Phone:</span> ${user.phone}</p>
    <p><span class="label">🏠 Address:</span> ${user.address.street}, ${user.address.city}</p>`;

    modal.style.display = "flex";
}

// load data into the html
function loadData(filter) {
    filter = filter ? filter.toLowerCase() : "";
    const container = document.getElementById('userList');
    container.innerHTML = "";

    data
        .filter(user => user.name.toLowerCase().includes(filter))
        .forEach(user => {
            let item = document.createElement('li');

            // Name
            const nameP = document.createElement("p");
            nameP.innerHTML = `<span class="label">👤 </span> `;
            nameP.appendChild(highlightMatch(user.name, filter));
            item.appendChild(nameP);

            item.addEventListener('click', () => {
                loadModal(user);
            });
            container.appendChild(item);
        });
}

loadData();

// -- FIN TAREA 2 --

// highlight search term in results
function highlightMatch(text, query) {
    if (!query) return document.createTextNode(text);

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    const fragment = document.createDocumentFragment();

    parts.forEach(part => {
        if (part.toLowerCase() === query.toLowerCase()) {
            let mark = document.createElement("mark");
            mark.textContent = part; // safe
            fragment.appendChild(mark);
        } else {
            fragment.appendChild(document.createTextNode(part));
        }
    });

    return fragment;
}

//#TAREA 3: Implementar la Búsqueda
// filter data based on search input
document.getElementById('searchInput').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredData = data.filter(user => user.name.toLowerCase().includes(searchTerm));
    const container = document.getElementById('userList');
    container.innerHTML = '';
    if (!filteredData || filteredData.length === 0) {
        container.innerHTML = '<li>No tengo a nadie que se llame asi pibe, escribí bien, o fijate de nuevo.</li>';
        return;
    }
    loadData(searchTerm);
});

// -- FIN TAREA 3 --