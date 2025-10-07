// Java Kuis
const quizData = [
    {
      question: "Proses fotosintesis pada tumbuhan berlangsung di dalam organel sel yang disebut?",
      options: [
        "Mitokondria",
        "Kloroplas",
        "Nukleus",
        "Ribosom",
      ],
      correct: 1,
    },
    {
      question: "Gas yang dihasilkan tumbuhan sebagai hasil fotosintesis dan sangat dibutuhkan manusia adalah?",
      options: [
        "Karbon dioksida (CO₂)",
        "Nitrogen (N₂)",
        "Oksigen (O₂)",
        "Uap air (H₂O)",
      ],
      correct: 2,
    },
  
    {
      question: "Persamaan reaksi fotosintesis yang benar adalah?",
      options: [
        "CO₂ + O₂ → C₆H₁₂O₆ + H₂O",
        "C₆H₁₂O₆ + O₂ → CO₂ + H₂O",
        "CO₂ + H₂O → C₆H₁₂O₆ + O₂",
        "H₂O + O₂ → CO₂ + C₆H₁₂O₆",
      ],
      correct: 2,
    },
  
    {
      question: "Sumber energi utama yang digunakan tumbuhan untuk melakukan fotosintesis adalah?",
      options: [
        "Cahaya matahari",
        "Air hujan",
        "Nutrisi dari tanah",
        "Gas oksigen",
      ],
      correct: 0,
    },
  
    {
      question: "Bagian kloroplas yang berperan penting dalam menangkap energi cahaya matahari adalah?",
      options: [
        "Stroma",
        "Membran luar",
        "Membran dalam",
        "Tilakoid",
      ],
      correct: 3,
    }
]

  function loadQuiz() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = ""; // Reset sebelum memasukkan soal baru
  
    quizData.forEach((item, index) => {
      let questionBlock = `<div class="mb-4 opacity-0 transform translate-y-10 transition-all duration-700" id="question-${index}">
              <p class="font-semibold">${index + 1}. ${item.question}</p>`;
  
      item.options.forEach((option, i) => {
        questionBlock += `
              <label class="block items-center gap-2" id="label-${index}-${i}">
                  <input type="radio" name="question${index}" value="${i}" class="mr-2">
                  <span>${option}</span>
              </label>`;
      });
  
      questionBlock += `</div>`;
      quizContainer.innerHTML += questionBlock;
    });
  
    // Tambahkan event listener untuk animasi saat scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.remove("opacity-0", "translate-y-10");
            entry.target.classList.add("opacity-100", "translate-y-0");
          } else {
            entry.target.classList.remove("opacity-100", "translate-y-0");
            entry.target.classList.add("opacity-0", "translate-y-10");
          }
        });
      },
      { threshold: 0.1 }
    );
  
    document.querySelectorAll("#quiz-container div").forEach((el) => {
      observer.observe(el);
    });
  }
  
  function cekJawaban() {
    let score = 0;
  
    quizData.forEach((item, index) => {
      const selected = document.querySelector(
        `input[name="question${index}"]:checked`
      );
  
      // Reset warna sebelum mengecek jawaban
      item.options.forEach((_, i) => {
        const label = document.getElementById(`label-${index}-${i}`);
        label.classList.remove("text-green-600", "text-red-600", "font-bold");
      });
  
      if (selected) {
        const selectedValue = parseInt(selected.value);
        const correctLabel = document.getElementById(
          `label-${index}-${item.correct}`
        );
  
        if (selectedValue === item.correct) {
          score++;
          correctLabel.classList.add("text-green-600", "font-bold");
        } else {
          const selectedLabel = document.getElementById(
            `label-${index}-${selectedValue}`
          );
          selectedLabel.classList.add("text-red-600", "font-bold");
          correctLabel.classList.add("text-green-600", "font-bold");
        }
      }
    });
  
    document.getElementById("hasil").innerText =
      "Skor: " + score + " / " + quizData.length;
  }
  
  // Load quiz saat halaman dimuat
  document.addEventListener("DOMContentLoaded", function () {
    loadQuiz();
});

// --- EVENT LISTENER UNTUK TOMBOL "PERIKSA JAWABAN" ---
document.addEventListener("DOMContentLoaded", function () {
    const checkAnswerBtn = document.getElementById("cekJawaban");

    if (!checkAnswerBtn) {
        console.error("Tombol #cekJawaban tidak ditemukan!");
        return;
    }

    checkAnswerBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        alert("Yakin mau lihat hasilnya?");
        cekJawaban();
    });
});