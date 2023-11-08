import fs from "fs/promises";
import inquirer from "inquirer";

let pokemonName = "";

const questions = {
  type: "input",
  name: "pokemonName",
  message: "Write an pokemon name",
};
const getPokemonName = () => {
  inquirer.prompt(questions).then((anwser) => {
    pokemonName = anwser.pokemonName;
    downloadPokemon();
  });
};
const downloadPokemon = async () => {
  try {
    const data = (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)).json();

    const response = await data;
    let stats = "";
    for (const stat of response.stats) {
      stats += `${stat.stat.name} : ${stat.base_stat}\n`;
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
