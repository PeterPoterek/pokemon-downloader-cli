import fs from "fs/promises";

let pokemonName = "slowpoke";

const download = async () => {
  try {
    const data = (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)).json();

    const response = await data;

    console.log(response);

    const spriteUrl = response.sprites.front_default;
    const sprite = await fetch(spriteUrl);

    fs.writeFile(`./pokemons/${pokemonName}.png`, sprite.body);
  } catch (err) {
    console.log(err);
  }
};

download();
