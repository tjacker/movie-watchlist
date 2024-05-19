import API_KEY from './api-key.js';
import { debounce } from './utils.js';

(function () {
  const form = document.querySelector('form');
  const searchInput = document.getElementById('searchInput');
  const searchResultsEl = document.getElementById('searchResults');
  const urlSearch = `http://www.omdbapi.com/?apikey=${API_KEY}&type=movie`;

  const debounceGetSearchResults = debounce(getSearchResults);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const searchTerm = searchInput.value.trim();

    if (searchTerm !== '') {
      debounceGetSearchResults(searchTerm);
    }
  });

  async function getSearchResults(searchTerm) {
    try {
      const response = await fetch(`${urlSearch}&s=${searchTerm}`);

      if (response.ok === false) {
        throw new Error();
      }

      const data = await response.json();

      if (response.ok === true && data.Response === 'False') {
        return renderMessage('Sorry, no movies were found.');
      }

      const searchResults = await Promise.all(
        data.Search.map(async (movie) => {
          const response = await fetch(`${urlSearch}&plot=full&i=${movie.imdbID}`);
          return response.json();
        })
      );

      renderResults(searchResults);
    } catch (err) {
      renderMessage('There was an issue. Please try again later.');
    }
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
                <span class="metadata">(${movie.Year} - ${movie.Rated})</span>
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
                <i class="icon fa-solid fa-circle-plus" aria-hidden="true"></i>
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

  function renderMessage(message) {
    searchResultsEl.innerHTML = `
      <div class="start-search">
        <i class="icon fa-solid fa-fw fa-film" aria-hidden="true"></i>
        <p class="message">${message}</p>
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
