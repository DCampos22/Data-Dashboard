import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';

const apiKey = '2bb32b28f20f4f639f15dfa0200c703c'; // Replace with your actual API key

const App = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiet, setSelectedDiet] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&number=10&addRecipeInformation=true`
        );
        const data = await response.json();
        setRecipes(data.results);
        setFilteredRecipes(data.results);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = () => {
    const searchFiltered = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecipes(searchFiltered);
  };

const applyFilters = () => {
  const filtered = recipes.filter((recipe) => {
    const matchesDiet = selectedDiet ? recipe.diets && recipe.diets.includes(selectedDiet) : true;
    const matchesCuisine = selectedCuisine ? recipe.cuisines && recipe.cuisines.includes(selectedCuisine) : true;
    const matchesSearch = searchTerm ? recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return matchesDiet && matchesCuisine && matchesSearch;
  });
  setFilteredRecipes(filtered);
  setIsDropdownOpen(false); // Close dropdown after applying filters
};


  const totalRecipes = filteredRecipes.length;
  const avgPrepTime = filteredRecipes.reduce((acc, recipe) => acc + (recipe.readyInMinutes || 0), 0) / (totalRecipes || 1);

  return (
    <Router>
      <div className="App">
        <h1>Recipe Dashboard</h1>

        <div className="search-section">
          <input
            type="text"
            placeholder="Search for a recipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="filter-section">
          <button className="filter-button"onClick={() => setIsDropdownOpen(!isDropdownOpen)}>Filter</button>
          {isDropdownOpen && (
            <div className="filter-dropdown">
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
                </select>
              </div>
              <div>
                <label htmlFor="cuisine">Cuisine: </label>
                <select
                  id="cuisine"
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Mediterranean">Mediterranean</option>
                  {/* Add more cuisines as needed */}
                </select>
              </div>
              <button className="filter-button" onClick={applyFilters}>Apply Filters</button>
            </div>
          )}
        </div>

        <BarChart width={500} height={300} data={[
          { name: 'Total Recipes', count: totalRecipes },
          { name: 'Avg Prep Time (mins)', count: Math.round(avgPrepTime) },
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>

        <div className="recipe-list">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <Link to={`/recipe/${recipe.id}`}>
                <h2>{recipe.title}</h2>
                <img src={recipe.image} alt={recipe.title} />
              </Link>
            </div>
          ))}
        </div>

        <Routes>
          <Route path="/recipe/:id" element={<RecipeDetail recipes={recipes} />} />
        </Routes>
      </div>
    </Router>
  );
};

const RecipeDetail = ({ recipes }) => {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === parseInt(id));

  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div>
      <h2>{recipe.title}</h2>
      <img src={recipe.image} alt={recipe.title} />
      <p><strong>Preparation Time:</strong> {recipe.readyInMinutes} minutes</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>
      {/* Add more details as desired */}
    </div>
  );
};

export default App;
