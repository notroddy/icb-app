// JavaScript code in form.js

document.addEventListener("DOMContentLoaded", function() {
    const fieldQuestions = {
        name: "What's your project's name?",
        api: "Is this for an API?",
        app_names: "Enter the app names separated by commas",
        database: "Do you need a database?",
        whitenoise: "Do you want to use Whitenoise for static files?",
        github: "Do you want to use GitHub?",
        github_url: "Enter the GitHub URL",
        django_extensions: "Do you need Django Extensions?",
        black: "Do you want to use Black for code formatting?",
        flake8: "Do you want to use Flake8 for linting?",
        pytest: "Do you want to use Pytest for testing?",
        dockerfile: "Do you need a Dockerfile?",
        docker_compose: "Do you need a Docker Compose file?",
        python_version: "What Python version do you want to use?"
    };

    let currentQuestion = 0;
    const inputContainer = document.getElementById("inputContainer");
    const questionElement = document.getElementById("question");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");

    const appInput = document.getElementById("appInput");
    const appTagsContainer = document.getElementById("appTags");

    const formFields = Object.keys(fieldQuestions);
    const formData = {};

    // Function to display the current question and input field
    function displayQuestion() {
        const fieldName = formFields[currentQuestion];
        const question = fieldQuestions[fieldName];
        questionElement.textContent = question;

        // Clear any existing input elements
        inputContainer.innerHTML = "";

        // Create the appropriate input element based on field type
        let inputElement;
        if (fieldName === "app_names") {
            inputElement = document.createElement("textarea");
        } else if (fieldName === "api" || fieldName === "database" || fieldName === "whitenoise" || fieldName === "github" || fieldName === "django_extensions" || fieldName === "black" || fieldName === "flake8" || fieldName === "pytest" || fieldName === "dockerfile" || fieldName === "docker_compose") {
            inputElement = document.createElement("input");
            inputElement.type = "checkbox";
        } else {
            inputElement = document.createElement("input");
            inputElement.type = "text";
        }
        inputElement.name = fieldName;
        inputContainer.appendChild(inputElement);

        // Update button visibility
        if (currentQuestion === formFields.length - 1) {
            nextBtn.style.display = "none";
            submitBtn.style.display = "block";
        } else {
            nextBtn.style.display = "block";
            submitBtn.style.display = "none";
        }
    }

    // Function to handle clicking the "Next" button
    function nextQuestion() {
        const fieldName = formFields[currentQuestion];
        const inputElement = inputContainer.querySelector(`[name="${fieldName}"]`);
        formData[fieldName] = inputElement.value;

        currentQuestion++;
        if (currentQuestion < formFields.length) {
            displayQuestion();
        } else {
            document.getElementById("projectForm").submit();
        }
    }

    // Function to add a new tag when the user presses Enter
    appInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default behavior of submitting the form
            const appName = appInput.value.trim();
            if (appName) {
                const tag = createTag(appName);
                appTagsContainer.appendChild(tag);
                appInput.value = ""; // Clear the input field
            }
        }
    });

    // Function to create a new tag element
    function createTag(name) {
        const tag = document.createElement("div");
        tag.classList.add("tag");
        tag.textContent = name;
        
        // Add a click event listener to remove the tag when clicked
        tag.addEventListener("click", function() {
            tag.remove();
        });
        
        return tag;
    }

    // Event listener for the "Next" button click
    nextBtn.addEventListener("click", nextQuestion);

    // Display the first question when the page loads
    displayQuestion();
});
