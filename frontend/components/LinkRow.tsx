import React from 'react';
import { Link } from '../types';
import { formatDateRelative, formatDateAbsolute } from '../utils/formatDate';
import CopyButton from './CopyButton';


interface LinkRowProps {
    link: Link;
    onDelete: (code: string) => void;
}

const LinkRow: React.FC<LinkRowProps> = React.memo(({ link, onDelete }) => {
    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${link.code}`;

    return (
        <tr className="link-row">
            <td>
                <div className="link-code">{link.code}</div>
            </td>
            <td>
                <a
                    href={link.target}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-target"
                    title={link.target}
                >
                    {link.target}
                </a>
            </td>
            <td>{link.total_clicks}</td>
            <td title={formatDateAbsolute(link.last_clicked)}>
                {formatDateRelative(link.last_clicked)}
            </td>
            <td>
                <div className="link-actions">
                    <CopyButton textToCopy={shortUrl} />
                    <button
                        className="btn-icon btn-icon--delete"
                        onClick={() => onDelete(link.code)}
                        aria-label={`Delete link ${link.code}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"></polyline>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
});

LinkRow.displayName = 'LinkRow';

export default LinkRow;
