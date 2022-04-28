import { useState } from 'react';

const AddEditRecipeForm = ({ handleAddRecipe }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);
  const [directions, setDirections] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientName, setIngredientName] = useState([]);

  const handleRecipeFormSubmit = (event) => {
    event.preventDefault();
    if(ingredients.length === 0) {
      alert('Ingredients cannot be empty. Please add at least one ingredient.');
      return;
    }

    const isPublished = !!(new Date(publishDate) <= new Date());

    const newRecipe = {
      name,
      category,
      publishDate: new Date(publishDate),
      isPublished,
      ingredients
    };

    handleAddRecipe(newRecipe);
  }

  const handleAddIngredient = (event) => {
    if (event.key && event.key !== 'Enter') {
      return;
    }

    event.preventDefault();

    if (!ingredientName) {
      alert('Missing ingredient field. Please double check.');
      return;
    }

    setIngredients((prev) => [...prev, ingredientName]);
    setIngredientName('');
  };

  return (<>
    <form
      className="add-edit-recipe-form-container"
      onSubmit={handleRecipeFormSubmit}>
      <h2>Add a New Recipe</h2>
      <div className="top-form-section">
        <div className="fields">
          <label className="recipe-label input-label">
            Recipe Name:
            <input
              required
              type="text"
              className="input-text"
              value={name}
              onChange={event => setName(event.target.value)} />
          </label>
          <label className="recipe-label input-label">
            Category:
            <select
              required
              className="select"
              value={category}
              onChange={event => setCategory(event.target.value)} >
              <option value=""></option>
              <option value="breadsSandwichesAndPizza">Breads, Sandwiches & Pizza</option>
              <option value="eggsAndBreakfast">Eggs & Breakfast</option>
              <option value="desertsAndBakedGoods">Deserts & Baked Goods</option>
              <option value="fishAndSeafood">Fish & Seafood</option>
              <option value="vegetables">Vegetables</option>
            </select>
          </label>
          <label className="recipe-label input-label">
            Directions:
            <textarea
              required
              className="input-text directions"
              value={directions}
              onChange={event => setDirections(event.target.value)}
            />
          </label>
          <label className="recipe-label input-label">
            Publish Date:
            <input
              required
              type="date"
              className="input-text"
              value={publishDate}
              onChange={event => setPublishDate(event.target.value)} />
          </label>
        </div>
      </div>
      <div className="ingredients-list">
        <h3 className="text-center">Ingredients</h3>
        <table className="ingredients-table">
          <thead>
            <tr>
              <th className="table-header">Ingredient</th>
              <th className="table-header">Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              ingredients && ingredients.length > 0 ? ingredients.map(ingredient => {
                return (
                  <tr key={ingredient}>
                    <td className="table-data text-center">{ingredient}</td>
                    <td className="ingredient-delete-box">
                      <button
                        type="button"
                        className="secondary-button ingredient-delete-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              }) : null
            }
          </tbody>
        </table>
        {
          ingredients && ingredients.length === 0 ?
            <h3 className="text-center no-ingredients">No Ingredients Added Yet</h3>
            : null
        }
      </div>
      <div className="ingredient-form">
        <label className="ingredient-label">
          Ingredient:
          <input
            type="text"
            className="input-text"
            placeholder="1 cup of sugar"
            value={ingredientName}
            onChange={event => setIngredientName(event.target.value)}
            onKeyPress={handleAddIngredient} />
        </label>
        <button
          type="button"
          className="primary-button add-ingredient-button"
          onClick={handleAddIngredient}>Add Ingredient</button>
      </div>
      <div className="action-buttons">
        <button type="submit" className="primary-button action-button">Create Recipe</button>
      </div>
    </form>
  </>);
};

export default AddEditRecipeForm;