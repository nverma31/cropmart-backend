import { Request, Response, NextFunction } from 'express';
import { getConnection, getRepository } from 'typeorm';

import { Intermediary } from 'orm/entities/intermediaries/Intermediary';
import { Roles } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const createIntermediary = async (req: Request, res: Response, next: NextFunction) => {
  const { phone, name, businessName, businessType, gstNumber, address, district, state, pincode } = req.body;

  const userRepository = getRepository(User);

  // Check if user with phone already exists
  const existingUser = await userRepository.findOne({ where: { phone } });
  if (existingUser) {
    const customError = new CustomError(409, 'General', 'A user with this phone number already exists');
    return next(customError);
  }

  // Use transaction to create both User and Intermediary
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Create User
    const user = new User();
    user.phone = phone;
    user.name = name || null;
    user.role = Roles.INTERMEDIARY;
    user.isActive = true;
    const savedUser = await queryRunner.manager.save(user);

    // Create Intermediary profile
    const intermediary = new Intermediary();
    intermediary.userId = savedUser.id;
    intermediary.businessName = businessName || null;
    intermediary.businessType = businessType || null;
    intermediary.gstNumber = gstNumber || null;
    intermediary.address = address || null;
    intermediary.district = district || null;
    intermediary.state = state || null;
    intermediary.pincode = pincode || null;
    const savedIntermediary = await queryRunner.manager.save(intermediary);

    await queryRunner.commitTransaction();

    // Return response with intermediary and user data
    res.customSuccess(201, 'Intermediary created successfully', {
      id: savedIntermediary.id,
      userId: savedUser.id,
      phone: savedUser.phone,
      name: savedUser.name,
      role: savedUser.role,
      businessName: savedIntermediary.businessName,
      businessType: savedIntermediary.businessType,
      gstNumber: savedIntermediary.gstNumber,
      address: savedIntermediary.address,
      district: savedIntermediary.district,
      state: savedIntermediary.state,
      pincode: savedIntermediary.pincode,
    });
  } catch (err) {
    await queryRunner.rollbackTransaction();
    const customError = new CustomError(500, 'Raw', 'Error creating intermediary', null, err);
    return next(customError);
  } finally {
    await queryRunner.release();
  }
};
