import fs from "fs/promises";

let pokemonName = "slowpoke";

const download = async () => {
  try {
    const data = (await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)).json();

    const response = await data;
    let stats = "";
    // console.log(response.stats);
    for (const stat of response.stats) {
      //   console.log(`${stat.stat.name} : ${stat.base_stat}`);

      stats += `${stat.stat.name} : ${stat.base_stat}\n`;
    }

    const spriteUrl = response.sprites.front_default;
    const sprite = await fetch(spriteUrl);

    fs.writeFile(`./pokemons/${pokemonName}.png`, sprite.body);
    fs.writeFile(`./pokemons/${pokemonName}.txt`, stats);
  } catch (err) {
    console.error(err);
  }
};

download();
