import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { isValidUrl, isValidCode, generateRandomCode } from '@/lib/validators';

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

    if (req.method === 'POST') {
        return handleCreate(req, res);
    } else if (req.method === 'GET') {
        return handleList(req, res);
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
}

async function handleCreate(req: NextApiRequest, res: NextApiResponse) {
    const { target, code } = req.body;

    if (!target || typeof target !== 'string') {
        return res.status(400).json({ error: 'Invalid URL. Use http:// or https://' });
    }

    if (!isValidUrl(target)) {
        return res.status(400).json({ error: 'Invalid URL. Use http:// or https://' });
    }

    let finalCode = code;

    if (finalCode) {
        if (!isValidCode(finalCode)) {
            return res.status(400).json({ error: 'Code must be 6–8 alphanumeric characters' });
        }

        const existing = await prisma.link.findUnique({
            where: { code: finalCode },
        });

        if (existing && !existing.deleted) {
            return res.status(409).json({ error: 'Code already exists' });
        }
    } else {
        const maxAttempts = 5;
        let attempts = 0;
        let codeGenerated = false;

        while (attempts < maxAttempts && !codeGenerated) {
            finalCode = generateRandomCode(6);
            const existing = await prisma.link.findUnique({
                where: { code: finalCode },
            });

            if (!existing || existing.deleted) {
                codeGenerated = true;
            }
            attempts++;
        }

        if (!codeGenerated) {
            return res.status(500).json({ error: 'Could not generate unique code, try again' });
        }
    }

    const link = await prisma.link.create({
        data: {
            code: finalCode,
            target,
            total_clicks: 0,
            deleted: false,
        },
    });

    return res.status(201).json({
        code: link.code,
        target: link.target,
        total_clicks: link.total_clicks,
        last_clicked: link.last_clicked,
        created_at: link.created_at.toISOString(),
    });
}

async function handleList(req: NextApiRequest, res: NextApiResponse) {
    const { q, limit, offset } = req.query;

    const limitNum = Math.min(parseInt(limit as string) || 50, 100);
    const offsetNum = parseInt(offset as string) || 0;

    const where: any = { deleted: false };

    if (q && typeof q === 'string') {
        where.OR = [
            { code: { contains: q } },
            { target: { contains: q } },
        ];
    }

    const links = await prisma.link.findMany({
        where,
        take: limitNum,
        skip: offsetNum,
        orderBy: { created_at: 'desc' },
    });

    const response = links.map((link) => ({
        code: link.code,
        target: link.target,
        total_clicks: link.total_clicks,
        last_clicked: link.last_clicked,
        created_at: link.created_at.toISOString(),
    }));

    return res.status(200).json(response);
}
