document.addEventListener('DOMContentLoaded', () => {

    /*        
       1. GLOBAL: NUMBER COUNTER (About Page)
               */
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

    /*        
       2. GLOBAL: FORM VALIDATION (Join Page)
               */
    const form = document.getElementById('enlistForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get Elements
            const fullname = document.getElementById('fullname');
            const email = document.getElementById('email');
            const phone = document.getElementById('phone');
            const age = document.getElementById('age');
            const weight = document.getElementById('weight');
            const height = document.getElementById('height');
            const goals = document.getElementById('goals');

            // 1. Text & Regex Validations
            const isNameValid = checkInput(fullname, /^.{2,}$/); // Min 2 chars
            const isEmailValid = checkInput(email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
            const isPhoneValid = checkInput(phone, /^\d{10}$|^\d{3}-\d{3}-\d{4}$/); // 10 digits
            
            // 2. Numeric Validations (New Helper Function)
            const isAgeValid = checkNumber(age, 16, 120); // Min 16, Max 120
            const isWeightValid = checkNumber(weight, 30, 500);
            const isHeightValid = checkNumber(height, 50, 200); 

            // 3. Goals Validation (Min 10 chars, allowing new lines)
            const isGoalsValid = checkInput(goals, /^[\s\S]{10,}$/);

            // Final Check
            if (isNameValid && isEmailValid && isPhoneValid && 
                isAgeValid && isWeightValid && isHeightValid && isGoalsValid) {
                runSuccessAnimation();
            } else {
                // Optional: Shake animation or alert if failed
                console.log("Validation Failed");
            }
        });
    }

    // Helper: Checks Regex Matches (Text)
    function checkInput(input, regex) {
        const parent = input.parentElement;
        // .trim() removes whitespace from start/end
        if (regex.test(input.value.trim())) {
            parent.classList.remove('error'); // Relies on your CSS for styling
            parent.classList.remove('input-error'); // Supports the HTML update styling
            parent.classList.add('success');
            
            // Hide error message if using the structure from HTML update
            const errorMsg = parent.querySelector('.error-msg');
            if(errorMsg) errorMsg.style.display = 'none';
            
            return true;
        } else {
            parent.classList.remove('success');
            parent.classList.add('error');
            parent.classList.add('input-error');
            
            // Show error message
            const errorMsg = parent.querySelector('.error-msg');
            if(errorMsg) errorMsg.style.display = 'block';
            
            return false;
        }
    }

    // Helper: Checks Numeric Ranges (New)
    function checkNumber(input, min, max) {
        const parent = input.parentElement;
        const val = parseFloat(input.value);
        
        if (input.value !== '' && !isNaN(val) && val >= min && val <= max) {
            parent.classList.remove('input-error');
            parent.classList.add('success');
            const errorMsg = parent.querySelector('.error-msg');
            if(errorMsg) errorMsg.style.display = 'none';
            return true;
        } else {
            parent.classList.add('input-error');
            parent.classList.remove('success');
            const errorMsg = parent.querySelector('.error-msg');
            if(errorMsg) errorMsg.style.display = 'block';
            return false;
        }
    }

    function runSuccessAnimation() {
        const btn = document.getElementById('submitBtn');
        const originalText = btn.innerText;
        
        btn.innerText = "VERIFYING INFO...";
        btn.style.backgroundColor = "#fff";
        btn.style.color = "#000";
        
        setTimeout(() => {
            btn.innerText = "ACCESS GRANTED";
            btn.style.backgroundColor = "#2962ff"; 
            btn.style.color = "#fff";
            setTimeout(() => {
                alert("WELCOME TO HAVOC STRENGTH.");
                // location.reload(); // Uncomment to reload page
            }, 500);
        }, 1500);
    }

    /*        
       3. REFLEX GAME
               */
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
    let lastPosition = -1; 

    // Poem words
    const poemWords = [
        "no", "rest", "for", "the", "greatest",
        "you", "have", "taken", "another", "step",
        "be", "proud", "of", "your", "achievements",
        "Look", "how", "far", "you've", "come"
    ];
    let wordIndex = 0;

    if (grid) {
        createBoard(9);

        // --- Difficulty Logic ---
        diffBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                diffBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                moveSpeed = parseInt(btn.getAttribute('data-speed'));

                if (moveSpeed === 400) {
                    createBoard(20); // Hard
                } else {
                    createBoard(9);  // Easy/Med
                }
            });
        });

        // --- Start Game Logic ---
        startBtn.addEventListener('click', () => {
            if (timerId) clearInterval(timerId);
            if (moleTimerId) clearInterval(moleTimerId);
            
            score = 0;
            currentTime = 30;
            lastPosition = -1;
            wordIndex = 0;
            scoreDisplay.textContent = 0;
            timeDisplay.textContent = 30;
            
            // Clean grid before starting
            squares.forEach(sq => {
                sq.classList.remove('target');
                sq.innerText = "";
            });

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
                    square.innerText = ""; 
                    square.style.backgroundColor = '#fff';
                    setTimeout(()=> square.style.backgroundColor = '', 100);
                }
            });
        }
    }

    // --- Random Square Logic ---
    function randomSquare() {
        // Clear previous
        squares.forEach(sq => {
            sq.classList.remove('target');
            sq.innerText = ""; 
        });
        
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * squares.length);
        } while (newIndex === lastPosition);

        let randomSquare = squares[newIndex];
        randomSquare.classList.add('target');
        
        // Safety Check: Only show text if we are in Hard Mode (20 squares)
        if (moveSpeed === 400 && squares.length === 20) {
            randomSquare.innerText = poemWords[wordIndex];
            wordIndex = (wordIndex + 1) % poemWords.length;
        }

        hitPosition = randomSquare.id;
        lastPosition = newIndex; 
    }

    function countDown() {
        currentTime--;
        timeDisplay.textContent = currentTime;
        if (currentTime == 0) {
            clearInterval(timerId);
            clearInterval(moleTimerId);
            
            squares.forEach(sq => sq.innerText = "");
            
            alert('DRILL COMPLETE. FINAL SCORE: ' + score);
            
            startBtn.innerText = "INITIATE SEQUENCE";
            startBtn.disabled = false;
            diffBtns.forEach(btn => btn.style.pointerEvents = 'auto');
        }
    }
    
    /*        
       4. OPS PAGE: WORKOUT DECRYPTOR
               */
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