import inquirer from "inquirer";

const getPokemonName = async () => {
  const questions = {
    type: "input",
    name: "name",
    message: "Write an pokemon name",
  };

  return await inquirer.prompt(questions);
};

const fetchPokemon = async (pokemonName) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
  return await response.json();
};

const handleLoop = async () => {
  const pokemonName = await getPokemonName();

  const json = await fetchPokemon(pokemonName.name);

  console.log(json);
};

handleLoop();
