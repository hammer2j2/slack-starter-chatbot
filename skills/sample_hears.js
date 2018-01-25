/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's `hears` handler functions.

In these examples, Botkit is configured to listen for certain phrases, and then
respond immediately with a single line response.

*/

// add webhook api
const { IncomingWebhook, WebClient } = require('@slack/client');

console.log('Getting started with Slack Developer Kit for Node.js');

const web = new WebClient(process.env.SLACK_TOKEN);
const myNotification = new IncomingWebhook(process.env.SLACK_WEBHOOK_URL);

var start = Date.now();
//var d = new Date(start - 600000);  // 10 min
var d = new Date(start - 600000);  // 10 min

d = new Date();
const currentTime = d.toTimeString();


// 
module.exports = function(controller) {

    controller.hears(['hello'], 'direct_message,direct_mention,ambient', function(bot, message) {
        bot.reply(message, "Hi there, you're on workspace: " + message.team)
    });

    controller.hears(['testbot'], 'direct_message,direct_mention,ambient', function(bot, message) {
          bot.reply(message, "Hi there, how can I help you?: " + message.team)
    });

    controller.hears(['search'], 'direct_message,direct_mention,ambient', function(bot, message) {
          // bot.reply(message, "Hi there, let me search for you. ")

          myNotification.send("Hi there. Let me search for you.", (error, resp) =>  {
          if (error) {
            return console.error(error);
          }
          console.log('Notification sent');
          console.log('Waiting a few seconds for search indexes to update...');
          setTimeout(() => {
            console.log('Calling search.messages');
            web.search.messages(currentTime)
              .then(resp => {
                if (resp.messages.total > 0) {
                  console.log('First match:', resp.messages.matches[0]);
                  bot.reply(message, "Hooray! I found a match, but I can't tell you what it is.")
                } else {
                  console.log('No matches found');
                  bot.reply(message, "Sorry.  No matches found.")
                }
              })
              .catch(console.error)
          }, 12000);
        });
    });

};
