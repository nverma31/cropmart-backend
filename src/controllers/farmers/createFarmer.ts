import { Request, Response, NextFunction } from 'express';
import { getConnection, getRepository } from 'typeorm';

import { Farmer } from 'orm/entities/farmers/Farmer';
import { Roles } from 'orm/entities/users/types';
import { User } from 'orm/entities/users/User';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const createFarmer = async (req: Request, res: Response, next: NextFunction) => {
  const { phone, name, address, district, state, pincode, landHolding } = req.body;

  const userRepository = getRepository(User);

  // Check if user with phone already exists
  const existingUser = await userRepository.findOne({ where: { phone } });
  if (existingUser) {
    const customError = new CustomError(409, 'General', 'A user with this phone number already exists');
    return next(customError);
  }

  // Use transaction to create both User and Farmer
  const connection = getConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // Create User
    const user = new User();
    user.phone = phone;
    user.name = name || null;
    user.role = Roles.FARMER;
    user.isActive = true;
    const savedUser = await queryRunner.manager.save(user);

    // Create Farmer profile
    const farmer = new Farmer();
    farmer.userId = savedUser.id;
    farmer.address = address || null;
    farmer.district = district || null;
    farmer.state = state || null;
    farmer.pincode = pincode || null;
    farmer.landHolding = landHolding || null;
    const savedFarmer = await queryRunner.manager.save(farmer);

    await queryRunner.commitTransaction();

    // Return response with farmer and user data
    res.customSuccess(201, 'Farmer created successfully', {
      id: savedFarmer.id,
      userId: savedUser.id,
      phone: savedUser.phone,
      name: savedUser.name,
      role: savedUser.role,
      address: savedFarmer.address,
      district: savedFarmer.district,
      state: savedFarmer.state,
      pincode: savedFarmer.pincode,
      landHolding: savedFarmer.landHolding,
    });
  } catch (err) {
    await queryRunner.rollbackTransaction();
    const customError = new CustomError(500, 'Raw', 'Error creating farmer', null, err);
    return next(customError);
  } finally {
    await queryRunner.release();
  }
};
