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
        // TODO: render an error message to search results
        console.log(error);
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
        <p class="message">Sorry, no movies found that include the term '${searchTerm}'.</p>
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

      readMore.addEventListener('click', () => {
        plotContainer.classList.add('expanded');
        overflow.focus();
        readMore.remove();
      });
    });
  }

  const data = [
    {
      Title: 'Die Hard',
      Year: '1988',
      Rated: 'R',
      Released: '20 Jul 1988',
      Runtime: '132 min',
      Genre: 'Action, Thriller',
      Director: 'John McTiernan',
      Writer: 'Roderick Thorp, Jeb Stuart, Steven E. de Souza',
      Actors: 'Bruce Willis, Alan Rickman, Bonnie Bedelia',
      Plot: 'NYPD cop John McClane goes on a Christmas vacation to visit his wife Holly in Los Angeles where she works for the Nakatomi Corporation. While they are at the Nakatomi headquarters for a Christmas party, a group of robbers led by Hans Gruber take control of the building and hold everyone hostage, with the exception of John, while they plan to perform a lucrative heist. Unable to escape and with no immediate police response, John is forced to take matters into his own hands.',
      Language: 'English, German, Italian, Japanese',
      Country: 'United States',
      Awards: 'Nominated for 4 Oscars. 8 wins & 8 nominations total',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BZjRlNDUxZjAtOGQ4OC00OTNlLTgxNmQtYTBmMDgwZmNmNjkxXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      Ratings: [
        {
          Source: 'Internet Movie Database',
          Value: '8.2/10',
        },
        {
          Source: 'Rotten Tomatoes',
          Value: '94%',
        },
        {
          Source: 'Metacritic',
          Value: '72/100',
        },
      ],
      Metascore: '72',
      imdbRating: '8.2',
      imdbVotes: '941,100',
      imdbID: 'tt0095016',
      Type: 'movie',
      DVD: '02 Sep 2014',
      BoxOffice: '$85,892,546',
      Production: 'N/A',
      Website: 'N/A',
      Response: 'True',
    },
    {
      Title: 'Live Free or Die Hard',
      Year: '2007',
      Rated: 'PG-13',
      Released: '27 Jun 2007',
      Runtime: '128 min',
      Genre: 'Action, Thriller',
      Director: 'Len Wiseman',
      Writer: 'John Carlin, Roderick Thorp, Mark Bomback',
      Actors: 'Bruce Willis, Justin Long, Timothy Olyphant',
      Plot: "When someone hacks into the computers at the FBI's Cyber Crime Division; the Director decides to round up all the hackers who could have done this. When he's told that because it's the 4th of July most of their agents are not around so they might have trouble getting people to get the hackers. So he instructs them to get local PD'S to take care of it. And one of the cops they ask is John McClane who is tasked with bringing a hacker named Farrell to the FBI. But as soon as he gets there someone starts shooting at them. McClane manages to get them out but they're still being pursued. And it's just when McClane arrives in Washington that the whole system breaks down and chaos ensues.",
      Language: 'English, Italian, French',
      Country: 'United States, United Kingdom',
      Awards: '3 wins & 16 nominations',
      Poster: 'https://m.media-amazon.com/images/M/MV5BNDQxMDE1OTg4NV5BMl5BanBnXkFtZTcwMTMzOTQzMw@@._V1_SX300.jpg',
      Ratings: [
        {
          Source: 'Internet Movie Database',
          Value: '7.1/10',
        },
        {
          Source: 'Rotten Tomatoes',
          Value: '82%',
        },
        {
          Source: 'Metacritic',
          Value: '69/100',
        },
      ],
      Metascore: '69',
      imdbRating: '7.1',
      imdbVotes: '420,168',
      imdbID: 'tt0337978',
      Type: 'movie',
      DVD: '01 Mar 2013',
      BoxOffice: '$134,529,403',
      Production: 'N/A',
      Website: 'N/A',
      Response: 'True',
    },
    {
      Title: 'Die Hard with a Vengeance',
      Year: '1995',
      Rated: 'R',
      Released: '19 May 1995',
      Runtime: '128 min',
      Genre: 'Action, Adventure, Thriller',
      Director: 'John McTiernan',
      Writer: 'Jonathan Hensleigh, Roderick Thorp',
      Actors: 'Bruce Willis, Jeremy Irons, Samuel L. Jackson',
      Plot: 'John McClane is now almost a full-blown alcoholic and is suspended from the NYPD. But when a bomb goes off in the Bonwit Teller Department Store the police go insane trying to figure out what\'s going on. Soon, a man named Simon calls and asks for McClane. Simon tells Inspector Walter Cobb that McClane is going to play a game called "Simon Says". He says that McClane is going to do the tasks he assigns him. If not, he\'ll set off another bomb. With the help of a Harlem electrician, John McClane must race all over New York trying to figure out the frustrating puzzles that the crafty terrorist gives him. But when a bomb goes off in a subway station right by the Federal Reserve (the biggest gold storage in the world) things start to get heated.',
      Language: 'English, German, Romanian',
      Country: 'United States',
      Awards: '2 wins & 3 nominations',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BZjI0ZWFiMmQtMjRlZi00ZmFhLWI4NmYtMjQ5YmY0MzIyMzRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
      Ratings: [
        {
          Source: 'Internet Movie Database',
          Value: '7.6/10',
        },
        {
          Source: 'Rotten Tomatoes',
          Value: '59%',
        },
        {
          Source: 'Metacritic',
          Value: '58/100',
        },
      ],
      Metascore: '58',
      imdbRating: '7.6',
      imdbVotes: '406,884',
      imdbID: 'tt0112864',
      Type: 'movie',
      DVD: '01 Mar 2013',
      BoxOffice: '$100,012,499',
      Production: 'N/A',
      Website: 'N/A',
      Response: 'True',
    },
    {
      Title: 'Die Hard 2',
      Year: '1990',
      Rated: 'R',
      Released: '03 Jul 1990',
      Runtime: '124 min',
      Genre: 'Action, Thriller',
      Director: 'Renny Harlin',
      Writer: 'Steven E. de Souza, Doug Richardson, Walter Wager',
      Actors: 'Bruce Willis, William Atherton, Bonnie Bedelia',
      Plot: 'After the terrifying events in LA, John McClane (Willis) is about to go through it all again. A team of terrorists, led by Col. Stuart (Sadler) is holding the entire airport hostage. The terrorists are planning to rescue a drug lord from justice. In order to do so, they have seized control of all electrical equipment affecting all planes. With no runway lights available, all aircraft have to remain in the air, with fuel running low, McClane will need to be fast.',
      Language: 'English, Spanish',
      Country: 'United States',
      Awards: '1 win & 1 nomination',
      Poster:
        'https://m.media-amazon.com/images/M/MV5BMzMzYzk3ZTEtZDg0My00MTY5LWE3ZmQtYzNhYjhjN2RhZGRjL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg',
      Ratings: [
        {
          Source: 'Internet Movie Database',
          Value: '7.1/10',
        },
        {
          Source: 'Rotten Tomatoes',
          Value: '69%',
        },
        {
          Source: 'Metacritic',
          Value: '67/100',
        },
      ],
      Metascore: '67',
      imdbRating: '7.1',
      imdbVotes: '381,912',
      imdbID: 'tt0099423',
      Type: 'movie',
      DVD: '02 Aug 2014',
      BoxOffice: '$117,540,947',
      Production: 'N/A',
      Website: 'N/A',
      Response: 'True',
    },
    {
      Title: 'A Good Day to Die Hard',
      Year: '2013',
      Rated: 'R',
      Released: '14 Feb 2013',
      Runtime: '98 min',
      Genre: 'Action, Thriller',
      Director: 'John Moore',
      Writer: 'Skip Woods, Roderick Thorp',
      Actors: 'Bruce Willis, Jai Courtney, Sebastian Koch',
      Plot: 'Iconoclastic, take-no-prisoners cop John McClane, for the first time, finds himself on foreign soil after traveling to Moscow to help his wayward son Jack - unaware that Jack is really a highly-trained CIA operative out to stop a nuclear weapons heist. With the Russian underworld in pursuit, and battling a countdown to war, the two McClanes discover that their opposing methods make them unstoppable heroes.',
      Language: 'English, Russian, Hindi, Punjabi',
      Country: 'United States, United Kingdom, Hungary',
      Awards: '5 wins & 8 nominations',
      Poster: 'https://m.media-amazon.com/images/M/MV5BMTcwNzgyNzUzOV5BMl5BanBnXkFtZTcwMzAwOTA5OA@@._V1_SX300.jpg',
      Ratings: [
        {
          Source: 'Internet Movie Database',
          Value: '5.2/10',
        },
        {
          Source: 'Rotten Tomatoes',
          Value: '15%',
        },
        {
          Source: 'Metacritic',
          Value: '28/100',
        },
      ],
      Metascore: '28',
      imdbRating: '5.2',
      imdbVotes: '214,582',
      imdbID: 'tt1606378',
      Type: 'movie',
      DVD: '04 Jun 2013',
      BoxOffice: '$67,349,198',
      Production: 'N/A',
      Website: 'N/A',
      Response: 'True',
    },
  ];
})();
