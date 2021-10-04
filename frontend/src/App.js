import './App.css';
import Navbar from './components/navbar';
import DropArea from './components/fileDropArea';
import Header from './components/Header';

function App() {
  return (
    <div className='container'>
      <Navbar />
      <Header />
      <DropArea />
      <div className='about'>
        <h1>About the project</h1>
        <p>
          Image colorizer analyzes black and white pictures and turns them into
          color photos using deep learning and machine learning techniques from
          this{' '}
          <a
            href='https://modelzoo.co/model/colorful-image-colorization'
            target='_blank'
            rel='noopener noreferrer'
          >
            Colorization
          </a>{' '}
          project.
        </p>
      </div>
      <div className='footer'>
        <ul>
          <li> &copy; 2021</li>
          <li>
            <a href='http://linkedin.com/in/gmunkhtur'>
              <i className='fab fa-linkedin'></i>
            </a>
          </li>
          <li>
            <a href='http://github.com/munkthur'>
              <i className='fab fa-github-square'></i>
            </a>
          </li>
          <li>
            <a href='mailto:gmunkhtur@gmail.com'>
              <i className='fas fa-envelope-square'></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
