import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
export default () => {
    const history = useHistory();
    const { id } = useParams();
    const intialValue = {
        id: parseInt(id),
        title: '',
        director:'',
        metascore:'',
        stars: ''
        }
        const [movie, setMovie] = useState(intialValue);

        const reduceStars = () => {
            const newStars = movie.stars?.reduce((acc, cur) => `${acc}, ${cur}`);
        }
        useEffect(() => {
            axios
               .get(`http://localhost:5000/api/movies/${id}`)
               .then(res => {
                   let gotMovie = {
                       id: parseInt(id),
                       title: res.data.title,
                       director: res.data.director,
                       metascore: res.data.metascore,
                       stars: res.data.stars.reduce((acc, cur) => `${acc}, ${cur}`)
                   };
                   setMovie(gotMovie);
               })
               .catch(err => console.log(err.response));
        },[id]);

        const handleChange = e =>{
            setMovie({
                ...movie,
            [e.target.name]: e.target.value
            })
        }

        const commitChanges = e => {
            e.preventDefault();
            let movieToSend = {
                ...movie,
                stars:movie.stars.split(',')
            }
            axios.put(`http://localhost:5000/api/movies/${id}`, movieToSend)
            .then(res =>{
                history.push(`/movie/${id}`);
            }).catch(err => console.log(err));
        }

    return (
        <form onSubmit={commitChanges}>
            <h2>Update Movie</h2>
            <input type='text' name='title' placeholder='Title' value={movie.title} onChange={handleChange} />
            <input type='text' name='director' placeholder='Director' value={movie.director} onChange={handleChange} />
            <input type='number' name='metascore' placeholder='Metascore' value={movie.metascore} onChange={handleChange} />
            <input type='textarea' name='stars' placeholder='Stars' value={movie.stars} onChange={handleChange} />
            <button>Update</button>
        </form>
    );
}
