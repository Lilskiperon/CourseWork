/* eslint-disable react/prop-types */
import { useState, useEffect,useRef  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardProduct from './cards/CardProduct';
import CardNews from './cards/CardNews'
function ProductCarousel({ title, products, itemType}) {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const totalPages = 4;
    const prevPage = useRef(currentPage);  
    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width < 950) {
                setItemsPerPage(2); // Мобильные устройства - 2 элемента
            } else if (width < 1250) {
                setItemsPerPage(3); // Планшеты - 3 элемента
            }else if (width < 1450) {
                setItemsPerPage(4); // Планшеты - 4 элемента
            } else {
                setItemsPerPage(5); // Десктопы - 5 элементов
            }
        };

        window.addEventListener('resize', updateItemsPerPage);

        updateItemsPerPage();

        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);
    
    // Вычисляем текущие продукты
    const currentProducts = products.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );
    // Функция для переключения страниц
    const goToPage = (pageIndex) => {
        if (pageIndex >= 0 && pageIndex < totalPages) {
            prevPage.current = currentPage;
            setCurrentPage(pageIndex); // Обновляем страницу после выхода
        }
    };

    return (
        <section className="carousel-section">
                <button   onClick={() => goToPage(currentPage - 1)} className={`page-button left ${ currentPage === 0 ? 'disabled' : ''}`}>
                </button>
                <div className="collection-item">
                    <h2>{title}</h2>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentPage} 
                                initial={{ x: (prevPage.current < currentPage ? -1 : 1) * -150, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{
                                    opacity: 0
                                }} 
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="cards-list"
        
                            >
                                {itemType === 'product' ? (
                                    currentProducts.map(product => (
                                        <CardProduct key={product._id} product={product} />
                                    ))
                                ) : (
                                    currentProducts.map(product => (
                                        <CardNews key={product._id} news={product} />
                                    ))
                                )}
                            </motion.div>
                        </AnimatePresence>
                    <div className="page-list">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <span 
                                key={index} 
                                className={`dot ${index === currentPage ? 'active' : ''}`}
                                onClick={() => goToPage(index)}
                            />
                        ))}
                    </div>
                </div>
                <button onClick={() => goToPage(currentPage + 1)} className={`page-button right ${ currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                </button>

        </section>
    );
}

export default ProductCarousel;
