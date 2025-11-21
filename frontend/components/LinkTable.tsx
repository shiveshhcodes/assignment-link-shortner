import React, { useState, useMemo } from 'react';
import { Link } from '../types';
import LinkRow from './LinkRow';


interface LinkTableProps {
    links: Link[];
    onDelete: (code: string) => void;
    isLoading?: boolean;
}

const ITEMS_PER_PAGE = 20;

const LinkTable: React.FC<LinkTableProps> = ({ links, onDelete, isLoading }) => {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredLinks = useMemo(() => {
        if (!search) return links;
        const lowerSearch = search.toLowerCase();
        return links.filter(
            (link) =>
                link.code.toLowerCase().includes(lowerSearch) ||
                link.target.toLowerCase().includes(lowerSearch)
        );
    }, [links, search]);

    const totalPages = Math.ceil(filteredLinks.length / ITEMS_PER_PAGE);
    const paginatedLinks = filteredLinks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    if (isLoading && links.length === 0) {
        return <div className="link-table-container"><div className="empty-state">Loading links...</div></div>;
    }

    return (
        <div className="link-table-container">
            <div className="table-controls">
                <input
                    type="text"
                    placeholder="Search by code or URL..."
                    className="search-input"
                    value={search}
                    onChange={handleSearchChange}
                    aria-label="Search links"
                />
            </div>

            <div className="table-responsive">
                <table className="link-table">
                    <thead>
                        <tr>
                            <th>Short Code</th>
                            <th>Target URL</th>
                            <th>Clicks</th>
                            <th>Last Clicked</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLinks.length > 0 ? (
                            paginatedLinks.map((link) => (
                                <LinkRow key={link.code} link={link} onDelete={onDelete} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="empty-state">
                                    {search ? 'No matching links found' : 'No links created yet'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="pagination-btn"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default LinkTable;
