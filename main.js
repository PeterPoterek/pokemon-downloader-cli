import fs from "fs/promises";
import inquirer from "inquirer";

let pokemonName = "";
let proceed = "";
const handleNextPokemon = () => {
  const options = {
    type: "list",
    name: "continue",
    message: "Download Another Pokemon?",
    choices: ["Yes", "No"],
  };
  inquirer.prompt(options).then((answer) => {
    console.log(answer);
    let proceed = answer.continue;
  });
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

const downloadArtwork = async (response) => {
  const artworkUrl = response.sprites.other["official-artwork"].front_default;
  const artwork = await fetch(artworkUrl);

  fs.writeFile(`./pokemons/${pokemonName}.png`, artwork.body);
};

const downloadStats = (response) => {
  let stats = "";
  for (const stat of response.stats) {
    stats += `${stat.stat.name}: ${stat.base_stat}\n`;
  }

  fs.writeFile(`./pokemons/${pokemonName}.txt`, stats);
};

const downloadSprites = async (response) => {
  const spritesJson = response.sprites;

  const spritesUrlArr = Object.keys(spritesJson)
    .slice(0, 8)
    .map((key) => spritesJson[key])
    .filter((key) => key !== undefined);

  spritesUrlArr.forEach((spriteUrl) => {
    if (typeof spriteUrl === "string") {
      fetch(spriteUrl).then((res) => {
        const pattern = /[0-9/]/g;
        const spriteFileName = spriteUrl.replace(pattern, "");

        fs.writeFile(`./pokemons/${spriteFileName}`, res.body);
      });
    }
  });
};

const downloadPokemon = async () => {
  try {
    const data = (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)).json();

    const response = await data;

    const inputArr = await getUserInput();
    if (inputArr.userInput.length === 3) {
      downloadArtwork(response);
      downloadStats(response);
      downloadSprites(response);
    } else if (inputArr.userInput.length === 2) {
      if (inputArr.userInput.includes("Artwork") && inputArr.userInput.includes("Sprites")) {
        console.log("Artwort and Sprites downloaded");
        downloadArtwork(response);
        downloadSprites(response);
      } else if (inputArr.userInput.includes("Stats") && inputArr.userInput.includes("Sprites")) {
        console.log("Stats and Sprites downloaded");
        downloadStats(response);
        downloadSprites(response);
      } else if (inputArr.userInput.includes("Artwork") && inputArr.userInput.includes("Stats")) {
        console.log("Artwork and Stats downloaded");
        downloadArtwork(response);
        downloadStats(response);
      }
    } else if (inputArr.userInput.length === 1) {
      if (inputArr.userInput.includes("Artwork")) {
        console.log("Artwort downloaded");
        downloadArtwork(response);
      } else if (inputArr.userInput.includes("Sprites")) {
        console.log("Sprites downloaded");
        downloadSprites(response);
      } else if (inputArr.userInput.includes("Stats")) {
        console.log("Stats downloaded");
        downloadStats(response);
      }
    }
  } catch (err) {
    console.error("Enter valid pokemon name");
    getPokemonName();
  }
};

// handleNextPokemon();

const handleLoop = () => {
  getPokemonName();
};

handleLoop();
