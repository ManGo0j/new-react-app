export const getNews = async (page = 1, pageSize = 10, category = "all") => {
    const BASE_URL = import.meta.env.VITE_NEWS_BASE_URL;
    const API_KEY = import.meta.env.VITE_NEWS_API_KEY;

    console.log(`Делаю запрос к: ${BASE_URL}/top-headlines`);
    console.log(`Страница: ${page}, Размер: ${pageSize}, Категория: ${category}`);

    try {
        let url = `${BASE_URL}/top-headlines?apiKey=${API_KEY}&page=${page}&pageSize=${pageSize}`;
        
        // Добавляем параметры в зависимости от категории
        if (category === "all") {
            url += `&country=us`;
        } else if (category === "regional") {
            // Для региональных новостей можно использовать другую страну или регион
            url += `&country=ru`; // Или другой регион
        } else {
            url += `&category=${category}&country=us`;
        }

        const response = await fetch(url);

        console.log('Статус ответа:', response.status);
        console.log('URL запроса:', url);

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