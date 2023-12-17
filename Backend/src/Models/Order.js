const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  items: [
    {
      medicine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Medicine", // Reference to the Medicine model
      },
      quantity: {
        type: Number,
      },
      price: {
        type: Number,
      },
      name: {
        type: String,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient", // Reference to the Patient model
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Wallet", "Card"],
    default: "COD",
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
