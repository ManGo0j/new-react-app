import styles from "./style.module.css";

const Pagination = ({ 
    currentPage, 
    totalResults, 
    itemsPerPage, 
    onPageChange,
    position = "top",
    isChangingPage = false,
    isLoading = false,
    showAlways = false // Новый пропс - показывать всегда
}) => {
    const totalPages = Math.ceil(totalResults / itemsPerPage);
    
    // Если showAlways = false и всего 1 страница - не показываем
    // Если showAlways = true - показываем всегда (даже если 1 страница)
    if (totalPages <= 1 && !showAlways) return null;
    
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    // Рассчитываем диапазон страниц для отображения
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    
    // Функция для проверки, заблокирована ли кнопка
    const isButtonDisabled = (pageNumber) => {
        return (
            pageNumber === currentPage || // Текущая страница
            isChangingPage || // Идет смена страницы
            isLoading // Идет загрузка
        );
    };
    
    // Стиль для пагинации с одной страницей
    const singlePageClass = totalPages <= 1 ? styles.singlePage : '';
    
    return (
        <div className={`${styles.pagination} ${styles[position]} ${singlePageClass}`}>
            <div className={styles.info}>
                <span className={styles.pageInfo}>
                    {totalPages > 1 ? `Страница ${currentPage} из ${totalPages}` : 'Все новости'}
                </span>
                <span className={styles.results}> ({totalResults} новостей)</span>
                {isChangingPage && totalPages > 1 && (
                    <span className={styles.loadingIndicator}> • Загрузка...</span>
                )}
                {totalPages <= 1 && (
                    <span className={styles.singlePageNote}> (все на одной странице)</span>
                )}
            </div>
            
            {/* Кнопки пагинации показываем только если есть больше 1 страницы */}
            {totalPages > 1 && (
                <div className={styles.controls}>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1 || isChangingPage || isLoading}
                        className={styles.arrowBtn}
                        title="Предыдущая страница"
                    >
                        ←
                    </button>
                    
                    {startPage > 1 && (
                        <>
                            <button 
                                onClick={() => onPageChange(1)}
                                disabled={isButtonDisabled(1)}
                                className={`${styles.pageBtn} ${1 === currentPage ? styles.active : ''}`}
                            >
                                1
                            </button>
                            {startPage > 2 && <span className={styles.dots}>...</span>}
                        </>
                    )}
                    
                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => onPageChange(number)}
                            disabled={isButtonDisabled(number)}
                            className={`${styles.pageBtn} ${number === currentPage ? styles.active : ''}`}
                        >
                            {number}
                            {number === currentPage && isChangingPage && (
                                <span className={styles.loadingDot}> •</span>
                            )}
                        </button>
                    ))}
                    
                    {endPage < totalPages && (
                        <>
                            {endPage < totalPages - 1 && <span className={styles.dots}>...</span>}
                            <button 
                                onClick={() => onPageChange(totalPages)}
                                disabled={isButtonDisabled(totalPages)}
                                className={`${styles.pageBtn} ${totalPages === currentPage ? styles.active : ''}`}
                            >
                                {totalPages}
                            </button>
                        </>
                    )}
                    
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages || isChangingPage || isLoading}
                        className={styles.arrowBtn}
                        title="Следующая страница"
                    >
                        →
                    </button>
                </div>
            )}
        </div>
    );
};

export default Pagination;