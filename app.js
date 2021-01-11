class Movie {
    constructor (title, director, year) {
        this.title = title;
        this.director = director;
        this.year = year;
    }
}

class UI {
    static displayMovies () {
        const movies = Store.getMovies();

        movies.forEach((movie) => UI.addMovieToList(movie));
    }

    static addMovieToList (movie) {
        const list = document.querySelector('#movie-list');
        const row = document.createElement('tr');

        row.innerHTML = `
          <td>${movie.title}</td>
          <td>${movie.director}</td>
          <td>${movie.year}</td>
          <td><a href="#" class = "btn btn-sm btn-danger delete">X</a></td>
        `;

        list.appendChild(row);
    }

    static deleteMovie (m) {
        if (m.classList.contains('delete')) {
            m.parentElement.parentElement.remove();
        }
    }

    static showAlert (message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.col-xxl-6');
        const form = document.querySelector('#movie-form');
        container.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 1500);

    }

    static clearFields () {
        document.querySelector('#title').value = '';
        document.querySelector('#director').value = '';
        document.querySelector('#year').value = '';
    }
}

class Store {
    static getMovies() {
      let movies;
      if(localStorage.getItem('movies') === null) {
        movies = [];
      } else {
        movies = JSON.parse(localStorage.getItem('movies'));
      }
  
      return movies;
    }
  
    static addMovie(movie) {
      const movies = Store.getMovies();
      movies.push(movie);
      localStorage.setItem('movies', JSON.stringify(movies));
    }
  
    static removeMovie(year) {
      const movies = Store.getMovies();
  
      movies.forEach((movie, index) => {
        if(movie.year === year) {
          movies.splice(index, 1);
        }
      });
  
      localStorage.setItem('movies', JSON.stringify(movies));
    }
  }

document.addEventListener('DOMContentLoaded', UI.displayMovies);

document.querySelector('#movie-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.querySelector('#title').value;
    const director = document.querySelector('#director').value;
    const year = document.querySelector('#year').value;

    if (title === '' || director === '' || year === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        const movie = new Movie (title, director, year);
        UI.addMovieToList(movie);
        Store.addMovie(movie);
        UI.showAlert('Movie Added', 'success');
        UI.clearFields();
    
    }
});

document.querySelector('#movie-list').addEventListener('click', (e) => {
    UI.deleteMovie(e.target);
    Store.removeMovie(e.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('Movie Removed', 'success');
})