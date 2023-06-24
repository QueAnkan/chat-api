# chat-api

Detta API används för att bygga en chat där man kan skicka medelanden till varandra, både i gemensamma kanaler och via DM. Man kan ha öppna kanaler och slutna kanaler som kräver inloggning. Kanaler kan hämtas, skapas eller tas bort. Användare kan läggas till, tas bort, ändras och hämtas. Meddelanden kan hämtas, skapas, ändras och tas bort. Finns även en login metod.
####


## Datamodellering
|objekt | egenskaper | datatyp | beskrivning|
|:------|:------|:---:|---:|
|users |uname | sträng | användares namn |
| |password | sträng | lösenord |
| |userid | nummer | genererat användarid |
|
channels|chatname | sträng | Namn på kanal |
|| public | boolean | Avgör public eller privat kanal |
|
|messages|content | sträng | Text input från användare |
| |sender | nummer | userid på den användare som skickat meddelandet |
|| reciever | nummer | userid för den som tar emot meddelande vid DM |
|| chat | nummer | chatid för den kanal som meddelandet skickas till om det inte är ett DM |
| |timestamp | nummer | genererad tidsstämpel när meddelande laddas upp till API:et |
| |messageid | nummer | genererat id för meddelande |
||||




## Endpoints


###
| Method | URL| Path params (URLparams) | Query params | Body params |Description |
|:-----|:---:|:---:|:---:|:---:|---|
| GET | api/messages || "filterby", "value" | | Hämta meddelanden. Ange med hjälpa av query-string om det ska hämtas med värde för kanal(chat) eller DM(sender), ange kanalen eller avsändarens id ("chat-value" respektive "sender-value") enligt logiken: api/messages/?filterby=chat&value=chatValue där chatValue ersätts med din kanals id. Returnerar { "content" , "chat" , "sender" ,"timestamp" , messageid}|
| POST | api/messages | | | {"content": "sender": "chat" } eller {"content" , "sender" , "reciever" } | Skapa ett nytt meddelande, ange i body om meddelanden ska ha parameter {chat} eller {reciver} beroende på om det ska användas i en kanal eller som ett DM. "timestamp" och "messageid" genereras automatiskt vid POST |
| PUT  |  api/messages/{messageid}| messageid ||| Uppdatera ett meddelande med ett angivet {messageid}. Skicka med de parametrar som ska ändras i body. Alla parametrar utom "messageid" kan ändras.|
 |DELETE | api/messages/{messageid} | messageid | | | Ta bort ett meddelande med ett angivet {messageid}. |
| GET | api/channels | | | | Hämta samtliga kanaler. Returnerar {"chatname" , "public" , "chatid"} |
| GET | api/channels{chatid} | chatid | | | Hämta en kanal med ett angivet {chatid}. |
| POST | api/channels | | | {"chatname" , "public"} | Skapa en ny kanal.  Chatid skapas automatiskt vid POST. |
| DELETE | api/channels/{chatid}| chatid | | | Ta bort en befintlig kanal med ett angivet {chatid}. |
| GET | api/users | | | | Hämta samtliga användare. Returnerar {"uname" , "password" , "userid"} |
|GET | api/users{userid} | userid | |  | Hämta en användare med ett angivet {userid} .|
| POST | api/users | | | { "uname", "password"} | Lägga till ny användare. |
| PUT | api/users/{userid}  | userid | || Uppdatera ett users-objekt med ett angivet {userid}. Lägg till {"uname"} eller {"password"} i body beroende på vad som ska ändras. |
| DELETE | api/users/{userid}  | userid | | | Ta bort en användare ed ett angivet {userid}. |
| POST | api/login | | | {"uname","password" } | Logga in som användare. |

----------------------------------------

