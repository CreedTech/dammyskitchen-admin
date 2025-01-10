import { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const AddSideDishAndProtein = ({ token }) => {
  const [name, setName] = useState('');

  const [price, setPrice] = useState('');


  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const endpoint = `${backendUrl}/api/proteins/add`;

      const data = {
        name,
        // description,
        price: parseFloat(price),
        // meals: linkedMeals, // Array of selected product IDs
      };

      const response = await axios.post(endpoint, data, {
        headers: { token },
      });

      if (response.data.success) {
        toast.success(`Protein added successfully!`);
        setName('');
        setPrice('');
        // setLinkedMeals([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to add item. Please try again.');
    }
  };

  //   const handleMealSelection = (id) => {
  //     setLinkedMeals((prev) =>
  //       prev.includes(id) ? prev.filter((mealId) => mealId !== id) : [...prev, id]
  //     );
  //   };

  return (
    <div className="flex flex-col items-center w-full p-4">
      <h1 className="text-2xl font-bold mb-4">
        {/* {isSideDish ? 'Add Side Dish' : 'Add Protein'} */}
        Add Protein
      </h1>
      {/* <button
        onClick={() => setIsSideDish((prev) => !prev)}
        className="bg-black text-white py-2 px-4 rounded mb-4"
      >
        Switch to {isSideDish ? 'Protein' : 'Side Dish'}
      </button> */}

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <div>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder={`Enter protein name`}
            required
          />
        </div>

        {/* <div>
          <label className="block mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder={`Describe the ${isSideDish ? 'side dish' : 'protein'}`}
          ></textarea>
        </div> */}

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

        {/* <div>
          <label className="block mb-2">Linked Meals (Select Products)</label>
          <div className="border border-gray-300 rounded p-2 max-h-40 overflow-y-auto">
            {products.map((product) => (
              <label key={product._id} className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  value={product._id}
                  checked={linkedMeals.includes(product._id)}
                  onChange={() => handleMealSelection(product._id)}
                />
                {product.name}
              </label>
            ))}
          </div>
        </div> */}

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded hover:bg-green-600 transition"
        >
          Add Protein
        </button>
      </form>
    </div>
  );
};

export default AddSideDishAndProtein;
