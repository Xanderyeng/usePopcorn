import { useEffect, useState } from "react";

const KEY = "567ab7ee";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
        callback?.();

      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
            // `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
            // `http://www.omdbapi.com/?apikey=${KEY}&page=${50}`
            // `http://www.omdbapi.com/?i=tt3896198&apikey=439f1f5d`
          );

          if (!res.ok)
            throw new Error("Something went wrong with fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found");

          setMovies(data.Search);

          // console.log(data);
          setError("");
        } catch (err) {
          console.error(err.message);
          // TO FILTER OUT THE ABORT ERROR THAT APPEARS / IS TRIGGERED WHENEVER THE CONTROLLER RUNS / COMPONENT RE-RENDERS
          if (err.name !== "AbortError") {
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      // BEFORE A NEW SEARCH MOVIE IS DONE, YOU CLOSE THE COMPONENT
    //   handleCloseMovie();
      fetchMovies();
      // TO STOP THE MULTIPLE REQUESTS
      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return {movies, isLoading, error}
}
