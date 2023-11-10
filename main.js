import inquirer from "inquirer";
import path from "path";
import fs from "fs/promises";

const getPokemonName = async () => {
  const questions = {
    type: "input",
    name: "name",
    message: "Write an pokemon name",
  };

  return await inquirer.prompt(questions);
};

const fetchPokemon = async (pokemonName) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    return await response.json();
  } catch {
    console.error("Enter valid Pokemon name");
  }
};

const getUserInput = async () => {
  const questions = {
    type: "checkbox",
    message: "Which data to download:",
    name: "input",
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
  };

  return await inquirer.prompt(questions);
};

const getAnotherPokeon = async () => {
  const options = {
    type: "list",
    name: "continue",
    message: "Download Another Pokemon?",
    choices: ["Yes", "No"],
  };
  return await inquirer.prompt(options);
};

const createFolder = async (pokemonName) => {
  fs.mkdir(`./pokedex/${pokemonName}`);
};

const downloadPokemonData = async (userInput, json, pokemonName) => {
  createFolder(pokemonName);

  if (userInput.includes("Artwork")) {
    console.log("Artwork");
  }
  if (userInput.includes("Sprites")) {
    console.log("Sprites");
  }
  if (userInput.includes("Stats")) {
    console.log("Stats");
  }
};

const handleLoop = async () => {
  while (true) {
    const pokemonName = await getPokemonName();
    const json = await fetchPokemon(pokemonName.name);

    const userInput = await getUserInput();
    downloadPokemonData(userInput.input, json, pokemonName.name);

    const shouldContinue = await getAnotherPokeon();
    if (shouldContinue.continue === "No") break;
  }
};

handleLoop();
