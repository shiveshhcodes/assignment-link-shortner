import type { GetServerSideProps } from 'next';
import { prisma } from '@/lib/prisma';

export default function RedirectPage() {
    return null;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { code } = context.params as { code: string };

    if (!code || typeof code !== 'string') {
        return {
            notFound: true,
        };
    }

    const link = await prisma.link.findUnique({
        where: { code },
    });

    if (!link || link.deleted) {
        return {
            notFound: true,
        };
    }

    await prisma.link.update({
        where: { code },
        data: {
            total_clicks: { increment: 1 },
            last_clicked: new Date(),
        },
    });

    return {
        redirect: {
            destination: link.target,
            statusCode: 302,
        },
    };
};
