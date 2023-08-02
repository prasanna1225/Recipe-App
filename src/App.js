import React, { useState } from "react";
import Axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Footer from "./components/Footer";
import Header from './components/headerComponent';
import Recipe from './components/recipeComponent';

const APP_ID = "df324cf3";
const APP_KEY = "ddc5d375a314e1822bfbc0a20b8266c4";

const RecipeComponent = (props) => {
  const [show, setShow] = useState("");

  const { label, image, ingredients, url } = props.recipe;
  return (
    <Recipe.RecipeContainer>
      <Dialog
        onClose={() => console.log("Container Closed")}
        aria-labelledby="simple-dialog-title"
        open={!!show}
      >
        <DialogTitle>Ingredients</DialogTitle>
        <DialogContent>
          <Recipe.RecipeName>{label}</Recipe.RecipeName>
          <table>
            <thead>
              <th>Ingredient</th>
              <th>Weight</th>
            </thead>
            <tbody>
              {ingredients.map((ingredient, index) => (
                <tr key={index} className="ingredient-list">
                  <td>{ingredient.text}</td>
                  <td>{ingredient.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Recipe.SeeNewTab onClick={() => window.open(url)}>See More</Recipe.SeeNewTab>
          <Recipe.SeeMoreText onClick={() => setShow("")}>Close</Recipe.SeeMoreText>
        </DialogActions>
      </Dialog>
      <Recipe.RecipeName>{label}</Recipe.RecipeName>
      <Recipe.CoverImage src={image} alt={label} />
      <Recipe.IngredientsText onClick={() => setShow(!show)}>
        Ingredients List
      </Recipe.IngredientsText>
      <Recipe.SeeMoreText onClick={() => window.open(url)}>
        Full Recipe
      </Recipe.SeeMoreText>
    </Recipe.RecipeContainer>
  );
};

const AppComponent = () => {
  const [searchQuery, updateSearchQuery] = useState("");
  const [recipeList, updateRecipeList] = useState([]);
  const [timeoutId, updateTimeoutId] = useState();
  const fetchData = async (searchString) => {
    const response = await Axios.get(
      `https://api.edamam.com/search?q=${searchString}&app_id=${APP_ID}&app_key=${APP_KEY}`,
    );
    updateRecipeList(response.data.hits);
  };

  const onTextChange = (e) => {
    clearTimeout(timeoutId);
    updateSearchQuery(e.target.value);
    const timeout = setTimeout(() => fetchData(e.target.value), 500);
    updateTimeoutId(timeout);
  };

  return (
    <>
    <Header.Container>
      <Header.Header>
        <Header.AppName>
        <Header.RecipeImage src="/images/Book.svg"/>
          Recipe App
        </Header.AppName>
        <Header.SearchBox>
          <Header.SearchIcon src='/images/Search.svg'/>
          <Header.SearchInput
            placeholder="Search Recipe"
            value={searchQuery}
            onChange={onTextChange}
          />
        </Header.SearchBox>
      </Header.Header>
      <Header.RecipeListContainer>
        {recipeList?.length ? (
          recipeList.map((recipe, index) => (
            <RecipeComponent key={index} recipe={recipe.recipe} />
          ))
        ) : (
          <Header.Placeholder src="/images/Book.svg"/>
        )}
      </Header.RecipeListContainer>
    </Header.Container>
    <Footer/>
    </>
  );
};

export default AppComponent;