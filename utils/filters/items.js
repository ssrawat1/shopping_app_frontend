export const filterItems = (items, searchQuery) => {
  const query = searchQuery.trim().toLowerCase();
  console.log("products filter payload:", { query })
  return items.filter(({ title, category, description }) =>
    title.toLowerCase().includes(query) ||
    category.toLowerCase().includes(query) ||
    description.toLowerCase().includes(query)
  );
};
