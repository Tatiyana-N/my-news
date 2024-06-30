const API_KEY = 'b9f6d26cfaeb48e3a99d56eaf3b4f51e';

const choicesElem = document.querySelector('.js-choice');
const newsList = document.querySelector('.news-list');
const formSearch = document.querySelector('.form-search');
const title = document.querySelector('.title');

const choices = new Choices(choicesElem, {
    searchEnabled: false,
    itemSelectText: '',
});

const getdata = async (url) => {
    const response = await fetch(url, {
        headers: {
            'X-Api-Key': API_KEY,
        }
    });

    const data = await response.json();
    return data
};


const getDateCorrectFormat = isoDate => {
    const date = new Date(isoDate);
    const fullDate = date.toLocaleString('en-GB', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    });

    const fullTime = date.toLocaleString('en-GB', {
        hour: 'numeric',
        minute: 'numeric',
    });

    return `<span class="news-date">${fullDate}</span> ${fullTime}`
}

const renderCard = (data) => {
    newsList.textContent = '';
    data.forEach(({urlToImage, title, url, description, publishedAt, author}) => {
        const card = document.createElement('li');
        card.className = 'news-item';

        card.innerHTML = `
                    <img src="${urlToImage}" alt="${title}" class="news-image" width="270" height="200">
                        <h3 class="news-title">
                            <a href="${url}" class="news-link" target="_blank">${title || ''}</a>
                        </h3>
                        <p class="news-description">${description || ''}</p>
                        <div class="news-footer">
                            <time class="news-datetime" datetime="${publishedAt}">
                                ${getDateCorrectFormat(publishedAt)}
                            </time>
                            <div class="news-author">${author || ''}</div>
                        </div>
        `;
        newsList.append(card);
    })
}

const loadNews = async () => {
    newsList.innerHTML = '<li class="preload"></li>'
    const country = localStorage.getItem('country') || 'ru';
    choices.setChoiceByValue(country);
    title.classList.add('hide');
    const data = await getdata(`https://newsapi.org/v2/top-headlines?country=${country}`);
    renderCard(data.articles);
};

const loadSearch = async (value) => {
   
    const data = await getdata(`https://newsapi.org/v2/everything?q=${value}`);
    title.classList.remove('hide');
    title.textContent = `По вашему запросу “${value}” найдено ${data.articles.length} результатов `
    choices.setChoiceByValue('');
    renderCard(data.articles);
}

choicesElem.addEventListener('change', (event) => {
    const value = event.detail.value;
    loadNews(value);
    localStorage.setItem('country', value);
    loadNews();

});

formSearch.addEventListener('submit', event => {
    event.preventDefault();
    const value = formSearch.search.value;
    loadSearch(value);
    formSearch.reset();
});

loadNews();

