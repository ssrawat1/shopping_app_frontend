"use client"
import { filterItems } from "@/utils/filters/items";
import { useContext, createContext, useState } from "react"

const ProductContext = createContext({ products: [] });

export const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  /* Filter All Product Items: */
  const filteredProducts = filterItems(products, searchQuery);

  // console.log("Filtered Products:", filteredProducts)

  /* Pagination the filtered results: */
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(20);
  const lastItemIndex = currentPage * numberOfItems;
  const startingItemIndex = lastItemIndex - numberOfItems;

  /*  Calculate total pages based on filtered results */
  const totalNumberOfPages = Math.ceil((filteredProducts?.length) / numberOfItems)

  const paginatedProducts = filteredProducts?.slice(
    startingItemIndex,
    lastItemIndex
  );
  return (
    <ProductContext.Provider value={{ products, setProducts, paginatedProducts, totalNumberOfPages, currentPage, setCurrentPage, searchQuery, setSearchQuery,filteredProducts }}>
      {children}
    </ProductContext.Provider>
  )
}

export const useProductContext = () => {
  return useContext(ProductContext)
}
