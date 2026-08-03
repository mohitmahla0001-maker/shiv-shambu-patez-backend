const express = require("express");
const router = express.Router();
const {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    verifyDeliveryOTP,
    deleteOrder,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrderById);
router.put("/:id", updateOrderStatus);
router.put("/:id/verify-otp", verifyDeliveryOTP);
router.delete("/:id", deleteOrder);

module.exports = router;