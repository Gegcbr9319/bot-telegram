import TelegramBot from "node-telegram-bot-api";
import fetch from "node-fetch";
//const require = createRequire(import.meta.url);
//const fetch = require('node-fetch');
//const TelegramBot = require('node-telegram-bot-api'); // подключаем бота
const token = '5468995099:AAH32Ro8CWe8w3B8KNcfgw_BL2Su4_J8E84'; //токен с телеграмма

const bot = new TelegramBot(token, {polling: true}); // включили бота


const API_CAT = `https://api.thecatapi.com/v1/images/search?api_key=72e15643-0434-4c8d-bd67-a90a9489f0df`;  // получаем ключи
const API_FOX = `https://randomfox.ca/floof/`;
const API_DOG = `https://random.dog/woof.json`;
const API_DUCK = `https://random-d.uk/api/random`;


async function getData(url){   // получение инфы
    const res = await fetch(url);
    let respData = await res.json();
    //console.log(res);
  
   if( Array.isArray(respData)){
    respData = respData[0];
   }
   if(!respData.url){
    respData.url = respData.image;
   }
   return respData.url;
  // console.log(respData.url);
}

const keyboard = [
    [
      {
        text: 'Вам кота', // текст на кнопке
        callback_data: 'cat' // данные для обработчика событий
      }
    ],
    [
        {
          text: 'Или песеля',
          callback_data: 'dog'
        }
    ],
    [
        {
          text: 'А может лису',
          callback_data: 'fox'
        }
    ],
    [
        {
          text: 'Я понял, утку',
          callback_data: 'duck'
        }
    ],
  ];

bot.on('message',  (msg) => {
   //await getData(API_FOX);
    const chatId = msg.chat.id; //получаем идентификатор диалога, чтобы отвечать именно тому пользователю, который нам что-то прислал
    bot.sendMessage(chatId, 'Ну что ты хочешь?', { // прикрутим клаву
        reply_markup: {
            inline_keyboard: keyboard
        }
    });
});

// обработчик событий нажатий на клавиатуру
bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;

    let img = '';

    if (query.data === 'cat') { // какое животное
        img =  await getData(API_CAT);
    }
    if (query.data === 'dog') { 
        img =  await getData(API_DOG);
    }
    if (query.data === 'fox') { 
        img =  await getData(API_FOX);
    }
    if (query.data === 'duck') { 
        img =  await getData(API_DUCK);
    }

    if (img) {
        bot.sendMessage(chatId, "А теперь? "),
        bot.sendPhoto(chatId, img, { // клавиатура
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    } else {
        bot.sendMessage(chatId, 'Непонятно, давай попробуем ещё раз?', { // клавиатура
            reply_markup: {
                inline_keyboard: keyboard
            }
        });
    }
  });