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
  const path = `./pokedex/${pokemonName}`;

  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path);
  }
};

const downloadArtwork = async (json, pokemonName) => {
  const url = json.sprites.other["official-artwork"].front_default;
  console.log(url);
  const artwork = await fetch(url);

  await fs.writeFile(`./pokedex/${pokemonName}/${pokemonName}.png`, artwork.body);
};
const downloadSprites = async (json, pokemonName) => {
  const spritesArr = json.sprites;

  for (const [name, url] of Object.entries(spritesArr)) {
    if (name !== "other" && name !== "versions") {
      console.log(name);
      const sprite = await fetch(url);

      await fs.writeFile(`./pokedex/${pokemonName}/${name}.png`, sprite.body);
    }
  }
};

const downloadStats = async (json, pokemonName) => {
  const statsArr = json.stats;
  let stats = "";
  for (const stat of statsArr) {
    stats += `${stat.stat.name}: ${stat.base_stat}\n`;
  }

  fs.writeFile(`./pokedex/${pokemonName}/${pokemonName}-stats.txt`, stats);
};

const downloadPokemonData = async (userInput, json, pokemonName) => {
  createFolder(pokemonName);

  if (userInput.includes("Artwork")) {
    console.log("Artwork");

    await downloadArtwork(json, pokemonName);
  }
  if (userInput.includes("Sprites")) {
    console.log("Sprites");
    downloadSprites(json);
  }
  if (userInput.includes("Stats")) {
    console.log("Stats");
    await downloadStats(json, pokemonName);
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
