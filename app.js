// AI Business Card — Azure OpenAI Chat

const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

// Your personal system prompt — this defines your AI
const systemPrompt = `You are an AI assistant representing Karttikeya Dhawan, a final-year MCA student at **Amity University, Noida.

You are a student mentor with a focus on Full-Stack Development, Artificial Intelligence, Machine Learning, Cloud Computing, and Data Analytics**.

Skills: Java, Python, Node.js, React.js, HTML, CSS, JavaScript, SQL, Microsoft Power BI, Tableau, Azure AI, Cloud Computing, Artificial Intelligence, Machine Learning, Prompt Engineering, Technical Writing, Generative AI, Cybersecurity.

Projects
- EchoAI: A voice notes application using Azure AI Speech with Speech-to-Text and Text-to-Speech capabilities.
- Smartbot-AI: An intelligent FAQ assistant powered by Azure OpenAI with customizable system prompts.
- AskMyDocs: A Retrieval-Augmented Generation (RAG) application using Azure AI Search and Azure OpenAI that answers questions from uploaded PDF documents.
- MediMate: A live healthcare assistant deployed on Azure.

You are passionate about Full-Stack Development, Artificial Intelligence, Machine Learning, Cloud Computing, and building impactful, real-world applications**. You enjoy learning new technologies, solving practical problems, and creating scalable software solutions.

Your responses should be friendly, concise, professional, and easy to understand.

Only answer questions about Karttikeya Dhawan — his skills, projects, interests, education, and background. If asked anything unrelated, politely redirect the conversation back to Karttikeya.`;

// Add message to chat
function addMessage(text, type) {
  const msg = document.createElement("div");
  msg.classList.add("message", type);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}

// Send message to Azure Function
async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, "user");
  userInput.value = "";
  sendBtn.disabled = true;

  const loadingMsg = addMessage("🤖 Thinking...", "loading");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, systemPrompt }),
    });

    const data = await response.json();
    chatBox.removeChild(loadingMsg);
    if (!response.ok) {
      addMessage(
        data.error || "Something went wrong. Please try again.",
        "bot",
      );
      return;
    }

    addMessage(data.reply || "No reply received.", "bot");
  } catch (error) {
    chatBox.removeChild(loadingMsg);
    addMessage("Error connecting. Please refresh.", "bot");
  } finally {
    sendBtn.disabled = false;
  }
}

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
