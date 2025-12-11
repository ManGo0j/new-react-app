import { useState, useEffect } from "react";
import { getNews } from "../../api/apiNews";
import NewsBanner from "../../components/NewsBanner/NewsBanner";
import styles from "./style.module.css";
import NewsList from "../../components/NewsList/NewsList";
import Skeleton from "../../components/Skeleton/Skeleton";

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


  console.log("Текущее состояние:", { news, loading, error });


  return (
    <main className={styles.main}>

      {news.length > 0 && !loading ? (
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

      {!loading ? (
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
      ) : news.length === 0 && !loading ? (
        <div className={styles.noNews}>Новостей нет</div>
      ) : (
        <Skeleton type="item" count={10} />
      )}
    </main>
  );
};

export default Main;
