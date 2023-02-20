export const documentAnalyticsEvents = {
    search: (searchLine: string) => ({
        name: 'document_search_event',
        prm_search_line: searchLine,
    }),
    clickDocument: (type: string, docName: string, docCategory: string) => ({
        name: 'document_click_document_event',
        prm_type: type,
        prm_doc_name: docName,
        prm_doc_category: docCategory,
    }),
    pv: (docName: string, docCategory: string) => ({
        name: 'document_pv',
        prm_doc_name: docName,
        prm_doc_category: docCategory,
    }),
} as const;
