'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';


  const movs = sort ? movements.slice().sort((a,b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}</div>
      </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0)
  labelBalance.textContent = `${acc.balance} EUR`;
}

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = Math.abs(acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0));
  labelSumOut.textContent = `${out}€`;

  const interest = acc.movements.filter(mov => mov > 0).map(mov => mov * acc.interestRate / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest}€`
}
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];




const createUserName = function (accs) {

  accs.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(' ').map((word) => word[0]).join('');
  });

  console.log(accs);
}

createUserName(accounts);

const updateUI =function(acc){
    displayMovements(acc.movements);
    calcPrintBalance(acc);
    calcDisplaySummary(acc);
}

const startLogOutTimer = function(){
  //Set 5 minute
  let time = 5*60;
  let tick = function(){

    const min = String(Math.floor(time / 60)).padStart(2,0);
    const sec = String(time % 60).padStart(2,0);
    //Print time for each call
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 sec, stop timer and log out
    if (time ===0){
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
    
      containerApp.style.opacity = 0;
    }
    //Decrease 1 sec

    time--;


  }
  //Call timer every second 
  tick();
  const timer = setInterval(tick,1000) ;
  return timer;

}

//Event
let currentAccount,timer;

btnLogin.addEventListener('click',function(e){

  e.preventDefault();
  currentAccount =  accounts.find((acc) => acc.username === inputLoginUsername.value);

  console.log(currentAccount);

  if(currentAccount?.pin === Number(inputLoginPin.value)) 
    {
      //Display UI
      labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`
    
    containerApp.style.opacity = 100;

    //Clear input
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur(); 
    
    if(timer) clearInterval(timer);
    timer = startLogOutTimer();
    updateUI(currentAccount);
    }

})

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();

  const amount = Number( inputTransferAmount.value);

  const receiverAcc =accounts.find(acc=>acc === inputTransferTo.value);


  //Clear input field
  inputTransferAmount.value=inputTransferTo.value="";

  //Tranfer condition
  if (amount > 0 && currentAccount.balance >= amount && receiverAcc && receiverAcc?.username != currentAccount.username)
    {
      //Transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);
    }
  
    updateUI();

    clearInterval(timer);
    timer = startLogOutTimer();
  
})

btnLoan.addEventListener('click',function(e){
    e.preventDefault()

    const amount = Number(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov=> mov >= amount*0.1))
      {
        //Add movement
        currentAccount.movements.push(amount);

        updateUI();
        
        clearInterval(timer);
        timer = startLogOutTimer();
      }
})  

btnClose.addEventListener('click',function(e){

  e.preventDefault()

  
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin){
      const index = accounts.findIndex(acc => acc.username === currentAccount.username);
      accounts.splice(index,1);
      console.log(accounts);
      containerApp.style.opacity = 0;

  }

  inputCloseUsername.value=inputClosePin.value="";


  //Hide UI
})









// const balance = movements.reduce(function(acc,cur,i,arr){
//   return acc+cur;
// },0)

// console.log(balance);
// const eurToUsd = 1.1;
// const movementsUSD = movements.map(mov => mov*eurToUsd);

// const movementsDes = movements.map((mov,i)=>
//   `Movement ${i+1 }: You ${mov>0? 'deposited':'withderw'} ${Math.abs(mov)}`
// )


/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES



//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr =  ['a','b','c','d'];

// arr.slice(2);

// arr.splice(2)

// let arr2 = arr.reverse();

// console.log(arr.concat(arr2));

// const arr3 = [34,1,55];

// console.log(arr3.at(0));

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements){
//   if (movement > 0)
//   {
//     console.log(`You deposited ${movement}`);
//   }
//   else
//   {
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// }


// movements.forEach(function(movement,i,arr){
//   if (movement > 0)
//   {
//     console.log(`Movement ${i+1 }: You deposited ${movement}`);
//   }
//   else
//   {
//     console.log(`Movement ${i+1 }: You withdrew ${Math.abs(movement)}`);
//   }
// })

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function(value,key,map){
//   console.log(`${key}: ${value}`);
// })

// //Set
// const currenciesUnique = new Set(['USD','GBP','USD','GBP','EUR']);

// console.log(currenciesUnique);

// currenciesUnique.forEach(function(value,_,map){
//   console.log(`${value}: ${value}`);
// })

//Chalenge 1
// const Julia = [3, 5, 2, 12, 7];
// const Kate = [4, 1, 15, 8, 3];
// //Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// const checkDogs = function(arr1,arr2)

  //   const arr1Corrected = arr1.slice();
  //   arr1Corrected.splice(0,1);
  //   arr1Corrected.splice(-2);
  //   const arr = arr1Corrected.concat(arr2);

  //   arr.forEach(function(dog,i){
  //     const type = dog>=3 ?`is an dult` : `is still a puppy`;
  //     console.log(`Dog number ${i} ${type}`);
  //   })
  // }

  // checkDogs(Julia,Kate);

  // const max = movements.reduce((acc,cur) => acc>cur ? cur :acc,movements[0]);
  // console.log(max);


  //Chalenge 2

  // Data = [5,2,4,1,15,8,3]
  // const avgHumanAge = function(dogs )
  // {
  //   let HumanAge = dogs.map((dog,i) => (dog <=2) ? 2*dog : 16+dog*4);
  //   HumanAge = HumanAge.filter((age)=> age >=18);
  //   return HumanAge.reduce((acc,dog)=> acc+dog/HumanAge.length,0);
  // }

  // console.log(avgHumanAge([5,2,4,1,15,8,3]))
