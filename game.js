const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');
const playerstats = document.getElementById('playerstats');

var hunger = 10;
var health = 5;

let state = {};

function startGame(){
    state = {};
    showTextNode(-1);
}

function getDailyScenario(){
    return Math.floor(Math.random() * 3)+1;
}

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    textElement.innerText = textNode.text;
    playerstats.innerText = 'Hunger: '+hunger+'\nHealth: '+health;
    while(optionButtonsElement.firstChild){
        optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    }

    textNode.options.forEach(option => {
        if(showOption(option)){
            const button = document.createElement('button');
            button.innerText = option.text;
            button.classList.add('btn');
            button.addEventListener('click',() => selectOption(option));
            optionButtonsElement.appendChild(button)
        }
    })
}

function showOption(option){
    return option.requiredState == null || option.requiredState(state)
}

//eventuell kann ich die math.random-option hier einbauen? Etwas tricky... Aber es könnte funktionieren.
function selectOption(option) {
    var nextTextNodeId = option.nextText;
    if(nextTextNodeId === 0){
        nextTextNodeId = getDailyScenario();
        hunger-=1;
    }
    /*if(nextTextNodeId <= 0)
        return startGame();*/
    state = Object.assign(state, option.setState);
    showTextNode(nextTextNodeId)
}

const textNodes = [

    //Tired. Time to sleep.
    {
       id: -2,
       text: 'You´ve returned to your nest. Good night!',
       options: [
           {
               text: 'Sleep',
               nextText: -1
           }
       ]
    },
    //New morning.
    {
        id: -1,
        text : 'You wake up in your nest.',
        options: [
            {
                text: 'Look down the tree.',
                nextText: 0
            }
            ]
    },
    {
        id: 0,
        text: '',
        options:[]
    },

    //Starting Options.
    {
        id: 1,
        text: 'You are looking down the tree. You can see the cat near the birdhouse.',
        options:[
            {
                text: 'Go to the forest.',
                nextText: 21
            },
            {
                text: 'Go to the birdhouse.',
                nextText: 24
            },
            {
                text: 'Go to the compost.',
                nextText: 23
            }
        ]
    },
    {
        id: 2,
        text: 'You are looking down the tree. The cat seems to be away.',
        options:[
            {
                text: 'Go to the forest.',
                nextText: 21
            },
            {
                text: 'Go to the birdhouse.',
                nextText: 22
            },
            {
                text: 'Go to the compost.',
                nextText: 23
            }
        ]
    },
    {
        id: 3,
        text: 'You are looking down the tree. You can see the cat near the compost.',
        options:[
            {
                text: 'Go to the forest.',
                nextText: 21
            },
            {
                text: 'Go to the birdhouse.',
                nextText: 22
            },
            {
                text: 'Go to the compost.',
                nextText: 25
            }
        ]
    },

    //Birdhouse options (100+ == safe | 150+ == dangerous)

    //safe and not empty
    {
        id: 22,
        text: 'You are silently hopping through the snow. While you´re getting closer, a Sparrow flies away! You are looking into the birdhouse and see a few seeds',
        options:[
            {
                text: 'Eat some seeds and leave.',
                nextText: 100
            },
            {
                text: 'Don´t eat anything and leave.',
                nextText: 101
            }
        ]
    },
    {
        id: 100,
        text: 'You are eating the seeds and recover hunger by +2! Time to leave.',
        options:[
            {
                text: 'leave',
                nextText: -2
                //TODO add foodRecovery
            },
        ]
    },
    {
        id: 101,
        text: 'While you heading back to your nest, you are looking at the seeds and question your decision...',
        options:[
            {
                text: 'leave',
                nextText: -2
            },
            {
                text: 'Turn back to the birdhouse',
                nextText: 102
            }
        ]
    },
    {
        id: 102,
        text: 'You turn around and run back to the birdhouse. You are looking at the seeds again and ',
        options:[
            {
                text: 'Eat some seeds and leave.',
                nextText: 100
            },
            {
                text: 'Don´t eat anything and leave.',
                nextText: 101
            }
        ]
    },
    //dangerous
    {
        id: 24,
        text: 'Option 21.',
        options:[
            {
                text: '',
                nextText: 0
            },
            {
                text: 'placeholder.',
                nextText: 0
            }
        ]
    },

    //Compost options (200+ = safe | 250+ = dangerous)

    //Following Options and their stories.
    {
        id: 21,
        text: 'Option 21.',
        options:[
            {
                text: '',
                nextText: 0
            },
            {
                text: 'placeholder.',
                nextText: 0
            }
        ]
    }
]

startGame();