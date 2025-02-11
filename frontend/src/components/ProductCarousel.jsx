import React, { useState, useEffect } from 'react';
import CardProduct from './cards/CardProduct';
import CardNews from './cards/CardNews'
function ProductCarousel({ title, products, itemType}) {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const totalPages = 4;
    useEffect(() => {
        const updateItemsPerPage = () => {
            const width = window.innerWidth;
            if (width < 950) {
                setItemsPerPage(2); // Мобильные устройства - 2 элемента
            } else if (width < 1250) {
                setItemsPerPage(3); // Планшеты - 3 элемента
            }else if (width < 1450) {
                setItemsPerPage(4); // Планшеты - 3 элемента
            } else {
                setItemsPerPage(5); // Десктопы - 5 элементов
            }
        };

        window.addEventListener('resize', updateItemsPerPage);

        updateItemsPerPage();

        return () => window.removeEventListener('resize', updateItemsPerPage);
    }, []);
    useEffect(() => {
        const fetchAndRenderSvg = (url, targetId) => {
            fetch(url)
                .then((response) => response.text())
                .then((svgContent) => {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.innerHTML = svgContent;

                        const circles = targetElement.querySelectorAll('circle');

                        // Обновить внешний вид точек
                        const updateActiveCircle = () => {
                            circles.forEach((circle, index) => {
                                circle.style.fillOpacity =
                                    index-1 === currentPage ? '1' : '0';
                            });
                        };


                        // Установить обработчики кликов
                        circles.forEach((circle, index) => {
                            circle.addEventListener('click', () => {
                                setCurrentPage(index-1);
                            });
                        });

                        // Обновить начальное состояние
                        updateActiveCircle();

                        // Обновляем точки при изменении currentPage
                        const observer = new MutationObserver(() => {
                            updateActiveCircle();
                        });

                        observer.observe(targetElement, {
                            childList: true,
                            subtree: true,
                        });
                    }
                })
                .catch((error) =>
                    console.error('Error loading SVG:', error)
                );
        };

        // Загрузка SVG для точек
        fetchAndRenderSvg(
            '/assets/svg/ellipse.svg',
            `${title}-pagination`
        );
    }, [title, currentPage]);
    
    // Вычисляем текущие продукты
    const currentProducts = products.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
    );

    // Функция для переключения страниц
    const goToPage = (pageIndex) => {
        if (pageIndex >= 0 && pageIndex < totalPages) {
            setCurrentPage(pageIndex);
        }
    };

    return (
        <section className="carousel-section">
                <a className="scroll-control page-button"
                    onClick={() => goToPage(currentPage - 1)}>
                    <div className={`circle circle1 ${ currentPage === 0 ? 'disabled' : ''}`}>
                        <div className="circle circle2">
                            <svg className="svgiconarrow">
                                <use href="/assets/svg/sprite-icons.svg#icon-left-arrow"></use>
                            </svg>
                        </div>
                    </div>
                </a>
                <div className="content">
                    <div className="collection-item ">
                        <h2>{title}</h2>
                        <div className="cards-list">
                        {itemType === 'product' ? (
                            currentProducts.flatMap(product => 
                                product.packagingOptions.map(packagingOption => (
                                    <CardProduct key={packagingOption.packagingId} product={product} packagingOption={packagingOption} />
                                ))
                            ).slice(0, itemsPerPage) 
                        ) : (
                            currentProducts.map(product => (
                                <CardNews key={product.id} news={product} />
                            ))
                        )}
                    </div>
                    <span id={`${title}-pagination`} className="page-list"></span>
                    </div>
                </div>
                    
                <a className="scroll-control page-button" 
                    onClick={() => goToPage(currentPage + 1)}>
                    <div className={`circle circle1 ${ currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                        <div className="circle circle2">
                            <svg className="svgiconarrow">
                                <use href="/assets/svg/sprite-icons.svg#icon-right-arrow"></use>
                            </svg>
                        </div>
                    </div>
                </a>
        </section>
    );
}

export default ProductCarousel;
