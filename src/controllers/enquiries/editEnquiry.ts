import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { PurchaseEnquiry } from 'orm/entities/enquiries/PurchaseEnquiry';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const editEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { quantity, quantityUnit, expectedPrice, notes } = req.body;

  const enquiryRepository = getRepository(PurchaseEnquiry);

  try {
    const enquiry = await enquiryRepository.findOne({ where: { id: parseInt(id) } });

    if (!enquiry) {
      const customError = new CustomError(404, 'General', 'Enquiry not found');
      return next(customError);
    }

    // Update only the allowed fields
    if (quantity !== undefined) enquiry.quantity = quantity;
    if (quantityUnit !== undefined) enquiry.quantityUnit = quantityUnit;
    if (expectedPrice !== undefined) enquiry.expectedPrice = expectedPrice;
    if (notes !== undefined) enquiry.notes = notes;

    const updatedEnquiry = await enquiryRepository.save(enquiry);

    res.customSuccess(200, 'Enquiry updated successfully', updatedEnquiry);
  } catch (err) {
    const customError = new CustomError(500, 'Raw', 'Error updating enquiry', null, err);
    return next(customError);
  }
};
