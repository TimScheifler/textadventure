window.onbeforeunload = function() {
    return true;
};

const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');
const playerstats = document.getElementById('playerstats');

var day = 1;
var hunger = 8;
var health = 5;

let state = {};

function startGame(){
    state = {};
    showTextNode(-1);
}

function getDailyScenario(){
    return Math.floor(Math.random() * 3)+1;
}
function getDailyForestScenario(){
    return Math.floor(Math.random()*(304-300)) + 300;
}

function setPlayerStats(){
    playerstats.innerText = 'Day: '+day+'\nHunger: '+hunger+'/10\nHealth: '+health+'/5';
}

function showTextNode(textNodeIndex) {
    var textNode;
    if(health > 0){
        textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    }else{
        textNode = textNodes.find(textNode => textNode.id === 10);
    }
    textElement.innerText = textNode.text;
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

function selectOption(option) {
    var nextTextNodeId = option.nextText;
    if(nextTextNodeId === 0){
        nextTextNodeId = getDailyScenario();
    } else if(nextTextNodeId === -1){
        day = day + 1;
    } else if(nextTextNodeId === -2){
        setNewHunger();
        setNewHealth();
    } else if(nextTextNodeId === 11){
        nextTextNodeId = reduceHealthAndReturnScenario(3);
    } else if(nextTextNodeId === 21){
        nextTextNodeId = getDailyForestScenario()
    }

    checkOptions(option);

    state = Object.assign(state, option.setState);
    showTextNode(nextTextNodeId)
}

function checkOptions(option) {
    if(option.hasOwnProperty('restart')){
        window.onbeforeunload = null;
        window.location.href = "./game.html";
    }
    if(option.hasOwnProperty('aboutpage')){
        window.onbeforeunload = null;
        window.location.href = "./index.html";
    }
    if(option.hasOwnProperty('submitideas')){
        window.onbeforeunload = null;
        window.location.href = "./contact.html";
    }
    if(option.hasOwnProperty('foodRecovery')){
        recoverFood(option);
    }

    if(option.hasOwnProperty('damage')){
        loseHealthPoints(option);
    }
}

function setNewHunger(){
    if(hunger >= 2){
        hunger-=2;
    }else{
        hunger = 0;
    }
}
function setNewHealth(){
    if(hunger === 0)
        health = 0;
}
function recoverFood(option) {
    if(hunger + option.foodRecovery >= 10){
        hunger = 10;
    }else{
        hunger+=option.foodRecovery;
    }
}
function loseHealthPoints(option) {
    if(health <= option.damage){
        health = 0;
    }else{
        health-=option.damage;
    }
}
function reduceHealthAndReturnScenario(damage){
    health-=3;
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
                nextText: 0,
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
                restart: true
            },{
                text: 'Back to About Page',
                aboutpage: true
            },{
                text: 'Submit Any Ideas',
                submitideas: true
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
                nextText: 100,
                foodRecovery: 2
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
                nextText: -2,
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
                nextText: 154,
                foodRecovery: 2,
            },
            {
                text: 'Don´t eat anything and leave.',
                nextText: 155,
                damage: 3
            }
        ]
    },
    {
        id: 154,
        text: 'You are eating the seeds and recover hunger by +2! Time to leave.',
        options:[
            {
                text: 'leave',
                nextText: 155,
                damage: 3
            },
        ]
    },
    {
        id: 155,
        text: 'As you turn around, the cat is right behind you hitting you with her right paw! You are falling down the birdhouse and ' +
            'hit the ground (Health -3). You can hear the cat`s laugh. "Play with me little Squirrel!',
        options:[
            {
                text: 'Run as fast as you can!',
                nextText: 11
            },
            {
                text: 'Fight the cat!',
                nextText: 10,
                damage: 3
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
        text: 'You are eating the vegetables and recover hunger by +3! But your health drops by -1. Time to leave.',
        options:[
            {
                text: 'leave',
                nextText: -2,
                foodRecovery: 3,
                damage: 1
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
        text: 'You turn around and run back to the compost and look at the vegetables. Still disgusting. But better then nothing. You have recovered hunger by +3! But your health drops by -1. ',
        options:[
            {
                text: 'Eat some vegetables and leave.',
                nextText: 200,
                foodRecovery: 3,
                damage: 1
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
        text: 'You are looking into the compost and see a few vegetables. They aren`t looking good but.',
        options:[
            {
                text: 'Eat some vegetables and leave.',
                nextText: 254,
                foodRecovery: +3,
                damage: 1
            },
            {
                text: 'Don´t eat anything and leave.',
                nextText: 255,
                damage: 3
            }
        ]
    },
    {
        id: 254,
        text: 'You are eating some vegetables and recover hunger by +3! Your health is dropping by -1 Time to leave.',
        options:[
            {
                text: 'leave',
                nextText: 255,
                damage: 3
            },
        ]
    },
    {
        id: 255,
        text: 'As you turn around, the cat is right behind you hitting you with her right paw! You are falling on the ground (Health -2) and can hear the cat laughing' +
            '. "Play with me little Squirrel!"',
        options:[
            {
                text: 'Run as fast as you can!',
                nextText: 11
            },
            {
                text: 'Fight the cat!',
                nextText: 10,
                damage: 3
            },
        ]
    },

    //Following Options and their stories (300+).
    {
        id: 21,
        text: 'Option 21.',
        options:[]
    },
    //FROZEN LAKE
    {
        id: 300,
        text: 'You enter the forest and walk through the snow. It is really quiet. No footsteps. What do you want to do?',
        options:[
            {
                text: 'Go left',
                nextText: 1301
            },
            {
                text: 'Go right',
                nextText: 1301
            },
            {
                text: 'Go back and sleep',
                nextText: -2
            }
        ]
    },
    {
        id: 1301,
        text: 'You see the small lake. One of the most beautiful places during the summer. \n' +
            'It is almost completely frozen. You can see a nut lying on the ice. What do you want to do?',
        options:[
            {
                text: 'Take the risk and get the nut!',
                nextText: 1302
            },
            {
                text: 'Let it be and go back to your nest.',
                nextText: -2
            },
            {
                text: 'Wait. Maybe something happens.',
                nextText: 1303
            }
        ]
    },
    {
        id: 1302,
        text: 'You are slowly walking over the ice. The ice seems to be solid. But you are totally unprotected.',
        options:[
            {
                text: 'Take the risk and get the nut!',
                nextText: 1304,
                foodRecovery: 3
            },
            {
                text: 'Let it be. Maybe tomorrow!',
                nextText: -2
            }
        ]
    },
    {
        id: 1304,
        text: 'You´ve got the nut! It tastes great. You recover your health by +3!',
        options:[
            {
                text: 'Call it a day and get back home. Slowly.',
                nextText: -2
            }
        ]
    },
    {
        id: 1303,
        text: 'Nothing happens. What do you want to do?',
        options:[
            {
                text: 'Take the risk and get the nut!',
                nextText: 1302
            },
            {
                text: 'Let it be and go back to your nest.',
                nextText: -2
            }
        ]
    },
    {
        id: 301,
        text: 'You enter the forest and walk through the snow. It is really quiet. No footsteps. What do you want to do?',
        options:[
            {
                text: 'Go left',
                nextText: 1401
            },
            {
                text: 'Go right',
                nextText: 1401
            },
            {
                text: 'Go back and sleep',
                nextText: -2
            }
        ]
    },
    {
        id: 1401,
        text: 'You see the small lake. One of the most beautiful places during the summer. \n' +
            'It is almost completely frozen. You can see a nut lying on the ice. What do you want to do?',
        options:[
            {
                text: 'Take the risk and get the nut!',
                nextText: 1402
            },
            {
                text: 'Let it be and go back to your nest.',
                nextText: -2
            },
            {
                text: 'Wait. Maybe something happens.',
                nextText: 1403
            }
        ]
    },
    {
        id: 1402,
        text: 'You are slowly walking over the ice. You can hear a few cracks but everything seems to be okay.',
        options:[
            {
                text: 'Take the risk and get the nut!',
                nextText: 1404,
                damage: 1
            },
            {
                text: 'Let it be. Maybe tomorrow!',
                nextText: -2
            }
        ]
    },
    {
        id: 1404,
        text: 'While you are getting closer, the ice under your feet breaks! Almost your whole lower body is under water! ' +
            'You lose 1 health point. What should you do?',
        options:[
            {
                text: 'GET THE NUT AND RUN',
                nextText: 1405,
                damage: 1,
                foodRecovery: 3
            },{
                text: 'Try to get back home!',
                nextText: 1406
            }
        ]
    },
    {
        id: 1403,
        text: 'Nothing happens. What do you want to do?',
        options:[
            {
                text: 'Take the risk and get the nut!',
                nextText: 1402
            },
            {
                text: 'Let it be and go back to your nest.',
                nextText: -2
            }
        ]
    },
    {
        id: 1405,
        text: 'You are jumping on your feet and run to the nut! You got the nut and recover hunger by +3! On your way back, you have to swim a little again and lose another healthpoint.' +
            'You are trembling but made it back to the shore.',
        options:[
            {
                text: 'Go back to your nest and warm up',
                nextText: -2
            }
        ]
    },
    {
        id: 1406,
        text: 'You made it back to the shore! You are trembling a little and are sad that you haven`t reached the nut.',
        options:[
            {
                text: 'Go back to your nest and warm up',
                nextText: -2
            }
        ]
    },
    {
        id: 302,
        text: 'You enter the forest. You can hear a few small birds. What do you want to do.',
        options:[
            {
                text: 'Go left.',
                nextText: 1501
            },
            {
                text: 'Go right.',
                nextText: 1501
            },
            {
                text: 'Go back and sleep..',
                nextText: -2
            }
        ]
    },
    {
        id: 1501,
        text: 'You are a little hungry and remember a spot where you have buried an acorn a few weeks ago.\nIt is definitely close to you.',
        options:[
            {
                text: 'Try to remember the exact place.',
                nextText: 1502
            },
            {
                text: 'Climb a tree to get a better overview.',
                nextText: 1503
            },
            {
                text: 'Go back and sleep. It is probably away anyways.',
                nextText: -2
            }
        ]
    },
    {
        id: 1502,
        text: 'You think that you remember the place. And your stomach is growling! What do you want to do?',
        options:[
            {
                text: 'Lets go to that place.',
                nextText: 1504
            },
            {
                text: 'Climb a tree to get a better overview. I am not 100% sure.',
                nextText: 1503
            },
            {
                text: 'Go back and sleep. It is probably away anyways.',
                nextText: -2
            }
        ]
    },
    {
        id: 1504,
        text: 'After a few minutes of running through the snow, you find the spot. "This must be it!"',
        options:[
            {
                text: 'Start digging a hole! (-2 hunger)',
                nextText: 1505,
                foodRecovery: -2
            },
            {
                text: '... Or maybe not? Think again..',
                nextText: 1506
            },
            {
                text: 'Go back and sleep. I dont think that that´s the spot',
                nextText: -2
            }
        ]
    },
    {
        id: 1505,
        text: 'You start digging. The ground is a bit frozen but you are able to get through. After a few more minutes you finally see three acorns!\n"THIS IS MUCH BETTER THEN EXPECTED!"',
        options:[
            {
                text: 'Eat the three acorns (+5 Hunger)',
                nextText: 1508,
                foodRecovery: 5
            }
        ]
    },
    {
        id: 1506,
        text: 'You are unsettled and try to remember. "That must be the place! There is even the acorn tree from my memories"',
        options:[
            {
                text: 'Start digging a hole! (-2 hunger)',
                nextText: 1505,
                foodRecovery: -2
            },
            {
                text: 'Go back and sleep. I am not sure..',
                nextText: -2
            }
        ]
    },
    {
        id: 1503,
        text: 'You are climbing on the tree. You do have a great view over a really large area. You start thinking and remember the place being close to a acorn tree. There are only two acorn trees in the whole area!',
        options:[
            {
                text: 'Lets aim for the one in the south',
                nextText: 1507,
            },
            {
                text: 'Lets aim for the one in the north',
                nextText: 1507
            },
            {
                text: 'Climb down the tree and go back home. I dont think that that´s the spot',
                nextText: -2
            }
        ]
    },
    {
        id: 1507,
        text: 'You start jumping from branch to branch, tree to tree. The snow from the branches is falling down. You are getting closer to the tree. You are scanning the area on the ground and start climbing down. You are careful as always. "This must be the spot"',
        options:[
            {
                text: 'Start digging a hole! (-2 hunger)',
                nextText: 1505,
                foodRecovery: -2
            },
            {
                text: '... Or maybe not? Think again..',
                nextText: 1506
            },
            {
                text: 'Go back and sleep. I dont think that that´s the spot',
                nextText: -2
            }
        ]
    },
    {
        id: 1508,
        text: 'What a meal. You feel great! Time to go home.',
        options:[
            {
                text: 'Go back home.',
                nextText: -2,
            }
        ]
    },


    {
        id: 303,
        text: 'You enter the forest. You can hear a few small birds. What do you want to do.',
        options:[
            {
                text: 'Go left.',
                nextText: 1601
            },
            {
                text: 'Go right.',
                nextText: 1601
            },
            {
                text: 'Go back and sleep..',
                nextText: -2
            }
        ]
    },
    {
        id: 1601,
        text: 'You are a little hungry and remember a spot where you have buried an acorn a few weeks ago.\nIt is definitely close to you.',
        options:[
            {
                text: 'Try to remember the exact place.',
                nextText: 1602
            },
            {
                text: 'Climb a tree to get a better overview.',
                nextText: 1603
            },
            {
                text: 'Go back and sleep. It is probably away anyways.',
                nextText: -2
            }
        ]
    },
    {
        id: 1602,
        text: 'You think that you remember the place. And your stomach is growling! What do you want to do?',
        options:[
            {
                text: 'Lets go to that place.',
                nextText: 1604
            },
            {
                text: 'Climb a tree to get a better overview. I am not 100% sure.',
                nextText: 1603
            },
            {
                text: 'Go back and sleep. It is probably away anyways.',
                nextText: -2
            }
        ]
    },
    {
        id: 1604,
        text: 'After a few minutes of running through the snow, you find the spot. "This must be it!"',
        options:[
            {
                text: 'Start digging a hole! (-2 hunger)',
                nextText: 1605,
                foodRecovery: -2
            },
            {
                text: '... Or maybe not? Think again..',
                nextText: 1606
            },
            {
                text: 'Go back and sleep. I dont think that that´s the spot',
                nextText: -2
            }
        ]
    },
    {
        id: 1605,
        text: 'You start digging. The ground is a bit frozen but you are able to get through. After a few minutes you give up.. "I have already dug three flowers deep! It must be the wrong place.."',
        options:[
            {
                text: 'You are sad and go back to your nest.. Hungry..',
                nextText: -2
            }
        ]
    },
    {
        id: 1606,
        text: 'You are unsettled and try to remember. "That must be the place! There is even the acorn tree from my memories"',
        options:[
            {
                text: 'Start digging a hole! (-2 hunger)',
                nextText: 1605,
                foodRecovery: -2
            },
            {
                text: 'Go back and sleep. I am not sure..',
                nextText: -2
            }
        ]
    },
    {
        id: 1603,
        text: 'You are climbing on the tree. You do have a great view over a really large area. You start thinking and remember the place being close to a acorn tree. There are only two acorn trees in the whole area!',
        options:[
            {
                text: 'Lets aim for the one in the south',
                nextText: 1607,
            },
            {
                text: 'Lets aim for the one in the north',
                nextText: 1607
            },
            {
                text: 'Climb down the tree and go back home. I dont think that that´s the spot',
                nextText: -2
            }
        ]
    },
    {
        id: 1607,
        text: 'You start jumping from branch to branch, tree to tree. The snow from the branches is falling down. You are getting closer to the tree. You are scanning the area on the ground and start climbing down. You are careful as always. "This must be the spot"',
        options:[
            {
                text: 'Start digging a hole! (-2 hunger)',
                nextText: 1605,
                foodRecovery: -2
            },
            {
                text: '... Or maybe not? Think again..',
                nextText: 1606
            },
            {
                text: 'Go back and sleep. I dont think that that´s the spot',
                nextText: -2
            }
        ]
    }
];

startGame();