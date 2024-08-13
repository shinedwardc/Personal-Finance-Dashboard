import { useState, useEffect } from 'react';
import axios from 'axios';

const Hello = () => {
    const [message,setMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/hello')
        .then(res => {
            setMessage(res.data.message)
        })
        .catch(error => {
            console.error(error);
        });
    }, []);

    return (
        <div>
            <p>{message}</p>
        </div>
    )
}

export default Hello