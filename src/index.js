import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// import Converter from './CurrencyConverter';
// import StarRating from './StarRating';
// import TextExpander from './TextExpander';

// function Test() {
//   const [movieRating, setMovieRating] = useState(0);
//   return (
//     <>
//     <StarRating maxRating={5} size={64} color='purple' defaultRating={3} onSetRating={setMovieRating} />
//       <h2>This movie was rated {movieRating}</h2>
//     </>
//   )
// }

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* <Converter /> */}
    {/* <TextExpander /> */}
    {/* <StarRating maxRating={5} messages={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']} /> */}
    {/* <StarRating maxRating={5} size={24} color='purple' defaultRating={3} /> */}
    {/* <StarRating maxRating={10} size={72} color='green' defaultRating={3} /> */}
    {/* <Test /> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
