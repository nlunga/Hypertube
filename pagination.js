var state = {
    'page': 1,
    'rows': 5
}

function pagination(querySet, page, rows) {
    var trimStart = (page - 1) * rows;
    var trimEnd = trimStart + rows;

    var trimedData = querySet.slice(trimStart, trimEnd);
}

function paginationButtons(pages) {
    var wrapper = document.getElementById('pagination-wrapper');
    wrapper.innerHTML = "";

    for (let page = 1; page < pages; page++) {
        wrapper.innerHTML += `<a class="btn btn-primary" href="/discover/page=${page}" role="button">${page}</a>`;
    }
}