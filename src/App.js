import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const KEY = "567ab7ee";
// const KEY = "439f1f5d";
// http://www.omdbapi.com/?i=tt3896198&apikey=439f1f5d

export default function App() {
  const [query, setQuery] = useState("");
  // const [movies, setMovies] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState("");
  
  const [selectedId, setSelectedId] = useState(null);
  
  const {movies, isLoading, error} = useMovies(query, handleCloseMovie);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  // WATCHED ARRAY CONTAINS ALL THE WATCHED MOVIES
  // const [watched, setWatched] = useState([]);
  // USE STATE CAN ALSO ALLOW ME TO PASS IN A CALLLBACK FUNCTION
  //  ----- USELOCALSTORAGESTATE
  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });

  function handleSelectMovie(id) {
    setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddWatch(movie) {
    setWatched((watched) => [...watched, movie]);

    localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }

  function handleDeleteWatched(id) {
    // PASS IN MOVIE AS AN OBJECT SO AS TO GET ACCESS TO THE PROPERTIES
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  // useEffect(
  //   function () {
  //     localStorage.setItem("watched", JSON.stringify(watched));
  //   },
  //   [watched]
  // );



  return (
    <>
      {/* COMPONENT COMPOSITION -- ELIMINATED PROP DRILLING BY USING THE CHILDREN PROP */}
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      {/* COMPONENT COMPOSITION -- ELIMINATED PROP DRILLING BY USING THE CHILDREN PROP */}
      <Main>
        {/* COMPONENT COMPOSITION -- ELIMINATED PROP DRILLING BY USING THE CHILDREN PROP */}

        {/* IMPLICIT PROPS */}
        <Box>
          {/* THESE THREE CONDITIONS ARE MUTUALLY EXCLUSIVE. ONLY ONE WILL EVER BE TRUE AT ANY GIVEN MOMENT / TIME */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        {/* EXPLICIT PROP USAGE */}

        {/* <Box
          element={
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} />
            </>
          }
        />         */}

        {/* <WatchedBox /> */}
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatch}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>⛔</span>
      {message}
    </p>
  );
}

function Loader() {
  return (
    <>
      <p className='loader'>Loading movies...</p>
    </>
  );
}

function NavBar({ children }) {
  return (
    <nav className='nav-bar'>
      {children}
      {/* <Logo /> */}
      {/* <Search /> */}
      {/* <NumResults movies={movies} /> */}
    </nav>
  );
}

function Logo() {
  return (
    <div className='logo'>
      <span role='img'>🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

{
  /* SEARCH BAR */
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useEffect(
    function () {
      // console.log(inputEl.current)

      function callback(e) {
        if (document.activeElement === inputEl.current) return;

        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }

      document.addEventListener("keydown", callback);
      return () => document.addEventListener("keydown", callback);
      // inputEl.current.focus();
    },
    [setQuery]
  );

  return (
    <input
      ref={inputEl}
      className='search'
      type='text'
      placeholder='Search movies...'
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className='main'>{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen1] = useState(true);

  return (
    <div className='box'>
      <button
        className='btn-toggle'
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>

      {/* SHOW THE MOVIE LIST IF THE BUTTON IS OPEN */}
      {/* COMPONENT COMPOSITION -- ELIMINATED PROP DRILLING BY USING THE CHILDREN PROP */}

      {isOpen && children}
    </div>
  );
}

// function WatchedBox({watched}) {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);

//   return (
//     <div className='box'>
//       <button
//         className='btn-toggle'
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           {children}
//         </>
//       )}
//     </div>
//   );
// }

function MovieList({ movies, onSelectMovie }) {
  // const [movies, setMovies] = useState(tempMovieData);
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie key={movie.imdbID} movie={movie} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  // THE STATE IS SET TO AN EMPTY OBJECT B'COZ ITS WHAT WE GET FROM THE API CALL
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  // console.log(isWatched);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // console.log(title, year);

  const isTop = imdbRating > 8;
  console.log(isTop);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    // onCloseMovie();
  }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
          console.log("CLOSING");
        }
      }

      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
        // console.log(data);
      }
      getMovieDetails();
      // THE DEPENDENCY ARRAY ACTS LIKE AN EVENT LISTENER
    },
    [selectedId]
  );

  // IN THE BEGGIN THE TITLE IS STILL EMPTY, UNDEFINED AND ITS STILL LOADING.

  useEffect(() => {
    // THIS CODE ENSURES YOU DON'T SEE THE ' UNDEFINED ' FOR A BRIEF MOMENT BEFORE THE COMPONENT RELOADS
    if (!title) return;

    document.title = `Movie | ${title}`;

    return function () {
      document.title = "usePopcorn";

      // THE FUNCTION CLOSED OVER THE TITLE VARIABLE AND THEREFORE WILL REMEMBER IT IN THE FUTURE - " CLOSURES "

      // THE CLEAN UP FUNCTION RUNS BETWEEN RE-RENDERS
      console.log(`Clean up effect for movie ${title}`);
    };
  }, [title]);

  // THE DEPENDENCY ARRAY ABOVE ENSURES THAT WHENEVER A DIFFERENT MOVIE IS SELECTED

  return (
    <>
      <div className='details'>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className='btn-back' onClick={onCloseMovie}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className='details-overview'>
                <h2>{title}</h2>
                <p>{released}</p>
                <p>{genre}</p>
                <p>
                  <span>⭐</span>
                  {imdbRating} IMDB Rating
                </p>
              </div>
            </header>
            <section>
              <div className='rating'>
                {!isWatched ? (
                  <>
                    <StarRating
                      size={24}
                      maxRating={10}
                      onSetRating={setUserRating}
                    />

                    {userRating > 0 && (
                      <button className='btn-add' onClick={handleAdd}>
                        + Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p>
                    You rated this movie {watchedUserRating}
                    <span>⭐</span>
                  </p>
                )}
              </div>

              <p>
                <em>{plot}</em>
              </p>
              <p>Starring{actors}</p>
              <p>Directed by{director}</p>
            </section>
            {/* {id} */}
          </>
        )}
      </div>
    </>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  // console.log(Math.round(avgRuntime));
  // console.log(watched);

  return (
    <div className='summary'>
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, onDeleteWatched }) {
  return (
    <ul className='list'>
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className='btn-delete'
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
