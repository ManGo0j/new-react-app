import { useState, useEffect } from "react";
import { getNews } from "../../api/apiNews";
import NewsBanner from "../../components/NewsBanner/NewsBanner";
import NewsList from "../../components/NewsList/NewsList";
import Skeleton from "../../components/Skeleton/Skeleton";
import Pagination from "../../components/Pagination/Pagination";
import styles from "./style.module.css";

const Main = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const itemsPerPage = 10;

    const fetchNews = async (page = 1) => {
        console.log(`Начинаю загрузку новостей, страница ${page}...`);
        setLoading(true);
        setError(null);
        setIsChangingPage(true);

        try {
            const response = await getNews(page, itemsPerPage);
            console.log("Ответ от API:", response);

            if (response && response.status === "ok") {
                console.log("Количество новостей:", response.articles.length);
                console.log("Всего результатов:", response.totalResults);
                
                setNews(response.articles);
                setTotalResults(response.totalResults);
                setCurrentPage(page);
                
                if (response.articles.length === 0) {
                    setError("Новости не найдены");
                }
            } else {
                console.error("Некорректный ответ API:", response);
                setError(response?.message || "Некорректный ответ от сервера");
                setNews([]);
                setTotalResults(response?.totalResults || 0); // Сохраняем totalResults даже при ошибке
            }
        } catch (e) {
            console.error("Ошибка при запросе:", e);
            setError("Ошибка загрузки: " + e.message);
            setNews([]);
            setTotalResults(0);
        } finally {
            setLoading(false);
            // Задержка для предотвращения двойных кликов
            setTimeout(() => setIsChangingPage(false), 300);
            console.log("Загрузка завершена");
        }
    };

    useEffect(() => {
        fetchNews(1);
    }, []);

    const handlePageChange = (page) => {
        if (
            page >= 1 && 
            page <= Math.ceil(totalResults / itemsPerPage) &&
            page !== currentPage && // Не позволяем выбрать текущую страницу
            !isChangingPage // Не позволяем кликать во время смены страницы
        ) {
            fetchNews(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const totalPages = Math.ceil(totalResults / itemsPerPage);
    const showPagination = totalPages > 1;

    console.log("Текущее состояние:", { 
        news: news.length, 
        loading, 
        error, 
        currentPage, 
        totalResults,
        totalPages,
        showPagination,
        isChangingPage
    });

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {/* Баннер */}
                {!loading && news.length > 0 ? (
                    <NewsBanner
                        item={{
                            image: news[0].urlToImage,
                            title: news[0].title,
                            published: news[0].publishedAt,
                            author: news[0].author,
                            description: news[0].description,
                        }}
                    />
                ) : (
                    <Skeleton type="banner" count={1} />
                )}

                {/* Пагинация сверху - ПОКАЗЫВАЕМ ВСЕГДА, если есть более 1 страницы */}
                {showPagination && (
                    <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        position="top"
                        isChangingPage={isChangingPage}
                        isLoading={loading}
                        showAlways={true} // Пагинация всегда видна
                    />
                )}

                {/* Список новостей */}
                {!loading && news.length > 0 ? (
                    <NewsList
                        news={news.map((article) => ({
                            id: article.url,
                            title: article.title,
                            image: article.urlToImage,
                            published: article.publishedAt,
                            author: article.author || "Unknown",
                            url: article.url,
                        }))}
                    />
                ) : !loading && news.length === 0 ? (
                    <div className={styles.noNews}>
                        {error || "Новости не найдены"}
                    </div>
                ) : (
                    <Skeleton type="item" count={5} />
                )}

                {/* Пагинация снизу - ПОКАЗЫВАЕМ ВСЕГДА, если есть более 1 страницы */}
                {showPagination && (
                    <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        position="bottom"
                        isChangingPage={isChangingPage}
                        isLoading={loading}
                        showAlways={true} // Пагинация всегда видна
                    />
                )}

                {/* Сообщение об ошибке */}
                {error && !loading && news.length === 0 && (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button 
                            onClick={() => fetchNews(1)}
                            className={styles.retryBtn}
                            disabled={loading}
                        >
                            {loading ? "Загрузка..." : "Попробовать снова"}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Main;