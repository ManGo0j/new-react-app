import { useState, useEffect } from "react";
import { getNews } from "../../api/apiNews";
import NewsBanner from "../../components/NewsBanner/NewsBanner";
import NewsList from "../../components/NewsList/NewsList";
import Skeleton from "../../components/Skeleton/Skeleton";
import Pagination from "../../components/Pagination/Pagination";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import styles from "./style.module.css";

const Main = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const [activeCategory, setActiveCategory] = useState("all");
    const itemsPerPage = 10;

    const fetchNews = async (page = 1, category = activeCategory) => {
        console.log(`Начинаю загрузку новостей, страница ${page}, категория ${category}...`);
        setLoading(true);
        setError(null);
        setIsChangingPage(true);

        try {
            const response = await getNews(page, itemsPerPage, category);
            console.log("Ответ от API:", response);

            if (response && response.status === "ok") {
                console.log("Количество новостей:", response.articles.length);
                console.log("Всего результатов:", response.totalResults);
                
                setNews(response.articles);
                setTotalResults(response.totalResults);
                setCurrentPage(page);
                
                if (response.articles.length === 0) {
                    setError(`Новости в категории не найдены`);
                }
            } else {
                console.error("Некорректный ответ API:", response);
                setError(response?.message || "Некорректный ответ от сервера");
                setNews([]);
                setTotalResults(response?.totalResults || 0);
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
        fetchNews(1, activeCategory);
    }, []);

    const handlePageChange = (page) => {
        if (
            page >= 1 && 
            page <= Math.ceil(totalResults / itemsPerPage) &&
            page !== currentPage && // Не позволяем выбрать текущую страницу
            !isChangingPage // Не позволяем кликать во время смены страницы
        ) {
            fetchNews(page, activeCategory);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCategoryChange = (category) => {
        if (category !== activeCategory && !isChangingPage) {
            setActiveCategory(category);
            setCurrentPage(1); // Сбрасываем на первую страницу при смене категории
            fetchNews(1, category);
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
        activeCategory,
        isChangingPage
    });

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                {/* Фильтр по категориям */}
                <CategoryFilter 
                    activeCategory={activeCategory}
                    onCategoryChange={handleCategoryChange}
                />

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

                {/* Пагинация сверху */}
                {showPagination && (
                    <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        position="top"
                        isChangingPage={isChangingPage}
                        isLoading={loading}
                        showAlways={true}
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
                        <p className={styles.noNewsTitle}>
                            {activeCategory === "all" 
                                ? "Новости не найдены" 
                                : `Новости в категории не найдены`
                            }
                        </p>
                        <p className={styles.noNewsSubtitle}>
                            Попробуйте выбрать другую категорию
                        </p>
                    </div>
                ) : (
                    <Skeleton type="item" count={5} />
                )}

                {/* Пагинация снизу */}
                {showPagination && (
                    <Pagination
                        currentPage={currentPage}
                        totalResults={totalResults}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                        position="bottom"
                        isChangingPage={isChangingPage}
                        isLoading={loading}
                        showAlways={true}
                    />
                )}

                {/* Сообщение об ошибке */}
                {error && !loading && news.length === 0 && (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button 
                            onClick={() => fetchNews(1, activeCategory)}
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