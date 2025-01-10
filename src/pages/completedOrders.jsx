import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl, currency } from '../App';
import { assets } from '../assets/assets';

const CompletedOrders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return null;
  
    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        { completed: true }, // Include this filter
        { headers: { token } }
      );
  
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  


  const groupOrders = (orders) => {
    const grouped = {};
    orders.forEach((order) => {
      const key = `${order.address.firstName}-${order.address.lastName}-${
        order.address.phone
      }-${new Date(order.date).toLocaleDateString()}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(order);
    });
    return grouped;
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  const groupedOrders = groupOrders(orders);

  return (
    <div>
      <h3>Completed Order Page</h3>
      <div>
        {Object.keys(groupedOrders).map((groupKey, index) => {
          const group = groupedOrders[groupKey];
          const { address, date } = group[0];

          return (
            <div
              key={index}
              className="border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4"
            >
              {/* Common User Information */}
              <div className="mb-4">
                <h4 className="font-medium">
                  {address.firstName} {address.lastName}
                </h4>
                <p>
                  {address.street}, {address.city}, {address.state},{' '}
                  {address.country}, {address.zipcode}
                </p>
                <p>Phone: {address.phone}</p>
                <p>Date: {new Date(date).toLocaleDateString()}</p>
              </div>

              {/* Individual Orders */}
              {group.map((order, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_3fr_1fr_1fr_1fr] gap-3 items-start mb-4 border-2 border-gray-200 p-3 md:p-5"
                >
                  {/* Parcel Icon */}
                  <img
                    className="w-12"
                    src={assets.parcel_icon}
                    alt="Parcel Icon"
                  />

                  {/* Order Items */}
                  <div className="flex flex-col gap-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="mb-2">
                        <p>
                          <strong className="text-lg">{item.name}</strong> x{' '}
                          {item.quantity} (<span>{item.size}</span>)
                        </p>
                        <p className="text-base text-gray-600">
                          Spice Level:{' '}
                          {item.spiceLevel > 0
                            ? '🌶️'.repeat(item.spiceLevel)
                            : 'Mild'}
                        </p>
                        <div className=" grid md:grid-cols-3 grid-cols-1 grid-flow-dense  text-sm">
                          {item.proteins.map((protein, pIdx) => (
                            <p key={pIdx}>✓ {protein.name}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Info */}
                  <div>
                    <p>Items: {order.items.length}</p>
                    <p>Method: {order.paymentMethod}</p>
                    <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                  </div>

                  {/* Amount */}
                  <p>
                    {currency}
                    {order.amount}
                  </p>

                  <p className='p-2 font-semibold'>{order.status}</p>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompletedOrders;
