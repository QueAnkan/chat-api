# chat-api

Detta API används för att bygga en chat där man kan skicka medelanden till varandra, både i gemensamma kanaler och via DM. Man kan ha öppna kanaler och slutna kanaler som kräver inloggning.

###
| Method | URL | Description |
|--------|---|-------------|
| GET | api/messages | Används för att hämta meddelanden. Ange med hjälpa av query-string om det ska hämtas till en kanal(chat) eller ett DM(sender) samt kanalen eller avsändarens id ("chat-value" respektive "sender-value") enligt logiken: api/messages/?filterBy=chat&value=chatValue där chatValue ersätts med din kanals id. Body innerhåller { "content" , "chat" , "sender" ,"timestamp" , messageId}|
| POST | api/messages | Används för att skicka meddelanden, ange  {"content": "sender": "chat" } i body för meddelanden som ska skickas i kanal och {"content" , "sender" , "reciever" } i body för medelanden som ska skickas i DM. "timestamp" och "messageId" genereras automatiskt vid POST |
| PUT | api/messages/messageId | För att ändra i ett meddelande, skicka med de värden som ska ändras i body. MessageId måste alltid skickas med i body {"messageId"}. Alla värden utom "messageId" kan ändras.|
 |DELETE | api/messages/messageId | För att ta bort ett meddelande, ange {"messageId"} i body. |
| GET | api/channels | för att hämta samtliga kanaler. Body innehåller {"chatname" , "public" , "chatid"} |
| POST | api/channels | För att skapa en ny kanal. Ange {"chatname" , "public"} i body. Chatid skapas automatiskt vid POST. |
| DELETE | api/chatid| För att ta bort en befintlig kanal. |
| GET |api/users| För att hämta samtliga användare. Body innehåller {"uname" , "password" , "userid"} |
| POST |api/login | För att logga in som användare |
----------------------------------------

