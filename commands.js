const axios = require('axios')

const dogBreedsArr = require('./data/dog-breeds')

// Utilty functions
// Get spaced arguments as array
const getArgs = text => text.split(' ').splice(1)

// Help message
const helpMessage = `
*Simple API BOT*
/fortune - get a random fortune
/cat - random cat image
/cat \`<text>\` - random cat image with text
/dogbreeds - get a list of dog breeds
/dog \`<breed>\` - random dog image of specified breed
`
exports.help = (ctx, next) => {
  ctx.reply(helpMessage, { parse_mode: 'markdown' })
}

// Get random fortune
const getFortune = () => axios.get('http://yerkee.com/api/fortune')

exports.fortune = (ctx, next) => {
  getFortune()
    .then(response => response.data)
    .then(data => {
      ctx.reply(`\`${data['fortune']} \``, {
        parse_mode: 'MarkdownV2'
      })
    })
    .catch(error => {
      console.log('FORTUNE FAILED: ', error)
      ctx.reply('Failed to get fortune.')
    })
}

// Get random cat image
const getRandomCat = async () => {
  try {
    const response = await axios.get(
      'https://api.thecatapi.com/v1/images/search'
    )
    const catURL = response.data[0].url
    return catURL
  } catch (error) {
    throw error
  }
}

const getCatWithText = text => `https://cataas.com/cat/says/${text}?size=80`

exports.randomCat = async (ctx, next) => {
  const args = getArgs(ctx.message.text)
  try {
    if (args.length) {
      ctx.replyWithPhoto(getCatWithText(args.join('')))
    } else {
      const catURL = await getRandomCat()
      ctx.replyWithPhoto(catURL)
    }
  } catch (error) {
    ctx.reply('Failed to get to a cat :(')
  }
}

// Get dog breeds list
exports.dogBreeds = (ctx, next) => {
  const message = dogBreedsArr.map(breed => `- ${breed}`).join('\n')
  ctx.reply(message)
}

// Get random dog images
const getRandomDog = async (breed = 'akita') => {
  try {
    const response = await axios.get(
      `https://dog.ceo/api/breed/${breed}/images/random`
    )
    const dogURL = response.data['message']
    return dogURL
  } catch (error) {
    throw error
  }
}

exports.randomDog = async (ctx, next) => {
  const args = getArgs(ctx.message.text)
  if (args.length == 0) {
    ctx.reply('You must provide dog breed as second argument.')
    return
  }

  const inputBreed = args[0]
  if (dogBreedsArr.includes(inputBreed)) {
    const dogURL = await getRandomDog(inputBreed)
    console.log(dogURL)
    ctx.replyWithPhoto(dogURL)
  } else {
    const suggestions = dogBreedsArr.filter(breed =>
      breed.startsWith(inputBreed)
    )

    let message = 'Did you mean:\n'
    message += suggestions.map(breed => `- ${breed}`).join('\n')

    if (suggestions.length == 0) {
      ctx.reply("Can't find the specified breed")
    } else {
      ctx.reply(message)
    }
  }
}
