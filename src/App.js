import { useState } from 'react';
import FirebaseAuthService from './FirebaseAuthService';
import FirebaseFirestoreService from './FirebaseFirestoreService';
import LoginForm from './components/LoginForm';
import AddEditRecipeForm from './components/AddEditRecipeForm';

import './App.css';

function App() {
  const [user, setUser] = useState(null);

  FirebaseAuthService.subscribeToAuthChanges(setUser);

  const handleAddRecipe = async (newRecipe) => {
    try {
      const response = await FirebaseFirestoreService.createDocument('recipes', newRecipe);

      alert(`Successfully created a recipe with ID = ${response.id}`);
    }
    catch(error) {
      alert(error.message);
    }
  }

  return (
    <div className="App">
      <div className="title-row">
        <h1 className="title">Firebase Recipes</h1>
        <LoginForm existingUser={user} />
      </div>
      <div className="main">
        {
          user ? <AddEditRecipeForm handleAddRecipe={handleAddRecipe}/> : null
        }

      </div>
    </div>
  );
}

export default App;
