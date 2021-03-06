import { useEffect, useState } from 'react';
import FirebaseAuthService from './FirebaseAuthService';
import FirebaseFirestoreService from './FirebaseFirestoreService';
import LoginForm from './components/LoginForm';
import AddEditRecipeForm from './components/AddEditRecipeForm';

import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes()
      .then(fetchedRecipes => setRecipes(fetchedRecipes))
      .catch(error => {
        console.error(error.message);
        throw error;
      });
  }, [user]);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  const fetchRecipes = async () => {
    const queries = [];
    if(!user) {
      queries.push({
        field: 'isPublished',
        condition: '==',
        value: true
      });
    };

    let fetchedRecipes = [];
    try {
      const response = await FirebaseFirestoreService.readDocuments({collection: 'recipes', queries: queries });

      const newRecipes = response.docs.map(recipeDoc => {
        const id = recipeDoc.id;
        const data = recipeDoc.data();
        data.publishDate = new Date(data.publishDate.seconds * 1000);
        return { ...data, id, }
      });

      fetchedRecipes = [...newRecipes];
    }
    catch (error) {
      console.error(error.message); throw error;
    }

    return fetchedRecipes;
  };

  const handleFetchRecipes = async () => {
    try {
      const fetchedRecipes = await fetchRecipes();
      setRecipes(fetchedRecipes);
    }
    catch (error) {
      console.error(error.message);
      throw (error);
    }
  };

  const handleAddRecipe = async (newRecipe) => {
    try {
      const response = await FirebaseFirestoreService.createDocument('recipes', newRecipe);
      handleFetchRecipes();
      alert(`Successfully created a recipe with ID = ${response.id}`);
    }
    catch (error) {
      alert(error.message);
    }
  };

  const lookupCategoryLabel = (categoryKey) => {
    const categories = {
      breadsSandwichesAndPizza: 'Breads, Sandwiches & Pizza',
      eggsAndBreakfast: 'Eggs & Breakfast',
      desertsAndBakedGoods: 'Deserts & Baked Goods',
      fishAndSeafood: 'Fish & Seafood',
      vegetables: 'Vegetables'
    };

    return categories[categoryKey];
  };

  const formatDate = (date) => {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  }

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes</h1>
        <LoginForm existingUser={user} />
      </div>
      <div className="main">
      <div className="center">
        <div className="recipe-list-box">
          {
            recipes && recipes.length > 0 ? (
              <div className="recipe-list">
                {
                  recipes.map((recipe) => {
                    return (
                      <div className="recipe-card" key={recipe.id}>
                        {
                          recipe.isPublished ? null : (
                            <div className="unpublished">UNPUBLISHED</div>
                          )
                        }
                        <div className="recipe-name">{recipe.name}</div>
                        <div className="recipe-field">Category: {lookupCategoryLabel(recipe.category)}</div>
                        <div className="recipe-field">Publish Date: {formatDate(recipe.publishDate)}</div>
                      </div>
                    );
                  })
                }
              </div>) : null
          }
        </div>
      </div>
        {
          user ? <AddEditRecipeForm handleAddRecipe={handleAddRecipe} /> : null
        }

      </div>
    </div>
  );
}

export default App;
