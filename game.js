const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');
const playerstats = document.getElementById('playerstats');

var day = 1;
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
function setPlayerStats(){
    playerstats.innerText = 'Day: '+day+'\nHunger: '+hunger+'\nHealth: '+health;
}

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    textElement.innerText = textNode.text+" | "+textNode.id;
    setPlayerStats();
    if(textNode.id===10){
        textElement.innerText = textElement.innerText+" "+day;
    }

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
    } else if(nextTextNodeId === -1){
        day = day + 1;
    } else if(nextTextNodeId === -2){
        hunger -= 2;
    } else if(nextTextNodeId === 11){
        nextTextNodeId = reduceHealthAndReturnScenario(3);
    }

    /*if(nextTextNodeId <= 0)
        return startGame();*/
    state = Object.assign(state, option.setState);
    showTextNode(nextTextNodeId)
}

function reduceHealthAndReturnScenario(damage){
    health-=6;
    if(health<1){
        health=0;
        return 10;
    }else{
        return 11;
    }
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
    {
        id: 10,
        text: 'Your health-points are too low. You`ve lost. You have reached Day ',
        options:[
            {
                text: 'Restart',
                nextText: 9
            },{
                text: 'Back to About Page',
                nextText: 8
            },{
                text: 'Submit Any Ideas',
                nextText: 7
            }
        ]
    },
    {
        id: 11,
        text: 'You jump back on your feet and continue running to your nest!',
        options:[
            {
                text:'Continue',
                nextText: -2
            }
        ]
    },

    //Birdhouse options (22 | 100+ == safe | 150+ == dangerous)

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
        text: 'While you are heading back to your nest, you are looking at the seeds and question your decision...',
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
        text: 'You turn around and run back to the birdhouse. You are looking at the seeds again.',
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
    //Birdhouse options (24 | 100+ == safe | 150+ == dangerous)

    //dangerous
    {
        id: 24,
        text: 'You are silently hopping through the snow. The cat is looking at your direction, not doing anything.',
        options:[
            {
                text: 'Hop on.',
                nextText: 150
            },
            {
                text: 'Turn around and run back to your nest.',
                nextText: -2
            },{
                text: 'Stop running and wait for a reaction of the cat.',
                nextText: 152
            }
        ]
    },
    {
        id: 152,
        text: 'You are just looking to the cat. She is looking at you. *Meow*',
        options:[
            {
                text: 'Hop on.',
                nextText: 150
            },
            {
                text: 'Turn around and run back to your nest.',
                nextText: -2
            },
            {
                text: 'Keep waiting.',
                nextText: 153
            }
        ]
    },
    {
        id: 153,
        text: '... Nothing is happening. The cat is licking her right paw.',
        options:[
            {
                text: 'Hop on.',
                nextText: 150
            }, {
                text: 'Turn around and run back to your nest.',
                nextText: -2
            },{
                text: 'Keep waiting.',
                nextText: 152
            }
        ]
    },
    {
        id: 150,
        text: 'You are looking into the birdhouse and see a few seeds',
        options:[
            {
                text: 'Eat some seeds and leave.',
                nextText: 154
            },
            {
                text: 'Don´t eat anything and leave.',
                nextText: 155
            }
        ]
    },
    {
        id: 154,
        text: 'You are eating the seeds and recover hunger by +2! Time to leave.',
        options:[
            {
                text: 'leave',
                nextText: 155
                //TODO add foodRecovery
            },
        ]
    },
    {
        id: 155,
        text: 'As you turn around, the cat is right behind you hitting you with her right paw! You are falling down the birdhouse and' +
            'hit the ground. You can hear the cat`s laugh. "Play with me little Squirrel!',
        options:[
            {
                text: 'Run as fast as you can!',
                nextText: 11
            },
            {
                text: 'Fight the cat!',
                nextText: 10
            },
        ]
    },

    //Compost options (23 | 200+ = safe | 250+ = dangerous)

    //safe
    {
        id: 23,
        text: 'You are silently hopping through the snow. While you´re getting closer, a weird smell stings into your nose. You see some rotten vegetables.. Better then nothing..',
        options:[
            {
                text: 'Eat vegetables and leave.',
                nextText: 200
            },
            {
                text: 'Don´t eat anything and leave.',
                nextText: 201
            }
        ]
    },
    {
        id: 200,
        text: 'You are eating the vegetables and recover hunger by +3! But your health drops -1. Time to leave.',
        options:[
            {
                text: 'leave',
                nextText: -2
                //TODO add foodRecovery
            },
        ]
    },
    {
        id: 201,
        text: 'While you are heading back to your nest, the air gets fresh again. But you are still thinking about the vegetables...',
        options:[
            {
                text: 'leave',
                nextText: -2
            },
            {
                text: 'Turn back to the vegetables',
                nextText: 202
            }
        ]
    },
    {
        id: 202,
        text: 'You turn around and run back to the compost and look at the vegetables. Still disgusting. But better then nothing..',
        options:[
            {
                text: 'Eat some vegetables and leave.',
                //TODO add foodRecovery hunger.
                //TODO lose healthPoints
                nextText: 200
            },
            {
                text: 'Don´t eat anything and leave.',
                nextText: 201
            }
        ]
    },

    //compost dangerous
    {
        id: 25,
        text: 'You are silently hopping through the snow. The cat is looking at your direction, not doing anything.',
        options:[
            {
                text: 'Hop on.',
                nextText: 250
            },
            {
                text: 'Turn around and run back to your nest.',
                nextText: -2
            },{
                text: 'Stop running and wait for a reaction of the cat.',
                nextText: 252
            }
        ]
    },
    {
        id: 252,
        text: 'You are just looking to the cat. She is looking at you. *Meow*',
        options:[
            {
                text: 'Hop on.',
                nextText: 250
            },
            {
                text: 'Turn around and run back to your nest.',
                nextText: -2
            },
            {
                text: 'Keep waiting.',
                nextText: 253
            }
        ]
    },
    {
        id: 253,
        text: '... Nothing is happening. The cat is licking her right paw.',
        options:[
            {
                text: 'Hop on.',
                nextText: 250
            }, {
                text: 'Turn around and run back to your nest.',
                nextText: -2
            },{
                text: 'Keep waiting.',
                nextText: 252
            }
        ]
    },
    {
        id: 250,
        text: 'You are looking into the compost and see a few vegetables. They are`nt looking good buut...',
        options:[
            {
                text: 'Eat some vegetables and leave.',
                nextText: 254
            },
            {
                text: 'Don´t eat anything and leave.',
                nextText: 255
            }
        ]
    },
    {
        id: 254,
        text: 'You are eating some vegetables and recover hunger by +3! Your health is dropping by -1 Time to leave.',
        options:[
            {
                text: 'leave',
                nextText: 255
                //TODO add foodRecovery
                //TODO lose healthPoints
            },
        ]
    },
    {
        id: 255,
        text: 'As you turn around, the cat is right behind you hitting you with her right paw! You are falling on the ground and can hear the cat laughing' +
            '. "Play with me little Squirrel!',
        options:[
            {
                text: 'Run as fast as you can!',
                nextText: 11
            },
            {
                text: 'Fight the cat!',
                nextText: 10
            },
        ]
    },

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