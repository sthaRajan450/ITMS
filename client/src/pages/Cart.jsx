import React, { useContext } from "react";
import { CartContext } from "../context/CartProvider";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config/api";

const Cart = () => {
  const { state, dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  const totalAmount = state.cartItems.reduce(
    (acc, item) => acc + item.price,
    0
  );

  const orderNow = async () => {
    const course = state.cartItems.map((course) => ({
      course_id: course._id,
      quantity: course.quantity,
    }));
    try {
      const response = await fetch(`${BASE_URL}/order/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(course),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.data);
        alert(data.message);
        let order_id = data.data._id;
        navigate("/payment", { state: { order_id, totalAmount } });
      }
    } catch (error) {
      console.log(("Failed to order:", error));
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
        🛒 Your Cart
      </h1>

      {state.cartItems.length > 0 ? (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {state.cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-md flex items-center justify-evenly overflow-hidden "
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-70 h-40 object-cover"
                />
                <div className="flex  justify-between m-4 items-center flex-1">
                  <div>
                    <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
                    <p className="text-gray-600 text-sm">📚 {item.category}</p>
                    <p className="text-gray-600 text-sm">🎓 {item.level}</p>
                    <p className="text-blue-600 font-bold mt-2">
                      NPR {item.price}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      dispatch({ type: "remove", payload: item._id })
                    }
                    className="text-sm p-5 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => dispatch({ type: "clear" })}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
            >
              Clear Cart
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
            <h2 className="text-2xl font-bold mb-6">💳 Payment Summary</h2>
            <div className="flex justify-between mb-4 text-lg">
              <span>Total Courses</span>
              <span>{state.cartItems.length}</span>
            </div>
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total Amount</span>
              <span className="text-green-600">NPR {totalAmount}</span>
            </div>
            <button
              onClick={() => {
                orderNow();
              }}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 justify-center items-center ">
          <div className="text-center text-gray-500 text-lg ">
            No items in cart yet.
          </div>
          <button
            className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-700"
            onClick={() => {
              navigate("/courses");
            }}
          >
            Continue Exploring
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
