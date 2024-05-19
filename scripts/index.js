import API_KEY from './api-key.js';

(function () {
  const form = document.querySelector('form');
  const searchInput = document.getElementById('searchInput');
  const searchResultsEl = document.getElementById('searchResults');
  const urlSearch = `http://www.omdbapi.com/?apikey=${API_KEY}&type=movie`;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value;
    renderResults([]);

    if (searchTerm) {
      try {
        const searchResults = await getSearchResults(searchTerm);

        if (searchResults.length > 0) {
          renderResults(searchResults);
        } else {
          renderNoResults(searchTerm);
        }
      } catch (error) {
        renderErrorMessage();
      }
    }
  });

  async function getSearchResults(searchTerm) {
    const response = await fetch(`${urlSearch}&s=${searchTerm}`);
    const data = await response.json();

    if (data.Response === 'False') return [];

    return Promise.all(
      data.Search.map(async (movie) => {
        const response = await fetch(`${urlSearch}&plot=full&i=${movie.imdbID}`);
        return response.json();
      })
    );
  }

  function renderResults(searchResults) {
    const resultsHTML = searchResults
      .map((movie) => {
        return `
          <section class="result-container">
            <div class="image-container">
              <img class="image" src="${movie.Poster}" alt="" aria-hidden="true">
            </div>
            <header class="title-container">
              <h2 class="title">${movie.Title}
                <span class="year">(${movie.Year})</span>
                <span title="IMDb rating" class="rating-container large-view">
                  <i class="icon fa-solid fa-fw fa-star" aria-hidden="true"></i>
                  <span>${movie.imdbRating}</span>
                </span>
              </h2>
              <span title="IMDb rating" class="rating-container small-view">
                <i class="icon fa-solid fa-fw fa-star" aria-hidden="true"></i>
                <span>${movie.imdbRating}</span>
              </span>
            </header>
            <div class="information-container">
              <div>${convertRunTime(movie.Runtime)}</div>
              <div>${movie.Genre}</div>
              <button class="btn-text" type="button">
                <i class="icon icon-add fa-solid fa-circle-plus" aria-hidden="true"></i>
                <span>Watch list</span>
              </button>
            </div>
            <div class="plot-container">
              ${renderPlot(movie.Plot)}
            </div>
          </section>
        `;
      })
      .join('');

    searchResultsEl.innerHTML = resultsHTML;

    setAddEventListeners();
  }

  function renderNoResults(searchTerm) {
    searchResultsEl.innerHTML = `
      <div class="start-search">
        <i class="icon fa-solid fa-fw fa-film" aria-hidden="true"></i>
        <p class="message">Sorry, no movies were found.</p>
      </div>
    `;
  }

  function renderErrorMessage() {
    searchResultsEl.innerHTML = `
      <div class="start-search">
        <i class="icon fa-solid fa-fw fa-film" aria-hidden="true"></i>
        <p class="message">There was an issue. Please try again later.</p>
      </div>
    `;
  }

  function convertRunTime(runtime) {
    const runtimeInt = parseInt(runtime);
    const hours = Math.trunc(runtimeInt / 60);
    const minutes = runtimeInt % 60;
    const hoursStr = hours ? `${hours} hr${hours > 1 ? 's' : ''}` : '';
    const minutesStr = minutes ? `${minutes} min${minutes > 1 ? 's' : ''}` : '';

    return `${hoursStr} ${minutesStr}`.trim();
  }

  function renderPlot(plot) {
    const plotWordLimit = 40;
    const plotArray = plot.split(' ');

    if (plotArray.length <= plotWordLimit) return `<p class="plot">${plot}</p>`;

    return `
      <p class="plot">${plotArray.slice(0, plotWordLimit).join(' ')}<span class="ellipsis">...</span></p>
      <p class="plot overflow" tabindex="-1">${plotArray.slice(plotWordLimit).join(' ')}</p>
      <button class="btn-text read-more" type="button">Read more</button>
    `;
  }

  function setAddEventListeners() {
    const plotContainers = document.querySelectorAll('.plot-container');

    plotContainers.forEach((plotContainer) => {
      const readMore = plotContainer.querySelector('.read-more');
      const overflow = plotContainer.querySelector('.overflow');

      if (readMore != null) {
        readMore.addEventListener('click', () => {
          plotContainer.classList.add('expanded');
          overflow.focus();
          readMore.remove();
        });
      }
    });
  }
})();
