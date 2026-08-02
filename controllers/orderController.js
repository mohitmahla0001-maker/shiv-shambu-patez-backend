const Order = require("../models/Order");
const transporter = require("../config/mailer");

const createOrder = async (req, res) => {
    try {
        const { customerName, phone, email, address, items, totalAmount } = req.body;

        if (!customerName || !phone || !address || !items || !totalAmount) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const order = await Order.create({ customerName, phone, email, address, items, totalAmount });

        sendOrderConfirmationEmail(order);

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function sendOrderConfirmationEmail(order) {

    const shortId = order._id.toString().slice(-6).toUpperCase();

    const itemsList = order.items
        .map(item => `${item.name} x${item.quantity} — ₹${item.price * item.quantity}`)
        .join("\n");

    if (order.email) {
        try {
            await transporter.sendMail({
                from: `"Shiv Shambu PATEZ" <${process.env.EMAIL_USER}>`,
                to: order.email,
                subject: `Order Confirmed - #${shortId}`,
                text: `Hi ${order.customerName},\n\nYour order has been placed successfully!\n\nOrder ID: #${shortId}\n\nItems:\n${itemsList}\n\nTotal: ₹${order.totalAmount}\n\nThank you for ordering with us!\n\n- Shiv Shambu PATEZ`,
            });
        } catch (error) {
            console.error("Customer email failed:", error.message);
        }
    }

    try {
        await transporter.sendMail({
            from: `"Shiv Shambu PATEZ" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: `🔔 New Order - #${shortId}`,
            text: `New order received!\n\nCustomer: ${order.customerName}\nPhone: ${order.phone}\nEmail: ${order.email || "N/A"}\nAddress: ${order.address}\n\nItems:\n${itemsList}\n\nTotal: ₹${order.totalAmount}`,
        });
    } catch (error) {
        console.error("Owner email failed:", error.message);
    }

}

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
};