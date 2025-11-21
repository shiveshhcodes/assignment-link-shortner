import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CopyButton from '../../components/CopyButton';
import { Link } from '../../types';
import { formatDateAbsolute, formatDateRelative } from '../../utils/formatDate';

export default function LinkDetails() {
    const router = useRouter();
    const { code } = router.query;
    const [link, setLink] = useState<Link | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!code) return;

        const fetchLink = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
                const res = await fetch(`${baseUrl}/api/links/${code}`);
                if (!res.ok) {
                    if (res.status === 404) throw new Error('Link not found');
                    throw new Error('Failed to fetch link details');
                }
                const data: Link = await res.json();
                setLink(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchLink();
    }, [code]);

    if (loading) {
        return (
            <>
                <Header />
                <main className="container" style={{ padding: '2rem 0' }}>Loading...</main>
                <Footer />
            </>
        );
    }

    if (error || !link) {
        return (
            <>
                <Header />
                <main className="container" style={{ padding: '2rem 0' }}>
                    <div style={{ color: 'var(--color-error)' }}>Error: {error || 'Link not found'}</div>
                    <button onClick={() => router.push('/')} className="btn btn--secondary" style={{ marginTop: '1rem' }}>
                        Back to Dashboard
                    </button>
                </main>
                <Footer />
            </>
        );
    }

    const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${link.code}`;

    return (
        <>
            <Head>
                <title>Link Details - {link.code}</title>
            </Head>
            <Header />
            <main className="container" style={{ padding: '2rem 0' }}>
                <button onClick={() => router.push('/')} className="btn btn--secondary" style={{ marginBottom: '1rem' }}>
                    &larr; Back to Dashboard
                </button>

                <div className="link-form"> {/* Reusing card style */}
                    <h1 className="link-form__title">Link Details: {link.code}</h1>

                    <div style={{ display: 'grid', gap: '1rem' }}>
                        <div>
                            <strong>Short URL:</strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>
                                    {shortUrl}
                                </a>
                                <CopyButton textToCopy={shortUrl} />
                            </div>
                        </div>

                        <div>
                            <strong>Target URL:</strong>
                            <div style={{ wordBreak: 'break-all', marginTop: '0.25rem' }}>
                                <a href={link.target} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)' }}>
                                    {link.target}
                                </a>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                            <div style={{ background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Total Clicks</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--color-primary)' }}>{link.total_clicks}</div>
                            </div>

                            <div style={{ background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Last Clicked</div>
                                <div style={{ fontSize: '1.125rem', fontWeight: '500' }} title={formatDateAbsolute(link.last_clicked)}>
                                    {formatDateRelative(link.last_clicked)}
                                </div>
                            </div>

                            <div style={{ background: 'var(--color-bg)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Created At</div>
                                <div style={{ fontSize: '1rem' }}>{formatDateAbsolute(link.created_at)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
