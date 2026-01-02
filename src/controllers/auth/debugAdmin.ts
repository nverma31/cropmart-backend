import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { Roles } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';

export const debugAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userRepository = getRepository(User);
    const email = 'admin@cropmart.com';
    let user = await userRepository.findOne({ where: { email } });

    if (user) {
      // Reset password just in case
      user.password = 'admin123';
      user.hashPassword();
      user.isActive = true;
      user.role = Roles.ADMIN;
      await userRepository.save(user);

      return res.status(200).json({
        message: 'User exists. Password reset to admin123.',
        user: { id: user.id, email: user.email, role: user.role },
      });
    }

    user = new User();
    user.email = email;
    user.password = 'admin123';
    user.hashPassword();
    user.name = 'Cropmart Admin';
    user.role = Roles.ADMIN;
    user.isActive = true;
    await userRepository.save(user);

    return res.status(200).json({
      message: 'User created successfully.',
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: 'Debug failed', error: err });
  }
};
