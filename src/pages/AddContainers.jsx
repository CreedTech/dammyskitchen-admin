import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const AddContainers = ({ token }) => {
  const [size, setSize] = useState('');
  const [price, setPrice] = useState('');
  const [includesProtein, setIncludesProtein] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const endpoint = `${backendUrl}/api/containers/add`;

      const data = {
        size,
        price: parseFloat(price),
        includesProtein,
      };

      const response = await axios.post(endpoint, data, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success('Container added successfully!');
        setSize('');
        setPrice('');
        setIncludesProtein(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add container. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Add Container</h1>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <div>
          <label className="block mb-2">Size</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter container size (e.g., 750 ml, 2 liters)"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Price (£)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Enter price"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includesProtein}
              onChange={(e) => setIncludesProtein(e.target.checked)}
              className="w-4 h-4"
            />
            Includes Protein
          </label>
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:bg-green-600 transition"
        >
          Add Container
        </button>
      </form>
    </div>
  );
};

export default AddContainers;
