document.addEventListener('DOMContentLoaded', () => {

    /* 1. GLOBAL: NUMBER COUNTER (About Page)*/
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        counters.forEach(counter => {
            counter.innerText = '0';
            const updateCounter = () => {
                const target = +counter.getAttribute('data-target');
                const c = +counter.innerText;
                const increment = Math.ceil(target / 100);

                if (c < target) {
                    counter.innerText = `${c + increment}`;
                    setTimeout(updateCounter, 30);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    }

    /*2. GLOBAL: FORM VALIDATION (Join Page) */
    const form = document.getElementById('enlistForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');

            const isNameValid = checkInput(fullname, /^.{2,}$/);
            const isEmailValid = checkInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            const isPhoneValid = checkInput(phone, /^\d{10}$|^\d{3}-\d{3}-\d{4}$/);

            if (isNameValid && isEmailValid && isPhoneValid) {
                runSuccessAnimation();
            }
        });
    }

    function checkInput(input, regex) {
        const parent = input.parentElement;
        if (regex.test(input.value.trim())) {
            parent.classList.remove('error');
            parent.classList.add('success');
            return true;
        } else {
            parent.classList.remove('success');
            parent.classList.add('error');
            return false;
        }
    }

    function runSuccessAnimation() {
        const btn = document.getElementById('submitBtn');
        btn.innerText = "VERIFYING DATA...";
        btn.style.backgroundColor = "#fff";
        btn.style.color = "#000";
        setTimeout(() => {
            btn.innerText = "ACCESS GRANTED";
            btn.style.backgroundColor = "#2962ff"; 
            btn.style.color = "#fff";
            setTimeout(() => {
                alert("WELCOME TO HAVOC STRENGTH.");
                location.reload();
            }, 500);
        }, 1500);
    }

    /*  3. OPS PAGE: REFLEX GAME (DYNAMIC GRID) */
    /* game no longer repeats squares */
    const grid = document.querySelector('.game-grid');
    const scoreDisplay = document.querySelector('#score');
    const timeDisplay = document.querySelector('#time-left');
    const startBtn = document.querySelector('#start-game-btn');
    const diffBtns = document.querySelectorAll('.diff-btn');
    
    let squares = [];
    let score = 0;
    let currentTime = 30;
    let timerId = null;
    let moleTimerId = null;
    let hitPosition = null;
    let moveSpeed = 1000; 
    
    // NEW: Variable to track the previous spot
    let lastPosition = -1; 

    if (grid) {
        // Initial Grid (Easy/Default)
        createBoard(9);

        // --- Difficulty Logic ---
        diffBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                diffBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                moveSpeed = parseInt(btn.getAttribute('data-speed'));

                if (moveSpeed === 400) {
                    createBoard(20); // 5x4 Grid
                } else {
                    createBoard(9);  // 3x3 Grid
                }
            });
        });

        // --- Start Game Logic ---
        startBtn.addEventListener('click', () => {
            if (timerId) clearInterval(timerId);
            if (moleTimerId) clearInterval(moleTimerId);
            
            score = 0;
            currentTime = 30;
            lastPosition = -1; // Reset tracking
            scoreDisplay.textContent = 0;
            timeDisplay.textContent = 30;
            
            moleTimerId = setInterval(randomSquare, moveSpeed);
            timerId = setInterval(countDown, 1000);
            
            startBtn.innerText = "RUNNING...";
            startBtn.disabled = true;
            diffBtns.forEach(btn => btn.style.pointerEvents = 'none');
        });
    }

    // --- Helper: Build the Grid ---
    function createBoard(numSquares) {
        grid.innerHTML = '';
        squares = [];
        
        if (numSquares === 20) {
            grid.classList.add('hard-grid');
        } else {
            grid.classList.remove('hard-grid');
        }

        for (let i = 0; i < numSquares; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.setAttribute('id', i);
            grid.appendChild(square);
            squares.push(square);

            square.addEventListener('mousedown', () => {
                if (square.id == hitPosition) {
                    score++;
                    scoreDisplay.textContent = score;
                    hitPosition = null;
                    square.classList.remove('target');
                    square.style.backgroundColor = '#fff';
                    setTimeout(()=> square.style.backgroundColor = '', 100);
                }
            });
        }
    }

    // --- UPDATED: Random Square Logic ---
    function randomSquare() {
        squares.forEach(sq => sq.classList.remove('target'));
        
        let newIndex;
        
        // Loop: Pick a random number UNTIL it is different from the last one
        do {
            newIndex = Math.floor(Math.random() * squares.length);
        } while (newIndex === lastPosition);

        let randomSquare = squares[newIndex];
        randomSquare.classList.add('target');
        
        hitPosition = randomSquare.id;
        lastPosition = newIndex; // Save this position for next time
    }

    function countDown() {
        currentTime--;
        timeDisplay.textContent = currentTime;
        if (currentTime == 0) {
            clearInterval(timerId);
            clearInterval(moleTimerId);
            alert('DRILL COMPLETE. FINAL SCORE: ' + score);
            
            startBtn.innerText = "INITIATE SEQUENCE";
            startBtn.disabled = false;
            diffBtns.forEach(btn => btn.style.pointerEvents = 'auto');
        }
    }

    // --- Helper: Build the Grid ---
    function createBoard(numSquares) {
        // Clear old grid
        grid.innerHTML = '';
        squares = [];
        
        // Toggle CSS class for 5x4 layout
        if (numSquares === 20) {
            grid.classList.add('hard-grid');
        } else {
            grid.classList.remove('hard-grid');
        }

        // Generate Squares
        for (let i = 0; i < numSquares; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            square.setAttribute('id', i);
            grid.appendChild(square);
            squares.push(square);

            // Hit Listener
            square.addEventListener('mousedown', () => {
                if (square.id == hitPosition) {
                    score++;
                    scoreDisplay.textContent = score;
                    hitPosition = null;
                    square.classList.remove('target');
                    square.style.backgroundColor = '#fff';
                    setTimeout(()=> square.style.backgroundColor = '', 100);
                }
            });
        }
    }

    function randomSquare() {
        squares.forEach(sq => sq.classList.remove('target'));
        // Dynamic random based on current array length (9 or 20)
        let randomSquare = squares[Math.floor(Math.random() * squares.length)];
        randomSquare.classList.add('target');
        hitPosition = randomSquare.id;
    }

    function countDown() {
        currentTime--;
        timeDisplay.textContent = currentTime;
        if (currentTime == 0) {
            clearInterval(timerId);
            clearInterval(moleTimerId);
            alert('DRILL COMPLETE. FINAL SCORE: ' + score);
            
            startBtn.innerText = "INITIATE SEQUENCE";
            startBtn.disabled = false;
            diffBtns.forEach(btn => btn.style.pointerEvents = 'auto');
        }
    }

    /* =========================================
       4. OPS PAGE: WORKOUT DECRYPTOR
       ========================================= */
    const generateBtn = document.getElementById('generate-btn');
    const workoutDisplay = document.getElementById('workout-display');
    
    const workouts = [
        "MISSION: IRON LUNGS\n100 Burpees for Time\nEvery 2 mins: 10 Pushups",
        "MISSION: LEG DAY SIEGE\n5x5 Back Squat (Heavy)\n4x12 Walking Lunges\n3x20 Leg Press",
        "MISSION: ARMOR PLATING\n5x5 Deadlift\n4x8 Overhead Press\n3xMax Pull-ups",
        "MISSION: TACTICAL CORE\n1 min Plank\n20 Leg Raises\n20 Russian Twists\nRepeat 4 Rounds"
    ];

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const randomWorkout = workouts[Math.floor(Math.random() * workouts.length)];
            scrambleText(workoutDisplay, randomWorkout);
        });
    }

    // The "Hacker" Text Scramble Effect
    function scrambleText(element, finalString) {
        let iterations = 0;
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        
        const interval = setInterval(() => {
            element.innerText = finalString
                .split("")
                .map((letter, index) => {
                    if (index < iterations) return finalString[index];
                    if (letter === "\n") return "\n"; // Preserve line breaks
                    return letters[Math.floor(Math.random() * 26)];
                })
                .join("");

            if (iterations >= finalString.length) clearInterval(interval);
            iterations += 1 / 2; // Speed of decoding
        }, 30);
    }

});