import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LinkForm from '../components/LinkForm';
import LinkTable from '../components/LinkTable';
import Toast from '../components/Toast';
import ModalConfirm from '../components/ModalConfirm';
import CopyButton from '../components/CopyButton';
import { Link } from '../types';

export default function Home() {
    const [links, setLinks] = useState<Link[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; action?: React.ReactNode } | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; code: string | null; isLoading: boolean }>({
        isOpen: false,
        code: null,
        isLoading: false,
    });

    const fetchLinks = useCallback(async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
            const res = await fetch(`${baseUrl}/api/links`);
            if (!res.ok) throw new Error('Failed to fetch links');
            const data: Link[] = await res.json();
            setLinks(data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to load links', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLinks();
    }, [fetchLinks]);

    const handleLinkCreated = (newLink: Link) => {
        setLinks((prev) => [newLink, ...prev]);
        const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ''}/${newLink.code}`;
        setToast({
            message: `Link created: ${newLink.code}`,
            type: 'success',
            action: <CopyButton textToCopy={shortUrl} label="Copy Link" />,
        });
    };

    const handleDeleteClick = useCallback((code: string) => {
        setDeleteModal({ isOpen: true, code, isLoading: false });
    }, []);

    const handleConfirmDelete = async () => {
        if (!deleteModal.code) return;

        setDeleteModal((prev) => ({ ...prev, isLoading: true }));
        try {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
            const res = await fetch(`${baseUrl}/api/links/${deleteModal.code}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete link');

            setLinks((prev) => prev.filter((l) => l.code !== deleteModal.code));
            setToast({ message: 'Link deleted successfully', type: 'success' });
            setDeleteModal({ isOpen: false, code: null, isLoading: false });
        } catch (err) {
            console.error(err);
            setToast({ message: 'Failed to delete link', type: 'error' });
            setDeleteModal((prev) => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <>
            <Head>
                <title>TinyLink - Professional URL Shortener</title>
                <meta name="description" content="Shorten your links, expand your reach." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>

            <div className="app-container">
                <a href="#main-content" className="visually-hidden">Skip to content</a>
                <Header />

                <main id="main-content">
                    <section className="hero">
                        <div className="container hero__content">
                            <h1 className="hero__title">
                                Shorten Your Links,<br />
                                <span className="hero__title-highlight">Expand Your Reach</span>
                            </h1>
                            <p className="hero__subtitle">
                                The professional URL shortener for modern brands. Track clicks, manage links, and share with confidence.
                            </p>
                        </div>
                    </section>

                    <div className="container" style={{ paddingBottom: '4rem' }}>
                        <div className="dashboard-grid">
                            <LinkForm onSuccess={handleLinkCreated} />
                            <LinkTable links={links} onDelete={handleDeleteClick} isLoading={isLoading} />
                        </div>
                    </div>
                </main>

                <Footer />

                {toast && (
                    <div className="toast-container">
                        <Toast
                            message={toast.message}
                            type={toast.type}
                            action={toast.action}
                            onClose={() => setToast(null)}
                        />
                    </div>
                )}

                <ModalConfirm
                    isOpen={deleteModal.isOpen}
                    title="Delete Link"
                    message={`Are you sure you want to delete the link for code "${deleteModal.code}"? This action cannot be undone.`}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteModal({ isOpen: false, code: null, isLoading: false })}
                    isLoading={deleteModal.isLoading}
                />
            </div>

            <style jsx>{`
        .hero {
          padding: var(--space-3xl) 0 var(--space-2xl);
          text-align: center;
        }
        .hero__title {
          font-size: var(--font-size-3xl);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: var(--space-md);
          color: var(--color-text-main);
        }
        .hero__title-highlight {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .hero__subtitle {
          font-size: var(--font-size-lg);
          color: var(--color-text-muted);
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .dashboard-grid {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xl);
        }
        @media (min-width: 768px) {
          .hero__title {
            font-size: var(--font-size-4xl);
          }
        }
      `}</style>
        </>
    );
}
