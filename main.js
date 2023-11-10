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

const handleLoop = async () => {
  while (true) {
    const pokemonName = await getPokemonName();
    const json = await fetchPokemon(pokemonName.name);

    const userInput = await getUserInput();

    const shouldContinue = await getAnotherPokeon();
    if (shouldContinue.continue === "No") break;
  }
};

handleLoop();
