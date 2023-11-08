import fs from "fs/promises";
import inquirer from "inquirer";

let pokemonName = "";

const handleNextPokemon = async () => {
  const options = {
    type: "list",
    name: "continue",
    message: "Download Another Pokemon?",
    choices: ["Yes", "No"],
  };
  return await inquirer.prompt(options);
};
const getPokemonName = () => {
  const questions = {
    type: "input",
    name: "pokemonName",
    message: "Write an pokemon name",
  };

  inquirer.prompt(questions).then((anwser) => {
    pokemonName = anwser.pokemonName;
    downloadPokemon();
  });
};

const getUserInput = async () => {
  const questions = {
    type: "checkbox",
    message: "Which data to download:",
    name: "userInput",
    choices: [
      new inquirer.Separator("Select: "),
      {
        name: "Artwork",
      },
      {
        name: "Sprites",
      },
      {
        name: "Stats",
      },
    ],

    validate(answer) {
      if (answer.length < 1) {
        return "You must chose at least 1 option";
      }

      return true;
    },
  };

  return await inquirer.prompt(questions);
};
const downloadPokemon = async () => {
  try {
    const data = (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)).json();

    const response = await data;

    const inputArr = await getUserInput();
    if (inputArr.userInput.length === 3) {
      let stats = "";
      for (const stat of response.stats) {
        stats += `${stat.stat.name}: ${stat.base_stat}\n`;
      }

      const artworkUrl = response.sprites.front_default;
      const artwork = await fetch(artworkUrl);

      fs.writeFile(`./pokemons/${pokemonName}.png`, artwork.body);
      fs.writeFile(`./pokemons/${pokemonName}.txt`, stats);
    } else {
    }
  } catch (err) {
    console.error("Enter valid pokemon name");
    getPokemonName();
  }
};

getPokemonName();
// handleNextPokemon();
