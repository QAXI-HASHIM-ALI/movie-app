import { useEffect, useState } from "react";
import Search from "./Components/Search";
import Spinner from "./Components/Spinner";
import MovieCard from "./Components/MovieCard";
import { useDebounce } from "react-use";
import { getTrendingMovies, updateSearchCount } from "./AppWrite.js";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debounceSearchTerm, setDebounceSearchTerm] = useState("");
  const [trendingMovies, setTrendingMovies] = useState([]);




  const Api_Base_Url = "https://api.themoviedb.org/3";
  const Api_options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    },
  };

  useDebounce(() => {
    setDebounceSearchTerm(searchTerm);
  }, 500, [searchTerm]);
  
  const fetchMovies = async (query = "") => {
    setLoading(true)
    setErrorMessage("");
    try {
      const endpoint = query ? `${Api_Base_Url}/search/movie?query=${encodeURIComponent(query)}` : `${Api_Base_Url}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, Api_options);
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        setErrorMessage("No movies found.");
        setMovies([]);
        return;
      }

      setMovies(data.results);
      // console.log(data.results);
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }

    } catch (error) {
      console.log(error);
      setErrorMessage("An error occurred while fetching data");
    }
    finally {
      setLoading(false);
    }
  };
  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies)
    } catch (error) {
      console.error("Error fetching trending movies:", `${error}`);
      // setErrorMessage("An error occurred while fetching data");

    }

  };

  useEffect(() => {
    loadTrendingMovies();
  }, [])



  useEffect(() => {
    fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);
  
  
  return (
    <main>
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="" />
          <h1>
            Find <span className="text-gradient">Movies and TV Shows</span> You
            Will Enjoy Without Hassle!
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie,index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />

                </li>
                
              ))}
            </ul>

          </section>
        )}
        <section className="all-movies">
          <h2>All Movies</h2>
          {
            loading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />

                )

                )}
              </ul>
            )

          }
        </section>
      </div>
    </main>
  );
};

export default App;
