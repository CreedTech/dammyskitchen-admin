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
  const [bestseller, setBestseller] = useState(false);
  const spiceLevelOptions = [0, 1, 2, 3, 4, 5]; // Spice levels
  const [spiceLevels, setSpiceLevels] = useState([]);
  const [tags, setTags] = useState('');

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

  const handleTagsChange = (e) => {
    setTags(e.target.value);
  };

  const handleSelectAll = () => {
    if (selectedProteins.length === proteins.length) {
      // Clear all selections
      setSelectedProteins([]);
    } else {
      // Select all proteins
      setSelectedProteins(proteins.map((protein) => protein._id));
    }
  };
  // Select or deselect all containers
  const handleSelectAllContainerSizes = () => {
    const selectableContainers = containers.filter(
      (container) => container.price !== Number(price)
    );
    if (selectedContainers.length === selectableContainers.length) {
      setSelectedContainers([]); // Deselect all
    } else {
      setSelectedContainers(
        selectableContainers.map((container) => container._id)
      );
    }
  };
  // Toggle individual spice level
  const toggleSpiceLevel = (level) => {
    setSpiceLevels(
      (prev) =>
        prev.includes(level)
          ? prev.filter((item) => item !== level) // Remove level if already selected
          : [...prev, level] // Add level if not already selected
    );
  };

  // Select all or deselect all spice levels
  const toggleSelectAll = () => {
    if (spiceLevels.length === spiceLevelOptions.length) {
      setSpiceLevels([]); // Deselect all
    } else {
      setSpiceLevels(spiceLevelOptions); // Select all
    }
  };

  // useEffect(() => {
  //   const calculatePriceFromContainers = () => {
  //     if (selectedContainers.length > 0) {
  //       // Assume `selectedContainers` contains objects with a `price` field
  //       const containerPrice = selectedContainers.reduce(
  //         (acc, container) => acc + (container.price || 0),
  //         0
  //       );
  //       setPrice(containerPrice); // Update the price state
  //     } else {
  //       setPrice(15); // Default base price
  //     }
  //   };

  //   calculatePriceFromContainers();
  // }, [selectedContainers]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('bestseller', bestseller);
      formData.append('spiceLevels', JSON.stringify(spiceLevels));
      formData.append(
        'tags',
        JSON.stringify(tags.split(',').map((tag) => tag.trim()))
      );
      formData.append('proteins', JSON.stringify(selectedProteins));
      formData.append('containerSizes', JSON.stringify(selectedContainers));

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
        setSelectedProteins([]);
        setSelectedContainers([]);
        setTags('');
        setSelectedProteins([]);
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
          // required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
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

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Select Proteins</h3>
        <div className="flex gap-2 mt-2">
          <input
            onClick={handleSelectAll}
            checked={selectedProteins.length === proteins.length}
            type="checkbox"
            id="selectAllProteins"
          />
          <label className="cursor-pointer" htmlFor="selectAllProteins">
            Select All
          </label>
        </div>

        <div className="flex gap-3 flex-wrap">
          {proteins.map((protein) => (
            <div
              key={protein._id}
              onClick={() =>
                toggleSelection(
                  protein._id,
                  setSelectedProteins,
                  selectedProteins
                )
              }
              className={`px-3 py-2 border rounded-md cursor-pointer ${
                selectedProteins.includes(protein._id)
                  ? 'bg-blue-100 border-blue-500'
                  : 'bg-white'
              }`}
            >
              {protein.name} <br /> +£{protein.price}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Select Containers</h3>
        <div className="flex gap-2 mt-2">
          <input
            onClick={handleSelectAllContainerSizes}
            checked={
              selectedContainers.length ===
              containers.filter(
                (container) => container.price !== Number(price)
              ).length
            }
            type="checkbox"
            id="selectAllContainers"
          />
          <label className="cursor-pointer" htmlFor="selectAllContainers">
            Select All
          </label>
        </div>
        <div className="flex gap-3 flex-wrap">
         {containers.map((container) => {
            const isDisabled = container.price === Number(price);

            return (
              <div
                key={container._id}
                onClick={() => {
                  if (!isDisabled) {
                    toggleSelection(container._id);
                  }
                }}
                className={`px-3 py-2 border rounded-md cursor-pointer ${
                  isDisabled
                    ? 'bg-gray-200 border-gray-400 cursor-not-allowed'
                    : selectedContainers.includes(container._id)
                    ? 'bg-green-100 border-green-500'
                    : 'bg-white'
                }`}
                style={{
                  pointerEvents: isDisabled ? 'none' : 'auto',
                }}
              >
                {container.size} <br /> £{container.price} <br/>
                 {container.includesProtein ? '(Includes Protein)' : '(Plain)'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Spice Levels */}
      <div>
        <p className="mb-2 font-medium">Spice Levels</p>
        <div className="flex items-center mb-3">
          <input
            type="checkbox"
            id="select-all-spice"
            checked={spiceLevels.length === spiceLevelOptions.length}
            onChange={toggleSelectAll}
          />
          <label
            htmlFor="select-all-spice"
            className="ml-2 text-sm cursor-pointer"
          >
            Select All
          </label>
        </div>
        <div className="flex gap-3 flex-wrap">
          {spiceLevelOptions.map((level) => (
            <div
              key={level}
              onClick={() => toggleSpiceLevel(level)}
              className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white"
              style={{
                backgroundColor: spiceLevels.includes(level)
                  ? '#fbcfe8'
                  : '#e2e8f0',
                transition: 'background-color 0.3s ease-in-out',
                borderRadius: '0.375rem',
                cursor: 'pointer',
              }}
            >
              {/* <input
                type="checkbox"
                id={`spice-level-${level}`}
                checked={spiceLevels.includes(level)}
                onChange={() => toggleSpiceLevel(level)}
              /> */}
              {/* <label
                htmlFor={`spice-level-${level}`}
                className="flex items-center gap-1 cursor-pointer text-sm"
              > */}
              {level === 0 ? (
                <span className="text-gray-600">No Spice</span>
              ) : (
                Array.from({ length: level }, (_, i) => (
                  <span key={i} className="text-red-500 text-lg">
                    🌶️
                  </span>
                ))
              )}
              {/* </label> */}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label className="cursor-pointer" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      <button type="submit" className="w-28 py-3 mt-4 bg-black text-white">
        ADD
      </button>
    </form>
  );
};

export default Add;
