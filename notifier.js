
const notifier = require('node-notifier');

function notificate(title='Default title', message='Default message', sound=true, wait=false) {
    notifier.notify(
        {
          title: title,
          message: message,
          sound: sound, // Only Notification Center or Windows Toasters
          wait: wait // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
        },
        function (err, response) {
          //console.log(response)
        }
      );
}


exports.notificate = notificate