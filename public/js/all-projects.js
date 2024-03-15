const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const techFilters = document.querySelectorAll('#techFilter input[type="checkbox"]');
const projectsContent = document.getElementById('projectsContent');
const allProjectRows = document.querySelectorAll('.project-row');

const debouncedSearch = _.debounce(async (event) => {
        const searchQuery = searchInput.value;
        const selectedCategory = categoryFilter.value;
        const selectedTechs = Array.from(techFilters).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

        const data = await fetchSearchResults(searchQuery, selectedCategory, selectedTechs);
        const projectNames = data.data.data.map((project) => project.name);
    
        allProjectRows.forEach((row) => {
            const rowProjectName = row.querySelector('.project-row__name').textContent;
            if (!projectNames.includes(rowProjectName)) {
                hideOrShowProject(row, hideOrShow='hide');
            } else {
                hideOrShowProject(row, hideOrShow='show');
            }
        })
    }, 300);

function hideOrShowProject(row, hideOrShow='hide') {
    let displayStr = hideOrShow === 'hide' ? 'none' : '';

    if (row.nextSibling.classList.contains('row-divider'))
        row.nextSibling.style.display = displayStr;
    row.style.display = displayStr;
}

searchInput.addEventListener('input', debouncedSearch);
categoryFilter.addEventListener('change', debouncedSearch);
techFilters.forEach(checkbox => checkbox.addEventListener('change', debouncedSearch));

async function fetchSearchResults(query, category, techs) {
    let url = 'api/v1/projects/?'

    if (query.length >= 1)
        url += `search[index]=default&search[autocomplete][query]=${encodeURIComponent(query)}&search[autocomplete][path]=name&`;

    if (category)
        url += `categories=${category}&`

    if (techs)
        techs.forEach((tech) => url += `techsUsed=${tech}&`);

    console.log(url);
    
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`HTTP error while filtering: ${res.status}`);
        }
        const data = await res.json();
        return data;
    } catch (err) {
        console.error("Could not fetch data: ", err);
    }
}
