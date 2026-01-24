import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { PurchaseEnquiry } from 'orm/entities/enquiries/PurchaseEnquiry';
import { CustomError } from 'utils/response/custom-error/CustomError';

export const editEnquiry = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const {
    quantity,
    quantityUnit,
    expectedPrice,
    notes,
    kaInventoryEntry,
    kaLinkedId,
    enquiryDate,
    location,
    state,
    product,
    quantityMt,
    ratePerMt,
    cashDiscountPercentage,
    bagPacking,
    financePercentage,
    gstPercentage,
    purchaseDays,
    purchaseConditions,
    paymentConditions,
    qcParametersBuyer,
    pickupLocation,
    qcParametersFarmer,
  } = req.body;

  const enquiryRepository = getRepository(PurchaseEnquiry);

  try {
    const enquiry = await enquiryRepository.findOne({ where: { id: parseInt(id) } });

    if (!enquiry) {
      const customError = new CustomError(404, 'General', 'Enquiry not found');
      return next(customError);
    }

    // Update fields
    if (quantity !== undefined) enquiry.quantity = quantity;
    if (quantityUnit !== undefined) enquiry.quantityUnit = quantityUnit;
    if (expectedPrice !== undefined) enquiry.expectedPrice = expectedPrice;
    if (notes !== undefined) enquiry.notes = notes;
    if (kaInventoryEntry !== undefined) enquiry.kaInventoryEntry = kaInventoryEntry;
    if (kaLinkedId !== undefined) enquiry.kaLinkedId = kaLinkedId;
    if (enquiryDate !== undefined) enquiry.enquiryDate = enquiryDate;
    if (location !== undefined) enquiry.location = location;
    if (state !== undefined) enquiry.state = state;
    if (product !== undefined) enquiry.product = product;
    if (quantityMt !== undefined) enquiry.quantityMt = quantityMt;
    if (ratePerMt !== undefined) enquiry.ratePerMt = ratePerMt;
    if (cashDiscountPercentage !== undefined) enquiry.cashDiscountPercentage = cashDiscountPercentage;
    if (bagPacking !== undefined) enquiry.bagPacking = bagPacking;
    if (financePercentage !== undefined) enquiry.financePercentage = financePercentage;
    if (gstPercentage !== undefined) enquiry.gstPercentage = gstPercentage;
    if (purchaseDays !== undefined) enquiry.purchaseDays = purchaseDays;
    if (purchaseConditions !== undefined) enquiry.purchaseConditions = purchaseConditions;
    if (paymentConditions !== undefined) enquiry.paymentConditions = paymentConditions;
    if (qcParametersBuyer !== undefined) enquiry.qcParametersBuyer = qcParametersBuyer;
    if (pickupLocation !== undefined) enquiry.pickupLocation = pickupLocation;
    if (qcParametersFarmer !== undefined) enquiry.qcParametersFarmer = qcParametersFarmer;

    const updatedEnquiry = await enquiryRepository.save(enquiry);

    res.customSuccess(200, 'Enquiry updated successfully', updatedEnquiry);
  } catch (err) {
    const customError = new CustomError(500, 'Raw', 'Error updating enquiry', null, err);
    return next(customError);
  }
};
