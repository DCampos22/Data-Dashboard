import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [totalRecipes, setTotalRecipes] = useState(0); // Track total number of recipes
  const [avgPrepTime, setAvgPrepTime] = useState(0); // Track average preparation time

  const apiKey = '2bb32b28f20f4f639f15dfa0200c703c'; // Replace with your Spoonacular API key

  // Fetch recipes from Spoonacular API
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=10&addRecipeInformation=true`
        );
        if (!response.ok) throw new Error('Failed to fetch recipes');

        const data = await response.json();
        setRecipes(data.results); // Save fetched recipes
        setFilteredRecipes(data.results); // Initially set filtered recipes to all recipes
        setTotalRecipes(data.results.length); // Set total number of recipes
        
        // Calculate average preparation time
        const totalPrepTime = data.results.reduce((acc, recipe) => acc + (recipe.readyInMinutes || 0), 0);
        const avgTime = data.results.length > 0 ? totalPrepTime / data.results.length : 0;
        setAvgPrepTime(avgTime);
        
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  // Handle search button click
  const handleSearch = () => {
    const filtered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  // Handle filter button toggle
  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  // Apply filters based on user input
  const applyFilters = async () => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&cuisine=${selectedCuisine}&diet=${selectedDiet}&number=10&addRecipeInformation=true`
      );
      if (!response.ok) throw new Error('Failed to fetch filtered recipes');

      const data = await response.json();
      setFilteredRecipes(data.results);

      // Update filtered recipe count and average prep time
      const totalPrepTime = data.results.reduce((acc, recipe) => acc + (recipe.readyInMinutes || 0), 0);
      const avgTime = data.results.length > 0 ? totalPrepTime / data.results.length : 0;
      setAvgPrepTime(avgTime);

    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  return (
    <div className="App">
      <h1>Recipe Dashboard</h1>

      {/* Search Bar */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Search for a recipe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button className="filter-button" onClick={handleFilterToggle}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="filter-section">
          <div className="filters-dropdown">
            <div>
              <label htmlFor="cuisine">Cuisine: </label>
              <select
                id="cuisine"
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
              >
                <option value="">Any</option>
                <option value="italian">Italian</option>
                <option value="mexican">Mexican</option>
                <option value="chinese">Chinese</option>
                {/* Add more cuisines as needed */}
              </select>
            </div>
            <div>
              <label htmlFor="diet">Diet: </label>
              <select
                id="diet"
                value={selectedDiet}
                onChange={(e) => setSelectedDiet(e.target.value)}
              >
                <option value="">Any</option>
                <option value="vegan">Vegan</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="gluten-free">Gluten Free</option>
                <option value="dairy-free">Dairy Free</option>
                <option value="paleo">Paleo</option>
                <option value="keto">Keto</option>
                <option value="low-carb">Low Carb</option>
                {/* Add more dietary preferences as needed */}
              </select>
            </div>
            <button onClick={applyFilters}>Apply Filters</button>
          </div>
        </div>
      )}

      {/* Display Statistics */}
      <div className="statistics-section">
        <p><strong>Total Recipes:</strong> {totalRecipes}</p>
        <p><strong>Filtered Recipes:</strong> {filteredRecipes.length}</p>
        <p><strong>Average Preparation Time:</strong> {Math.round(avgPrepTime)} minutes</p>
      </div>

      {/* Display Recipes */}
      <div className="recipe-list">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <h2>{recipe.title}</h2>
              <img src={recipe.image} alt={recipe.title} />
            </div>
          ))
        ) : (
          <p>No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default App;
