
const Search = ({searchTerm,setSearchTerm}) => {
  return (
    <div className="search">
        <div>
            <img src="search.svg" alt="" />
            <input type="text" placeholder="Search for thousand of movies and TV shows" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
        </div>

    </div>
  )
}

export default Search