document.addEventListener('DOMContentLoaded', () => {
    // 1) FAQ Toggles
    const faqItems = document.querySelectorAll('.faqItem');
    faqItems.forEach(item => {
      const questionEl = item.querySelector('.faqQuestion');
      const answerEl = item.querySelector('.faqAnswer');
      questionEl.addEventListener('click', () => {
        if (answerEl.classList.contains('hidden')) {
          // Show answer
          answerEl.classList.remove('hidden');
          item.querySelector('i').classList.remove('fa-chevron-right');
          item.querySelector('i').classList.add('fa-chevron-down');
        } else {
          // Hide answer
          answerEl.classList.add('hidden');
          item.querySelector('i').classList.remove('fa-chevron-down');
          item.querySelector('i').classList.add('fa-chevron-right');
        }
      });
    });
  
    // 2) User-submitted questions storage
    let userQuestions = JSON.parse(localStorage.getItem('userHelpQuestions')) || [];
  
    // Display user questions on load
    const userQuestionsList = document.getElementById('userQuestionsList');
    const userQuestionsSection = document.getElementById('userQuestionsSection');
    if (userQuestions.length > 0) {
      updateQuestionsList();
    }
  
    // 3) Handle "Still Need Help?" form submission
    const helpForm = document.getElementById('helpForm');
    helpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const question = document.getElementById('helpQuestion').value.trim();
      if (!question) {
        alert("Please enter your question.");
        return;
      }
      // Save question
      const newQ = { id: Date.now(), question };
      userQuestions.push(newQ);
      localStorage.setItem('userHelpQuestions', JSON.stringify(userQuestions));
      // Update the UI
      document.getElementById('helpQuestion').value = '';
      updateQuestionsList();
      alert("Question submitted successfully!");
    });
  
    // 4) Function to display the user questions
    function updateQuestionsList() {
      if (userQuestions.length === 0) {
        userQuestionsList.innerHTML = `<li class="text-gray-500">No questions submitted yet.</li>`;
        return;
      }
      userQuestionsList.innerHTML = '';
      userQuestions.forEach((q, index) => {
        const li = document.createElement('li');
        li.className = 'bg-white p-3 rounded-lg shadow flex justify-between items-center';
        li.innerHTML = `
          <span class="text-gray-700">${q.question}</span>
          <button class="deleteQ text-red-500 hover:text-red-700" title="Delete">
            <i class="fas fa-trash-alt"></i>
          </button>
        `;
        // Deletion
        li.querySelector('.deleteQ').addEventListener('click', () => {
          if (confirm("Delete this question?")) {
            userQuestions.splice(index, 1);
            localStorage.setItem('userHelpQuestions', JSON.stringify(userQuestions));
            updateQuestionsList();
          }
        });
        userQuestionsList.appendChild(li);
      });
    }
  });
  