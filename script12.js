// Select the quantity display and buttons
const quantityDisplay = document.getElementById('quantity-display');
const increaseBtn = document.getElementById('increase-btn');
const decreaseBtn = document.getElementById('decrease-btn');
const sizeButtons = document.querySelectorAll('.size-btn');

// Initialize quantity
let quantity = 1;

// Function to update the displayed quantity
function updateQuantityDisplay() {
    quantityDisplay.textContent = quantity;
}

// Add event listeners to the buttons
increaseBtn.addEventListener('click', () => {
    quantity++;
    updateQuantityDisplay();
});

decreaseBtn.addEventListener('click', () => {
    // Prevent quantity from going below 1
    if (quantity > 1) {
        quantity--;
        updateQuantityDisplay();
    }
});

sizeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    sizeButtons.forEach((btn) => btn.classList.remove('selected'));
    button.classList.add('selected');
  });
});




//  image 

const image = ['photos/uniplan4.jpg',
    'photos/uniplan4.1.jpg',
	'photos/uniplan4.2.jpg',
	'photos/uniplan4.3.jpg',

];


const flexBox = document.getElementById('flex-box')
const box = document.getElementById('box')
const leftBtn = document.getElementById('left-btn')
const rightBtn = document.getElementById('right-btn')
const dotContainer = document.getElementById('dot-container')
// const caption =document.getElementById('caption')


const n = image.length;


const continerWidth = 32.6;
const flexBoxWidth = n * continerWidth;
flexBox.style.width = flexBoxWidth;


for (let i = 0; i < n; i++) {

    const newimg = document.createElement('img');
    newimg.src = image[i]
    newimg.classList.add('image-style')
    flexBox.appendChild(newimg);


    const dotDiv = document.createElement('div')
    dotDiv.classList.add('dot')
    dotContainer.appendChild(dotDiv);

    dotDiv.addEventListener('click', (event) => {
        const index = [...dotContainer.children].indexOf(event.target)
        showImg(index)
    })


}

let countPos = 0;
leftBtn.addEventListener('click', () => {
    if (countPos > 0) {
        showImg(countPos - 1)

    }
    else {
        showImg(n - 1);

    }
    numOfImage.innerHTML = (countPos + 1) + '/5';

})

rightBtn.addEventListener('click', () => {

    if (countPos < n - 1) {
        showImg(countPos + 1);
    }
    else {
        showImg(0)

    }
    numOfImage.innerHTML = (countPos + 1) + '/5';

})


function showImg(position) {



    const prevDot = dotContainer.children[countPos]
    prevDot.classList.remove('active')

    countPos = position

    const currDot = dotContainer.children[countPos]
    currDot.classList.add('active')

    const translateXDistance = -countPos * continerWidth;
    flexBox.style.transform = `translateX(${translateXDistance}vw)`

}




