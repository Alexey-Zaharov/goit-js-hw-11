import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const baseUrl = 'https://pixabay.com/api/';
const apiKey = '34544645-2c62a1021489ea1157fadd1e4';
let startPage = 1;
let searchValue = '';

const btnOnShow = data => {
  if (
    startPage * data.hits.length >= data.totalHits &&
    data.hits.length !== 0
  ) {
    loadMoreBtn.classList.add('js-display_non');
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    return;
  }
};

const getPhotos = async () => {
  try {
    const response = await axios.get(
      `${baseUrl}?key=${apiKey}&q=${searchValue}&image_type=photo&page=${startPage}&per_page=40&orientation=horizontal&safesearch=true`
    );
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const marckupToRender = photos => {
  const lightBoxGallery = new SimpleLightbox('.gallery a');
  const markupListMurkup = photos.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a href="${largeImageURL}"><div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div></a>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markupListMurkup);
  lightBoxGallery.refresh();
};

searchForm.addEventListener('submit', evt => {
  evt.preventDefault();
  if (
    document.querySelector('[name = searchQuery]').value === '' ||
    document.querySelector('[name = searchQuery]').value === searchValue
  ) {
    return;
  }
  if (
    searchValue !== document.querySelector('[name = searchQuery]').value &&
    document.querySelector('[name = searchQuery]').value !== ''
  ) {
    startPage = 1;
    gallery.innerHTML = '';
  }
  searchValue = document.querySelector('[name = searchQuery]').value;
  loadMoreBtn.classList.add('js-display_non');
  getPhotos().then(photos => {
    if (photos.hits.length !== 0) {
      Notiflix.Notify.success(`Hooray! We found ${photos.totalHits} images.`);
      loadMoreBtn.classList.remove('js-display_non');
    }
    marckupToRender(photos);
    btnOnShow(photos);
  });
});
loadMoreBtn.addEventListener('click', () => {
  startPage += 1;
  getPhotos().then(data => {
    btnOnShow(data);
    marckupToRender(data);
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 1,
      behavior: 'smooth',
    });
  });
});
