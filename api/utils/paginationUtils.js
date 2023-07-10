class PaginationUtils {
    async pagination(currentPage, pageSize = 50, itemsReq) {
        const totalItems = itemsReq.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = currentPage * pageSize;
        const items = itemsReq.slice(startIndex, endIndex);
        return {
            currentPage,
            totalPages,
            pageSize,
            totalItems,
            items,
        };
    }
}

module.exports = { PaginationUtils };