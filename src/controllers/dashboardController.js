const { Knife, Service, Enquiry } = require("../models");
const asyncHandler = require("../utils/asyncHandler");
const { sendSuccess } = require("../utils/response");

const activeKnifeWhere = { active: true };

const getDashboardStats = asyncHandler(async (_req, res) => {
  const [
    totalKnives,
    activeKnives,
    availableKnives,
    soldKnives,
    reservedKnives,
    madeToOrderKnives,
    totalServices,
    activeServices,
    pendingEnquiries,
    totalEnquiries,
  ] = await Promise.all([
    Knife.count(),
    Knife.count({ where: activeKnifeWhere }),
    Knife.count({ where: { ...activeKnifeWhere, availability: "Available" } }),
    Knife.count({ where: { ...activeKnifeWhere, availability: "Sold" } }),
    Knife.count({ where: { ...activeKnifeWhere, availability: "Reserved" } }),
    Knife.count({
      where: { ...activeKnifeWhere, availability: "Made to Order" },
    }),
    Service.count(),
    Service.count({ where: { active: true } }),
    Enquiry.count({ where: { status: "New" } }),
    Enquiry.count(),
  ]);

  sendSuccess(res, {
    totalKnives,
    activeKnives,
    availableKnives,
    soldKnives,
    reservedKnives,
    madeToOrderKnives,
    totalServices,
    activeServices,
    pendingEnquiries,
    totalEnquiries,
  });
});

module.exports = { getDashboardStats };
