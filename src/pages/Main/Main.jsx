import { useState, useEffect } from "react";
import { getNews } from "../../api/apiNews";
import NewsBanner from "../../components/NewsBanner/NewsBanner";
import styles from "./style.module.css";
import NewsList from "../../components/NewsList/NewsList";

const Main = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNews = async () => {
            console.log("Начало загрузки новостей...");
            
            try {
                setLoading(true);
                const response = await getNews();
                console.log("Ответ от API:", response);
                
                if (response && response.status === "ok") {
                    console.log("Количество новостей:", response.articles.length);
                    console.log("Первая новость:", response.articles[0]);
                    setNews(response.articles);
                } else {
                    console.error("Некорректный ответ API:", response);
                    setError("Некорректный ответ от сервера");
                }
            } catch (e) {
                console.error("Ошибка при запросе:", e);
                setError("Ошибка загрузки: " + e.message);
            } finally {
                setLoading(false);
                console.log("Загрузка завершена");
            }
        };
        
        fetchNews();
    }, []);

    // Для отображения состояния
    console.log("Текущее состояние:", { news, loading, error });

    if (loading) return <div className={styles.loading}>Загрузка новостей...</div>;
    if (error) return <div className={styles.error}>Ошибка: {error}</div>;
    if (news.length === 0) return <div className={styles.empty}>Новостей нет</div>;

return (
    <main className={styles.main}>
        {news.length > 0 ? (
            <>
                <NewsBanner item={{
                    image: news[0].urlToImage,      
                    title: news[0].title,
                    published: news[0].publishedAt,
                    author: news[0].author,
                    description: news[0].description
                }} />
                
                <NewsList news={news.map(article => ({
                    id: article.url,              
                    title: article.title,
                    image: article.urlToImage,      
                    published: article.publishedAt, 
                    author: article.author || "Unknown",
                    url: article.url
                }))} />
            </>
        ) : null}
    </main>
);;
};

export default Main;