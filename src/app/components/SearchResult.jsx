import React from 'react'
import '../stylesheets/searchResult.css'

const SearchResult = ({user}) => {
  return (
    <div className='main-search-result'>
        <img src={user.profileImg} alt="" />

        <div className="search-result-info">
            <h3>{user.username}</h3>
            <p>{user.name}</p>
        </div>
    </div>    
  )
}

export default SearchResult