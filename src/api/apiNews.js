export const getNews = async (page = 1, pageSize = 10) => {
    const BASE_URL = import.meta.env.VITE_NEWS_BASE_URL;
    const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

    console.log(`Делаю запрос к: ${BASE_URL}/top-headlines`);
    console.log(`Страница: ${page}, Размер: ${pageSize}`);

    try {
        const response = await fetch(
            `${BASE_URL}/top-headlines?apiKey=${API_KEY}&country=us&page=${page}&pageSize=${pageSize}`
        );

        console.log('Статус ответа:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Данные от API:', data);
        return data;

    } catch (error) {
        console.error('Ошибка в getNews:', error);
        return {
            status: "error",
            message: error.message,
            totalResults: 0,
            articles: []
        };
    }
};