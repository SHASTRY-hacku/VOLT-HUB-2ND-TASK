// Smooth hero CTA behaviour
function welcomeMessage(){
  alert("Welcome to VOLT-HUB! Happy Shopping 😊");
  document.querySelector("#products").scrollIntoView({behavior:"smooth"});
}

// NAVBAR solid on scroll
const navbar = document.querySelector('.navbar');
function handleNav(){
  if(window.scrollY > 40){
    navbar.classList.remove('transparent'); navbar.classList.add('solid');
  } else {
    navbar.classList.add('transparent'); navbar.classList.remove('solid');
  }
}
window.addEventListener('scroll', handleNav);
handleNav();

// Scroll-trigger animations
const faders = document.querySelectorAll('.fade-in');
const io = new IntersectionObserver((entries, obs)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('appear');
      obs.unobserve(entry.target);
    }
  });
},{threshold:0.2, rootMargin:"0px 0px -80px 0px"});
faders.forEach(el=>io.observe(el));

// CART LOGIC
const cartList = document.getElementById('cartList');
const emptyCartMsg = document.getElementById('emptyCart');
const totalEl = document.getElementById('total');
let total = 0;

function updateTotal(delta){
  total += delta;
  totalEl.textContent = `Total: ₹${total}`;
  if(cartList.children.length === 0){
    emptyCartMsg.classList.remove('hidden');
  }else{
    emptyCartMsg.classList.add('hidden');
  }
}

document.querySelectorAll('.buyBtn').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const card = e.target.closest('.product');
    const name = card.querySelector('h3').textContent;
    const price = parseInt(card.getAttribute('data-price'), 10);

    const li = document.createElement('li');
    li.innerHTML = `<span>${name}</span><span>₹${price}</span>`;
    const remove = document.createElement('button');
    remove.className = 'removeBtn';
    remove.textContent = 'Remove';
    remove.addEventListener('click', ()=>{
      cartList.removeChild(li);
      updateTotal(-price);
    });
    li.appendChild(remove);
    cartList.appendChild(li);
    updateTotal(price);
  });
});

document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  if(total === 0){ alert('Your cart is empty. Add some products first!'); return; }
  alert('✅ Thank you for shopping with VOLT-HUB! Your order has been placed.');
});

// CONTACT FORM VALIDATION
document.querySelector('.contact-form').addEventListener('submit', (e)=>{
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  // Simple email regex pattern
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if(name === ""){
    alert("⚠️ Please enter your name.");
    return;
  }

  if(email === "" || !emailPattern.test(email)){
    alert("⚠️ Please enter a valid email address.");
    return;
  }

  if(message === ""){
    alert("⚠️ Please enter your message.");
    return;
  }

  // If all checks pass
  alert("📩 Thank you! Your message has been sent.");
  e.target.reset();
});

// TO-DO LIST LOGIC with localStorage + completed tasks + counter
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const taskCounter = document.getElementById('taskCounter');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();

// Add new task
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const taskText = todoInput.value.trim();
  if (taskText === "") return;

  tasks.push({ text: taskText, completed: false });
  localStorage.setItem('tasks', JSON.stringify(tasks));

  renderTasks();
  todoInput.value = "";
});

// Render tasks + counter
function renderTasks() {
  todoList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add('todo-completed');
    }

    // Toggle complete on click
    span.addEventListener('click', () => {
      tasks[index].completed = !tasks[index].completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    });

    const removeBtn = document.createElement('button');
    removeBtn.className = 'todo-remove';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(removeBtn);
    todoList.appendChild(li);
  });

  // Update counter
  const activeCount = tasks.filter(task => !task.completed).length;
  taskCounter.textContent = `${activeCount} task${activeCount !== 1 ? "s" : ""} left`;
}

// CLEAR ALL COMPLETED
document.getElementById('clearCompleted').addEventListener('click', () => {
  tasks = tasks.filter(task => !task.completed);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
});

// IMAGE GALLERY LOGIC with URL + File Upload
const galleryForm = document.getElementById('galleryForm');
const imageUrlInput = document.getElementById('imageUrl');
const imageFileInput = document.getElementById('imageFile');
const galleryGrid = document.getElementById('galleryGrid');

// Load from localStorage
let images = JSON.parse(localStorage.getItem('images')) || [];
renderGallery();

galleryForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const url = imageUrlInput.value.trim();
  const file = imageFileInput.files[0];

  if (url) {
    // Add image from URL
    images.push(url);
    localStorage.setItem('images', JSON.stringify(images));
    renderGallery();
    imageUrlInput.value = "";
  } else if (file) {
    // Add image from file upload
    const reader = new FileReader();
    reader.onload = function (event) {
      images.push(event.target.result); // Base64 encoded image
      localStorage.setItem('images', JSON.stringify(images));
      renderGallery();
    };
    reader.readAsDataURL(file);
    imageFileInput.value = "";
  } else {
    alert("⚠️ Please enter an image URL or upload a file.");
  }
});

// Render images
function renderGallery() {
  galleryGrid.innerHTML = "";
  images.forEach((src, index) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = src;
    img.alt = "Gallery Image";

    const removeBtn = document.createElement('button');
    removeBtn.className = 'gallery-remove';
    removeBtn.textContent = '×';
    removeBtn.addEventListener('click', () => {
      images.splice(index, 1);
      localStorage.setItem('images', JSON.stringify(images));
      renderGallery();
    });

    div.appendChild(img);
    div.appendChild(removeBtn);
    galleryGrid.appendChild(div);
  });
}
