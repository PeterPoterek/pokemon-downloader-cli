import fs from "fs/promises";
import inquirer from "inquirer";

let pokemonName = "";

const getPokemonName = () => {
  const questions = {
    type: "input",
    name: "pokemonName",
    message: "Write an pokemon name",
  };

  inquirer.prompt(questions).then((anwser) => {
    pokemonName = anwser.pokemonName;
    downloadPokemon();
    getUserInput();
  });
};

const getUserInput = () => {
  const questions = {
    type: "checkbox",
    message: "Select:",
    name: "userInput",
    choices: [
      new inquirer.Separator("Which to download "),
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

  inquirer.prompt(questions).then((answer) => console.log(answer));
};
const downloadPokemon = async () => {
  try {
    const data = (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)).json();

    const response = await data;
    let stats = "";
    for (const stat of response.stats) {
      stats += `${stat.stat.name}: ${stat.base_stat}\n`;
    }

    const spriteUrl = response.sprites.front_default;
    const sprite = await fetch(spriteUrl);

    fs.writeFile(`./pokemons/${pokemonName}.png`, sprite.body);
    fs.writeFile(`./pokemons/${pokemonName}.txt`, stats);

    console.log(`${pokemonName} downloaded`);
  } catch (err) {
    console.error("Enter valid pokemon name");
    getPokemonName();
  }
};

getPokemonName();
