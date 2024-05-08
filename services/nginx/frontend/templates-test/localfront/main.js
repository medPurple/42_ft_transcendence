// Import any necessary libraries or modules


function chatbox(){
    const chatbox = document.createElement('div');
    chatbox.id = 'chatbox';

    const chatboxHeader = document.createElement('div');
    chatboxHeader.id = 'chatbox-header';

    const chattitle = document.createElement('p')
    chattitle.innerHTML = "chat"

    const toggleChatbutton = document.createElement('button');
    toggleChatbutton.id = 'toggle-chat-button';
    toggleChatbutton.innerHTML = 'Toggle Chat';
    toggleChatbutton.addEventListener('click', function() {
        var chatboxBody = document.getElementById('chatbox-body');
        if (chatboxBody.style.display === 'none') {
            chatboxBody.style.display = 'flex';
            chatbox.style.height = '400px';
        } else {
            chatboxBody.style.display = 'none';
            chatbox.style.height = 'auto';
        }
    });

    const chatboxBody = document.createElement('div');
    chatboxBody.id = 'chatbox-body';
    
    const chatboxchatwindow = document.createElement('div');
    chatboxchatwindow.id = 'chatbox-chatwindow';
    chatboxchatwindow.innerHTML = 'Chat Window';

    const chatboxFriendlist = document.createElement('div');
    chatboxFriendlist.id = 'chatbox-friendlist';

    const friendlist = document.createElement('ul')
    chatboxFriendlist.id = 'chatbox-friendlist-list';
    for (let i = 1; i <= 3; i++) {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        link.textContent = 'Username ' + i;
        link.addEventListener('click', function(event) {
            event.preventDefault();
            let buttonList = listItem.querySelector('div');
            if (buttonList) {
                listItem.removeChild(buttonList);
            } else {
                buttonList = document.createElement('div');
                for (let j = 1; j <= 3; j++) {
                    const button = document.createElement('button');
                    button.textContent = 'Button ' + j;
                    buttonList.appendChild(button);
                }
                listItem.appendChild(buttonList);
            }
        });
        listItem.appendChild(link);
        friendlist.appendChild(listItem);
    }
    chatboxFriendlist.appendChild(friendlist);


    chatboxHeader.appendChild(toggleChatbutton);
    chatboxHeader.appendChild(chattitle);

    chatboxBody.appendChild(chatboxchatwindow);
    chatboxBody.appendChild(chatboxFriendlist);
    chatbox.appendChild(chatboxHeader);
    chatbox.appendChild(chatboxBody);

    return chatbox;
}
// Define your main function
function main() {
    document.body.innerHTML = "<h1>Hello, World!</h1>";
    const chatBoxElement = chatbox();
    document.body.appendChild(chatBoxElement);
}

// Call the main function to start your app
main();