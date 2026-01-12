import { useState, useRef, useEffect } from "react";
import styles from "./style.module.css";

const categories = [
    { id: "all", name: "Все новости" },
    { id: "general", name: "Главное" },
    { id: "technology", name: "Технологии" },
    { id: "business", name: "Бизнес" },
    { id: "entertainment", name: "Развлечения" },
    { id: "health", name: "Здоровье" },
    { id: "science", name: "Наука" },
    { id: "sports", name: "Спорт" },
    { id: "politics", name: "Политика" },
    { id: "regional", name: "Региональные" },
    { id: "life", name: "Жизнь" },
    { id: "world", name: "В мире" },
];

const CategoryFilter = ({ activeCategory = "all", onCategoryChange }) => {
    const [isScrolling, setIsScrolling] = useState(false);
    const containerRef = useRef(null);
    const scrollTimeoutRef = useRef(null);

    // Скролл к активной категории
    useEffect(() => {
        if (containerRef.current) {
            const activeElement = containerRef.current.querySelector(`[data-category="${activeCategory}"]`);
            if (activeElement) {
                const container = containerRef.current;
                const containerWidth = container.offsetWidth;
                const elementLeft = activeElement.offsetLeft;
                const elementWidth = activeElement.offsetWidth;
                
                container.scrollTo({
                    left: elementLeft - (containerWidth / 2) + (elementWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [activeCategory]);

    const handleScroll = () => {
        setIsScrolling(true);
        
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
            setIsScrolling(false);
        }, 150);
    };

    return (
        <div className={styles.categoryFilter}>
            <div className={styles.filterBar}>
                {/* Градиентные маски */}
                <div className={styles.maskOverlay}>
                    <div className={styles.maskLeft}></div>
                    <div className={styles.maskRight}></div>
                </div>
                
                <div 
                    className={styles.container}
                    ref={containerRef}
                    onScroll={handleScroll}
                >
                    <div className={styles.scrollContent}>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                data-category={category.id}
                                onClick={() => onCategoryChange(category.id)}
                                className={`${styles.categoryButton} ${activeCategory === category.id ? styles.active : ''}`}
                                disabled={isScrolling}
                            >
                                {category.name}
                                {activeCategory === category.id && (
                                    <span className={styles.activeIndicator}></span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryFilter;