import type { GetServerSideProps } from 'next';

export default function HealthzPage() {
    return null;
}

export const getServerSideProps: GetServerSideProps = async () => {
    return {
        redirect: {
            destination: '/api/healthz',
            permanent: false,
        },
    };
};

