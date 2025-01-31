import axios from 'axios';
import { useEffect, useState } from 'react';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';

const ListProtein = ({ token }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/proteins/list');
      if (response.data.success) {
        setList(response.data?.proteins.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/proteins/remove',
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Proteins List</p>
      <div className="flex flex-col gap-2">
        {/* ------- List Table Title ---------- */}

        <div className="hidden md:grid grid-cols-[3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          {/* <b>Image</b> */}
          <b>Name</b>
          {/* <b>Description</b> */}
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* ------ Product List ------ */}

        {list.map((item, index) => (
          <div
            className="grid grid-cols-[3fr_1fr_1fr] md:grid-cols-[3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={index}
          >
            {/* <img
              className="w-12 h-12 object-cover"
              src={item.image[0]}
              alt=""
            /> */}

            <p>{item.name}</p>
            {/* <p>{item.description}</p> */}
            <p>
              {currency}
              {item.price}
            </p>
            <p
              onClick={() => removeProduct(item._id)}
              className="text-right md:text-center cursor-pointer text-lg"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ListProtein;
