import React from 'react'
import SearchResult from '../components/SearchResult';
// import '../stylesheets/search.css'

const SearchList = ({list}) => {
  console.log('List: ', list)
  return (
    <div className='main-search-list' >
        {/* Length: {list.length} */}
        {list?.map((user) => {
          
          return <SearchResult user={user}/>
            // <div>
              {/* {user} */}
              
          //  </div>
        })}
    </div>
  )
}

export default SearchList