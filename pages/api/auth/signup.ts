import prisma from '../../../lib/prisma';
import { hashPassword } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.send(200);
    res.end();
    return;
  }

  const data = req.body;
  const { email, password, name } = data;

  if (!email || !email.includes('@')) {
    return res.status(422).json({ message: 'Invalid email' });
  }

  if (!password || password.trim().length < 7) {
    return res.status(422).json({ message: 'Invalid input - password should be at least 7 characters long.' });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
      ],
    },
  });

  if (existingUser) {
    return res.status(409).json({ message: 'Email address is already registered' });
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
    },
    create: {
      email,
      password: hashedPassword,
      name,
    },
  });

  return res.status(201).json({ message: 'Created user' });
}
