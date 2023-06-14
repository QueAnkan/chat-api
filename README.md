# chat-api

Detta API används för att bygga en chat där man kan skicka medelanden till varandra, både i gemensamma kanaler och via DM. Man kan ha öppna kanaler och slutna kanaler som kräver inloggning.

###
| Method | URL/(URLparams) | Querystring | Body |Description |
|-----|---|----|---|----|
| GET | api/messages| "filterby", "value" | | Hämta meddelanden. Ange med hjälpa av query-string om det ska hämtas med värde för kanal(chat) eller DM(sender), ange kanalen eller avsändarens id ("chat-value" respektive "sender-value") enligt logiken: api/messages/?filterby=chat&value=chatValue där chatValue ersätts med din kanals id. Returnerar { "content" , "chat" , "sender" ,"timestamp" , messageid}|
| POST | api/messages | | {"content": "sender": "chat" } eller {"content" , "sender" , "reciever" } | Skicka meddelanden, ange i body om meddelanden ska skickas i kanal eller i DM. "timestamp" och "messageid" genereras automatiskt vid POST |
| PUT |  api/messages/messageid| || Ändra i ett meddelande, skicka med de värden som ska ändras i body. Alla värden utom "messageid" kan ändras.|
 |DELETE | api/messages/messageid | | | Ta bort ett meddelande. |
| GET | api/channels | | | Hämta samtliga kanaler. Returnerar {"chatname" , "public" , "chatid"} |
| GET | api/channels/chatid | | | Hämta kanal utifrån chatid. |
| POST | api/channels | | {"chatname" , "public"} | Skapa en ny kanal.  Chatid skapas automatiskt vid POST. |
| DELETE | api/channels/chatid| | | Ta bort en befintlig kanal. |
| GET | api/users | | | Hämta samtliga användare. Returnerar {"uname" , "password" , "userid"} |
|GET | api/users/userid | |  | Hämta en användare med hjälp av id.|
| POST | api/users | | { "uname", "password", userid"} | Lägga till ny användare. |
| PUT | api/users/users/userid | || Ändra användaruppgifter. Lägg till "uname" eller "password" i body beroende på vad som ska ändras. |
| DELETE | api/users/userid | | | Ta bort en användare. |
| POST | api/login | | {"uname","password" } | Logga in som användare. |

----------------------------------------

