
import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

//Creating a loading view with ... 
function loader(element){
  element = {
    textContent: ''
  }
  element.textContent = '';
  loadInterval = setInterval(() => {
    element.textContent += '.';

    if(element.textContent == '....') {
      element.textContent = '';
    }
  }, 300)
}

//Creating the efect of a bot writting the answer one character at a time
function typeText(element, text) {
  let index = 0;
  let interval = setInterval(() => {
    if(index < text.length) {
      element.innerHTML += text.chartAt(index);
      element ++;
    } else {
      clearInterval(interval);
    }
  }, 20)
}

//Generate a UID for every single message to be able to map over them
function generateUniqueId() {
  const timesStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timesStamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return (
    `
    <div class="wrapper ${isAi && 'AI'}">
      <div class="chat">
        <div class="profime">
          <img 
            src="${isAi ? bot : user}"
            alt="${isAi ? 'bot' : 'user'}"
          />        
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
  
    `
  );
  
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  //user's chatsctripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'));
  form.reset();

  //bot's chatstripe

  const uniqueId = generateUniqueId();
  chatStripe.innerHTML += chatStripe(true, ' ', uniqueId);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  let messageDiv = uniqueId;

  loader(messageDiv);
  

  //fecth data from server => bot's response
  const response = await fetch('https://chat-gpt-ai-fc-backend.onrender.com', {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  });

  clearInterval(loadInterval);
  //messageDiv.innerHTML = '';

  if(response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData)
  } else {
    const err = await response.text();
    //messageDiv.innerHTML = 'Something went wrong';
    alert(err);
  }
}

//click event
form.addEventListener('submit', handleSubmit);
//keyboard Enter key
form.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    handleSubmit(e);
  }
})
