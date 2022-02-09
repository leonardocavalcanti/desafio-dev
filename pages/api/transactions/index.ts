import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: 'Not authenticated' });
    return;
  }

  // Get user
  const user = await prisma.user.findFirst({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  if (req.method == 'GET') {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        referenceDate: 'desc',
      },
    });

    res.status(200).json({ transactions });
  }

  if (req.method == 'POST') {
    try {
      await prisma.transaction.create({
        data: {
          userId: user.id,
          ...req.body,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(400).json({ error: 'Invalid Request' });

      return;
    }

    res.status(200).json({});
  }
}
