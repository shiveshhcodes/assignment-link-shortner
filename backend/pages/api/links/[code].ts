import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

function setCorsHeaders(res: NextApiResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { code } = req.query;

    if (typeof code !== 'string') {
        return res.status(400).json({ error: 'Invalid code' });
    }

    if (req.method === 'GET') {
        return handleGet(code, res);
    } else if (req.method === 'DELETE') {
        return handleDelete(code, res);
    } else {
        res.setHeader('Allow', ['GET', 'DELETE']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

async function handleGet(code: string, res: NextApiResponse) {
    const link = await prisma.link.findUnique({
        where: { code },
    });

    if (!link || link.deleted) {
        return res.status(404).json({ error: 'Not found' });
    }

    return res.status(200).json({
        code: link.code,
        target: link.target,
        total_clicks: link.total_clicks,
        last_clicked: link.last_clicked,
        created_at: link.created_at.toISOString(),
    });
}

async function handleDelete(code: string, res: NextApiResponse) {
    const link = await prisma.link.findUnique({
        where: { code },
    });

    if (!link || link.deleted) {
        return res.status(404).json({ error: 'Not found' });
    }

    await prisma.link.update({
        where: { code },
        data: { deleted: true },
    });

    return res.status(200).json({ ok: true });
}
