import type { AppProps } from 'next/app';
import '../styles/global.css';
import '../styles/header.css';
import '../styles/footer.css';
import '../styles/linkform.css';
import '../styles/linktable.css';
import '../styles/linkrow.css';
import '../styles/modal.css';
import '../styles/toast.css';
import '../styles/copybutton.css';

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}
