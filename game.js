const textElement = document.getElementById('text');
const optionButtonsElement = document.getElementById('option-buttons');

let state = {};

function startGame(){
    state = {};
    showTextNode(1)
}

function showTextNode(textNodeIndex) {
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex);
    textElement.innerText = textNode.text;
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
    const nextTextNodeId = option.nextText;
    state = Object.assign(state, option.setState);
    showTextNode(nextTextNodeId)
}

function select(option) {

}

const textNodes = [
    {
        id: 1,
        text: 'Scenario 1',
        options:[
            {
                text: "Get something 1",
                setState: {something: true},
                nextText: 2
            },
            {
                text: 'Bla 2',
                nextText: 2
            }
        ]
    },
    {
        id: 2,
        text: "Scenario 2",
        options:[
            {
                text: 'Buy sword 1',
                requiredState: (currentState) => currentState.something,
                setState: {something: false, sword: true},
                nextText: 3
            },
            {
                text: 'Buy shield 1',
                requiredState: (currentState) => currentState.something,
                setState: {something: false, shield: true},
                nextText: 3
            },
            {
                text: 'Nothing...'
            }
        ]
    }
];

startGame();