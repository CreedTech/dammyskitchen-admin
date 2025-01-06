import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(15);
  const [proteins, setProteins] = useState([]);
  const [containers, setContainers] = useState([]);
  const [selectedProteins, setSelectedProteins] = useState([]);
  const [selectedContainers, setSelectedContainers] = useState([]);
  // const [proteinsIncluded, setProteinsIncluded] = useState([]);
  // const [extraProteins, setExtraProteins] = useState([]);
  // const [containerSizes, setContainerSizes] = useState([]);
  // const [category, setCategory] = useState('Food');
  // const [subCategory, setSubCategory] = useState('Main');
  const [bestseller, setBestseller] = useState(false);
  // const [sizes, setSizes] = useState([]);
  // const [litresAvailability, setLitresAvailability] = useState(false);
  // const [types, setTypes] = useState([]);
  const [spiceLevels, setSpiceLevels] = useState([]);
  const [tags, setTags] = useState('');
  // const [proteins, setProteins] = useState([]);
  // const [sideDishes, setSideDishes] = useState([]);
  // const [selectedProteins, setSelectedProteins] = useState([]);
  // const [selectedSideDishes, setSelectedSideDishes] = useState([]);

  // const handleAddProteinIncluded = (protein) => {
  //   setProteinsIncluded([...proteinsIncluded, protein]);
  // };

  // const handleAddExtraProtein = (protein) => {
  //   setExtraProteins([...extraProteins, protein]);
  // };

  // const handleAddContainerSize = (size, price, includesProtein) => {
  //   setContainerSizes([
  //     ...containerSizes,
  //     { size, price: Number(price), includesProtein: Boolean(includesProtein) },
  //   ]);
  // };

  useEffect(() => {
    // Fetch proteins and side dishes from backend
    const fetchOptions = async () => {
      try {
        const proteinResponse = await axios.get(
          `${backendUrl}/api/proteins/list`
        );
        const containerResponse = await axios.get(
          `${backendUrl}/api/containers/list`
        );
        setProteins(proteinResponse.data.proteins);
        setContainers(containerResponse.data.containers);
      } catch (error) {
        console.error('Error fetching proteins or containers:', error);
      }
    };
    fetchOptions();
  }, []);

  const toggleSelection = (id, setSelectedFn, selectedList) => {
    setSelectedFn(
      selectedList.includes(id)
        ? selectedList.filter((item) => item !== id)
        : [...selectedList, id]
    );
  };

  // const handleProteinSelect = (id) => {
  //   setSelectedProteins((prev) =>
  //     prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
  //   );
  // };

  // const handleSideDishSelect = (id) => {
  //   setSelectedSideDishes((prev) =>
  //     prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
  //   );
  // };

  // const handleTypeSelect = (type) => {
  //   setTypes((prev) =>
  //     prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
  //   );
  // };

  const handleSpiceLevelSelect = (level) => {
    setSpiceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      // formData.append('category', category);
      // formData.append('subCategory', subCategory);
      formData.append('bestseller', bestseller);
      // formData.append('sizes', JSON.stringify(sizes));
      // formData.append('litresAvailability', litresAvailability);
      // formData.append('types', JSON.stringify(types));
      formData.append('spiceLevels', JSON.stringify(spiceLevels));
      formData.append(
        'tags',
        JSON.stringify(tags.split(',').map((tag) => tag.trim()))
      );
      formData.append('proteins', JSON.stringify(selectedProteins));
      formData.append('containers', JSON.stringify(selectedContainers));

      image1 && formData.append('image1', image1);
      image2 && formData.append('image2', image2);
      image3 && formData.append('image3', image3);
      image4 && formData.append('image4', image4);

      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formData,
        {
          headers: { token },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setName('');
        setDescription('');
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice(15);
        // setSizes([]);
        // setLitresAvailability(false);
        // setTypes([]);
        setSelectedProteins([]);
        setSelectedContainers([]);
        setTags('');
        setSelectedProteins([]);
        // setSelectedSideDishes([]);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      {/* Image Upload */}
      <div>
        <p className="mb-2">Upload Image</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((image, idx) => (
            <label key={idx} htmlFor={`image${idx + 1}`}>
              <img
                className="w-20"
                src={image ? URL.createObjectURL(image) : assets.upload_area} // Ensure image is valid
                alt=""
              />
              <input
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    if (idx === 0) setImage1(file);
                    else if (idx === 1) setImage2(file);
                    else if (idx === 2) setImage3(file);
                    else if (idx === 3) setImage4(file);
                  }
                }}
                type="file"
                id={`image${idx + 1}`}
                hidden
              />
            </label>
          ))}
        </div>
      </div>

      {/* Basic Info */}
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Write content here"
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        {/* <div>
          <p className="mb-2">Category</p>
          <select
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Food">Food</option>
            <option value="Cake">Cake</option>
            <option value="Snacks">Snacks</option>
          </select>
        </div>

        <div>
          <p className="mb-2">Subcategory</p>
          <select
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full px-3 py-2"
          >
            <option value="Main">Main</option>
            <option value="Side">Side</option>
            <option value="Dessert">Dessert</option>
          </select>
        </div> */}

        <div>
          <p className="mb-2">Price</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="15"
          />
        </div>
      </div>

      {/* Sizes */}
      {/* <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex gap-3">
          {['S', 'M', 'L', 'XL'].map((size) => (
            <div
              key={size}
              onClick={() =>
                setSizes((prev) =>
                  prev.includes(size)
                    ? prev.filter((s) => s !== size)
                    : [...prev, size]
                )
              }
            >
              <p
                className={`${
                  sizes.includes(size) ? 'bg-pink-100' : 'bg-slate-200'
                } px-3 py-1 cursor-pointer`}
              >
                {size}
              </p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Tags */}
      <div className="w-full">
        <p className="mb-2">Tags</p>
        <input
          onChange={handleTagsChange}
          value={tags}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Comma-separated tags (e.g., Spicy, Vegan)"
        />
      </div>

      {/* Proteins, Side Dishes, and Spice Levels */}
      {/* <div>
        <h3>Proteins</h3>
        {proteins.length === 0 ? ( // Check if there are no side dishes
          <p className="text-gray-500">No protein available</p>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {proteins.map((protein) => (
              <div
                key={protein._id}
                onClick={() =>
                  selectedProteins(
                    (prev) =>
                      prev.includes(protein)
                        ? prev.filter((s) => s !== protein) // Remove from selection
                        : [...prev, protein] // Add to selection
                  )
                }
                className={`${
                  selectedProteins.includes(protein)
                    ? 'bg-pink-100'
                    : 'bg-slate-200'
                } px-3 py-1 cursor-pointer rounded`}
              >
                {protein.name} (+£{protein.price})
              </div>
            ))}
          </div>
        )}
     
      </div> */}
       <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Select Proteins</h3>
        <div className="flex gap-3 flex-wrap">
          {proteins.map((protein) => (
            <div
              key={protein._id}
              onClick={() => toggleSelection(protein._id, setSelectedProteins, selectedProteins)}
              className={`px-3 py-2 border rounded-md cursor-pointer ${
                selectedProteins.includes(protein._id) ? 'bg-blue-100 border-blue-500' : 'bg-white'
              }`}
            >
              {protein.name} (+£{protein.price})
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Select Containers</h3>
        <div className="flex gap-3 flex-wrap">
          {containers.map((container) => (
            <div
              key={container._id}
              onClick={() =>
                toggleSelection(container._id, setSelectedContainers, selectedContainers)
              }
              className={`px-3 py-2 border rounded-md cursor-pointer ${
                selectedContainers.includes(container._id)
                  ? 'bg-green-100 border-green-500'
                  : 'bg-white'
              }`}
            >
              {container.size} (£{container.price}){' '}
              {container.includesProtein ? '(Includes Protein)' : '(Plain)'}
            </div>
          ))}
        </div>
      </div>

      {/* <div>
        <h3>Side Dishes</h3>
        {sideDishes.length === 0 ? ( // Check if there are no side dishes
          <p className="text-gray-500">No side dish available</p>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {sideDishes.map((sideDish) => (
              <div
                key={sideDish._id}
                onClick={() =>
                  setSelectedSideDishes(
                    (prev) =>
                      prev.includes(sideDish)
                        ? prev.filter((s) => s !== sideDish) // Remove from selection
                        : [...prev, sideDish] // Add to selection
                  )
                }
                className={`${
                  selectedSideDishes.includes(sideDish)
                    ? 'bg-pink-100'
                    : 'bg-slate-200'
                } px-3 py-1 cursor-pointer rounded`}
              >
                {sideDish.name} (+£{sideDish.price})
              </div>
            ))}
          </div>
        )}
      </div> */}

     

      {/* Types */}
      {/* <div>
        <p className="mb-2">Types</p>
        <div className="flex gap-3">
          {['Hot', 'Cold'].map((type) => (
            <div
              key={type}
              onClick={() =>
                setTypes((prev) =>
                  prev.includes(type)
                    ? prev.filter((t) => t !== type)
                    : [...prev, type]
                )
              }
            >
              <p
                className={`${
                  types.includes(type) ? 'bg-pink-100' : 'bg-slate-200'
                } px-3 py-1 cursor-pointer`}
              >
                {type}
              </p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Spice Levels */}
      <div>
        <p className="mb-2">Spice Levels</p>
        <div className="flex gap-3">
          {[0, 1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              onClick={() => setSpiceLevels(level)} // Update state with the selected level
            >
              <p
                className={`${
                  spiceLevels === level ? 'bg-pink-100' : 'bg-slate-200'
                } px-3 py-1 cursor-pointer`}
              >
                {level}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
