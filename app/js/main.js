const form = document.getElementById('url-form');
const urlField = document.getElementById('url');
const urlTable = document.getElementById('url-table');

form.addEventListener('submit', handleFormSubmit);

async function handleFormSubmit(e) {
    e.preventDefault();

    // Grab the URL and encode it so we can include it in the api request
    const url = urlField.value;
    const body = JSON.stringify({ fullUrl: url });

    // Make the api request
    const response = await fetch(`api/url/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    });
    const data = await response.json();

    // Add the resulting has to the table and reset the form
    displayHash(data);
    urlField.value = '';
}

function displayHash({ hash, fullUrl, shortUrl }) {
    const tr = document.createElement('tr');
    const urlCell = document.createElement('td');
    urlCell.innerHTML = fullUrl;

    const shortenedCell = document.createElement('td');
    const shortenedURL = document.createElement('a');
    shortenedURL.href = `${shortUrl}`;
    shortenedURL.textContent = hash;
    shortenedURL.target = '_blank';
    shortenedCell.appendChild(shortenedURL);

    tr.appendChild(urlCell);
    tr.appendChild(shortenedCell);

    urlTable.appendChild(tr);
}
