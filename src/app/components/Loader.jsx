import React from 'react';
import '../stylesheets/loader.css'

const Loader = () => {
  return (
    <div className="uploading">
        <div><iframe src="https://giphy.com/embed/VseXvvxwowwCc"></iframe></div>
            <p>Uploading...</p>
    </div>
  )
}

export default Loader