// Funciones

//Conseguir objeto del Form
function getForm(e) {
  let formAddData = new FormData(e.target);
  let stock = formAddData.get("stock");
  return {
    nombre: formAddData.get("prenda"),
    categoria: formAddData.get("categoria"),
    stock: stock,
    id: prendasArray.length + 1,
  };
}
// Cards para el catalogo
function cardBtn(prenda) {
  $("#catalogo").append(`
 <div class="card card-catalogo" style="width: 18rem;">
   <div class="card-body">
     <h5 class="card-title">${prenda.nombre}</h5>
     <h6 class="card-subtitle mb-2 text-muted">${prenda.categoria}</h6>
     <p class="card-text">Esta prenda esta disponible</p>
     <button id="${prenda.id}" class="btn btn-outline-success addCart">Agregar al carrito</button>
   </div>  
 </div>`);
}
function cardNoBtn(prenda) {
  $("#catalogo").append(`
 <div class="card card-catalogo" style="width: 18rem;">
   <div class="card-body">
     <h5 class="card-title">${prenda.nombre}</h5>
     <h6 class="card-subtitle mb-2 text-muted">${prenda.categoria}</h6>
     <p class="card-text">Esta prenda no esta disponible</p>
   </div>
 </div>`);
}
// Funciones en relacion al usuario
function setUser(user) {
  if (user === false) {
    logIn.style.display = "block";
    addDiv.style.display = "none";
    $("#add").slideUp("fast");
    logOutDiv.style.display = "none";
  } else if (user !== "admin") {
    logIn.style.display = "none";
    logOutDiv.style.display = "block";
    addDiv.style.display = "none";
    $("#add").slideUp("fast");
    logInMessage.innerHTML = `${user}`;
  } else if (user === "admin") {
    logIn.style.display = "none";
    $("#add").slideDown("fast");
    logOutDiv.style.display = "block";
    logInMessage.innerHTML = `${user}`;
  }
}
// Agregar prod. al carro y card de producto al modal
function getProduct(id) {
  return prendasArray.find((prenda) => prenda.id == id);
}
function cardCart(product) {
  $("#cartModal").append(`
  
  <div class="card card-cart" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${product.nombre}</h5>
      <h6 class="card-subtitle mb-2 text-muted">${product.categoria}</h6>
    </div>
  </div>`);
}
function pushCart(product) {
  prendaCart = cartArray.find((prenda) => prenda.id == product.id);
  if (prendaCart) {
    alert("La prenda ya se encuentra en su carrito");
  } else {
    cardCart(product);
    cartArray.push(product);
  }
}
// Finalizar Compra
function finalizarCompra() {
  cardCart = [];
  localStorage.removeItem("arrayCart");
  $(".card-cart").remove();
  $("#cartFull").remove();
  $("#buyBtn").remove();
  $("#removeBtn").remove();
  $("#cartModal").append(`
  <h3> ¡Su compra se realizo con exito!</h3>`);
}
//
//
// Array prendas
class Prenda {
  constructor(id, nombre, categoria, stock) {
    this.id = id;
    this.nombre = nombre;
    this.categoria = categoria;
    this.stock = stock;
  }
}
fetch ('/prendas.json')
.then(response=>response.json())
.then(data=>{ 
  for(prenda of data){
    // prendasArray.push(prenda);
  if (prenda.stock){
    cardBtn(prenda);
  }else{
    cardNoBtn(prenda);
  }
  }
});
let cartJSON = JSON.parse(localStorage.getItem("arrayCart"));
let cartArray = cartJSON ? cartJSON : [];
let prendasArrayJSON = JSON.parse(localStorage.getItem("arrayPrendas"));
let prendasArray = prendasArrayJSON
  ? prendasArrayJSON
  : [];
prendasArray.sort(function (a, b) {
  return b.stock - a.stock;
});
// Login
let formUser = document.getElementById("ingresarForm");
let formAdd = document.getElementById("formPrendas");
let logOutDiv = document.getElementById("logOut");
let logInMessage = document.getElementById("logInMessage");
let addDiv = document.getElementById("add");
let logIn = document.getElementById("logInBtnDiv");
let userLocal = localStorage.getItem("user");
let user = userLocal ? userLocal : false;
console.log('En usuario hay que poner "admin" para agregar prendas.');

setUser(user);
$("#ingresarForm").submit((e) => {
  e.preventDefault();
  let formUserData = new FormData(e.target);
  let user = formUserData.get("user");
  localStorage.setItem("user", user);
  setUser(user);
});
$("#logOutBtn").click(() => {
  user = false;
  logOutDiv.style.display = "none";
  $("#add").slideUp("fast");
  logIn.style.display = "block";
  localStorage.removeItem("user");
  localStorage.removeItem("arrayCart");
});
// Catalogo
for (prenda of prendasArray) {
  if (prenda.stock) cardBtn(prenda);
  else cardNoBtn(prenda);
}
// Agregar prendas
$("#formPrendas").submit((e) => {
  e.preventDefault();
  let prenda = new Prenda(
    getForm(e).id,
    getForm(e).nombre,
    getForm(e).categoria,
    getForm(e).stock
  );
  if (prenda.stock) cardBtn(prenda);
  else cardNoBtn(prenda);
  prendasArray.push(prenda);
  localStorage.setItem("arrayPrendas", JSON.stringify(prendasArray));
  formAdd.reset();
  location.reload();
});
// Carrito
for (product of cartArray) {
  cardCart(product);
}
$("#closeCart").click(()=>{
  location.reload()
})
$(".addCart").click((e) => {
  const productId = e.currentTarget.id;
  console.log(e.currentTarget.id);
  const product = getProduct(productId);
  pushCart(product);
  localStorage.setItem("arrayCart", JSON.stringify(cartArray));
  console.log(cartArray);
});
$("#removeBtn").click((e) => {
  cardCart = [];
  localStorage.removeItem("arrayCart");
  $(".card-cart").remove();
  location.reload();
});
$("#buyBtn").click(()=>{
  finalizarCompra();
})


