import axios from 'axios';
export default axios.create({
  baseURL: 'https://frozen-fjord-32932.herokuapp.com/',
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  },
});
